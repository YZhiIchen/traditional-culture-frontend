<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>传统文化数字化平台</h1>
        <p>传承经典 · 智享文化</p>
      </div>

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
          {{ loading ? '登录中...' : '登 录' }}
        </el-button>

        <div class="login-footer">
          <el-divider>
            <span class="divider-text">测试账号（点击填充）</span>
          </el-divider>
          <div class="test-accounts">
            <el-tag 
              size="small" 
              @click="fillTestAccount('admin', '123456')"
              style="cursor: pointer; margin: 0 4px"
            >
              admin / 123456
            </el-tag>
            <el-tag 
              size="small" 
              @click="fillTestAccount('user', '123456')"
              style="cursor: pointer; margin: 0 4px"
            >
              user / 123456
            </el-tag>
          </div>
        </div>
      </el-form>
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

// 填充测试账号
const fillTestAccount = (username: string, password: string) => {
  loginForm.username = username
  loginForm.password = password
  ElMessage.success(`已填充账号: ${username}`)
}

// 登录处理
const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true

    try {
      // 模拟登录请求（暂时使用模拟数据，后续对接真实后端）
      // 实际使用时替换为：await userStore.login(loginForm.username, loginForm.password)
      
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟登录成功
      if (loginForm.username && loginForm.password) {
        localStorage.setItem('token', 'mock-token-' + Date.now())
        ElMessage.success('登录成功！欢迎回来')
        router.push('/upload')
      } else {
        ElMessage.error('请输入用户名和密码')
      }
    } catch (error: any) {
      console.error('登录失败:', error)
      ElMessage.error(error.message || '登录失败，请检查用户名和密码')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped lang="scss">
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 450px;
  max-width: 90%;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 0.5s ease;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
  
  h1 {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
  }
  
  p {
    font-size: 14px;
    color: #999;
  }
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
}

.login-footer {
  margin-top: 32px;
  
  .divider-text {
    font-size: 12px;
    color: #999;
  }
  
  .test-accounts {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 16px;
    
    .el-tag {
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        transform: translateY(-2px);
        background: #667eea;
        color: white;
        border-color: #667eea;
      }
    }
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>