import WebsocketConnectionPCM from "../../ui/call/WebsocketConnectionPCM";
import MenuComponent from "../../ui/menu/MenuComponent";

export default function ChatPage() {
  return (
    <div className="w-full h-full">
        <MenuComponent/>
      <WebsocketConnectionPCM/>
    </div>
  )
}