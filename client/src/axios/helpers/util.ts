// 通用工具函数

const toStringFn = Object.prototype.toString

/**
 * 判断是否为日期类型
 * @param val 
 * @returns 
 */
export function isDate(val: any): val is Date {
  return toStringFn.call(val) === '[object Date]'
}

/**
 * 判断是否为对象类型
 * @param val 
 * @returns 
 */
export function isObject(val: any): val is Object {
  return toStringFn.call(val) === '[object Object]'
}


/**
 * 完成接口挂载的工具函数
 * @param to 
 * @param from 
 * @returns 
 */
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    (to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

/**
 * 深度合并多个对象对应属性的函数 
 * @param objs 
 * @returns 
 */
export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)
  for (let i = 0; i < objs.length; i++) {
    const obj = objs[i]
    for (let key in obj) {
      assignValue(obj[key], key)
    }
  }

  function assignValue(val: any, key: string) {
    if (isObject(result[key]) && isObject(val)) {
      result[key] = deepMerge(result[key], val)
    } else if (isObject(val)) {
      result[key] = deepMerge({}, val)
    } else {
      result[key] = val
    }
  }
  return result
}