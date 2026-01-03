export const httpAPI = "http://0.0.0.0:8223"
export const wsAPI = "ws://0.0.0.0:8223"

export interface GeneralResponse {
  success: boolean
  message: string
}
export interface ExceptionResponse {
  detail: string
}

export interface ModelResponse {
  success: boolean
  message: ModelInfo[]
}

export interface ConfigResponse {
  success: boolean
  message: {user_data: string[], available_models: ModelInfo[]}
}

export interface ChatsResponse{
  success: boolean
  message: ChatContent[]
}

export interface ModelInfo {
  model: string,
  size: number,
  details: ModelDetails
}

export interface ModelDetails{
  parent_model: string,
  format: string,
  family: string,
  parameter_size: string,
  quantization_level: string
}

export interface RegisterUserInterface{
  user_name: string
  model: string
}

export interface ChatContent{
  chat_id:number
  user_id: number
  title: string
  date_created:string
}

export interface ChatMessagesResponse{
  success: boolean
  message: ChatMessages
}


export interface ChatMessages{
  chat_id:number
  messages: MessageContent[]
}

export interface MessageContent{
  id:number
  chat_id:number
  user_message:string
  model_message:string
  message_date?:string
}