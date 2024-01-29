<script lang="ts" setup>
import { ref } from 'vue'
import { file2BlobUrl } from '@/utils/fileHandler'
import { useEditForm } from '@/use/editForm'
import { useEditStyle } from '@/use/editStyle'

const props = defineProps(['editData'])
const emit = defineEmits(['showmap', 'confim'])
const visible = defineModel<boolean>('visible', { required: true })
const lnglat = defineModel<Lnglat>('lnglat', { required: true })

const obj: AreaForm = {
  objectId: '',
  name: '',
  introduce: '',
  lnglat: null,
  coverImageList: [],
}
const form = ref<AreaForm>({ ...obj })

const { onCheckLocation, rules, onSubmit, onDeleteCoverImage, onAddCoverImage, ruleFormRef } = useEditForm({ form, obj, props, emit, visible, lnglat })
const { chatStyles, styleVisible, currentStyleIntroduce, onUseStyleIntroduce, onUpdateStyleIntroduce, onGenerateVoice,
  onGenerateStyleIntroduce, areaIntroduceQueriable } = useEditStyle(form)

</script>

<template>
  <el-dialog v-model="visible" title="景点信息">
    <el-form :model="form" :rules="rules" ref="ruleFormRef" label-width="120px">
      <el-form-item label="名称" required prop="name">
        <el-input v-model="form.name" placeholder="景区名字" />
      </el-form-item>
      <el-form-item label="介绍" required prop="introduce">
        <div class="w-full">
          <el-input v-model="form.introduce" :autosize="{ minRows: 2, maxRows: 8 }"
            placeholder="杭州西湖景区是......建议300字以上500字以下" type="textarea" />
          <div class="flex mt-2">
            <el-button v-for="(chatStyle, index) of chatStyles" class="mr-2"
              @click="onGenerateStyleIntroduce(chatStyle, index)" :title="chatStyle.remind">{{ chatStyle.name
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
      </el-form-item>
    </el-form>
    <el-dialog v-model="styleVisible" title="个性化景点介绍">
      <el-input v-model="currentStyleIntroduce" :autosize="{ minRows: 2, maxRows: 16 }"
        placeholder="这里显示的是AI协助生成的各类有趣的景点介绍语录, 来自基础描述" type="textarea" />
      <div class="flex mt-4">
        <el-button @click="onUseStyleIntroduce" class=" mr-4" type="primary">应用描述</el-button>
        <el-button @click="() => onUpdateStyleIntroduce()" class=" mr-4" type="info">更新描述</el-button>
        <el-button @click="onGenerateVoice" class=" mr-4" type="info">生成语音</el-button>
        <audio v-if="areaIntroduceQueriable && areaIntroduceQueriable.get('voice')"
          :src="areaIntroduceQueriable.get('voice')" class=" h-8" controls></audio>
      </div>
    </el-dialog>
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