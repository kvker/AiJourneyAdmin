<script lang="ts" setup>
import { ref } from 'vue'
import type { Ref } from 'vue'
import { db } from '@/services/cloud'

const attraction: Ref<Attraction> = ref(JSON.parse(localStorage.getItem('attraction') as string))
const attractionList: Ref<Attraction[]> = ref([])
const getAttractionList = async () => {
  const { data } = await db.collection('JAttraction').get()
  attractionList.value = data
}
getAttractionList()

const onChangeAttraction = (e: Event) => {
  const select = e.target as HTMLSelectElement
  const index = select.value
  attraction.value = attractionList.value[Number(index)]
  localStorage.setItem('attraction', JSON.stringify(attraction.value))
}
</script>

<template>
  <div class="w-full h-full">
    <select class="select select-info w-full max-w-xs" @change="onChangeAttraction">
      <option disabled selected>选择景区</option>
      <option v-for="(attraction, index) of attractionList" :key="attraction._id" :value="index">{{ attraction.name
        }}
      </option>
    </select>
    <p>
      当前景区：{{ attraction?.name }}
    </p>
  </div>
</template>

<style>
#chart-panel,
#chart-line {
  width: 100%;
  height: 50%;
}
</style>