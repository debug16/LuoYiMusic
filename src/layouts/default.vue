<script setup lang="ts">
// footer是否隐藏
let footerHide = $ref(true)
// 标记是否显示全屏播放器
let isFullScreenPlayer = $ref(false)

// 更新footer隐藏状态
const updateFooterHide = () => {
  footerHide = false
}
const updateIsFullScreenPlayer = () => {
  isFullScreenPlayer = true
}

// 提供给外部的方法和属性
provide('footerHide', { footerHide, updateFooterHide })
provide('isFullScreenPlayer', { isFullScreenPlayer, updateIsFullScreenPlayer })
</script>

<template>
  <!-- 头部内容 -->
  <div class="header" h-65px backdrop-blur-xl bg="#fff/90">
    <Header />
  </div>
  <!-- 主体内容 -->
  <main class="main">
    <RouterView v-slot="{ Component }">
      <component :is="Component"></component>
    </RouterView>
  </main>
  <!-- 尾部内容 -->
  <div :class="{ slideUp: footerHide }" transition-transform transition-duration-400 backdrop-blur-xl class="footer" bg="#fff/85">
    <Footer />
  </div>
</template>

<style scoped>
main {
  height: calc(100vh);
  overflow-y: auto;
  padding: 65px 0;
}

.header,
.footer {
  width: 100%;
  position: fixed;
  z-index: 99;
}

.header {
  top: 0;
}

.footer {
  bottom: 0;
}

.header,
.main{
  @apply xl:px-10% lg:px-5% md:px-3%;
}

.slideUp {
  @apply translate-y-100%
}
.header::after,
.footer::after {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: -1;
  @apply filter:blur(1px) 
}
</style>
