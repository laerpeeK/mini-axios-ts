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
export function transformResponse(data: any): any {
  if (data && typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch(e) {
      throw new Error('转换响应对象失败')
    }
  }
  return data
}