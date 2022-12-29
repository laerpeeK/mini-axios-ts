const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controller/errorController')

const app = express()

app.use(morgan('common'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.all('*', (req, res, next) => {
  next(new AppError(`找不到路径：${req.originalUrl}`, 404))
})

app.use(globalErrorHandler)

module.exports = app
