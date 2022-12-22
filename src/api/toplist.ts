import request from '~/utils/request'

/**
 * 所有榜单
 * @returns 
 */
export const toplist = (): Promise<any> => {
  return request.get('toplist')
}