<template>
  <div class="test-api">
    <h2>后端连接测试</h2>
    
    <el-card>
      <template #header>
        <span>测试登录接口</span>
      </template>
      <el-input v-model="username" placeholder="用户名" style="width: 200px; margin-right: 10px" />
      <el-input v-model="password" type="password" placeholder="密码" style="width: 200px; margin-right: 10px" />
      <el-button type="primary" @click="testLogin">测试登录</el-button>
      <div v-if="loginResult">{{ loginResult }}</div>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>测试 GET 请求</span>
      </template>
      <el-button @click="testGet">测试 /api/test</el-button>
      <div v-if="getResult">{{ getResult }}</div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'

const username = ref('admin')
const password = ref('123456')
const loginResult = ref('')
const getResult = ref('')

const testLogin = async () => {
  try {
    const res = await request.post('/auth/login', {
      username: username.value,
      password: password.value
    })
    loginResult.value = JSON.stringify(res, null, 2)
    ElMessage.success('登录接口调用成功')
  } catch (error: any) {
    loginResult.value = error.message
    ElMessage.error('调用失败: ' + error.message)
  }
}

const testGet = async () => {
  try {
    const res = await request.get('/test')
    getResult.value = JSON.stringify(res, null, 2)
    ElMessage.success('GET 请求成功')
  } catch (error: any) {
    getResult.value = error.message
    ElMessage.error('请求失败: ' + error.message)
  }
}
</script>