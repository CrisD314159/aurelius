import LogoImage from  "../../assets/images/aurelius_logo_tr.png";
import ChatsDrawer from "../chats/ChatsDrawer";
import {ChatMessages} from "../../lib/definitions";


interface MenuComponentProps{
    setChat: (chat:ChatMessages) => void
}

export default function MenuComponent({setChat}: MenuComponentProps) {
  return (
    <header className="w-full flex items-center relative px-5 h-[65px] py-4 bg-[#faefe1]/30 dark:bg-gray-950/30">
      <div className="absolute left-0">
          <ChatsDrawer setChat={setChat}/>
      </div>

      <div className="absolute left-[50%] translate-x-[-50%] h-14">
        <img src={LogoImage} alt="" className="w-14 h-14" />
      </div>
    </header>
  )
  
}