import type {
  AxiosPromise,
  AxiosRequestConfig,
  Method,
  AxiosResponse,
  InterceptorManager,
  PromiseArr
} from '../types'
import dispatchRequest from './dispatchRequest'
import IntercetorManager from './interceptorManager'

export default class Axios {
  private interceptors: {
    request: InterceptorManager<AxiosRequestConfig>
    response: InterceptorManager<AxiosResponse>
  }

  constructor() {
    this.interceptors = {
      request: new IntercetorManager<AxiosRequestConfig>(),
      response: new IntercetorManager<AxiosResponse>(),
    }
  }

  request(
    url: string | AxiosRequestConfig,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    if (typeof url === 'string') {
      config = config ? config : {}
      config.url = url
    } else {
      // typeof url === AxiosRequestConfig的情况
      config = url
    }

    let arr: PromiseArr<AxiosRequestConfig | AxiosResponse>[] = [
      // a) 前面应该按栈顺序添加请求拦截器
      
      // b) 中间是真实请求
      {
        resolved: dispatchRequest
      },

      // c) 后面按队列顺序添加响应拦截器
    ]

    // 进行请求/响应拦截器的添加
    this.interceptors.request.stack(arr)
    this.interceptors.response.queue(arr)

    // 支持链式调用
    let promise = Promise.resolve(config)
    while(arr.length) {
      const { resolved, rejected } = arr.shift()!
      promise = promise.then(resolved, rejected)
    }

    return promise as AxiosPromise
  }

  _requestMethodWithoutData(
    method: Method,
    url: string,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
      })
    )
  }

  _requestMethodWithData(
    method: Method,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
        data,
      })
    )
  }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('get', url, config)
  }

  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('delete', url, config)
  }

  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('head', url, config)
  }

  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('options', url, config)
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('post', url, data, config)
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('put', url, data, config)
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('patch', url, data, config)
  }
}
