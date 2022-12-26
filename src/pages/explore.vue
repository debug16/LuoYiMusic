<script setup lang="ts">
import { playlistDetail, playlistHighqualityTags, topPlaylistHighquality } from '~/api/playlist'
import { onBeforeRouteUpdate } from 'vue-router'
import { imgUrlSize } from '~/utils/img'
import { formatDate } from '~/utils/date'
import { isSongsFree } from '~/utils/songs';
import { usePlayMusicStore } from '~/stores/playMusic';

// const categoryList: Array<string> = ['全部', '推荐歌单', '精品歌单', '官方', '排行榜', '欧美', '流行', '摇滚', '电子', '说唱', 'ACG', '· · ·']
const playMusicStore = usePlayMusicStore()
const router: any = useRouter()
const route: any = useRoute()

let tags: any = $ref()

let playList: any = $ref()


// 获取歌单事件
const onPlayRecommendedList = (playlistId: number) => {
  // 获取歌单详情
  playlistDetail(playlistId).then(res => {
    let playlist: Array<any> = []

    if (res.code === 200) playlist = res.playlist?.tracks

    // 如果歌单列表里没有音乐
    if (playlist?.length <= 0) return
    // 找到免费的歌曲
    const song = playlist.find((songs: { fee: number; id: any }) => {
      if (isSongsFree(songs.fee)) {
        playMusicStore.setPlayMusicId(songs.id)
        playMusicStore.setPlayMusic(songs)
        return true
      }
      return false
    })
    // 如果歌单列表里有免费音乐 就放入待播放的音乐列表
    if (song) playMusicStore.setPlayMusicList(playlist)
  })
}

onBeforeMount(() => {
  playlistHighqualityTags().then((res: any) => {
    if (res.code === 200) {
      tags = res.tags
    }
  })
  topPlaylistHighquality().then((res: any) => {
    if (res.code === 200) {
      playList = res.playlists
    }
  })
})

onBeforeRouteUpdate(route => {
  topPlaylistHighquality({ cat: route.query.category }).then((res: any) => {
    if (res.code === 200) {
      playList = res.playlists
    }
  })
})
</script>

<template>
  <!-- 发现页 -->
  <div class="explore-page">
    <div class="title" my13>
      <h1 text-6xl font-700>发现</h1>
    </div>
    <div class="category" mb-6>
      <ul flex flex-wrap>
        <template v-for="tag in tags"
          :key="tag.id">
          <li
          class="tag"
          v-if="tag.name !== 'R&B/Soul'"
          :class="{ active: route.query.category === tag.name }"
          color="#7a7a7b"
          mb-3
          bg="#eee/65"
          hover="color-#335eea bg-#eaeffd"
          px4
          py2
          rd-3
          mr4
          cursor="pointer"
          @click="router.push(`/explore?category=${tag.name}`)"
        >
          <span inline-block text-lg font-600>{{ tag.name }}</span>
        </li>
        </template>
        
      </ul>
    </div>
    <div class="recommend__content grid grid-cols-5 grid-flow-row gap-x-4 gap-y-8">
      <FrontCover 
      v-for="item in playList" 
      :key="item.id" cursor-pointer 
      :src="imgUrlSize(item.coverImgUrl, 350)" 
      :title="item.name" 
      :describe="formatDate(item.createTime)"
      @click-img="router.push(`/playlist/${item.id}`)"
      @click-title="router.push(`/playlist/${item.id}`)"
      @click-describe="router.push(`/playlist/${item.id}`)"
      @click-play="onPlayRecommendedList(item.id)"
      > 
    </FrontCover>
    </div>
  </div>
</template>

<style scoped lang="scss">
.front-cover {
  &:deep(.title) {
    @apply line-clamp-1;
  }
  &:deep(.images){
    @apply grow;
  }
}

.category .tag {
  &.active {
    @apply color-#335eea bg-#eaeffd;
  }
}
</style>
