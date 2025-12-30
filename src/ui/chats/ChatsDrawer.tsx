import {useEffect, useState} from "react";
import ViewSidebarRoundedIcon from '@mui/icons-material/ViewSidebarRounded';
import {motion} from "framer-motion";
import {ChatMessages} from "../../lib/definitions";
import ChangeConfigModal from "../modals/ChangeConfigModal";
import {useQuery} from "@tanstack/react-query";
import {getChats} from "../../lib/http/http_queries";
import toast from "react-hot-toast";
import LoadingComponent from "../loading/LoadingComponent";
import ChatCardComponent from "./ChatCardComponent";




interface ChatsDrawerProps{
    setChat: (chat:ChatMessages) => void
    refetchChats:boolean
    setRefetch: (value:boolean) => void
}

export default function ChatsDrawer({setChat, refetchChats, setRefetch}:ChatsDrawerProps) {
    const [open, setOpen] = useState(false);

    const {isPending, error, isSuccess, data, refetch} = useQuery({queryKey:['chats'], queryFn: getChats})

    useEffect(()=>{
        if(refetchChats){
            refetch()
            setRefetch(false)
        }

    }, [refetch])

    useEffect(()=>{
        if(error) toast.error(error.message)
    }, [])

    return (
        <>
            <motion.button onClick={()=> setOpen(true)}
                           className={'w-11 h-11 dark:text-[#faefe1] flex items-center justify-center rounded-full border p-5 border-white/20 backdrop-blur-md transition-all'}
                           whileHover={{ scale: 1.03 }}
                           whileTap={{ scale: 0.94 }}
                           transition={{
                               type: "spring",
                               stiffness: 900,
                               damping: 40,
                               mass: 0.4
                           }}>
                    <ViewSidebarRoundedIcon/>
            </motion.button>

            {open &&
                <motion.div className='fixed inset-0 w-screen h-screen flex items-center justify-start z-20'
                            onClick={()=> setOpen(false)}
                            initial={{opacity:0}}
                            animate={{opacity:1}} >

                    <motion.div className='h-[95%] w-[200px] py-7 px-5 z-30 flex flex-col shadow-2xl
                     backdrop-blur-lg rounded-3xl bg-[#faefe1]/10 dark:bg-zinc-900/30'
                                onClick={(e)=> e.stopPropagation()}
                                initial={{opacity:0, x:-100}} animate={{opacity:1, x:10}} exit={{opacity:0, x:-100 }} >


                        <ChangeConfigModal/>

                        <div className='w-full h-full border-md border-t-gray-800 dark:border-t-gray-600 overflow-y-scroll no-scrollbar'>
                            {isPending && <LoadingComponent/>}
                            {isSuccess && data.message.length > 0? data.message.map(
                                  (chat) =>
                                      <ChatCardComponent id={chat.chat_id}
                                                         key={chat.chat_id}
                                                         title={chat.title}
                                                         date_created={chat.date_created}
                                                         setChat={setChat}/> )
                                :
                                <p className='text-md text-gray-950 dark:text-[#faefe1]'>No chats to show</p>

                            }
                        </div>
                    </motion.div>


                </motion.div>
            }
        </>

    )

}