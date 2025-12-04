import { useQuery } from "@tanstack/react-query"
import { verifyUserRegistered } from "../../lib/http/http_queries"
import RedirectComponent from "../../ui/redirect/RedirectComponent"
import LoadingComponent from "../../ui/loading/LoadingComponent"
import ErrorComponent from "../../ui/error/ErrorComponent"
import { useEffect } from "react"
import toast from "react-hot-toast"

export default function MainPage() {

  const { isPending, isError, data, error, refetch } = useQuery({ queryKey: ['verifyRegistry'], queryFn: verifyUserRegistered })

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
    <RedirectComponent data={data}/>
  )
}