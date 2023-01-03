// 文件上传功能处理函数
const fs = require('fs')
const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 这里有优化空间，就是注释掉，自己创建一个upload目录
    try {
      fs.readdirSync(path.resolve(process.cwd(), 'public/upload'))
    } catch (e) {
      fs.mkdirSync(path.resolve(process.cwd(), 'public/upload'))
    }
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
