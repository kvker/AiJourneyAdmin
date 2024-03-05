<script lang="ts" setup>
import { auth } from '@/services/cloud'

function onLogout() {
  auth.signOut()
    .then(() => {
      localStorage.removeItem('attraction')
      location.href = import.meta.env.BASE_URL
    })
}
</script>

<template>
  <div>
    <button class="btn btn-secondary" @click="onLogout">退出</button>
  </div>
</template>

<style></style>