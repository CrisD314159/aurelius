import {MessageContent} from "../../lib/definitions";
import UserMessageContainer from "./UserMessageContainer";
import LlmMessageContainer from "./LlmMessageContainer";
import {LinearProgress} from "@mui/joy";

interface MessagesContainerProps{
    messages: MessageContent[]
    waiting: boolean
}


export default function MessagesContainer({messages, waiting}: MessagesContainerProps){


    return (
        <div className={'w-full h-full px-4 flex-1 overflow-y-scroll  glass-gradient pb-40 '}>
            {
                messages.length > 0 ?
                    messages.map((message, index)=> {
                        return (
                            <>
                                <div key={index}>
                                    <UserMessageContainer message={message.user_message}/>
                                    <LlmMessageContainer message={message.model_message}/>
                                </div>
                                {
                                    waiting && <LinearProgress
                                        color="success"
                                        size="sm"
                                        variant="plain"
                                    />

                                }
                            </>
                        )
                    })
                    :
                    <h1 className={'text-center text-gray-950  dark:text-[#faefe1]'}>
                        Start a new conversation with Aurelius
                    </h1>
            }

        </div>
    )
}