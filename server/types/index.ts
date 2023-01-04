export interface AppError extends Error {
  status: string
  statusCode: number
  isOperational: boolean
  constructor(message: string, statusCode: number): AppError
}