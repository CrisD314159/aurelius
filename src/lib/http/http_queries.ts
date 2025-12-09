import { ExceptionResponse, GeneralResponse, httpAPI, ModelResponse, RegisterUserInterface } from "../definitions"

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
  let data : ModelResponse | GeneralResponse
  if(response.ok){
    data = await response.json()
    return {
      success: data.success,
      message: data.message
    }
  }
    if(response.status === 412){
    data = await response.json()
    return {
      success: data.success,
      message: data.message
    }
  }else{
    const error :ExceptionResponse = await response.json()
    throw new Error(error.detail)
  }
}

export async function registerUser(values:RegisterUserInterface) {
    return modifyUser(values, 'POST', '/user')

}

export async function updateUser(values:RegisterUserInterface) {
    return modifyUser(values, 'POST', '/user')
}

export async function modifyUser(values:RegisterUserInterface, method:string, endpoint:string) {

    const response = await fetch(`${httpAPI}${endpoint}`, {
      method,
      body: JSON.stringify({
        "user_name": values.user_name,
        "model": values.model
      }),
      headers:{
        "Content-Type": "application/json" 
      },

    })

    if(response.ok){
      const data: GeneralResponse = await response.json()
      return {
        success: data.success,
        message: data.message
      }
    }else{
      const error: ExceptionResponse = await response.json()
      throw new Error(error.detail)
    }

}