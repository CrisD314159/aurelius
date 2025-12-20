import WebsocketConnectionPCM from "../../ui/call/WebsocketConnectionPCM";
import MenuComponent from "../../ui/menu/MenuComponent";
import {useState} from "react";
import {ChatMessages, MessageContent} from "../../lib/definitions";
import ChatInputComponent from "../../ui/inputs/ChatInputComponent";

export default function ChatPage() {
    const [messages, setMessages] = useState<MessageContent[]>([]);
    const [chatId, setChatId] = useState(0)

    const handleSetMessages = (chatMessages: ChatMessages) =>{
        if(chatMessages.chat_id != 0){
            setChatId(chatMessages.chat_id)
            setMessages(chatMessages.messages)
        }
    }

    const addNewMessage = (message: MessageContent) =>{
        setMessages([...messages, message])
    }

  return (
    <div className="w-screen h-screen flex flex-col relative items-center">
        <MenuComponent setChat={handleSetMessages}/>

        <div>
            Chat
        </div>

        <div className={'absolute bottom-12 w-full h-11 flex items-center justify-center'}>
            <div className={'w-[80%] h-full'}>
                <ChatInputComponent setChatId={setChatId} chatId={chatId} addNewMessage={addNewMessage}/>
            </div>

        </div>
    </div>
  )
}