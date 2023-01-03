/***
 * 将baseURL与当前请求url合并成最终url
 */
export default function combineURLs(
  baseURL: string,
  relativeURL?: string
): string {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL
}
