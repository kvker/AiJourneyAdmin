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
const loading = ref(false)

onMounted(() => {
  // 地图
  map = new T.Map('mapDiv')
  map.addEventListener("click", onMapClick)
})

watch(() => props.visible, (val) => {
  if (val === true) {
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
  emit('choose', marker.getLngLat())
}
</script>

<template>
  <div v-show="visible" class=" fixed left-0 top-0 w-full h-full mask flex items-center justify-center"
    style="z-index: 9999;">
    <div v-loading="loading" element-loading-text="定位中" element-loading-background="rgba(122, 122, 122, 0.8)" id="mapDiv">
    </div>
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