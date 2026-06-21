<template>
  <div
    class="app-shell"
    :class="{
      'is-collapsed': sidebarCollapsed,
      'is-mobile-open': mobileSidebarOpen
    }"
  >
    <!-- 移动端遮罩 -->
    <div
      v-if="mobileSidebarOpen"
      class="mobile-mask"
      @click="mobileSidebarOpen = false"
    />

    <!-- 侧边栏 -->
    <aside class="shell-sidebar">
      <Sidebar :collapsed="sidebarCollapsed" @navigate="onNavigate" />
    </aside>

    <!-- 主区域 -->
    <div class="shell-main">
      <!-- 顶部栏 -->
      <header class="shell-header">
        <Navbar @toggle-sidebar="handleToggleSidebar" />
      </header>

      <!-- 内容区 -->
      <main class="shell-content">
        <div class="content-inner">
          <router-view v-slot="{ Component }">
            <transition name="ink" mode="out-in" appear>
              <keep-alive>
                <component :is="Component" />
              </keep-alive>
            </transition>
          </router-view>
        </div>

        <!-- 底部信息 -->
        <footer class="shell-footer">
          <span class="footer-ornament">⨁</span>
          <span>传统文化数字化平台 · 传承经典 智享文化</span>
          <span class="footer-ornament">⨁</span>
        </footer>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import Sidebar from './Sidebar.vue'
import Navbar from './Navbar.vue'

const appStore = useAppStore()
const userStore = useUserStore()
const { sidebarCollapsed } = storeToRefs(appStore)

// 移动端抽屉侧栏状态
const mobileSidebarOpen = ref(false)
const MOBILE_BREAKPOINT = 768

const handleToggleSidebar = () => {
  if (window.innerWidth <= MOBILE_BREAKPOINT) {
    mobileSidebarOpen.value = !mobileSidebarOpen.value
  } else {
    appStore.toggleSidebar()
  }
}

// 移动端点击导航后自动关闭抽屉
const onNavigate = () => {
  if (window.innerWidth <= MOBILE_BREAKPOINT) {
    mobileSidebarOpen.value = false
  }
}

// 窗口尺寸变化时重置移动端状态
const handleResize = () => {
  if (window.innerWidth > MOBILE_BREAKPOINT) {
    mobileSidebarOpen.value = false
  }
}

// 页面刷新后重新加载用户信息
onMounted(() => {
  if (localStorage.getItem('token') && !userStore.userInfo) {
    userStore.fetchUserInfo().catch(() => {})
  }
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
.app-shell {
  display: flex;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: var(--bg-body);

  .mobile-mask {
    display: none;
  }

  .shell-sidebar {
    flex-shrink: 0;
    width: 240px;
    transition: width var(--transition-slow);
    position: relative;
    z-index: 100;
  }

  &.is-collapsed .shell-sidebar {
    width: 64px;
  }

  .shell-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
  }

  .shell-header {
    flex-shrink: 0;
    height: 56px;
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .shell-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: var(--space-xl) var(--space-2xl);
    position: relative;

    // 顶部氛围光晕
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60%;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        var(--cinnabar),
        transparent
      );
      opacity: 0.12;
    }
  }

  .content-inner {
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    min-height: calc(100vh - 56px - var(--space-2xl) * 2 - 48px);
  }

  .shell-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 16px 0;
    font-size: 12px;
    color: var(--text-tertiary);
    letter-spacing: 2px;
    border-top: 1px solid var(--border-light);
    margin-top: var(--space-3xl);

    .footer-ornament {
      font-size: 8px;
      color: var(--cinnabar);
      opacity: 0.25;
    }
  }
}

// ═══════════════════════════════════════
// 移动端适配 — 抽屉式侧栏
// ═══════════════════════════════════════
@media (max-width: 768px) {
  .app-shell {
    .mobile-mask {
      display: block;
      position: fixed;
      inset: 0;
      z-index: 150;
      background: var(--bg-overlay);
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      animation: fadeIn 0.2s ease;
    }

    .shell-sidebar {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      width: 240px;
      z-index: 200;
      transform: translateX(-100%);
      transition: transform var(--transition-normal);
      box-shadow: var(--shadow-xl);
    }

    &.is-mobile-open .shell-sidebar {
      transform: translateX(0);
    }

    // 桌面端折叠状态在移动端不生效
    &.is-collapsed .shell-sidebar {
      width: 240px;
    }

    .shell-main {
      width: 100%;
    }

    .shell-header {
      height: 52px;
    }

    .shell-content {
      padding: var(--space-md);
      -webkit-overflow-scrolling: touch;
    }

    .content-inner {
      min-height: auto;
    }

    .shell-footer {
      margin-top: var(--space-xl);
      padding: 16px 0;
      padding-bottom: calc(16px + env(safe-area-inset-bottom));
      font-size: 11px;
      letter-spacing: 1px;
      text-align: center;
      flex-wrap: wrap;
    }
  }
}

// ═══════════════════════════════════════
// 路由过渡动画 — 墨迹扩散
// ═══════════════════════════════════════
.ink-enter-active {
  animation: inkEnter 0.4s var(--ease-out-expo) both;
}

.ink-leave-active {
  animation: inkEnter 0.25s ease reverse both;
}

@keyframes inkEnter {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
    filter: blur(3px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
