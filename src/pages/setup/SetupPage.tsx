import { useQuery } from "@tanstack/react-query"
import { verifyUserRegistered } from "../../lib/http/http_queries"
import { useEffect } from "react"
import toast from "react-hot-toast"
import SetupFormComponent from "../../ui/setup/SetupFormComponent"
import InstallOllamaComponent from "../../ui/setup/InstallOllamaComponent"
import LoadingComponent from "../../ui/loading/LoadingComponent"
import ErrorComponent from "../../ui/error/ErrorComponent"

export default function SetupPage(){

  const { isPending, isError, data, error, refetch } = useQuery({ queryKey: ['availableModels'], queryFn: verifyUserRegistered })

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
    <div>
      {
        data.success ?
        <SetupFormComponent/>
        :
        <InstallOllamaComponent refetch={refetch}/>
      }
    </div>
  )
}