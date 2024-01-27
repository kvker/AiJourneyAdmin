<script lang="ts" setup>
import { ref, watch, toRef } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { chooseFile, file2BlobUrl } from '@/utils/fileHandler'
import lc from '@/libs/lc';
import type AV from 'leancloud-storage'
import { ll2Lnglat } from '@/utils/map'
import { completions } from '@/utils/chat'

const props = defineProps(['editData'])
const emit = defineEmits(['showmap', 'confim'])
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
    valNew.lnglat = ll2Lnglat(valNew.lnglat)
    form.value = valNew
  }
})

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
        const attraction = JSON.parse(localStorage.getItem('attraction') as string)
        await lc.create('Area', {
          ...uploadForm,
          attraction: lc.createObject('Attraction', attraction.objectId),
        })
      }
      loading.close()
      visible.value = false
      emit('confim')
      form.value = { ...obj }
    }
  })
}

function onCheckLocation() {
  emit('showmap', form.value.lnglat)
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

// 聊天风格区域
const chatStyles = ref<ChatStyle[]>([])
async function getChatStyle() {
  const cs = await lc.read('ChatStyle', q => {
    q.descending('sort')
  })
  chatStyles.value = cs.map(i => i.toJSON())
}

getChatStyle()

function doGenerateIntroduce(chatStyle: ChatStyle, index: number) {
  console.log(chatStyle, index)
  completions()
}
</script>

<template>
  <el-dialog v-model="visible" title="景点信息">
    <el-form :model="form" :rules="rules" ref="ruleFormRef" label-width="120px">
      <el-form-item label="名称" required prop="name">
        <el-input v-model="form.name" placeholder="景区名字" />
      </el-form-item>
      <el-form-item label="介绍" required prop="description">
        <div class="w-full">
          <el-input v-model="form.description" :autosize="{ minRows: 2, maxRows: 8 }"
            placeholder="杭州西湖景区是......建议300字以上500字以下" type="textarea" />
          <div class="flex mt-2">
            <el-button v-for="(chatStyle, index) of chatStyles" class="mr-2"
              @click="doGenerateIntroduce(chatStyle, index)" :title="chatStyle.description">{{ chatStyle.name
              }}</el-button>
          </div>
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