import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { auth, db } from '@/services/cloud'

// , {
//   component: Shop,
//   name: '商户管理'
// }, {
//   component: Driver,
//   name: '司机管理'
// }, {
//   component: Hotel,
//   name: '酒店管理'
// }, {
//   component: Restaurant,
//   name: '饭店管理'
// }, {
//   component: TravelAgency,
//   name: '旅行社管理'
// }, {
//   component: Complaint,
//   name: '投诉管理'
// }

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      beforeEnter: async (to, from, next) => {
        try {
          console.log(auth.currentUser?.uid)
          const { message, data } = await db.collection('Role').where({
            userIds: auth.currentUser?.uid,
          })
            .field({
              name: true,
            })
            .get()
          if (message) {
            throw new Error(message)
          }
          console.log('当前用户角色： ' + (data[0]?.name || '无角色'))
          const passed = data[0]?.name === 'superAdmin'
          if (passed) {
            next()
          } else {
            alert('抱歉，您没有权限进入管理系统')
            await auth.signOut()
            next('/')
          }
        } catch (error) {
          alert(error)
          await auth.signOut()
          next('/')
        }
      },
      children: [
        {
          path: 'home', // 默认子路由，重定向到total
          component: () => import('@/components/Total.vue')
        },
        {
          path: 'total',
          component: () => import('@/components/Total.vue')
        },
        {
          path: 'area',
          component: () => import('@/components/Area.vue')
        },
        {
          path: 'attention',
          component: () => import('@/components/Attention.vue')
        },
        {
          path: 'toilet',
          component: () => import('@/components/Toilet.vue')
        },
        {
          path: 'user',
          component: () => import('@/components/User.vue')
        },
        {
          path: 'setting',
          component: () => import('@/components/Setting.vue')
        },
      ]
    },
  ]
})

export default router
