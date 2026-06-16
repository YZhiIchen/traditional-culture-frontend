import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'  // 导入路由

class Request {
  private instance: AxiosInstance
  private isRedirecting = false  // 防止重复跳转

  constructor() {
    this.instance = axios.create({
      baseURL: '/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const { code, message, data } = response.data
        
        if (code === 200 || code === 0) {
          return data
        } else if (code === 401) {
          // ✅ 修复：使用 router.push 而不是 window.location.href
          if (!this.isRedirecting) {
            this.isRedirecting = true
            localStorage.removeItem('token')
            ElMessage.error('登录已过期，请重新登录')
            router.push('/login')
            setTimeout(() => {
              this.isRedirecting = false
            }, 3000)
          }
          return Promise.reject(new Error(message))
        } else {
          ElMessage.error(message || '请求失败')
          return Promise.reject(new Error(message || '请求失败'))
        }
      },
      (error) => {
        const status = error.response?.status
        const respData = error.response?.data

        // 提取真实错误信息
        let errMsg = ''
        if (respData) {
          if (typeof respData === 'string') {
            errMsg = respData
          } else if (respData.message) {
            errMsg = respData.message  // 后端统一 {code, message, data} 格式
          } else if (respData.detail) {
            // Pydantic 验证错误: {"detail": [{"msg": "..."}, ...]}
            const details = Array.isArray(respData.detail) ? respData.detail : [respData.detail]
            errMsg = details.map((d: any) => d.msg || d).join('；')
          }
        }
        if (!errMsg) errMsg = error.message || '请求失败'

        if (status === 401) {
          if (!this.isRedirecting) {
            this.isRedirecting = true
            localStorage.removeItem('token')
            ElMessage.error('登录已过期，请重新登录')
            router.push('/login')
            setTimeout(() => { this.isRedirecting = false }, 3000)
          }
        } else if (error.code === 'ECONNABORTED') {
          ElMessage.error('请求超时，请稍后重试')
        } else if (error.message?.includes('Network Error')) {
          ElMessage.error('网络连接失败')
        } else {
          ElMessage.error(errMsg)
        }
        return Promise.reject(new Error(errMsg))
      }
    )
  }

  get<T = any>(url: string, params?: any): Promise<T> {
    return this.instance.get(url, { params })
  }

  post<T = any>(url: string, data?: any): Promise<T> {
    return this.instance.post(url, data)
  }

  put<T = any>(url: string, data?: any): Promise<T> {
    return this.instance.put(url, data)
  }

  delete<T = any>(url: string, params?: any): Promise<T> {
    return this.instance.delete(url, { params })
  }

  upload<T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)
    return this.instance.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(percent)
        }
      }
    })
  }
}

export default new Request()