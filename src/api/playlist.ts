import request from '~/utils/request'

export interface PersonalizedReturn {
  hasTaste?: boolean
  code: number
  category?: number
  result?: Array<Object>
  msg?: string
}

/**
 * 获取推荐歌单
 * @param limit : Number 取出数量 默认10
 * @returns Promise <PersonalizedReturn> 返回推荐歌单
 */
export const personalized = (limit?: number): Promise<PersonalizedReturn> | Promise<never> => {
  return request.get('personalized', { params: { limit } })
}

/**
 *  获取歌单详情 没有登录获取不到所有歌曲
 * @param id 歌单id
 * @returns Promise<never> Promise<any>
 */
export const playlistDetail = (id: number | string): Promise<any> | Promise<never> => {
  return request.get('playlist/detail', { params: { id } })
}

/**
 *  调用此接口 , 可获取精品歌单标签列表
 * @returns 
 */
export const playlistHighqualityTags = () => {
  return request.get('playlist/highquality/tags')
}

/**
 * 获取精品歌单
 * @param params 
 * @returns 
 */
export const topPlaylistHighquality = (params?: { cat?: any, limit?: number, before?: number }) => {
  return request.get('top/playlist/highquality', { params })
}