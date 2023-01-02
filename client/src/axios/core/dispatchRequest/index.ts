import type { AxiosRequestConfig } from '../../types'
import xhr from '../xhr'
import { buildURL } from '../../helpers/url'
import { transformRequest, transformResponse } from '../../helpers/data'
import { processHeaders, flattenHeaders } from '../../helpers/headers'
import { transform } from '../transform'
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
  // 以下两个函数已经放置到transformRequest进行执行
  // config.headers = transformHeaders(config)
  // config.data = transformRequestData(config)
  
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method)
}

function transformUrl(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url!, params)
}

function transformRequestData(config: AxiosRequestConfig): any {
  const { data } = config
  return transformRequest(data)
}

function transformHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

function throwIfCancellationRequested(config: AxiosRequestConfig) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}

function dispatchRequest(config: AxiosRequestConfig) {
  throwIfCancellationRequested(config)
  processConfig(config)
  return xhr(config).then((res) => {
    // 以下函数已放置到res.config.transformResponse进行执行
    // res.data = transformResponse(res.data)
    res.data = transform(res.data, res.headers, res.config.transformResponse)
    return res
  })
}

export default dispatchRequest
