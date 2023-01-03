import type { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import isURLSameOrigin from '../helpers/isURLSameOrigin'
import cookie from '../helpers/cookies'
import { isFormData } from '../helpers/util'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = 'get',
      headers = {},
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config

    const request = new XMLHttpRequest()

    request.open(method.toUpperCase(), url!, true)

    // 是否允许请求携带cookie
    if (withCredentials) {
      request.withCredentials = true
    }

    // 下载进度处理
    if (onDownloadProgress) {
      request.onprogress = onDownloadProgress
    }

    // 上传进度处理
    if (onUploadProgress) {
      request.upload.onprogress = onUploadProgress
    } 

    // 设置请求头部
    if (auth) {
      const username = auth.username || ''
      const password = auth.password || ''
      headers['Authorization'] = 'Basic ' + window.btoa(username + ':' + password)
    }

    if (isFormData(data)) {
      delete headers['Content-Type']
    }

    // 1) xsrf防御
    let xsrfValue =
      // 只有在以下情况下可以设置xsrfHeader，PS: (xsrfCookieName, xsrfHeaderName有默认值),具体查看defaults.ts
      // 1)同源 2)设置了config.withCredentials = true
      (withCredentials || isURLSameOrigin(url!)) && xsrfCookieName
        ? cookie.read(xsrfCookieName)
        : undefined

    if (xsrfValue) {
      headers[xsrfHeaderName!] = xsrfValue
    }

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

    // 3) 是否允许请求取消
    if (cancelToken) {
      cancelToken.promise.then((reason) => {
        request.abort()
        reject(reason)
      })
    }


    // 4) 网络错误
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

    // 5) 请求超时
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
        if (!validateStatus || validateStatus(response.status)) {
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
