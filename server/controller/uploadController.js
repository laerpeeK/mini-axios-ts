// 文件上传功能处理函数
const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(process.cwd(), './public/upload'))
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage })
module.exports = upload