<script lang="ts" setup>
import { ref, provide, nextTick } from 'vue'
import Query from '@/components/Attention/Query.vue'
import List from '@/components/Attention/List.vue'
import Edit from '@/components/Attention/Edit.vue'
import Map from '@/components/Common/Map.vue'

const currentLnglat = ref<Lnglat | null>(null)
const editData = ref<Attention | null>(null)

const searchParams = ref<AttentionSearchParams>({ name: '' })
provide('searchParams', searchParams)

function onAdd() {
  editVisible.value = true
}

// 地图
const dialogMapVisible = ref(false)
const defaultLnglat = ref<Lnglat | null>(null)

function onReviewLnglat(ll: LL) {
  defaultLnglat.value = ll
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

function onCellEdit(data: Attention) {
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