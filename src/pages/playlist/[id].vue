<script setup lang="ts">
import { formatSongsSinger, isSongsFree } from '~/utils/songs'
import { playlistDetail } from '~/api/playlist'
import { formatDate } from '~/utils/date'
import { usePlayMusicStore } from '~/stores/playMusic'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const playMusicStore = usePlayMusicStore()
// 歌单详情
let songsListDetails: any | undefined = $ref()

onBeforeMount(() => {
  // 获取歌单详情
  playlistDetail(props.id).then(res => {
    if (res.code === 200) songsListDetails = res.playlist
  })
})

// 歌单歌曲列表
const songsList = computed(() => {
  return songsListDetails?.tracks
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
    playMusicStore.setPlayMusicList(songsList.value) // 这里拿到的是 计算属性的 ref 所以要用 value
  }
}

// 点击歌单信息播放按钮事件
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

const imgUrl = (url: string, param?: number | string) => {
  param = param ? `?param=${param}y${param}` : ''
  const img = url ? url + param : ''
  return img
}

const timeFormat = (time:number)=>{
  return Math.floor(time / 1000 / 60) + ':' + `${Math.floor((time / 1000) % 60)}`.padStart(2, '0')
}
</script>

<template>
  <div v-show="songsListDetails" class="playlist" py-10>
    <!-- 顶部歌单信息 -->
    <Introduce
      :name="songsListDetails?.name"
      :title="`Playlist by ${songsListDetails?.creator?.nickname}`"
      :title-content="`最后更新于 ${formatDate(songsListDetails?.updateTime)}· ${songsListDetails?.trackCount}首歌`"
      :description="songsListDetails?.description"
    >
      <template #left>
        <Images :src="imgUrl(songsListDetails?.coverImgUrl, 512)" :alt="songsListDetails?.name" :title="songsListDetails?.name" />
      </template>
      <template #footer>
        <Button @click="playMusic(songsList)" text="播放">
          <template #icon>
            <div i-carbon:play-filled-alt w-5 h-5 color="#335eea" />
          </template>
        </Button>
      </template>
    </Introduce>
    <!-- 歌单歌曲列表 -->
    <div class="songsList" mt-20 tracking-widest>
      <SongsInfo
      v-for="songs in songsList"
        :key="songs.id"
        :name="songs.name"
        :active="songs.id == playMusicStore.getPlayMusicId"
        :available="!(songs.fee !== 0 && songs.fee !== 8)"
        :alia="songs?.alia && songs?.alia[0]?.toString()"
        :artist="formatSongsSinger(songs?.ar)"
        :album-name="songs.al.name"
        :songs-time="songs.dt"
        :img-src="imgUrl(songs?.al.picUrl, 224)"
        @songs-dblclick="dblclickPlayMusic(songs)"
      ></SongsInfo>
      <!-- <div
        v-for="songs in songsList"
        :key="songs.id"
        w-full
        flex="~"
        p-2
        rounded-xl
        items-center
        :class="{ vip: songs.fee !== 0 && songs.fee !== 8, active: songs.id == playMusicStore.getPlayMusicId }"
        :title="songs.fee !== 0 && songs.fee !== 8 ? 'Only VIP Can Play' : ''"
        @dblclick="dblclickPlayMusic(songs)"
      >
        <div class="songs" flex="~ grow-0" items-center w="50%" pr-5>
          <div h-13 w-13 shrink-0 mr-5>
            <img h-full rounded-lg :src="imgUrl(songs?.al.picUrl, 224)" alt="" />
          </div>
          <div overflow-hidden>
            <div truncate grow-0 w-full font-800 text-lg>
              <span>{{ songs.name }}</span>
              <span v-if="songs.alia[0]" text="#7a7a7a/60"> ({{ songs?.alia && songs?.alia[0]?.toString() }}) </span>
            </div>
            <div text-xs color="#000/80" truncate>
              <span>{{ formatSongsSinger(songs?.ar) }}</span>
            </div>
          </div>
        </div>
        <div basis="40%" font-bold text-sm>
          <span>{{ songs.al.name }}</span>
        </div>
        <div basis="10%" text-right>
          <span>{{ Math.floor(songs.dt / 1000 / 60) }}:{{ `${Math.floor((songs.dt / 1000) % 60)}`.padStart(2, '0') }}</span>
        </div>
      </div> -->
    </div>
  </div>
</template>

<style scoped>
.describe {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.songsList .vip span {
  @apply color-#ccc/80;
}

.songsList .active {
  background-color: rgba(140, 170, 255, 0.45) !important;
}

.songsList .active span {
  @apply color-#4756ff/95;
}

.songsList > div:not(.vip) {
  @apply hover:bg-#eee/50;
}
</style>
<route lang="yaml">
meta:
  layout: default
</route>
