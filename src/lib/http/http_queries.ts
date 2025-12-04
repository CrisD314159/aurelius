import { ExceptionResponse, GeneralResponse, httpAPI } from "../definitions"

export async function verifyUserRegistered() {
  const response = await fetch(`${httpAPI}/user/verifyRegistered`)
  if(response.ok || response.status === 404){
    const data: GeneralResponse = await response.json()
    return {
      success: data.success,
      message: data.message
    }
  }else{
    const error :ExceptionResponse = await response.json()
    throw new Error(error.detail)
  }
}
export async function getAvailableModels() {
  const response = await fetch(`${httpAPI}/user/getInstalledModels`)
  if(response.ok || response.status === 412){
    const data: GeneralResponse = await response.json()
    return {
      success: data.success,
      message: data.message
    }
  }else{
    const error :ExceptionResponse = await response.json()
    throw new Error(error.detail)
  }
}