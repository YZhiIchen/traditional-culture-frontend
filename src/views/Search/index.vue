<template>
  <div class="search">
    <!-- 页面标识 -->
    <div class="page-lead" v-reveal="{ delay: 80 }">
      <div class="lead-badge">
        <span class="badge-line" />
        <span class="badge-text">资源 · 检索</span>
        <span class="badge-line" />
      </div>
      <h1 class="lead-title">资源检索</h1>
      <p class="lead-desc">
        在传统文化数字馆藏中检索你感兴趣的内容
      </p>
    </div>

    <!-- 搜索输入区（非对称） -->
    <div class="search-bar" v-reveal="{ delay: 160 }">
      <div class="search-field">
        <span class="search-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
               stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          v-model="keyword"
          placeholder="输入关键词，检索传统文化资源…"
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <button
          class="search-submit"
          :disabled="!keyword.trim()"
          @click="handleSearch"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round"
               stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
          检索
        </button>
      </div>
    </div>

    <!-- 结果区域 -->
    <div v-if="hasSearched" class="result-area" v-reveal="{ delay: 200 }">
      <!-- 无结果 -->
      <div v-if="!searching && items.length === 0" class="result-empty">
        <div class="empty-visual">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="0.8" stroke-linecap="round"
               stroke-linejoin="round" opacity="0.2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </div>
        <p class="empty-title">未匹配到相关资源</p>
        <p class="empty-hint">试试其他关键词，或使用更宽泛的检索条件</p>
      </div>

      <!-- 结果列表 -->
      <div v-else class="result-list">
        <div
          v-for="(item, idx) in items"
          :key="idx"
          class="result-item animate-fade-in-up"
          :style="{ animationDelay: `${0.1 + idx * 0.07}s` }"
          @click="goDetail(item)"
        >
          <div class="item-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                 stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>

          <div class="item-body">
            <div class="item-top">
              <h3 class="item-title">{{ item.title }}</h3>
              <span v-if="item.dynasty" class="item-dynasty">{{ item.dynasty }}</span>
            </div>
            <p class="item-summary">{{ item.summary }}</p>
            <div class="item-meta">
              <span class="meta-date">{{ item.date }}</span>
              <button class="meta-link" @click.stop="goDetail(item)">
                查看详情
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round"
                     stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 搜索中占位 -->
      <div v-if="searching" class="result-searching">
        <div class="searching-dot" />
        <span>正在检索…</span>
      </div>
    </div>

    <!-- 初次进入引导 -->
    <div v-else class="search-guide" v-reveal="{ delay: 240 }">
      <div class="guide-visual">
        <img src="/images/artifacts.jpg" alt="文物" class="guide-image" />
        <div class="guide-image-overlay" />
      </div>
      <div class="guide-lines">
        <p>输入关键词开始探索</p>
        <p class="guide-suggest">试试：唐诗 · 宋词 · 山水 · 书法 · 古籍</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { searchApi } from '@/api/search'

const route = useRoute()
const router = useRouter()

const keyword = ref('')

// 从 URL 参数读取初始关键词
onMounted(() => {
  const kw = route.query.keyword as string
  if (kw) {
    keyword.value = kw
    handleSearch()
  }
})
const searching = ref(false)
const hasSearched = ref(false)

interface ResultItem {
  id: string
  title: string
  summary: string
  dynasty: string
  date: string
}

const items = ref<ResultItem[]>([])

const handleSearch = async () => {
  const q = keyword.value.trim()
  if (!q) {
    ElMessage.warning('请输入检索关键词')
    return
  }

  searching.value = true
  hasSearched.value = true

  try {
    const res = await searchApi({ keyword: q, page: 1, pageSize: 20 })
    items.value = (res.list || []).map((r: any) => ({
      id: r.id,
      title: r.title || '',
      summary: r.summary || '',
      dynasty: r.dynasty || '',
      date: r.createTime || ''
    }))
    ElMessage.success(`找到 ${res.total} 条结果`)
  } catch (e: any) {
    ElMessage.error(e.message || '检索失败')
    items.value = []
  } finally {
    searching.value = false
  }
}

const goDetail = (item: ResultItem) => {
  router.push(`/recognition/${item.id}`)
}
</script>

<style scoped lang="scss">
// ═══════════════════════════════════════════
// 当代山水 · 资源检索
// ═══════════════════════════════════════════

.search {
  // ── 搜索条 ──
  .search-bar {
    margin-bottom: var(--space-xl);
  }

  .search-field {
    display: flex;
    align-items: center;
    gap: 0;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-xl);
    overflow: hidden;
    transition: all var(--transition-fast);
    box-shadow: var(--shadow-sm);

    &:focus-within {
      border-color: var(--cinnabar);
      box-shadow: 0 0 0 3px oklch(50% 0.16 28 / 0.08);
    }

    .search-icon {
      display: flex;
      padding: 0 12px 0 18px;
      color: var(--text-tertiary);
      transition: color var(--transition-fast);
    }

    &:focus-within .search-icon {
      color: var(--cinnabar);
    }

    .search-input {
      all: unset;
      flex: 1;
      height: 52px;
      font-size: 15px;
      color: var(--text-primary);
      font-family: var(--font-body);

      &::placeholder {
        color: var(--text-placeholder);
        font-weight: 400;
      }
    }

    .search-submit {
      all: unset;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 38px;
      padding: 0 20px;
      margin-right: 7px;
      font-size: 13px;
      letter-spacing: 1px;
      color: #fff;
      background: linear-gradient(135deg, var(--cinnabar), oklch(42% 0.14 28));
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
      flex-shrink: 0;

      svg {
        flex-shrink: 0;
      }

      &:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px oklch(50% 0.16 28 / 0.25);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }

  // ── 结果区 ──
  .result-area {
    .result-empty {
      text-align: center;
      padding: var(--space-3xl) 0;

      .empty-visual {
        margin-bottom: 16px;
        color: var(--text-primary);
      }

      .empty-title {
        font-size: 16px;
        color: var(--text-regular);
        margin-bottom: 6px;
      }

      .empty-hint {
        font-size: 13px;
        color: var(--text-tertiary);
      }
    }

    .result-list {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .result-item {
      display: flex;
      gap: 16px;
      padding: var(--space-lg) var(--space-xl);
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      transition: all var(--transition-fast);
      cursor: pointer;

      &:hover {
        border-color: oklch(50% 0.16 28 / 0.15);
        box-shadow: var(--shadow-md);
        transform: translateY(-1px);

        .meta-link {
          opacity: 1;
          transform: translateX(0);
        }
      }

      + .result-item {
        margin-top: 8px;
      }

      .item-icon {
        flex-shrink: 0;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: oklch(50% 0.16 28 / 0.06);
        border-radius: var(--radius-md);
        color: var(--cinnabar);
      }

      .item-body {
        flex: 1;
        min-width: 0;

        .item-top {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;

          .item-title {
            font-size: 15px;
            font-weight: 600;
            color: var(--text-primary);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .item-dynasty {
            flex-shrink: 0;
            font-size: 10px;
            padding: 1px 10px;
            border-radius: var(--radius-full);
            background: oklch(50% 0.16 28 / 0.06);
            color: var(--cinnabar);
            letter-spacing: 1px;
          }
        }

        .item-summary {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .item-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .meta-date {
            font-size: 12px;
            color: var(--text-tertiary);
          }

          .meta-link {
            all: unset;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
            color: var(--cinnabar);
            cursor: pointer;
            opacity: 0;
            transform: translateX(-6px);
            transition: all var(--transition-fast);

            &:hover {
              opacity: 1 !important;
            }
          }
        }
      }
    }

    // ── 搜索中的占位 ──
    .result-searching {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: var(--space-2xl) 0;
      font-size: 14px;
      color: var(--text-secondary);

      .searching-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--cinnabar);
        animation: pulse 1s ease-in-out infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 0.3; transform: scale(0.8); }
        50% { opacity: 1; transform: scale(1.2); }
      }
    }
  }

  // ── 初次引导 ──
  .search-guide {
    text-align: center;
    padding: var(--space-2xl) 0;

    .guide-visual {
      position: relative;
      width: 280px;
      height: 180px;
      margin: 0 auto var(--space-xl);
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-md);

      .guide-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .guide-image-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          to bottom,
          transparent 40%,
          var(--bg-body) 100%
        );
      }
    }

    .guide-lines {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      color: var(--text-tertiary);

      p {
        font-size: 14px;
      }

      .guide-suggest {
        font-size: 12px;
        opacity: 0.7;
        letter-spacing: 1px;
      }
    }
  }

  // ═══════════════════════════════════════
  // 移动端适配
  // ═══════════════════════════════════════
  @media (max-width: 768px) {
    .search-bar {
      margin-bottom: var(--space-lg);
    }

    .search-field {
      flex-wrap: wrap;
      padding: 8px;

      .search-icon {
        padding: 0 8px 0 10px;
      }

      .search-input {
        height: 44px;
        font-size: 16px; // 防止 iOS Safari 聚焦时自动放大
        flex: 1 1 calc(100% - 40px);
      }

      .search-submit {
        width: 100%;
        height: 44px;
        justify-content: center;
        margin-right: 0;
        margin-top: 4px;
      }
    }

    .result-item {
      padding: var(--space-md);
      gap: 12px;

      .item-icon {
        width: 36px;
        height: 36px;
      }

      .item-body {
        .item-top {
          flex-wrap: wrap;
          gap: 6px;

          .item-title {
            font-size: 14px;
          }
        }

        .item-summary {
          font-size: 12px;
          -webkit-line-clamp: 3;
        }

        .item-meta {
          .meta-link {
            opacity: 1;
            transform: none;
          }
        }
      }
    }

    .search-guide {
      padding: var(--space-2xl) 0;
    }
  }
}

// ── 动画覆盖 ──
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
