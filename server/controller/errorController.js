function sendError(err, req, res) {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    // error: err,
    // stack: err.stack
  })
}

/**
 * 全局错误处理模块
 * @param {*} err 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  sendError(err, req, res)
}