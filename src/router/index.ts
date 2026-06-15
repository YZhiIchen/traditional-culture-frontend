import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/index.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register/index.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('@/components/Layout/index.vue'),
    redirect: '/home',
    meta: { requiresAuth: true },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/Home/index.vue'),
        meta: { title: '工作台' }
      },
      {
        path: '/upload',
        name: 'Upload',
        component: () => import('@/views/Upload/index.vue'),
        meta: { title: '资源上传' }
      },
      {
        path: '/recognition/:id',
        name: 'RecognitionResult',
        component: () => import('@/views/RecognitionResult/index.vue'),
        meta: { title: '识别结果' }
      },
      {
        path: '/search',
        name: 'Search',
        component: () => import('@/views/Search/index.vue'),
        meta: { title: '资源检索' }
      },
      {
        path: '/history',
        name: 'History',
        component: () => import('@/views/History/index.vue'),
        meta: { title: '识别历史' }
      },
      {
        path: '/explore',
        name: 'Explore',
        component: () => import('@/views/Explore/index.vue'),
        meta: { title: '知识发现' }
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/Profile/index.vue'),
        meta: { title: '个人中心' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫
router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  const requiresAuth = to.meta.requiresAuth !== false

  // 公开页面：login + register 无需登录
  if (!requiresAuth && token) {
    return '/'
  }

  if (requiresAuth && !token) {
    return '/login'
  }

  return true
})

export default router
