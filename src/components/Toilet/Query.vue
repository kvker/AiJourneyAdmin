<script lang="ts" setup>
import { inject } from 'vue'
import type { Ref } from 'vue'
const searchParams = inject('searchParams') as Ref<ToiletSearchParams>

const emit = defineEmits(['add'])

function onAdd() {
  emit('add')
}
</script>

<template>
  <el-form :inline="true" :model="searchParams" class="demo-form-inline">
    <el-form-item label="厕所名称">
      <el-input v-model="searchParams.name" placeholder="输入自动搜索" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onAdd">新增</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped></style>