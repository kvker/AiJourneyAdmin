import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'


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
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/play',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '',
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
          path: 'toilet',
          component: () => import('@/components/Toilet.vue')
        },
        {
          path: 'login',
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
