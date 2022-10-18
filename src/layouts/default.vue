<script setup lang="ts">
// footer是否隐藏
let footerHide = $ref(true)

// 更新footer隐藏状态
const updateFooterHide = () => {
  footerHide = false
}
// 提供给外部的方法和属性
provide('footerHide', { footerHide, updateFooterHide })
</script>

<template>
  <!-- 头部内容 -->
  <div class="header" bg="#222222/95" h-65px>
    <Header />
  </div>
  <!-- 主体内容 -->
  <main class="text-gray-200 main">
    <RouterView />
  </main>
  <!-- 尾部内容 -->
  <div :class="{ hide: footerHide }" transition-all class="footer" bg="#222222/95" h-65px>
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
  @apply filter:blur(1px) bg-#222/90 
}

.header,
.main,
.footer {
  @apply xl: px-10%
}

.hide {
  @apply translate-y-100%
}
</style>
