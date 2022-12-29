import { isObject } from './util'

/**
 * 处理request的headers
 * @param headers 
 * @param data 
 * @returns 
 */
export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')
  if (isObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}

/**
 * 格式化Content-Type为首字母大写形式
 * @param headers 
 * @param normalizedName 
 * @returns 
 */
function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers || !Object.keys(headers).length) return

  Object.keys(headers).forEach(name => {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
}

/**
 * 将响应头部由字符串形式转换为对象形式
 * @param headers 
 * @returns 
 */
export function parseHeaders(headers: string): any {
  let res = Object.create(null)
  if (!headers) return res

  headers.split('\r\n').forEach(line => {
    let [key, val] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) return
    if (val) val = val.trim()

    res[key] = val
  })

  return res
}