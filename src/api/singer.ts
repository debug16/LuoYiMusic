import request from '~/utils/request'

/**
 * 获取歌手排行耪
 * @param type : Number 歌单类型
 * @returns Promise <PlaylistReturn> 返回推荐歌单
 */
export const artistTopList = (type?: number): Promise<any> => {
  return request.get('toplist/artist', { params: { type } })
}

/**
 * 获取歌手信息
 * @param id 歌手id
 * @returns 
 */
export const artists = (id?: number | string): Promise<any> => {
  return request.get('artists', { params: { id } })
}