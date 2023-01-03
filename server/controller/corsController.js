// 跨域配置
const cors = {
  'Access-Control-Allow-Origin': 'http://127.0.0.1:8080',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': 'Content-Type, X-XSRF-NLRX, Authorization',
  'Access-Control-Expose-Headers': 'Content-Disposition' // 暴露该头部信息供客户端下载文件设置文件名时使用
}

/**
 * 跨域处理模块
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
module.exports = (req, res, next) => {
  res.set(cors)
  next()
}