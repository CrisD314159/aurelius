
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import {MessageContent} from "../../lib/definitions";
import {motion} from "framer-motion";

interface NewChatButton{
    resetChats : (messages:MessageContent[]) => void
    setChatId : (id:number) => void
    chatId:number
}

export default function NewChatButton({resetChats, setChatId, chatId}:NewChatButton){

    const handleNewChat = () =>{
        if(chatId === 0) return
        setChatId(0)
        resetChats([])
    }

    return (
        <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.94 }}
            transition={{
                type: "spring",
                stiffness: 900,
                damping: 40,
                mass: 0.4
            }}
            className={`w-11 h-11 ${chatId === 0 ? 'shadow text-neutral-600 dark:text-gray-500':'dark:text-[#faefe1]'} flex items-center justify-center rounded-full border p-5 border-white/20 backdrop-blur-md transition-all`}
                onClick={handleNewChat}
                disabled={chatId === 0}>
            <AddCircleRoundedIcon/>
        </motion.button>
    )

}