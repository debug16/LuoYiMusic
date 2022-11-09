import request from '~/utils/request'

/**
 * 获取歌词
 * @param id 歌曲id
 * @returns 
 */
export const lyric = (id:number)=>{
    return request.get('lyric',{params:{id}})
}