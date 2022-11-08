<script setup lang="ts">
import { personalized, playlistDetail } from '~/api/playlist'
import { isSongsFree } from '~/utils/songs'
import { artistTopList } from '~/api/singer'
import { usePlayMusicStore } from '~/stores/playMusic'

const router = useRouter()
const playMusicStore = usePlayMusicStore()

// 推荐歌单
let recommendSongs: Array<any> | undefined = $ref()

// 推荐艺人
const artistTop: Array<any> = $ref([])
onBeforeMount(() => {
  personalized(10).then(res => {
    if (res.code === 200) recommendSongs = res.result
  })
  artistTopList().then(res => {
    if (res.code === 200) {
      const len: number = res.list.artists?.length
      let random = 0
      for (let i = 0; i < len && i < 6; i++) {
        random = Math.floor(Math.random() * len)
        artistTop.push(res.list.artists[random]) // 取前6个艺人
      }
    }
  })
})

// 获取歌单事件
const onPlayRecommendedList = (playlistId: number) => {
  // 获取歌单详情
  playlistDetail(playlistId).then(res => {
    let playlist: Array<any> = []

    if (res.code === 200) playlist = res.playlist?.tracks

    // 如果歌单列表里没有音乐
    if (playlist?.length <= 0) return
    // 找到免费的歌曲
    const song = playlist.find((songs: { fee: number; id: any }) => {
      if (isSongsFree(songs.fee)) {
        playMusicStore.setPlayMusicId(songs.id)
        playMusicStore.setPlayMusic(songs)
        return true
      }
      return false
    })
    // 如果歌单列表里有免费音乐 就放入待播放的音乐列表
    if (song) playMusicStore.setPlayMusicList(playlist)
  })
}
</script>

<template>
  <div class="content">
    <div class="recommend">
      <h1>推荐歌单</h1>
      <div class="recommend__content grid grid-cols-5 grid-flow-row gap-x-4 gap-y-8">
        <div v-for="(item, i) in recommendSongs" :key="i" cursor-pointer @click="router.push(`/playlist/${item.id}`)">
          <div class="frontCover" relative>
            <img :src="`${item.picUrl}?param=512y512`" rounded-xl :alt="item.name" />
            <div class="play__btn -translate-1/2" bg="#fff/20" hidden hover="bg-#fff/30" p-3 rounded="50%" absolute top="1/2" left="1/2" @click.stop="onPlayRecommendedList(item.id)">
              <div i-carbon:play-filled-alt w-8 h-8 />
            </div>
          </div>
          <div class="describe" :title="item.name">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
    <div v-show="artistTop.length > 0">
      <h1>推荐艺人</h1>
      <div class="recommend__content grid grid-cols-6 grid-flow-row gap-8">
        <div v-for="artist in artistTop" :key="artist.id" flex="~ col" min-h-full>
          <div class="frontCover" relative grow>
            <img :src="`${artist.picUrl}?param=512y512`" rounded="50%" alt="" />
            <div class="play__btn -translate-1/2" hidden bg="#fff/20" hover="bg-#fff/30" p-3 rounded="50%" absolute top="1/2" left="1/2">
              <div i-carbon:play-filled-alt w-8 h-8 />
            </div>
          </div>
          <div class="describe" text-center>
            {{ artist.name }}
          </div>
        </div>
      </div>
    </div>
    <div class="newAlbum">
      <h1>新专速递</h1>
      <div class="recommend__content grid grid-cols-5 grid-flow-row gap-x-4 gap-y-8">
        <div v-for="(item, i) in recommendSongs" :key="i" cursor-pointer @click="router.push(`/playlist/${item.id}`)">
          <div class="frontCover" relative>
            <img :src="`${item.picUrl}?param=512y512`" rounded-xl :alt="item.name" />
            <div class="play__btn -translate-1/2" bg="#fff/20" hidden hover="bg-#fff/30" p-3 rounded="50%" absolute top="1/2" left="1/2" @click.stop="onPlayRecommendedList(item.id)">
              <div i-carbon:play-filled-alt w-8 h-8 />
            </div>
          </div>
          <div class="describe" :title="item.name">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
    <div class="top">
      <h1>排行榜</h1>
      <div class="recommend__content grid grid-cols-5 grid-flow-row gap-x-4 gap-y-8">
        <div v-for="(item, i) in recommendSongs" :key="i" cursor-pointer @click="router.push(`/playlist/${item.id}`)">
          <div class="frontCover" relative>
            <img :src="`${item.picUrl}?param=512y512`" rounded-xl :alt="item.name" />
            <div class="play__btn -translate-1/2" bg="#fff/20" hidden hover="bg-#fff/30" p-3 rounded="50%" absolute top="1/2" left="1/2" @click.stop="onPlayRecommendedList(item.id)">
              <div i-carbon:play-filled-alt w-8 h-8 />
            </div>
          </div>
          <div class="describe" :title="item.name">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content > div {
  @apply mb-10;
}

h1 {
  @apply text-3xl font-800 py-5;
}

.frontCover:hover > .play__btn {
  display: block;
}

.describe {
  @apply my-4 font-bold text-base truncate;
}
</style>

<route lang="yaml">
meta:
  layout: default
</route>
