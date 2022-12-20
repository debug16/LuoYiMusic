<script setup lang="ts">
interface Props {
  name?: string
  title?: string
  titleContent?: string
  description?: string
}
const { name } = defineProps<Props>()
</script>

<template>
  <div class="introduce" flex="~" >
    <div class="left" shrink-0 w="1/5" mr-15 self-center>
      <!-- slot left -->
      <slot name="left" />
    </div>
    <div class="songsContent" font-400 flex="~ col" justify-evenly items-start min-h-full>
      <div class="songsName" text-3xl font-900>
        {{ name }}
      </div>
      <div class="singer" text-lg>
        <p text-lg>{{ title }}</p>
        <p class="time" color="#000/60" text-sm>{{ titleContent }}</p>
      </div>
      <div class="describe" text-sm color="#000/60" :title="description">
        {{ description }}
      </div>
      <!-- slot footer -->
      <div class="footer" flex space-x-4>
        <slot name="footer" />
      </div>
    </div>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.introduce {
  .describe {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
}
</style>
