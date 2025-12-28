import {MessageContent} from "../../lib/definitions";
import UserMessageContainer from "./UserMessageContainer";
import LlmMessageContainer from "./LlmMessageContainer";
import {LinearProgress} from "@mui/joy";
import LogoImage from '../../assets/images/aurelius_logo_tr.png'
import {motion} from "framer-motion";

interface MessagesContainerProps{
    messages: MessageContent[]
    waiting: boolean
}


export default function MessagesContainer({messages, waiting}: MessagesContainerProps){


    return (
        <div className={'w-full h-full px-4 flex-1 overflow-y-scroll  glass-gradient pb-40 pt-12 '}>
            {
                messages.length > 0 ?
                    messages.map((message, index)=> {
                        return (
                            <>
                                <div key={index}>
                                    <UserMessageContainer message={message.user_message}/>
                                    <LlmMessageContainer message={message.model_message}/>
                                </div>

                            </>
                        )
                    })
                    :
                    <div className={' h-full w-full text-center  flex flex-col gap-5 justify-center items-center '}>
                        <img src={LogoImage} alt={'Aurelius Logo'} className={'w-24 h-24'}/>
                        <motion.h1 initial={{opacity:0}} animate={{opacity:1}} className={'text-gray-950  dark:text-[#faefe1] text-lg'}>
                            How can i help you today?
                        </motion.h1>
                    </div>
            }
            {
                waiting && <LinearProgress
                    color="success"
                    size="sm"
                    variant="plain"
                />

            }
        </div>
    )
}