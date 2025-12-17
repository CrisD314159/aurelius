import { useState, useRef, useEffect } from "react"
import GreenRecordingButton from "../button/GreenRecordingButton"
import MenuComponent from "../menu/MenuComponent"
import toast from "react-hot-toast"

export default function WebsocketConnectionPCM() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [botTrascription, setBotTrascription] = useState<string>('')

  const audioQueueRef = useRef<ArrayBuffer[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const playbackContextRef = useRef<AudioContext | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)
  const inputRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const socket = useRef<WebSocket | null>(null)


  const isPlayingRef = useRef(false)
  const ttsFinishedRef = useRef(false)

  const startRecording = async () => {
    try {
      if (!socket.current || socket.current.readyState !== WebSocket.OPEN) {
        console.error("Socket not connected")
        return
      }
      ttsFinishedRef.current = false;

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
        if (!socket.current || socket.current.readyState !== WebSocket.OPEN) return

        const inputData = e.inputBuffer.getChannelData(0)
        // Convertir Float32 a Int16 (PCM)
        const buffer = new ArrayBuffer(inputData.length * 2)
        const view = new DataView(buffer)
        
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]))
          view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
        }
        socket.current.send(buffer)
      }

      source.connect(processor)
      processor.connect(audioCtx.destination)

      setIsRecording(true)
      console.log("Grabación iniciada")

    } catch (error) {
      console.error("Error starting recording:", error)
    }
  }

  const stopRecording = () => {
    setIsRecording(false)

    if (inputRef.current) inputRef.current.disconnect()
    if (processorRef.current) {
      processorRef.current.disconnect()
      processorRef.current.onaudioprocess = null
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null;
    }
  }

  const playNextChunk = () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false
      setIsPlaying(false)
      
      if (ttsFinishedRef.current) {
        console.log("Recording again")
        ttsFinishedRef.current = false 
        startRecording() 
      }
      return
    }

    // Evitar concurrencia si ya se está ejecutando (aunque la lógica recursiva lo maneja)
    if (isPlayingRef.current && audioQueueRef.current.length === 0) return 

    isPlayingRef.current = true
    setIsPlaying(true)
    
    if (!playbackContextRef.current || playbackContextRef.current.state === 'closed') {
      playbackContextRef.current = new AudioContext({ sampleRate: 24000 })
    }
    
    const chunk = audioQueueRef.current.shift()
    if (!chunk) return

    const dataView = new DataView(chunk)
    const numSamples = chunk.byteLength / 2
    
    const audioData = new Float32Array(numSamples)
    for (let i = 0; i < numSamples; i++) {
      const int16Value = dataView.getInt16(i * 2, true)
      audioData[i] = int16Value / 32768.0
    }

    const audioBuffer = playbackContextRef.current.createBuffer(1, numSamples, 24000)
    audioBuffer.getChannelData(0).set(audioData)

    const source = playbackContextRef.current.createBufferSource()
    source.buffer = audioBuffer
    source.connect(playbackContextRef.current.destination)
    
    source.onended = () => {
      playNextChunk()
    }

    source.start(0)
  }


  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:8000/ws/call")
    socket.current = websocket

    websocket.onopen = () => console.log("Backend connected")
    websocket.onclose = () => console.log("Socket closed")
    websocket.onerror = (e) => console.error("Connection error:", e)

    websocket.onmessage = async (e) => {
      if (typeof e.data === "string") {
        if (e.data === "silence") {
          stopRecording()
        } else if (e.data === "TTS_END") {
          console.log("Señal TTS_END recibida. Esperando a que termine el audio...")
          ttsFinishedRef.current = true
          
          if (!isPlayingRef.current && audioQueueRef.current.length === 0) {
             startRecording()
             ttsFinishedRef.current = false
          }
        }else{
          const data = JSON.parse(e.data)
          if(data.type === "error") {
            toast.error(data.message)
          }else if(data.type === "answer"){
            const new_out = botTrascription + " " + data.message
            setBotTrascription(new_out)
          }

        }
      } else {
        let buffer
        if (e.data instanceof Blob) {
          buffer = await e.data.arrayBuffer()
        } else if (e.data instanceof ArrayBuffer) {
          buffer = e.data
        }
        
        if (buffer) {
          audioQueueRef.current.push(buffer)
          if (!isPlayingRef.current) {
            playNextChunk()
          }
        }
      }
    }

    return () => {
      websocket.close()
      stopRecording()
      if (playbackContextRef.current) {
        playbackContextRef.current.close()
      }
    }
  }, [setBotTrascription])

  return (
    <div className="w-full items-center h-full flex flex-col gap-4 p-4 border rounded relative">
      <MenuComponent/>
      <div className="w-full relative top-[25%] h-28">
        <p>
          {botTrascription}
        </p>
      </div>
      <div className="flex gap-2 absolute top-[55%]">
          <GreenRecordingButton 
            className="w-64 h-64"
            isRecording={isRecording}
            isPlaying={isPlaying} 
            onClick={(()=>{
              isRecording ?
              stopRecording()
              :
              startRecording()
            })
              
            }
            color={isRecording ? "#ef4444" : "#22c55e"} // Switches to Red when recording, Green when idle
          />
      </div>
      
    </div>
  )
}