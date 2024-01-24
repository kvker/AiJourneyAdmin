<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import AV from 'leancloud-storage'
import lc from '@libs/lc'

onMounted(() => {
  getList()
})

const emit = defineEmits(['lnglat'])

// 列表
interface User {
  date: string
  name: string
  address: string
}

const tableRowClassName = ({
  row,
  rowIndex,
}: {
  row: User
  rowIndex: number
}) => {
  if (rowIndex === 1) {
    return 'warning-row'
  } else if (rowIndex === 3) {
    return 'success-row'
  }
  return ''
}

type Area = {
  name: string
  lnglat: AV.GeoPoint
  description: string
  coverImageList: string[]
  updatedAt: string
}

let sourceList: AV.Queriable[] = []
const tableData = ref<Area[]>([])

async function getList() {
  const ret = await lc.read('Area', q => {
    q.limit(20)
  })
  sourceList = ret
  tableData.value = ret.map(i => i.toJSON())
}

function doReviewLnglat(data: Area) {
  console.log('doReviewLnglat')
  console.log(data.lnglat)
  emit('lnglat', data.lnglat)
}
</script>

<template>
  <div>
    <el-table :data="tableData" style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column prop="name" label="景点名" width="180" />
      <el-table-column prop="lnglat" label="经纬度" width="180">
        <template #default="scope">
          <el-button @click="doReviewLnglat(scope.row)">经纬度</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="修改时间">
        <template #default="scope">
          <p>{{ new Date(scope.row.updatedAt).toLocaleString() }}</p>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>