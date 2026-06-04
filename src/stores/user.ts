import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserInfo } from '@/types'
import { loginApi, logoutApi, getUserInfoApi } from '@/api'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<UserInfo | null>(null)

  // 设置 token
  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  // 登录
  const login = async (username: string, password: string) => {
    const res = await loginApi({ username, password })
    // 根据后端返回格式调整
    setToken(res.token)
    userInfo.value = res.userInfo
    return res
  }

  // 登出
  const logout = async () => {
    try {
      await logoutApi()
    } catch (error) {
      console.error('登出接口调用失败', error)
    } finally {
      token.value = ''
      userInfo.value = null
      localStorage.removeItem('token')
    }
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    const res = await getUserInfoApi()
    userInfo.value = res
    return res
  }

  return {
    token,
    userInfo,
    setToken,
    login,
    logout,
    fetchUserInfo
  }
})