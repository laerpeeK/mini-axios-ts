// 文件上传功能处理函数
import multer from 'multer'
import path from 'path'
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

/**
 * 文件上传
 */
const uploadHandler = multer({ storage })

export default uploadHandler
