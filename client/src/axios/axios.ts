import type { AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig';

function getAxios(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  // 调用axios.get时需要调用 this._requestMethodWithoutData, 此处的this需要为Axios类的实例
  // 之所以这样做，是为了满足 axios({})的需求
  const axios = Axios.prototype.request.bind(context)
  extend(axios, context)
  return axios as AxiosStatic
}

const axios = getAxios(defaults)

axios.create = function(config: AxiosRequestConfig) {
  return getAxios(mergeConfig(defaults, config))
}
export default axios
