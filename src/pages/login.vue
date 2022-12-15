<script setup lang="ts"></script>

<template>
  <div h-full flex="~" justify-center items-center>
    <div class="login" flex="~ col" items-center>
      <div class="login__title" color="#000">登录</div>
      <div class="login_username">
        <input type="text" name="username" placeholder="账号" />
      </div>
      <div class="login_password">
        <input type="password" name="password" placeholder="密码" />
      </div>
      <div class="forgetPass">
        <a href="#">忘记密码</a>
      </div>
      <div class="login__submit" color="#fff" bg="[hsla(248,70%,57%,1)]" hover="bg-[hsla(248,80%,57%,1)] cursor-pointer" active:transform="scale-101" w-full text-center p-2 rounded-lg>登录</div>
    </div>
    <div class="icon"></div>
  </div>
</template>

<style scoped lang="scss">
.login {
  @apply space-y-8;
  .forgetPass {
    margin-top: 6px !important;
    @apply self-end text-sm color-[hsla(248,40%,57%,1)];
    &:hover{
    @apply color-[hsla(248,65%,57%,1)] underline;
    }
  }
}
.login__title {
  @apply tracking-6 text-4xl font-bold text-center indent-6;
}
input {
  @apply border-#eee border-1 h-12 w-80 color-#abcdfed rounded-xl indent-xs focus:outline-[hsla(248,50%,57%,1)];
}
/* input::-webkit-input-placeholder {
		color: #000;
	} */

.login {
  @apply font-mono;
}

.login__submit,
.login__title {
  @apply select-none;
}
</style>
