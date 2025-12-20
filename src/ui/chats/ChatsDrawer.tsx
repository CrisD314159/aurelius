import {IconButton} from "@mui/joy";
import {useEffect, useState} from "react";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
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

}

export default function ChatsDrawer({setChat}:ChatsDrawerProps) {
    const [open, setOpen] = useState(false);

    const {isPending, error, isSuccess, data} = useQuery({queryKey:['chats'], queryFn: getChats})

    useEffect(()=>{
        if(error) toast.error(error.message)
    })

    return (
        <>
            <IconButton onClick={()=> setOpen(true)}>
                <MenuOpenIcon/>
            </IconButton>

            {open &&
                <motion.div className='fixed inset-0 w-screen h-screen  flex items-center justify-start z-10'
                            onClick={()=> setOpen(false)}
                            initial={{opacity:0}}
                            animate={{opacity:1}} >

                    <motion.div className='h-[95%] w-[200px] py-7 px-5 z-20 flex flex-col shadow-2xl
                     backdrop-blur-md rounded-3xl bg-[#faefe1]/10 dark:bg-zinc-900/30  '
                                onClick={(e)=> e.stopPropagation()}
                                initial={{opacity:0, x:-100}} animate={{opacity:1, x:10}} exit={{opacity:0, x:-100 }} >


                        <ChangeConfigModal/>

                        <div className='w-full h-full pt-3 border-t border-t-gray-800 dark:border-t-gray-600'>
                            {isPending && <LoadingComponent/>}
                            {isSuccess && data.message.length > 0? data.message.map(
                                  (chat) =>
                                      <ChatCardComponent id={chat.id}
                                                         key={chat.id}
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