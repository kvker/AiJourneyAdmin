<script lang="ts" setup>
import { ref } from 'vue'
import router from '@/router'
import { auth } from '@/services/cloud'
//@ts-ignore
import md5 from 'md5'

if (auth.currentUser) {
  router.replace('/home')
}

const email = ref('')
const password = ref('')
const isLoading = ref(false)

async function onSubmit(e: Event) {
  e.preventDefault()
  if (isLoading.value) return
  isLoading.value = true
  try {
    await onLogin()
  } catch (error: any) {
    if (error.message.includes('102003')) {
      await onRegister()
    } else {
      console.error(error)
      alert(error.message || error)
    }
  }
  isLoading.value = false
}

async function onLogin() {
  const loginState = await auth.signInWithEmailAndPassword(email.value, md5(password.value) as string)
  if (loginState && loginState.user) {
    router.replace('/home')
  }
}

async function onRegister() {
  const sendState = await auth.signUpWithEmailAndPassword(email.value, md5(password.value) as string)
  if (sendState && sendState.requestId) {
    alert('发送邮件成功，请从邮箱进入')
  }
}
</script>

<template>
  <div class="w-full h-screen font-sans bg-cover bg-landscape"
    style="background-image: url(https://www.tailwind-kit.com/images/landscape/2.jpg);">
    <div class="container flex items-center justify-center flex-1 h-full mx-auto">
      <div class="w-full max-w-lg">
        <div class="leading-loose">
          <form class="max-w-sm p-10 m-auto rounded shadow-xl bg-white/25" id="formLogin" @submit="onSubmit">
            <p class="mb-8 text-2xl font-light text-center text-white">AI导游大师后台管理-登录</p>
            <div class="mb-2">
              <div class="relative">
                <input v-model.trim="email" type="text" id="login-with-bg-email"
                  class="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="邮箱" />
              </div>
            </div>
            <div class="mb-2">
              <div class="relative">
                <input v-model.trim="password" type="password" id="login-with-bg-password"
                  class="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="密码" />
              </div>
            </div>
            <div class="flex items-center justify-between mt-4">
              <button type="submit"
                class="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg">
                <span v-if="isLoading" class="loading loading-spinner"></span>
                登录
              </button>
            </div>
            <div class="text-center">
              <a
                class="right-0 inline-block text-sm font-light align-baseline text-500 hover:text-gray-800 cursor-pointer">忘记密码？</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style>

</style>
