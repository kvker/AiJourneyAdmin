<script lang="ts" setup>
import { ref } from 'vue'

const emit = defineEmits(['search', 'add'])

function onSearch() {
  console.log('onSearch')
  console.log(formInline.value)
  if(!formInline.value.name.trim()) return
  emit('search', formInline.value)
}

function onAdd() {
  console.log('onAdd')
  emit('add')
}

const formInline = ref({
  name: '',
})
</script>

<template>
  <el-form :inline="true" :model="formInline" class="demo-form-inline">
    <el-form-item label="景点名称">
      <el-input v-model="formInline.name" placeholder="景点名称" clearable />
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