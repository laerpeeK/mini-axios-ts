import { AxiosTransformer } from '../types'
/**
 * 执行所有转换函数，并且把前一个转换函数的返回值作为参数传给后一个转换函数
 * @param data 
 * @param headers 
 * @param fns 
 * @returns 
 */
export function transform(
  data: any,
  headers: any,
  fns?: AxiosTransformer | AxiosTransformer[]
) {
  if (!fns) return data
  if (!Array.isArray(fns)) fns = [fns]
  fns.forEach(fn => {
    data = fn(data, headers)
  })
  return data
}
