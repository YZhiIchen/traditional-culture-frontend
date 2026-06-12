<template>
  <router-view v-slot="{ Component, route: r }">
    <transition
      :name="transitionName"
      mode="out-in"
      appear
    >
      <component :is="Component" :key="r.path" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'

const route = useRoute()
const appStore = useAppStore()
const { theme } = storeToRefs(appStore)

// 路由过渡类型
const transitionName = ref<'fade-slide' | 'fade'>('fade')

// 根据路由深度或方向切换过渡
watch(
  () => route.path,
  (to, from) => {
    if (!from) {
      transitionName.value = 'fade'
      return
    }
    // 登录页进主页用 fade-slide，其他用 fade
    if (from === '/login' || to === '/login') {
      transitionName.value = 'fade'
    } else {
      transitionName.value = 'fade-slide'
    }
  }
)

// 监听主题变化
if (theme.value === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark')
}
</script>

<style lang="scss">
// ── 路由过渡动画 ──

// Fade + Slide
.fade-slide-enter-active {
  animation: routeEnter 0.4s ease both;
}

.fade-slide-leave-active {
  animation: routeEnter 0.25s ease reverse both;
}

// Simple fade
.fade-enter-active {
  transition: opacity 0.3s ease;
}

.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
