import WebsocketConnectionPCM from "../../ui/call/WebsocketConnectionPCM";
import {useCallback, useState} from "react";
import {ChatMessages, MessageContent} from "../../lib/definitions";
import ChatInputComponent from "../../ui/inputs/ChatInputComponent";
import MessagesContainer from "../../ui/containers/MessagesContainer";
import ChatsDrawer from "../../ui/chats/ChatsDrawer";

export default function ChatPage() {
    const [messages, setMessages] = useState<MessageContent[]>([]);
    const [chatId, setChatId] = useState(0)
    const [waiting, setWaiting] = useState<boolean>(false)

    const handleSetMessages = (chatMessages: ChatMessages) =>{
        if(chatMessages.chat_id != 0){
            setChatId(chatMessages.chat_id)
            setMessages(chatMessages.messages)
        }
    }

    const handleSetChatId = useCallback((id:number)=>{
        setChatId(id)
    }, [])

    const setNewUserPromptSent = useCallback((prompt:string) =>{
        setMessages((prevMessages) =>
            [...prevMessages, {chat_id: chatId, id: -1 , model_message: "", user_message:prompt}])
    }, [])

    const addNewMessage = useCallback((message: MessageContent) =>{
        setMessages((prev_messages) =>
            [...prev_messages.filter((message) => message.id != -1), message])
    },[])

  return (
    <div className="w-screen h-screen flex flex-col relative items-center">

        <ChatsDrawer setChat={handleSetMessages}/>



        <MessagesContainer messages={messages} waiting={waiting}/>


        <div className={'absolute bottom-0 w-full pb-5 flex items-center justify-center'}>
            <div className={'w-[80%] h-full'}>
                <ChatInputComponent setChatId={handleSetChatId}
                                    chatId={chatId}
                                    addNewMessage={addNewMessage}
                                    setPromptSent={setNewUserPromptSent}
                                    waiting={waiting}
                                    setWaiting={setWaiting}
                />
            </div>
            <div className={'w-[20%] h-full'}>
                {/*

                 <WebsocketConnectionPCM setChatId={handleSetChatId} chatId={chatId} addNewMessage={addNewMessage}/>

                */}
            </div>

        </div>
    </div>
  )
}