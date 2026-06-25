<template>
  <div class="admin">
    <div class="page-hero" v-reveal="{ delay: 0 }">
      <img src="/images/bg-admin.jpg" alt="" class="page-hero-bg" />
      <div class="page-hero-overlay" />
      <div class="page-hero-content">
        <div class="hero-badge">
          <span class="hero-badge-line" />
          <span class="hero-badge-text">管理 · 用户</span>
          <span class="hero-badge-line" />
        </div>
        <h1 class="hero-title">用户管理</h1>
        <p class="hero-desc">查看和管理平台注册用户</p>
      </div>
    </div>

    <div class="admin-card" v-reveal="{ delay: 80 }">
      <table class="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>昵称</th>
            <th>角色</th>
            <th>邮箱</th>
            <th>注册时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td>{{ u.id }}</td>
            <td>{{ u.username }}</td>
            <td>{{ u.nickname }}</td>
            <td><span class="role-badge" :class="u.role">{{ u.role }}</span></td>
            <td>{{ u.email || '—' }}</td>
            <td>{{ u.created_at ? new Date(u.created_at).toLocaleDateString('zh-CN') : '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="loading" class="admin-loading">加载中…</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

interface User {
  id: number; username: string; nickname: string
  role: string; email?: string; created_at?: string
}

const users = ref<User[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res: any = await request.get('/user/list')
    users.value = res || []
  } catch (e: any) {
    ElMessage.error(e.message || '加载失败')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.admin {
  .admin-card {
    background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-xl);
    overflow: hidden; box-shadow: var(--shadow-sm);
  }

  .user-table {
    width: 100%; border-collapse: collapse; font-size: 13px;

    th {
      text-align: left; padding: 12px var(--space-lg); background: oklch(99% 0.002 55);
      color: var(--text-secondary); font-weight: 600; letter-spacing: 0.5px;
      border-bottom: 1px solid var(--border-color);
    }

    td { padding: 10px var(--space-lg); color: var(--text-regular); border-bottom: 1px solid var(--border-light); }

    tr:hover td { background: oklch(50% 0.16 28 / 0.03); }

    .role-badge {
      font-size: 11px; padding: 1px 10px; border-radius: var(--radius-full);
      font-weight: 500;
      &.admin { background: oklch(50% 0.16 28 / 0.1); color: var(--cinnabar); }
      &.user { background: var(--border-light); color: var(--text-secondary); }
      &.researcher { background: oklch(52% 0.07 250 / 0.1); color: var(--azure); }
    }
  }

  .admin-loading { text-align: center; padding: var(--space-2xl); color: var(--text-secondary); font-size: 14px; }
}
</style>
