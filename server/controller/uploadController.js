// 文件上传功能处理函数
const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(process.cwd(), './public/upload'))
  },
  filename: (req, file, cb) => {
    // 解决中文名乱码问题
    file.originalname = Buffer.from(file.originalname, 'latin1').toString(
      'utf-8'
    )
    cb(null, file.originalname)
  },
})
const upload = multer({ storage })

/**
 * 文件上传模块
 */
module.exports = upload
