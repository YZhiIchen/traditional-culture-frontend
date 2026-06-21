import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import App from './App.vue'

// 全局样式
import './assets/styles/main.scss'

const app = createApp(App)
const pinia = createPinia()

// 注册图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus)

app.mount('#app')

// ✅ 修复：移除导致问题的 beforeUnloadListener
// 这个函数会持续修改 history.state，导致窗口无法最小化
const originalReplaceState = window.history.replaceState
window.history.replaceState = function(...args: any[]) {
  // 过滤掉 beforeUnloadListener 触发的调用
  const stack = new Error().stack
  if (stack && stack.includes('beforeUnloadListener')) {
    // 忽略 beforeUnloadListener 的调用
    return
  }
  return originalReplaceState.apply(this, args)
}
