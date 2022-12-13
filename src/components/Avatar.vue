<template>
  <div
    class="image-wrapper"
    :class="[isSquare ? 'square' : 'round']"
    @mouseenter="showShadow"
    @mouseleave="hideShadow"
  >
    <img :src="src" alt="image" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  // 组件的属性
  props: {
    src: String,
    isSquare: Boolean,
  },  

  setup(props) {
    // 定义一个变量，表示图片是否显示阴影
    const showShadow = ref(false);

    // 定义一个函数，用来显示图片的阴影
    const showShadow1 = () => {
      showShadow.value = true;
    };

    // 定义一个函数，用来隐藏图片的阴影
    const hideShadow = () => {
      showShadow.value = false;
    };

    return {
      showShadow,
      hideShadow,
    };
  }
}
</script>

<style>
.image-wrapper {
  position: relative;
  overflow: hidden;
}

.square {
  width: 100px;
  height: 100px;
}

.round {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s;
}

.image-wrapper:hover img {
  transform: scale(1.1);
}

.image-wrapper.show-shadow:before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
  transition: all 0.5s;
  opacity: 0;
}

.image-wrapper.show-shadow:hover:before {
  opacity: 1;
}
</style>
