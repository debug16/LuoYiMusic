<script setup lang="ts" :inherit-attrs="false">
const props = defineProps({
  iconName: {
    type: String,
    required: true,
  },
  w:Number,
  h:Number
})

</script>

<template>
  <div class="icon">
    <div :class="iconName" :w="w" :h="h" font-600></div>
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.icon {
  @apply p-1.5 rounded-lg transition-duration-500 cursor-pointer;
  &:hover {
    @apply bg-#d1d1d647;
  }
}
</style>