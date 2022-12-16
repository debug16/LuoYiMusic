<script setup lang="ts"></script>

<template>
  <div class="settings">
    <div class="settings__title">
      <h1>快捷键</h1>
      <div class="settings__shortcut-keys">
        <div class="settings__shortcut-keys--title">
          <div>功能</div>
          <div>快捷键</div>
        </div>
        <div>
          <div>暂停 / 播放</div>
          <div>space</div>
        </div>
        <div>
          <div>上一首</div>
          <div>P</div>
        </div>
        <div>
          <div>下一首</div>
          <div>N</div>
        </div>
        <div>
          <div>增加音量</div>
          <div i-carbon-arrow-up />
        </div>
        <div>
          <div>降低音量</div>
          <div i-carbon-arrow-down />
        </div>
        <div>
          <div>歌曲时间 - 5s</div>
          <div i-carbon-arrow-left />
        </div>
        <div>
          <div>歌曲时间 + 5s</div>
          <div i-carbon-arrow-right />
        </div>
        <div>
          <div>静音 / 解除静音</div>
          <div>M</div>
        </div>
        <div>
          <div>全屏歌词切换</div>
          <div>F</div>
        </div>
        <div>
          <div>全屏歌词隐藏</div>
          <div>ESC</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.settings {
  @apply xl:px-10% py-10;
  & &__title h1 {
    @apply text-3xl font-800 py-3 border-b border-#ccc mb-10;
  }
  & &__shortcut-keys {
    @apply space-y-6;

    > div {
      @apply flex text-base items-center;

      div:first-child {
        @apply w-1/3;
      }
      div:last-child {
        // @apply leading-12;
      }
    }
    .settings__shortcut-keys--title {
      @apply color-#b7b7b7;
    }
  }
}
</style>
