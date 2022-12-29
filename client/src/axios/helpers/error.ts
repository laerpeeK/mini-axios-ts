import type { AxiosRequestConfig, AxiosResponse } from '../types'

/**
 * AxiosError类，继承Error类，且附带更多请求相关信息
 */
export class AxiosError extends Error {
  private config: AxiosRequestConfig
  private code: string | null | number
  private request?: any
  private response?: AxiosResponse

  constructor(
    message: string,
    config: AxiosRequestConfig,
    code: string | null | number,
    request?: any,
    response?: AxiosResponse
  ) {
    super(message)
    this.config = config
    this.code = code
    this.request = request
    this.response = response

    Object.setPrototypeOf(this, AxiosError.prototype)
  }
}

/**
 * 创建AxiosError类的实例
 * @param message 
 * @param config 
 * @param code 
 * @param request 
 * @param response 
 * @returns 
 */
export function createError(
  message: string,
  config: AxiosRequestConfig,
  code: string | null | number,
  request?: any,
  response?: AxiosResponse
) {
  const error = new AxiosError(message, config, code, request, response)
  return error
}
