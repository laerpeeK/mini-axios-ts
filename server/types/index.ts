export interface AppError extends Error {
  status: string
  statusCode: number
  isOperational: boolean
  constructor(message: string, statusCode: number): AppError
}

export interface CorsConfig {
  'Access-Control-Allow-Origin': string
  'Access-Control-Allow-Credentials': boolean,
  'Access-Control-Allow-Methods': string,
  'Access-Control-Allow-Headers': string,
  'Access-Control-Expose-Headers': string
}