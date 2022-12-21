/**
 * 获取指定大小的图片
 * @param url 图片链接
 * @param param 大小
 * @returns 
 */
export const imgUrlSize = (url: string, param?: number | string) => {
  param = param ? `?param=${param}y${param}` : ''
  const img = url ? url + param : ''
  return img
}