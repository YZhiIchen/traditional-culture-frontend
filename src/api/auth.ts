import request from '@/utils/request'
import type { LoginForm, UserInfo } from '@/types'

// 登录接口
export const loginApi = (data: LoginForm) => {
  // 根据后端实际接口路径修改
  return request.post<{ token: string; userInfo: UserInfo }>('/auth/login', data)
}

// 注册接口
export const registerApi = (data: { username: string; password: string; nickname: string }) => {
  return request.post('/auth/register', data)
}

// 登出接口
export const logoutApi = () => {
  return request.post('/auth/logout')
}

// 恢复已注销账号
export const reactivateApi = (data: LoginForm) => {
  return request.post<{ token: string; userInfo: UserInfo }>('/user/reactivate', data)
}

// 获取用户信息
export const getUserInfoApi = () => {
  return request.get<UserInfo>('/user/info')
}