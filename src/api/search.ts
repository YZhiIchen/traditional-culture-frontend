import request from '@/utils/request'
import type { SearchParams, SearchResult } from '@/types'

// 搜索资源
export const searchApi = (params: SearchParams) => {
  return request.get<{ list: SearchResult[]; total: number }>('/search', params)
}

// 获取资源详情
export const getDetailApi = (id: string) => {
  return request.get<SearchResult>((`/detail/${id}`))
}