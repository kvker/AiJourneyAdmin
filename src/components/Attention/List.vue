<script lang="ts" setup>
import { ref, watch, inject } from 'vue'
import type { Ref } from 'vue'
import { db } from '@/services/cloud'

const attraction = JSON.parse(localStorage.getItem('attraction') as string)

const searchParams = inject('searchParams') as Ref<AttentionSearchParams>

const emit = defineEmits(['lnglat', 'edit'])
const page = ref(0)
const size = 8
const tableData = ref<Attention[]>([])
getCount()

watch(page, () => {
  getList()
}, {
  immediate: true,
})

let timeout: any
watch(() => searchParams.value.name, (val, oldVal) => {
  if (val !== oldVal) {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      getCount()
      getList()
      timeout = null
    }, 1000)
  }
})

// 列表
let count = ref(0)

async function getList() {
  const { data } = await db.collection('JAttention')
    .where({
      attractionId: attraction._id,
    })
    .limit(size)
    .skip(size * page.value)
    .orderBy('updatedAt', 'desc')
    .get()
  tableData.value = data
}

async function getCount() {
  const { total } = await db.collection('JAttention')
    .where({
      attractionId: attraction._id,
    })
    .count()
  count.value = total
}

function doEdit(data: Attention, index: number) {
  console.log('doEdit')
  console.log(data, index)
  emit('edit', data)
}

async function doDelete(data: Attention, index: number) {
  console.log('doDelete')
  console.log(data, index)
  if (confirm('即将删除此事项，是否继续？')) {
    await db.collection('JAttention').doc(data._id).remove()
    tableData.value.splice(index, 1)
  }
}

function doChangePage(p: number) {
  // console.log(p)
  page.value = p - 1 // 这个p是从1开始
}
</script>

<template>
  <table class="table table-zebra my-2">
    <thead>
      <tr>
        <th>序号</th>
        <th>名称</th>
        <th>封面图</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) of tableData" :key="item._id">
        <th>{{ index + 1 }}</th>
        <td>{{ item.name }}</td>
        <td>
          <div class="flex items-center">
            <img class=" w-10 h-10 mr-2" v-for="(imgItem, index) of item.coverImageList" :key="imgItem" :src="imgItem"
              alt="preview-img" />
          </div>
        </td>
        <td>
          <button class="btn btn-sm" @click="doEdit(item, index)">编辑</button>
          <button class="btn btn-secondary ml-2 btn-sm" @click="doDelete(item, index)">删除</button>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="join">
    <button class="join-item btn" @click="doChangePage(n)" v-for="n in Math.ceil(count / size)">{{ n }}</button>
  </div>
</template>

<style scoped></style>