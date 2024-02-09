<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import type { Ref } from 'vue'

let map: any
  , marker: any
const emit = defineEmits(['choose', 'close'])
const props = defineProps({
  visible: Boolean,
  defaultLnglat: {
    type: Object as () => Lnglat | null,
    default: null,
  },
})
const loading = ref(false)
const mapDialog: Ref<HTMLDialogElement | undefined> = ref()

onMounted(() => {
  // 地图
  map = new T.Map('mapDiv')
  map.addEventListener("click", onMapClick)
})

watch(() => props.visible, (val) => {
  if (val === true) {
    mapDialog.value!.showModal()
    loading.value = true
    navigator.geolocation.getCurrentPosition(function (position) {
      const { latitude, longitude } = position.coords
      map.centerAndZoom(new T.LngLat(longitude, latitude), 16)
      if (props.defaultLnglat) {
        addMarker(props.defaultLnglat)
      }
      loading.value = false
    }, function (error) {
      console.error(error)
      loading.value = false
    })
  }
})

onUnmounted(() => {
  map.removeEventListener("click", onMapClick)
})

function onMapClick({ lnglat }: { lnglat: Lnglat }) {
  // emit('choose', e.lnglat)
  addMarker(lnglat)
}

function addMarker(lnglat: Lnglat) {
  if (marker) {
    map.removeOverLay(marker) // 移除标注
  }
  marker = new T.Marker(new T.LngLat(lnglat.lng, lnglat.lat)) // 创建标注
  map.addOverLay(marker) // 将标注添加到地图中
  map.panTo(new T.LngLat(lnglat.lng, lnglat.lat)) // 将地图中心点更改为标注的位置
}

function doChoose() {
  if (!marker) {
    alert('请选择一个坐标点')
    return
  }
  mapDialog.value!.close()
  emit('choose', marker.getLngLat())
}

function onClose() {
  emit('close')
}
</script>

<template>
  <dialog ref="mapDialog" class="modal" @close="onClose">
    <div class="modal-box">
      <h3 class="font-bold text-lg">请选择一个坐标点</h3>
      <div id="mapDiv" class=" h-96"></div>
      <button class=" btn btn-primary mt-8" @click="doChoose">确认</button>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn">关闭</button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<style scoped></style>