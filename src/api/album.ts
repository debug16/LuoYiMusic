import request from '~/utils/request'

/**
 * 获取歌手的专辑
 * @param id 歌手 id
 * @param limit 取出数量 默认为30
 */
export const artistAlbum = (id: number | string, limit: number = 30) => {
  return request.get('artist/album', { params: { id, limit } })
}

/**
 * 获取专辑内容
 * @param id 专辑 id
 */
export const album = (id: number | string) => {
  return request.get('album', { params: { id } })
}