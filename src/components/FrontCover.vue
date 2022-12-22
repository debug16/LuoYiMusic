<script setup lang="ts">
interface Props {
  shape?: string
  src?: string
  title?: string
  titleCenter?: boolean
  describe?: string
  showIcon?: boolean
}

interface Emits {
  clickPlay: (e: 'click') => {}
  clickImg: (e: 'click') => {}
  clickTitle: (e: 'click') => {}
  clickDescribe: (e: 'click') => {}
}

const emit = defineEmits<Emits>()
const { showIcon = true, titleCenter = false } = defineProps<Props>()

const titleClass = reactive({
  'text-center': titleCenter,
})
</script>

<template>
  <div class="front-cover" h-full flex="~ col">
    <Images :src="src" cursor-pointer :shape="shape" @click.stop="$emit('clickImg')">
      <template #content v-if="showIcon">
        <IconPlay @click.stop="$emit('clickPlay')"></IconPlay>
      </template>
    </Images>
    <div class="title" v-if="title" cursor-pointer :class="titleClass" @click.stop="$emit('clickTitle')" :title="title">
      {{ title }}
    </div>

    <div class="describe" v-if="describe" cursor-pointer @click.stop="$emit('clickDescribe')" :title="title">
      {{ describe }}
    </div>

    <div v-if="$slots.default">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.front-cover {
  & :deep(.images:hover .icon-play) {
    @apply block;
  }
}
.title {
  @apply mt-4 font-bold text-base line-feed line-clamp-2 hover:underline;
}
.describe {
  @apply text-xs color-#000/60 line-feed line-clamp-1 hover:underline;
}
</style>
