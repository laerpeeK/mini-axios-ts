const atob = require('atob')
/**
 * 授权认证模块
 * @param {*} req 
 * @param {*} res 
 */
module.exports = (req, res) => {
  const auth = req.headers.authorization
  const [type, credentials] = auth.split(' ')
  const [username, password] = atob(credentials).split(':')
  res.json({
    type,
    username,
    password
  })
}