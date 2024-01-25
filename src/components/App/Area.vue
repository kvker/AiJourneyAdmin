<script lang="ts" setup>
import { ref } from 'vue'
import Query from '@/components/App/Area/Query.vue'
import List from '@/components/App/Area/List.vue'
import Edit from '@/components/App/Area/Edit.vue'
import Map from '@/components/App/Common/Map.vue'
import { ll2lnglat } from '@/utils/map'

const currentLnglat = ref<Lnglat | null>(null)
const editData = ref<Area | null>(null)

// 搜索
function onSearch(e: { name: string }) {
  console.log('onSearch')
  console.log(e)
}

function onAdd() {
  editVisible.value = true
}

// 地图
const dialogMapVisible = ref(false)
const defaultLnglat = ref<Lnglat | null>(null)

function onReviewLnglat(ll: LL) {
  defaultLnglat.value = ll2lnglat(ll)
  onShowMap()
}

function onShowMap(lnglat?: Lnglat) {
  dialogMapVisible.value = true
  if(lnglat) {
    defaultLnglat.value = lnglat
  }
}

function onCloseMap() {
  dialogMapVisible.value = false
}

function doChooseLnglat(lnglat: Lnglat) {
  currentLnglat.value = lnglat
  dialogMapVisible.value = false
}

// 编辑(新增)
const editVisible = ref(false)

function onEditConfirm(e: any) {
  console.log(e)
}

function onCellEdit(data: Area) {
  editVisible.value = true
  editData.value = data
}
</script>

<template>
  <main class=" flex flex-col h-full">
    <Query @search="onSearch" @add="onAdd" />
    <List @lnglat="onReviewLnglat" @edit="onCellEdit" />
    <Edit v-model:visible="editVisible" v-model:lnglat="currentLnglat" :editData="editData" @confim="onEditConfirm"
      @showmap="onShowMap" />
    <Map :visible="dialogMapVisible" :defaultLnglat="defaultLnglat" @choose="doChooseLnglat" @close="onCloseMap" />
  </main>
</template>

<style></style>