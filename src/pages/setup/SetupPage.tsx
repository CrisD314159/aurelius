import { useQuery } from "@tanstack/react-query"
import { getAvailableModels } from "../../lib/http/http_queries"
import { useEffect } from "react"
import toast from "react-hot-toast"
import SetupFormComponent from "../../ui/setup/SetupFormComponent"
import InstallOllamaComponent from "../../ui/setup/InstallOllamaComponent"
import LoadingComponent from "../../ui/loading/LoadingComponent"
import ErrorComponent from "../../ui/error/ErrorComponent"

export default function SetupPage(){

  const { isPending, isError, data, error, refetch } = useQuery({ queryKey: ['availableModels'], queryFn: getAvailableModels })

  useEffect(()=>{
    if(isError){
      toast.error(error.message)
    }
  },[isError, error])

  if (isPending) {
      return <LoadingComponent/>
    }

  if (isError) {
    return <ErrorComponent refetch={refetch}/>
  }

  return (
    <div className="w-full h-full">
      {
        data.success ?
        <SetupFormComponent models={data.message} refetch={refetch}/>
        :
        <InstallOllamaComponent refetch={refetch}/>
      }
    </div>
  )
}