import {
  ChatContent,
  ChatMessages, ChatMessagesResponse,
  ChatsResponse,
  ConfigResponse,
  ExceptionResponse,
  GeneralResponse,
  httpAPI, ModelInfo,
  ModelResponse,
  RegisterUserInterface
} from "../definitions"

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
export async function getAvailableModels(): Promise<{success: boolean, message:ModelInfo[]}> {
  const response:Response = await fetch(`${httpAPI}/user/getInstalledModels`)
  if(response.ok){
    const data: ModelResponse = await response.json()
    return {
      success: data.success,
      message: data.message
    }
  }else{
    const error = await response.json()
    throw new Error(error.message)
  }
}
export async function getUserConfig():Promise<
    {success:boolean, message:{
            user_data: string[]
            available_models: ModelInfo[] }
    }> {
  const response:Response = await fetch(`${httpAPI}/user/getConfig`)
  if(response.ok){
    const data: ConfigResponse = await response.json()
    return {
      success: data.success,
      message: data.message
    }
  }else{
    const error = await response.json()
    throw new Error(error.message)
  }
}

export async function getChats() : Promise<{ success: boolean, message: ChatContent[] }>{
  const response:Response = await fetch(`${httpAPI}/chats/getChats`)
  if(response.ok){
    const data: ChatsResponse = await response.json()
    return {
      success: data.success,
      message: data.message
    }
  }else{
    const error = await response.json()
    throw new Error(error.message)
  }
}

export async function getChatMessages(id:number): Promise<{success: boolean, message:ChatMessages}> {
  const response:Response = await fetch(`${httpAPI}/chats/getChatContent/${id}`)
  if(response.ok){
    const data: ChatMessagesResponse = await response.json()
    return {
      success: data.success,
      message: data.message
    }
  }else{
    const error = await response.json()
    throw new Error(error.message)
  }
}




export async function registerUser(values:RegisterUserInterface) {
    return modifyUser(values, 'POST', '/user')
}

export async function updateUser(values:RegisterUserInterface) {
    return modifyUser(values, 'PUT', '/user')
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