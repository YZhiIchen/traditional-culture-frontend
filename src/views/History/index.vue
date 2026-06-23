<template>
  <div class="history">
    <!-- 页面标识 -->
    <div class="page-lead animate-fade-in-up">
      <div class="lead-badge">
        <span class="badge-line" />
        <span class="badge-text">我的 · 记录</span>
        <span class="badge-line" />
      </div>
      <div class="lead-row">
        <div>
          <h1 class="lead-title">识别历史</h1>
          <p class="lead-desc">
            浏览和管理您的所有资源识别与结构化处理记录
          </p>
        </div>
        <div class="lead-actions">
          <button class="ghost-btn" @click="handleRefresh">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                 stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            刷新
          </button>
        </div>
      </div>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar animate-fade-in-up delay-1">
      <div class="filter-group">
        <button
          v-for="tab in typeFilter"
          :key="tab.key"
          class="filter-pill"
          :class="{ active: activeType === tab.key }"
          @click="activeType = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="filter-right">
        <div class="search-mini">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
               stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            v-model="searchKeyword"
            placeholder="搜索识别记录…"
            class="search-mini-input"
            @input="handleSearchInput"
          />
        </div>
      </div>
    </div>

    <!-- 加载 -->
    <div v-if="loading" class="skeleton-area animate-fade-in">
      <div class="skeleton-row" v-for="n in 5" :key="n" />
    </div>

    <!-- 批量操作栏 -->
    <div v-if="selectedIds.length > 0" class="batch-bar animate-fade-in">
      <span class="batch-count">已选 {{ selectedIds.length }} 项</span>
      <button class="batch-action-btn" @click="selectAll">全选</button>
      <button class="batch-delete-btn" @click="batchDelete">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
             stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
        批量删除
      </button>
      <button class="batch-action-btn" @click="batchFavorite">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        批量收藏
      </button>
      <button class="batch-action-btn" @click="batchUnfavorite">取消收藏</button>
      <button class="batch-cancel-btn" @click="deselectAll">取消全选</button>
    </div>

    <!-- 列表 -->
    <div class="history-list">
      <div
        v-for="(item, idx) in filteredList"
        :key="item.id"
        class="history-card animate-fade-in-up"
        :style="{ animationDelay: `${0.06 * idx}s` }"
        :class="{ selected: selectedIds.includes(item.id) }"
        @click="goDetail(item.id)"
      >
        <!-- 选择框 -->
        <div class="card-checkbox" @click.stop>
          <input
            type="checkbox"
            :checked="selectedIds.includes(item.id)"
            @change="toggleSelect(item.id)"
            class="select-checkbox"
          />
        </div>
        <!-- 缩略图 -->
        <div class="card-thumb">
          <img v-if="item.fileType === 'image' && item.fileUrl" :src="item.fileUrl"
               class="thumb-real" alt="预览" />
          <div v-else-if="item.fileType === 'image'" class="thumb-img">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1" stroke-linecap="round"
                 stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <div v-else class="thumb-text">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1" stroke-linecap="round"
                 stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
        </div>

        <!-- 信息 -->
        <div class="card-body">
          <div class="card-top">
            <h3 class="card-title">{{ item.title }}</h3>
            <span class="card-dynasty" v-if="item.dynasty">{{ item.dynasty }}</span>
            <span class="card-type-badge">{{ item.fileType === 'image' ? '图片' : '文本' }}</span>
          </div>

          <div class="card-meta">
            <span class="meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                   stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              </svg>
              {{ item.author || '未知作者' }}
            </span>
            <span class="meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                   stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {{ formatDate(item.recognitionTime) }}
            </span>
          </div>

          <div class="card-tags" v-if="item.tags?.length">
            <span class="mini-tag" v-for="tag in item.tags.slice(0, 4)" :key="tag">{{ tag }}</span>
            <span v-if="item.tags.length > 4" class="mini-tag-more">+{{ item.tags.length - 4 }}</span>
          </div>
        </div>

        <!-- 置信度 -->
        <div class="card-score">
          <div class="score-ring">
            <svg width="44" height="44" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="19" fill="none"
                      stroke="var(--border-color)" stroke-width="3" />
              <circle cx="22" cy="22" r="19" fill="none"
                      stroke="var(--cinnabar)" stroke-width="3"
                      stroke-linecap="round"
                      :stroke-dasharray="`${(item.confidence || 0) * 119} 119`"
                      transform="rotate(-90 22 22)"
                      style="transition: stroke-dasharray 1s var(--ease-out-expo)" />
            </svg>
            <span class="score-text">{{ pct(item.confidence) }}</span>
          </div>
        </div>

        <!-- 操作 -->
        <div class="card-actions" @click.stop>
          <button class="card-action-btn" @click="goDetail(item.id)" title="查看详情">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                 stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
          <button class="card-action-btn" @click="exportItem(item)" title="导出">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                 stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
          <button class="card-action-btn danger" @click="deleteItem(item)" title="删除">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                 stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 空态 -->
    <div v-if="!loading && filteredList.length === 0" class="empty-state animate-fade-in">
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="0.7" opacity="0.15">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
      <p class="empty-title">{{ searchKeyword ? '无匹配记录' : '暂无识别记录' }}</p>
      <p class="empty-hint">
        {{ searchKeyword ? '试试其他关键词' : '上传资源后自动生成识别记录' }}
      </p>
      <router-link v-if="!searchKeyword" to="/upload" class="action-btn">去上传</router-link>
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="pagination-row animate-fade-in-up delay-4">
      <button class="page-btn" :disabled="page === 1" @click="page--">‹ 上一页</button>
      <span class="page-info">{{ page }} / {{ totalPages }}</span>
      <button class="page-btn" :disabled="page === totalPages" @click="page++">下一页 ›</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getRecognitionHistoryApi } from '@/api/recognition'
import request from '@/utils/request'

const router = useRouter()

const loading = ref(true)
const page = ref(1)
const pageSize = ref(10)
const searchKeyword = ref('')
const activeType = ref<'all' | 'image' | 'text'>('all')

const typeFilter = [
  { key: 'all' as const, label: '全部' },
  { key: 'image' as const, label: '图片' },
  { key: 'text' as const, label: '文本' }
]

// ── 数据类型 ──
interface HistoryItem {
  id: string
  title: string
  fileType: 'image' | 'text'
  fileUrl?: string
  dynasty?: string
  author?: string
  tags: string[]
  confidence: number
  recognitionTime: string
  status: 'done' | 'processing'
}

let debounceTimer: ReturnType<typeof setTimeout>

const fullList = ref<HistoryItem[]>([])
const totalCount = ref(0)

const filteredList = computed(() => {
  return fullList.value
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(totalCount.value / pageSize.value))
})

// 批量选择
const selectedIds = ref<string[]>([])

const toggleSelect = (id: string) => {
  const idx = selectedIds.value.indexOf(id)
  if (idx === -1) {
    selectedIds.value.push(id)
  } else {
    selectedIds.value.splice(idx, 1)
  }
}

const selectAll = () => {
  selectedIds.value = filteredList.value.map(i => i.id)
}

const deselectAll = () => {
  selectedIds.value = []
}

const batchDelete = async () => {
  if (selectedIds.value.length === 0) return
  try {
    await ElMessageBox.confirm(`确定删除选中的 ${selectedIds.value.length} 条记录？`, '批量删除', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    })
    const ids = selectedIds.value.slice()
    await Promise.all(ids.map(id => request.delete(`/recognition/${id}`)))
    fullList.value = fullList.value.filter(i => !selectedIds.value.includes(i.id))
    totalCount.value -= ids.length
    selectedIds.value = []
    ElMessage.success('批量删除完成')
  } catch {
    // 取消
  }
}

const batchFavorite = async () => {
  if (selectedIds.value.length === 0) return
  try {
    const ids = selectedIds.value.slice()
    await Promise.all(ids.map(id => request.post(`/favorite/${id}`)))
    ElMessage.success(`已收藏 ${ids.length} 项`)
    selectedIds.value = []
  } catch { /* */ }
}

const batchUnfavorite = async () => {
  if (selectedIds.value.length === 0) return
  try {
    const ids = selectedIds.value.slice()
    await Promise.all(ids.map(id => request.delete(`/favorite/${id}`)))
    ElMessage.success(`已取消收藏 ${ids.length} 项`)
    selectedIds.value = []
  } catch { /* */ }
}

const pct = (val: number | undefined) => {
  if (val === undefined || val === null) return '--'
  return Math.round(val * 100) + '%'
}

const formatDate = (dateStr: string) => {
  return dateStr.replace('2026-', '').replace(' ', ' ')
}

const handleSearchInput = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    page.value = 1
    fetchHistory()
  }, 400)
}

const goDetail = (id: string) => {
  router.push(`/recognition/${id}`)
}

const exportItem = (item: HistoryItem) => {
  const blob = new Blob([JSON.stringify(item, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `recognition_${item.id}.json`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('已导出')
}

const fetchHistory = async () => {
  loading.value = true
  try {
    const params: any = { page: page.value, pageSize: pageSize.value }
    if (activeType.value !== 'all') params.type = activeType.value
    if (searchKeyword.value.trim()) params.keyword = searchKeyword.value.trim()
    const res: any = await getRecognitionHistoryApi(params)
    fullList.value = (res.list || []).map((r: any) => ({
      id: r.id,
      title: r.result?.title || r.fileName,
      fileType: r.fileType,
      fileUrl: r.fileUrl || undefined,
      dynasty: r.result?.dynasty,
      author: r.result?.author,
      tags: r.result?.tags || [],
      confidence: r.result?.confidence || 0,
      recognitionTime: r.recognitionTime || '',
      status: r.status === 'completed' ? 'done' : 'processing'
    }))
    totalCount.value = res.total || 0
    loading.value = false
  } catch {
    loading.value = false
  }
}

const deleteItem = async (item: HistoryItem) => {
  try {
    await ElMessageBox.confirm(`确定删除「${item.title}」的识别记录？`, '删除确认', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    })
    await request.delete(`/recognition/${item.id}`)
    fullList.value = fullList.value.filter(i => i.id !== item.id)
    ElMessage.success('已删除')
  } catch {
    // 取消或失败
  }
}

const handleRefresh = async () => {
  await fetchHistory()
  ElMessage.success('已刷新')
}

onMounted(() => {
  fetchHistory()
})

watch([page, activeType], () => {
  fetchHistory()
})

</script>

<style scoped lang="scss">
// ═══════════════════════════════════════════
// 当代山水 · 识别历史
// ═══════════════════════════════════════════

.history {
  .page-lead {
    margin-bottom: var(--space-lg);

    .lead-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;

      .badge-line {
        width: 20px;
        height: 1px;
        background: var(--cinnabar);
        opacity: 0.3;
      }

      .badge-text {
        font-size: 11px;
        color: var(--cinnabar);
        letter-spacing: 3px;
        text-transform: uppercase;
        opacity: 0.7;
      }
    }

    .lead-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--space-md);
    }

    .lead-title {
      font-family: var(--font-heading);
      font-size: clamp(22px, 3vw, 28px);
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: 4px;
    }

    .lead-desc {
      margin-top: 6px;
      font-size: 13px;
      color: var(--text-secondary);
    }

    .lead-actions {
      display: flex;
      gap: 8px;
    }
  }

  .ghost-btn {
    all: unset;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0 14px;
    height: 36px;
    font-size: 12px;
    color: var(--text-secondary);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    border: 1px solid var(--border-color);

    &:hover {
      color: var(--text-regular);
      border-color: var(--ink-400);
      background: oklch(50% 0.16 28 / 0.03);
    }
  }

  // ── 筛选栏 ──
  .filter-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-lg);
    gap: var(--space-md);
    flex-wrap: wrap;
  }

  .filter-group {
    display: flex;
    gap: 4px;

    .filter-pill {
      all: unset;
      font-size: 12px;
      padding: 5px 16px;
      border-radius: var(--radius-full);
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        color: var(--text-regular);
        border-color: var(--ink-400);
      }

      &.active {
        color: var(--cinnabar);
        border-color: var(--cinnabar);
        background: oklch(50% 0.16 28 / 0.06);
      }
    }
  }

  .filter-right {
    .search-mini {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 12px;
      height: 32px;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      background: var(--bg-card);
      color: var(--text-tertiary);
      transition: border-color var(--transition-fast);
      width: 200px;

      &:focus-within {
        border-color: var(--cinnabar);
        box-shadow: 0 0 0 2px oklch(50% 0.16 28 / 0.06);
      }

      .search-mini-input {
        all: unset;
        flex: 1;
        font-size: 12px;
        color: var(--text-primary);

        &::placeholder {
          color: var(--text-placeholder);
        }
      }
    }
  }

  // ── 骨架 ──
  .skeleton-area {
    .skeleton-row {
      height: 72px;
      margin-bottom: 8px;
      border-radius: var(--radius-lg);
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      animation: shimmer 1.5s infinite;
      background-image: linear-gradient(90deg, var(--bg-card) 0%, var(--border-color) 50%, var(--bg-card) 100%);
      background-size: 200% 100%;
    }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  // ── 列表卡片 ──
  .history-card {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md) var(--space-lg);
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    margin-bottom: 8px;
    cursor: pointer;
    transition: all var(--transition-fast);
    box-shadow: var(--shadow-sm);
    animation: fadeInUp 0.35s var(--ease-out-expo) both;

    &:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-1px);
      border-color: oklch(50% 0.16 28 / 0.15);

      .card-actions {
        opacity: 1;
      }
    }
  }

  // ── 批量操作栏 ──
  .batch-bar {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: 8px var(--space-lg);
    background: oklch(50% 0.16 28 / 0.04);
    border: 1px solid var(--cinnabar);
    border-radius: var(--radius-lg);
    margin-bottom: var(--space-md);

    .batch-count {
      font-size: 13px;
      font-weight: 600;
      color: var(--cinnabar);
    }

    .batch-delete-btn, .batch-action-btn, .batch-cancel-btn {
      all: unset;
      font-size: 12px;
      padding: 4px 14px;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .batch-delete-btn {
      background: var(--cinnabar);
      color: #fff;
      &:hover { opacity: 0.85; }
    }

    .batch-action-btn {
      background: var(--azure);
      color: #fff;
      &:hover { opacity: 0.85; }
    }

    .batch-cancel-btn {
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      &:hover { border-color: var(--ink-400); }
    }
  }

  // ── 复选框 ──
  .card-checkbox {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    padding-right: 4px;
    position: relative;
    z-index: 2;

    .select-checkbox {
      width: 16px;
      height: 16px;
      accent-color: var(--cinnabar);
      cursor: pointer;
    }
  }

  // ── 选中高亮 ──
  .history-card.selected {
    border-color: var(--cinnabar);
    background: oklch(50% 0.16 28 / 0.03);
  }

  .card-thumb {
    width: 56px;
    height: 56px;
    border-radius: var(--radius-md);
    background: oklch(50% 0.16 28 / 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--cinnabar);
    opacity: 0.6;
    overflow: hidden;
  }

  .thumb-real {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.85;
    display: block;
  }

  .card-body {
    flex: 1;
    min-width: 0;

    .card-top {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;

      .card-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--text-primary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .card-dynasty {
        font-size: 10px;
        padding: 1px 8px;
        border-radius: var(--radius-full);
        background: oklch(50% 0.16 28 / 0.06);
        color: var(--cinnabar);
        flex-shrink: 0;
      }

      .card-type-badge {
        font-size: 10px;
        padding: 1px 8px;
        border-radius: var(--radius-full);
        background: var(--border-light);
        color: var(--text-tertiary);
        flex-shrink: 0;
      }
    }

    .card-meta {
      display: flex;
      gap: 16px;
      margin-bottom: 6px;

      .meta-item {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        color: var(--text-tertiary);

        svg {
          opacity: 0.5;
        }
      }
    }

    .card-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;

      .mini-tag {
        font-size: 10px;
        padding: 0 6px;
        border-radius: var(--radius-full);
        background: oklch(50% 0.16 28 / 0.04);
        color: var(--cinnabar);
        opacity: 0.7;
      }

      .mini-tag-more {
        font-size: 10px;
        color: var(--text-tertiary);
      }
    }
  }

  // ── 置信度圆环 ──
  .card-score {
    flex-shrink: 0;
    position: relative;

    .score-ring {
      position: relative;
      width: 44px;
      height: 44px;
    }

    .score-text {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      color: var(--cinnabar);
    }
  }

  // ── 操作按钮 ──
  .card-actions {
    display: flex;
    gap: 4px;
    opacity: 0;
    transition: opacity var(--transition-fast);
    flex-shrink: 0;

    .card-action-btn {
      all: unset;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-md);
      color: var(--text-tertiary);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        background: oklch(50% 0.16 28 / 0.06);
        color: var(--cinnabar);
      }

      &.danger:hover {
        background: oklch(50% 0.16 28 / 0.1);
        color: var(--cinnabar);
      }
    }
  }

  // ── 空态 ──
  .empty-state {
    text-align: center;
    padding: var(--space-3xl) 0;

    .empty-title {
      font-size: 16px;
      color: var(--text-regular);
      margin: 12px 0 6px;
    }

    .empty-hint {
      font-size: 13px;
      color: var(--text-tertiary);
      margin-bottom: var(--space-lg);
    }
  }

  .action-btn {
    all: unset;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0 24px;
    height: 40px;
    font-size: 14px;
    letter-spacing: 2px;
    border-radius: var(--radius-md);
    background: linear-gradient(135deg, var(--cinnabar), oklch(42% 0.14 28));
    color: #fff;
    cursor: pointer;
    transition: all var(--transition-fast);
    text-decoration: none;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px oklch(50% 0.16 28 / 0.25);
    }
  }

  // ── 分页 ──
  .pagination-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-lg) 0;

    .page-btn {
      all: unset;
      font-size: 13px;
      color: var(--text-secondary);
      cursor: pointer;
      padding: 6px 16px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
      transition: all var(--transition-fast);

      &:hover:not(:disabled) {
        color: var(--cinnabar);
        border-color: var(--cinnabar);
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }

    .page-info {
      font-size: 12px;
      color: var(--text-tertiary);
    }
  }
}

// ── 动画 ──
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>