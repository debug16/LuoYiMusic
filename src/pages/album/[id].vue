<script setup lang="ts">
import { album } from '~/api/album'
import { formatSongsSinger, isSongsFree } from '~/utils/songs'
import { formatDate } from '~/utils/date'
import { usePlayMusicStore } from '~/stores/playMusic'
import { imgUrlSize } from '~/utils/img'

interface Props {
  id: number | string
}
const { id } = defineProps<Props>()
const playMusicStore = usePlayMusicStore()

let albumR: any = $ref()

onBeforeMount(() => {
  album(id).then((res: any) => {
    if (res.code === 200) {
      albumR = res
    }
    console.log(albumR)
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
  if (isSongsFree(songs?.fee)) {
    // 设置播放的音乐 id
    playMusicStore.setPlayMusicId(songs?.id)

    // 设置播放的音乐信息
    playMusicStore.setPlayMusic(songs)

    playMusicStore.setPlayMusicList(albumSongs)
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

const albumSongs = computed(() => {
  return albumR?.songs
})

const albumInfo = computed(() => {
  return albumR?.album
})
</script>

<template>
  <div class="album" py-10>
    <Introduce
      :name="albumInfo?.name"
      :title="`Album by ${albumInfo?.artist.name}`"
      :title-content="`创建于 ${formatDate(albumInfo?.publishTime)} · ${albumSongs?.length}首歌`"
      :description="albumInfo?.description"
    >
      <template #left>
        <Images :src="imgUrlSize(albumInfo?.picUrl, 512)" :alt="albumInfo?.name" :title="albumInfo?.name" />
      </template>
      <template #footer>
        <Button @click="playMusic(albumSongs)" text="播放">
          <template #icon>
            <div i-carbon:play-filled-alt w-5 h-5 color="#335eea" />
          </template>
        </Button>
      </template>
    </Introduce>
    <!-- 歌单歌曲列表 -->
    <div class="songsList" mt-20 tracking-widest>
      <SongsInfo
        v-for="songs in albumSongs"
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
      ></SongsInfo>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
