<script lang="ts" setup>
import { ref, watch, toRef } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { chooseFile } from '@/utils/fileHandler'
import lc from '@/libs/lc';
import type AV from 'leancloud-storage'
import { ll2lnglat } from '@/utils/map'

const props = defineProps(['editData'])
const emit = defineEmits(['showmap'])
const visible = defineModel('visible', { type: Boolean, default: false, })
const lnglat = defineModel('lnglat')

type AreaForm = Omit<Area, 'coverImageList'> & {
  coverImageList: File[]
}

const obj = {
  objectId: '',
  name: '',
  description: '',
  lnglat: null,
  coverImageList: [],
}
const ruleFormRef = ref<FormInstance>()
const form = ref<AreaForm>({ ...obj })

const rules = ref<FormRules<AreaForm>>({
  name: [
    { required: true, message: '请输入景点名称', trigger: 'blur' },
    // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
  description: [
    { required: true, message: '请输入景点介绍, 尽可能多点', trigger: 'blur' },
  ],
  lnglat: [
    { required: true, message: '请选择经纬度', trigger: 'change' },
  ],
})

watch(lnglat, (val) => {
  form.value.lnglat = val as Lnglat
})

watch(() => props.editData, val => {
  if (val) {
    let valNew = {
      ...val,
    }
    valNew.lnglat = ll2lnglat(valNew.lnglat)
    form.value = valNew
  }
})

function file2BlobUrl(file: File | url) {
  if (typeof file === 'string') return file
  return URL.createObjectURL(file)
}

async function onSubmit(formEl: FormInstance | undefined) {
  if (!formEl) return

  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const coverImageList = []

      let loading = ElLoading.service({ text: '上传图片中', fullscreen: true })
      let ret: AV.File | null = null
      for (const file of form.value.coverImageList) {
        if (typeof file === 'string') continue // 链接不需要再传
        ret = await lc.uploadFile(file)
        coverImageList.push(ret.get('url'))
      }
      const uploadForm = {
        name: form.value.name,
        description: form.value.description,
        lnglat: new lc.AV.GeoPoint({ latitude: form.value.lnglat!.lat, longitude: form.value.lnglat!.lng }),
        coverImageList,
      }
      if (form.value.attraction) {
        await lc.update('Area', form.value.objectId, uploadForm)
      } else {
        await lc.create('Area', {
          ...uploadForm,
          // TODO：这里的id是临时用的,需要从本地或链接获取
          attraction: lc.createObject('Attraction', '659e75a84700c26fdeda7874'),
        })
      }
      loading.close()
      visible.value = false
      form.value = { ...obj }
    } else {
    }
  })
}

function onCheckLocation() {
  emit('showmap')
}

function onAddCoverImage() {
  if (form.value.coverImageList.length >= 3) {
    ElMessage.error('最多只能上传3张图片')
    return
  }
  chooseFile(files => {
    if (files) {
      if (form.value.coverImageList.length + files.length >= 3) {
        ElMessage.error('最多只能上传3张图片')
        return
      }
      form.value.coverImageList = [...form.value.coverImageList, ...files]
    }
  })
}

function onDeleteCoverImage(index: number) {
  form.value.coverImageList.splice(index, 1)
}
</script>

<template>
  <el-dialog v-model="visible" title="景点信息">
    <el-form :model="form" :rules="rules" ref="ruleFormRef" label-width="120px">
      <el-form-item label="名称" required prop="name">
        <el-input v-model="form.name" placeholder="景区名字" />
      </el-form-item>
      <el-form-item label="介绍" required prop="description">
        <el-input v-model="form.description" placeholder="杭州西湖景区是......建议300字以上500字以下" type="textarea" />
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
        <el-button type="primary" @click="onSubmit(ruleFormRef)">{{form.attraction ? '更新' : '创建'}}</el-button>
        <el-button @click="visible = false">取消</el-button>
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