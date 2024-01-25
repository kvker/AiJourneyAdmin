<script lang="ts" setup>
import { ref } from 'vue'
import Query from '@/components/App/Area/Query.vue'
import List from '@/components/App/Area/List.vue'
import Edit from '@/components/App/Area/Edit.vue'
import Map from '@/components/App/Common/Map.vue'
import { ll2lnglat } from '@/utils/map'

const currentLnglat = ref<Lnglat | null>(null)

// 搜索
function onSearch(e: { name: string }) {
  console.log('onSearch')
  console.log(e)
}

function onAdd() {
  console.log('onAdd')
  editVisible.value = true
}

// 地图
const dialogMapVisible = ref(false)
const defaultLnglat = ref<Lnglat | null>(null)

function onReviewLnglat(ll: LL) {
  console.log(ll)
  defaultLnglat.value = ll2lnglat(ll)
  onShowMap()
}

function onShowMap() {
  console.log('onShowMap')
  dialogMapVisible.value = true
}

function onCloseMap() {
  console.log('onCloseMap')
  dialogMapVisible.value = false
}

function doChooseLnglat(lnglat: Lnglat) {
  console.log(lnglat)
  currentLnglat.value = lnglat
  dialogMapVisible.value = false
}

// 编辑(新增)
const editVisible = ref(false)

function onEditConfirm(e: any) {
  console.log(e)
}

</script>

<template>
  <main class=" flex flex-col h-full">
    <Query @search="onSearch" @add="onAdd" />
    <List @lnglat="onReviewLnglat" />
    <Edit v-model:visible="editVisible" v-model:lnglat="currentLnglat" @confim="onEditConfirm" @showmap="onShowMap" />
    <Map :visible="dialogMapVisible" :defaultLnglat="defaultLnglat" @choose="doChooseLnglat" @close="onCloseMap" />
  </main>
</template>

<style></style>