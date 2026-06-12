<template>
  <div class="login-page">
    <!-- 墨色背景层 -->
    <div class="login-bg">
      <!-- 远山层（CSS clip-path） -->
      <div class="mountain-layer mountain-back" />
      <div class="mountain-layer mountain-mid" />
      <div class="mountain-layer mountain-front" />

      <!-- 云层 -->
      <div class="cloud cloud-1" />
      <div class="cloud cloud-2" />
      <div class="cloud cloud-3" />

      <!-- 飞鸟装饰 -->
      <div class="bird bird-1">⟐</div>
      <div class="bird bird-2">⟐</div>
      <div class="bird bird-3">⟐</div>
    </div>

    <!-- 登录卡片 -->
    <div class="login-card-wrapper animate-fade-in">
      <div class="login-card">
        <!-- 卡片顶部印章 -->
        <div class="card-seal">
          <span>传</span>
          <span>承</span>
        </div>

        <!-- 标题区域 -->
        <div class="card-header">
          <h1 class="title">
            <span class="title-char" v-for="(char, i) in '传统文化'" :key="i" :style="{ animationDelay: `${i * 0.08}s` }">{{ char }}</span>
          </h1>
          <h1 class="title title-sub">
            <span class="title-char" v-for="(char, i) in '数字化平台'" :key="i" :style="{ animationDelay: `${(i + 4) * 0.08}s` }">{{ char }}</span>
          </h1>
          <p class="subtitle">传承经典 · 智享文化</p>
        </div>

        <!-- 表单区域 -->
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="用户名"
              :prefix-icon="User"
              size="large"
              clearable
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
              :prefix-icon="Lock"
              size="large"
              show-password
              clearable
            />
          </el-form-item>

          <el-button
            type="primary"
            size="large"
            class="login-btn"
            :loading="loading"
            @click="handleLogin"
          >
            <span class="btn-text">{{ loading ? '登 录 中...' : '登  录' }}</span>
          </el-button>

          <div class="login-footer">
            <div class="divider-area">
              <span class="divider-line" />
              <span class="divider-text">测试账号</span>
              <span class="divider-line" />
            </div>
            <div class="test-accounts">
              <span
                class="test-account"
                @click="fillTestAccount('admin', '123456')"
              >
                admin
              </span>
              <span class="test-sep">/</span>
              <span
                class="test-account"
                @click="fillTestAccount('user', '123456')"
              >
                user
              </span>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const loginFormRef = ref<FormInstance>()

const loginForm = reactive({
  username: '',
  password: ''
})

const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3到20个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6到20个字符之间', trigger: 'blur' }
  ]
}

const loading = ref(false)

const fillTestAccount = (username: string, password: string) => {
  loginForm.username = username
  loginForm.password = password
  ElMessage.success(`已填充账号: ${username}`)
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true

    try {
      await new Promise(resolve => setTimeout(resolve, 800))

      if (loginForm.username && loginForm.password) {
        localStorage.setItem('token', 'mock-token-' + Date.now())
        ElMessage.success('登录成功！')
        router.push('/upload')
      } else {
        ElMessage.error('请输入用户名和密码')
      }
    } catch (error: any) {
      ElMessage.error(error.message || '登录失败')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped lang="scss">
// ═══════════════════════════════════════════
// 水墨山水登录页
// ═══════════════════════════════════════════

.login-page {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    #e8e0d0 0%,    // 宣纸黄
    #d5ceb8 30%,   // 淡赭
    #c4bda6 60%,   // 远山
    #2c1810 100%   // 墨底
  );
}

// ── 背景层 ──
.login-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

// ── 远山（CSS clip-path）──
.mountain-layer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
}

.mountain-back {
  height: 55%;
  background: linear-gradient(180deg, transparent 0%, rgba(44, 24, 16, 0.08) 40%, rgba(44, 24, 16, 0.15) 100%);
  clip-path: polygon(
    0% 100%,
    0% 60%,
    5% 55%, 10% 45%, 15% 40%, 20% 42%, 25% 35%, 30% 38%, 35% 30%, 40% 28%,
    45% 32%, 50% 25%, 55% 30%, 60% 22%, 65% 28%, 70% 20%, 75% 25%, 80% 18%,
    85% 22%, 90% 15%, 95% 20%, 100% 12%,
    100% 100%
  );
  opacity: 0.25;
  animation: mountainDrift 20s ease-in-out infinite;
}

.mountain-mid {
  height: 45%;
  background: linear-gradient(180deg, transparent 0%, rgba(44, 24, 16, 0.12) 30%, rgba(44, 24, 16, 0.25) 100%);
  clip-path: polygon(
    0% 100%,
    0% 70%,
    8% 65%, 15% 55%, 22% 58%, 28% 48%, 35% 52%, 42% 42%, 48% 45%,
    55% 38%, 62% 42%, 68% 32%, 75% 38%, 82% 28%, 88% 35%, 95% 22%, 100% 28%,
    100% 100%
  );
  opacity: 0.35;
  animation: mountainDrift 25s ease-in-out infinite reverse;
}

.mountain-front {
  height: 35%;
  background: linear-gradient(180deg, transparent 0%, rgba(44, 24, 16, 0.25) 20%, rgba(44, 24, 16, 0.4) 100%);
  clip-path: polygon(
    0% 100%,
    0% 80%,
    6% 75%, 12% 68%, 18% 72%, 24% 62%, 30% 68%, 36% 58%, 42% 62%,
    48% 52%, 54% 58%, 60% 48%, 66% 55%, 72% 42%, 78% 50%, 84% 38%,
    90% 45%, 96% 32%, 100% 38%,
    100% 100%
  );
  opacity: 0.5;
  animation: mountainDrift 30s ease-in-out infinite;
}

@keyframes mountainDrift {
  0%, 100% { transform: translateX(0) scaleX(1); }
  50% { transform: translateX(-1%) scaleX(1.01); }
}

// ── 云层 ──
.cloud {
  position: absolute;
  z-index: 2;
  border-radius: 50%;
  filter: blur(20px);
}

.cloud-1 {
  top: 15%;
  left: 10%;
  width: 180px;
  height: 60px;
  background: rgba(245, 240, 232, 0.06);
  animation: cloudFloat 30s ease-in-out infinite;
}

.cloud-2 {
  top: 25%;
  right: 15%;
  width: 240px;
  height: 50px;
  background: rgba(245, 240, 232, 0.04);
  animation: cloudFloat 35s ease-in-out infinite reverse;
}

.cloud-3 {
  top: 8%;
  left: 50%;
  width: 160px;
  height: 40px;
  background: rgba(245, 240, 232, 0.05);
  animation: cloudFloat 25s ease-in-out infinite 5s;
}

@keyframes cloudFloat {
  0%, 100% { transform: translateX(0) translateY(0); }
  25% { transform: translateX(20px) translateY(-8px); }
  50% { transform: translateX(10px) translateY(-4px); }
  75% { transform: translateX(30px) translateY(4px); }
}

// ── 飞鸟装饰 ──
.bird {
  position: absolute;
  z-index: 2;
  font-size: 14px;
  color: rgba(44, 24, 16, 0.08);
  animation: birdFly 12s ease-in-out infinite;
}

.bird-1 {
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.bird-2 {
  top: 15%;
  left: 60%;
  animation-delay: 4s;
  font-size: 10px;
}

.bird-3 {
  top: 28%;
  left: 40%;
  animation-delay: 8s;
  font-size: 12px;
}

@keyframes birdFly {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.08;
  }
  25% {
    transform: translate(30px, -15px) scale(1.1);
    opacity: 0.12;
  }
  50% {
    transform: translate(60px, 5px) scale(0.95);
    opacity: 0.06;
  }
  75% {
    transform: translate(90px, -10px) scale(1.05);
    opacity: 0.1;
  }
}

// ═══════════════════════════════════════════
// 登录卡片
// ═══════════════════════════════════════════

.login-card-wrapper {
  position: relative;
  z-index: 10;
  animation: fadeIn 0.6s ease 0.2s both;
}

.login-card {
  width: 420px;
  max-width: 92vw;
  padding: 48px 40px 36px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-xl, 16px);
  box-shadow:
    0 24px 80px rgba(44, 24, 16, 0.2),
    0 0 0 1px rgba(44, 24, 16, 0.06);
  position: relative;
  overflow: hidden;

  // 宣纸纹理覆盖
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    border-radius: inherit;
    pointer-events: none;
  }

  // ── 卡片印章（左上角）──
  .card-seal {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 6px 4px;
    border: 1.5px solid var(--cinnabar);
    border-radius: 3px;
    transform: rotate(3deg);
    opacity: 0.6;

    span {
      font-family: var(--font-heading);
      font-size: 11px;
      line-height: 1;
      color: var(--cinnabar);
      writing-mode: vertical-rl;
      letter-spacing: 2px;
    }
  }

  // ── 标题 ──
  .card-header {
    text-align: center;
    margin-bottom: 36px;
    position: relative;
    z-index: 1;

    .title {
      font-family: var(--font-heading);
      font-size: 28px;
      font-weight: 700;
      color: var(--ink-900);
      margin: 0;
      line-height: 1.4;
      display: flex;
      justify-content: center;
      gap: 2px;

      &.title-sub {
        font-size: 22px;
        color: var(--ink-700);
        margin-top: 4px;
      }

      .title-char {
        display: inline-block;
        animation: charAppear 0.4s ease both;
      }
    }

    .subtitle {
      margin-top: 12px;
      font-size: 13px;
      color: var(--ink-400);
      letter-spacing: 6px;
    }
  }

  // ── 表单 ──
  .login-form {
    position: relative;
    z-index: 1;

    :deep(.el-input__wrapper) {
      background: rgba(245, 240, 232, 0.5);
      border: 1px solid var(--border-color);
      box-shadow: none !important;
      border-radius: var(--radius-md);
      transition: all var(--transition-normal);
      padding: 4px 12px;

      &:hover {
        border-color: var(--ink-300);
      }

      &.is-focus {
        border-color: var(--cinnabar);
        background: rgba(194, 59, 34, 0.03);

        .el-input__prefix {
          color: var(--cinnabar);
        }
      }

      .el-input__prefix {
        color: var(--ink-300);
        transition: color var(--transition-fast);
      }
    }

    .el-form-item {
      margin-bottom: 22px;
    }

    .login-btn {
      width: 100%;
      height: 46px;
      font-size: 16px;
      letter-spacing: 8px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, var(--cinnabar), #8b2f1a);
      border: none;
      position: relative;
      overflow: hidden;
      transition: all var(--transition-normal);

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
        transition: left 0.5s ease;
      }

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 16px rgba(194, 59, 34, 0.3);

        &::after {
          left: 100%;
        }
      }

      &:active {
        transform: translateY(0);
      }

      .btn-text {
        position: relative;
        z-index: 1;
      }
    }

    // ── 底部测试账号 ──
    .login-footer {
      margin-top: 28px;
      text-align: center;

      .divider-area {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;

        .divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--border-color), transparent);
        }

        .divider-text {
          font-size: 11px;
          color: var(--ink-300);
          white-space: nowrap;
          letter-spacing: 1px;
        }
      }

      .test-accounts {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;

        .test-account {
          font-size: 12px;
          color: var(--ink-400);
          cursor: pointer;
          padding: 4px 12px;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          transition: all var(--transition-normal);

          &:hover {
            color: var(--cinnabar);
            border-color: var(--cinnabar);
            background: rgba(194, 59, 34, 0.04);
          }
        }

        .test-sep {
          color: var(--ink-300);
          font-size: 12px;
        }
      }
    }
  }
}

// ── 逐字进场动画 ──
@keyframes charAppear {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
