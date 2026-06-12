<template>
  <div class="sidebar">
    <!-- Logo 区域（中式印章风格） -->
    <div class="logo-wrapper" :class="{ collapsed }">
      <div class="logo-seal">
        <span class="seal-char">文</span>
        <span class="seal-char">化</span>
      </div>
      <transition name="logo-text">
        <div v-if="!collapsed" class="logo-text-group">
          <span class="logo-title">传统文化</span>
          <span class="logo-subtitle">数字平台</span>
        </div>
      </transition>
    </div>

    <!-- 装饰分隔线 -->
    <div class="sidebar-divider" :class="{ collapsed }">
      <span class="divider-line" />
      <span v-if="!collapsed" class="divider-dot">✦</span>
      <span class="divider-line" />
    </div>

    <!-- 导航菜单 -->
    <el-menu
      :default-active="activeMenu"
      :collapse="collapsed"
      :collapse-transition="false"
      background-color="transparent"
      text-color="rgba(245, 240, 232, 0.65)"
      active-text-color="#f5f0e8"
      router
    >
      <el-menu-item index="/upload">
        <el-icon><Upload /></el-icon>
        <span>资源上传</span>
      </el-menu-item>

      <el-menu-item index="/search">
        <el-icon><Search /></el-icon>
        <span>资源检索</span>
      </el-menu-item>
    </el-menu>

    <!-- 底部装饰 -->
    <div v-if="!collapsed" class="sidebar-footer">
      <div class="footer-ornament" />
      <span class="footer-text">传承经典 · 智享文化</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Upload, Search } from '@element-plus/icons-vue'

defineProps<{
  collapsed: boolean
}>()

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style scoped lang="scss">
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  // 底部装饰性山水剪影
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80px;
    z-index: 0;
    pointer-events: none;
    opacity: 0.08;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 60'%3E%3Cpath d='M0 60 L0 40 Q20 25 40 35 Q60 45 80 30 Q100 15 120 28 Q140 40 160 22 Q180 10 200 20 L200 60 Z' fill='%23f5f0e8'/%3E%3Cpath d='M0 60 L0 48 Q30 32 50 40 Q70 48 90 36 Q110 24 130 38 Q150 50 170 32 Q185 20 200 28 L200 60 Z' fill='%23f5f0e8' opacity='0.6'/%3E%3C/svg%3E") no-repeat bottom / contain;
  }

  // ── Logo 区域（印章风格）──
  .logo-wrapper {
    display: flex;
    align-items: center;
    padding: 24px 16px 16px;
    gap: 12px;
    position: relative;
    z-index: 1;

    &.collapsed {
      justify-content: center;
      padding: 20px 0;
    }

    .logo-seal {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border: 2px solid var(--cinnabar);
      border-radius: 4px;
      transform: rotate(-2deg);
      flex-shrink: 0;
      transition: all var(--transition-normal);

      .seal-char {
        font-family: var(--font-heading);
        font-size: 14px;
        line-height: 1;
        color: var(--cinnabar);
        font-weight: 700;
        letter-spacing: 1px;
      }
    }

    .logo-text-group {
      display: flex;
      flex-direction: column;
      gap: 2px;

      .logo-title {
        font-family: var(--font-heading);
        font-size: 17px;
        font-weight: 700;
        color: var(--text-inverse);
        letter-spacing: 3px;
        line-height: 1.2;
      }

      .logo-subtitle {
        font-size: 11px;
        color: rgba(245, 240, 232, 0.5);
        letter-spacing: 4px;
      }
    }
  }

  // ── 分隔装饰 ──
  .sidebar-divider {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 20px;
    margin-bottom: 8px;
    position: relative;
    z-index: 1;

    &.collapsed {
      justify-content: center;
      padding: 0 12px;
    }

    .divider-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(245, 240, 232, 0.15),
        transparent
      );
    }

    .divider-dot {
      font-size: 8px;
      color: var(--gold);
      opacity: 0.5;
    }
  }

  // ── 菜单 ──
  :deep(.el-menu) {
    border-right: none;
    flex: 1;
    background-color: transparent;
    position: relative;
    z-index: 1;

    .el-menu-item {
      height: 46px;
      line-height: 46px;
      margin: 4px 12px;
      border-radius: var(--radius-md);
      transition: all var(--transition-normal);
      position: relative;

      .el-icon {
        font-size: 18px;
        transition: transform var(--transition-spring);
      }

      &:hover {
        background: rgba(245, 240, 232, 0.08);

        .el-icon {
          transform: scale(1.1);
        }
      }

      &.is-active {
        background: linear-gradient(135deg, rgba(194, 59, 34, 0.2), rgba(194, 59, 34, 0.1));
        color: #f5f0e8 !important;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: var(--cinnabar);
          border-radius: 0 2px 2px 0;
        }

        .el-icon {
          color: var(--cinnabar);
        }
      }
    }
  }

  // ── 底部 ──
  .sidebar-footer {
    padding: 16px 20px;
    text-align: center;
    position: relative;
    z-index: 1;

    .footer-ornament {
      height: 1px;
      margin-bottom: 12px;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(245, 240, 232, 0.1),
        transparent
      );
    }

    .footer-text {
      font-size: 11px;
      color: rgba(245, 240, 232, 0.3);
      letter-spacing: 3px;
    }
  }
}

// Logo 文字过渡
.logo-text-enter-active,
.logo-text-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.logo-text-enter-from,
.logo-text-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}
</style>
