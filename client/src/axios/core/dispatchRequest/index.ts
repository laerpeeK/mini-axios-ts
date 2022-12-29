import type { AxiosRequestConfig } from '../../types'
import xhr from '../xhr'
import { buildURL } from '../../helpers/url'
import { transformRequest, transformResponse } from '../../helpers/data'
import { processHeaders } from '../../helpers/headers'
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)
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

function dispatchRequest(config: AxiosRequestConfig) {
  processConfig(config)
  return xhr(config).then((res) => {
    res.data = transformResponse(res.data)
    return res
  })
}

export default dispatchRequest
