import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/Main',
    name: 'Main',
    redirect:'/Home',
    component: import('@/views/Main.vue'),
    meta: {
      title: "西藏文化"
    },
    children: [
      {
        path: '/Home',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: '/visitorHome',
        name: 'visitorHome',
        component: () => import('@/views/visitor/visitorHome.vue'),
      },
      {
        path: '/visitorDetail',
        name: 'visitorDetail',
        component: () => import('@/views/visitor/visitorDetail.vue'),
      },
      {
        path: '/userManage',
        name: 'userManage',
        component: () => import('@/views/user/userManage.vue'),
      }, {
        path: '/userInfo',
        name: 'userInfo',
        component: () => import('@/views/user/userInfo.vue')
      },
      {
        path: '/roleManage',
        name: 'roleManage',
        component: () => import('@/views/security/roleManage.vue'),
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
      {
        path: '/itemAdd',
        name: 'itemAdd',
        component: () => import('@/views/item/itemAdd.vue'),
      },
      {
        path: '/itemTypeManage',
        name: 'itemTypeManage',
        component: () => import('@/views/item/itemTypeManage.vue'),
      }, {
        path: '/itemDetail',
        name: 'itemDetail',
        component: () => import('@/views/item/itemDetail.vue')
      }, {
        path: '/permissionManage',
        name: 'permissionManage',
        component: () => import('@/views/security/permissionManage.vue')
      }, {
        path: '/roleAndPermission',
        name: 'roleAndPermission',
        component: () => import('@/views/security/roleAndPermission.vue')
      },
    ]
  },
  {
    path: '/',
    redirect: '/login',
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
