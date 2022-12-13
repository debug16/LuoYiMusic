<script setup lang="ts">
const menu: any = $ref()
let top = $ref('0px')
let left = $ref('0px')
let showMenu = $ref(false)

// 关闭菜单
const closeMenu = () => {
  showMenu = false
}

// 打开菜单
const openMenu = (event: MouseEvent) => {
  showMenu = true
  nextTick(() => {
    // 使菜单聚焦
    menu.focus()
  })
  left = `${event.clientX}px`
  top = `${event.clientY}px`

  event.preventDefault()
}

defineExpose({
  openMenu,
})
</script>

<template>
  <div v-show="showMenu" ref="menu" class="menu" tabindex="-1" :style="{ top: top, left: left }" @blur="closeMenu" @click="closeMenu">
    <div v-if="$slots.default" class="menu__content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.menu {
  @apply p2 fixed border-none outline-none bg-#fff border-#eee shadow-light rounded-xl border-1 border-solid;
  .menu__content :deep(.item) {
    @apply px-4 cursor-pointer text-center py-2  font-600 rounded-lg;

    &:hover {
      @apply bg-#eaeffd color-blue-600;
    }
  }
}
</style>
