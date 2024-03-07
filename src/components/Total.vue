<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { db } from '@/services/cloud'

const attraction: Ref<Attraction> = ref(JSON.parse(localStorage.getItem('attraction') as string))
const attractionList: Ref<Attraction[]> = ref([])
const getAttractionList = async () => {
  const { data } = await db.collection('JAttraction').get()
  attractionList.value = data
  if (!attraction.value) {
    attraction.value = data[0]
  }
  localStorage.setItem('attraction', JSON.stringify(attraction.value))
}
getAttractionList()

const attractionName = computed(() => {
  return attractionList.value.find((item) => item.name === attraction.value?.name)?.name
})

const onChangeAttraction = (e: Event) => {
  const select = e.target as HTMLSelectElement
  const name = select.value
  attraction.value = attractionList.value.find((item) => item.name === name) as Attraction
  localStorage.setItem('attraction', JSON.stringify(attraction.value))
}
</script>

<template>
  <div class="w-full h-full">
    <select class="select select-info w-full max-w-xs" @change="onChangeAttraction" :value="attractionName">
      <option disabled selected>选择景区</option>
      <option v-for="(attraction, index) of attractionList" :key="attraction._id" :value="attraction.name">{{
      attraction.name
    }}
      </option>
    </select>
    <p>
      当前景区：{{ attraction?.name }}
    </p>
  </div>
</template>

<style>

</style>