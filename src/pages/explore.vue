<script setup lang="ts">
import { onBeforeRouteUpdate, Router } from 'vue-router';

const categoryList: Array<string> = [
  "全部",
  "推荐歌单",
  "精品歌单",
  "官方",
  "排行榜",
  "欧美",
  "流行",
  "摇滚",
  "电子",
  "说唱",
  "ACG",
  "· · ·"
]

const router: Router = useRouter();


onBeforeRouteUpdate((route) => {
  // console.log(route.to)
})


</script>

<template>
  <!-- 发现页 -->
  <div class="explore-page">
    <div class="title" my13>
      <h1 text-6xl font-700>发现</h1>
    </div>
    <div class="category" mb-6>
      <ul flex>
        <li v-for="category,i in categoryList" :key="i" bg='#323232' px4 py2 rd-3 mr4 cursor="pointer"
          @click="router.push(`/explore?category=${category}`)">
          <span inline-block text-lg color='#7a7a7b' font-600>{{category}}</span>
        </li>
      </ul>
    </div>
    <div class="recommend__content grid grid-cols-5 grid-flow-row gap-x-4 gap-y-8">
      <div v-for="i in 20" :key="i" cursor-pointer>
        <div class="frontCover" relative>
          <img
            src="https://p1.music.126.net/UCRS2tO2tZbkGmq6rj4l0A==/109951165491046990.jpg?param=512y512?param=512y512"
            rounded-xl alt="item.name">
          <!-- <div class="play__btn -translate-1/2" bg="#fff/20" hidden hover="bg-#fff/30" p-3 rounded="50%" absolute top="1/2" left="1/2" @click.stop="null">
              <div i-carbon:play-filled-alt w-8 h-8 />
            </div> -->
          <IconPlay />
        </div>
        <div class="describe" title="「雨之摇滚·倾听爱与自由乐章」">
          「雨之摇滚·倾听爱与自由乐章」
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.frontCover:hover>.play__btn {
  display: block;
}
</style>