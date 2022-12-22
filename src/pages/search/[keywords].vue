<script setup lang="ts">
import { search } from '~/api/search'
import { songDetail } from '~/api/song'
import { album } from '~/api/album'
import { artists as artist } from '~/api/singer'
import { imgUrlSize } from '~/utils/img'
import { isSongsFree, formatSongsSinger } from '~/utils/songs'
import { usePlayMusicStore } from '~/stores/playMusic'
import { onBeforeRouteUpdate } from 'vue-router'
import { playlistDetail } from '~/api/playlist'

interface Props {
  keywords: string
}

const playMusicStore = usePlayMusicStore()
const router = useRouter()

const { keywords } = defineProps<Props>()

// 艺人
let artists: any = $ref()
// 专辑
let albums: any = $ref()
// 歌曲
let songs: any = $ref()
// 歌单
let playlists: any = $ref()

const getSearch = (keyword: string) => {
  // 搜索艺人
  // @ts-ignore
  search({ keywords: keyword, type: 100, limit: 3 }).then((res: any) => {
    if (res.code === 200) artists = res.result.artists
  })
  // @ts-ignore
  // 搜索专辑
  search({ keywords: keyword, type: 10, limit: 3 }).then((res: any) => {
    if (res.code === 200) albums = res.result.albums
  })
  // @ts-ignore
  // 搜索单曲
  search({ keywords: keyword, type: 1, limit: 24 })
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
  // @ts-ignore
  // 搜索歌单
  search({ keywords: keyword, type: 1000, limit: 12 }).then((res: any) => {
    if (res.code === 200) playlists = res.result.playlists
  })
}

onBeforeMount(() => getSearch(keywords))

// 获取路由变化 主要用于搜索再在搜索
onBeforeRouteUpdate((to, from) => {
  getSearch(to.params.keywords as string)
})

// 点击专辑封面播放按钮
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

// 获取歌单事件
const onPlayList = (playlistId: number) => {
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
        <div class="artist-title" flex justify-between items-center mb-6>
          <h1 text-2xl font-600>艺人</h1>
          <!-- <div class="more" text-sm>查看更多</div> -->
        </div>
        <div class="artist-list" grid-cols-3 gap-x-4 grid>
          <FrontCover
            v-for="artist in artists"
            :key="artist.id"
            :src="imgUrlSize(artist?.img1v1Url, 512)"
            shape="circle"
            :title-center="true"
            :title="artist?.name"
            @click-img="router.push(`/artist/${artist.id}`)"
            @click-title="router.push(`/artist/${artist.id}`)"
            @click-play="onPlayArtist(artist.id)"
          ></FrontCover>
        </div>
      </div>
      <div class="albums" w="50%">
        <div class="albums-title" flex justify-between items-center mb-6>
          <h1 text-2xl font-600>专辑</h1>
          <!-- <div class="more" text-sm>查看更多</div> -->
        </div>
        <div class="artist-list" grid-cols-3 gap-x-4 grid>
          <FrontCover
            v-for="(album, i) in albums"
            :key="i"
            :src="imgUrlSize(album?.picUrl, 512)"
            :title-center="true"
            :title="album?.name"
            @click-img="router.push(`/album/${album.id}`)"
            @click-title="router.push(`/album/${album.id}`)"
            @click-play="onPlayAlbum(album.id)"
          ></FrontCover>
        </div>
      </div>
    </div>
    <div class="songs">
      <div class="songs-title" flex justify-between items-center mb-6>
        <h1 text-2xl font-600>歌曲</h1>
        <!-- <div class="more" text-sm>查看更多</div> -->
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
    <div class="">
      <div class="albums-title" flex justify-between items-center mb-8>
        <h1 text-2xl font-600>歌单</h1>
        <!-- <div class="more" text-sm>查看更多</div> -->
      </div>
      <div class="" grid grid-cols-6 grid-flow-row gap-x-4 gap-y-8>
        <FrontCover
        v-for="playlist in playlists" :key="playlist.id"
          :src="imgUrlSize(playlist.coverImgUrl, 512)"
          @click-img="router.push(`/playlist/${playlist.id}`)"
          @click-title="router.push(`/playlist/${playlist.id}`)"
          @click-play="onPlayList(playlist.id)"
          :title="playlist.name"
        ></FrontCover>
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
