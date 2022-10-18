import isArray from 'lodash/isArray.js'

/**
 * 格式化歌手名字
 * @param singer 歌手名数组对象 [{name: '歌手名'}]
 * @returns  XX,XX
 */
export const formatSongsSinger = (singer: Array<{ name: string }>): string | undefined => {
  if (isArray(singer))
    return singer.map(item => item.name).join(',')
}

/**
 * 歌曲是否免费
 * @param  freeNumber 免费代码
 * @returns {boolean} true: 免费 false: 收费
 */
export const isSongsFree = (freeNumber: number): boolean => {
  return freeNumber === 8 || freeNumber === 0
}
