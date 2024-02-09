<script lang="ts" setup>
import { inject } from 'vue'
import type { Ref } from 'vue'
const searchParams = inject('searchParams') as Ref<AreaSearchParams>

const emit = defineEmits(['add'])

function onAdd() {
  emit('add')
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
    </label>
  </form>
</template>

<style scoped></style>