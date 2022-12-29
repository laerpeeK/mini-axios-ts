import type { AxiosInstance } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util';
function getAxios(): AxiosInstance {
  const context = new Axios()
  // 调用axios.get时需要调用 this._requestMethodWithoutData, 此处的this需要为Axios类的实例
  // 之所以这样做，是为了满足 axios({})的需求
  const axios = Axios.prototype.request.bind(context)
  extend(axios, context)
  return axios as AxiosInstance
}

const axios = getAxios()
export default axios