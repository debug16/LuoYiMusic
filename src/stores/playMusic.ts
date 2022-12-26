import { acceptHMRUpdate, defineStore } from 'pinia'
import { formatSongsSinger } from '~/utils/songs'
import { differenceBy, sample } from 'lodash'
export const usePlayMusicStore = defineStore('playMusic', {
  state() {
    return {
      // 播放音乐元素
      el: null,
      // 播放的音乐信息
      activePlayMusic: {
        // 歌曲id
        id: 0,
        // 歌曲信息
        music: {
        },
        // 播放状态
        status: 'pause',
        // 播放进度
        progress: 0,
        // 播放时间
        time: 0,
        // 歌词
        lyric: [{ time: 0, text: '' }]
      },
      // 播放列表
      playList: [],
      // 歌曲列表
      songs: [],
      // 播放配置
      config: {
        // 播放模式 0：顺序播放 1：随机播放 2：单曲循环
        model: 0
      }
    }
  },
  getters: {
    // 获取播放音乐 id
    getPlayMusicId(state: any) {
      return state.activePlayMusic.id
    },
    getPlayMusic(state: any) {
      return state.activePlayMusic.music
    },
    // 获取播放的音乐信息
    getPlayMusicName(state: any) {
      return state.activePlayMusic?.music?.name
    },
    // 获取播放的音乐歌手
    getPlayMusicSongsSinger(state: any) {
      return formatSongsSinger(state.activePlayMusic?.music?.ar)
    },
    // 获取播放的音乐封面
    getPlayMusicCover(state: any) {
      return state.activePlayMusic?.music?.al?.picUrl
    },
    // 获取待播放的音乐列表
    getPlayList(state: any) {
      return state.playList
    },
    // 获取下一首歌曲信息
    getNextPlayMusic(state: any) {
      // 没有播放歌曲 id || 播放列表为空
      if (!state.activePlayMusic.id || state.playList.length <= 0)
        return null

      // 如果是随机播放
      if (this.getPlayModel === 1)
        return this.getRandomMusic

      // 找到歌曲 id 在播放列表中的位置
      const index = state.playList.findIndex((item: { id: any }) => item.id === state.activePlayMusic.id,
      )
      // 没有找到
      if (index === -1)
        return null
      return state.playList[index + 1] || state.playList[0]
    },
    // 获取上一首歌曲信息
    getPrevPlayMusic(state: any) {
      // 没有播放歌曲 id || 播放列表为空
      if (!state.activePlayMusic.id || state.playList.length <= 0)
        return null

      // 如果是随机播放
      if (this.getPlayModel === 1)
        return this.getRandomMusic

      // 找到歌曲 id 在播放列表中的位置
      const index = state.playList.findIndex((item: { id: any }) => item.id === state.activePlayMusic.id,
      )
      // 没有找到
      if (index === -1)
        return null
      return index !== 0 ? state.playList[index - 1] : state.playList[state.playList.length - 1]
    },
    // 获取歌词
    getLyric(state: any) {
      return state.activePlayMusic.lyric
    },
    // 获取播放模式
    getPlayModel(state: any) {
      return state.config.model
    },
    // 随机获取一首歌
    getRandomMusic(state: any) {
      const musicList: any = differenceBy(this.getPlayList, [{id:this.activePlayMusic.id}], 'id')
      const music = sample(musicList)
      return music
    }
  },
  actions: {
    // 设置播放的音乐 id
    setPlayMusicId(id: number) {
      this.activePlayMusic.id = id
    },
    // 设置播放的音乐信息
    setPlayMusic(songs: any) {
      this.activePlayMusic.music = songs
    },
    // 设置播放歌曲列表
    setPlayMusicList(playList: any) {
      this.playList = playList
    },
    // 设置歌词
    setLyric(lyric: string) {
      this.activePlayMusic.lyric = lyric
    },
    // 设置播放模式
    setPlayModel(model: number) {
      this.config.model = model
    }
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePlayMusicStore, import.meta.hot))
