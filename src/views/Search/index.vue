<template>
  <div class="search-page">
    <!-- 页面标题 -->
    <div class="page-header animate-fade-in-up">
      <h1 class="page-title">
        <span class="page-title-deco">◆</span>
        资源检索
        <span class="page-title-deco">◆</span>
      </h1>
      <p class="page-desc">通过关键词检索传统文化数字化资源</p>
    </div>

    <!-- 搜索卡片 -->
    <el-card class="search-card animate-fade-in-up delay-1">
      <div class="search-area">
        <div class="search-input-wrapper">
          <el-input
            v-model="keyword"
            placeholder="请输入关键词检索..."
            clearable
            size="large"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon class="search-icon"><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" size="large" class="search-btn" @click="handleSearch">
            <el-icon><Search /></el-icon>
            检索
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 结果区域 -->
    <div v-if="hasSearched" class="result-area animate-fade-in-up delay-2">
      <!-- 无结果 -->
      <el-card v-if="!loading && results.length === 0" class="empty-card">
        <div class="empty-state">
          <span class="empty-icon">🔍</span>
          <p class="empty-text">暂未匹配到相关资源</p>
          <p class="empty-hint">请尝试使用其他关键词</p>
        </div>
      </el-card>

      <!-- 结果列表 -->
      <div v-else class="result-list">
        <div
          v-for="(item, idx) in results"
          :key="idx"
          class="result-card-item animate-fade-in-up"
          :style="{ animationDelay: `${0.1 + idx * 0.08}s` }"
        >
          <div class="result-content">
            <div class="result-icon">
              <el-icon :size="20"><Document /></el-icon>
            </div>
            <div class="result-body">
              <h3 class="result-title">{{ item.title }}</h3>
              <p class="result-summary">{{ item.summary }}</p>
              <div class="result-meta">
                <span class="meta-tag" v-if="item.dynasty">{{ item.dynasty }}</span>
                <span class="meta-date">{{ item.date }}</span>
              </div>
            </div>
          </div>
          <el-button type="primary" link class="result-action">
            查看详情
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Document, ArrowRight } from '@element-plus/icons-vue'

const keyword = ref('')
const loading = ref(false)
const hasSearched = ref(false)

interface MockResult {
  title: string
  summary: string
  dynasty: string
  date: string
}

const results = ref<MockResult[]>([])

const handleSearch = () => {
  if (!keyword.value.trim()) {
    ElMessage.warning('请输入检索关键词')
    return
  }

  loading.value = true
  hasSearched.value = true

  // 模拟数据
  setTimeout(() => {
    results.value = [
      {
        title: `搜索结果：「${keyword.value}」相关示例一`,
        summary: '这是传统文化资源中的相关内容摘要，展示了数字化保存的成果与价值...',
        dynasty: '唐代',
        date: '2026-06-01'
      },
      {
        title: `搜索结果：「${keyword.value}」相关示例二`,
        summary: '智能识别与分析技术在本平台中的应用，为传统文化的保护与传承提供了新的可能...',
        dynasty: '宋代',
        date: '2026-05-28'
      },
      {
        title: `搜索结果：「${keyword.value}」相关示例三`,
        summary: '通过数字化手段，让更多人了解与接触传统文化的精髓与魅力...',
        dynasty: '明代',
        date: '2026-05-20'
      }
    ]
    loading.value = false
    ElMessage.success(`检索完成，共找到 ${results.value.length} 条结果`)
  }, 600)
}
</script>

<style scoped lang="scss">
.search-page {
  // ── 页面标题 ──
  .page-header {
    margin-bottom: 24px;

    .page-title {
      font-family: var(--font-heading);
      font-size: 22px;
      font-weight: 700;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 12px;

      .page-title-deco {
        font-size: 8px;
        color: var(--cinnabar);
        opacity: 0.4;
      }
    }

    .page-desc {
      margin-top: 6px;
      font-size: 13px;
      color: var(--text-secondary);
    }
  }

  // ── 搜索卡片 ──
  .search-card {
    margin-bottom: 24px;

    .search-area {
      .search-input-wrapper {
        display: flex;
        gap: 12px;

        :deep(.el-input__wrapper) {
          background: rgba(245, 240, 232, 0.4);
          border: 1px solid var(--border-color);
          box-shadow: none !important;
          border-radius: var(--radius-md);
          transition: all var(--transition-normal);

          &:hover {
            border-color: var(--ink-300);
          }

          &.is-focus {
            border-color: var(--cinnabar);

            .search-icon {
              color: var(--cinnabar);
            }
          }
        }

        .search-icon {
          color: var(--ink-300);
          transition: color var(--transition-fast);
        }

        .search-btn {
          min-width: 100px;
          letter-spacing: 2px;
          border-radius: var(--radius-md);

          .el-icon {
            margin-right: 4px;
          }
        }
      }
    }
  }

  // ── 结果区域 ──
  .result-area {
    .empty-card {
      :deep(.el-card__body) {
        padding: 60px 24px;
      }
    }

    .empty-state {
      text-align: center;

      .empty-icon {
        font-size: 48px;
        opacity: 0.3;
      }

      .empty-text {
        margin-top: 16px;
        font-size: 15px;
        color: var(--text-secondary);
      }

      .empty-hint {
        margin-top: 8px;
        font-size: 13px;
        color: var(--ink-300);
      }
    }

    .result-list {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .result-card-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 24px;
        background: var(--bg-card);
        backdrop-filter: blur(8px);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-lg);
        transition: all var(--transition-normal);
        cursor: pointer;

        &:hover {
          border-color: rgba(194, 59, 34, 0.15);
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);

          .result-action {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .result-content {
          display: flex;
          gap: 16px;
          flex: 1;
          min-width: 0;

          .result-icon {
            flex-shrink: 0;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(194, 59, 34, 0.08);
            border-radius: var(--radius-md);
            color: var(--cinnabar);
          }

          .result-body {
            min-width: 0;

            .result-title {
              font-size: 15px;
              font-weight: 600;
              color: var(--text-primary);
              margin-bottom: 6px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .result-summary {
              font-size: 13px;
              color: var(--text-secondary);
              line-height: 1.5;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              margin-bottom: 8px;
            }

            .result-meta {
              display: flex;
              gap: 12px;

              .meta-tag {
                font-size: 11px;
                padding: 2px 10px;
                border-radius: 10px;
                background: rgba(194, 59, 34, 0.08);
                color: var(--cinnabar);
              }

              .meta-date {
                font-size: 12px;
                color: var(--ink-300);
              }
            }
          }
        }

        .result-action {
          flex-shrink: 0;
          opacity: 0;
          transform: translateX(-8px);
          transition: all var(--transition-normal);
          font-size: 13px;
          margin-left: 16px;

          .el-icon {
            margin-left: 4px;
          }
        }
      }
    }
  }
}

// ── 动画 ──
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
