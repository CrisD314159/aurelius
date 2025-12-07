export const httpAPI = "http://localhost:8000"
export const wsAPI = "ws://localhost:8000/ws/call"

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