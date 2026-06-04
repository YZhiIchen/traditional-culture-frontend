// 用户相关
export interface LoginForm {
  username: string
  password: string
  code?: string
}

export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar?: string
}

// 上传相关
export interface UploadFile {
  id: string
  name: string
  type: 'image' | 'text'
  size: number
  url?: string
  content?: string
}

// 识别结果
export interface RecognitionResult {
  id: string
  fileId: string
  fileName: string
  fileType: string
  recognitionTime: string
  result: {
    title?: string
    dynasty?: string
    author?: string
    description?: string
    tags?: string[]
    content?: string
    confidence?: number
  }
  rawData: any
}

// 检索参数
export interface SearchParams {
  keyword: string
  type?: 'image' | 'text' | 'all'
  dynasty?: string
  startDate?: string
  endDate?: string
  page: number
  pageSize: number
}

// 检索结果
export interface SearchResult {
  id: string
  title: string
  type: string
  dynasty: string
  thumbnail?: string
  summary: string
  createTime: string
}

// API响应
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}