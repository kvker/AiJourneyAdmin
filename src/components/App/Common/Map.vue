<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
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

onMounted(() => {
  // 地图
  map = new T.Map('mapDiv')
  map.addEventListener("click", onMapClick)
})

watch(() => props.visible, (val) => {
  console.log('watch visible')
  console.log(val)
  if (val === true) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const { latitude, longitude } = position.coords
      map.centerAndZoom(new T.LngLat(longitude, latitude), 16)
      if (props.defaultLnglat) {
        console.log(props.defaultLnglat.lng)
        addMarker(props.defaultLnglat)
      }
    })
  }
})

onUnmounted(() => {
  map.removeEventListener("click", onMapClick)
})

function onMapClick({ lnglat }: { lnglat: Lnglat }) {
  // emit('choose', e.lnglat)
  console.log('onMapClick')
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
  console.log('doChoose')
  emit('choose', marker.getLngLat())
}
</script>

<template>
  <div v-show="visible" class=" fixed left-0 top-0 w-full h-full z-50 mask flex items-center justify-center">
    <div id="mapDiv"></div>
    <div class=" ml-10 flex flex-col justify-end">
      <el-button @click="emit('close')">关闭</el-button>
      <el-button class=" mt-8" type="primary" @click="doChoose">确认</el-button>
    </div>
  </div>
</template>

<style scoped>
.mask {
  background-color: rgba(0, 0, 0, 0.5);
}

#mapDiv {
  width: 62%;
  height: 62%;
}

.el-button {
  margin-left: 0;
}
</style>