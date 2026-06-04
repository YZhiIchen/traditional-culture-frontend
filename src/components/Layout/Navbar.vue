<template>
  <div class="navbar">
    <div class="navbar-left">
      <el-icon class="fold-icon" @click="$emit('toggle-sidebar')">
        <Fold />
      </el-icon>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="navbar-right">
      <el-dropdown @command="handleCommand">
        <div class="user-info">
          <el-avatar :size="32">用</el-avatar>
          <span class="username">测试用户</span>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
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
import { Fold, ArrowDown, SwitchButton } from '@element-plus/icons-vue'

defineProps<{
  collapsed?: boolean
}>()

defineEmits<{
  (e: 'toggle-sidebar'): void
}>()

const route = useRoute()
const router = useRouter()

const currentTitle = computed(() => {
  const title = route.meta.title as string
  return title || route.path
})

const handleCommand = async (command: string) => {
  if (command === 'logout') {
    try {
      await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      localStorage.removeItem('token')
      ElMessage.success('已退出登录')
      router.push('/login')
    } catch (error) {
      // 用户取消
    }
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
  
  .navbar-left {
    display: flex;
    align-items: center;
    gap: 20px;
    
    .fold-icon {
      font-size: 20px;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        color: #409eff;
      }
    }
  }
  
  .navbar-right {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 20px;
      transition: background 0.3s;
      
      &:hover {
        background: #f0f2f5;
      }
      
      .username {
        font-size: 14px;
        color: #333;
      }
    }
  }
}
</style>