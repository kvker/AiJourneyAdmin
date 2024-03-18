<script lang="ts" setup>
import { inject } from 'vue'
import type { Ref } from 'vue'
import { db } from '@/services/cloud'

const searchParams = inject('searchParams') as Ref<AreaSearchParams>

const emit = defineEmits(['add'])

function onAdd() {
  emit('add')
}

async function onMutipleAdd() {
  const json = JSON.parse(prompt('粘贴JSON数据') as string)
  if (json.length) {
    const attraction = JSON.parse(localStorage.getItem('attraction') as string)
    for (const item of json) {
      await db.collection('JArea').add({
        ...item,
        attractionId: attraction._id,
        coverImageList: [],
        updatedAt: new Date(),
      })
    }
  }
}
</script>

<template>
  <form :inline="true" :model="searchParams" class="demo-form-inline" @submit.prevent="onAdd">
    <label for="searchName">
      <input id="searchName" v-model.trim="searchParams.name" placeholder="输入自动搜索"
        class="input input-bordered w-full max-w-xs" />
    </label>
    <label class=" ml-2">
      <button class="btn btn-primary" type="submit">新增</button>
      <div class="btn btn-primary ml-4" @click="onMutipleAdd">一键新增（JSON）</div>
    </label>
  </form>
</template>

<style scoped></style>