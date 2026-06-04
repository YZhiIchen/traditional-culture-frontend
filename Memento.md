
---

# 传统文化数字化平台 - 后端接入修改指南

> 本文档用于提醒您在开发后端后，需要修改的前端文件位置和内容。

## 📋 目录

- [一、需要修改的核心文件](#一需要修改的核心文件)
- [二、配置文件修改](#二配置文件修改)
- [三、API 接口文件修改](#三api-接口文件修改)
- [四、Store 状态管理修改](#四store-状态管理修改)
- [五、页面组件修改](#五页面组件修改)
- [六、类型定义补充](#六类型定义补充)
- [七、环境变量配置](#七环境变量配置)
- [八、后端对接检查清单](#八后端对接检查清单)

---

## 一、需要修改的核心文件

| 序号 | 文件路径 | 修改原因 | 优先级 |
|------|----------|----------|--------|
| 1 | `vite.config.ts` | 配置后端代理地址 | ⭐⭐⭐ |
| 2 | `.env.development` | 环境变量配置 | ⭐⭐⭐ |
| 3 | `src/utils/request.ts` | 响应拦截器状态码 | ⭐⭐⭐ |
| 4 | `src/api/auth.ts` | 登录接口路径 | ⭐⭐⭐ |
| 5 | `src/api/upload.ts` | 上传接口路径 | ⭐⭐⭐ |
| 6 | `src/api/recognition.ts` | 识别结果接口路径 | ⭐⭐⭐ |
| 7 | `src/api/search.ts` | 搜索接口路径 | ⭐⭐⭐ |
| 8 | `src/stores/user.ts` | 登录逻辑和token处理 | ⭐⭐⭐ |
| 9 | `src/views/Login/index.vue` | 登录逻辑 | ⭐⭐⭐ |
| 10 | `src/views/Upload/index.vue` | 上传和识别逻辑 | ⭐⭐ |
| 11 | `src/views/RecognitionResult/index.vue` | 结果获取逻辑 | ⭐⭐ |
| 12 | `src/views/Search/index.vue` | 搜索逻辑 | ⭐⭐ |
| 13 | `src/types/index.ts` | 类型定义补充 | ⭐ |

---

## 二、配置文件修改

### 📁 `vite.config.ts`

```typescript
// 需要修改的位置：proxy.target
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',  // ⚠️ 改为你的后端地址
      changeOrigin: true,
      // 如果后端接口没有 /api 前缀，取消注释下面这行
      // rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

### 📁 `.env.development`（新建）

```bash
# 新建此文件
VITE_API_BASE_URL=/api
VITE_API_TARGET=http://localhost:8080
VITE_REQUEST_TIMEOUT=30000
```

### 📁 `.env.production`（新建）

```bash
# 生产环境配置
VITE_API_BASE_URL=https://your-backend-domain.com/api
VITE_REQUEST_TIMEOUT=30000
```

---

## 三、API 接口文件修改

### 📁 `src/utils/request.ts`

```typescript
// ⚠️ 重点修改：响应拦截器中的状态码判断

// 当前代码（模拟版本）
if (code === 200 || code === 0) {
  return data
}

// 需要根据后端实际返回码修改，例如：
if (code === 200 || code === 0 || code === 10000) {  // ⚠️ 修改为后端实际成功码
  return data
}

// 未授权状态码（当前是401）
if (code === 401) {  // ⚠️ 确认后端未授权状态码
  localStorage.removeItem('token')
  window.location.href = '#/login'
  ElMessage.error('登录已过期，请重新登录')
  return Promise.reject(new Error(message))
}
```

### 📁 `src/api/auth.ts`

```typescript
// ⚠️ 需要修改接口路径

// 当前代码
export const loginApi = (data: LoginForm) => {
  return request.post('/auth/login', data)  // ⚠️ 改为后端实际路径
}

export const logoutApi = () => {
  return request.post('/auth/logout')  // ⚠️ 改为后端实际路径
}

export const getUserInfoApi = () => {
  return request.get('/user/info')  // ⚠️ 改为后端实际路径
}
```

### 📁 `src/api/upload.ts`

```typescript
// ⚠️ 需要修改接口路径

// 当前代码
export const uploadFileApi = (file: File, onProgress?: (progress: number) => void) => {
  return request.upload('/upload', file, onProgress)  // ⚠️ 改为后端实际路径
}

export const uploadTextApi = (content: string, title: string) => {
  return request.post('/upload/text', { content, title })  // ⚠️ 改为后端实际路径
}
```

### 📁 `src/api/recognition.ts`

```typescript
// ⚠️ 需要修改接口路径

// 当前代码
export const getRecognitionResultApi = (id: string) => {
  return request.get(`/recognition/result/${id}`)  // ⚠️ 改为后端实际路径
}

export const getRecognitionHistoryApi = (params: { page: number; pageSize: number }) => {
  return request.get('/recognition/history', params)  // ⚠️ 改为后端实际路径
}
```

### 📁 `src/api/search.ts`

```typescript
// ⚠️ 需要修改接口路径

// 当前代码
export const searchApi = (params: SearchParams) => {
  return request.get('/search', params)  // ⚠️ 改为后端实际路径
}

export const getDetailApi = (id: string) => {
  return request.get(`/detail/${id}`)  // ⚠️ 改为后端实际路径
}
```

---

## 四、Store 状态管理修改

### 📁 `src/stores/user.ts`

```typescript
// ⚠️ 重点修改：登录返回数据格式

// 当前代码
const login = async (username: string, password: string) => {
  const res = await loginApi({ username, password })
  // ⚠️ 根据后端实际返回格式修改
  setToken(res.token)           // 可能 res.data.token 或 res.accessToken
  userInfo.value = res.userInfo // 可能 res.data.user 或 res.user
  return res
}

// 可能的修改示例1（返回数据包在 data 中）
const res = await loginApi({ username, password })
setToken(res.data.token)
userInfo.value = res.data.userInfo

// 可能的修改示例2（直接返回数据）
const res = await loginApi({ username, password })
setToken(res.accessToken)
userInfo.value = res.user

// 可能的修改示例3（嵌套较深）
const res = await loginApi({ username, password })
setToken(res.result.token)
userInfo.value = res.result.user
```

---

## 五、页面组件修改

### 📁 `src/views/Login/index.vue`

```typescript
// 当前使用模拟登录，需要改为真实接口

// ⚠️ 修改 handleLogin 函数
const handleLogin = async () => {
  // ... 表单验证代码保持不变 ...
  
  try {
    // 当前代码（模拟）
    // localStorage.setItem('token', 'mock-token-' + Date.now())
    
    // ⚠️ 改为调用真实接口
    await userStore.login(loginForm.username, loginForm.password)
    
    ElMessage.success('登录成功！')
    router.push('/upload')
  } catch (error: any) {
    ElMessage.error(error.message || '登录失败')
  }
}
```

### 📁 `src/views/Upload/index.vue`

```typescript
// ⚠️ 修改上传和识别逻辑

// 当前代码（模拟）
const uploadImage = async () => {
  uploadLoading.value = true
  setTimeout(() => {
    resultId.value = 'mock-id-' + Date.now()
    resultDialogVisible.value = true
    uploadLoading.value = false
  }, 1500)
}

// ⚠️ 改为真实上传
const uploadImage = async () => {
  if (!currentFile.value) return
  
  uploadLoading.value = true
  try {
    // 调用真实上传接口
    const res = await uploadFileApi(currentFile.value, (progress) => {
      console.log(`上传进度: ${progress}%`)
    })
    
    // 获取识别结果（可能需要轮询）
    const result = await getRecognitionResultApi(res.id)
    resultId.value = result.id
    resultDialogVisible.value = true
    
    ElMessage.success('上传并识别成功')
  } catch (error) {
    ElMessage.error('上传失败，请重试')
  } finally {
    uploadLoading.value = false
    clearImage()
  }
}
```

### 📁 `src/views/RecognitionResult/index.vue`

```typescript
// ⚠️ 修改数据获取方式

// 当前代码
const fetchData = async () => {
  const id = route.params.id as string
  // 模拟数据
  resultData.value = mockData
}

// ⚠️ 改为真实接口
const fetchData = async () => {
  const id = route.params.id as string
  if (!id) return

  loading.value = true
  try {
    const res = await getRecognitionResultApi(id)
    resultData.value = res  // ⚠️ 根据实际返回格式调整
  } catch (error) {
    ElMessage.error('获取识别结果失败')
  } finally {
    loading.value = false
  }
}
```

### 📁 `src/views/Search/index.vue`

```typescript
// ⚠️ 修改搜索逻辑

// 当前代码（模拟）
const handleSearch = async () => {
  loading.value = true
  setTimeout(() => {
    results.value = mockResults
    loading.value = false
  }, 500)
}

// ⚠️ 改为真实搜索
const handleSearch = async () => {
  if (!searchForm.keyword.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }

  loading.value = true
  try {
    const res = await searchApi(searchForm)
    searchResults.value = res.list  // ⚠️ 根据实际返回格式调整
    total.value = res.total
    hasSearched.value = true
  } catch (error) {
    ElMessage.error('搜索失败，请重试')
  } finally {
    loading.value = false
  }
}
```

---

## 六、类型定义补充

### 📁 `src/types/index.ts`

```typescript
// 根据后端实际返回格式补充或修改类型定义

// 登录响应示例
export interface LoginResponse {
  token: string
  userInfo: UserInfo
  // 可能还有其他字段
}

// API 响应格式（根据后端实际调整）
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  // 可能是这种格式
  // status: number
  // msg: string
  // result: T
}

// 分页响应
export interface PageResponse<T> {
  list: T[]
  total: number
  pageNum?: number
  pageSize?: number
}
```

---

## 七、环境变量配置

### 使用环境变量（可选）

**修改 `src/utils/request.ts`：**

```typescript
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: Number(import.meta.env.VITE_REQUEST_TIMEOUT) || 30000,
})
```

---

## 八、后端对接检查清单

### ✅ 对接前确认

- [ ] 后端服务已启动并可以访问
- [ ] 已获取后端接口文档（Swagger/Postman）
- [ ] 已确认后端接口的返回数据格式
- [ ] 已确认认证方式（JWT / Session / OAuth）

### ✅ 配置文件修改

- [ ] `vite.config.ts` 中的代理地址已修改
- [ ] 环境变量文件已创建并配置

### ✅ 接口路径修改

- [ ] `auth.ts` - 登录/登出/用户信息接口
- [ ] `upload.ts` - 上传文件/文本接口
- [ ] `recognition.ts` - 识别结果/历史接口
- [ ] `search.ts` - 搜索/详情接口

### ✅ 数据处理修改

- [ ] `request.ts` - 响应拦截器状态码
- [ ] `user.ts` - 登录返回数据处理
- [ ] 各页面组件的真实接口调用

### ✅ 功能测试

- [ ] 登录功能正常
- [ ] Token 存储和携带正常
- [ ] Token 过期自动跳转登录
- [ ] 文件上传功能正常
- [ ] 识别结果获取正常
- [ ] 搜索功能正常
- [ ] 登出功能正常

### ✅ 错误处理

- [ ] 网络错误提示
- [ ] 超时错误提示
- [ ] 401/403 权限错误处理
- [ ] 500 服务器错误处理

---

## 📝 常见后端返回格式示例

### 格式1：标准 RESTful

```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```

### 格式2：简单返回

```json
{
  "status": 0,
  "msg": "ok",
  "result": { ... }
}
```

### 格式3：直接返回数据

```json
{
  "token": "xxx",
  "user": { ... }
}
```

### 根据格式修改 request.ts

```typescript
// 格式1 处理
if (code === 200) return data

// 格式2 处理
if (status === 0) return result

// 格式3 处理
return response.data  // 直接返回
```

---

## 🔗 快速修改索引

```bash
# 需要修改的完整文件列表
src/utils/request.ts          # 响应拦截器
src/api/auth.ts              # 登录接口路径
src/api/upload.ts            # 上传接口路径
src/api/recognition.ts       # 识别接口路径
src/api/search.ts            # 搜索接口路径
src/stores/user.ts           # 登录逻辑
src/views/Login/index.vue    # 登录页面
src/views/Upload/index.vue   # 上传页面
src/views/Search/index.vue   # 搜索页面
vite.config.ts               # 代理配置
```

---

**创建日期：** 2026-06-04

**提醒：** 开发后端后，按照本文档逐项修改即可完成前后端对接。
