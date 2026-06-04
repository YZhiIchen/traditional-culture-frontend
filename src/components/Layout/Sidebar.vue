<template>
  <div class="sidebar">
    <div class="logo-wrapper" :class="{ collapsed }">
      <div class="logo-icon">
        <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 4L4 14L24 24L44 14L24 4Z" stroke="currentColor" stroke-width="2" fill="none"/>
          <path d="M4 24L24 34L44 24" stroke="currentColor" stroke-width="2" fill="none"/>
          <path d="M4 34L24 44L44 34" stroke="currentColor" stroke-width="2" fill="none"/>
          <circle cx="24" cy="24" r="6" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
      </div>
      <span v-if="!collapsed" class="logo-text">文化数字化</span>
    </div>

    <el-menu
      :default-active="activeMenu"
      :collapse="collapsed"
      :collapse-transition="false"
      background-color="transparent"
      text-color="#b8c7ce"
      active-text-color="#ffd04b"
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
      
      <!-- 暂时注释掉历史记录和关于页面 -->
      <!--
      <el-sub-menu index="/history">
        <template #title>
          <el-icon><Document /></el-icon>
          <span>识别历史</span>
        </template>
        <el-menu-item index="/history/list">历史记录</el-menu-item>
        <el-menu-item index="/history/statistics">统计分析</el-menu-item>
      </el-sub-menu>
      -->
    </el-menu>
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
  
  .logo-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 0;
    gap: 12px;
    transition: all 0.3s;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    &.collapsed {
      padding: 20px 0;
      
      .logo-icon {
        transform: scale(0.9);
      }
    }
    
    .logo-icon {
      color: #ffd04b;
      transition: transform 0.3s;
    }
    
    .logo-text {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
      white-space: nowrap;
    }
  }
  
  :deep(.el-menu) {
    border-right: none;
    flex: 1;
    background-color: transparent;
    
    .el-menu-item {
      height: 50px;
      line-height: 50px;
      margin: 8px 12px;
      border-radius: 8px;
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      
      &.is-active {
        background: rgba(255, 208, 75, 0.2);
        color: #ffd04b;
      }
    }
  }
}
</style>