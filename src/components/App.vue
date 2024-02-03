<script lang="ts" setup>
import { defineAsyncComponent, ref, computed } from 'vue'
import lc from '@/libs/lc'
console.log(import.meta.env.BASE_URL)
async function initPrepare() {
  // 匿名用户，如果本地持有则取用本地
  // 匿名用户是用来解决数据安全问题，如果没有匿名用户，无法访问数据，且可以追踪非法操作
  // 匿名用户放到用户端去，这里必须要求登录
  // if (!lc.currentUser()) {
  //   lc.AV.User.loginAnonymously().then((user) => {
  //     console.log('新建匿名用户')
  //   })
  // }
  console.log('当前用户：', lc.currentUser())
  const roles = await lc.currentUser().getRoles()
  const role = roles[0]
  if (!lc.currentUser()) {
    alert('未登录, 非法进入')
    lc.logout()
    location.href = import.meta.env.BASE_URL + 'login/'
  }
  // 入口安全处理
  else if (!localStorage.getItem('attraction')) {
    alert('无景区关系, 非法进入')
    lc.logout()
    location.href = import.meta.env.BASE_URL + 'login/'
  }
  else if (!role) {
    alert('无角色, 非法进入')
    lc.logout()
    location.href = import.meta.env.BASE_URL + 'login/'
  }
}

initPrepare()

const Total = defineAsyncComponent(() =>
  import('@/components/App/Total.vue')
)
const Area = defineAsyncComponent(() =>
  import('@/components/App/Area.vue')
)
const Complaint = defineAsyncComponent(() =>
  import('@/components/App/Complaint.vue')
)
const Shop = defineAsyncComponent(() =>
  import('@/components/App/Shop.vue')
)
const Driver = defineAsyncComponent(() =>
  import('@/components/App/Driver.vue')
)
const Hotel = defineAsyncComponent(() =>
  import('@/components/App/Hotel.vue')
)
const Restaurant = defineAsyncComponent(() =>
  import('@/components/App/Restaurant.vue')
)
const Toilet = defineAsyncComponent(() =>
  import('@/components/App/Toilet.vue')
)
const TravelAgency = defineAsyncComponent(() =>
  import('@/components/App/TravelAgency.vue')
)
const User = defineAsyncComponent(() =>
  import('@/components/App/User.vue')
)
const Setting = defineAsyncComponent(() =>
  import('@/components/App/Setting.vue')
)

// TODO:
// 这一块数据来自服务端
const menu = [{
  component: Total,
  name: '信息管理'
}, {
  component: Area,
  name: '景点管理'
}, {
  component: Shop,
  name: '商户管理'
}, {
  component: Driver,
  name: '司机管理'
}, {
  component: Hotel,
  name: '酒店管理'
}, {
  component: Restaurant,
  name: '饭店管理'
}, {
  component: Toilet,
  name: '厕所管理'
}, {
  component: TravelAgency,
  name: '旅行社管理'
}, {
  component: User,
  name: '人员管理'
}, {
  component: Complaint,
  name: '投诉管理'
},]

let hash = location.hash || '#' + 0 // 简易路由

const cIndex = ref(+hash.replace('#', '') || 0)
const c = computed(() => {
  const menuItem = menu[cIndex.value]
  return menuItem ? menuItem.component : Setting
})

const onMenuSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
  cIndex.value = +key
  location.hash = key
}
</script>

<template>
  <el-row class=" h-full">
    <el-col :span="4">
      <el-menu :default-active="cIndex + ''" class=" h-full overflow-y-auto" @select="onMenuSelect">
        <el-menu-item v-for="(m, index) of menu" :index="'' + index">
          <span>{{ m.name }}</span>
        </el-menu-item>
        <el-menu-item index="999">
          <span>设置</span>
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="20">
      <KeepAlive>
        <component :is="c" class=" p-2"></component>
      </KeepAlive>
    </el-col>
  </el-row>
</template>

<style>
/* 表格的底部横线处理掉 */
.el-table__inner-wrapper::before {
  display: none;
}
</style>