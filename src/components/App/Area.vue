<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import Query from '@components/App/Area/Query.vue'
import List from '@components/App/Area/List.vue'
import Edit from '@components/App/Area/Edit.vue'
import Map from '@components/App/Common/Map.vue'
import { ll2lnglat, lnglat2ll } from '@utils/map'

// 搜索
function onSearch(e: { name: string }) {
  console.log('onSearch')
  console.log(e)
}

function onAdd() {
  console.log('onAdd')
}

// 地图
const dialogMapVisible = ref(false)
const defaultLnglat = ref<Lnglat | null>(null)

function doReviewLnglat(ll: LL) {
  console.log(ll)
  defaultLnglat.value = ll2lnglat(ll)
  doMapShow()
}

function doMapShow() {
  console.log('doMapShow')
  dialogMapVisible.value = true
}

function doMapClose() {
  console.log('doMapClose')
  dialogMapVisible.value = false
}

function doChooseLnglat(lnglat: Lnglat) {
  console.log(lnglat)
  doMapShow()
}

</script>

<template>
  <main class=" flex flex-col h-full">
    <Query @search="onSearch" @add="onAdd" />
    <List @lnglat="doReviewLnglat" />
    <!-- <Edit /> -->
    <Map v-if="dialogMapVisible" @choose="doChooseLnglat" @close="doMapClose" :defaultLnglat="defaultLnglat" />
  </main>
</template>

<style></style>