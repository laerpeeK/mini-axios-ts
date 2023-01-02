import { AxiosRequestConfig } from './types'
import { transformRequest, transformResponse } from './helpers/data'
import { processHeaders } from './helpers/headers'

const defaults: AxiosRequestConfig = {
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },
  transformRequest: [
    function(data: any, headers: any) {
      processHeaders(headers, data)
      return transformRequest(data)
    }
  ],
  transformResponse: [
    function(data: any, headers?: any) {
      return transformResponse(data, headers)
    }
  ],
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN'
}

const requestWithoutDataMethods = ['delete', 'get', 'head', 'options']
const requestWithDataMethods = ['post', 'put', 'patch']

requestWithoutDataMethods.forEach(method => {
  defaults.headers[method] = {}
})

requestWithDataMethods.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export default defaults;