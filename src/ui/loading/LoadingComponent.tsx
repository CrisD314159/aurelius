import { CircularProgress } from "@mui/joy";

export default function LoadingComponent(){
  return (
    <div className="w-full h-full flex justify-center items-center">
      <CircularProgress color="success"/>
    </div>
  )
}