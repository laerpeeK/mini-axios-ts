class AppError extends Error {
  private statusCode: number
  private status: string
  private isOperational: boolean

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true // 非系统性错误

    Error.captureStackTrace(this, this.constructor)
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export default AppError