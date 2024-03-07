import React, { lazy } from 'react'
import ReactDOM from 'react-dom/client'
import Login from './pages/Login.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import './index.css'
import ErrorPage from "./pages/Error"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/home",
    Component: lazy(() => import('./pages/Home.tsx')),
    errorElement: <ErrorPage />,
    // children: [
    //   {
    //     path: '', // 默认子路由，重定向到total
    //     element: () => import('@/components/Total.vue')
    //   },
    //   {
    //     path: 'total',
    //     element: () => import('@/components/Total.vue')
    //   },
    //   {
    //     path: 'area',
    //     element: () => import('@/components/Area.vue')
    //   },
    //   {
    //     path: 'attention',
    //     element: () => import('@/components/Attention.vue')
    //   },
    //   {
    //     path: 'toilet',
    //     element: () => import('@/components/Toilet.vue')
    //   },
    //   {
    //     path: 'user',
    //     element: () => import('@/components/User.vue')
    //   },
    //   {
    //     path: 'setting',
    //     element: () => import('@/components/Setting.vue')
    //   },
    // ]
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
