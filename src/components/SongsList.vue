<script setup lang="ts">
</script>

<template>
  <div class="songsList" mt-20 tracking-widest>
      <div v-for="songs in songsList" :key="songs.id" w-full flex="~" p-2 rounded-xl items-center
        :class="{ vip: songs.fee !== 0 && songs.fee !== 8, active: songs.id == playMusicStore.getPlayMusicId }"
        :title="songs.fee !== 0 && songs.fee !== 8 ? 'Only VIP Can Play' : ''" @dblclick="dblclickPlayMusic(songs)">
        <div class="songs" flex="~ grow-0" items-center w="50%" pr-5>
          <div h-13 w-13 shrink-0 mr-5>
            <img h-full rounded-lg :src="`${songs?.al.picUrl}?param=224y224`" alt="" />
          </div>
          <div overflow-hidden>
            <div truncate grow-0 w-full font-800 text-lg>
              <span>{{ songs.name }}</span>
              <span v-if="songs.alia[0]" text="#fff/60"> ({{ songs?.alia && songs?.alia[0]?.toString() }}) </span>
            </div>
            <div text-xs color="#fff/60" truncate>
              <span>{{ formatSongsSinger(songs?.ar) }}</span>
            </div>
          </div>
        </div>
        <div basis="40%" font-bold text-sm>
          <span>{{ songs.al.name }}</span>
        </div>
        <div basis="10%" text-right>
          <span>{{ Math.floor(songs.dt / 1000 / 60) }}:{{ `${Math.floor((songs.dt / 1000) % 60)}`.padStart(2, '0')
          }}</span>
        </div>
      </div>
    </div>
</template>

<style scoped>

</style>