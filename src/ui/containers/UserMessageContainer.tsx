
import {motion} from "framer-motion";



interface UserMessageContainerProps{
    message: string
}

export default  function UserMessageContainer ({message}: UserMessageContainerProps) {
    return (
        <motion.div initial={{opacity: 0, y:-100}}
                    animate={{opacity:1, y:0}}
                    className={'w-[80%] rounded-l bg-green-600 dark:bg-green-900'}>
            <p className={'text-gray-950  dark:text-[#faefe1]'}>
                {message}
            </p>

        </motion.div>
    )
}