<script setup lang="ts">
import { search } from '~/api/search'
import { imgUrlSize } from '~/utils/img'
import { songDetail } from '~/api/song'
import { isSongsFree } from '~/utils/songs'
import { formatSongsSinger } from '~/utils/songs'
import { usePlayMusicStore } from '~/stores/playMusic'
import { onBeforeRouteUpdate } from 'vue-router'

interface Props {
  keywords: string
}

const playMusicStore = usePlayMusicStore()
const route = useRouter()

const { keywords } = defineProps<Props>()

// 艺人
let artists: any = $ref()
// 专辑
let albums: any = $ref()
// 歌曲
let songs: any = $ref()

const getSearch = (keyword: string) => {
  search({ keywords: keyword, type: 100, limit: 3 }).then((res: any) => {
    if (res.code === 200) artists = res.result.artists
  })
  search({ keywords: keyword, type: 10, limit: 3 }).then((res: any) => {
    if (res.code === 200) albums = res.result.albums
  })
  search({ keywords: keyword, type: 1, limit: 16 })
    .then((res: any) => {
      if (res.code === 200) {
        const songList = res.result.songs
        let ids = songList?.map((v: any) => {
          return v.id
        })
        return ids
      }
    })
    .then(async (res: Array<number>) => {
      const songsTemp: any = await songDetail(res)
      if (songsTemp.code === 200) return (songs = songsTemp.songs)
      else throw '出错了'
    })
}

onBeforeMount(() => getSearch(keywords))

// 监听地址变化
// watch(
//   () => keywords,
//   (nv: any, old: any) => {
//     nv && getSearch(nv)
//   }
// )

onBeforeRouteUpdate((to,from) => {
  // console.log("🚀 ~ file: [keywords].vue:61 ~ onBeforeRouteUpdate ~ to,from", to,from)
  
  getSearch(to.params.keywords as string)
  // console.log('🚀 ~ file: [keywords].vue:61 ~ onBeforeRouteUpdate ~ updateGuard', updateGuard.params.keywords)
})

// 双击播放事件
const dblclickPlayMusic = (song: any) => {
  /**
   * 如果点击的播放的音乐不是收费的，则播放
   * 0: 免费
   * 1: 2元购买单曲
   * 4: 购买专辑
   * 8: 低音质免费
   * https://github.com/Binaryify/NeteaseCloudMusicApi/issues/1121
   */
  if (isSongsFree(song?.fee)) {
    // 设置播放的音乐 id
    playMusicStore.setPlayMusicId(song?.id)

    // 设置播放的音乐信息
    playMusicStore.setPlayMusic(song)

    playMusicStore.setPlayMusicList(songs)
  }
}
</script>

<template>
  <div class="search" py-10 space-y-20>
    <div class="top" space-x-16 flex="~">
      <div class="artists" w="50%">
        <div class="artist-title" flex justify-between items-center mb-4>
          <h1 text-xl font-600>艺人</h1>
          <div class="more" text-sm>查看更多</div>
        </div>
        <div class="artist-list" grid-cols-3 gap-x-4 grid>
          <FrontCover
            v-for="(artist, i) in artists"
            :key="i"
            :src="imgUrlSize(artist?.img1v1Url, 512)"
            shape="circle"
            :title-center="true"
            :title="artist?.name"
            @click-img="route.push(`/artist/${artist.id}`)"
            @click-title="route.push(`/artist/${artist.id}`)"
          ></FrontCover>
        </div>
      </div>
      <div class="albums" w="50%">
        <div class="albums-title" flex justify-between items-center mb-4>
          <h1 text-xl font-600>专辑</h1>
          <div class="more" text-sm>查看更多</div>
        </div>
        <div class="artist-list" grid-cols-3 gap-x-4 grid>
          <FrontCover
            v-for="(album, i) in albums"
            :key="i"
            :src="imgUrlSize(album?.picUrl, 512)"
            shape="circle"
            :title-center="true"
            :title="album?.name"
            @click-img="route.push(`/album/${album.id}`)"
            @click-title="route.push(`/album/${album.id}`)"
          ></FrontCover>
        </div>
      </div>
    </div>
    <div class="songs">
      <!-- <h1 text-2xl font-600 mb-4>歌曲</h1> -->
      <div class="songs-title" flex justify-between items-center mb-4>
        <h1 text-xl font-600>歌曲</h1>
        <div class="more" text-sm>查看更多</div>
      </div>
      <!-- 歌曲列表 -->
      <div class="songs-list" gap-2 grid xl:grid-cols-4 grid-cols-3 lg:grid-cols-3>
        <SongsInfo
          v-for="(song, i) in songs"
          :key="i"
          flex
          rounded-xl
          hover="bg-#eee/50"
          :img-src="imgUrlSize(song.al.picUrl, 50)"
          :available="isSongsFree(song.fee)"
          :name="song?.name"
          :artist="formatSongsSinger(song.ar)"
          @songs-dblclick="dblclickPlayMusic(song)"
          :active="song.id == playMusicStore.getPlayMusicId"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.top {
  & .artist-list .front-cover {
    &:deep(.title) {
      @apply mt-2 font-500;
    }
  }
}

.songs-info {
  &:deep(.nameBox) {
    @apply text-sm v-text-top;
  }
  &:deep(.songs img) {
    @apply h-11 w-11;
  }
  &:deep(.title) {
    @apply truncate;
  }
}

.more {
  @apply hover:underline cursor-pointer;
}
</style>
