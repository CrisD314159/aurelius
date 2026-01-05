import {motion} from "framer-motion";
import {ChatContent, ChatMessages} from "../../lib/definitions";
import {QueryObserverResult, RefetchOptions, useMutation} from "@tanstack/react-query";
import toast from "react-hot-toast";
import {getChatMessages} from "../../lib/http/http_queries";
import DeleteChatButton from "../buttons/DeleteChatButton";

interface ChatCardComponent{
    id:number
    title: string
    date_created: string
    setChat: (chat:ChatMessages) => void
    refetchChats:  (options?: RefetchOptions) => Promise<QueryObserverResult<{
        success: boolean
        message: ChatContent[]
    }, Error>>

}

export default function ChatCardComponent({id, title ,refetchChats, setChat}:ChatCardComponent){


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

    const handleRefetch = () =>{
        refetchChats()
    }

    const fetchChatMessages = (chat_id:number)=> {
        mutate(chat_id)
    }

    return (
        <motion.div
            whileHover={{ scale: 1.02, borderRadius: '7px' }}
            whileTap={{ scale: 0.94 }}
            transition={{
                type: "spring",
                stiffness: 900,
                damping: 40,
                mass: 0.5
            }}
            className={'shadow w-full h-10 px-3 flex justify-between items-center rounded-md my-1 bg-[#faefe2]/60 dark:bg-neutral-950/50'} >
            <button className={'w-[90%] h-full'} onClick={()=> fetchChatMessages(id)} disabled={isPending}>
                <p className='text-sm truncate text-ellipsis text-gray-950 dark:text-[#faefe1]'>{title}</p>
            </button>
            <div className={'h-full w-[10%] flex items-center justify-center'}>
                <DeleteChatButton chatId={id} handleRefetch={handleRefetch}/>
            </div>
        </motion.div>
    )
}