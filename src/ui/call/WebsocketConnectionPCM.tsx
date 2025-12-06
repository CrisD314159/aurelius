import { useState, useRef, useEffect } from "react"
import toast from "react-hot-toast"


export default function WebsocketConnectionPCM() {
  const [isRecording, setIsRecording] = useState(false)
  const [socket, setSocket] = useState<WebSocket | null>(null)
  
  const audioContextRef = useRef<AudioContext | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)
  const inputRef = useRef<MediaStreamAudioSourceNode | null>(null)

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:8000/ws/call")
    setSocket(websocket)

    websocket.onopen = () => console.log("Backend connected")
    
    websocket.onerror = (e) => {
      toast.error("Connection error")
      console.error(e)
    }

    websocket.onmessage = (e) => {
      if (typeof e.data === "string") {
        if (e.data === "silence") {
          stopRecording()
        } else {
          try {
            const data = JSON.parse(e.data)
            if (data.type === "response") {
              console.log("Transcript:", data.transcription)
              console.log("AI Answer:", data.answer)
              toast.success("Response received!")
            }
          } catch (err) {
            console.log("Message:", e.data)
          }
        }
      }
    }

    return () => {
      websocket.close()
      stopRecording()
    }
  }, [])

  const startRecording = async () => {
    try {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        toast.error("Socket not connected")
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000 
        } 
      })
      streamRef.current = stream

      const audioCtx = new AudioContext({ sampleRate: 16000 })
      audioContextRef.current = audioCtx

      const source = audioCtx.createMediaStreamSource(stream)
      inputRef.current = source

      const processor = audioCtx.createScriptProcessor(4096, 1, 1)
      processorRef.current = processor

      processor.onaudioprocess = (e) => {
        if (!socket || socket.readyState !== WebSocket.OPEN) return

        const inputData = e.inputBuffer.getChannelData(0) // Float32 (-1 to 1)
        
        const buffer = new ArrayBuffer(inputData.length * 2)
        const view = new DataView(buffer)
        
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]))
          view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true) // true = little-endian
        }
        socket.send(buffer)
      }

      source.connect(processor)
      processor.connect(audioCtx.destination) // Necessary for the processor to run

      setIsRecording(true)

    } catch (error) {
      console.error("Error starting recording:", error)
      toast.error("Could not access microphone")
    }
  }

  const stopRecording = () => {
    setIsRecording(false)

    if (inputRef.current) inputRef.current.disconnect()
    if (processorRef.current) {
      processorRef.current.disconnect()
      processorRef.current.onaudioprocess = null
    }
    if (audioContextRef.current) audioContextRef.current.close()
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {isRecording ? (
        <button 
          onClick={stopRecording}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Stop Recording
        </button>
      ) : (
        <button 
          onClick={startRecording}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Start Recording
        </button>
      )}
    </div>
  )
}