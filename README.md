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
   +  通过点击页面上对应按钮触发网络请求，再通过F12打开开发者工具切换到`Performance`查看效果。

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

**进行中**
+ 支持请求和响应的拦截器
+ 支持请求数据和响应数据的转换
+ 支持请求的取消
+ JSON数据的自动转换
+ 客户端防止XSRF

## Debug
1. 处理get请求url参数: params[key]对应值为undefined时，不直接删除，而是保留key=''
2. 处理get请求url参数: 测试用例中`url中已存在的参数`应该为`url已存在部分参数`
3. 处理get请求url参数：hash情况下改为：去除哈希标志#后的参数，并且拼接config.params参数
3. 处理请求的header: 优化`helpers/headers.ts`中的`normalizeHeaderName`函数，已知默认传入headers为空对象
4. `helpers/error.ts`中的`Object.setPrototypeOf(this, AxiosError.prototype)` 这只是一个巧妙的解决方式用来应对 Error 类的原型问题， 具体原因参照
   [为什么扩展内置函数（如 Error、Array 和 ）Map 不起作用？](https://github.com/Microsoft/TypeScript/wiki/FAQ#why-doesnt-extending-built-ins-like-error-array-and-map-work)
5. 异常处理：增强版中`xhr.ts`应该引入工厂函数`createError`而非`AxiosError`, 否则不应该使用`createError()`而是在对应位置使用`new AxiosError`
6. 接口扩展时，`helpers/data.ts`的`transformResponse`函数应该先判断是否存在data再进行类型判断, 因为响应可能为空, 此时
如果JSON.parse()入参为空会报错
