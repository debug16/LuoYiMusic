<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'LuoYiMusic',
  meta: [
    { name: 'description', content: 'Opinionated Vite Starter Template' },
  ],
})
</script>

<template>
  <RouterView />
</template>

<style>
html {
  overflow-y: hidden;
}

*::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}

*::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: hsla(0, 0%, 50.2%, .38);
}

*::-webkit-scrollbar-track {
  background: transparent;
  border-left: 1px solid hsla(0, 0%, 50.2%, .0);
  background: var(--color-body-bg);
}
</style>
