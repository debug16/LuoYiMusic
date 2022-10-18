<script setup lang="ts">
import { usePlayMusicStore } from '~/stores/playMusic'
import { isSongsFree } from '~/utils/songs'
const playMusicStore = usePlayMusicStore()

// 注入播放栏操作
const injects = inject<{
  footerHide: boolean
  updateFooterHide: () => void
}>('footerHide')

const audio: HTMLAudioElement | null = $ref()

// 音乐开始播放事件
const startPlayMusic = () => {
  playMusicStore.activePlayMusic.state = 'playing'
}

// 播放歌曲
const playMusic = () => {
  audio?.play()
}

// 音乐停止播放事件
const stopPlayMusic = () => {
  audio?.pause()
  playMusicStore.activePlayMusic.state = 'pause'
}

// 播放下一首歌
const nextPlayMusic = () => {
  stopPlayMusic()
  // 获取下一首歌曲信息
  const nextMusic = playMusicStore.getNextPlayMusic
  // 没有下一首
  if (!nextMusic)
    return

  playMusicStore.setPlayMusicId(nextMusic.id)

  // 不是免费的歌曲
  if (!isSongsFree(nextMusic.fee)) {
    nextPlayMusic()
    return
  }

  playMusicStore.setPlayMusic(nextMusic)
}

// 播放上一首歌
const prevPlayMusic = () => {
  // 暂停播放
  stopPlayMusic()
  // 获取上一首歌曲信息
  const prevMusic = playMusicStore.getPrevPlayMusic
  // 没有上一首
  if (!prevMusic)
    return

  playMusicStore.setPlayMusicId(prevMusic.id)

  // 不是免费的歌曲
  if (!isSongsFree(prevMusic.fee)) {
    prevPlayMusic()
    return
  }

  playMusicStore.setPlayMusic(prevMusic)
}

// 音乐结束播放事件
const endPlayMusic = () => {
  playMusicStore.activePlayMusic.state = 'pause'
  // 下一首
  nextPlayMusic()
}

// 是否在播放音乐
const isPlaying = computed(() => {
  return playMusicStore.activePlayMusic.state === 'playing'
})

// 监听播放音乐的 id
watch(() => playMusicStore.activePlayMusic.id, (_value, _old) => {
  // 暂停播放
  stopPlayMusic()

  // // 检查音乐是否收费
  // if (!isSongsFree(playMusicStore.activePlayMusic.music.fee)) {
  //   // 播放下一首
  //   nextPlayMusic()
  // }

  // 播放栏是否隐藏
  if (injects?.footerHide) {
    injects.updateFooterHide() // 如果隐藏则显示
    injects.footerHide = false // 将隐藏状态设置为 false
  }
})

// 播放音乐的 url
const playMusicUrl = computed(() => {
  if (playMusicStore.getPlayMusicId)
    return `https://music.163.com/song/media/outer/url?id=${playMusicStore.getPlayMusicId}.mp3`
})
</script>

<template>
  <div h-full>
    <footer class="footer" color="#fff" h-full>
      <div flex="~" justify-between items-center color-white h-full>
        <div class="left" flex="~" text-2xl space-x-3 w="1/3">
          <div h-50px w-50px flex="shrink-0" class="footer__music--img">
            <img :src="`${playMusicStore.getPlayMusicCover}?param=224y224`" alt="" rounded-lg>
          </div>
          <div class="footer__music--title" text-base overflow-hidden flex="~ col" justify-evenly>
            <!-- 歌名 -->
            <div class="footer__music--song" text-base truncate>
              {{ playMusicStore.getPlayMusicName }}
            </div>
            <!-- 歌手 -->
            <div class="footer__music--singer" color="#fff/60" text-xs>
              {{ playMusicStore.getPlayMusicSongsSinger }}
            </div>
          </div>
        </div>
        <div class="center" flex="~" items-center space-x6 text-lg font-800>
          <!-- 上一首 -->
          <div class="icon" @click="prevPlayMusic">
            <div i-carbon:skip-back-filled />
          </div>
          <!-- 播放 -->
          <div v-show="isPlaying" class="icon" @click="stopPlayMusic">
            <div i-carbon:pause-filled w-8 h-8 />
          </div>
          <!-- 暂停 -->
          <div v-show="!isPlaying" class="icon" @click="playMusic">
            <div i-carbon:play-filled-alt w-8 h-8 />
          </div>
          <!-- 下一首 -->
          <div class="icon" @click="nextPlayMusic">
            <div i-carbon:skip-forward-filled />
          </div>
        </div>
        <div class="right" flex="~" space-x-3 w="1/3" justify-end>
          <div class="audio">
            <audio
              ref="audio" :src="playMusicUrl" autoplay controls @ended="endPlayMusic" @play="startPlayMusic"
              @error="stopPlayMusic" @pause="stopPlayMusic" @timeupdate="null"
            >
              <source :src="playMusicUrl" type="audio/ogg">
              <source :src="playMusicUrl" type="audio/mpeg">
              您的浏览器不支持 audio 元素。
            </audio>
          </div>
          <!-- <div class="search">
            <input type="text" h-8 rounded-md placeholder="search" px-2 bg="#333333" outline-none>
          </div>
          <div class="headPortrait">
            <div w-8 h-8>
              <img src="http://p2.music.126.net/Gwxpt7cgsg-vj1zzAkkvtA==/109951167541643053.jpg?param=512y512" alt="" rounded="50%">
            </div>
          </div>
        </div> -->
        </div>
      </div>
    </footer>
  </div>
</template>
