import { Outlet } from "react-router";

export default function RootPage() {
  return (
    <div className="w-full h-full bg-[#faefe1] dark:bg-zinc-950 ">
      
      <Outlet/>
        
    </div>
)
}