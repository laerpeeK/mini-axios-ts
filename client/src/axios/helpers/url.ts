// 处理url相关的工具函数
import { isDate, isObject } from './util'

/**
 * 部分特殊字符不采用URL编码
 * @param val 
 * @returns 
 */
function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

/**
 * 处理get请求url参数
 * @param url 
 * @param params 
 * @returns 
 */
export function buildURL(url: string, params?: any): string {
  // 1) params为空，直接返回原始url
  if (!params) return url

  // 2) 如果url有哈希标记，直接返回原始url # 之前的部分
  if (url.includes('#')) {
    const markIndex = url.indexOf('#')
    url = url.slice(0, markIndex)
    return url
  }

  // 3) 其他情况下，处理params，将其拼接到原始url上
  // 这里的做法是：将键值对放到统一数组parts里
  // parts: ['key1=value1', 'key2=value2', ...]
  const parts: string[] = []
  Object.keys(params).forEach(key => {
    let val = params[key]
    if (val === null) return

    let values: string[] = []
    if (Array.isArray(val)) {
      // val = params[key] 值为数组时，对应键值对key[]=val[1]&key[]=val[2] ...
      values = val
      key+='[]'
    } else {
      // val = params[key] 值为undefined, 对应键值对为key=''
      values = (val === undefined ? [''] : [val])
    }

    values.forEach(val => {
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isObject(val)) {
        val = JSON.stringify(val)
      }
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })

  let serializedParams = parts.join('&')
  if (serializedParams) {
    url += (url.includes('?') ? '&' : '?') + serializedParams
  }

  return url
}
