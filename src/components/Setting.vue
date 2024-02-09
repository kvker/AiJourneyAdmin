<script lang="ts" setup>
import { ref } from 'vue'
import lc from '@/libs/lc'

function onLogout() {
  lc.logout()
  localStorage.removeItem('attraction')
  location.href = '/'
}
</script>

<template>
  <div>
    <button class="btn btn-secondary" @click="onLogout">退出</button>
  </div>
</template>

<style></style>