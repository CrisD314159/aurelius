import { useState, useRef, useEffect } from "react"
import toast from "react-hot-toast"
import {MessageContent} from "../../lib/definitions";
import SendIcon from '@mui/icons-material/Send';

interface ChatInputComponentProps{
    setChatId: (chatId: number) => void
    chatId: number
    addNewMessage: (message: MessageContent) => void
}

export default function ChatInputComponent({chatId, setChatId, addNewMessage}: ChatInputComponentProps) {

    const [prompt, setPrompt] = useState<string>('')
    const socket = useRef<WebSocket | null>(null)

    useEffect(() => {
        const websocket = new WebSocket(`ws://localhost:8000/ws/text/${chatId}`)
        socket.current = websocket

        websocket.onopen = () => console.log("Backend connected")
        websocket.onclose = () => console.log("Socket closed")
        websocket.onerror = (e) => console.error("Connection error:", e)

        websocket.onmessage = async (e) => {
            if (typeof e.data === "string") {

                const data = JSON.parse(e.data)
                if(data.type === "error") {
                    toast.error(data.message)
                }else if(data.type === "answer"){
                    setChatId(data.chat_id)
                    addNewMessage(data.message)
                }

            }
        }

        return () => {
            websocket.close()
        }
    }, [addNewMessage, setChatId])

    return (
        <div className="w-full items-center justify-center h-full flex gap-2 py-2 px-5">
            <input
                className="w-[90%] rounded-3xl border border-white/20 bg-white/50 dark:bg-gray-900/40 backdrop-blur-md px-4 py-2 text-gray-950 dark:text-[#faefa1] placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-white/30 transition-all"
                placeholder="Message Aurelius"
                onChange={(e) => setPrompt(e.target.value)}
            />
            <button
                className={`w-12 h-12 flex items-center justify-center rounded-full border border-white/20 backdrop-blur-md transition-all ${
                    prompt === ''
                        ? 'bg-white/5 text-gray-400'
                        : 'bg-green-600/80 text-white hover:bg-green-500 shadow-lg'
                }`}
                disabled={prompt === ''}
            >
                <SendIcon />
            </button>
        </div>
    )
}