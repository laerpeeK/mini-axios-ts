# mini-axios-ts
## Before reading
**该仓库完整实现部分已添加到`Features`, 更多功能正在以更好的方式进行补充中~**
此轮子是根据[ts-axios](https://github.com/NLRX-WJC/ts-axios)系列文章复现，且再进一步优化而来的。

## Optimization
1. 原文章项目的构建，使用方式比较复杂。此仓库采用轻量化Webpack配置，实现了一个极其简洁的项目构建，测试方案。
   **可以通过以下步骤得到一个最简单的起始项目**
      +  切换到此仓库的`init`分支进行本地`git clone --branch init 对应方式地址`  。得到基础项目
      +  cd server -> npm run server 得到运行在 `http://127.0.0.1:3000` 的API服务端
      +  cd client -> npm run client 得到运行在 `http://127.0.0.1:8080` 的客户端测试网页
      +  根据`原系列文章`[ts-axios](https://github.com/NLRX-WJC/ts-axios)以及此README `Debug` 记录进行对应代码书写。
      +  打开浏览器，输入 `http://127.0.0.1:8080` -> F12 切换到`Performance`查看效果。
   
   

   **也可通过以下步骤获得一个已实现便于调试的项目**
   
      +  切换到此仓库的`main`分支进行本地`git clone --branch main 对应方式地址`。得到基础项目
      +  cd server -> npm run server 得到运行在 `http://127.0.0.1:3000` 的API服务端
      +  cd client -> npm run client 得到运行在 `http://127.0.0.1:8080` 的客户端测试网页
      +  打开浏览器，输入 `http://127.0.0.1:8080` -> F12打开开发者工具切换到`Performance`查看效果。
      +  通过点击页面上对应按钮触发网络请求，再通过F12打开开发者工具切换到`Performance`查看效果
   
   

2. 原文章的实现大概为2020年，此仓库实现为2022~2023年。 `axios`, `TypeScript`已经迭代多个版本。
此仓库同步TypeScript@4, axios@1进行实现。在已废弃功能以及新特性上进行了对应Debug补充。

3. `client`端对各个功能进行了更详细的注释, 部分不易理解的代码逻辑进行了优化。方便源码的阅读。
4. `server`端完善了请求错误处理机制以及跨域处理方式。

## Features
+ 在浏览器端使用XMLHttpRequest对象通讯 
+ 支持PromiseAPI 
+ 处理get请求url参数  
+ 处理post请求参数 
+ 处理请求的header 
+ 获取正确的响应数据 
+ 转换响应头部 
+ 转换响应数据类型 
+ 异常处理 
+ 接口扩展，支持 axios.(`request`| `get` | `delete` | `head` | `options` | `put` | `patch` | `put`)以及`axios(config)` 
+ 允许axios(url, config?)以及axios(config)调用
+ 响应数据添加泛型约束
+ 支持请求和响应的拦截器
+ axios自身的默认配置包括`timeout`, `headers`, `transformRequest`, `transformResponse`
+ 支持请求数据和响应数据的转换
+ 支持axios.create方法

**进行中**
+ 支持请求的取消
+ JSON数据的自动转换
+ 客户端防止XSRF

## Debug
1. 处理get请求url参数: params[key]对应值为undefined时，不直接删除，而是保留key=''
2. 处理get请求url参数: 测试用例中`url中已存在的参数`应该为`url已存在部分参数`
3. 处理get请求url参数：hash情况下改为：去除哈希标志#后的参数，并且拼接config.params参数
4. 处理请求的header: 优化`helpers/headers.ts`中的`normalizeHeaderName`函数，已知默认传入headers为空对象
4. `helpers/error.ts`中的`Object.setPrototypeOf(this, AxiosError.prototype)` 这只是一个巧妙的解决方式用来应对 Error 类的原型问题， 具体原因参照
   [为什么扩展内置函数（如 Error、Array 和 ）Map 不起作用？](https://github.com/Microsoft/TypeScript/wiki/FAQ#why-doesnt-extending-built-ins-like-error-array-and-map-work)
6. 异常处理：增强版中`xhr.ts`应该引入工厂函数`createError`而非`AxiosError`, 否则不应该使用`createError()`而是在对应位置使用`new AxiosError`
7. 接口扩展时，`helpers/data.ts`的`transformResponse`函数应该先判断是否存在data再进行类型判断, 因为响应可能为空, 此时
    如果JSON.parse()入参为空会报错
8. 增加参数：`core/Axios.ts`的`request`方法第一个参数`url`的类型修改为`string | AxiosRequestConfig`
9. 增加参数： 新增一个请求时不需要config参数的测试用例 `axios('/api/addParameters')` 以及`server/app.ts`增加 `app.get('/api/addParameters', (req, res) => {res.json(req.query)})`
10. 让响应数据支持泛型: 修改了测试用例的写法， 在未启用拦截器解包之前，AxiosResponse.data 应该为返回数据整体即`{data: {name: 'NLRX', age: 18}, msg: 'hello world'}`需要二次解包res.data.data才是类型`User`
11. 拦截器执行顺序：请求拦截器遵循栈的顺序`先入后出`，响应拦截器遵循队列的顺序`先入先出`
12. 拦截器这章推荐按照我这边的代码结构进行书写，会比原文章清晰的多。
13. 拦截器这章重点关注这五个接口的定义：
    + `Interceptor`: 单组成功/失败拦截器
    + `InterceptorManager`：axios.interceptors.request实例以及axios.interceptors.response的构造类
    + `ResolvedFn` ：成功拦截器，包括入参为`AxiosRequestConfig`以及`AxiosResponse`这两种
    + `RejectedFn`: 失败拦截器，就是一个常规的错误函数 (err: any): any
    + `PromiseArr`: 请求时链式调用数组，包括了拦截器`{ResolvedFn, RejectedFn}`与常规请求`{dispatchRequest}`

14. 拦截器类`interceptorManager`新增`stack`和`queue`方法，用于请求/响应拦截器的添加。原先是直接调用`this.interceptors.request.interceptors`以及`this.interceptors.response.interceptors`破坏了`interceptorManager`类的`private`特性。
15. axios默认配置：`defaults.ts`中`methodsNoData`修改为`requestWithoutDataMethods`，`methodsWithData`修改为`requestWithDataMethods`
15. axios默认配置：`core/mergeConfig.ts`中`defaultToUserConfig`修改为`routineProperties`;`valueFromUserConfig`修改为`valueFromUserProperties`
16. axios默认配置：`core/mergeConfig.ts`中`mergeConfig`函数对深度合并的判断条件进行了相关注释。
17. axios默认配置：`helpers.ts`中`flattenHeaders`函数入参method改为可选，因为支持`axios(url)`的默认`GET`调用。
18. 请求和响应数据配置化：优化了`ransformRequest`以及`transformResponse`在默认配置和用户配置的合并，在实际测试调用时不需要采用[userTransformRequst, ...axios.defaults.transformRequest]这种重复引入的方式，会自行合并。具体查看`core/mergeConfig.ts`的代码