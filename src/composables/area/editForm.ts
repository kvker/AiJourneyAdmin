import { watch, inject } from 'vue'
import type { Ref, ModelRef } from 'vue'
import { chooseFile, uploadFile } from '@/services/fileHandler'
import { db } from '@/services/cloud'

export function useEditForm(form: Ref<AreaForm>, { uiStatus, obj, props, emit, visible, lnglat }: { uiStatus: Ref<UiStatusMap>, obj: AreaForm, props: any, emit: any, visible: Ref<boolean>, lnglat: ModelRef<Lnglat> }) {

  watch(lnglat, (val) => {
    form.value.lnglat = val as Lnglat
  })

  watch(() => props.editData, val => {
    if (val) {
      let valNew = {
        ...val,
      }
      form.value = valNew
      console.log('当前表单景点: ' + form.value.name)
    } else {
      onResetForm()
    }
  })

  async function onSubmit() {
    const coverImageList: string[] = []
    uiStatus.value.isLoading = true
    for (const file of form.value.coverImageList) {
      // 链接不需要再传
      if (typeof file === 'string') {
        coverImageList.push(file)
        continue
      }
      try {
        const { download_url } = await uploadFile(file, 'images/changhelaojie')
        coverImageList.push(download_url)
      } catch (e) {
        console.error(e)
      }
    }
    const uploadForm = {
      name: form.value.name,
      innerName: form.value.innerName,
      introduce: form.value.introduce,
      lnglat: { latitude: +form.value.lnglat!.latitude, longitude: +form.value.lnglat!.longitude },
      coverImageList,
    }
    try {
      if (form.value.attractionId) {
        await db.collection('JArea').doc(form.value._id).update({
          ...uploadForm,
          updatedAt: new Date(),
        })
      } else {
        const attraction = JSON.parse(localStorage.getItem('attraction') as string)
        await db.collection('JArea').add({
          ...uploadForm,
          attractionId: attraction._id,
          updatedAt: new Date(),
        })
      }
      visible.value = false
      emit('confirm')
      onResetForm()
    } catch (error) {
      console.error(error)
    } finally {
      uiStatus.value.isLoading = false
    }
  }

  function onResetForm() {
    form.value = { ...obj }
  }

  async function onCheckLocation() {
    const name = form.value.name.trim()
    if (name && !form.value.lnglat) {
      // 根据数据名字查一下经纬度
      // const lnglat = await getGeocoder(name)
      // if (lnglat) {
      //   form.value.lnglat = lnglat
      // }
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