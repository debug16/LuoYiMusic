<script setup lang="ts">
</script>

<template>
  <div class="artist-page">
    <div class="songsInfo" flex="~">
      <div class="songsImg" shrink-0 w="1/5" mr-15>
        <img w-full
          src="https://p2.music.126.net/i602BtKvl61sUsTY5tqnnA==/109951167573473133.jpg?param=1024y1024?param=512y512"
          alt="" rounded="50%">
      </div>
      <div class="songsContent" font-400 flex="~ col" justify-evenly items-start min-h-full>
        <div class="songsName" text-3xl font-900>
          队长
        </div>
        <div class="singer" text-lg>
          <p text-lg>
            艺人
          </p>
          <p class="time" text-sm color="#fff/68">
            99 首歌 · 44 张专辑 · 17 个 MV
          </p>
        </div>

        <div class="describe" text-sm color="#fff/68" title="songsListDetails?.description">
          队长(YoungCaptain)，1994年4月14日出生于贵州贵阳市，唱作人、音乐制作人、MV导演。
        </div>
        <!-- 播放按钮 -->
        <div class="manipulate" flex="~" items-center space-x-1 bg="#bbcdff" py-2 px-4 rounded-lg color="#335eea"
          font-500 hover:scale-104 transition-transform>
          <div i-carbon:play-filled-alt w-5 h-5 color="#335eea" />
          <span>播放</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>