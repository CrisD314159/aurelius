
import {motion} from "framer-motion";
import Markdown from "react-markdown";
import rehypePrism from 'rehype-prism-plus';


interface LlmMessageContainerProps{
    message: string
}

export default  function LlmMessageContainer ({message}: LlmMessageContainerProps) {
    return (
        <motion.div initial={{opacity: 0}}
                    animate={{opacity:1}}
                    transition={{ ease: "easeOut", duration: 2 }}
                    className={'w-full rounded-md text-gray-950  px-1.5 py-0.5 dark:text-[#faefe1]'}>
            <Markdown rehypePlugins={[rehypePrism]}>
                {message}
            </Markdown>
        </motion.div>
    )
}