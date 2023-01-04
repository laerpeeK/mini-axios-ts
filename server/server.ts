import type { Application } from 'express'
import dotenv from 'dotenv'
const app = require('./app')

process.on('unhandledRejection', (err: Error) => {
  console.log('unhadledRejection: ')
  console.log(err.name, err.message)
  process.exit(1)
})

process.on('uncaughtException', (err: Error) => {
  console.log('uncaughtException: ')
  console.log(err.name, err.message)
  process.exit(1)
})

dotenv.config({
  path: './config.local.env',
})

const { PROTOCOL, HOST, PORT } = process.env

const server =app.listen(PORT, () => {
  console.log(`API服务运行于: ${PROTOCOL}://${HOST}:${PORT}`)
})

process.on('SIGTERM', () => {
  console.log('SIGTERM received. shutting down gracefully')
  server.close(() => {
    console.log('Process terminated!')
  })
})