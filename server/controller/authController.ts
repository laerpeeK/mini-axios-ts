import atob from 'atob'
import type { Request, Response } from 'express'

/**
 * 授权认证模块
 */
const authHandler = (req: Request, res: Response) => {
  const auth = req.headers.authorization
  const [type, credentials] = auth!.split(' ')
  const [username, password] = atob(credentials).split(':')
  res.json({
    type,
    username,
    password
  })
}

export default authHandler