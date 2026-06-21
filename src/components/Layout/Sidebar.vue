<template>
  <nav class="sidebar">
    <!-- 品牌区：印章风格 -->
    <div class="brand" :class="{ collapsed }">
      <div class="brand-seal">
        <span class="seal-char seal-top">文</span>
        <span class="seal-char seal-btm">化</span>
      </div>
      <transition name="brand-fade">
        <div v-if="!collapsed" class="brand-text">
          <span class="brand-title">传统文化</span>
          <span class="brand-subtitle">数字化平台</span>
        </div>
      </transition>
    </div>

    <!-- 分隔装饰 -->
    <div class="divider" :class="{ collapsed }">
      <span class="divider-line" />
      <span v-if="!collapsed" class="divider-dot">✦</span>
      <span class="divider-line" />
    </div>

    <!-- 导航菜单 -->
    <ul class="nav-list">
      <li>
        <router-link
          to="/home"
          class="nav-item"
          :class="{ active: isActive('/home') }"
          :title="collapsed ? '工作台' : undefined"
        >
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </span>
          <transition name="nav-text">
            <span v-if="!collapsed" class="nav-label">工作台</span>
          </transition>
          <span v-if="!collapsed" class="nav-indicator" />
        </router-link>
      </li>

      <li>
        <router-link
          to="/upload"
          class="nav-item"
          :class="{ active: isActive('/upload') }"
          :title="collapsed ? '资源上传' : undefined"
        >
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </span>
          <transition name="nav-text">
            <span v-if="!collapsed" class="nav-label">资源上传</span>
          </transition>
          <span v-if="!collapsed" class="nav-indicator" />
        </router-link>
      </li>

      <li>
        <router-link
          to="/explore"
          class="nav-item"
          :class="{ active: isActive('/explore') }"
          :title="collapsed ? '知识发现' : undefined"
        >
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
          </span>
          <transition name="nav-text">
            <span v-if="!collapsed" class="nav-label">知识发现</span>
          </transition>
          <span v-if="!collapsed" class="nav-indicator" />
        </router-link>
      </li>

      <li>
        <router-link
          to="/search"
          class="nav-item"
          :class="{ active: isActive('/search') }"
          :title="collapsed ? '资源检索' : undefined"
        >
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <transition name="nav-text">
            <span v-if="!collapsed" class="nav-label">资源检索</span>
          </transition>
          <span v-if="!collapsed" class="nav-indicator" />
        </router-link>
      </li>

      <li>
        <router-link
          to="/history"
          class="nav-item"
          :class="{ active: isActive('/history') }"
          :title="collapsed ? '识别历史' : undefined"
        >
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </span>
          <transition name="nav-text">
            <span v-if="!collapsed" class="nav-label">识别历史</span>
          </transition>
          <span v-if="!collapsed" class="nav-indicator" />
        </router-link>
      </li>

      <li v-if="isAdmin">
        <router-link
          to="/admin"
          class="nav-item"
          :class="{ active: isActive('/admin') }"
          :title="collapsed ? '用户管理' : undefined"
        >
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </span>
          <transition name="nav-text">
            <span v-if="!collapsed" class="nav-label">用户管理</span>
          </transition>
          <span v-if="!collapsed" class="nav-indicator" />
        </router-link>
      </li>

      <li>
        <router-link
          to="/favorites"
          class="nav-item"
          :class="{ active: isActive('/favorites') }"
          :title="collapsed ? '我的收藏' : undefined"
        >
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </span>
          <transition name="nav-text">
            <span v-if="!collapsed" class="nav-label">我的收藏</span>
          </transition>
          <span v-if="!collapsed" class="nav-indicator" />
        </router-link>
      </li>

      <li>
        <router-link
          to="/profile"
          class="nav-item"
          :class="{ active: isActive('/profile') }"
          :title="collapsed ? '个人中心' : undefined"
        >
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
          <transition name="nav-text">
            <span v-if="!collapsed" class="nav-label">个人中心</span>
          </transition>
          <span v-if="!collapsed" class="nav-indicator" />
        </router-link>
      </li>
    </ul>

    <!-- 底部山水剪影装饰 -->
    <div v-if="!collapsed" class="sidebar-mountains">
      <svg viewBox="0 0 240 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 80V60 Q30 42 55 52 Q80 62 105 45 Q130 28 155 42 Q180 56 200 38 Q220 20 240 30V80Z"
              fill="currentColor" opacity="0.08" />
        <path d="M0 80V65 Q40 48 65 55 Q90 62 110 48 Q130 34 155 50 Q180 66 200 48 Q220 30 240 42V80Z"
              fill="currentColor" opacity="0.05" />
      </svg>
    </div>

    <!-- 底部标语 -->
    <div v-if="!collapsed" class="sidebar-footer">
      <span>传承经典 · 智享文化</span>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const props = defineProps<{
  collapsed: boolean
}>()

const route = useRoute()
const userStore = useUserStore()

const isActive = (path: string) => {
  return route.path.startsWith(path)
}

const isAdmin = computed(() => userStore.userInfo?.role === 'admin')
</script>

<style scoped lang="scss">
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, oklch(14% 0.025 30) 0%, #0f0b07 100%);
  position: relative;
  overflow: hidden;
  user-select: none;

  // ── 品牌区 ──
  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 16px 16px;
    position: relative;
    z-index: 1;

    &.collapsed {
      justify-content: center;
      padding: 20px 0 16px;
    }

    .brand-seal {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border: 2px solid var(--cinnabar);
      border-radius: 4px;
      transform: rotate(-3deg);
      flex-shrink: 0;
      transition: transform var(--transition-spring);

      &:hover {
        transform: rotate(0deg) scale(1.05);
      }

      .seal-char {
        font-family: var(--font-heading);
        font-size: 13px;
        line-height: 1.1;
        color: var(--cinnabar);
        font-weight: 700;
        letter-spacing: 1px;
      }

      .seal-btm {
        margin-top: 1px;
      }
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      gap: 1px;

      .brand-title {
        font-family: var(--font-heading);
        font-size: 16px;
        font-weight: 700;
        color: var(--text-inverse);
        letter-spacing: 4px;
        line-height: 1.3;
      }

      .brand-subtitle {
        font-size: 10px;
        color: oklch(75% 0.01 55 / 0.45);
        letter-spacing: 5px;
      }
    }
  }

  // ── 分隔线 ──
  .divider {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 20px;
    margin-bottom: 6px;
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
        oklch(85% 0.01 55 / 0.1),
        transparent
      );
    }

    .divider-dot {
      font-size: 7px;
      color: var(--gold);
      opacity: 0.4;
    }
  }

  // ── 导航列表 ──
  .nav-list {
    list-style: none;
    padding: 0 12px;
    flex: 1;
    position: relative;
    z-index: 1;

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 12px;
      height: 44px;
      margin-bottom: 2px;
      border-radius: var(--radius-md);
      color: oklch(78% 0.01 55 / 0.6);
      text-decoration: none;
      position: relative;
      transition: all var(--transition-fast);
      cursor: pointer;
      overflow: hidden;

      .nav-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        transition: transform var(--transition-spring);
      }

      .nav-label {
        font-size: 13.5px;
        font-weight: 450;
        letter-spacing: 1px;
        white-space: nowrap;
      }

      .nav-indicator {
        position: absolute;
        right: 8px;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: var(--cinnabar);
        opacity: 0;
        transition: opacity var(--transition-fast);
      }

      &:hover {
        color: var(--text-inverse);
        background: oklch(85% 0.01 55 / 0.06);

        .nav-icon {
          transform: scale(1.08);
        }
      }

      &.active {
        color: var(--text-inverse);
        background: linear-gradient(
          135deg,
          oklch(45% 0.15 28 / 0.25),
          oklch(45% 0.15 28 / 0.1)
        );

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 18px;
          background: var(--cinnabar);
          border-radius: 0 2px 2px 0;
        }

        .nav-icon {
          color: var(--cinnabar);
        }

        .nav-indicator {
          opacity: 1;
        }
      }
    }
  }

  // ── 底部山水 ──
  .sidebar-mountains {
    position: absolute;
    bottom: 32px;
    left: 0;
    right: 0;
    z-index: 0;
    color: var(--text-inverse);
    pointer-events: none;

    svg {
      width: 100%;
      height: auto;
    }
  }

  // ── 底部标语 ──
  .sidebar-footer {
    padding: 12px 16px 14px;
    text-align: center;
    position: relative;
    z-index: 1;
    border-top: 1px solid oklch(85% 0.01 55 / 0.06);

    span {
      font-size: 10px;
      color: oklch(70% 0.008 55 / 0.3);
      letter-spacing: 4px;
    }
  }
}

// ── 文字过渡 ──
.brand-fade-enter-active,
.brand-fade-leave-active {
  transition: all 0.2s var(--ease-out-quart);
  overflow: hidden;
}

.brand-fade-enter-from,
.brand-fade-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

.nav-text-enter-active,
.nav-text-leave-active {
  transition: all 0.15s ease;
  overflow: hidden;
}

.nav-text-enter-from,
.nav-text-leave-to {
  opacity: 0;
  transform: translateX(-6px);
}
</style>
