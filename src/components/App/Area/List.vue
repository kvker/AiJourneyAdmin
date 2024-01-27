<script lang="ts" setup>
import { ref, watch, inject } from 'vue'
import type { Ref } from 'vue'
import lc from '@/libs/lc'
import { ElMessage, ElMessageBox } from 'element-plus'


const searchParams = inject('searchParams') as Ref<AreaSearchParams>

const emit = defineEmits(['lnglat', 'edit'])
const page = ref(0)
const tableData = ref<Area[]>([])
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
      timeout = null
    } else {
      timeout = setTimeout(() => {
        getCount()
        getList()
        timeout = null
      }, 1000)
    }
  }
})

// 列表
interface User {
  date: string
  name: string
  address: string
}

const tableRowClassName = ({
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

let count = ref(0)

async function getList(params = searchParams.value) {
  const ret = await lc.read('Area', q => {
    q.limit(10)
    q.skip(10 * page.value)
    if (params.name) {
      q.equalTo('name', params.name)
    }
  })
  tableData.value = ret.map(i => i.toJSON())
}

async function getCount(params = searchParams.value) {
  const ret = await lc.count('Area', q => {
    if (params.name) {
      q.equalTo('name', params.name)
    }
  })
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
  emit('edit', data)
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
    .then(async () => {
      await lc.delete('Area', data.objectId)
      tableData.value.splice(index, 1)
      ElMessage({
        type: 'success',
        message: '删除成功',
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
      <el-table-column label="坐标" width="180">
        <template #default="scope">
          <p class=" truncate">{{ scope.row.description }}</p>
        </template>
      </el-table-column>
      <el-table-column label="封面图">
        <template #default="scope">
          <el-image v-for="(image, index) of scope.row.coverImageList" :src="image"
            :preview-src-list="scope.row.coverImageList" :preview-teleported="true" :initial-index="index" fit="contain"
            class=" w-10 h-10 mr-1"></el-image>
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