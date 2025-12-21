
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
                    className={'w-full rounded-l bg-[#faefe2] text-gray-950 dark:bg-gray-900 dark:text-[#faefe1]'}>
            <Markdown rehypePlugins={[rehypePrism]}>
                {message}
            </Markdown>
        </motion.div>
    )
}