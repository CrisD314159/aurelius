import {useCallback, useState} from "react";
import {ChatMessages, MessageContent} from "../../lib/definitions";
import ChatInputComponent from "../../ui/inputs/ChatInputComponent";
import MessagesContainer from "../../ui/containers/MessagesContainer";
import ChatsDrawer from "../../ui/chats/ChatsDrawer";
import NewChatButton from "../../ui/button/NewChatButton";
import {useMutation} from "@tanstack/react-query";
import {getChatMessages} from "../../lib/http/http_queries";
import toast from "react-hot-toast";

export default function ChatPage() {
    const [messages, setMessages] = useState<MessageContent[]>([]);
    const [chatId, setChatId] = useState(0)
    const [waiting, setWaiting] = useState<boolean>(false)
    const [refetchChats, setRefetchChats] = useState<boolean>(false)

    const {mutate} = useMutation({
        mutationKey:['chatMessages'],
        mutationFn:getChatMessages,
        onError: ((error)=> {
            toast.error(error.message)
            console.error(error)
        }),
        onSuccess: ((data)=>{
            setChatId(data.message.chat_id)
            setMessages(data.message.messages)
        })
    })

    const handleSetMessages = (chatMessages: ChatMessages) =>{
        if(chatMessages.chat_id != 0){
            setChatId(chatMessages.chat_id)
            setMessages(chatMessages.messages)
        }
    }

    const handleSetChatId = useCallback((id:number)=>{
        console.log("received id", id)
        mutate(id)
        setRefetchChats(true)
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

        <div className={'fixed left-3 top-3 flex items-center gap-3 z-10'}>
            <ChatsDrawer setChat={handleSetMessages} refetchChats={refetchChats} setRefetch={setRefetchChats} />
            <NewChatButton resetChats={setMessages} setChatId={setChatId} chatId={chatId}/>
        </div>



        <MessagesContainer messages={messages} waiting={waiting}/>


        <div className={'absolute bottom-0 w-full pb-5 flex items-center justify-center'}>
            <div className={'w-full h-full'}>
                <ChatInputComponent setChatId={handleSetChatId}
                                    chatId={chatId}
                                    addNewMessage={addNewMessage}
                                    setPromptSent={setNewUserPromptSent}
                                    waiting={waiting}
                                    setWaiting={setWaiting}
                />
            </div>

        </div>
    </div>
  )
}