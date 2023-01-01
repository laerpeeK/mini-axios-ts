import type {
  CancelExecutor,
  CancelTokenSource,
  Canceler,
} from '../types'

import Cancel from './Cancel'

// resolve函数的接口定义，指的是new Promise((resolve) => {})这个形参resolve
interface ResolvePromise {
  (reason: Cancel | PromiseLike<Cancel>): void
}

export default class CancelToken {
  public promise: Promise<Cancel>
  public reason?: Cancel

  throwIfRequested() : void {
    if (this.reason) throw this.reason
  }

  constructor(executor: CancelExecutor) {
    let resolveClone: ResolvePromise
    this.promise = new Promise<Cancel>((resolve) => {
      resolveClone = resolve
    })

    executor((message) => {
      // this指向？ 个人也无法找到其根源，这里如果用箭头函数是new 出来的CancelToken实例
      if (this.reason) return
      this.reason = new Cancel(message)
      return resolveClone(this.reason)
    })
  }

  static source(): CancelTokenSource {
    let cancel!: Canceler
    let token = new CancelToken((c) => {
      cancel = c
    })
    return {
      token,
      cancel
    }
  }
}
