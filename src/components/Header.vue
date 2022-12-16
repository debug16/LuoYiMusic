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
      <Icon iconName="i-mingcute-left-fill" @click="router.back()"/>
      <Icon iconName="i-mingcute-right-fill" @click="router.go(1)"/>
    </div>
    <div class="center" flex="~" space-x-6 text-lg font-700>
      <div :class="{ active: route.path === '/' }" @click="router.push('/')" icon>
        <span>首页</span>
      </div>
      <div @click="router.push('/explore')" :class="{ active: route.path === '/explore' }" icon> 
        <span>发现</span>
      </div>
      <div icon>
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
      <div class="item" @click="router.push('/settings')">设置</div>
      <div class="item" @click="router.push('/login')">登录</div>
      <div class="item">注册</div>
      <div class="item">Github仓库</div>
    </Menu>
  </header>
</template>

<style scoped lang="scss">
.center > div {
  @apply cursor-pointer hover:bg-#d1d1d647;
}

.active span {
  @apply color-blue-600;
}
</style>
