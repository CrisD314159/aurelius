import {motion} from "framer-motion";
import {ChatMessages} from "../../lib/definitions";
import {useMutation} from "@tanstack/react-query";
import toast from "react-hot-toast";
import {getChatMessages} from "../../lib/http/http_queries";

interface ChatCardComponent{
    id:number
    title: string
    date_created: string
    setChat: (chat:ChatMessages) => void

}

export default function ChatCardComponent({id, title, date_created, setChat}:ChatCardComponent){


    const {isPending, mutate} = useMutation({
        mutationKey:['chatMessages'],
        mutationFn:getChatMessages,
        onError: ((error)=> {
            toast.error(error.message)
            console.error(error)
        }),
        onSuccess: ((data)=>{
            setChat(data.message)
        })
    })

    const fetchChatMessages = (chat_id:number)=> {
        console.log("id", chat_id)
        mutate(chat_id)
    }

    return (
        <motion.button className={'w-full h-10 px-3 truncate text-ellipsis rounded-md my-1 bg-[#faefe2]/60 dark:bg-gray-900/60'} onClick={()=> fetchChatMessages(id)} disabled={isPending}>
            <p className='text-sm text-gray-950 dark:text-[#faefe1]'>{title}</p>
        </motion.button>
    )
}