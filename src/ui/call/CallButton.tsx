import { useState, useRef, useEffect } from "react"
import toast from "react-hot-toast"

export default function CallButton() {
  const [isRecording, setIsRecording] = useState(false)
  const [recorderUrl, setRecordedUrl] = useState('')
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const mediaStream = useRef<MediaStream>(null)
  const mediaRecorder = useRef<MediaRecorder>(null)
  const chunks = useRef<Blob[]>([])
  
  useEffect(()=>{
    const websocket = new WebSocket("ws://localhost:8000/ws/call")

    setSocket(websocket)

    websocket.onopen = () => {
      console.log("Backend connected")
    }
    websocket.onerror = (e) => {
      toast.error("An error occurred while connecting to backend")
      console.log(e.target);
    }

    websocket.onclose = (e) =>{
      toast("Backend disconnected")
    }

    websocket.onmessage = (e) => {
      // Handle both text (control messages) and binary (future use)
      if (typeof e.data === "string") {
        if (e.data === "silence") {
          console.log("Silence detected by backend")
          stopRecording()
        } else {
          try {
            const data = JSON.parse(e.data)
            
            if (data.type === "response") {
              console.log("Transcription:", data.transcription)
              console.log("Answer:", data.answer)
              console.log(data.transcription)
            }
          } catch (err) {
            console.log("Non-JSON message:", e.data)
          }
        }
      }
    }
    return () => socket.close();

  }, [])

  async function webmToPCM(blob: Blob): Promise<Int16Array> {
  const arrayBuffer = await blob.arrayBuffer();

  const audioCtx = new AudioContext({ sampleRate: 16000 }); // Opcional: forzar sample rate
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

  const raw = audioBuffer.getChannelData(0); // solo canal izquierdo (mono)

  // Convertir float32 → int16 PCM
  const pcm = new Int16Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    let s = raw[i];
    s = Math.max(-1, Math.min(1, s));
    pcm[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }

  return pcm;
}


const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        } 
      })
      
      mediaStream.current = stream
      
      // Use webm with opus codec (best compression + quality)
      const options = { mimeType: 'audio/webm;codecs=opus' }
      mediaRecorder.current = new MediaRecorder(stream, options)
      
      mediaRecorder.current.ondataavailable = async (e: BlobEvent) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data)
          
          // Send chunk to backend for silence detection
          if (socket && socket.readyState === WebSocket.OPEN) {
            // Convert blob to base64 for JSON transmission
            const arrayBuffer = await e.data.arrayBuffer()
            
            // Create a message with type prefix (1 byte) + audio data
            // Type: 0x01 = audio_chunk, 0x02 = transcribe
            const message = new Uint8Array(1 + arrayBuffer.byteLength)
            message[0] = 0x01 // audio_chunk type
            message.set(new Uint8Array(arrayBuffer), 1)
            
            socket.send(message.buffer)
          }
        }
      }
      
      mediaRecorder.current.onstop = async () => {
        const recordedBlob = new Blob(chunks.current, { type: "audio/webm" })
        const url = URL.createObjectURL(recordedBlob)
        setRecordedUrl(url)
        
        // Send complete audio for transcription
        if (socket && socket.readyState === WebSocket.OPEN) {
          const arrayBuffer = await recordedBlob.arrayBuffer()
          
          // Type 0x02 = transcribe
          const message = new Uint8Array(1 + arrayBuffer.byteLength)
          message[0] = 0x02 // transcribe type
          message.set(new Uint8Array(arrayBuffer), 1)
          
          socket.send(message.buffer)
        }
        
        chunks.current = []
      }
      
      // Capture 500ms chunks
      mediaRecorder.current.start(500)
      setIsRecording(true)
    } catch (error) {
      console.error("Error starting recording:", error)
    }
  }

  const stopRecording = () => {
    setIsRecording(false)
    
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop()
    }
    
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => track.stop())
      mediaStream.current = null
    }
  }

  return (
    <div>

      {isRecording ? <button onClick={stopRecording}>Parar</button>
      :
      <button onClick={startRecording}>Grabar</button>
      }

      {recorderUrl && <audio controls src={recorderUrl}></audio>}

    </div>
  )
}