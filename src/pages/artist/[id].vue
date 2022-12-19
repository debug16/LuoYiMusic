<script setup lang="ts">
interface Props {
  id: string
}

const { id } = defineProps<Props>()

console.log(id)
</script>

<template>
  <div class="artist" py-10 space-y-20>
    <!-- 艺人介绍 -->
    <div class="artists-introduce">
      <Introduce
        text-5xl
        name="张杰"
        title="艺人"
        title-content="523 首歌 · 118 张专辑 · 96 个 MV"
        description="张杰，华语LIVE王。
出道16年来，发行了14张专辑，200多首高品质音乐作品，40多首OST金曲，拥有众多被广为传唱的歌曲。近年来，他创新运用MIX-POP曲风，开辟音乐发展新征程。
170多个音乐奖项，让他实现内地音乐奖项大满贯。2010年，获得韩国Mnet亚洲音乐盛典“亚洲之星”大奖；2014年，获得第42届全美音乐奖“年度国际艺人大奖”，成为内地首位获得该奖项的歌手。
至今为止，举办了 61场大型演唱会，巡演足迹踏过海内外30余座城市，累计130万人观看。2018、2019连续两年打破鸟巢单场演唱会票房纪录。"
      >
        <template #left>
          <Images src="https://p1.music.126.net/y0e-xAsAkTIQ-AiQ1GdW7w==/109951167519174642.jpg?param=1024y1024" shape="circle"></Images>
        </template>
        <template #footer>
          <Button @click="null" text="播放">
            <template #icon>
              <div i-carbon:play-filled-alt w-5 h-5 color="#335eea" />
            </template>
          </Button>
        </template>
      </Introduce>
    </div>
    <!-- 热门歌曲 -->
    <div class="hot-songs" space-y-6>
      <h1 text-2xl font-600>最新发布</h1>
      <!-- 歌曲列表 -->
      <div class="songs-list" grid grid-cols-4>
        <div v-for="(item, i) in 12" :key="i" class="songs-item" flex p-2 rounded-xl hover="bg-#eee/50">
          <!-- 图片 -->
          <div class="songs-img">
            <Images w-12 h-12 src="https://p1.music.126.net/VuJFMbXzpAProbJPoXLv7g==/7721870161993398.jpg?param=224y224"></Images>
          </div>
          <!-- 歌曲信息 -->
          <div class="songs-info" flex flex-col justify-between ml-2>
            <!-- 歌曲名 -->
            <div class="songs-name" text-base font-700>走马</div>
            <!-- 歌手 -->
            <div class="songs-artist" text-xs color="#000/80">陈粒</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 专辑 -->
    <div class="album" space-y-6 >
      <h1 text-2xl font-600>专辑</h1>
      <div class="album-list" grid grid-cols-5 grid-flow-row gap-x-4 gap-y-9>
        <div v-for="(item, i) in 12" :key="i">
          <Images src="https://p1.music.126.net/YaX8ikdwH5eSPxIYAq_QZA==/109951164715645646.jpg?param=512y512" cursor-pointer>
            <template #content>
              <div class="play__btn" bg="#fff/20" hidden backdrop-blur-lg hover="bg-#fff/30 backdrop-blur-lg" p-3 rounded="50%">
                <div i-mingcute-play-fill w-8 h-8 bg="#fff" />
              </div>
            </template>
          </Images>
          <div class="describe" my-4 font-600 text-base line-feed line-clamp-2 hover:underline cursor-pointer>悠长假期</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.introduce :deep(.songsName) {
  @apply text-5xl;
}

.images:hover {
  & .images__content .play__btn {
    @apply block;
  }
}
</style>
