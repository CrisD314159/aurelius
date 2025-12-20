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
        onError: ((error)=> toast.error(error.message)),
        onSuccess: ((data)=>{
            setChat(data.message)
        })
    })

    const fetchChatMessages = ()=> {
        mutate(id)
    }

    return (
        <motion.button onClick={()=> fetchChatMessages()} disabled={isPending}>
            <p className='text-lg text-gray-950 dark:bg-[#faefe1]'>{title}</p>
        </motion.button>
    )
}