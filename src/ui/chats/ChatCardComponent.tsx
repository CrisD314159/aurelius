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
        mutate(chat_id)
    }

    return (
        <motion.button
            whileHover={{ scale: 1.02, borderRadius: '7px' }}
            whileTap={{ scale: 0.94 }}
            transition={{
                type: "spring",
                stiffness: 900,
                damping: 40,
                mass: 0.5
            }}
            className={'w-[95%] h-10 px-3 truncate text-ellipsis rounded-md my-1 bg-[#faefe2]/60 dark:bg-neutral-950/50'} onClick={()=> fetchChatMessages(id)} disabled={isPending}>
            <p className='text-sm text-gray-950 dark:text-[#faefe1]'>{title}</p>

        </motion.button>
    )
}