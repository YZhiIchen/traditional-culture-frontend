<template>
  <div class="admin">
    <div class="page-lead animate-fade-in-up">
      <div class="lead-badge">
        <span class="badge-line" />
        <span class="badge-text">管理 · 用户</span>
        <span class="badge-line" />
      </div>
      <h1 class="lead-title">用户管理</h1>
      <p class="lead-desc">查看和管理平台注册用户</p>
    </div>

    <div class="admin-card animate-fade-in-up delay-1">
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
  .page-lead {
    margin-bottom: var(--space-lg);

    .lead-badge {
      display: flex; align-items: center; gap: 8px; margin-bottom: 8px;
      .badge-line { width: 20px; height: 1px; background: var(--cinnabar); opacity: 0.3; }
      .badge-text { font-size: 11px; color: var(--cinnabar); letter-spacing: 3px; opacity: 0.7; }
    }
    .lead-title { font-family: var(--font-heading); font-size: clamp(22px,3vw,28px); font-weight: 700; color: var(--text-primary); letter-spacing: 4px; }
    .lead-desc { margin-top: 6px; font-size: 13px; color: var(--text-secondary); }
  }

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
