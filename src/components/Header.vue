<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const menuRef: any = $ref()

const showMenu = (e: MouseEvent) => {
  menuRef.openMenu(e)
}

</script>

<template>
  <header flex="~" justify-between items-center h-full>
    <div class="left" flex="~" text-2xl space-x-6 w="1/4">
      <div class="icon" @click="router.back()">
        <div i-carbon:chevron-left />
      </div>
      <div class="icon" @click="router.go(1)">
        <div i-carbon:chevron-right />
      </div>
    </div>
    <div class="center" flex="~" space-x-12 text-lg font-800>
      <div :class="{ active: route.path === '/' }" @click="router.push('/')">
        <span>首页</span>
      </div>
      <div @click="router.push('/explore')" :class="{ active: route.path === '/explore' }">
        <span>发现</span>
      </div>
      <div @click="router.push('/musicLibrary')">
        <span>音乐库</span>
      </div>
    </div>
    <div class="right" flex="~" space-x-3 w="1/4" justify-end>
      <div class="search">
        <input type="text" h-8 rounded-md placeholder="search" px-2 bg="#eee/65" outline-none />
      </div>
      <div class="headPortrait">
        <images w-8 h-8 @click="showMenu" src="http://p2.music.126.net/Gwxpt7cgsg-vj1zzAkkvtA==/109951167541643053.jpg?param=512y512" shape="circle" />
      </div>
    </div>
    <Menu ref="menuRef">
      <div class="item">登录</div>
      <div class="item">注册</div>
      <div class="item">Github仓库</div>
    </Menu>
  </header>
</template>

<style scoped>
.icon {
  @apply cursor-pointer rounded-lg p-1 hover:bg-#d1d1d647;
}

.center > div {
  @apply cursor-pointer hover:color-blue-600;
}

.active span {
  @apply color-blue-600;
}
</style>
