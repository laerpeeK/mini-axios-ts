interface URLOrigin {
  protocol: string
  host: string
  port: string
}

/**
 * 判断请求url是否与当前页面url同源
 * @param requestURL 
 * @returns 
 */
export default function isURLSameOrigin(requestURL: string): boolean {
  // 1) 先获取当前页面地址的协议，域名，端口号
  const currentPageOrigin = resolveURL(window.location.href)

  // 2) 再获取请求url的协议，域名，端口号
  const requestOrigin = resolveURL(requestURL)

  // 3) 比较两者是否同源
  return (
    requestOrigin.protocol === currentPageOrigin.protocol &&
    requestOrigin.host === currentPageOrigin.host &&
    requestOrigin.port === currentPageOrigin.port
  )
}

/**
 * 解析一个url地址，并返回其协议，域名，端口号
 * @param url 
 * @returns 
 */
 function resolveURL(url: string): URLOrigin {
  let urlParsingNode = document.createElement('a')
  urlParsingNode.setAttribute('href', url)

  let { protocol, host, port } = urlParsingNode
  protocol = protocol ? protocol.replace(/:$/, '') : `${Math.random()}`
  host = host ? host : `${Math.random()}`
  port = port ? port : ''

  return {
    protocol,
    host,
    port
  }
}