export const httpAPI = "http://localhost:8000"
export const wsAPI = "ws://localhost:8000/ws/call"

export interface GeneralResponse {
  success: boolean
  message: string
}
export interface ExceptionResponse {
  detail: string
}