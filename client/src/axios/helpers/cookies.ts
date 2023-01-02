/**
 * 获取cookie详情
 */
const cookie = {
  read(name: string): string | null {
    const match = document.cookie.match(
      new RegExp("(^|;\\s*)(" + name + ")=([^;]*)")
    )
    return match ? decodeURIComponent(match[3]) : null
  }
}

export default cookie