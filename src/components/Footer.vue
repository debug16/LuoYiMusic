<script setup lang="ts">
import { usePlayMusicStore } from '~/stores/playMusic'
import { isSongsFree } from '~/utils/songs'
import { formateTime } from '~/utils/time'

const playMusicStore = usePlayMusicStore()

const audioInfo = reactive({
  //当前音乐播放到的时间
  currentTime: 0,
  //当前音乐的总时长
  duration: 0.01,

  // 总时长
  musicOverTime: '00:00',
  // 当前播放到的时间
  musicCurrentTime: '00:00',
})

// 播放进度条
let percentage = computed(() => {
  const num = (audioInfo.currentTime / audioInfo.duration) * 100
  return num.toFixed(2)
})

// 注入播放栏操作
const injects = inject<{
  footerHide: boolean
  updateFooterHide: () => void
}>('footerHide')

const audio: HTMLAudioElement = $ref()

// 音乐开始播放事件
const startPlayMusic = () => {
  playMusicStore.activePlayMusic.state = 'playing'
  audioInfo.duration = audio.duration
  audioInfo.musicOverTime = formateTime(audioInfo.duration) || '00:00'
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
  if (!nextMusic) return

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
  if (!prevMusic) return

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

// 播放时间变化事件
const timeUpdate = (e: any) => {
  audioInfo.currentTime = e.target.currentTime
  audioInfo.musicCurrentTime = formateTime(audioInfo.currentTime) || '00:00'
}

// 监听播放音乐的 id
watch(
  () => playMusicStore.activePlayMusic.id,
  (_value: any, _old: any) => {
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
  }
)

// 播放音乐的 url
const playMusicUrl = computed(() => {
  if (playMusicStore.getPlayMusicId) return `https://music.163.com/song/media/outer/url?id=${playMusicStore.getPlayMusicId}.mp3`
})

// 进度条点击
let isFullScreenPlayer = $ref(false)

let progressRef = ref(null)

const { elementX, elementWidth } = useMouseInElement(progressRef)
// 进度条点击事件
const changePlayTime = () => {
  audio.currentTime = (elementX.value / elementWidth.value) * audioInfo.duration
}

let progressCircleRef = ref(null)

const Draggable = useDraggable(progressCircleRef, {
  onStart: (p, e) => {
    console.log('start', e.offsetX, e)
  },
  onEnd: (p, e) => {
    console.log('end', e.offsetX, e)
  },
})
</script>

<template>
  <div :class="{ slideUp: !isFullScreenPlayer }" transition-transform class="fullScreenPlayer" fixed w-100vw h-100vh bg="#9966ff" z-9000 top-0 left-0>
    <div class="player__minimize" absolute i-carbon:chevron-down top-10 right-10 w-10 h-10 color="#ccc" @click="isFullScreenPlayer = false" />
    <div class="player__container" xl:px="10%" w-full h-full flex="~" justify-end>
      <div class="song" overflow-hidden py="6%" pr="100px" space-y-6 min-w-400px>
        <!-- 图片 -->
        <div h="65%" text-center>
          <img h="100%" inline-block object-contain class="song__img" rounded-3xl :src="`${playMusicStore.getPlayMusicCover}?param=512y512`" alt="" />
        </div>
        <!-- 歌曲信息 -->
        <div mt-20px flex="~" justify-between>
          <div class="song__info" overflow-hidden>
            <div class="song__name" w-full truncate text-2xl color="#fff" font-bold :title="playMusicStore.getPlayMusicName">{{ playMusicStore.getPlayMusicName }}</div>
            <div class="song__singer" text-sm truncate color="#ccc">{{ playMusicStore.getPlayMusicSongsSinger }}</div>
          </div>
          <div class="song__operation" mr-4 flex="inline col" justify-center>
            <div m-2 i-carbon-favorite color="#fff" class="hover:i-carbon:favorite-filled hover:scale-115" transition-transform></div>
          </div>
        </div>
        <!-- 进度条 -->
        <div flex="~ row " items-center space-x-4 color="#cdcafe">
          <div text-right>{{ audioInfo.musicCurrentTime }}</div>
          <div flex-1 h-1 bg="#ccc" rounded-md class="progress" ref="progressRef" @click="changePlayTime">
            <div :style="`width:${percentage}%`" h-full bg="#ff9966" rounded-md relative>
              <div h="2.5" w="2.5" class="progress--circle" ref="progressCircleRef" cursor-pointer transition="all" rounded-lg right="-1.25" bg="#fff" absolute top="-.75"></div>
            </div>
          </div>
          <div>{{ audioInfo.musicOverTime }}</div>
        </div>
        <!-- 播放按钮 -->
        <div flex="~" items-center justify-center text-lg font-800 color-white>
          <!-- 上一首 -->
          <div class="icon" @click="prevPlayMusic">
            <div i-carbon:skip-back-filled />
          </div>
          <!-- 播放 -->
          <div v-show="isPlaying" class="icon" @click="stopPlayMusic" mx-8>
            <div i-carbon:pause-filled w-12 h-12 />
          </div>
          <!-- 暂停 -->
          <div v-show="!isPlaying" class="icon" @click="playMusic" mr-7 ml-9>
            <div i-carbon:play-filled-alt w-12 h-12 />
          </div>
          <!-- 下一首 -->
          <div class="icon" @click="nextPlayMusic">
            <div i-carbon:skip-forward-filled />
          </div>
        </div>
      </div>
      <div class="player__lyrics" shrink-0 bg="#ff9966" w="1/2"></div>
    </div>
  </div>
  <div h-full>
    <footer class="footer" color="#fff" h-full>
      <div flex="~" justify-between items-center color-white h-full>
        <div class="left" flex="~" text-2xl space-x-3 w="1/3">
          <div h-50px w-50px flex="shrink-0" class="footer__music--img">
            <img :src="`${playMusicStore.getPlayMusicCover}?param=224y224`" alt="" rounded-lg />
          </div>
          <div class="footer__music--title" text-base flex="~ col" justify-evenly>
            <!-- 歌名 -->
            <div class="footer__music--song" text-base overflow-hidden>
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
          <span i-carbon:volume-up-filled w5 h5></span>
          <span i-carbon:volume-mute-filled w5 h5></span>
          <span i-carbon:chevron-up @click="isFullScreenPlayer = true"></span>
          <progress value="70" max="100">70 %</progress>
          <div class="audio" hidden>
            <audio ref="audio" :src="playMusicUrl" autoplay controls @ended="endPlayMusic" @play="startPlayMusic" @error="stopPlayMusic" @pause="stopPlayMusic" @timeupdate="timeUpdate($event)">
              <source :src="playMusicUrl" type="audio/ogg" />
              <source :src="playMusicUrl" type="audio/mpeg" />
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
<style scoped>
.slideUp {
  @apply translate-y-100%;
}

.progress .progress--circle {
  @apply hidden;
}
.progress:hover .progress--circle {
  @apply block;
}
</style>
