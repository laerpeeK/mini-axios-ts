// 处理url相关的工具函数
import { isDate, isObject, isURLSearchParams } from './util'

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
 * @param paramsSerializer
 * @returns
 */
export function buildURL(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
): string {
  // 1) params为空，直接返回原始url
  if (!params) return url

  // 2) 处理params，将其拼接到url上
  let serializedParams
    // a) 用户自定义参数处理
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    // b) 参数是URLSearchParams对象实例
    serializedParams = params.toString()
  } else {
    // c) 默认处理
    // 这里的做法是：将键值对放到统一数组parts里
    // parts: ['key1=value1', 'key2=value2', ...]
    const parts: string[] = []
    Object.keys(params).forEach((key) => {
      let val = params[key]
      if (val === null) return

      let values: string[] = []
      if (Array.isArray(val)) {
        // val = params[key] 值为数组时，对应键值对key[]=val[1]&key[]=val[2] ...
        values = val
        key += '[]'
      } else {
        // val = params[key] 值为undefined, 对应键值对为key=''
        values = val === undefined ? [''] : [val]
      }

      values.forEach((val) => {
        if (isDate(val)) {
          val = val.toISOString()
        } else if (isObject(val)) {
          val = JSON.stringify(val)
        }
        parts.push(`${encode(key)}=${encode(val)}`)
      })
    })
    serializedParams = parts.join('&')
  }

  // 3) 如果url有哈希标记，直接返回原始url # 之前的部分
  if (url.includes('#')) {
    const markIndex = url.indexOf('#')
    url = url.slice(0, markIndex)
  }

  if (serializedParams) {
    url += (url.includes('?') ? '&' : '?') + serializedParams
  }

  return url
}
