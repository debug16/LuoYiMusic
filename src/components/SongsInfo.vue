<script setup lang="ts">
interface Props {
  name: string
  artist?: string
  albumName?: string
  songsTime?: number
  available?: boolean
  active?: boolean
  imgSrc?: string
  alia?: string
}

interface Emits {
  songsDblclick: () => {}
  clickAlbum: () => {}
}

defineEmits<Emits>()

const { available = false, active = false } = defineProps<Props>()
</script>

<template>
  <div class="songs-info" w-full rounded-xl>
    <div w-full flex="~" p-2 rounded-xl items-center :class="{ vip: !available, active: active }" :title="!available ? 'Only VIP Can Play' : ''" @dblclick="$emit('songsDblclick')">
      <div class="songs" items-stretch flex="~" flex-1 max="w-100%" :class="{ 'max-w-50%': albumName || songsTime, 'max-w-100%': !albumName && !songsTime }" items-center pr-5>
        <div shrink-0 mr-5>
          <img h-13 w-13 rounded-lg :src="imgSrc" alt="" />
        </div>
        <div overflow-hidden flex="~ col" justify-around max="w-100%">
          <div class="nameBox" truncate grow-0 max="w-full" font-800 text-lg cursor-context-menu leading-initial>
            <span class="name" w-full overflow-hidden>{{ name }}</span>
            <span truncate v-if="alia" text="#7a7a7a/60"> ({{ alia }}) </span>
          </div>
          <div text-xs color="#000/80" truncate>
            <span overflow-hidden>{{ artist }}</span>
          </div>
        </div>
      </div>
      <div v-if="albumName" basis="40%" font-bold text-sm flex>
        <span line-feed line-clamp-1 cursor-pointer hover:underline @click="$emit('clickAlbum')">{{ albumName }}</span>
      </div>
      <div v-if="songsTime" basis="10%" text-right>
        <span>{{ Math.floor(songsTime / 1000 / 60) }}:{{ `${Math.floor((songsTime / 1000) % 60)}`.padStart(2, '0') }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.songs-info .vip span {
  @apply color-#ccc/80;
}

.songs-info .active {
  background-color: rgba(140, 170, 255, 0.45) !important;
}

.songs-info .active span {
  @apply color-#4756ff/95;
}

.songs-info > div:not(.vip) {
  @apply hover:bg-#eee/50;
}
</style>
