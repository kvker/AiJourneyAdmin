<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { file2BlobUrl } from '@/services/fileHandler'
import { useEditForm } from '@/composables/toilet/editForm'

const props = defineProps(['editData'])
const emit = defineEmits(['showmap', 'confim'])
const visible = defineModel<boolean>('visible', { required: true })
const lnglat = defineModel<Lnglat>('lnglat', { required: true })

const editDialog: Ref<HTMLDialogElement | undefined> = ref()
const styleDialog: Ref<HTMLDialogElement | undefined> = ref()

const obj: ToiletForm = {
  objectId: '',
  name: '',
  introduce: '',
  lnglat: null,
  coverImageList: [],
}
const form = ref<ToiletForm>({ ...obj })

const { onCheckLocation, onSubmit, onDeleteCoverImage, onAddCoverImage, onResetForm } = useEditForm({ form, obj, props, emit, visible, lnglat })

watch(visible, newValue => {
  if (newValue) {
    editDialog.value && editDialog!.value.showModal()
  } else {
    editDialog.value && editDialog!.value.close()
  }
})

function onCloseEditDialog() {
  visible.value = false
  onResetForm()
}

</script>

<template>
  <dialog ref="editDialog" class="modal" @close="onCloseEditDialog">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-2">厕所信息</h3>
      <form @submit.prevent="onSubmit">
        <input class="input w-full max-w-xs mb-2" v-model.trim="form.name" placeholder="厕所名字" required maxlength="100"
          minlength="2" />
        <div class="w-full mb-2">
          <textarea class="textarea w-full mb-2" v-model="form.introduce" placeholder="厕所介绍" required minlength="2"
            maxlength="1000"></textarea>
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
        <button class="btn btn-primary" type="submit">{{ form.attraction ? '更新' : '创建' }}厕所</button>
      </form>
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