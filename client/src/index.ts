import axios from './axios'

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

  axios.interceptors.request.use((config) => {
    config.headers.test += 'requestInterceptors2---'
    return config
  })

  axios.interceptors.request.use((config) => {
    config.headers.test += 'requestInterceptors3---'
    return config
  })

  axios.interceptors.response.use((response) => {
    response.data.test += 'responseInterceptor1---'
    return response
  })

  let responseInterceptor2 = axios.interceptors.response.use((response) => {
    response.data.test += 'responseInterceptor2---'
    return response
  })

  axios.interceptors.response.use((response) => {
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
    .then((res) => console.log(res))
    .catch((err) => console.error(err))
})
