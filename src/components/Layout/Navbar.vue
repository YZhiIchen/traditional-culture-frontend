<template>
  <div class="navbar">
    <div class="navbar-left">
      <!-- 折叠按钮 -->
      <button class="fold-btn" @click="$emit('toggle-sidebar')" title="切换侧栏">
        <span class="fold-icon" :class="{ rotated: collapsed }">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </span>
      </button>

      <!-- 面包屑 + 中式装饰 -->
      <div class="breadcrumb-area">
        <span class="breadcrumb-ornament">◆</span>
        <el-breadcrumb separator="·">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>

    <div class="navbar-right">
      <!-- 主题切换 -->
      <button class="action-btn" @click="toggleTheme" title="切换主题">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <template v-if="isDark">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </template>
          <template v-else>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </template>
        </svg>
      </button>

      <!-- 用户信息 -->
      <el-dropdown @command="handleCommand" trigger="click">
        <div class="user-info">
          <div class="user-avatar">
            <span>Y</span>
          </div>
          <span class="username">YangZhi</span>
          <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              个人信息
            </el-dropdown-item>
            <el-dropdown-item command="logout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
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
import { ArrowDown, User, SwitchButton } from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/app'
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
const { theme } = storeToRefs(appStore)

const isDark = computed(() => theme.value === 'dark')

const currentTitle = computed(() => {
  const title = route.meta.title as string
  return title || `${route.path.replace('/', '') || '控制台'}`
})

const toggleTheme = () => {
  const newTheme = isDark.value ? 'light' : 'dark'
  appStore.setTheme(newTheme)
  ElMessage.success(newTheme === 'dark' ? '已切换暗色主题' : '已切换亮色主题')
}

const handleCommand = async (command: string) => {
  if (command === 'logout') {
    try {
      await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      })
      localStorage.removeItem('token')
      ElMessage.success('已退出登录')
      router.push('/login')
    } catch {
      // 用户取消
    }
  } else if (command === 'profile') {
    ElMessage.info('个人信息开发中')
  }
}
</script>

<style scoped lang="scss">
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
  backdrop-filter: blur(12px);
  background: var(--bg-header);
  border-bottom: 1px solid var(--border-color);
  position: relative;

  // 底部装饰线
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 20px;
    right: 20px;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold-light), transparent);
    opacity: 0.3;
  }

  .navbar-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .fold-btn {
      all: unset;
      cursor: pointer;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-md);
      transition: all var(--transition-normal);
      color: var(--text-secondary);

      &:hover {
        background: rgba(194, 59, 34, 0.08);
        color: var(--cinnabar);
      }

      .fold-icon {
        display: flex;
        transition: transform var(--transition-spring);

        &.rotated {
          transform: rotate(90deg);
        }
      }
    }

    .breadcrumb-area {
      display: flex;
      align-items: center;
      gap: 10px;

      .breadcrumb-ornament {
        font-size: 6px;
        color: var(--cinnabar);
        opacity: 0.5;
      }

      :deep(.el-breadcrumb) {
        font-size: 13px;

        .el-breadcrumb__inner {
          color: var(--text-secondary);
        }

        .el-breadcrumb__inner.is-link {
          font-weight: 500;
          color: var(--text-regular);

          &:hover {
            color: var(--cinnabar);
          }
        }

        .el-breadcrumb__separator {
          color: var(--ink-300);
          font-weight: 300;
        }
      }
    }
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 8px;

    .action-btn {
      all: unset;
      cursor: pointer;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-md);
      transition: all var(--transition-normal);
      color: var(--text-secondary);

      &:hover {
        background: rgba(194, 59, 34, 0.08);
        color: var(--cinnabar);
        transform: rotate(45deg);
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 4px 12px 4px 4px;
      border-radius: 24px;
      transition: all var(--transition-normal);

      &:hover {
        background: rgba(194, 59, 34, 0.06);
      }

      .user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--cinnabar), #8b2f1a);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 13px;
        font-weight: 600;
        font-family: var(--font-heading);
        letter-spacing: 2px;
        flex-shrink: 0;
      }

      .username {
        font-size: 13px;
        color: var(--text-regular);
        font-weight: 500;
      }

      .dropdown-icon {
        font-size: 12px;
        color: var(--text-secondary);
        transition: transform var(--transition-fast);
      }
    }

    // Dropdown hover 旋转箭头
    .el-dropdown:focus-within .dropdown-icon {
      transform: rotate(180deg);
    }
  }
}
</style>
