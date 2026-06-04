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
    path: '/',
    component: () => import('@/components/Layout/index.vue'),
    redirect: '/upload',
    meta: { requiresAuth: true },
    children: [
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
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 修复路由守卫 - 不使用 next() 回调
router.beforeEach((to, from) => {
  const token = localStorage.getItem('token')
  const requiresAuth = to.meta.requiresAuth !== false

  if (requiresAuth && !token) {
    return '/login'
  }
  
  if (to.path === '/login' && token) {
    return '/'
  }
  
  return true
})

export default router