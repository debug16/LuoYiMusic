/**
 * 获取指定大小的图片
 * @param url 图片链接
 * @param param 大小
 * @returns 
 */
export const imgUrlSize = (url: string | undefined, param?: number | undefined) => {
  if(!url) return '';
  const start = url.lastIndexOf('/')
  const end = url.lastIndexOf('.')

  const flag = url.slice(start+1,end) === '5639395138885805'
  if(flag) return `https://p2.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg?param=${param}y${param}`
  const urlParam = param ? `?param=${param}y${param}` : ''
  const img = url ? url + urlParam : ''
  return img
}