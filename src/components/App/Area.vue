<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import Query from '@components/App/Area/Query.vue'
import List from '@components/App/Area/List.vue'
import Edit from '@components/App/Area/Edit.vue'
import Map from '@components/App/Common/Map.vue'

const dialogMapVisible = ref(false)
const defaultLnglat = ref<Lnglat | null>(null)

function ll2lnglat(ll: LL) {
  return {
    lng: ll.longitude,
    lat: ll.latitude,
  }
}

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
  <main>
    <Query />
    <List @lnglat="doReviewLnglat" />
    <!-- <Edit /> -->
    <Map v-if="dialogMapVisible" @choose="doChooseLnglat" @close="doMapClose" :defaultLnglat="defaultLnglat" />
  </main>
</template>

<style></style>