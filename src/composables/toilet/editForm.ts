import { watch } from 'vue'
import type { Ref, ModelRef } from 'vue'
import { chooseFile, uploadFile } from '@/services/fileHandler'
import { getGeocoder } from '@/services/map'
import { db } from '@/services/cloud'

export function useEditForm({ form, obj, props, emit, visible, lnglat }: { form: Ref<ToiletForm>, obj: ToiletForm, props: any, emit: any, visible: Ref<boolean>, lnglat: ModelRef<Lnglat> }) {

  watch(lnglat, (val) => {
    form.value.lnglat = val as Lnglat
  })

  watch(() => props.editData, val => {
    if (val) {
      let valNew = {
        ...val,
      }
      form.value = valNew
    }
  })

  async function onSubmit() {

    const coverImageList = []

    for (const file of form.value.coverImageList) {
      if (typeof file === 'string') {
        coverImageList.push(file)
        continue
      } // 链接不需要再传
      const { download_url } = await uploadFile(file, 'images')
      coverImageList.push(download_url)
    }
    const uploadForm = {
      name: form.value.name,
      introduce: form.value.introduce,
      lnglat: { latitude: form.value.lnglat!.latitude, longitude: form.value.lnglat!.longitude },
      coverImageList,
    }
    if (form.value.attractionId) {
      await db.collection('JToilet').doc(form.value._id).update(uploadForm)
    } else {
      const attraction = JSON.parse(localStorage.getItem('attraction') as string)
      await db.collection('JToilet').add({
        ...uploadForm,
        attractionId: attraction._id,
      })
    }
    visible.value = false
    emit('confim')
    onResetForm()
  }

  function onResetForm() {
    form.value = { ...obj }
  }

  async function onCheckLocation() {
    const name = form.value.name.trim()
    if (name && !form.value.lnglat) {
      // 根据数据名字查一下经纬度
      const lnglat = await getGeocoder(name)
      if (lnglat) {
        form.value.lnglat = lnglat
      }
    }
    emit('showmap', form.value.lnglat)
  }

  function onAddCoverImage() {
    if (form.value.coverImageList.length >= 3) {
      alert('最多只能上传3张图片')
      return
    }
    chooseFile(files => {
      if (files) {
        if (form.value.coverImageList.length + files.length > 3) {
          alert('最多只能上传3张图片')
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
    onResetForm,
    onSubmit,
    onCheckLocation,
    onAddCoverImage,
    onDeleteCoverImage,
  }
}