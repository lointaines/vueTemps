import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/userManage',
    meta: {
      title: "西藏文化"
    },
    children: [
      {
        path: '/userManage',
        name: 'userManage',
        component: () => import('@/views/user/userManage.vue'),
      },
      {
        path: '/roleManage',
        name: 'roleManage',
        component: () => import('@/views/user/roleManage.vue'),
      },
      {
        path: '/userAndRole',
        name: 'userAndRole',
        component: () => import('@/views/user/userAndRole.vue'),
      },
      {
        path: '/itemManage',
        name: 'itemManage',
        component: () => import('@/views/item/itemManage.vue'),
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
