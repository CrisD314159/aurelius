import { useState, useRef, useEffect } from "react"

export default function WebsocketConnectionPCM() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const audioQueueRef = useRef([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const playbackContextRef = useRef<AudioContext | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)
  const inputRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const isPlayingRef = useRef(false)
  const socket = useRef<WebSocket | null>(null)



  const startRecording = async () => {
    try {
      if (!socket || socket.current.readyState !== WebSocket.OPEN) {
        console.error("Socket not connected", socket.current.readyState)
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
        if (!socket || socket.current.readyState !== WebSocket.OPEN) return

        const inputData = e.inputBuffer.getChannelData(0)
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
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close()
    }
  }

  const playNextChunk = () => {
    if (audioQueueRef.current.length === 0 || isPlayingRef.current) {
      return
    }

    isPlayingRef.current = true
    setIsPlaying(true)
    
    // Initialize playback context if needed
    if (!playbackContextRef.current || playbackContextRef.current.state === 'closed') {
      playbackContextRef.current = new AudioContext({ sampleRate: 24000 })
    }
    
    const chunk = audioQueueRef.current.shift()
    const dataView = new DataView(chunk)
    const numSamples = chunk.byteLength / 2
    
    const audioData = new Float32Array(numSamples)
    for (let i = 0; i < numSamples; i++) {
      const int16Value = dataView.getInt16(i * 2, true)
      audioData[i] = int16Value / 32768.0
    }

    const audioBuffer = playbackContextRef.current.createBuffer(
      1,
      numSamples,
      24000  // Match the sample rate of the incoming audio
    )

    audioBuffer.getChannelData(0).set(audioData)

    const source = playbackContextRef.current.createBufferSource()
    source.buffer = audioBuffer
    source.connect(playbackContextRef.current.destination)
    
    source.start(0)

    source.onended = () => {
      isPlayingRef.current = false
      setIsPlaying(false)
      playNextChunk()
    }
  }

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:8000/ws/call")
    socket.current = websocket

    websocket.onopen = () => console.log("Backend connected")

    websocket.onclose = () => console.log("Socket closed")
    
    websocket.onerror = (e) => {
      console.error("Connection error:", e)
    }

    websocket.onmessage = async (e) => {
      if (typeof e.data === "string") {
        if (e.data === "silence") {
          stopRecording()
        }
      } else {
        console.log("Audio chunk received")
        
        let buffer
        if (e.data instanceof Blob) {
          buffer = await e.data.arrayBuffer()
        } else if (e.data instanceof ArrayBuffer) {
          buffer = e.data
        }
        
        if (buffer) {
          audioQueueRef.current.push(buffer)
          playNextChunk()
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
  }, [])

  useEffect(()=>{
    if(!isRecording && !isPlaying){
      console.log("trying to rerun")
      startRecording()
    }
  },[isPlaying, isRecording])

  return (
    <div className="flex flex-col gap-4 p-4">
      
      {isRecording ? (
        <button 
          onClick={stopRecording}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
        >
          Stop Recording
        </button>
      ) : (
        <button 
          onClick={startRecording}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          Start Recording
        </button>
      )}
      
      {isPlaying && (
        <div className="text-sm text-green-600">
          Playing audio... (Queue: {audioQueueRef.current.length})
        </div>
      )}
    </div>
  )
}