<script setup lang="ts">
import { personalized, playlistDetail } from '~/api/playlist'
import { artists as artist, artistTopList } from '~/api/singer'
import { album, albumNew } from '~/api/album'
import { toplist } from '~/api/toplist'
import { isSongsFree } from '~/utils/songs'
import { getRandom } from '~/utils/arrays'
import { usePlayMusicStore } from '~/stores/playMusic'

const router = useRouter()
const playMusicStore = usePlayMusicStore()

// 推荐歌单
let recommendSongs: Array<any> | undefined = $ref()
// 推荐艺人
let artistTop: Array<any> = $ref([])
// 最新专辑
let albumNewR: Array<any> | undefined = $ref()
// 排行耪
let toplistR: Array<any> | undefined = $ref()

onBeforeMount(() => {
  personalized(10).then(res => {
    if (res.code === 200) recommendSongs = res.result
  })
  artistTopList().then(res => {
    if (res.code === 200) {
      artistTop = getRandom(res.list.artists, 6)
    }
  })
  albumNew({ limit: 10 }).then((res: any) => {
    if (res.code === 200) albumNewR = res.albums
  })
  toplist().then((res: any) => {
    if (res.code === 200) toplistR = res.list.slice(0,10)
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

// 点击艺人封面播放按钮
const onPlayArtist = (id: number) => {
  artist(id).then((res: any) => {
    let artistSongList: Array<any> = []
    if (res.code === 200) artistSongList = res.hotSongs
    // 如果艺人列表里没有音乐
    if (artistSongList?.length <= 0) return
    // 找到免费的歌曲
    const song = artistSongList.find((songs: { fee: number; id: any }) => {
      if (isSongsFree(songs.fee)) {
        playMusicStore.setPlayMusicId(songs.id)
        playMusicStore.setPlayMusic(songs)
        return true
      }
      return false
    })
    // 如果艺人列表里有免费音乐 就放入待播放的音乐列表
    if (song) playMusicStore.setPlayMusicList(artistSongList)
  })
}

// 点击专辑播放按钮
const onPlayAlbum = (id: number) => {
  album(id).then((res: any) => {
    let albumSongList: Array<any> = []
    if (res.code === 200) albumSongList = res.songs
    // 如果专辑列表里没有音乐
    if (albumSongList?.length <= 0) return
    // 找到免费的歌曲
    const song = albumSongList.find((songs: { fee: number; id: any }) => {
      if (isSongsFree(songs.fee)) {
        playMusicStore.setPlayMusicId(songs.id)
        playMusicStore.setPlayMusic(songs)
        return true
      }
      return false
    })
    // 如果专辑列表里有免费音乐 就放入待播放的音乐列表
    if (song) playMusicStore.setPlayMusicList(albumSongList)
  })
}

const imgUrl = (url: string, param?: number | string) => {
  param = param ? `?param=${param}y${param}` : ''
  const img = url ? url + param : ''
  return img
}
</script>

<template>
  <div class="content">
    <div class="recommend">
      <h1>推荐歌单</h1>
      <div class="recommend__content grid grid-cols-5 grid-flow-row gap-x-4 gap-y-8">
        <div v-for="(item, i) in recommendSongs" :key="i">
          <FrontCover
            :src="imgUrl(item.picUrl, 512)"
            @click-img="router.push(`/playlist/${item.id}`)"
            @click-title="router.push(`/playlist/${item.id}`)"
            @click-play="onPlayRecommendedList(item.id)"
            :title="item.name"
          ></FrontCover>
        </div>
      </div>
    </div>
  </div>
  <div v-show="artistTop.length > 0">
    <h1>推荐艺人</h1>
    <div class="recommend__content grid grid-cols-6 md:gap-4 grid-flow-row xl:gap-8">
      <div v-for="artist in artistTop" :key="artist.id" flex="~ col" min-h-full>
        <FrontCover
          :src="imgUrl(artist.picUrl, 300)"
          :alt="artist.name"
          shape="circle"
          :title-center="true"
          :title="artist.name"
          @click-img="router.push(`/artist/${artist.id}`)"
          @click-title="router.push(`/artist/${artist.id}`)"
          @click-play="onPlayArtist(artist.id)"
        ></FrontCover>
      </div>
    </div>
  </div>
  <div class="newAlbum">
    <h1>新专速递</h1>
    <div class="recommend__content grid grid-cols-5 grid-flow-row gap-x-4 gap-y-8">
      <div v-for="album in albumNewR" :key="album.id" flex="~ col" min-h-full>
        <FrontCover
          :src="imgUrl(album.picUrl, 300)"
          :alt="album.name"
          :title="album.name"
          :describe="album.artist.name"
          @click-img="router.push(`/album/${album.id}`)"
          @click-title="router.push(`/album/${album.id}`)"
          @click-describe="router.push(`/artist/${album.artist.id}`)"
          @click-play="onPlayAlbum(album.id)"
        ></FrontCover>
      </div>
    </div>
  </div>
  <div class="top">
    <h1>排行榜</h1>
    <div class="recommend__content grid grid-cols-5 grid-flow-row gap-x-4 gap-y-8">
      <div v-for="toplist in toplistR" :key="toplist.id" flex="~ col" min-h-full>
        <FrontCover
          :src="imgUrl(toplist.coverImgUrl, 300)"
          :alt="toplist.name"
          :title="toplist.name"
          :describe="toplist.updateFrequency"
          @click-img="router.push(`/playlist/${toplist.id}`)"
          @click-title="router.push(`/playlist/${toplist.id}`)"
          @click-describe="router.push(`/playlist/${toplist.id}`)"
          @click-play="onPlayRecommendedList(toplist.id)"
        ></FrontCover>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main > div {
  @apply mb-10;
}

h1 {
  @apply text-3xl font-800 py-5;
}

.front-cover {
  &:deep(.title) {
    @apply line-clamp-1;
  }
}
.images:hover {
  & .images__content .play__btn {
    @apply block;
  }
}

.describe {
  @apply my-4 font-bold text-base line-feed line-clamp-2 hover:underline;
}
</style>

<route lang="yaml">
meta:
  layout: default
</route>
