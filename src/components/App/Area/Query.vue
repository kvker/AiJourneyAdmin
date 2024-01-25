<script lang="ts" setup>
import { ref } from 'vue'

const emit = defineEmits(['search', 'add'])

function onSearch() {
  emit('search', formInline.value)
}

function onAdd() {
  emit('add')
}

const formInline = ref({
  name: '',
})
</script>

<template>
  <el-form :inline="true" :model="formInline" class="demo-form-inline">
    <el-form-item label="景点名称">
      <el-input v-model="formInline.name" placeholder="景点名称" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" plain @click="onSearch">搜索</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onAdd">新增</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped></style>