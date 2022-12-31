import type { AxiosRequestConfig, AxiosTransformer } from '../types'
import { isObject, deepMerge } from '../helpers/util'

/**
 * 合并默认配置与用户配置对象
 * @param defaultConfig
 * @param userConfig
 * @returns
 */
export default function mergeConfig(
  defaultConfig: AxiosRequestConfig,
  userConfig?: AxiosRequestConfig
): AxiosRequestConfig {
  let config = Object.create(null)

  // a) 优化，以下两个属性，默认配置与用户配置进行合并
  let transformProperties = ['transformRequest', 'transformResponse']

  transformProperties.forEach((prop) => {
    userConfig = userConfig || {}
    if (!userConfig[prop]) {
      userConfig[prop] = []
    } else if (!Array.isArray(userConfig[prop])) {
      userConfig[prop] = [userConfig[prop]]
    }

    config[prop] =
      prop === 'transformRequest'
        ? [
            ...(userConfig[prop] as AxiosTransformer[]),
            ...(defaultConfig[prop] as AxiosTransformer[]),
          ]
        : [
            ...(defaultConfig[prop] as AxiosTransformer[]),
            ...(userConfig[prop] as AxiosTransformer[]),
          ]
  })

  // b) 常规配置，如果用户配置了就取用户的，否则取默认的, 此处记得删除掉transformRequest, transformResponse两个属性
  let routineProperties = [
    'baseURL',
    'paramsSerializer',
    'timeout',
    'withCredentials',
    'adapter',
    'responseType',
    'xsrfCookieName',
    'xsrfHeaderName',
    'onUploadProgress',
    'onDownloadProgress',
    'maxContentLength',
    'validateStatus',
    'maxRedirects',
    'httpAgent',
    'httpsAgent',
    'cancelToken',
    'socketPath',
  ]

  routineProperties.forEach((prop) => {
    userConfig = userConfig || {}
    if (typeof userConfig[prop] !== 'undefined') {
      config[prop] = userConfig[prop]
    } else if (typeof defaultConfig[prop] !== 'undefined') {
      config[prop] = defaultConfig[prop]
    }
  })

  // c) 只接受用户配置
  const valueFromUserProperties = ['url', 'method', 'params', 'data']

  valueFromUserProperties.forEach((prop) => {
    userConfig = userConfig || {}
    if (typeof userConfig[prop] !== 'undefined') {
      config[prop] = userConfig[prop]
    }
  })

  // d) 复杂对象深度合并
  const mergeDeepProperties = ['headers', 'auth', 'proxy']

  // 这里主要关注的是headers对象的合并
  mergeDeepProperties.forEach((prop) => {
    userConfig = userConfig || {}

    // a) userConfig[prop]为对象时, 将其与defaultConfig[prop]进行合并成为最终的config[prop]
    if (isObject(userConfig[prop])) {
      config[prop] = deepMerge(defaultConfig[prop], userConfig[prop])

      // b) userConfig[prop]存在，但不为对象时，将其设置为最终的config[prop]
    } else if (typeof userConfig[prop] !== 'undefined') {
      config[prop] = userConfig[prop]

      // c) userConfig[prop]不存在，但defaultConfig[prop]存在, 将其设置为最终的config[prop]
    } else if (typeof defaultConfig[prop] !== 'undefined') {
      config[prop] = deepMerge(defaultConfig[prop])
    }
  })

  return config
}
