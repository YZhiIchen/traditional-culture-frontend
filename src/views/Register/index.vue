<template>
  <div class="register">
    <!-- ↓↓↓ 远山氛围层 ↓↓↓ -->
    <div class="reg-atmosphere">
      <svg class="mountain mountain-back" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice">
        <path d="M0 400V250 Q180 210 280 230 Q380 250 480 210 Q580 170 680 200 Q780 230 880 180 Q980 130 1080 170 Q1180 210 1280 160 Q1380 110 1440 140V400Z"
              fill="currentColor" />
      </svg>
      <svg class="mountain mountain-mid" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice">
        <path d="M0 400V280 Q200 230 320 250 Q440 270 560 220 Q680 170 800 210 Q920 250 1040 190 Q1160 130 1280 180 Q1360 210 1440 170V400Z"
              fill="currentColor" />
      </svg>
      <svg class="mountain mountain-front" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice">
        <path d="M0 400V320 Q160 270 280 290 Q400 310 520 260 Q640 210 760 250 Q880 290 1000 230 Q1120 170 1240 220 Q1320 250 1440 210V400Z"
              fill="currentColor" />
      </svg>
    </div>

    <!-- 注册面板 -->
    <div class="reg-panel">
      <!-- 印章 -->
      <div class="panel-seal">
        <span>注</span>
        <span>册</span>
      </div>

      <!-- 标题 -->
      <div class="panel-header">
        <h1 class="panel-title">加入平台</h1>
        <p class="panel-motto">开启传统文化数字化之旅</p>
      </div>

      <!-- 表单 -->
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        class="reg-form"
        @submit.prevent="handleRegister"
      >
        <el-form-item prop="nickname">
          <div class="input-group">
            <span class="input-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                   stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input v-model="form.nickname" placeholder="昵称" class="input-field" autocomplete="name" />
          </div>
        </el-form-item>

        <el-form-item prop="username">
          <div class="input-group">
            <span class="input-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                   stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input v-model="form.username" placeholder="用户名" class="input-field" autocomplete="username" />
          </div>
        </el-form-item>

        <el-form-item prop="password">
          <div class="input-group">
            <span class="input-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                   stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input v-model="form.password" :type="showPwd.password ? 'text' : 'password'" placeholder="密码" class="input-field" autocomplete="off" />
            <span
              class="pwd-toggle"
              @mousedown.prevent="showPwd.password = true"
              @mouseup="showPwd.password = false"
              @mouseleave="showPwd.password = false"
              title="按住查看密码"
            >
              <svg v-if="!showPwd.password" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </span>
          </div>
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <div class="input-group">
            <span class="input-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                   stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input v-model="form.confirmPassword" :type="showPwd.confirm ? 'text' : 'password'" placeholder="确认密码" class="input-field" autocomplete="off" />
            <span
              class="pwd-toggle"
              @mousedown.prevent="showPwd.confirm = true"
              @mouseup="showPwd.confirm = false"
              @mouseleave="showPwd.confirm = false"
              title="按住查看密码"
            >
              <svg v-if="!showPwd.confirm" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </span>
          </div>
        </el-form-item>

        <button
          type="submit"
          class="submit-btn"
          :class="{ loading: submitting }"
          :disabled="submitting"
        >
          <span v-if="!submitting">注 册</span>
          <span v-else>注 册 中 …</span>
        </button>

        <div class="login-hint">
          已有账号？<router-link to="/login" class="login-link">去登录</router-link>
        </div>
      </el-form>
    </div>

    <p class="reg-copy">传统文化数字化平台 © 2026</p>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { registerApi } from '@/api/auth'

const router = useRouter()
const formRef = ref<FormInstance>()

const form = reactive({
  nickname: '',
  username: '',
  password: '',
  confirmPassword: ''
})

const showPwd = reactive({
  password: false,
  confirm: false
})

const validatePass2 = (_rule: any, value: string, callback: any) => {
  if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules: FormRules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '2-20 个字符', trigger: 'blur' }
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '3-20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '6-20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validatePass2, trigger: 'blur' }
  ]
}

const submitting = ref(false)

const handleRegister = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (ok) => {
    if (!ok) return
    submitting.value = true

    try {
      await registerApi({
        username: form.username,
        password: form.password,
        nickname: form.nickname
      })
      ElMessage.success('注册成功，请登录')
      router.push('/login')
    } catch (e: any) {
      ElMessage.error(e.message || '注册失败')
    } finally {
      submitting.value = false
    }
  })
}
</script>

<style scoped lang="scss">
// ═══════════════════════════════════════════
// 当代山水 · 注册页
// ═══════════════════════════════════════════

.register {
  width: 100%;
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background:
    linear-gradient(
      180deg,
      oklch(92% 0.015 75 / 0.92) 0%,
      oklch(88% 0.01 60 / 0.92) 35%,
      oklch(82% 0.008 50 / 0.92) 65%,
      oklch(16% 0.03 30 / 0.95) 100%
    ),
    url('/images/hero-home.jpg') center bottom / cover no-repeat;
}

[data-theme='dark'] .register {
  background:
    linear-gradient(
      180deg,
      oklch(12% 0.005 55 / 0.92) 0%,
      oklch(10% 0.01 40 / 0.92) 50%,
      oklch(8% 0.015 30 / 0.95) 100%
    ),
    url('/images/hero-home.jpg') center bottom / cover no-repeat;
}

.reg-atmosphere {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;

  .mountain {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 55%;
    color: oklch(45% 0.02 55);
    opacity: 0.08;

    &.mountain-mid { height: 45%; color: oklch(40% 0.015 45); opacity: 0.12; }
    &.mountain-front { height: 35%; color: oklch(35% 0.02 35); opacity: 0.18; }
  }

  [data-theme='dark'] .mountain {
    opacity: 0.12;
    color: oklch(70% 0.01 55);
  }
}

.reg-panel {
  position: relative;
  z-index: 10;
  width: 420px;
  max-width: 90vw;
  padding: 40px 36px 32px;
  background: oklch(99% 0.002 55 / 0.88);
  backdrop-filter: blur(24px);
  border-radius: var(--radius-xl);
  box-shadow:
    0 24px 80px oklch(12% 0.02 55 / 0.15),
    0 0 0 1px oklch(80% 0.005 55 / 0.2);
  animation: panelRise 0.6s var(--ease-out-expo) 0.15s both;

  [data-theme='dark'] & {
    background: oklch(16% 0.003 55 / 0.88);
    box-shadow:
      0 24px 64px rgba(0, 0, 0, 0.5),
      0 0 0 1px oklch(30% 0.005 55 / 0.3);
  }
}

@keyframes panelRise {
  from { opacity: 0; transform: translateY(24px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

// ── 印章 ──
.panel-seal {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  padding: 5px 3px;
  border: 1.5px solid var(--cinnabar);
  border-radius: 3px;
  transform: rotate(4deg);
  opacity: 0.5;

  span {
    font-family: var(--font-heading);
    font-size: 10px;
    line-height: 1;
    color: var(--cinnabar);
    writing-mode: vertical-rl;
    letter-spacing: 2px;
  }
}

// ── 标题 ──
.panel-header {
  text-align: center;
  margin-bottom: 28px;

  .panel-title {
    font-family: var(--font-heading);
    font-size: 24px;
    font-weight: 700;
    color: var(--ink-900);
    margin: 0;
    letter-spacing: 6px;

    [data-theme='dark'] & { color: var(--text-inverse); }
  }

  .panel-motto {
    margin-top: 8px;
    font-size: 12px;
    color: var(--text-tertiary);
    letter-spacing: 4px;
  }
}

// ── 表单 ──
.reg-form {
  position: relative;
  z-index: 1;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  height: 46px;
  width: 100%;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: oklch(99% 0.002 55);
  transition: all var(--transition-fast);

  [data-theme='dark'] & { background: oklch(18% 0.003 55); }

  &:focus-within {
    border-color: var(--cinnabar);
    box-shadow: 0 0 0 2px oklch(50% 0.16 28 / 0.08);

    .input-icon { color: var(--cinnabar); }
  }

  .input-icon {
    display: flex;
    color: var(--text-tertiary);
    transition: color var(--transition-fast);
    flex-shrink: 0;
  }

  .input-field {
    all: unset;
    flex: 1;
    font-size: 16px;
    color: var(--text-primary);
    font-family: var(--font-body);
    line-height: 1;

    &::placeholder {
      color: var(--text-placeholder);
      font-weight: 400;
    }
  }
}

:deep(.el-form-item) {
  margin-bottom: 18px;

  .el-form-item__content { width: 100%; }
}

// ── 提交按钮 ──
.submit-btn {
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 46px;
  font-size: 15px;
  letter-spacing: 8px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--cinnabar), oklch(42% 0.14 28));
  color: #fff;
  font-family: var(--font-heading);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all var(--transition-fast);

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, oklch(100% 0 0 / 0.15), transparent);
    transition: left 0.5s ease;
  }

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px oklch(50% 0.16 28 / 0.3);

    &::after { left: 100%; }
  }

  &:active:not(:disabled) { transform: translateY(0); }
  &:disabled { opacity: 0.7; cursor: not-allowed; }
  &.loading { letter-spacing: 4px; }
}

// ── 登录引导 ──
.login-hint {
  margin-top: 20px;
  text-align: center;
  font-size: 13px;
  color: var(--text-tertiary);

  .login-link {
    color: var(--cinnabar);
    text-decoration: none;
    font-weight: 500;
    transition: opacity var(--transition-fast);

    &:hover { opacity: 0.7; }
  }
}

// ── 版权 ──
.reg-copy {
  position: absolute;
  bottom: 24px;
  z-index: 10;
  font-size: 11px;
  color: oklch(70% 0.008 55 / 0.4);
  letter-spacing: 2px;
}
</style>