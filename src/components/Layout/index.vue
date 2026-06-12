<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside
      :width="sidebarCollapsed ? '64px' : '240px'"
      class="layout-aside"
    >
      <Sidebar :collapsed="sidebarCollapsed" />
    </el-aside>

    <el-container class="layout-main-area">
      <!-- 顶部导航栏 -->
      <el-header class="layout-header" :class="{ collapsed: sidebarCollapsed }">
        <Navbar @toggle-sidebar="appStore.toggleSidebar()" />
      </el-header>

      <!-- 主要内容区（带路由过渡动画） -->
      <el-main class="layout-main">
        <div class="main-content">
          <router-view v-slot="{ Component }">
            <transition name="page" mode="out-in" appear>
              <keep-alive>
                <component :is="Component" />
              </keep-alive>
            </transition>
          </router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
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
.layout-container {
  height: 100vh;
  overflow: hidden;
  background: var(--bg-main);
}

.layout-aside {
  position: relative;
  background: var(--bg-sidebar);
  color: var(--text-inverse);
  transition: width var(--transition-slow);
  overflow: hidden;
  z-index: 100;
  box-shadow: 2px 0 20px rgba(0, 0, 0, 0.15);
}

.layout-main-area {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.layout-header {
  height: 60px !important;
  padding: 0;
  flex-shrink: 0;
  position: relative;
  z-index: 50;
  transition: all var(--transition-normal);

  &.collapsed {
    // 侧栏折叠时 header 视觉微调
  }
}

.layout-main {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;

  .main-content {
    max-width: 1400px;
    margin: 0 auto;
    min-height: 100%;
    position: relative;
  }
}

// ═══════════════════════════════════════
// 页面过渡动画（Layout 内部路由）
// ═══════════════════════════════════════
.page-enter-active {
  animation: pageEnter 0.35s ease both;
}

.page-leave-active {
  animation: pageLeave 0.25s ease both;
}

@keyframes pageEnter {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pageLeave {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-8px);
  }
}
</style>
