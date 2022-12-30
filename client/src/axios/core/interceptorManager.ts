import type {
  ResolvedFn,
  RejectedFn,
  Interceptor,
  PromiseArr
} from '../types'

export default class IntercetorManager<T> {
  private intercetors: Array<Interceptor<T> | null>

  constructor() {
    this.intercetors = []
  }

  /**
   * 添加一组拦截器的方法
   * @param resolved
   * @param rejected
   * @returns
   */
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    this.intercetors.push({
      resolved,
      rejected,
    })
    return this.intercetors.length - 1
  }

  /**
   * 删除一组拦截器的方法
   * @param id
   */
  eject(id: number): void {
    this.intercetors[id] = null
  }

  /**
   * 请求拦截器是先添加的，后触发，因此采用栈的方式
   * @returns
   */
  stack(arr: Array<PromiseArr<any>>) {
    this.intercetors.forEach((interceptor) => {
      if (interceptor !== null) {
        arr.unshift(interceptor)
      }
    })
  }

  /**
   * 响应拦截器是先添加的，先触发，因此采用队列的方式
   * @param arr
   */
  queue(arr: Array<PromiseArr<any>>) {
    this.intercetors.forEach((interceptor) => {
      if (interceptor !== null) {
        arr.push(interceptor)
      }
    })
  }
}
