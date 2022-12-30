export type Method = 'get' | 'GET'
  | 'delete' | 'DELETE'
  | 'head' | 'HEAD'
  | 'options' | 'OPTIONS'
  | 'post' | 'POST'
  | 'put' | 'put'
  | 'patch' | 'PATCH'

// Axios请求配置对象定义
export interface AxiosRequestConfig {
  url?: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number
}

// 响应数据接口定义
export interface AxiosResponse<T = any> {
  data: T // 服务端返回的数据
  status: number // HTTP状态码
  statusText: string // 状态消息
  headers: any // 响应头
  config: AxiosRequestConfig // 请求配置对象
  request: any // 请求的XMLHttpRequest 对象实例
}

// axios返回的promise对象定义
export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>>  {}

// 异常信息接口类型定义
export interface AxiosError extends Error {
  config: AxiosRequestConfig
  code?: string | null | number
  request?: any
  response?: AxiosResponse
}

// Axios类类型接口定义
export interface Axios {
  interceptors: {
    request: InterceptorManager<AxiosRequestConfig>,
    response: InterceptorManager<AxiosResponse>
  }
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

// axios类型接口定义
export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}


// 单组拦截器类型接口定义
export interface Interceptor<T = AxiosRequestConfig | AxiosResponse> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}

// Interceptor类 类型接口定义对应axios.intercetors.request & axios.interceptors.response
export interface InterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number
  eject(id: number): void
  stack(arr: Array<any>): void
  queue(arr: Array<any>): void
}

// 成功拦截器类型接口定义
export interface ResolvedFn<T = AxiosRequestConfig | AxiosResponse> {
  (val: T): T | Promise<T>
}

// 失败拦截器类型接口定义
export interface RejectedFn {
  (error: any): any
}

// （拦截器或实际调用）接口定义
export interface PromiseArr<T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn
}