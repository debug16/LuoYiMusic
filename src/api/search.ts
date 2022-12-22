import request from '~/utils/request'

interface searchParam {
  keywords: string,
  type?: number,
  limit?: number,
  offset?: number
}

/**
 * 
 * @param keywords 关键词
 * @param type 搜索类型 默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合, 2000:声音(搜索声音返回字段格式会不一样)
 * @param limit  返回数量 , 默认为 30 
 * @param offset 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * @returns 
 */
export const search = (param: searchParam) => {
  return request.get('search/keywords', { params: param })
}