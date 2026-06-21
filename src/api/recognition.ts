import request from '@/utils/request'
import type { RecognitionResult } from '@/types'

// 获取识别结果
export const getRecognitionResultApi = (id: string) => {
  return request.get<RecognitionResult>(`/recognition/result/${id}`)
}

// 获取识别历史列表
export const getRecognitionHistoryApi = (params: { page: number; pageSize: number }) => {
  return request.get<{ list: RecognitionResult[]; total: number }>('/recognition/history', params)
}