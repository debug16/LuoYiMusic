<script setup lang="ts"></script>

<template>
  <div h-full flex="~" justify-center items-center>
    <div class="login" flex="~ col" items-center>
      <div class="login__title" color="#ccc">登录</div>
      <div class="login_username">
        <input type="text" name="username" placeholder="username" />
      </div>
      <div class="login_password">
        <input type="password" name="password" placeholder="password" />
      </div>
      <div class="login__submit" color="#fff" bg="blue-500" hover="bg-blue-600 cursor-pointer" active:transform="scale-101" w-full text-center p-2 rounded-lg>Login</div>
    </div>
    <div class="icones"></div>
  </div>
</template>

<style>
.login {
  @apply space-y-8
  transform:scale;
}
.login__title {
  @apply tracking-6 text-4xl font-bold text-center indent-6;
}
input {
  @apply outline-none h-10 w-80 color-#fff rounded-lg bg-[hsla(0,0%,21%,1)] indent-xs focus:outline-blue-300;
}

.login {
  @apply font-mono;
}


.login__submit,
.login__title {
  @apply select-none;
}
</style>
