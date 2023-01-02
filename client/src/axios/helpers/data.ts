import { isObject } from './util'

/**
 * 对request中的data进行一层转换,JSON.stringify
 * @param data 
 * @returns 
 */
export function transformRequest(data: any): any {
  if (isObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

/**
 * 解析response.data的数据类型 string => ...
 * @param data 
 * @returns 
 */
export function transformResponse(data: any, headers?: any): any {
  if (data && typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch(e) {
      console.error('transformResponse执行失败: data为不支持JSON.parse的字符串')
    }
  }


  // 支持文件下载
  if (data && data instanceof Blob) {
    let filename = 'file'
    if (headers['content-disposition']) {
      filename = headers['content-disposition'].match(/filename=.*/)[0].replace('filename=','').replace(/\"/g,'')
    }
    
    const url = window.URL.createObjectURL(data)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
  }
  return data 
}