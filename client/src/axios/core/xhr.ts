import type { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = 'get',
      headers = {},
      responseType,
      timeout,
    } = config
  
    const request = new XMLHttpRequest()

    request.open(method.toUpperCase(), url!, true)
    // 设置请求头部
    Object.keys(headers).forEach((name) => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      }
      request.setRequestHeader(name, headers[name])
    })

    if (responseType) {
      request.responseType = responseType
    }

    if (timeout) {
      request.timeout = timeout
    }

    request.send(data)

    request.onerror = function () {
      reject(
        createError(
          '网络错误：请检查您的网络连接状况',
          config,
          'NETERROR',
          request
        )
      )
    }

    request.ontimeout = function () {
      reject(
        createError(
          `请求超时：最大允许请求时长为 ${timeout} ms`,
          config,
          'TIMEOUT',
          request
        )
      )
    }

    request.onreadystatechange = function () {
      if (request.readyState !== 4) return
      if (request.status === 0) return
      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const responseData =
        responseType && responseType !== 'text'
          ? request.response
          : request.responseText

      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request,
      }

      function handleResponse(response: AxiosResponse): void {
        if (response.status >= 200 && response.status < 300) {
          resolve(response)
        } else {
          reject(
            createError(
              `请求响应失败：错误状态码为 ${response.status}`,
              config,
              request.status,
              request,
              response
            )
          )
        }
      }

      handleResponse(response)
    }
  })
}
