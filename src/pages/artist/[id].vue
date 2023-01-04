<script setup lang="ts">
import { artists } from '~/api/singer'
import { album, artistAlbum } from '~/api/album'
import { formatSongsSinger, isSongsFree } from '~/utils/songs'
import { imgUrlSize } from '~/utils/img'
import { usePlayMusicStore } from '~/stores/playMusic'
import { formatDate } from '~/utils/date'
interface Props {
  id: string
}

const { id } = defineProps<Props>()
const router = useRouter()
const playMusicStore = usePlayMusicStore()

let artistsR = $ref<any>({})
let albumR = $ref<any>({})

useWindowScroll()

onBeforeMount(() => {
  // 获取歌手信息
  artists(id).then((res: any) => {
    if (res.code === 200) artistsR = res
  })
  // 获取歌手专辑信息
  artistAlbum(id).then((res: any) => {
    if (res.code === 200) albumR = res.hotAlbums
  })
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
    playMusicStore.setPlayMusicId(songs?.id)

    // 设置播放的音乐信息
    playMusicStore.setPlayMusic(songs)

    playMusicStore.setPlayMusicList(artistsR.hotSongs)
  }
}

// 点击艺人信息播放按钮事件
const playMusic = (songsList: any) => {
  // 如果歌单列表里没有音乐
  if (songsList?.length <= 0) return

  // 找到免费的歌曲
  const song = songsList.find((songs: { fee: number; id: any }) => {
    if (isSongsFree(songs.fee)) {
      playMusicStore.setPlayMusicId(songs.id)
      playMusicStore.setPlayMusic(songs)

      return true
    }
    return false
  })

  // 如果歌单列表里有免费音乐 就放入待播放的音乐列表
  if (song) playMusicStore.setPlayMusicList(songsList)
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

const titleContent = computed(() => {
  const artist = artistsR?.artist
  if (artist) return artist.musicSize + ' 首歌 · ' + artist.albumSize + ' 张专辑 · ' + artist.mvSize + ' 个MV'
})

const imgUrl = computed(() => {
  const imgUrl = artistsR?.artist?.picUrl
  return imgUrlSize(imgUrl, 300)
})

const name = computed(() => {
  return artistsR?.artist?.name
})

const briefDesc = computed(() => {
  return artistsR?.artist?.briefDesc
})
</script>

<template>
  <div class="artist" py-10 space-y-20>
    <!-- 艺人介绍 -->
    <div class="artists-introduce" v-show="artistsR.artist">
      <Introduce text-5xl :name="name" title="艺人" :title-content="titleContent" :description="briefDesc">
        <template #left>
          <Images :src="imgUrl" shape="circle"></Images>
        </template>
        <template #footer>
          <Button @click="playMusic(artistsR.hotSongs)" text="播放">
            <template #icon>
              <div i-carbon:play-filled-alt w-5 h-5 color="#335eea" />
            </template>
          </Button>
        </template>
      </Introduce>
    </div>
    <!-- 热门歌曲 -->
    <div class="hot-songs" space-y-6 v-show="artistsR.hotSongs">
      <h1 text-2xl font-600>最新发布</h1>
      <!-- 歌曲列表 -->
      <div class="songs-list" gap-2 grid xl:grid-cols-4 grid-cols-3 lg:grid-cols-3>
        <SongsInfo
          v-for="(song, i) in artistsR?.hotSongs"
          :key="i"
          flex
          rounded-xl
          hover="bg-#eee/50"
          :img-src="imgUrlSize(song.al?.picUrl, 100)"
          :available="isSongsFree(song.fee)"
          :name="song?.name"
          :artist="formatSongsSinger(song.ar)"
          :active="song.id == playMusicStore.getPlayMusicId"
          @songs-dblclick="dblclickPlayMusic(song)"
        />
      </div>
    </div>
    <!-- 专辑 -->
    <div class="album" space-y-6 v-show="albumR.length > 0">
      <h1 text-2xl font-600>专辑</h1>
      <div class="album-list" grid grid-cols-5 grid-flow-row gap-x-6 gap-y-9>
        <div v-for="(album, i) in albumR" :key="i">
          <FrontCover
            :src="imgUrlSize(album.picUrl, 512)"
            :title="album.name"
            :describe="formatDate(album.publishTime)"
            @click-img="router.push(`/album/${album.id}`)"
            @click-title="router.push(`/album/${album.id}`)"
            @click-play="onPlayAlbum(album.id)"
          >
          </FrontCover>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.introduce :deep(.songsName) {
  @apply text-5xl;
}

.songs-info {
  &:deep(.songs .name) {
    // @apply text-sm v-text-top;
  }
  &:deep(.nameBox) {
    @apply text-sm v-text-top;
  }
  &:deep(.songs img) {
    @apply h-11 w-11;
  }
}
.front-cover {
  &:deep(.title) {
    @apply mt-2 line-clamp-1;
  }
}
</style>
