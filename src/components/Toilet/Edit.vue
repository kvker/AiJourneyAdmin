<script lang="ts" setup>
import { ref } from 'vue'
import { file2BlobUrl } from '@/utils/fileHandler'
import { useEditForm } from '@/use/toilet/editForm'

const props = defineProps(['editData'])
const emit = defineEmits(['showmap', 'confim'])
const visible = defineModel<boolean>('visible', { required: true })
const lnglat = defineModel<Lnglat>('lnglat', { required: true })

const obj: ToiletForm = {
  objectId: '',
  name: '',
  introduce: '',
  lnglat: null,
  coverImageList: [],
}
const form = ref<ToiletForm>({ ...obj })

const { onCheckLocation, rules, onSubmit, onDeleteCoverImage, onAddCoverImage, ruleFormRef, onResetForm } = useEditForm({ form, obj, props, emit, visible, lnglat })
</script>

<template>
  <el-dialog v-model="visible" title="厕所信息" @closed="onResetForm">
    <el-form :model="form" :rules="rules" ref="ruleFormRef" label-width="120px">
      <el-form-item label="名称" required prop="name">
        <el-input v-model="form.name" placeholder="厕所名字" />
      </el-form-item>
      <el-form-item label="介绍" required prop="introduce">
        <div class="w-full">
          <el-input v-model="form.introduce" :autosize="{ minRows: 2, maxRows: 8 }" placeholder="厕所介绍" type="textarea" />
        </div>
      </el-form-item>
      <el-form-item label="定位位置" required prop="lnglat">
        <p v-if="form.lnglat">{{ form.lnglat.lng + ', ' + form.lnglat.lat }}</p>
        <el-button @click="onCheckLocation" class=" ml-4">定位</el-button>
      </el-form-item>
      <el-form-item label="介绍图片">
        <el-image fit="contain" class=" cursor-pointer" v-for="(file, index) of form.coverImageList"
          :src="file2BlobUrl(file)" @click="onDeleteCoverImage(index)"></el-image>
        <el-button @click="onAddCoverImage" class=" ml-4">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit(ruleFormRef)">{{ form.attraction ? '更新' : '创建' }}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped>
.el-image {
  width: 80px;
  height: 80px;
}

video {
  width: 240px;
  height: 160px;
  object-fit: contain;
}
</style>