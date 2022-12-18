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
  const { x, y } = keepInBounds(menu, event.clientX, event.clientY)
  nextTick(() => {
    // 使菜单聚焦
    menu.focus()
  })
  
  left = `${x}px`
  top = `${y}px`
  showMenu = true
  event.preventDefault()
}

// 弹出边界控制
function keepInBounds(popup: HTMLElement, x: number, y: number) {
  // 获取弹出框的宽度和高度
  const popupWidth = popup.offsetWidth
  const popupHeight = popup.offsetHeight
  console.log(1,popupHeight,popupWidth);
  

  // 获取浏览器窗口的内部宽度和高度
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  // 如果弹出框超出了右边界，将其移回合法范围内
  if (x + popupWidth > windowWidth) {
    x = windowWidth - popupWidth - 60
  }

  // 如果弹出框超出了下边界，将其移回合法范围内
  if (y + popupHeight > windowHeight) {
    y = windowHeight - popupHeight 
  }

  // 如果弹出框超出了左边界，将其移回合法范围内
  if (x < 0) {
    x = 0
  }

  // 如果弹出框超出了上边界，将其移回合法范围内
  if (y < 0) {
    y = 0
  }

  return { x, y }
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
