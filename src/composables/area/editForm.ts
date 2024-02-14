import { watch } from 'vue'
import type { Ref, ModelRef } from 'vue'
import { chooseFile } from '@/services/fileHandler'
import lc from '@/libs/lc'
import type AV from 'leancloud-storage'
import { ll2Lnglat, getGeocoder } from '@/services/map'

export function useEditForm(form: Ref<AreaForm>, {obj, props, emit, visible, lnglat }: { obj: AreaForm, props: any, emit: any, visible: Ref<boolean>, lnglat: ModelRef<Lnglat> }) {

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
      console.log('当前表单景点: ' + form.value.name)
    }
  })

  async function onSubmit() {

    const coverImageList = []

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
      introduce: form.value.introduce,
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
    visible.value = false
    emit('confim')
    onResetForm()
  }

  function onResetForm() {
    // form.value = { ...obj }
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