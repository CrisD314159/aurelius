
import {motion} from "framer-motion";



interface UserMessageContainerProps{
    message: string
}

export default  function UserMessageCard ({message}: UserMessageContainerProps) {
    return (
        <motion.div initial={{opacity: 0}}
                    animate={{opacity:1}}
                    className={'w-[80%] rounded-md bg-green-600 dark:bg-green-900 px-1.5 py-0.5 my-3.5'}>
            <p className={'text-gray-950  dark:text-[#faefe1]'}>
                {message}
            </p>

        </motion.div>
    )
}