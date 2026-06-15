<template>
  <div class="profile">
    <!-- 页面标识 -->
    <div class="page-lead animate-fade-in-up">
      <div class="lead-badge">
        <span class="badge-line" />
        <span class="badge-text">个人中心</span>
        <span class="badge-line" />
      </div>
      <h1 class="lead-title">个人信息</h1>
      <p class="lead-desc">管理你的账户信息与偏好设置</p>
    </div>

    <!-- 非对称双栏 -->
    <div class="profile-grid">
      <!-- 左栏：用户头像 + 概览 -->
      <div class="profile-aside animate-fade-in-up delay-1">
        <div class="avatar-card">
          <div class="avatar-wrap">
            <span class="avatar-char">Y</span>
            <button class="avatar-edit" title="更换头像">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round"
                   stroke-linejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </button>
          </div>
          <h2 class="avatar-name">{{ localForm.nickname || 'YangZhi' }}</h2>
          <p class="avatar-role">@{{ localForm.username || 'yangzhi' }}</p>

          <div class="avatar-stats">
            <div class="stat">
              <span class="stat-num">12</span>
              <span class="stat-label">上传</span>
            </div>
            <div class="stat">
              <span class="stat-num">8</span>
              <span class="stat-label">识别</span>
            </div>
            <div class="stat">
              <span class="stat-num">3</span>
              <span class="stat-label">收藏</span>
            </div>
          </div>
        </div>

        <div class="info-card">
          <div class="info-row">
            <span class="info-k">注册时间</span>
            <span class="info-v">2026-06</span>
          </div>
          <div class="info-row">
            <span class="info-k">最后登录</span>
            <span class="info-v">{{ lastLogin }}</span>
          </div>
        </div>
      </div>

      <!-- 右栏：编辑表单 -->
      <div class="profile-main animate-fade-in-up delay-2">
        <div class="form-section">
          <div class="section-head">
            <span class="section-head-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                   stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <span>基本信息</span>
          </div>

          <div class="section-body">
            <el-form
              ref="formRef"
              :model="localForm"
              :rules="rules"
              label-position="top"
              class="profile-form"
            >
              <el-form-item label="昵称" prop="nickname">
                <div class="input-group">
                  <input v-model="localForm.nickname" placeholder="你的昵称" class="input-field" />
                </div>
              </el-form-item>

              <el-form-item label="用户名" prop="username">
                <div class="input-group">
                  <input v-model="localForm.username" placeholder="登录用户名" class="input-field" disabled />
                </div>
              </el-form-item>

              <el-form-item label="邮箱" prop="email">
                <div class="input-group">
                  <input v-model="localForm.email" placeholder="your@email.com" class="input-field" />
                </div>
              </el-form-item>

              <el-form-item label="个人简介" prop="bio">
                <div class="input-group textarea">
                  <textarea v-model="localForm.bio" placeholder="写一段简短的个人介绍…" class="input-field textarea-field" rows="4" />
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <!-- 密码修改 -->
        <div class="form-section">
          <div class="section-head">
            <span class="section-head-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                   stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <span>修改密码</span>
          </div>

          <div class="section-body">
            <el-form
              ref="pwdFormRef"
              :model="pwdForm"
              :rules="pwdRules"
              label-position="top"
              class="profile-form"
            >
              <el-form-item label="当前密码" prop="current">
                <div class="input-group">
                  <input v-model="pwdForm.current" type="password" placeholder="输入当前密码" class="input-field" />
                </div>
              </el-form-item>

              <el-form-item label="新密码" prop="newPwd">
                <div class="input-group">
                  <input v-model="pwdForm.newPwd" type="password" placeholder="6-20 位字符" class="input-field" />
                </div>
              </el-form-item>

              <el-form-item label="确认新密码" prop="confirm">
                <div class="input-group">
                  <input v-model="pwdForm.confirm" type="password" placeholder="再次输入新密码" class="input-field" />
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <button class="action-btn" :loading="saving" @click="saveProfile">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round"
                 stroke-linejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            {{ saving ? '保存中 …' : '保存修改' }}
          </button>
          <button class="ghost-btn" @click="resetProfile">取消</button>
          <button class="ghost-btn danger" @click="handleLogout">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                 stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            退出登录
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const formRef = ref<FormInstance>()
const pwdFormRef = ref<FormInstance>()
const saving = ref(false)

const lastLogin = new Date().toLocaleString('zh-CN')

const localForm = reactive({
  nickname: 'YangZhi',
  username: 'yangzhi',
  email: 'yangzhi@example.com',
  bio: '传统文化爱好者 · 数字传承践行者'
})

const rules: FormRules = {
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }]
}

const pwdForm = reactive({
  current: '',
  newPwd: '',
  confirm: ''
})

const validateNew = (_rule: any, value: string, callback: any) => {
  if (value && value.length < 6) {
    callback(new Error('至少 6 位字符'))
  } else {
    callback()
  }
}

const validateConfirm = (_rule: any, value: string, callback: any) => {
  if (value !== pwdForm.newPwd) {
    callback(new Error('两次密码不一致'))
  } else {
    callback()
  }
}

const pwdRules: FormRules = {
  current: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { validator: validateNew, trigger: 'blur' }
  ],
  confirm: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirm, trigger: 'blur' }
  ]
}

const saveProfile = async () => {
  if (!formRef.value || !pwdFormRef.value) return

  const okProfile = await formRef.value.validate().catch(() => false)
  const okPwd = await pwdFormRef.value.validate().catch(() => false)

  if (!okProfile || !okPwd) {
    ElMessage.warning('请检查表单填写')
    return
  }

  saving.value = true
  await new Promise((r) => setTimeout(r, 800))
  saving.value = false

  // 清空密码表单
  pwdForm.current = ''
  pwdForm.newPwd = ''
  pwdForm.confirm = ''

  ElMessage.success('个人信息已更新')
}

const resetProfile = () => {
  ElMessage.info('已重置')
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定退出登录？', '', {
      confirmButtonText: '退出',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    })
    localStorage.removeItem('token')
    ElMessage.success('已退出')
    router.push('/login')
  } catch {
    /* cancelled */
  }
}
</script>

<style scoped lang="scss">
// ═══════════════════════════════════════════
// 当代山水 · 个人中心
// ═══════════════════════════════════════════

.profile {
  // ── 页面引导 ──
  .page-lead {
    margin-bottom: var(--space-xl);

    .lead-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;

      .badge-line { width: 20px; height: 1px; background: var(--cinnabar); opacity: 0.3; }
      .badge-text { font-size: 11px; color: var(--cinnabar); letter-spacing: 3px; opacity: 0.7; }
    }

    .lead-title {
      font-family: var(--font-heading);
      font-size: clamp(22px, 3vw, 28px);
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: 4px;
    }

    .lead-desc {
      margin-top: 6px;
      font-size: 13px;
      color: var(--text-secondary);
    }
  }

  // ── 网格 ──
  .profile-grid {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: var(--space-lg);
    align-items: start;

    @media (max-width: 800px) {
      grid-template-columns: 1fr;
    }
  }

  // ── 左栏 ──
  .profile-aside {
    .avatar-card {
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-color);
      padding: var(--space-xl);
      text-align: center;
      box-shadow: var(--shadow-sm);
      margin-bottom: var(--space-md);

      .avatar-wrap {
        position: relative;
        display: inline-block;
        margin-bottom: 12px;

        .avatar-char {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--cinnabar), oklch(42% 0.14 28));
          color: #fff;
          font-size: 28px;
          font-weight: 700;
          font-family: var(--font-heading);
        }

        .avatar-edit {
          all: unset;
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: var(--bg-card-solid);
          border: 1.5px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
          box-shadow: var(--shadow-sm);

          &:hover {
            color: var(--cinnabar);
            border-color: var(--cinnabar);
          }
        }
      }

      .avatar-name {
        font-family: var(--font-heading);
        font-size: 18px;
        font-weight: 700;
        color: var(--text-primary);
        letter-spacing: 1px;
      }

      .avatar-role {
        font-size: 12px;
        color: var(--text-tertiary);
        margin-top: 4px;
        letter-spacing: 0.5px;
      }

      .avatar-stats {
        display: flex;
        justify-content: center;
        gap: 24px;
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid var(--border-light);

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;

          .stat-num {
            font-size: 18px;
            font-weight: 700;
            color: var(--text-primary);
            font-family: var(--font-heading);
          }

          .stat-label {
            font-size: 11px;
            color: var(--text-tertiary);
            letter-spacing: 1px;
          }
        }
      }
    }

    .info-card {
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-color);
      padding: var(--space-md) var(--space-lg);

      .info-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        font-size: 12px;

        &:not(:last-child) {
          border-bottom: 1px solid var(--border-light);
        }

        .info-k { color: var(--text-tertiary); }
        .info-v { color: var(--text-secondary); }
      }
    }
  }

  // ── 右栏 ──
  .profile-main {
    .form-section {
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-color);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      margin-bottom: var(--space-lg);

      .section-head {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 14px var(--space-lg);
        font-size: 14px;
        font-weight: 600;
        color: var(--text-primary);
        border-bottom: 1px solid var(--border-color);
        background: oklch(99% 0.002 55);

        [data-theme='dark'] & { background: oklch(14% 0.003 55); }

        .section-head-icon { color: var(--cinnabar); display: inline-flex; }
      }

      .section-body {
        padding: var(--space-lg);
      }
    }
  }

  // ── 表单 ──
  .profile-form {
    :deep(.el-form-item) { margin-bottom: 18px; }

    :deep(.el-form-item__label) {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
      padding-bottom: 4px;
    }

    :deep(.el-form-item__content) {
      width: 100%;
    }
  }

  .input-group {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 14px;
    height: 44px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: oklch(99% 0.002 55);
    transition: border-color var(--transition-fast);

    [data-theme='dark'] & { background: oklch(16% 0.003 55); }

    &:focus-within {
      border-color: var(--cinnabar);
      box-shadow: 0 0 0 2px oklch(50% 0.16 28 / 0.08);
    }

    &.textarea {
      height: auto;
      padding: 10px 14px;
    }

    .input-field {
      all: unset;
      flex: 1;
      font-size: 14px;
      color: var(--text-primary);
      font-family: var(--font-body);
      line-height: 1.4;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      &::placeholder { color: var(--text-placeholder); }

      &.textarea-field {
        resize: vertical;
        min-height: 80px;
        line-height: 1.6;
      }
    }
  }

  // ── 操作按钮 ──
  .form-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .action-btn {
    all: unset;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0 22px;
    height: 42px;
    font-size: 14px;
    letter-spacing: 1px;
    border-radius: var(--radius-md);
    background: linear-gradient(135deg, var(--cinnabar), oklch(42% 0.14 28));
    color: #fff;
    cursor: pointer;
    transition: all var(--transition-fast);
    font-family: var(--font-heading);

    svg { flex-shrink: 0; }

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px oklch(50% 0.16 28 / 0.2);
    }

    &:active { transform: translateY(0); }
  }

  .ghost-btn {
    all: unset;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0 16px;
    height: 42px;
    font-size: 13px;
    color: var(--text-secondary);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    border: 1px solid var(--border-color);

    svg { flex-shrink: 0; }

    &:hover {
      color: var(--text-regular);
      border-color: var(--ink-400);
      background: oklch(50% 0.16 28 / 0.03);
    }

    &.danger {
      color: var(--cinnabar);
      border-color: oklch(50% 0.16 28 / 0.2);

      &:hover { background: oklch(50% 0.16 28 / 0.06); }
    }
  }
}

// ── 动画 ──
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
