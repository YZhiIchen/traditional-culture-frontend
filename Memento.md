# 传统文化数字化平台 — 后端接入修改指南

> 本文档逐一标注需要改为真实 API 调用的具体文件和代码位置  
> 最后更新：2026-06-15

---

## 📖 目录

- [一、项目文件结构速览](#一项目文件结构速览)
- [二、配置文件修改](#二配置文件修改)
- [三、API 层修改](#三api-层修改)
- [四、页面组件修改](#四页面组件修改)
- [五、Store 层修改](#五store-层修改)
- [六、类型定义调整](#六类型定义调整)
- [七、空文件待实现清单](#七空文件待实现清单)
- [八、完整修改索引（按优先级）](#八完整修改索引按优先级)
- [九、后端对接检查清单](#九后端对接检查清单)

---

## 一、项目文件结构速览

```
D:/traditional-culture-frontend/
│
├── vite.config.ts                    ← ③ 后端代理地址
├── .env.development                  ← ③ 环境变量
│
├── src/
│   ├── utils/
│   │   ├── request.ts                ← ② 响应状态码适配
│   │   └── validate.ts               ← ⚠️ 空文件
│   │
│   ├── api/
│   │   ├── auth.ts                   ← ① 接口路径
│   │   ├── upload.ts                 ← ① 接口路径
│   │   ├── recognition.ts            ← ① 接口路径
│   │   ├── search.ts                 ← ① 接口路径
│   │   └── index.ts                  ← 统一导出（无需改）
│   │
│   ├── stores/
│   │   ├── user.ts                   ← ② 返回数据字段适配
│   │   └── app.ts                    ← 无需改
│   │
│   ├── types/
│   │   └── index.ts                  ← ① 类型对齐后端
│   │
│   ├── views/
│   │   ├── Home/index.vue           ← ① 改数据加载（统计/最近识别）
│   │   ├── Login/index.vue           ← ① 改 handleLogin()
│   │   ├── Register/index.vue        ← ① 改 handleRegister() + 新建 API
│   │   ├── Upload/index.vue          ← ① 改 recognizeImage() + submitText()
│   │   ├── Search/index.vue          ← ① 改 handleSearch()
│   │   ├── RecognitionResult/index.vue ← ① 改 fetchData()
│   │   ├── History/index.vue         ← ① 改列表/分页/删除 API 调用
│   │   ├── Explore/index.vue         ← ① 改推荐/词云/图谱 API 调用
│   │   └── Profile/index.vue         ← ① 改数据加载 + saveProfile()
│   │
│   └── components/
│       ├── ErrorTip.vue              ← ⚠️ 空文件，待实现
│       └── Loading.vue               ← ⚠️ 空文件，待实现
```

> ① = 核心修改（页面逻辑） | ② = 中间层适配 | ③ = 配置层

---

## 二、配置文件修改

### 📁 `vite.config.ts`

**修改位置：第 14 行 `target`**

```typescript
// 当前值：
proxy: {
  '/api': {
    target: 'http://localhost:8080',  // ← 改这里
    changeOrigin: true,
  }
}

// 改为你的后端地址，例如：
target: 'http://192.168.1.100:8080',  // 开发环境后端 IP
// 或
target: 'http://localhost:3001',       // 本地后端端口
```

### 📁 `.env.development`

**当前内容：**
```bash
VITE_APP_TITLE=传统文化数字化平台
```

**建议补充：**
```bash
VITE_APP_TITLE=传统文化数字化平台
VITE_API_BASE_URL=/api
VITE_API_TARGET=http://localhost:8080    ← 与 vite.config.ts 保持一致
VITE_REQUEST_TIMEOUT=30000
```

---

## 三、API 层修改

### 📁 `src/utils/request.ts`

**修改点 1：响应成功码（第 42 行）**

```typescript
// 当前代码：
if (code === 200 || code === 0) {
  return data
}

// 根据后端实际格式修改，常见示例：
// 如果后端返回 code: 10000 表示成功：
if (code === 200 || code === 0 || code === 10000) {
  return data
}
// 如果后端返回 status: 0 表示成功：
if (code === 200 || code === 0 || response.data.status === 0) {
  return response.data.result
}
```

**修改点 2：未授权状态码（第 45 行 + 第 61 行）**

```typescript
// 确认后端 401/403 的实际状态码，当前两处都用了 401
} else if (code === 401) {
  // ...
}
```

### 📁 `src/api/auth.ts` — 认证接口

**当前文件完整内容 → 需要改的地方：**

```typescript
import request from '@/utils/request'
import type { LoginForm, UserInfo } from '@/types'

// ── 登录（路径确认）──
export const loginApi = (data: LoginForm) => {
  return request.post<{ token: string; userInfo: UserInfo }>(
    '/auth/login',        // ← 改为后端实际路径，如 '/user/login'
    data
  )
}

// ── 登出（路径确认）──
export const logoutApi = () => {
  return request.post('/auth/logout')  // ← 改为后端实际路径
}

// ── 获取用户信息（路径确认）──
export const getUserInfoApi = () => {
  return request.get<UserInfo>('/user/info')  // ← 改为后端实际路径，如 '/user/profile'
}

// ── ⚠️ 以下两个接口需要新建 ──

// 注册接口（需在 auth.ts 中新增）
// export const registerApi = (data: RegisterForm) => {
//   return request.post('/auth/register', data)  // ← 改为后端实际路径
// }

// 修改密码接口（需新增）
// export const changePasswordApi = (data: { current: string; newPwd: string }) => {
//   return request.put('/user/password', data)
// }

// 更新个人信息接口（需新增）
// export const updateProfileApi = (data: Partial<UserInfo>) => {
//   return request.put('/user/profile', data)
// }
```

### 📁 `src/api/upload.ts` — 上传接口

```typescript
// 文件上传
export const uploadFileApi = (file: File, onProgress?: (progress: number) => void) => {
  return request.upload<UploadFile>(
    '/upload',             // ← 改为后端实际路径，如 '/resource/upload'
    file,
    onProgress
  )
}

// 文本上传
export const uploadTextApi = (content: string, title: string) => {
  return request.post<UploadFile>(
    '/upload/text',        // ← 改为后端实际路径，如 '/resource/upload/text'
    { content, title }
  )
}
```

### 📁 `src/api/recognition.ts` — 识别接口

```typescript
// 获取单个识别结果
export const getRecognitionResultApi = (id: string) => {
  return request.get<RecognitionResult>(
    `/recognition/result/${id}`  // ← 改为后端实际路径，如 `/recognition/${id}`
  )
}

// 获取识别历史列表
export const getRecognitionHistoryApi = (params: { page: number; pageSize: number }) => {
  return request.get<{ list: RecognitionResult[]; total: number }>(
    '/recognition/history',  // ← 改为后端实际路径
    params
  )
}
```

### 📁 `src/api/search.ts` — 搜索接口

```typescript
// 搜索
export const searchApi = (params: SearchParams) => {
  return request.get<{ list: SearchResult[]; total: number }>(
    '/search',             // ← 改为后端实际路径，如 '/resource/search'
    params
  )
}

// 资源详情
export const getDetailApi = (id: string) => {
  return request.get<SearchResult>(
    `/detail/${id}`        // ← 改为后端实际路径，如 `/resource/detail/${id}`
  )
}
```

---

## 四、页面组件修改

### 📁 `src/views/Login/index.vue`

**需要修改的函数：`handleLogin()` — 脚本区中部（约第 85-105 行）**

```typescript
// ══════ 当前代码（Mock）══════
const handleLogin = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (ok) => {
    if (!ok) return
    submitting.value = true

    try {
      // ↓↓↓ 以下 4 行是 Mock，需要删掉 ↓↓↓
      await new Promise((r) => setTimeout(r, 800))
      if (form.username && form.password) {
        localStorage.setItem('token', 'mock-' + Date.now())
        ElMessage.success('登录成功')
        router.push('/upload')
      // ↑↑↑ Mock 代码结束 ↑↑↑
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

// ══════ 改为（调用 userStore）══════
const handleLogin = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (ok) => {
    if (!ok) return
    submitting.value = true

    try {
      // ✅ 改为调用 userStore
      await userStore.login(form.username, form.password)
      ElMessage.success('登录成功')
      router.push('/upload')
    } catch (e: any) {
      ElMessage.error(e.message || '登录失败')
    } finally {
      submitting.value = false
    }
  })
}

// 同时需要在 <script setup> 顶部添加：
// import { useUserStore } from '@/stores/user'
// const userStore = useUserStore()
```

### 📁 `src/views/Register/index.vue`

**需要修改的函数：`handleRegister()` — 脚本区（约第 160-175 行）**

```typescript
// ══════ 当前代码（Mock）══════
const handleRegister = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (ok) => {
    if (!ok) return
    submitting.value = true

    try {
      // ↓↓↓ Mock，需删除 ↓↓↓
      await new Promise((r) => setTimeout(r, 1000))
      // ↑↑↑ Mock 结束 ↑↑↑
      ElMessage.success('注册成功，请登录')
      router.push('/login')
    } catch (e: any) {
      ElMessage.error(e.message || '注册失败')
    } finally {
      submitting.value = false
    }
  })
}

// ══════ 改为（调用 registerApi）══════
// 前提：已在 src/api/auth.ts 中新建 registerApi()
const handleRegister = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (ok) => {
    if (!ok) return
    submitting.value = true

    try {
      // ✅ 调用注册 API
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

// 需在 <script setup> 顶部添加：
// import { registerApi } from '@/api/auth'
```

### 📁 `src/views/Upload/index.vue`

**需要修改的函数 1：`recognizeImage()` — 脚本区（约第 160-170 行）**

```typescript
// ══════ 当前代码（Mock）══════
const recognizeImage = () => {
  if (!currentFile.value) return
  imageLoading.value = true

  // ↓↓↓ Mock ↓↓↓
  setTimeout(() => {
    resultFileName.value = currentFile.value?.name || ''
    showResult()
    clearImage()
    imageLoading.value = false
  }, 1200)
}

// ══════ 改为（调用真实 API）══════
const recognizeImage = async () => {
  if (!currentFile.value) return
  imageLoading.value = true

  try {
    // ✅ 步骤1：上传文件
    const uploadRes = await uploadFileApi(
      currentFile.value,
      (progress) => console.log(`上传进度: ${progress}%`)
    )
    // ✅ 步骤2：获取识别结果
    const result = await getRecognitionResultApi(uploadRes.id)
    resultFileName.value = currentFile.value?.name || ''
    resultId.value = result.id
    resultTime.value = result.recognitionTime
    showResult()
    clearImage()
  } catch (e: any) {
    ElMessage.error(e.message || '上传失败')
  } finally {
    imageLoading.value = false
  }
}
```

**需要修改的函数 2：`submitText()` — 脚本区（约第 175-185 行）**

```typescript
// ══════ 当前代码（Mock）══════
const submitText = () => {
  if (!textForm.title.trim() || !textForm.content.trim()) {
    ElMessage.warning('请填写标题和内容')
    return
  }
  textLoading.value = true

  // ↓↓↓ Mock ↓↓↓
  setTimeout(() => {
    resultFileName.value = textForm.title
    showResult()
    resetText()
    textLoading.value = false
  }, 1200)
}

// ══════ 改为（调用真实 API）══════
const submitText = async () => {
  if (!textForm.title.trim() || !textForm.content.trim()) {
    ElMessage.warning('请填写标题和内容')
    return
  }
  textLoading.value = true

  try {
    // ✅ 上传文本
    const res = await uploadTextApi(textForm.content, textForm.title)
    resultFileName.value = textForm.title
    resultId.value = res.id
    resultTime.value = new Date().toLocaleString('zh-CN')
    showResult()
    resetText()
  } catch (e: any) {
    ElMessage.error(e.message || '提交失败')
  } finally {
    textLoading.value = false
  }
}
```

**同时需要在 `<script setup>` 顶部添加：**
```typescript
import { uploadFileApi, uploadTextApi } from '@/api/upload'
import { getRecognitionResultApi } from '@/api/recognition'
```

### 📁 `src/views/Search/index.vue`

**需要修改的函数：`handleSearch()` — 脚本区（约第 80-120 行）**

```typescript
// ══════ 当前代码（Mock）══════
const handleSearch = () => {
  const q = keyword.value.trim()
  if (!q) {
    ElMessage.warning('请输入检索关键词')
    return
  }
  searching.value = true
  hasSearched.value = true

  // ↓↓↓ Mock：硬编码 3 条结果 ↓↓↓
  setTimeout(() => {
    searching.value = false
    items.value = [
      { id: 'res-1', title: `「${q}」相关 · 示例一`, ... },
      { id: 'res-2', title: `「${q}」相关 · 示例二`, ... },
      { id: 'res-3', title: `「${q}」相关 · 示例三`, ... },
    ]
    ElMessage.success(`找到 ${items.value.length} 条结果`)
  }, 600)
}

// ══════ 改为（调用 searchApi）══════
const handleSearch = async () => {
  const q = keyword.value.trim()
  if (!q) {
    ElMessage.warning('请输入检索关键词')
    return
  }
  searching.value = true
  hasSearched.value = true

  try {
    // ✅ 调用搜索 API
    const res = await searchApi({ keyword: q, page: 1, pageSize: 20 })
    items.value = res.list
    ElMessage.success(`找到 ${res.total} 条结果`)
  } catch (e: any) {
    ElMessage.error(e.message || '检索失败')
    items.value = []
  } finally {
    searching.value = false
  }
}

// 需在 <script setup> 顶部添加：
// import { searchApi } from '@/api/search'
```

### 📁 `src/views/RecognitionResult/index.vue`

**需要修改的函数：`fetchData()` — 脚本区（约第 230-260 行）**

```typescript
// ══════ 当前代码（Mock）══════
const fetchData = async () => {
  const id = route.params.id as string
  if (!id) {
    ElMessage.error('参数错误')
    return
  }

  loading.value = true
  try {
    // ↓↓↓ Mock ↓↓↓
    await new Promise((r) => setTimeout(r, 500))
    data.value = {
      id, fileId: 'file-001', fileName: '示例文件.jpg',
      fileType: 'image',
      recognitionTime: new Date().toLocaleString('zh-CN'),
      result: {
        title: '山水图卷', dynasty: '唐', author: '王维（传）',
        description: '此卷以水墨描绘江南山水景致...',
        tags: ['山水', '水墨', '唐代', '王维'],
        content: '空山不见人，但闻人语响...',
        confidence: 0.87
      },
      rawData: { content: '空山不见人...' }
    }

    await nextTick()
    initChart()
  } catch {
    ElMessage.error('获取识别结果失败')
  } finally {
    loading.value = false
  }
}

// ══════ 改为（调用 getRecognitionResultApi）══════
const fetchData = async () => {
  const id = route.params.id as string
  if (!id) {
    ElMessage.error('参数错误')
    return
  }

  loading.value = true
  try {
    // ✅ 调用识别结果 API
    const res = await getRecognitionResultApi(id)
    data.value = res  // ← 如果后端返回字段名不同，这里需要做映射

    await nextTick()
    initChart()
  } catch {
    ElMessage.error('获取识别结果失败')
  } finally {
    loading.value = false
  }
}

// 需在 <script setup> 顶部添加（已有 import type，确认有函数导入）：
// import { getRecognitionResultApi } from '@/api/recognition'
```

### 📁 `src/views/Profile/index.vue`

**需要修改的地方有 3 处：**

**修改 1：初始数据加载（约第 195 行）**

```typescript
// ══════ 当前代码（硬编码）══════
const localForm = reactive({
  nickname: 'YangZhi',
  username: 'yangzhi',
  email: 'yangzhi@example.com',
  bio: '传统文化爱好者 · 数字传承践行者'
})

// ══════ 改为（从 API 加载）══════
// 页面 onMounted 时调用：
// import { getUserInfoApi } from '@/api/auth'
// import { onMounted } from 'vue'

const localForm = reactive({
  nickname: '',
  username: '',
  email: '',
  bio: ''
})

onMounted(async () => {
  try {
    const info = await getUserInfoApi()
    Object.assign(localForm, info)
  } catch {
    ElMessage.error('获取用户信息失败')
  }
})
```

**修改 2：保存个人信息（约第 230 行）**

```typescript
// ══════ 当前代码（Mock）══════
const saveProfile = async () => {
  // ... 表单验证 ...

  saving.value = true
  // ↓↓↓ Mock ↓↓↓
  await new Promise((r) => setTimeout(r, 800))
  saving.value = false

  pwdForm.current = ''
  pwdForm.newPwd = ''
  pwdForm.confirm = ''
  ElMessage.success('个人信息已更新')
}

// ══════ 改为（调用 API）══════
// 前提：已在 src/api/auth.ts 中新建 updateProfileApi()
const saveProfile = async () => {
  // ... 表单验证 ...

  saving.value = true
  try {
    // ✅ 调用更新 API
    await updateProfileApi({
      nickname: localForm.nickname,
      email: localForm.email,
      bio: localForm.bio
    })
    ElMessage.success('个人信息已更新')
  } catch (e: any) {
    ElMessage.error(e.message || '更新失败')
  } finally {
    saving.value = false
  }
}
```

**修改 3：密码修改（约第 250 行区域）**

```typescript
// 在密码修改的提交函数中：
// 前提：已在 src/api/auth.ts 中新建 changePasswordApi()

const changePassword = async () => {
  // ... 表单验证 ...
  try {
    await changePasswordApi({
      current: pwdForm.current,
      newPwd: pwdForm.newPwd
    })
    pwdForm.current = ''
    pwdForm.newPwd = ''
    pwdForm.confirm = ''
    ElMessage.success('密码已修改')
  } catch (e: any) {
    ElMessage.error(e.message || '修改失败')
  }
}
```

---

## 五、Store 层修改

### 📁 `src/stores/user.ts`

**修改点：`login()` 函数中返回数据的字段名（约第 22-28 行）**

```typescript
// 当前代码：
const login = async (username: string, password: string) => {
  const res = await loginApi({ username, password })
  setToken(res.token)           // ← 确认后端返回字段名
  userInfo.value = res.userInfo // ← 确认后端返回字段名
  return res
}

// 如果后端返回格式是 { token, user }：
  setToken(res.token)
  userInfo.value = res.user

// 如果后端返回格式是 { accessToken, userInfo }：
  setToken(res.accessToken)
  userInfo.value = res.userInfo

// 如果后端返回格式是 { data: { token, user } }（已由拦截器解包）：
  setToken(res.token)
  userInfo.value = res.user
```

---

## 六、类型定义调整

### 📁 `src/types/index.ts`

**需要根据后端实际返回格式调整：**

```typescript
// ── 如果后端 API 返回的是统一包裹格式（已由拦截器解包后见到的格式）
// 当前 UserInfo 可能缺字段，按后端文档补：
export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar?: string
  email?: string     // ← 后端有则补
  bio?: string       // ← 后端有则补
  role?: string      // ← 后端有则补
}

// ── 注册表单类型（新建）──
export interface RegisterForm {
  username: string
  password: string
  nickname: string
}

// ── 如果后端返回格式不同，调整 ApiResponse ──
// 当前：
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 可能的替代格式（确认后端）：
// export interface ApiResponse<T = any> {
//   code: number
//   msg: string
//   data: T
// }
```

---

## 七、空文件待实现清单

以下文件当前内容为空（0 字节），需要实现：

| 文件 | 路径 | 用途 | 优先级 |
|------|------|------|--------|
| ErrorTip.vue | `src/components/ErrorTip.vue` | 全局错误提示组件 | ⭐ |
| Loading.vue | `src/components/Loading.vue` | 全局加载动画组件 | ⭐ |
| validate.ts | `src/utils/validate.ts` | 表单验证复用函数 | ⭐⭐ |

---

## 八、完整修改索引（按优先级）

### 🔴 第一批：页面 mock → API（核心）

| 序号 | 文件 | 位置 | 改动 |
|------|------|------|------|
| 1 | `src/views/Home/index.vue` | `onMounted()` ~L180 | 改硬编码统计数据为 API 加载 |
| 2 | `src/views/Login/index.vue` | `handleLogin()` ~L85 | 删 setTimeout，调 `userStore.login()` |
| 3 | `src/views/Upload/index.vue` | `recognizeImage()` ~L160 | 删 setTimeout，调 `uploadFileApi()` + `getRecognitionResultApi()` |
| 4 | `src/views/Upload/index.vue` | `submitText()` ~L175 | 删 setTimeout，调 `uploadTextApi()` |
| 5 | `src/views/Search/index.vue` | `handleSearch()` ~L80 | 删 setTimeout+硬编码，调 `searchApi()` |
| 6 | `src/views/RecognitionResult/index.vue` | `fetchData()` ~L230 | 删 setTimeout+硬编码，调 `getRecognitionResultApi()` |
| 7 | `src/views/History/index.vue` | `onMounted()` + `handleRefresh()` | 改 mock 数据为 `getRecognitionHistoryApi()` |
| 8 | `src/views/History/index.vue` | `deleteItem()` | 改前端删除为 DELETE API 调用 |
| 9 | `src/views/Explore/index.vue` | `onMounted()` | 改硬编码推荐/词云/图谱为 API 加载 |
| 10 | `src/views/Register/index.vue` | `handleRegister()` ~L160 | 删 setTimeout，调 `registerApi()`（需新建） |
| 11 | `src/views/Profile/index.vue` | `localForm` ~L195 | 改硬编码为 `getUserInfoApi()` 加载 |
| 12 | `src/views/Profile/index.vue` | `saveProfile()` ~L230 | 删 setTimeout，调 `updateProfileApi()`（需新建） |

### 🟡 第二批：API 层新建/调整

| 序号 | 文件 | 改动 |
|------|------|------|
| 13 | `src/api/auth.ts` | 新增 `registerApi()` |
| 14 | `src/api/auth.ts` | 新增 `updateProfileApi()` |
| 15 | `src/api/auth.ts` | 新增 `changePasswordApi()` |
| 16 | `src/api/dashboard.ts`（新建） | 新增 `getDashboardStats()` / `getDashboardTags()` 等 |
| 17 | `src/api/explore.ts`（新建） | 新增 `getExploreRecommend()` / `getGraphEdges()` 等 |
| 18 | `src/api/recognition.ts` | 新增 `deleteRecognitionApi(id)` |
| 19 | `src/api/auth.ts` | 确认 `loginApi/logoutApi/getUserInfoApi` 路径 |
| 20 | `src/api/upload.ts` | 确认 `uploadFileApi/uploadTextApi` 路径 |
| 21 | `src/api/recognition.ts` | 确认 `getRecognitionResultApi/getRecognitionHistoryApi` 路径 |
| 22 | `src/api/search.ts` | 确认 `searchApi/getDetailApi` 路径 |

### 🟢 第三批：中间层适配

| 序号 | 文件 | 改动 |
|------|------|------|
| 23 | `src/utils/request.ts` | 确认成功状态码（code 200/0 是否匹配后端） |
| 24 | `src/utils/request.ts` | 确认 401 状态码路由跳转逻辑 |
| 25 | `src/stores/user.ts` | 确认 `login()` 中 `res.token/res.userInfo` 字段名 |
| 26 | `src/types/index.ts` | 按后端文档补充/调整类型定义 |

### 🔵 第四批：配置层

| 序号 | 文件 | 改动 |
|------|------|------|
| 27 | `vite.config.ts` | 修改 `proxy.target` |
| 28 | `.env.development` | 补充 `VITE_API_BASE_URL` |

---

## 九、后端对接检查清单

### ✅ 对接前确认

- [ ] 后端服务已启动并可以访问
- [ ] 已获取后端接口文档（Swagger / Postman / Markdown）
- [ ] 已确认后端统一返回格式（`{code, message, data}` 还是其他）
- [ ] 已确认认证方式（JWT Token，放在 `Authorization: Bearer xxx` 头）
- [ ] 已确认文件上传方式（`multipart/form-data`，字段名是 `file`）

### ✅ 功能测试

- [ ] 工作台首页 → 统计数据 + 最近识别 + 标签词云
- [ ] 登录 → Token 存储 → 自动跳转工作台
- [ ] Token 过期 → 401 → 清除 token → 跳转登录
- [ ] 注册 → 成功 → 跳转登录
- [ ] 图片上传 → 进度显示 → 识别结果弹窗
- [ ] 文本上传 → 识别结果弹窗
- [ ] 检索 → 关键词搜索 → 结果列表 → 点击跳转详情
- [ ] 识别详情 → 数据结构化展示 → ECharts 图表
- [ ] 识别历史 → 列表分页 → 筛选 → 搜索 → 删除
- [ ] 知识发现 → 朝代/分类浏览 → 词云 → 关联图谱
- [ ] 个人中心 → 加载用户信息 → 修改 → 密码修改

### ✅ 错误处理

- [ ] 网络断开 → "网络连接失败"提示
- [ ] 请求超时 → "请求超时"提示
- [ ] 401/403 → 自动跳转登录
- [ ] 500 → 后端错误信息展示
- [ ] 文件格式不支持 → 文件校验提示（前端 10MB + 格式过滤）

---

**创建日期：** 2026-06-04  
**最后更新：** 2026-06-15  
**维护人：** HchenY 🏮
