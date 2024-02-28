<script lang="ts" setup>
import { ref, } from 'vue'
import router from '@/router'
import lc from '@/libs/lc'
import ChatBox from '@/components/Common/ChatBox.vue'

async function initPrepare() {
  // 匿名用户，如果本地持有则取用本地
  // 匿名用户是用来解决数据安全问题，如果没有匿名用户，无法访问数据，且可以追踪非法操作
  // 匿名用户放到用户端去，这里必须要求登录
  // if (!lc.currentUser()) {
  //   lc.AV.User.loginAnonymously().then((user) => {
  //     console.log('新建匿名用户')
  //   })
  // }
  // console.log('当前用户：', lc.currentUser())
  if (!lc.currentUser()) {
    alert('未登录, 非法进入')
    lc.logout()
    router.replace('/')
  }
  const roles = await lc.currentUser().getRoles()
  const role = roles[0]
  // 入口安全处理
  if (!localStorage.getItem('attraction')) {
    alert('无景区关系, 非法进入')
    lc.logout()
    router.replace('/')
  }
  else if (!role) {
    alert('无角色, 非法进入')
    lc.logout()
    router.replace('/')
  }
}

initPrepare()

const basePath = '/home'
// TODO:
// 这一块数据来自服务端
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