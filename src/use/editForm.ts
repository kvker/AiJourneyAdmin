import { ref, watch } from 'vue'
import type { Ref, ModelRef } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { chooseFile } from '@/utils/fileHandler'
import lc from '@/libs/lc';
import type AV from 'leancloud-storage'
import { ll2Lnglat } from '@/utils/map'

export function useEditForm({ form, obj, props, emit, visible, lnglat }: { form: Ref<AreaForm>, obj: AreaForm, props: any, emit: any, visible: Ref<boolean>, lnglat: ModelRef<Lnglat> }) {
  const ruleFormRef = ref<FormInstance>()

  const rules = ref<FormRules<AreaForm>>({
    name: [
      { required: true, message: '请输入景点名称', trigger: 'blur' },
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

    await formEl.validate(async (valid) => {
      if (valid) {
        const coverImageList = []

        let loading = ElLoading.service({ text: '上传图片中', fullscreen: true })
        let ret: AV.File | null = null
        for (const file of form.value.coverImageList) {
          if (typeof file === 'string') {
            coverImageList.push(file)
            continue
          } // 链接不需要再传
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

  return {
    visible,
    ruleFormRef,
    rules,
    onSubmit,
    onCheckLocation,
    onAddCoverImage,
    onDeleteCoverImage,
  }
}