import request from '@/utils/request'
import type { UploadFile } from '@/types'

// 上传文件接口
export const uploadFileApi = (file: File, onProgress?: (progress: number) => void) => {
  return request.upload<UploadFile>('/upload', file, onProgress)
}

// 上传文本内容接口
export const uploadTextApi = (content: string, title: string) => {
  return request.post<UploadFile>('/upload/text', { content, title })
}