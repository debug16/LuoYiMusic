<script setup lang="ts">
interface Props {
  text?: string
  color?: string
  bg?: string
}

const { color = '#335eea', bg = '#8caaff73' } = defineProps<Props>()
</script>

<template>
  <div class="button" :bg="bg" :color="color" select-none cursor-pointer flex="~" items-center space-x-1 py-2 px-4 rounded-lg font-500 hover:scale-104 transition-transform>
    <slot name="icon"></slot>
    <span v-if="text">{{ text }}</span>
  </div>
</template>

<style scoped lang="scss"></style>
