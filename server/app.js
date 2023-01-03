const path = require('path')
const express = require('express')
const morgan = require('morgan')
const atob = require('atob')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controller/errorController')
const corsHandler = require('./controller/corsController')
const uploadHandler = require('./controller/uploadController')
const authHandler = require('./controller/authController')
const app = express()

// 中间件
app.use(morgan('common'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// 01
app.get('/api/base/get', (req, res) => {
  res.json({
    msg: 'hello world',
  })
})

// 02
app.get('/api/handleRequestURL/get', (req, res) => {
  res.json(req.query)
})

// 03
app.post('/api/handleRequestBody/post', (req, res) => {
  res.json(req.body)
})

// 04
app.post('/api/handleRequestHeader/post', (req, res) => {
  res.json(req.body)
})

// 05
app.post('/api/getResponse', (req, res) => {
  res.json(req.body)
})

// 06
app.post('/api/transformResponseHeader', (req, res) => {
  res.json(req.body)
})

app.get('/api/transformResponseHeader', (req, res) => {
  res.json(req.query)
})

// 07
app.post('/api/transformResponseData', (req, res) => {
  res.json(req.body)
})

// 08
app.get('/api/handleError', (req, res) => {
  res.status(500).end()
})

app.get('/api/handleError/timeout', (req, res) => {
  setTimeout(() => {
    res.json({
      msg: 'Hello world',
    })
  }, 3000)
})

// 09
app.get('/api/expandInterface/get', (req, res) => {
  res.json({
    msg: 'hello world',
  })
})

app.options('/api/expandInterface/options', (req, res) => {
  res.end()
})

app.delete('/api/expandInterface/delete', (req, res) => {
  res.end()
})

app.head('/api/expandInterface/head', (req, res) => {
  res.end()
})

app.post('/api/expandInterface/post', (req, res) => {
  res.json(req.body)
})

app.put('/api/expandInterface/put', (req, res) => {
  res.json(req.body)
})

app.patch('/api/expandInterface/patch', (req, res) => {
  res.json(req.body)
})

// 10
app.post('/api/addParameters', (req, res) => {
  res.json(req.body)
})

app.get('/api/addParameters', (req, res) => {
  res.json(req.query)
})

// 11
app.get('/api/addGenericityToAxiosResponse', (req, res) => {
  res.json({
    msg: 'hello world',
    data: {
      name: 'NLRX',
      age: 18,
    },
  })
})

// 12
app.get('/api/addInterceptors', (req, res) => {
  res.json({
    msg: 'hi interceptor',
    data: {
      name: 'NLRX',
      age: 18,
    },
  })
})

// 13
app.post('/api/mergeConfig', (req, res) => {
  res.json(req.body)
})

// 14
app.post('/api/transformData', (req, res) => {
  res.json(req.body)
})

// 15
app.post('/api/expandCreateInterface', (req, res) => {
  res.json(req.body)
})

// 16
app.get('/api/cancel', (req, res) => {
  setTimeout(() => {
    res.json({
      msg: 'Hello World',
    })
  }, 3000)
})

// 以下请求允许跨域
app.use(corsHandler)

// 处理 /api/* 请求的预检，针对跨域问题
app.options(/^\/api\/*/, (req, res) => {
  res.end()
})

// 20
app.post('/api/addWithCredentials', (req, res) => {
  res.json(req.cookies)
})

// 21
app.get('/api/defendXSRF', (req, res) => {
  res.cookie('XSRF-NLRX', 'NLRX')
  res.json(req.cookies)
})

// 22
app.get('/api/downloadFile', (req, res) => {
  res.download(path.resolve(__dirname, './public/download/helloworld.jpg'))
})

// 23
app.post('/api/uploadFile', uploadHandler.single('file'), (req, res) => {
  res.json({
    status: 'success',
  })
})

// 24
app.get('/api/HTTPAuthorization', authHandler)

// 25
app.get('/api/checkStatus', (req, res) => {
  res.status(304).end()
})

// 26
app.get('/api/addParamsSerializer', (req, res) => {
  res.json(req.query)
})

// 27
app.get('/api/baseURL', (req, res) => {
  res.json({
    status: 'success'
  })
})

// 29
app.get('/api/allAndSpreadA', (req, res) => {
  res.json({
    status: 'success',
    data: 'allAndSpreadA'
  })
})

app.get('/api/allAndSpreadB', (req, res) => {
  res.json({
    status: 'success',
    data: 'allAndSpreadB',
    message: 'special message'
  })
})

// no match address
app.all('*', (req, res, next) => {
  next(new AppError(`找不到路径：${req.originalUrl}`, 404))
})

app.use(globalErrorHandler)

module.exports = app
