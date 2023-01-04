import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import AppError from './utils/appError'
import globalErrorHandler from './controller/errorController'


const app = express()

app.use(morgan('common'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.all('*', (req, res, next) => {
  next(new AppError(`找不到路径：${req.originalUrl}`, 404))
})

app.use(globalErrorHandler)

module.exports = app
