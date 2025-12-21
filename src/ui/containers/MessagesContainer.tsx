import {MessageContent} from "../../lib/definitions";
import UserMessageContainer from "./UserMessageContainer";
import LlmMessageContainer from "./LlmMessageContainer";

interface MessagesContainerProps{
    messages: MessageContent[]
}


export default function MessagesContainer({messages}: MessagesContainerProps){


    return (
        <div className={'w-full h-full'}>
            {
                messages.length > 0 ?
                    messages.map((message, index)=> {
                        return (
                            <div key={index}>
                                <UserMessageContainer message={message.user_message}/>
                                <LlmMessageContainer message={message.model_message}/>
                            </div>
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