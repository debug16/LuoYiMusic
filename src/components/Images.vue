<script setup lang="ts">
const props = defineProps({
  shape: {
    type: String,
    default: 'square',
    validator: (v: string) => ['circle', 'square'].includes(v),
  },
  src: String,
})
</script>

<template>
  <div class="images" :class="props.shape">
    <img v-bind:="$attrs" :src="src" />
    <div class="images__content" v-if="$slots.content">
      <slot name="content" />
    </div>

    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
//
.images {
  @apply relative;
  &.circle {
    @apply rounded-50% overflow-hidden;
    img {
      @apply rounded-50%;
    }
  }
  &.square {
    img {
      @apply rounded-xl;
    }
  }
  & .images__content {
    @apply absolute left-50% top-50% w-22% h-22% -translate-50%;
  }
}
</style>
