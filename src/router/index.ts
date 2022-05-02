import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/userInfo',
    meta: {
      title: "西藏文化"
    },
    children: [
      {
        path: '/userInfo',
        name: 'userInfo',
        component: () => import('@/views/user/userInfo.vue'),
      },
      {
        path: '/roleManager',
        name: 'roleManager',
        component: () => import('@/views/user/roleManager.vue'),
      },
      {
        path: '/roleAuthorization',
        name: 'roleAuthorization',
        component: () => import('@/views/user/roleAuthorization.vue'),
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue')
  },

  {
    path: '/:catchAll(.*)',
    name: '404',
    component: () => import('@/views/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
