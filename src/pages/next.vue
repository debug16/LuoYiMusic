<script setup lang="ts">
import { usePlayMusicStore } from '~/stores/playMusic'
import { imgUrlSize } from '~/utils/img'
import { formatSongsSinger, isSongsFree } from '~/utils/songs'

const router = useRouter()
const playMusicStore = usePlayMusicStore()

const playList = playMusicStore.getPlayList

const album = computed(() => {
  return playMusicStore.getPlayMusic?.al?.name
})

const name = computed(() => {
  return playMusicStore.getPlayMusicName
})

const time = computed(() => {
  return playMusicStore.getPlayMusic?.dt
})

const picUrl = computed(() => {
  return playMusicStore.getPlayMusicCover
})

const alia = computed(() => {
  return playMusicStore.getPlayMusic?.alia[0]?.toString()
})

const artist = computed(() => {
  return playMusicStore.getPlayMusicSongsSinger
})

const soon = computed(() => {
  // 找到在播放的歌位置
  const index = playList?.findIndex((item: { id: any }) => item.id === playMusicStore.activePlayMusic.id)

  // 取播放前后得数据
  const preArr = playList.slice(0, index)
  const nextArr = playList.slice(Math.min(index + 1, playList.length))

  // 平铺数据
  const soonList = [...nextArr,...preArr]
  
  return soonList
})

// 双击播放事件
const dblclickPlayMusic = (songs: any) => {
  /**
   * 如果点击的播放的音乐不是收费的，则播放
   * 0: 免费
   * 1: 2元购买单曲
   * 4: 购买专辑
   * 8: 低音质免费
   * https://github.com/Binaryify/NeteaseCloudMusicApi/issues/1121
   */
  if (isSongsFree(songs.fee)) {
    // 设置播放的音乐 id
    playMusicStore.setPlayMusicId(songs.id)
    // 设置播放的音乐信息
    playMusicStore.setPlayMusic(songs)
  }
}
</script>

<template>
  <div class="next" py-10 space-y-10>
    <div class="active">
      <div class="title">正在播放</div>
      <div class="playList">
        <SongsInfo :name="name" :album-name="album" :songs-time="time" :available="true" :img-src="imgUrlSize(picUrl, 224)" :alia="alia" :artist="artist" :active="true"></SongsInfo>
      </div>
    </div>
    <div class="soon">
      <div class="title">即将播放</div>
      <div class="playList">
        <SongsInfo
          v-for="songs in soon"
          :key="songs.id"
          :name="songs.name"
          :active="songs.id == playMusicStore.getPlayMusicId"
          :available="!(songs.fee !== 0 && songs.fee !== 8)"
          :alia="songs?.alia && songs?.alia[0]?.toString()"
          :artist="formatSongsSinger(songs?.ar)"
          :album-name="songs.al.name"
          :songs-time="songs.dt"
          :img-src="imgUrlSize(songs?.al.picUrl, 224)"
          @songs-dblclick="dblclickPlayMusic(songs)"
        @click-album="router.push(`/album/${songs.al.id}`)"
        ></SongsInfo>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.title {
  @apply text-2xl mb-4 font-600;
}
</style>
