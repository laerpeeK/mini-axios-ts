import qs from 'qs'
import axios from './axios'
import type {
  Canceler,
  AxiosRequestConfig,
  AxiosPromise,
  AxiosResponse,
} from './axios/types'
function getElById(id: string): HTMLElement {
  return document.getElementById(id)!
}

// 01. 跑通流程
getElById('baseGet').addEventListener('click', () => {
  axios({
    method: 'get',
    url: '/api/base/get',
    params: {
      a: 1,
      b: 2,
    },
  })
})

// 02. 处理get请求url参数
getElById('handleRequestURL').addEventListener('click', () => {
  // a) 普通参数
  axios({
    method: 'get',
    url: '/api/handleRequestURL/get',
    params: {
      a: 1,
      b: 2,
    },
  })

  // b) 数组参数
  axios({
    method: 'get',
    url: '/api/handleRequestURL/get',
    params: {
      foo: ['bar', 'baz'],
    },
  })

  // c) 对象参数
  axios({
    method: 'get',
    url: '/api/handleRequestURL/get',
    params: {
      foo: {
        bar: 'baz',
      },
    },
  })

  // d) 日期参数
  axios({
    method: 'get',
    url: '/api/handleRequestURL/get',
    params: {
      date: new Date(),
    },
  })

  // e) 特殊字符
  axios({
    method: 'get',
    url: '/api/handleRequestURL/get',
    params: {
      foo: '@:$, ',
    },
  })

  // f) 参数包含null或undefined
  axios({
    method: 'get',
    url: '/api/handleRequestURL/get',
    params: {
      foo: null,
      bar: undefined,
    },
  })

  // g) url中存在哈希#标记
  axios({
    method: 'get',
    url: '/api/handleRequestURL/get#hash?bar=baz',
    params: {
      hash: 'bar',
      zk: 'baz',
    },
  })

  // h) url中已存在参数
  axios({
    method: 'get',
    url: '/api/handleRequestURL/get?foo=bar',
    params: {
      bar: 'baz',
    },
  })
})

// 03. 处理post请求参数
getElById('handleRequestBody').addEventListener('click', () => {
  axios({
    method: 'post',
    url: '/api/handleRequestBody/post',
    data: {
      a: 1,
      b: 2,
    },
  })
})

// 04. 处理请求的header
getElById('handleRequestHeader').addEventListener('click', () => {
  // 不添加headers
  axios({
    method: 'post',
    url: '/api/handleRequestHeader/post',
    data: {
      a: 1,
      b: 2,
    },
  })

  // 添加headers
  axios({
    method: 'post',
    url: '/api/handleRequestHeader/post',
    data: {
      a: 1,
      b: 2,
    },
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json,text/plain,*/*',
    },
  })

  // URLSearchParams处理 默认Content-Type: application/x-www-form-urlencoded;charset=UTF-8
  const paramsString = 'q=URLUtils.searchParams&topic=api'
  const searchParams = new URLSearchParams(paramsString)
  axios({
    method: 'post',
    url: '/api/handleRequestHeader/post',
    data: searchParams,
  })
})

// 05. 获取响应数据
getElById('getResponse').addEventListener('click', () => {
  // 1) 不设置request.responseType. 在没有添加transformResponse函数前，默认为text
  axios({
    url: '/api/getResponse',
    method: 'post',
    data: {
      a: 1,
      b: 2,
    },
  }).then((res) => {
    console.log(res)
  })

  // 2) request.responseType = 'text'
  axios({
    url: '/api/getResponse',
    method: 'post',
    data: {
      a: 1,
      b: 2,
    },
    responseType: 'text',
  }).then((res) => {
    console.log(res)
  })

  // 3) request.responseType = 'json'
  axios({
    url: '/api/getResponse',
    method: 'post',
    data: {
      a: 1,
      b: 2,
    },
    responseType: 'json',
  }).then((res) => {
    console.log(res)
  })
})

// 06. 转换response.header
getElById('transformResponseHeader').addEventListener('click', () => {
  axios({
    url: '/api/transformResponseHeader',
    method: 'post',
    data: {
      a: 1,
      b: 2,
    },
  }).then((res) => {
    console.log(res)
  })

  axios({
    method: 'get',
    url: '/api/transformResponseHeader',
    params: {
      a: 1,
      b: 2,
    },
  }).then((res) => {
    console.log(res)
  })
})

// 07. 转换response.data
getElById('transformResponseData').addEventListener('click', () => {
  axios({
    url: '/api/transformResponseData',
    method: 'post',
    data: {
      a: 1,
      b: 2,
    },
  }).then((res) => {
    console.log(res)
  })
})

// 08. 异常处理：基础版
getElById('handleError').addEventListener('click', () => {
  axios({
    url: '/api/handleError',
  })
    .then((res) => console.log(res))
    .catch((err) => {
      console.log(err.message)
      console.log(err.config)
      console.log(err.code)
      console.log(err.request)
      console.log(err.response)
    })

  axios({
    url: '/api/handleError1',
  })
    .then((res) => console.log(res))
    .catch((err) => {
      console.log(err.message)
      console.log(err.config)
      console.log(err.code)
      console.log(err.request)
      console.log(err.response)
    })

  setTimeout(() => {
    axios({
      url: '/api/handleError',
    })
      .then((res) => console.log(res))
      .catch((err) => {
        console.log(err.message)
        console.log(err.config)
        console.log(err.code)
        console.log(err.request)
        console.log(err.response)
      })
  }, 5000)

  axios({
    url: '/api/handleError/timeout',
    timeout: 2000,
  })
    .then((res) => console.log(res))
    .catch((err) => {
      console.log(err.message)
      console.log(err.config)
      console.log(err.code)
      console.log(err.request)
      console.log(err.response)
    })
})

// 09. 接口扩展
getElById('expandInterface').addEventListener('click', () => {
  axios({
    url: '/api/expandInterface/post',
    method: 'post',
    data: {
      msg: 'hi',
    },
  })
    .then((res) => console.log(res))
    .catch((err) => console.log(err))

  axios
    .request({
      url: '/api/expandInterface/post',
      method: 'post',
      data: {
        msg: 'hello',
      },
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err))

  axios
    .get('/api/expandInterface/get')
    .then((res) => console.log(res))
    .catch((err) => console.log(err))

  axios
    .options('/api/expandInterface/options')
    .then((res) => console.log(res))
    .catch((err) => console.log(err))

  axios
    .delete('/api/expandInterface/delete')
    .then((res) => console.log(res))
    .catch((err) => console.log(err))

  axios
    .head('/api/expandInterface/head')
    .then((res) => console.log(res))
    .catch((err) => console.log(err))

  axios
    .post('/api/expandInterface/post', { msg: 'post' })
    .then((res) => console.log(res))
    .catch((err) => console.log(err))

  axios
    .put('/api/expandInterface/put', { msg: 'put' })
    .then((res) => console.log(res))
    .catch((err) => console.log(err))

  axios
    .patch('/api/expandInterface/patch', { msg: 'patch' })
    .then((res) => console.log(res))
    .catch((err) => console.log(err))
})

// 10. 增加参数
getElById('addParameters').addEventListener('click', () => {
  // a) axios(config)
  axios({
    url: '/api/addParameters',
    method: 'post',
    data: {
      msg: 'hi',
    },
  })
    .then((res) => console.log(res))
    .catch((err) => console.log(err))

  // b) axios(url, config)
  axios('/api/addParameters', {
    method: 'post',
    data: {
      msg: 'hello',
    },
  })
    .then((res) => console.log(res))
    .catch((err) => console.log(err))

  // c) axios(url)
  axios('/api/addParameters?a=1&b=2')
    .then((res) => console.log(res))
    .catch((err) => console.log(err))
})

// 11. 让响应数据支持泛型
getElById('addGenericityToAxiosResponse').addEventListener(
  'click',
  async () => {
    interface User {
      name: string
      age: number
    }

    interface ResponseData<T = any> {
      data: T
      msg: string
    }

    function getUser() {
      return axios
        .get<ResponseData<User>>('/api/addGenericityToAxiosResponse')
        .then((res) => res.data.data)
        .catch((err) => console.error(err))
    }

    // a)
    const user = await getUser()
    if (user) {
      console.log(user.name, user.age)
    }

    // b)
    axios<ResponseData<User>>('/api/addGenericityToAxiosResponse')
      .then((res) => {
        const { data: user, msg } = res.data
        console.log(user.name, user.age)
      })
      .catch((err) => console.log(err))
  }
)

// 12. 添加拦截器
getElById('addInterceptors').addEventListener('click', () => {
  // 添加对应拦截器
  let requestInterceptor1 = axios.interceptors.request.use((config) => {
    config.headers.test += 'requestInterceptors1---'
    return config
  })

  let requestInterceptor2 = axios.interceptors.request.use((config) => {
    config.headers.test += 'requestInterceptors2---'
    return config
  })

  let requestInterceptor3 = axios.interceptors.request.use((config) => {
    config.headers.test += 'requestInterceptors3---'
    return config
  })

  let responseInterceptor1 = axios.interceptors.response.use((response) => {
    response.data.test += 'responseInterceptor1---'
    return response
  })

  let responseInterceptor2 = axios.interceptors.response.use((response) => {
    response.data.test += 'responseInterceptor2---'
    return response
  })

  let responseInterceptor3 = axios.interceptors.response.use((response) => {
    response.data.test += 'responseInterceptor3---'
    return response
  })

  // 删除对应拦截器
  axios.interceptors.request.eject(requestInterceptor1)
  axios.interceptors.response.eject(responseInterceptor2)

  axios
    .get('/api/addInterceptors', {
      headers: {
        test: 'NLRX',
      },
    })
    .then((res) => {
      console.log(res)
      // 为了不影响其他接口的测试，此处删除对应的拦截器
      axios.interceptors.request.eject(requestInterceptor2)
      axios.interceptors.request.eject(requestInterceptor3)
      axios.interceptors.response.eject(responseInterceptor1)
      axios.interceptors.response.eject(responseInterceptor3)
    })
    .catch((err) => console.error(err))
})

// 13. 默认配置
getElById('mergeConfig').addEventListener('click', () => {
  axios({
    url: '/api/mergeConfig',
    method: 'post',
    data: {
      a: 1,
    },
    headers: {
      test: '123',
    },
  })
    .then((res) => console.log(res))
    .catch((err) => console.error(err))
})

// 14. 请求和响应数据配置化
getElById('transformData').addEventListener('click', () => {
  // a) axios.post调用
  axios
    .post(
      '/api/transformData',
      {
        a: 1,
      },
      {
        transformRequest: [
          function (data: any) {
            data.a = data.a + 1
            return data
          },
        ],
        transformResponse: [
          function (data: any) {
            data.b = '对响应进行了转换'
            return data
          },
        ],
      }
    )
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.error(err)
    })

  // b) axios()调用
  axios({
    url: '/api/transformData',
    method: 'post',
    data: {
      a: 1,
    },
    transformRequest: [
      function (data: any) {
        data.a = data.a + 1
        return data
      },
    ],
    transformResponse: [
      function (data: any) {
        data.b = '对响应进行了转换'
        return data
      },
    ],
  })
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.error(err)
    })
})

// 15. 增加axios.create接口
getElById('expandCreateInterface').addEventListener('click', () => {
  const axiosInstance1 = axios.create({
    headers: {
      NLRX: 'Hello NLRX',
    },
  })

  axiosInstance1({
    url: '/api/expandCreateInterface',
    method: 'post',
    data: {
      a: 1,
    },
  })
    .then((res) => console.log(res))
    .catch((err) => console.error(err))

  const axiosInstance2 = axios.create({
    headers: {
      test: '123',
    },
  })

  axiosInstance2({
    url: '/api/expandCreateInterface',
    method: 'post',
    data: {
      a: 1,
    },
  })
    .then((res) => console.log(res))
    .catch((err) => console.error(err))
})

// 16. 通过方式二主动取消网络请求
getElById('cancelBySecondMethod').addEventListener('click', () => {
  const CancelToken = axios.CancelToken
  let cancelbySecondMethod: Canceler
  axios
    .get('/api/cancel', {
      cancelToken: new CancelToken((c) => {
        cancelbySecondMethod = c
      }),
    })
    .then((res) => console.log(res))
    .catch((err) => {
      console.error(err)
    })
  // 此时直接调用会报错
  // cancelbySecondMethod('用户通过方式二主动取消网络请求')
  setTimeout(() => {
    cancelbySecondMethod('用户通过方式二主动取消网络请求')
  }, 1000)
})

// 17. 通过方式一主动取消网络请求
getElById('cancelByFirstMethod').addEventListener('click', () => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()
  axios
    .get('/api/cancel', {
      cancelToken: source.token,
    })
    .then((res) => console.log(res))
    .catch((err) => {
      console.error(err)
    })

  setTimeout(() => {
    source.cancel('用户通过方式一主动取消网络请求')
  }, 1000)
})

// 18. 添加axios.isCancel方法
getElById('isCancel').addEventListener('click', () => {
  let source = axios.CancelToken.source()
  axios
    .get('/api/cancel', {
      cancelToken: source.token,
    })
    .then(
      (res) => console.log(res),
      (err) => {
        if (axios.isCancel(err)) {
          console.error(`请求取消原因：${err.message}`)
        }
      }
    )

  source.cancel('测试axios.isCancel方法是否有效')
})

// 19. 多个受相同条件影响的请求取消
getElById('cancelQueue').addEventListener('click', () => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()
  axios
    .get('/api/cancel', {
      cancelToken: source.token,
    })
    .catch((err) => {
      if (axios.isCancel(err)) {
        console.error(`Cancel Reason: `, err.message)
      }
    })

  setTimeout(() => {
    source.cancel('主动取消网络请求')
  }, 1000)

  setTimeout(() => {
    axios
      .get('/api/cancel', {
        cancelToken: source.token,
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.error(`Cancel Reason: `, err.message)
        }
      })
  }, 1500)
})

// 20. 添加WithCredentials属性
getElById('addWithCreadentials').addEventListener('click', () => {
  // a) 未配置new XMLHttpRequest().withCredentials
  axios
    .post('http://127.0.0.1:3000/api/addWithCredentials', {})
    .then((res) => console.log(res))
    .catch((err) => console.error(err))

  // b) 配置new XMLHttpRequest().withCredentials = true, 允许跨域请求携带cookies
  axios
    .post(
      'http://127.0.0.1:3000/api/addWithCredentials',
      {},
      {
        withCredentials: true,
      }
    )
    .then((res) => console.log(res))
    .catch((err) => console.error(err))
})

// 21. 防止XSRF攻击
getElById('defendXSRF').addEventListener('click', () => {
  axios
    .get('http://127.0.0.1:3000/api/defendXSRF', {
      xsrfCookieName: 'XSRF-NLRX',
      xsrfHeaderName: 'X-XSRF-NLRX',
      withCredentials: true,
    })
    .then((res) => console.log(res))
    .catch((err) => console.error(err))
})

// 22. 文件下载及进度监控
const downloadInstance = axios.create({
  onDownloadProgress: (e) => {
    const load = e.loaded
    const total = e.total
    const progress = (load / total) * 100
    console.log('当前下载进度：', progress)
  },
  responseType: 'blob',
})
getElById('download').addEventListener('click', () => {
  downloadInstance
    .get('http://127.0.0.1:3000/api/downloadFile')
    .catch((err) => console.error(err))
})

// 23. 文件上传及进度监控
const uploadInstance = axios.create({
  onUploadProgress: (e) => {
    const load = e.loaded
    const total = e.total
    const progress = (load / total) * 100
    console.log('当前上传进度：', progress)
  },
})

getElById('upload').addEventListener('click', () => {
  const data = new FormData()
  const file = getElById('file') as HTMLInputElement
  if (file.files && file.files.length) {
    data.append('file', file.files[0])
    uploadInstance
      .post('/api/uploadFile', data)
      .then((res) => console.log(res))
      .catch((err) => console.error(err))
  } else {
    window.alert('请先点击"选择文件"选择您想上传的本地文件')
  }
})

// 24. 添加HTTP授权auth属性
getElById('HTTPAuthorization').addEventListener('click', () => {
  axios
    .get('http://127.0.0.1:3000/api/HTTPAuthorization', {
      auth: {
        username: 'NLRX',
        password: '123456',
      },
    })
    .then((res) => console.log(res))
    .catch((err) => console.error(err))
})

// 25. 添加validateStatus属性
getElById('checkStatus').addEventListener('click', () => {
  // a) 默认允许status: 200 ~ 300
  axios
    .get('/api/checkStatus')
    .then((res) => console.log(res))
    .catch((err) => console.error(err))

  // b) 配置允许 200 ~ 399
  axios
    .get('/api/checkStatus', {
      validateStatus: (status) => {
        return status >= 200 && status < 400
      },
    })
    .then((res) => console.log(res))
    .catch((err) => console.error(err))

  // c) 不进行状态码校验
  axios
    .get('/api/checkStatus', {
      validateStatus: null,
    })
    .then((res) => console.log(res))
    .catch((err) => console.error(err))
})

// 26. 自定义序列化参数请求
getElById('addParamsSerializer').addEventListener('click', () => {
  // a) 正常请求无参数
  axios
    .get('/api/addParamsSerializer')
    .then((res) => console.log(res))
    .catch((err) => console.error(err))

  // b) 自定义序列化参数
  axios
    .get('/api/addParamsSerializer', {
      params: {
        a: 1,
        b: 2,
        c: ['a', 'b', 'c'],
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'brackets' })
      },
    })
    .then((res) => console.log(res))
    .catch((err) => console.error(err))

  // c) params是URLSearcchParams对象实例
  axios
    .get('/api/addParamsSerializer', {
      params: new URLSearchParams('a=1&b=2'),
    })
    .then((res) => console.log(res))
    .catch((err) => console.error(err))

  // d) 默认处理
  axios
    .get('/api/addParamsSerializer', {
      params: {
        a: 1,
        b: 2,
        c: ['a', 'b', 'c'],
      },
    })
    .then((res) => console.log(res))
    .catch((err) => console.error(err))
})

// 27. 添加baseURL
getElById('baseURL').addEventListener('click', () => {
  const baseURLInstance = axios.create({
    baseURL: 'http://127.0.0.1:3000/',
  })

  // a) 拼接
  baseURLInstance
    .get('/api/baseURL')
    .then((res) => console.log(res))
    .catch((err) => console.error(err))

  // b) 不拼接
  baseURLInstance
    .get('http://127.0.0.1:3000/api/baseURL')
    .then((res) => console.log(res))
    .catch((err) => console.error(err))
})

// 28. getUri
getElById('getUri').addEventListener('click', () => {
  const config: AxiosRequestConfig = {
    baseURL: 'http://127.0.0.1:3000',
    url: '/api/NLRX',
    params: {
      a: 1,
      b: 2,
      c: ['a', 'b', 'c'],
    },
  }

  console.log(axios.getUri(config))
})

// 29. 添加axios.all和axios.spread方法
getElById('allAndSpread').addEventListener('click', () => {
  interface resultA {
    status: string
    data: string
  }

  interface resultB {
    status: string
    data: number
    message: string
  }

  const requestA = axios.get<resultA>('/api/allAndSpreadA')
  const requestB = axios.get<resultB>('/api/allAndSpreadB')

  // 1) 只调用axios.all
  axios
    .all([requestA, requestB])
    .then(([resA, resB]) => {
      console.log(resA.data.status, resA.data.data)
      console.log(resB.data.status, resB.data.data, resB.data.message)
    })

  // 2) 调用axios.all以及axios.spread
  axios
    .all([requestA, requestB])
    .then(axios.spread((resA, resB) => {
      console.log(resA.data.status, resA.data.data)
      console.log(resB.data.status, resB.data.data, (resB as AxiosResponse<resultB>).data.message)
    }))

  // 3) 调用Promise.all (推荐)
  Promise.all<[AxiosPromise<resultA>, AxiosPromise<resultB>]>([requestA, requestB]).then(([resA, resB]) => {
    console.log(resA.data.status, resA.data.data)
    console.log(resB.data.status, resB.data.data, resB.data.message)
  })
})
