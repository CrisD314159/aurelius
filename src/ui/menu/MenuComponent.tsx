import LogoImage from  "../../assets/images/aurelius_logo_tr.png";
import ChangeConfigModal from "../modals/ChangeConfigModal";
export default function MenuComponent() {
  return (
    <header className="w-full flex items-center relative pt-5">
      <div className="absolute left-0">
        <ChangeConfigModal/>
      </div>

      <div className="absolute left-[50%] translate-x-[-50%]">
        <img src={LogoImage} alt="" className="w-14 h-14" />
      </div>
    </header>
  )
  
}