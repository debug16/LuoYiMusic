<script setup lang="ts">
import { usePlayMusicStore } from '~/stores/playMusic'
import { isSongsFree } from '~/utils/songs'
import { formateTime } from '~/utils/time'
import { formatLyric } from '~/utils/lyric'
import { lyric } from '~/api/lyric'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

const playMusicStore = usePlayMusicStore()

// 播放栏被点击
let isFullScreenPlayer = $ref(false)

// 音乐播放信息
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

// 注入播放栏操作
const injects = inject<{
  footerHide: boolean
  updateFooterHide: () => void
}>('footerHide')

const audio: HTMLAudioElement = $ref()

// ----------------------------  音乐播放操作 start  ----------------------------
// #region
// 音乐开始播放事件
const startPlayMusic = () => {
  playMusicStore.activePlayMusic.state = 'playing'
  audioInfo.duration = audio.duration
  audioVolume = audio.volume
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

// 音乐播放 暂停 切换
const togglePlayMusic = () => {
  if (audio.paused) playMusic()
  else stopPlayMusic()
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
  // 获取当前歌词索引
  const index = activeLyricIndex(audioInfo.currentTime)
  const len = lyricsInfo.lyrics.length
  lyricsInfo.lyricsIndex = index === 0 ? 0 : index === len - 1 ? index : index - 1
}

// #endregion
// ----------------------------  音乐播放操作 end  ----------------------------

// ----------------------------  歌词操作 start  ----------------------------
// #region

let lyricsRef: HTMLDivElement = $ref()
let lyricConRef: HTMLDivElement = $ref()

// 歌词
let lyricsInfo = reactive({
  lyrics: [{ time: 0, text: '' }],
  lyricsIndex: 0,
})

/**
 * 获取歌词
 */
const activeLyricIndex = (time: number) => {
  return (
    lyricsInfo.lyrics.findIndex((item, i, obj) => {
      // 找到当前歌词位置
      if (item.time >= time) {
        return true
      }
      if (obj.length - 1 === i) {
        return true
      }
      return false
    }) || 0
  )
}

// 点击歌词
const clickLyric = (i: number) => {
  audio.currentTime = lyricsInfo.lyrics[i].time + 0.01
}

// #endregion
// ----------------------------  歌词操作 end  ----------------------------

//  ----------------------------  设置页面标题 start  ----------------------------
// #region
// 页面标题
let title = computed(() => {
  let musicName = playMusicStore.getPlayMusicName
  let musicSongsSinger = playMusicStore.getPlayMusicSongsSinger
  return !musicName ? 'LuoYiMusic' : musicName + ' · ' + musicSongsSinger
})

// 设置页面标题
useTitle(title)
// #endregion
//  ----------------------------  设置页面标题 end  ----------------------------

//  ----------------------------  监听 start  ----------------------------
// #region
// 监听播放音乐的 id
watch(
  () => playMusicStore.activePlayMusic.id,
  (_nId: any, _old: any) => {
    // 清空歌词
    lyricsInfo.lyrics = [{ time: 0, text: '' }]
    // 重置歌词信息
    playMusicStore.setLyric(null)
    // 获取歌词
    if (_nId) {
      lyric(_nId).then((res: any) => {
        if (res.code === 200) {
          // 格式化保存歌词
          lyricsInfo.lyrics = formatLyric(res.lrc?.lyric) || [{ time: 0, text: '没有歌词哦' }]
          playMusicStore.setLyric(lyricsInfo.lyrics)
        }
      })
    }
    // 设置页面标题为歌曲名
    // title =
    // 暂停播放
    stopPlayMusic()

    // // 检查音乐是否收费
    // if (!isSongsFree(playMusicStore.activePlayMusic.music.fee)) {
    //   // 播放下一首
    //   nextPlayMusic()
    // }

    // 播放栏是否隐藏
    if (injects?.footerHide && _nId) {
      injects.updateFooterHide() // 如果隐藏则显示
      injects.footerHide = false // 将隐藏状态设置为 false
    }
  },
  { immediate: true }
)

// 监听歌词变化索引
watch(
  () => lyricsInfo.lyricsIndex,
  (nIndex: number, oldIndex: number) => {
    let HTML = lyricsRef?.querySelector(`div[data-lyric-index="${nIndex}"`) as HTMLDivElement
    const style: CSSStyleDeclaration = window.getComputedStyle(lyricConRef)
    const HTMLstyle: CSSStyleDeclaration = window.getComputedStyle(HTML)
    const pt = parseFloat(style.getPropertyValue('padding-top'))
    const htmlH = parseFloat(HTMLstyle.getPropertyValue('height'))
    // TODO 有问题
    const offsetTop: number = HTML?.offsetTop - pt + htmlH
    lyricsRef?.scrollTo({
      top: offsetTop,
      behavior: 'smooth',
    })
  }
)

// #endregion
//  ----------------------------  监听 end  ----------------------------

// ----------------------------  进度条 start  ----------------------------
// #region

// 进度条改变事件
const change = (v: number, i: number) => {
  audio.currentTime = v
}

// 进度条上方提示格式话函数
const tooltipFormatter = (v: number) => {
  return formateTime(v) || 'unknown'
}

// #endregion
// ----------------------------  进度条 end  ----------------------------

// ----------------------------  音量操作 start  ----------------------------
// #region

let audioVolume = $ref(audio?.volume || 0.5)

// 音量改变事件
const onVolumechange = (e: Event) => {
  audioVolume = audio.volume
  // 避免 静音的时候 进度条没有归零
  if (audio.muted) audioVolume = 0
}

// 静音
const onMute = () => {
  audio.muted = true
}

// 解除静音
const onUnmute = () => {
  audio.muted = false
  // 避免在在音量已经为 0 的时候 解除静音还是音量为 0
  if (audio.volume === 0) audio.volume = Math.max(audio.volume, 0.3)
  audioVolume = audio.volume
}

// 静音切换
const toggleMute = () => {
  if (audio.muted || audio.volume === 0) onUnmute()
  else onMute()
}
// 进度条改变音量
const changeVolume = (v: number, i: number) => {
  audio.volume = v
  if (v > 0) onUnmute()
}

// #endregion
// ----------------------------  音量操作 end  ----------------------------

// ----------------------------  快捷键 start  ----------------------------
// #region

const activeElement = useActiveElement()

// 焦点是否在输入框
const notUsingInput = $(computed(() => activeElement.value?.tagName !== 'INPUT' && activeElement.value?.tagName !== 'TEXTAREA'))

// 取消键盘默认事件
const onEventFired = (e: KeyboardEvent) => {
  if (notUsingInput && (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'ArrowDown')) {
    e.preventDefault()
  }
}
// 获取快捷键的按下状态
const { space, down, up, left, right, n, p, m, Escape, f } = $(useMagicKeys({ passive: false, onEventFired: onEventFired }))

// 快捷键监听
watchEffect(() => {
  // audio 还没初始化 或者焦点在输入框 不做操作
  if (!audio || !notUsingInput) return
  // 空格 暂停音乐
  if (space) togglePlayMusic()
  // 下键 降低音量
  if (down) (audio.volume = Math.max(audio.volume - 0.1, 0)), (audio.muted = false)
  // 上键 提升音量
  if (up) (audio.volume = Math.min(audio.volume + 0.1, 1)), (audio.muted = false)
  // 左键 减音乐时间
  if (left) audio.currentTime = Math.max(audio.currentTime - 5, 0)
  // 右键 加音乐时间
  if (right) audio.currentTime = Math.min(audio.currentTime + 5, audio.duration)
  // N键(next) 下一首
  if (n) nextPlayMusic()
  // P键(pre) 上一首
  if (p) prevPlayMusic()
  // M键(mute) 静音
  if (m) toggleMute()
  // ESC键 取消歌词全屏
  if (Escape) isFullScreenPlayer = false
  // F键(full) 歌词全屏切换
  if (f) isFullScreenPlayer = !isFullScreenPlayer
})

// #endregion
// ----------------------------  快捷键 end  ----------------------------

// 播放音乐的 url
const playMusicUrl = computed(() => {
  if (playMusicStore.getPlayMusicId) return `https://music.163.com/song/media/outer/url?id=${playMusicStore.getPlayMusicId}.mp3`
})
</script>

<template>
  <vue-slider
    v-model="audioInfo.currentTime"
    :max="audioInfo.duration | 0"
    :interval="1"
    :min="0"
    tooltip='hover'
    :use-keyboard="false"
    :lazy="true"
    :tooltip-formatter="tooltipFormatter"
    :processStyle="{ backgroundColor: 'rgba(71,86,255)' }"
    :tooltipStyle="{ backgroundColor: 'rgba(71,86,255)',borderColor:'rgba(71,86,255)'}"
    :railStyle="{ backgroundColor: 'rgba(204,204,204,.3)' }"
    @change="change"
    :dragOnClick="true"
    :dotSize="[10, 10]"
    :height="2"
    :contained="true"
  />
  <div class="footerContent" pb-5px>
    <div :class="{ slideUp: !isFullScreenPlayer }" transition-transform transition-duration-500 class="fullScreenPlayer" color="#fff" fixed w-100vw h-100vh bg="#61394F" z-9000 top-0 left-0>
      <Icon class="player__minimize" z-10 absolute iconName="i-mingcute-down-fill" top-10 right-10 :w="8" :h="8" color="#ccc" @click="isFullScreenPlayer = false" />
      <div class="player__container" xl:px="10%" w-full h-full flex="~" justify-end>
        <div class="song" overflow-hidden py="6%" pr="100px" space-y-6 min-w-400px>
          <!-- 图片 -->
          <div h="65%" text-center>
            <img h="100%" inline-block object-contain class="song__img" rounded-3xl :src="`${playMusicStore.getPlayMusicCover}?param=512y512`" alt="" />
          </div>
          <!-- 歌曲信息 -->
          <div mt-20px flex="~" justify-between>
            <div class="song__info" overflow-hidden>
              <div class="song__name" w-full truncate text-2xl font-bold :title="playMusicStore.getPlayMusicName">{{ playMusicStore.getPlayMusicName }}</div>
              <div class="song__singer" text-sm truncate color="#ccc">{{ playMusicStore.getPlayMusicSongsSinger }}</div>
            </div>
            <div class="song__operation" mr-4 flex="inline col" justify-center>
              <Icon m-2 iconName="i-carbon-favorite" />
            </div>
          </div>
          <!-- 进度条 -->
          <div flex="~ row " items-center space-x-4 color="#ccc/50">
            <div text-right>{{ audioInfo.musicCurrentTime }}</div>
            <!-- <div flex-1 h-1 bg="#ccc" rounded-md class="progress" ref="progressRef" @click="changePlayTime">
              <div :style="`width:${percentage}%`" h-full bg="#ff9966" rounded-md relative>
                <div h="2.5" w="2.5" class="progress--circle" ref="progressCircleRef" cursor-pointer transition="all" rounded-lg right="-1.25" bg="#fff" absolute top="-.75"></div>
              </div>
            </div> -->
            <vue-slider
              flex-1
              pb-0
              v-model="audioInfo.currentTime"
              :max="audioInfo.duration | 0"
              :interval="1"
              :min="0"
              tooltip="none"
              :use-keyboard="false"
              :lazy="true"
              :tooltip-formatter="tooltipFormatter"
              @change="change"
              :processStyle="{ backgroundColor: '#fff' }"
              :railStyle="{ backgroundColor: 'rgba(204,204,204,.3)' }"
              :dragOnClick="true"
              :dotSize="[10, 10]"
              :height="3"
              :contained="true"
            />
            <div>{{ audioInfo.musicOverTime }}</div>
          </div>
          <!-- 播放按钮 -->
          <div flex="~" items-center justify-center text-lg font-800>
            <!-- 上一首 -->
            <Icon iconName="i-carbon:skip-back-filled" @click="prevPlayMusic" />
            <!-- 播放 -->
            <Icon iconName="i-carbon:pause-filled" :w="10" :h="10" v-show="isPlaying" class="icon" @click="stopPlayMusic" mr-7 ml-9 />
            <!-- 暂停 -->
            <Icon iconName="i-mingcute-play-fill" :w="10" :h="10" v-show="!isPlaying" @click="playMusic" mr-7 ml-9 />
            <!-- 下一首 -->
            <Icon iconName="i-carbon:skip-forward-filled " @click="nextPlayMusic" />
          </div>
        </div>
        <!-- 歌词 -->
        <div class="player__lyrics" shrink-0 w="1/2" ref="lyricsRef">
          <div class="lyrics__container" ref="lyricConRef">
            <!-- <template > -->
            <div
              v-for="(lyrics, index) in lyricsInfo.lyrics"
              :key="index"
              @click="clickLyric(index)"
              :data-lyric-index="index"
              :data-lyric-fTime="formateTime(lyrics.time)"
              :class="{ lyricActive: lyricsInfo.lyricsIndex === index }"
              hover="bg-#ccc/8 rounded-5"
              :data-lyric-time="lyrics.time"
            >
              {{ lyrics.text }}
            </div>
            <!-- </template> -->
          </div>
        </div>
      </div>
    </div>
    <div h-full>
      <footer class="footer" h-full @click="isFullScreenPlayer = true">
        <div flex="~" relative items-stretch justify-between items-center h-full>
          <div class="left" flex="~" text-2xl space-x-3>
            <div h-50px w-50px flex="shrink-0" class="footer__music--img">
              <img :src="`${playMusicStore.getPlayMusicCover}?param=224y224`" alt="" rounded-lg />
            </div>
            <div class="footer__music--title" text-base flex="~ col" justify-evenly>
              <!-- 歌名 -->
              <div class="footer__music--song" font-600 color="#000" text-base overflow-hidden>
                {{ playMusicStore.getPlayMusicName }}
              </div>
              <!-- 歌手 -->
              <div class="footer__music--singer" text-xs color="#000/65">
                {{ playMusicStore.getPlayMusicSongsSinger }}
              </div>
            </div>
          </div>
          <div class="center" absolute left="50%" top="50%" translate="-50%" flex="~" items-center text-lg font-800>
            <!-- 上一首 -->
            <Icon :iconName="'i-carbon:skip-back-filled'" @click.stop="prevPlayMusic"> </Icon>
            <!-- 播放 -->
            <Icon v-show="isPlaying" iconName="i-carbon:pause-filled" mx-4 :w="9" :h="9" @click.stop="stopPlayMusic">
            </Icon>
            <!-- 暂停 -->
            <Icon iconName="i-mingcute-play-fill" :w="9" :h="9" v-show="!isPlaying" mx-4 @click.stop="playMusic"> </Icon>
            <!-- 下一首 -->
            <!-- <div class="icon"> -->
            <Icon iconName="i-carbon:skip-forward-filled" @click.stop="nextPlayMusic"></Icon>
            <!-- </div> -->
          </div>
          <div class="right" @click.stop="null" flex="~" items-center space-x-3 justify-end>
            <Icon v-if="audio?.muted === true || audio?.volume <= 0" iconName="i-carbon:volume-mute-filled" :w="4" :h="4" @click="onUnmute" />
            <Icon v-else-if="audio?.volume <= 0.5 && audio?.volume > 0" iconName="i-carbon:volume-down-filled" :w="4" :h="4" @click="onMute" />
            <Icon v-else iconName="i-carbon:volume-up-filled" :w="4" :h="4" @click="onMute" />
            <vue-slider
              class="volume"
              v-model="audioVolume"
              :max="1"
              :interval="0.01"
              :min="0"
              tooltip="none"
              :use-keyboard="false"
              :tooltip-formatter="tooltipFormatter"
              :processStyle="{ backgroundColor: 'rgba(71,86,255)'}"
              :railStyle="{ backgroundColor: 'rgba(204,204,204,.3)'}"
              @change="changeVolume"
              :dragOnClick="true"
              :dotSize="[12, 12]"
              :height="6"
              :width="100"
              :contained="true"
            />
            <Icon iconName="i-mingcute-up-fill" :w="5" :h="5" @click="isFullScreenPlayer = true" />
            <div class="audio" hidden>
              <audio
                ref="audio"
                @volumechange="onVolumechange"
                :src="playMusicUrl"
                autoplay
                controls
                @ended="endPlayMusic"
                @play="startPlayMusic"
                @error="stopPlayMusic"
                @pause="stopPlayMusic"
                @timeupdate="timeUpdate($event)"
              >
                <source :src="playMusicUrl" type="audio/ogg" />
                <source :src="playMusicUrl" type="audio/mpeg" />
                您的浏览器不支持 audio 元素。
              </audio>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>
<style scoped lang="scss">
// ------------------------ 底部播放栏 进度条 start ------------------------
// #region
.vue-slider {
  padding-top: 0 !important;
  &:hover {
    :deep(.vue-slider-dot-handle) {
      display: block !important;
    }
  }
  :deep(.vue-slider-dot-handle) {
    display: none !important;
  }
}
// #endregion
// ------------------------ 底部播放栏 进度条 end ------------------------

// 音量进度条
.right {
  .volume {
    padding: 5px 0 #{!important};
  }
}

.footerContent {
  @apply w-full xl:px-10% md:px-3%;
}
.slideUp {
  @apply translate-y-100%;
}

.player__container .vue-slider {
  padding: 5px 0 !important;
}
.player__lyrics {
  @apply relative overflow-auto;
}
.player__lyrics::-webkit-scrollbar-thumb {
  display: none;
}
.player__lyrics .play__container {
  @apply h-14 relative -translate-y-50% top-50% border-light-50 border w-full;
}

.lyrics__container {
  @apply pt-48vh pb-52vh;
}
.lyrics__container div {
  @apply text-2xl color-#ccc/50 font-bold py-6 px-4 relative select-none;
}
.lyrics__container div:hover:after {
  content: attr(data-lyric-fTime);
  @apply absolute top-1 right-6 text-base;
}
.lyrics__container .lyricActive {
  @apply color-#fff  text-7 transition-all;
}
</style>
