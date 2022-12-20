<script setup lang="ts">

interface Props {
  name: string
  artist?: string
  albumName?: string
  songsTime?: number
  available?: boolean
  active?: boolean,
  imgSrc?:string,
  alia?:string,
}

interface Emits{
  songsDblclick:()=>{},
}

defineEmits<Emits>()

const { available = false, active = false } = defineProps<Props>()
</script>

<template>
      
  <div class="songs-info" rounded-xl>
    <div
      w-full
      flex="~"
      p-2
      rounded-xl
      items-center
      :class="{ vip: !available, active: active }"
      :title="!available ? 'Only VIP Can Play' : ''"
      @dblclick="$emit('songsDblclick')"
    >
      <div class="songs" flex="~ grow-0" items-center w="50%" pr-5>
        <div h-13 w-13 shrink-0 mr-5>
          <img h-full rounded-lg :src="imgSrc" alt="" />
        </div>
        <div overflow-hidden>
          <div truncate grow-0 w-full font-800 text-lg>
            <span>{{ name }}</span>
            <span v-if="alia" text="#fff/60"> ({{ alia }}) </span>
          </div>
          <div text-xs color="#000/80" truncate>
            <span>{{ artist }}</span>
          </div>
        </div>
      </div>
      <div v-if="albumName" basis="40%" font-bold text-sm>
        <span>{{ albumName }}</span>
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
