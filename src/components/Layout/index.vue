<template>
  <div class="app-shell" :class="{ 'is-collapsed': sidebarCollapsed }">
    <!-- 侧边栏 -->
    <aside class="shell-sidebar">
      <Sidebar :collapsed="sidebarCollapsed" />
    </aside>

    <!-- 主区域 -->
    <div class="shell-main">
      <!-- 顶部栏 -->
      <header class="shell-header">
        <Navbar @toggle-sidebar="appStore.toggleSidebar()" />
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
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'
import Sidebar from './Sidebar.vue'
import Navbar from './Navbar.vue'

const appStore = useAppStore()
const { sidebarCollapsed } = storeToRefs(appStore)
</script>

<style scoped lang="scss">
.app-shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--bg-body);

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
</style>
