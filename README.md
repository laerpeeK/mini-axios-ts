# mini-axios-ts
## Before reading
**已完结**
**此轮子是根据[ts-axios](https://github.com/NLRX-WJC/ts-axios)系列文章的复现以及进一步优化。最大的特点是用更详细以及更容易理解的方式去实现部分功能模块包括`interceptor`|`tranformRequest`|`tranformResponse`|`CancelToken`等，以及新功能`支持文件的上传与下载`等**

**目录：**

1. [优化说明](https://github.com/laerpeeK/mini-axios-ts#optimization)
2. [实现功能列表](https://github.com/laerpeeK/mini-axios-ts#features)
3. [具体优化项以及调试说明](https://github.com/laerpeeK/mini-axios-ts#debug)
4. [CancelToken原理解析](https://github.com/laerpeeK/mini-axios-ts#CancelToken)

## Optimization
1. 原文章项目的构建，使用方式比较复杂。此仓库采用轻量化Webpack配置，实现了一个极其简洁的项目构建，测试方案。
   **可以通过以下步骤得到一个最简单的起始项目**
      +  切换到此仓库的`init`分支进行本地`git clone --branch init 对应方式地址`  。得到基础项目
      +  cd server -> npm run server 得到运行在 `http://127.0.0.1:3000` 的API服务端
      +  cd client -> npm run client 得到运行在 `http://127.0.0.1:8080` 的客户端测试网页
      +  根据`原系列文章`[ts-axios](https://github.com/NLRX-WJC/ts-axios)以及此仓库[mini-axios-ts#Debug](https://github.com/laerpeeK/mini-axios-ts#debug)记录进行对应代码书写。
      +  打开浏览器，输入 `http://127.0.0.1:8080` -> F12 切换到`Network`查看效果。
   
   

   **也可通过以下步骤获得一个已实现便于调试的项目**
   
      +  切换到此仓库的`main`分支进行本地`git clone --branch main 对应方式地址`。得到基础项目
      +  cd server -> npm run server 得到运行在 `http://127.0.0.1:3000` 的API服务端
      +  cd client -> npm run client 得到运行在 `http://127.0.0.1:8080` 的客户端测试网页
      +  打开浏览器，输入 `http://127.0.0.1:8080` -> F12打开开发者工具切换到`Network`查看效果。
      +  通过点击页面上对应按钮触发网络请求，再通过F12打开开发者工具切换到`Network`查看效果
   
   

2. 原文章的实现大概为2020年，此仓库实现为2022~2023年。 `axios`, `TypeScript`已经迭代多个版本。
此仓库同步TypeScript@4, axios@1进行实现。在已废弃功能以及新特性上进行了对应Debug补充。

3. `client`端优化详见[mini-axios-ts#Debug](https://github.com/laerpeeK/mini-axios-ts#debug)。
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
+ 支持请求的主动取消
+ 支持通过axios.isCancel(reason)判断报错是否是主动取消网络请求
+ 支持相同CancelToken实例的取消完成后的`防抖`操作
+ 客户端支持通过配置`withCredentials`实现跨域请求携带cookie
+ 客户端防止XSRF
+ 支持上传下载进度监控
+ 支持上传下载功能
+ 支持配置`HTTPAuthorization`
+ 支持配置状态码校验函数`validateStatus`, 优化了该项类型定义，允许用户配置时传入null取消状态码校验
+ 支持自定义序列化请求参数函数`paramsSerializer`
+ 支持`baseURL`的添加
+ 支持`getUri`方法
+ 支持`all`以及`spread`方法 (类型声明上仍然不够严谨)


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
18. 请求和响应数据配置化：优化了`ransformRequest`以及`transformResponse`在默认配置和用户配置的合并，在实际测试调用时不需要采用[userTransformRequst, ...axios.defaults.transformRequest]这种重复引入的方式，会自行合并。具体查看`core/mergeConfig.ts`的代码实现
19. axios.CancelToken原理解析，具体查看[mini-axios-ts#CancelToken](https://github.com/laerpeeK/mini-axios-ts#canceltoken)
20. `CancelToken.ts`的`resolePromise`接口进行了简化，`type/index.ts`的`Canceler`同样进行了简化，调用`cancel(message)`取消网络请求时一定要传入对应的message
21. 封装`CancelToken.source`的好处在于实际调用该方法时，就已经返回了对应的`token`以及`cancel`。可以在`axios.get`之余方法调用后直接调用`cancel(message)`。 否则在`ts静态检测阶段`，如果在config.cancelToken再去new CancelToken传入一个executor去给cancel赋值，会出现`在给cancel赋值前使用了cancel`的报错，这种时候需要异步执行cancel。详见测试用例`16：通过方式二主动取消网络请求`
22. 防止XSRF攻击：优化了`helpers/isURLSameOrigin.ts`, 采用更严谨的方式来处理`protocol`, `host`, `port`
23. 防止XSRF攻击：优化了server端`app.js`的`cors`, `app.options`的处理方式。
24. 文件上传下载进度监控：添加了实际上传下载功能的实现，具体查看对应代码
25. 文件下载功能实现：查看`client/axios/helpers/data.ts/transformResponse`函数实现以及对应的测试用例，`server/app.js`对应的`22`接口
26. 文件上传功能实现：通过`multer`实现
27. 添加HTTP授权auth属性：具体好处可参考此文章[Http auth认证的两种方式Basic方式和 Digest认证](https://blog.csdn.net/Virgil_K2017/article/details/92573833), 这里补充一下：
    +  *digest*认证在服务端是通过客户端发送过来的`username`在服务端查找其对应的`password`,解决了密码明文传输的问题。
    +  这两种认证方式都是在没有办法使用`HTTPS`认证下的备选，都存在安全问题。
28. 自定义序列化请求参数：这章在`client`文件夹安装`qs`时，需要安装对应的`*.d.ts`支持, 因此应该在`client`文件夹下执行`npm install @types/qs --save -dev`
29. axios.all和axios.spread：目前`axios`官方已弃用这两个方法，axios.all类型约束可参考`Promise.all`,因此这个库就不实现了，而是以`Promise.all`的类型取代`axios.all`。删除了`axios.spread`功能。原文章实现的axios.all以及axios.spread可以理解为语法糖做法，且在响应数据泛型设置上是存在`无法同时约束多个返回值`的问题。
30. `axios.all`的类型定义难度在于`all`方法入参泛型T为`[AxiosPromise<resultA>, AxiosPromise<resultB>]`, 但返回值却要是`Promise<[AxiosResponse<resultA>, AxiosResponse<resultB>]>`。 如果你的`TypeScript`理解够深，不妨实现一下上述描述然后提个`pull request`,感谢！
31. 对于`axios.spread`, 的类型定义，泛型`T`应该为`数组类型`, 对应`[AxiosResponse<resultA>, AxiosResponse<resultB>]`。 同上，如果可以实现对应的类型注解，同样欢迎`pull request`。

## CancelToken

1. CancelToken这个类初始化的时候需要传递一个方法executor，并且它的内部新建了一个promise，最关键的是，**它把promise的resolve方法的执行放在了executor方法入参`c`里面**(重复理解这句话，对理解CancelToken设定非常重要)

```javascript
// CancelToken类的实现
// （如果理解这个，就不需要再看下面其他2，3， 4， ......）
class CancelToken {
	constructor(executor){
        let resolveHandle
        this.promise = new Promise(resolve => {
            resolveHandle = resolve
        })
        executor(function (message) {
            if (this.reason) {
                return
            }
            this.reason = message
            resolveHandle(this.reason)
        })
    }
    
    static source() {
    let cancel
    let token = new CancelToken((c) => {
        cancel = c
    })
    return {
        cancel,
        token
    	}
	}
}

// 调用
const cancelProof = CancelToken.source()
cancelProof.cancel('this is cancel Message')
cancelProof.token.promise.then(res => {
    console.log(res) // this.is cancel Message
})
```

2.  
   + axios.CancelToken是一个类
   + axiosCancelToken.source()是静态方法，调用的是CancelToken类的静态source方法
   + axiosCancelToken.source()会返回`token`以及`cancel`
   + `token`是新创建的CancelToken实例， `cancel`是`token`即`CancelToken`实例构建时，对应的用于触发Promise`resolve`控制权的`resolveHandle`。
   + 因此，一旦调用了`cancel`方法，即将`token`（也就是新创建的CancelToken实例）构建的promise设为`resolved`, 从而可以在这个promise的`then`方法里**触发实际的网络请求取消。** （伪代码：promise.then(res => {xml.abort(), reject(res)})）
3. 综上所述，因此在axios()调用，传入的config需要传入`token`（即创建的CancelToken实例）, 此外，在需要主动取消时需要调用`cancel`方法（即将创建的CancelToken实例里的promise设为resolved，从而触发对应的then方法，取消网络请求。）

4. 因为每个axios()调用如果都要携带主动取消功能，就需要对应的`token`以及`cancel`。两者的关系绑定通过`CancelToken`的静态方法`source`调用返回值实现。于是就能看到以下调用。

```javascript
const cancelProof1 = axios.CancelToken.source()
const cancelProof2 = axios.CancelToken.source()


axios.get(url, {
    cancelToken: cancelProof1.token
})

axios.post(url, data {
	cancelToken: cancelProof2.token           
})

cancelProof1.cancel('取消第一个请求')
cancelProof2.cancel('取消第二个请求')
```

 5. 此除之所以要在axios()调用时，传入config.cancelToken为对应的`token`是因为要通过promise.then触发网络请求取消，因此通过获取当前axios.get, axios.post调用时传入的config.CancelToken, 从而获取到对应的promise.then。 

 6. new CancelToken传入的`executor`是为了获取到可在外部调用的`cancel`方法，CancelToken.constructor内部`executor(fn)`执行时这里的`fn`为实际的promise.resolve方法。当你调用`cancel(message)`时，即调用`fn(message)`。所以在具体的CancelToken.source源码为：

    ```javascript
    CancelToken.source = function source() {
    	var cancel
    	var token = new CancelToken(function executor(c) => {
    		cancel = c
    	})
    	return {
    		cancel,
    		token
    	}
    }
    
    ```

 7. 而CancelToken类的实现如下：

    ```javascript
    class CancelToken {
    	constructor(executor) {
    		let resolveHandle
    		this.promise = new Promise(resolve => {
    			resolveHandle = resolve
    		})
    		executor((message) => {
    			if (this.reason) {
    				return
    			}
    			this.reason = message
    			resolveHandle(message)
    		})
    	}
    }
    ```

 8. 从而在外部调用`cancel('message')`触发以下入参函数

    ```javascript
    cancel函数 等价于 c  等价于executor的入参函数：(message) => {
    	if(this.reason) {
    		return
    	}
    	this.reason = message
    	resolveHandle(message)
    }
    ```

    



## XMLHttpRequest

```typescript
interface XMLHttpRequest extends XMLHttpRequestEventTarget {
    onreadystatechange: ((this: XMLHttpRequest, ev: Event) => any) | null;
    /** Returns client's state. */
    readonly readyState: number;
    /** Returns the response body. */
    readonly response: any;
    /**
     * Returns response as text.
     *
     * Throws an "InvalidStateError" DOMException if responseType is not the empty string or "text".
     */
    readonly responseText: string;
    /**
     * Returns the response type.
     *
     * Can be set to change the response type. Values are: the empty string (default), "arraybuffer", "blob", "document", "json", and "text".
     *
     * When set: setting to "document" is ignored if current global object is not a Window object.
     *
     * When set: throws an "InvalidStateError" DOMException if state is loading or done.
     *
     * When set: throws an "InvalidAccessError" DOMException if the synchronous flag is set and current global object is a Window object.
     */
    responseType: XMLHttpRequestResponseType;
    readonly responseURL: string;
    /**
     * Returns the response as document.
     *
     * Throws an "InvalidStateError" DOMException if responseType is not the empty string or "document".
     */
    readonly responseXML: Document | null;
    readonly status: number;
    readonly statusText: string;
    /**
     * Can be set to a time in milliseconds. When set to a non-zero value will cause fetching to terminate after the given time has passed. When the time has passed, the request has not yet completed, and this's synchronous flag is unset, a timeout event will then be dispatched, or a "TimeoutError" DOMException will be thrown otherwise (for the send() method).
     *
     * When set: throws an "InvalidAccessError" DOMException if the synchronous flag is set and current global object is a Window object.
     */
    timeout: number;
    /** Returns the associated XMLHttpRequestUpload object. It can be used to gather transmission information when data is transferred to a server. */
    readonly upload: XMLHttpRequestUpload;
    /**
     * True when credentials are to be included in a cross-origin request. False when they are to be excluded in a cross-origin request and when cookies are to be ignored in its response. Initially false.
     *
     * When set: throws an "InvalidStateError" DOMException if state is not unsent or opened, or if the send() flag is set.
     */
    withCredentials: boolean;
    /** Cancels any network activity. */
    abort(): void;
    getAllResponseHeaders(): string;
    getResponseHeader(name: string): string | null;
    /**
     * Sets the request method, request URL, and synchronous flag.
     *
     * Throws a "SyntaxError" DOMException if either method is not a valid method or url cannot be parsed.
     *
     * Throws a "SecurityError" DOMException if method is a case-insensitive match for `CONNECT`, `TRACE`, or `TRACK`.
     *
     * Throws an "InvalidAccessError" DOMException if async is false, current global object is a Window object, and the timeout attribute is not zero or the responseType attribute is not the empty string.
     */
    open(method: string, url: string | URL): void;
    open(method: string, url: string | URL, async: boolean, username?: string | null, password?: string | null): void;
    /**
     * Acts as if the `Content-Type` header value for a response is mime. (It does not change the header.)
     *
     * Throws an "InvalidStateError" DOMException if state is loading or done.
     */
    overrideMimeType(mime: string): void;
    /**
     * Initiates the request. The body argument provides the request body, if any, and is ignored if the request method is GET or HEAD.
     *
     * Throws an "InvalidStateError" DOMException if either state is not opened or the send() flag is set.
     */
    send(body?: Document | XMLHttpRequestBodyInit | null): void;
    /**
     * Combines a header in author request headers.
     *
     * Throws an "InvalidStateError" DOMException if either state is not opened or the send() flag is set.
     *
     * Throws a "SyntaxError" DOMException if name is not a header name or if value is not a header value.
     */
    setRequestHeader(name: string, value: string): void;
    readonly DONE: number;
    readonly HEADERS_RECEIVED: number;
    readonly LOADING: number;
    readonly OPENED: number;
    readonly UNSENT: number;
    addEventListener<K extends keyof XMLHttpRequestEventMap>(type: K, listener: (this: XMLHttpRequest, ev: XMLHttpRequestEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof XMLHttpRequestEventMap>(type: K, listener: (this: XMLHttpRequest, ev: XMLHttpRequestEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
```

## XMLHttpRequestEventTarget

```typescript
interface XMLHttpRequestEventTarget extends EventTarget {
    onabort: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
    onerror: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
    onload: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
    onloadend: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
    onloadstart: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
    onprogress: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
    ontimeout: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
    addEventListener<K extends keyof XMLHttpRequestEventTargetEventMap>(type: K, listener: (this: XMLHttpRequestEventTarget, ev: XMLHttpRequestEventTargetEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof XMLHttpRequestEventTargetEventMap>(type: K, listener: (this: XMLHttpRequestEventTarget, ev: XMLHttpRequestEventTargetEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
```



##  XMLHttpRequest.prototype.upload

```typescript
interface XMLHttpRequestUpload extends XMLHttpRequestEventTarget {
    addEventListener<K extends keyof XMLHttpRequestEventTargetEventMap>(type: K, listener: (this: XMLHttpRequestUpload, ev: XMLHttpRequestEventTargetEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof XMLHttpRequestEventTargetEventMap>(type: K, listener: (this: XMLHttpRequestUpload, ev: XMLHttpRequestEventTargetEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
```



## XMLHttpRequestBodyInit

```typescript
type XMLHttpRequestBodyInit = Blob | BufferSource | FormData | URLSearchParams | string;
```



## ProgressEvent

```typescript
/** Events measuring progress of an underlying process, like an HTTP request (for an XMLHttpRequest, or the loading of the underlying resource of an <img>, <audio>, <video>, <style> or <link>). */
interface ProgressEvent<T extends EventTarget = EventTarget> extends Event {
    readonly lengthComputable: boolean;
    readonly loaded: number;
    readonly target: T | null;
    readonly total: number;
}
```



## EventTarget

```typescript
interface EventTarget {
    /**
     * Appends an event listener for events whose type attribute value is type. The callback argument sets the callback that will be invoked when the event is dispatched.
     *
     * The options argument sets listener-specific options. For compatibility this can be a boolean, in which case the method behaves exactly as if the value was specified as options's capture.
     *
     * When set to true, options's capture prevents callback from being invoked when the event's eventPhase attribute value is BUBBLING_PHASE. When false (or not present), callback will not be invoked when event's eventPhase attribute value is CAPTURING_PHASE. Either way, callback will be invoked if event's eventPhase attribute value is AT_TARGET.
     *
     * When set to true, options's passive indicates that the callback will not cancel the event by invoking preventDefault(). This is used to enable performance optimizations described in § 2.8 Observing event listeners.
     *
     * When set to true, options's once indicates that the callback will only be invoked once after which the event listener will be removed.
     *
     * If an AbortSignal is passed for options's signal, then the event listener will be removed when signal is aborted.
     *
     * The event listener is appended to target's event listener list and is not appended if it has the same type, callback, and capture.
     */
    addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: AddEventListenerOptions | boolean): void;
    /** Dispatches a synthetic event event to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise. */
    dispatchEvent(event: Event): boolean;
    /** Removes the event listener in target's event listener list with the same type, callback, and options. */
    removeEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void;
}
```



## Event

```typescript
interface Event {
    /** Returns true or false depending on how event was initialized. True if event goes through its target's ancestors in reverse tree order, and false otherwise. */
    readonly bubbles: boolean;
    cancelBubble: boolean;
    /** Returns true or false depending on how event was initialized. Its return value does not always carry meaning, but true can indicate that part of the operation during which event was dispatched, can be canceled by invoking the preventDefault() method. */
    readonly cancelable: boolean;
    /** Returns true or false depending on how event was initialized. True if event invokes listeners past a ShadowRoot node that is the root of its target, and false otherwise. */
    readonly composed: boolean;
    /** Returns the object whose event listener's callback is currently being invoked. */
    readonly currentTarget: EventTarget | null;
    /** Returns true if preventDefault() was invoked successfully to indicate cancelation, and false otherwise. */
    readonly defaultPrevented: boolean;
    /** Returns the event's phase, which is one of NONE, CAPTURING_PHASE, AT_TARGET, and BUBBLING_PHASE. */
    readonly eventPhase: number;
    /** Returns true if event was dispatched by the user agent, and false otherwise. */
    readonly isTrusted: boolean;
    /** @deprecated */
    returnValue: boolean;
    /** @deprecated */
    readonly srcElement: EventTarget | null;
    /** Returns the object to which event is dispatched (its target). */
    readonly target: EventTarget | null;
    /** Returns the event's timestamp as the number of milliseconds measured relative to the time origin. */
    readonly timeStamp: DOMHighResTimeStamp;
    /** Returns the type of event, e.g. "click", "hashchange", or "submit". */
    readonly type: string;
    /** Returns the invocation target objects of event's path (objects on which listeners will be invoked), except for any nodes in shadow trees of which the shadow root's mode is "closed" that are not reachable from event's currentTarget. */
    composedPath(): EventTarget[];
    /** @deprecated */
    initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void;
    /** If invoked when the cancelable attribute value is true, and while executing a listener for the event with passive set to false, signals to the operation that caused event to be dispatched that it needs to be canceled. */
    preventDefault(): void;
    /** Invoking this method prevents event from reaching any registered event listeners after the current one finishes running and, when dispatched in a tree, also prevents event from reaching any other objects. */
    stopImmediatePropagation(): void;
    /** When dispatched in a tree, invoking this method prevents event from reaching any objects other than the current object. */
    stopPropagation(): void;
    readonly AT_TARGET: number;
    readonly BUBBLING_PHASE: number;
    readonly CAPTURING_PHASE: number;
    readonly NONE: number;
}
```





## EventTarget





## MIME(媒体类型)

### 常见例子

- `application/javascript`
- `application/json`
- `application/ld+json`
- `application/msword`(.doc)
- `application/pdf`
- `application/sql`
- `application/vnd.api+json`
- `application/vnd.ms-excel`(.xls)
- `application/vnd.ms-powerpoint`(.ppt)
- `application/vnd.oasis.opendocument.text`(.odt)
- `application/vnd.openxmlformats-officedocument.presentationml.presentation`(.pptx)
- `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`(.xlsx)
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document`(.docx)
- `application/x-www-form-urlencoded`
- `application/xml`
- `application/zip`
- `application/zstd`(.zst)
- `audio/mpeg`
- `audio/ogg`
- `image/avif`
- `image/jpeg`（.jpg、.jpeg、.jfif、.pjpeg、.pjp）[[11\]](https://en.wikipedia.org/wiki/Media_type#cite_note-11)
- `image/png`
- `image/svg+xml`(.svg)
- `multipart/form-data`
- `text/plain`
- `text/css`
- `text/csv`
- `text/html`
- `text/xml`



