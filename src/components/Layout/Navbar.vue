<template>
  <div class="navbar">
    <div class="navbar-left">
      <!-- 折叠触发 -->
      <button
        class="toggle-btn"
        @click="$emit('toggle-sidebar')"
        aria-label="切换侧栏"
      >
        <span class="toggle-bar" :class="{ rotated: collapsed }">
          <span class="bar bar-1" />
          <span class="bar bar-2" />
          <span class="bar bar-3" />
        </span>
      </button>

      <!-- 页码标识 -->
      <div class="page-indicator">
        <span class="page-dot">◆</span>
        <span class="page-title">{{ currentTitle }}</span>
      </div>
    </div>

    <div class="navbar-right">
      <!-- 主题切换 -->
      <el-dropdown @command="handleThemeCommand" trigger="click">
        <button
          class="icon-btn"
          :class="{ 'is-system': isSystem }"
          :title="themeLabel"
          aria-label="切换主题"
        >
          <!-- 系统模式 -->
          <svg v-if="isSystem" width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
               stroke-linejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <!-- 暗色模式 -->
          <svg v-else-if="isDark" width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
               stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          <!-- 亮色模式 -->
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
               stroke-linejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="light" :class="{ 'is-active': theme === 'light' }">
              <span class="theme-option">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                亮色
              </span>
            </el-dropdown-item>
            <el-dropdown-item command="dark" :class="{ 'is-active': theme === 'dark' }">
              <span class="theme-option">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                暗色
              </span>
            </el-dropdown-item>
            <el-dropdown-item command="system" :class="{ 'is-active': theme === 'system' }">
              <span class="theme-option">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                跟随系统
              </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 用户 -->
      <el-dropdown @command="handleCommand" trigger="click">
        <div class="user-chip" tabindex="0" role="button" aria-label="用户菜单">
          <img v-if="userStore.userInfo?.avatar" :src="userStore.userInfo.avatar" class="user-avatar-img" />
          <span v-else class="user-avatar">{{ userAvatar }}</span>
          <span class="user-name">{{ userName }}</span>
          <svg class="user-chevron" width="10" height="10" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2.5"
               stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <template #default>
                <span class="dropdown-item-inner">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                       stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  个人信息
                </span>
              </template>
            </el-dropdown-item>
            <el-dropdown-item command="logout" divided>
              <template #default>
                <span class="dropdown-item-inner dropdown-item-danger">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                       stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  退出登录
                </span>
              </template>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAppStore, type ThemeMode } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

defineProps<{
  collapsed?: boolean
}>()

defineEmits<{
  (e: 'toggle-sidebar'): void
}>()

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()
const { theme } = storeToRefs(appStore)

// 注意：computed 不能通过 storeToRefs 提取，需直接访问 store
const isDark = computed(() => appStore.effectiveTheme === 'dark')
const isSystem = computed(() => theme.value === 'system')

const themeLabel = computed(() => {
  const labels: Record<ThemeMode, string> = {
    light: '已设亮色',
    dark: '已设暗色',
    system: '跟随系统'
  }
  return labels[theme.value]
})

const currentTitle = computed(() => {
  const title = route.meta.title as string
  return title || route.path.replace('/', '') || '控制台'
})

const userAvatar = computed(() => {
  return userStore.userInfo?.nickname?.[0]?.toUpperCase() || 'U'
})

const userName = computed(() => {
  return userStore.userInfo?.nickname || userStore.userInfo?.username || '用户'
})

const handleThemeCommand = (cmd: ThemeMode) => {
  appStore.setTheme(cmd)
  const msgs: Record<ThemeMode, string> = {
    light: '已切换亮色主题',
    dark: '已切换暗色主题',
    system: '已设为跟随系统'
  }
  ElMessage.success(msgs[cmd])
}

const handleCommand = async (cmd: string) => {
  if (cmd === 'logout') {
    try {
      await ElMessageBox.confirm('确定退出登录？', '', {
        confirmButtonText: '退出',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      })
      // 调用后端登出接口，使当前会话失效（单点登录）
      await userStore.logout()
      ElMessage.success('已退出')
      router.push('/login')
    } catch {
      /* cancelled */
    }
  } else if (cmd === 'profile') {
    router.push('/profile')
  }
}
</script>

<style scoped lang="scss">
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 var(--space-xl);
  background: var(--bg-header);
  border-bottom: 1px solid var(--border-color);

  .navbar-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  // ── 折叠按钮 ──
  .toggle-btn {
    all: unset;
    cursor: pointer;
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-md);
    transition: background var(--transition-fast);
    color: var(--text-secondary);

    &:hover {
      background: oklch(50% 0.16 28 / 0.06);
      color: var(--cinnabar);
    }
  }

  .toggle-bar {
    display: flex;
    flex-direction: column;
    gap: 4px;
    transition: transform var(--transition-spring);

    &.rotated {
      transform: rotate(90deg);
    }

    .bar {
      display: block;
      width: 16px;
      height: 1.5px;
      background: currentColor;
      border-radius: 1px;
      transition: all var(--transition-fast);
    }
  }

  // ── 页码 ──
  .page-indicator {
    display: flex;
    align-items: center;
    gap: 10px;

    .page-dot {
      font-size: 6px;
      color: var(--cinnabar);
      opacity: 0.45;
    }

    .page-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
      letter-spacing: 1px;
    }
  }

  // ── 右侧 ──
  .navbar-right {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .icon-btn {
    all: unset;
    cursor: pointer;
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
    color: var(--text-secondary);

    &:hover {
      background: oklch(50% 0.16 28 / 0.06);
      color: var(--cinnabar);
      transform: rotate(45deg);
    }

    &.is-system {
      color: var(--azure);

      &:hover {
        color: var(--cinnabar);
      }
    }
  }

  // ── 用户芯片 ──
  .user-chip {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 3px 12px 3px 4px;
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: background var(--transition-fast);
    outline: none;

    &:hover,
    &:focus-visible {
      background: oklch(50% 0.16 28 / 0.06);
    }

    .user-avatar-img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      object-fit: cover;
    }

    .user-avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--cinnabar), oklch(40% 0.14 28));
      color: #fff;
      font-size: 12px;
      font-weight: 600;
      font-family: var(--font-heading);
      letter-spacing: 1px;
    }

    .user-name {
      font-size: 13px;
      color: var(--text-regular);
      font-weight: 500;
    }

    .user-chevron {
      color: var(--text-tertiary);
    }
  }
}

// ── Dropdown 样式补丁 ──
:deep(.dropdown-item-inner) {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;

  svg {
    opacity: 0.65;
  }
}

:deep(.dropdown-item-danger) {
  color: var(--cinnabar);
}

// ── 主题下拉选项 ──
.theme-option {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  white-space: nowrap;

  svg {
    opacity: 0.55;
    flex-shrink: 0;
  }
}

:deep(.el-dropdown-menu__item.is-active) {
  color: var(--cinnabar);
  font-weight: 600;

  .theme-option svg {
    opacity: 1;
  }
}

// ═══════════════════════════════════════
// 移动端适配 — 压缩顶栏
// ═══════════════════════════════════════
@media (max-width: 768px) {
  .navbar {
    padding: 0 var(--space-md);

    .navbar-left {
      gap: 8px;
    }

    .toggle-btn {
      width: 40px;
      height: 40px;
    }

    .page-indicator {
      gap: 6px;

      .page-dot {
        font-size: 5px;
      }

      .page-title {
        font-size: 13px;
        letter-spacing: 0.5px;
        max-width: 120px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .navbar-right {
      gap: 4px;
    }

    .icon-btn {
      width: 40px;
      height: 40px;

      &:hover {
        transform: none;
      }
    }

    .user-chip {
      padding: 2px;

      .user-name,
      .user-chevron {
        display: none;
      }
    }
  }
}
</style>
