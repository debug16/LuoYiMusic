import request from '~/utils/request'
/**
 * 获取歌曲详情
 * @param ids 音乐 id 数组 格式 [1,2,3]
 * @returns 
 */
export const songDetail = (ids: Array<number >) => {
  return request.get('song/detail', { params: { ids: ids.join(',') } })
}