<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { file2BlobUrl } from '@/utils/fileHandler'
import { useEditForm } from '@/composables/area/editForm'
import { useEditStyle } from '@/composables/area/editStyle'

const props = defineProps(['editData'])
const emit = defineEmits(['showmap', 'confim'])
const visible = defineModel<boolean>('visible', { required: true })
const lnglat = defineModel<Lnglat>('lnglat', { required: true })

const editDialog: Ref<HTMLDialogElement | undefined> = ref()
const styleDialog: Ref<HTMLDialogElement | undefined> = ref()

const obj: AreaForm = {
  objectId: '',
  name: '',
  introduce: '',
  lnglat: null,
  coverImageList: [],
}
const form = ref<AreaForm>({ ...obj })

const { onCheckLocation, onSubmit, onDeleteCoverImage, onAddCoverImage, onResetForm } = useEditForm({ form, obj, props, emit, visible, lnglat })
const { chatStyles, styleVisible, propmtObject, currentStyleIntroduce, onUseStyleIntroduce, onUpdateStyleIntroduce, onGenerateVoice,
  onGenerateStyleIntroduce, areaIntroduceQueriable } = useEditStyle(form)

watch(visible, newValue => {
  if (newValue) {
    editDialog.value && editDialog!.value.showModal()
  } else {
    editDialog.value && editDialog!.value.close()
  }
})

watch(styleVisible, newValue => {
  if(newValue) {
    styleDialog.value && styleDialog!.value.showModal()
  } else {
    styleDialog.value && styleDialog!.value.close()
  }
})

function onCloseEditDialog() {
  visible.value = false
  onResetForm()
}

function onCloseStyleDialog() {
  styleVisible.value = false
}
</script>

<template>
  <dialog ref="editDialog" class="modal" @close="onCloseEditDialog">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-2">景点信息</h3>
      <form @submit.prevent="onSubmit">
        <input class="input w-full max-w-xs mb-2" v-model.trim="form.name" placeholder="景区名字" required maxlength="100"
          minlength="2" />
        <div class="w-full mb-2">
          <textarea class="textarea w-full mb-2" v-model="form.introduce" placeholder="介绍,如: 杭州西湖景区是......建议300字以上500字以下"
            required minlength="2" maxlength="1000"></textarea>
          <div v-if="form.attraction" class="flex mt-2">
            <button v-for="(chatStyle, index) of chatStyles" class=" btn mr-2"
              @click="onGenerateStyleIntroduce(chatStyle, index)" :title="chatStyle.remind">{{ chatStyle.name
              }}</button>
          </div>
        </div>
        <div class="flex items-center mb-2">
          <button @click="onCheckLocation" class=" btn btn-neutral mr-2" type="button">添加定位</button>
          <p v-if="form.lnglat">{{ form.lnglat.lng + ', ' + form.lnglat.lat }}</p>
        </div>
        <div class="flex items-center mb-2">
          <button class="btn btn-secondary mr-2" type="button" @click="onAddCoverImage">新增图片</button>
          <img class=" cursor-pointer object-contain h-12 w-12 mr-2" v-for="(file, index) of form.coverImageList"
            :src="file2BlobUrl(file)" @click="onDeleteCoverImage(index)" alt="preview-image">
        </div>
        <button class="btn btn-primary" type="submit">{{ form.attraction ? '更新' : '创建' }}景点</button>
      </form>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn">关闭</button>
        </form>
      </div>
    </div>
  </dialog>
  <dialog ref="styleDialog" class="modal" @close="onCloseStyleDialog">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-2">个性化景点介绍</h3>
      <div class=" flex" v-if="propmtObject.previousPrompt">
        <textarea class=" mr-2 textarea" v-model.trim="propmtObject.previousPrompt"
          placeholder="这里是前置指令, 给AI的指令等于: 前置指令 + 基础描述 + 后置指令, 如果您需要, 也可以自行修改此处给 AI 下发别的要求" rows="3"></textarea>
        <textarea class="textarea w-full" v-model.trim="propmtObject.tailPrompt"
          placeholder="这里是后置指令, 给 AI 的指令等于: 前置指令 + 基础描述 + 后置指令, 如果您需要, 也可以自行修改此处给 AI 下发别的要求" rows="3"></textarea>
      </div>
      <p class=" my-2 text-gray-400">您可以修改上述要求让 AI 生成新的内容</p>
      <textarea class="textarea w-full" v-model.trim="currentStyleIntroduce"
        placeholder="这里显示的是AI协助生成的各类有趣的景点介绍语录, 来自基础描述" rows="12"></textarea>
      <div class="flex mt-4">
        <button @click="onUseStyleIntroduce" class=" btn mr-4">应用描述</button>
        <button @click="() => onUpdateStyleIntroduce()" class="btn mr-4">更新描述</button>
        <button @click="onGenerateVoice" class="btn mr-4">生成语音</button>
        <audio v-if="areaIntroduceQueriable && areaIntroduceQueriable.get('voice')"
          :src="areaIntroduceQueriable.get('voice')" class=" h-8" controls></audio>
      </div>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn">关闭</button>
        </form>
      </div>
    </div>
  </dialog>
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