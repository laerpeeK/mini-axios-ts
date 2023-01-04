import type { AppError } from '../types'
import type { Request, Response, NextFunction } from 'express'
function sendError(err: AppError, req: Request, res: Response) {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    // error: err,
    // stack: err.stack
  })
}

/**
 * 全局错误处理
 */
const globalErrorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  sendError(err, req, res)
}
export default globalErrorHandler