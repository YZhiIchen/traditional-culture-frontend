<template>
  <div class="login">
    <!-- ↓↓↓ 远山氛围层 ↓↓↓ -->
    <div class="login-atmosphere">
      <!-- 远山剪影 -->
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

      <!-- 飞鸟装饰 -->
      <span class="bird b1">❋</span>
      <span class="bird b2">❋</span>
      <span class="bird b3">❋</span>
    </div>

    <!-- ↓↓↓ 登录面板 ↓↓↓ -->
    <div class="login-panel">
      <!-- 印章 -->
      <div class="panel-seal">
        <span>传</span>
        <span>承</span>
      </div>

      <!-- 标题 -->
      <div class="panel-header">
        <h1 class="panel-title">
          <span class="title-char" v-for="(c, i) in '传统文化'" :key="'a' + i"
                :style="{ animationDelay: `${i * 0.07}s` }">{{ c }}</span>
        </h1>
        <h1 class="panel-title panel-sub">
          <span class="title-char" v-for="(c, i) in '数字化平台'" :key="'b' + i"
                :style="{ animationDelay: `${(i + 4) * 0.07}s` }">{{ c }}</span>
        </h1>
        <p class="panel-motto">传承经典 · 智享文化</p>
      </div>

      <!-- 表单 -->
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <div class="input-group">
            <span class="input-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input
              v-model="form.username"
              placeholder="用户名"
              class="input-field"
              autocomplete="username"
            />
          </div>
        </el-form-item>

        <el-form-item prop="password">
          <div class="input-group">
            <span class="input-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input
              v-model="form.password"
              type="password"
              placeholder="密码"
              class="input-field"
              autocomplete="current-password"
            />
          </div>
        </el-form-item>

        <button
          type="submit"
          class="submit-btn"
          :class="{ loading: submitting }"
          :disabled="submitting"
        >
          <span v-if="!submitting">登 录</span>
          <span v-else>登 录 中 …</span>
        </button>

        <!-- 注册引导 -->
        <div class="register-hint">
          没有账号？<router-link to="/register" class="register-link">去注册</router-link>
        </div>

        <!-- 测试账号 -->
        <div class="test-area">
          <div class="test-divider">
            <span class="test-line" />
            <span class="test-label">测试账号</span>
            <span class="test-line" />
          </div>
          <div class="test-list">
            <button class="test-pill" @click="fill('admin', '123456')">
              admin
            </button>
            <span class="test-dot">·</span>
            <button class="test-pill" @click="fill('user', '123456')">
              user
            </button>
          </div>
        </div>
      </el-form>
    </div>

    <!-- 版权 -->
    <p class="login-copy">传统文化数字化平台 © 2026</p>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const formRef = ref<FormInstance>()

const form = reactive({
  username: '',
  password: ''
})

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '3-20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '6-20 个字符', trigger: 'blur' }
  ]
}

const submitting = ref(false)

const fill = (u: string, p: string) => {
  form.username = u
  form.password = p
  ElMessage.success(`已填充: ${u}`)
}

const handleLogin = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (ok) => {
    if (!ok) return
    submitting.value = true

    try {
      await new Promise((r) => setTimeout(r, 800))

      if (form.username && form.password) {
        localStorage.setItem('token', 'mock-' + Date.now())
        ElMessage.success('登录成功')
        router.push('/home')
      } else {
        ElMessage.error('请填写完整')
      }
    } catch (e: any) {
      ElMessage.error(e.message || '登录失败')
    } finally {
      submitting.value = false
    }
  })
}
</script>

<style scoped lang="scss">
// ═══════════════════════════════════════════
// 当代山水 · 登录页
// ═══════════════════════════════════════════

.login {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    oklch(92% 0.015 75) 0%,     // 宣纸暖黄
    oklch(88% 0.01 60) 35%,      // 淡赭
    oklch(82% 0.008 50) 65%,     // 远山
    oklch(16% 0.03 30) 100%      // 墨底
  );
}

[data-theme='dark'] .login {
  background: linear-gradient(
    180deg,
    oklch(12% 0.005 55) 0%,
    oklch(10% 0.01 40) 50%,
    oklch(8% 0.015 30) 100%
  );
}

// ── 天空氛围层 ──
.login-atmosphere {
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

    &.mountain-mid {
      height: 45%;
      color: oklch(40% 0.015 45);
      opacity: 0.12;
    }

    &.mountain-front {
      height: 35%;
      color: oklch(35% 0.02 35);
      opacity: 0.18;
    }
  }

  [data-theme='dark'] .mountain {
    opacity: 0.12;
    color: oklch(70% 0.01 55);
  }

  // 飞鸟
  .bird {
    position: absolute;
    z-index: 1;
    font-size: 12px;
    color: oklch(45% 0.02 55);
    opacity: 0.06;
    animation: birdFloat 14s ease-in-out infinite;

    &.b1 { top: 18%; left: 22%; animation-delay: 0s; }
    &.b2 { top: 14%; left: 60%; animation-delay: 4.5s; font-size: 9px; }
    &.b3 { top: 26%; left: 42%; animation-delay: 9s; font-size: 11px; }
  }

  [data-theme='dark'] .bird {
    color: oklch(80% 0.01 55);
  }
}

@keyframes birdFloat {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.06; }
  25%  { transform: translate(25px, -12px) scale(1.08); opacity: 0.1; }
  50%  { transform: translate(50px, 4px) scale(0.95); opacity: 0.04; }
  75%  { transform: translate(75px, -8px) scale(1.04); opacity: 0.08; }
}

// ═══════════════════════════════════════════
// 登录面板
// ═══════════════════════════════════════════

.login-panel {
  position: relative;
  z-index: 10;
  width: 400px;
  max-width: 90vw;
  padding: 44px 36px 32px;
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
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
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
  margin-bottom: 32px;

  .panel-title {
    font-family: var(--font-heading);
    font-size: 26px;
    font-weight: 700;
    color: var(--ink-900);
    margin: 0;
    line-height: 1.4;
    display: flex;
    justify-content: center;
    gap: 2px;

    &.panel-sub {
      font-size: 20px;
      color: var(--ink-700);
      margin-top: 2px;
    }

    [data-theme='dark'] & {
      color: var(--text-inverse);
    }

    [data-theme='dark'] &.panel-sub {
      color: oklch(78% 0.008 55);
    }

    .title-char {
      display: inline-block;
      animation: charPop 0.35s var(--ease-out-expo) both;
    }
  }

  .panel-motto {
    margin-top: 10px;
    font-size: 12px;
    color: var(--text-tertiary);
    letter-spacing: 6px;
  }
}

@keyframes charPop {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

// ── 表单 ──
.login-form {
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

  [data-theme='dark'] & {
    background: oklch(18% 0.003 55);
  }

  &:focus-within {
    border-color: var(--cinnabar);
    box-shadow: 0 0 0 2px oklch(50% 0.16 28 / 0.08);

    .input-icon {
      color: var(--cinnabar);
    }
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
    font-size: 14px;
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
  margin-bottom: 20px;

  .el-form-item__content {
    width: 100%;
  }
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
    background: linear-gradient(
      90deg,
      transparent,
      oklch(100% 0 0 / 0.15),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px oklch(50% 0.16 28 / 0.3);

    &::after {
      left: 100%;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &.loading {
    letter-spacing: 4px;
  }
}

// ── 注册引导 ──
.register-hint {
  margin-top: 24px;
  text-align: center;
  font-size: 13px;
  color: var(--text-tertiary);

  .register-link {
    color: var(--cinnabar);
    text-decoration: none;
    font-weight: 500;
    transition: opacity var(--transition-fast);

    &:hover {
      opacity: 0.7;
    }
  }
}

// ── 测试账号 ──
.test-area {
  margin-top: 20px;
  text-align: center;

  .test-divider {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;

    .test-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        var(--border-color),
        transparent
      );
    }

    .test-label {
      font-size: 10px;
      color: var(--text-tertiary);
      white-space: nowrap;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
  }

  .test-list {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    .test-pill {
      all: unset;
      font-size: 11px;
      color: var(--text-secondary);
      padding: 3px 14px;
      border-radius: var(--radius-full);
      border: 1px solid var(--border-color);
      cursor: pointer;
      transition: all var(--transition-fast);
      font-family: var(--font-body);

      &:hover {
        color: var(--cinnabar);
        border-color: var(--cinnabar);
        background: oklch(50% 0.16 28 / 0.04);
      }
    }

    .test-dot {
      color: var(--text-tertiary);
      font-size: 8px;
    }
  }
}

// ── 版权 ──
.login-copy {
  position: absolute;
  bottom: 24px;
  z-index: 10;
  font-size: 11px;
  color: oklch(70% 0.008 55 / 0.4);
  letter-spacing: 2px;
}
</style>
