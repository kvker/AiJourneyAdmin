<script lang="ts" setup>
import { ref } from 'vue'
import lc from '@/libs/lc'

function onLogout() {
  lc.logout()
  localStorage.removeItem('attraction')
  location.href = import.meta.env.BASE_URL + 'login/'
}
</script>

<template>
  <div>
    <el-button type="primary" @click="onLogout">退出</el-button>
  </div>
</template>

<style></style>