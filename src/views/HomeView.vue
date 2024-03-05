<script lang="ts" setup>
import { ref, } from 'vue'
import router from '@/router'
import ChatBox from '@/components/Common/ChatBox.vue'
import { auth } from '@/services/cloud'

async function initPrepare() {
  if (!auth.currentUser) {
    alert('未登录, 非法进入')
    router.replace('/')
  }
}

initPrepare()

const basePath = '/home'
const menu = [{
  path: '/total',
  name: '信息管理'
}, {
  path: '/area',
  name: '景点管理'
}, {
  path: '/toilet',
  name: '厕所管理'
}, {
  path: '/attention',
  name: '注意事项'
}, {
  path: '/user',
  name: '人员管理'
}, {
  path: '/setting',
  name: '设置'
}
]

const currentIndex = ref(doFindInitialIndex())
function doFindInitialIndex() {
  let index = menu.findIndex(item => basePath + item.path === location.pathname)
  return index < 0 ? 0 : index
}

const onMenuSelect = (item: typeof menu[0], index: number) => {
  router.push(basePath + item.path)
  currentIndex.value = index
}
</script>

<template>
  <menu class=" h-full">
    <ul class="menu bg-base-200 w-56 rounded-box h-full">
      <li v-for="(m, index) of menu" :index="'' + index" @click="onMenuSelect(m, index)"><a
          :class="{ 'active': currentIndex === index }">{{ m.name }}</a></li>
    </ul>
  </menu>
  <main class=" flex-1 h-full p-2">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </main>
  <ChatBox />
</template>

<style>
/* 表格的底部横线处理掉 */
.el-table__inner-wrapper::before {
  display: none;
}
</style>