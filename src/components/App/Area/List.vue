<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import AV from 'leancloud-storage'
import lc from '@/libs/lc'
import { ElMessage, ElMessageBox } from 'element-plus'

onMounted(() => {
  getCount()
})

const emit = defineEmits(['lnglat'])
const page = ref(0)
const tableData = ref<Area[]>([])

watch(page, () => {
  getList()
}, {
  immediate: true,
})

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
let count = ref(0)

async function getList() {
  const ret = await lc.read('Area', q => {
    q.limit(10)
    q.skip(10 * page.value)
  })
  sourceList = ret
  tableData.value = ret.map(i => i.toJSON())
}

async function getCount() {
  const ret = await lc.count('Area')
  count.value = ret
}

function doReviewLnglat(data: Area) {
  console.log('doReviewLnglat')
  console.log(data.lnglat)
  emit('lnglat', data.lnglat)
}

function doEdit(data: Area, index: number) {
  console.log('doEdit')
  console.log(data, index)
}

function doDelete(data: Area, index: number) {
  console.log('doDelete')
  console.log(data, index)
  ElMessageBox.confirm(
    '即将删除此景点，是否继续？',
    '高危操作！！！',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: 'Delete completed',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      })
    })
}

function doChangePage(p: number) {
  // console.log(p)
  page.value = p - 1 // 这个p是从1开始
}
</script>

<template>
  <div class="flex-1 flex flex-col justify-around">
    <el-table :data="tableData" class=" w-full" style="height: 560px;" :row-class-name="tableRowClassName">
      <el-table-column prop="name" label="景点名" width="180" />
      <el-table-column label="坐标" width="180">
        <template #default="scope">
          <el-button @click="doReviewLnglat(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="修改时间">
        <template #default="scope">
          <p>{{ new Date(scope.row.updatedAt).toLocaleString() }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="info" @click="doEdit(scope.row, scope.$index)">编辑</el-button>
          <el-button size="small" type="danger" @click="doDelete(scope.row, scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :page-size="10" :total="count" @change="doChangePage" />
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