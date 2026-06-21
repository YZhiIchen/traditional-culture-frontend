import request from '@/utils/request'
import type { RecognitionResult } from '@/types'

// 上传文件接口
export const uploadFileApi = (file: File, onProgress?: (progress: number) => void) => {
  return request.upload<RecognitionResult>('/upload', file, onProgress)
}

// 上传文本内容接口
export const uploadTextApi = (content: string, title: string) => {
  return request.post<RecognitionResult>('/upload/text', { content, title })
}