<script lang="ts" setup>
import { ref, provide, nextTick } from 'vue'
import Query from '@/components/Toilet/Query.vue'
import List from '@/components/Toilet/List.vue'
import Edit from '@/components/Toilet/Edit.vue'
import Map from '@/components/Common/Map.vue'
import { ll2Lnglat } from '@/services/map'

const currentLnglat = ref<Lnglat | null>(null)
const editData = ref<Toilet | null>(null)

const searchParams = ref<ToiletSearchParams>({ name: '' })
provide('searchParams', searchParams)

function onAdd() {
  editVisible.value = true
}

// 地图
const dialogMapVisible = ref(false)
const defaultLnglat = ref<Lnglat | null>(null)

function onReviewLnglat(ll: LL) {
  defaultLnglat.value = ll2Lnglat(ll)
  onShowMap()
}

function onShowMap(lnglat?: Lnglat) {
  dialogMapVisible.value = true
  if (lnglat) {
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

function onEditConfirm() {
  doUpdateList()
}

// 通过改变搜索条件来更新列表
async function doUpdateList() {
  let tempName = searchParams.value.name
  searchParams.value.name = '@$%^!@^%$#!@'
  await nextTick()
  searchParams.value.name = tempName
}

function onCellEdit(data: Toilet) {
  editVisible.value = true
  editData.value = data
}
</script>

<template>
  <Query @add="onAdd" />
  <List @lnglat="onReviewLnglat" @edit="onCellEdit" />
  <Edit v-model:visible="editVisible" v-model:lnglat="currentLnglat" :editData="editData" @confim="onEditConfirm"
    @showmap="onShowMap" />
  <Map :visible="dialogMapVisible" :defaultLnglat="defaultLnglat" @choose="doChooseLnglat" @close="onCloseMap" />
</template>

<style></style>