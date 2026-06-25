<template>
  <router-view v-slot="{ Component, route: r }">
    <transition :name="transitionName" mode="out-in" appear>
      <component :is="Component" :key="r.path" />
    </transition>
  </router-view>
  <AIChat v-if="showChat" />
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'

const route = useRoute()
import AIChat from '@/components/AIChat.vue'

// 登录/注册页不显示 AI 聊天
const showChat = computed(() => {
  return !['/login', '/register'].includes(route.path)
})

const appStore = useAppStore()
const { theme, sidebarCollapsed } = storeToRefs(appStore)

// 路由过渡类型
const transitionName = ref<'ink' | 'fade'>('fade')

watch(
  () => route.path,
  (to, from) => {
    if (!from) {
      transitionName.value = 'fade'
      return
    }

    if (from === '/login' || to === '/login') {
      transitionName.value = 'fade'
    } else {
      transitionName.value = 'ink'
    }
  }
)

// 侧栏折叠时，在 html 上记录 class（用于 some ep 等全局覆盖）
watch(sidebarCollapsed, (val) => {
  document.documentElement.classList.toggle('sidebar-collapsed', val)
})

// 初始化
onMounted(() => {
  appStore.initSystemThemeListener()
})
document.documentElement.setAttribute('data-theme', theme.value === 'system'
  ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  : theme.value
)
document.documentElement.classList.toggle('sidebar-collapsed', sidebarCollapsed.value)
</script>

<style lang="scss">
// ── 路由过渡动画 ──

// 墨迹过渡
.ink-enter-active {
  animation: routeEnter 0.4s var(--ease-out-expo) both;
}

.ink-leave-active {
  animation: routeEnter 0.28s ease reverse both;
}

@keyframes routeEnter {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.985);
    filter: blur(3px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

// 简单淡入/淡出
.fade-enter-active {
  transition: opacity 0.05s ease;
}

.fade-leave-active {
  transition: opacity 0.05s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
