<template>
  <div class="detail">
    <!-- 页面标识 + 返回按钮（全局左上角） -->
    <div class="page-lead animate-fade-in-up">
      <div class="lead-badge">
        <span class="badge-line" />
        <span class="badge-text">识别 · 详情</span>
        <span class="badge-line" />
      </div>
      <div class="lead-row">
        <div>
          <h1 class="lead-title">识别结果详情</h1>
          <p class="lead-desc">
            查看文件的智能识别产出与结构化元数据
          </p>
        </div>
        <div class="lead-actions">
          <!-- 返回按钮移至顶部操作栏 -->
          <button class="ghost-btn back-top-btn" @click="goBack">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round"
                 stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            返回
          </button>
          <button class="ghost-btn" @click="exportResult">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                 stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            导出
          </button>
          <button class="ghost-btn" @click="printPage">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                 stroke-linejoin="round">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            打印
          </button>
        </div>
      </div>
    </div>
    <!-- 加载占位 -->
    <div v-if="loading" class="skeleton-area animate-fade-in">
      <div class="skeleton-block" style="height: 320px" />
      <div class="skeleton-block" style="height: 420px; margin-top: 16px;" />
    </div>
    <!-- 主内容（非对称双栏） -->
    <div v-else-if="data" class="detail-grid">
      <!-- ═══ 左侧：原文件 + 标签分布图表 ═══ -->
      <div class="grid-primary animate-fade-in-up delay-1">
        <!-- 1.原文件卡片 -->
        <section class="section-card">
          <div class="section-head">
            <span class="section-head-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                   stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </span>
            <span>原文件</span>
          </div>
          <div class="section-body">
            <!-- 图片预览 修复预览拉伸问题 -->
            <div v-if="data.fileType === 'image'" class="image-preview">
              <div class="image-frame">
                <img
                  :src="data.fileUrl || placeholderImg"
                  alt="预览"
                  loading="lazy"
                />
              </div>
            </div>
            <!-- 文本预览 修复滚动留白 -->
            <div v-else class="text-preview">
              <div class="text-scroll">{{ data.rawData?.content?.trim() || '(无原始文本)' }}</div>
            </div>
            <!-- 文件元信息 -->
            <div class="file-meta">
              <div class="meta-row">
                <span class="meta-key">文件名</span>
                <span class="meta-val">{{ data.fileName }}</span>
              </div>
              <div class="meta-row">
                <span class="meta-key">类型</span>
                <span class="meta-val type-badge">
                  {{ data.fileType === 'image' ? '图片' : '文本' }}
                </span>
              </div>
              <div class="meta-row">
                <span class="meta-key">识别时间</span>
                <span class="meta-val">{{ data.recognitionTime }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 2.标签分布图表 移至左侧原文件下方 -->
        <section class="section-card chart-card animate-fade-in-up delay-2">
          <div class="section-head">
            <span class="section-head-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                   stroke-linejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </span>
            <span>标签分布</span>
          </div>
          <div class="section-body">
            <div ref="chartRef" class="chart" />
          </div>
        </section>
      </div>
      <!-- ═══ 右侧：结构化数据 + 相似资源 ═══ -->
      <div class="grid-secondary animate-fade-in-up delay-2">
        <section class="section-card">
          <div class="section-head">
            <span class="section-head-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                   stroke-linejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </span>
            <span>结构化识别结果</span>
          </div>
          <div class="section-body">
            <!-- 基本信息 -->
            <div class="info-grid">
              <div class="info-cell">
                <span class="info-cell-label">作品标题</span>
                <span class="info-cell-value title-value">{{ data.result?.title || '未知' }}</span>
              </div>
              <div class="info-cell">
                <span class="info-cell-label">作者</span>
                <span class="info-cell-value">{{ data.result?.author || '未知' }}</span>
              </div>
              <div class="info-cell">
                <span class="info-cell-label">朝代</span>
                <span class="info-cell-value dynasty-badge">{{ data.result?.dynasty || '未知' }}</span>
              </div>
              <div class="info-cell">
                <span class="info-cell-label">识别置信度</span>
                <span class="info-cell-value">
                  <span class="confidence-bar">
                    <span class="confidence-fill" :style="{ width: confidencePct + '%' }" />
                  </span>
                  <span class="confidence-num">{{ confidencePct }}%</span>
                </span>
              </div>
            </div>
            <!-- 标签 -->
            <div class="tags-row">
              <span class="tags-label">标签</span>
              <div class="tags-list">
                <span
                  v-for="tag in data.result?.tags"
                  :key="tag"
                  class="tag"
                >{{ tag }}</span>
                <span v-if="!data.result?.tags?.length" class="no-tags">暂无</span>
              </div>
            </div>
            <!-- 描述 -->
            <div class="desc-block">
              <span class="desc-label">作品描述</span>
              <p class="desc-text">{{ data.result?.description || '暂无描述' }}</p>
            </div>
            <!-- 完整内容 -->
            <div v-if="data.result?.content" class="content-block">
              <span class="content-label">完整内容</span>
              <div class="content-text">{{ data.result.content }}</div>
            </div>
          </div>
        </section>
        <!-- 相似资源 -->
        <section class="section-card animate-fade-in-up delay-3">
          <div class="section-head">
            <span class="section-head-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                   stroke-linejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <span>浏览相似</span>
          </div>
          <div class="section-body">
            <button class="similar-btn" @click="goSearch">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round"
                   stroke-linejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              检索相似资源
            </button>
          </div>
        </section>
      </div>
    </div>
    <!-- 无数据 -->
    <div v-else class="detail-empty animate-fade-in">
      <p>未找到识别结果</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import type { RecognitionResult } from '@/types'
import { getRecognitionResultApi } from '@/api/recognition'
const route = useRoute()
const router = useRouter()
const loading = ref(false)
const data = ref<RecognitionResult | null>(null)
const chartRef = ref<HTMLDivElement>()
const placeholderImg = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22 fill=%22%23f0f0f5%22%3E%3Crect width=%22400%22 height=%22300%22 rx=%228%22/%3E%3Ctext x=%22200%22 y=%22150%22 text-anchor=%22middle%22 fill=%22%23a0a0b8%22 font-size=%2214%22%3E图片预览%3C/text%3E%3C/svg%3E'
const confidencePct = computed(() => {
  const c = data.value?.result?.confidence || 0
  return Math.round(c * 100)
})
// 动态生成图表数据：根据后端返回tags生成，每个标签权重固定10
const chartData = computed(() => {
  const tags = data.value?.result?.tags || []
  return tags.map(tag => ({
    name: tag,
    value: 10
  }))
})
const getChartColors = () => {
  const s = getComputedStyle(document.documentElement)
  return [
    s.getPropertyValue('--cinnabar').trim() || '#c23b22',
    s.getPropertyValue('--gold').trim() || '#c9a96e',
    s.getPropertyValue('--celadon').trim() || '#7aab8c',
    s.getPropertyValue('--azure').trim() || '#5b7fa5',
    '#9168b8', '#489cc2', '#d4886a'
  ]
}
// 初始化图表
const initChart = () => {
  if (!chartRef.value || !data.value) return
  const chart = echarts.init(chartRef.value)
  const colors = getChartColors()
  const dataList = chartData.value
  chart.setOption({
    tooltip: {
      trigger: 'item',
      backgroundColor: 'var(--bg-card)',
      borderColor: 'var(--border-color)',
      borderWidth: 1,
      textStyle: { color: 'var(--text-regular)', fontSize: 12 }
    },
    series: [{
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['50%', '50%'],
      padAngle: 3,
      itemStyle: {
        borderRadius: 4,
        borderColor: 'var(--bg-card)',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{b}',
        fontSize: 11,
        color: 'var(--text-secondary)',
        lineHeight: 16
      },
      emphasis: {
        label: { fontSize: 13, fontWeight: 'bold' },
        itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.1)' }
      },
      data: dataList.map((item, i) => ({
        ...item,
        itemStyle: { color: colors[i % colors.length] }
      }))
    }]
  })
  // 窗口自适应
  window.addEventListener('resize', () => chart.resize())
}
// 监听数据变化，数据加载完成后渲染图表
watch(data, async (newVal) => {
  if (newVal) {
    await nextTick()
    initChart()
  }
}, { immediate: true })
const fetchData = async () => {
  const id = route.params.id as string
  if (!id) {
    ElMessage.error('参数错误')
    return
  }
  loading.value = true
  try {
    const res = await getRecognitionResultApi(id)
    data.value = res as unknown as RecognitionResult
  } catch (err: any) {
    ElMessage.error(err?.message || '获取识别结果失败，千问AI识别异常')
  } finally {
    loading.value = false
  }
}
const exportResult = () => {
  if (!data.value) return
  const blob = new Blob([JSON.stringify(data.value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `recognition_${data.value.id}.json`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('已导出')
}
const printPage = () => window.print()
const goBack = () => router.back()
const goSearch = () => {
  const title = data.value?.result?.title
  if (title) {
    router.push(`/search?keyword=${encodeURIComponent(title)}`)
  } else {
    router.push('/search')
  }
}
onMounted(() => fetchData())
</script>
<style scoped lang="scss">
// ═══════════════════════════════════════════
// 当代山水 · 识别详情
// ═══════════════════════════════════════════
.detail {
  // ── 页面引导 ──
  .page-lead {
    margin-bottom: var(--space-xl);
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
      flex-wrap: wrap;
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
      flex-shrink: 0;
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
    &.back-top-btn {
      color: var(--cinnabar);
    }
  }
  // ── 骨架 ──
  .skeleton-area {
    .skeleton-block {
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-color);
      animation: shimmer 1.5s infinite;
      background-image: linear-gradient(
        90deg,
        var(--bg-card) 0%,
        var(--border-color) 50%,
        var(--bg-card) 100%
      );
      background-size: 200% 100%;
    }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  // ── 网格 ──
  .detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-lg);
    align-items: start;
    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }
  // ── 区块卡片 ──
  .section-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-xl);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition: box-shadow var(--transition-normal);
    margin-bottom: var(--space-lg);
    .section-head {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 14px var(--space-lg);
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
      border-bottom: 1px solid var(--border-color);
      background: oklch(99% 0.002 55);
      letter-spacing: 1px;
      [data-theme='dark'] & {
        background: oklch(14% 0.003 55);
      }
      .section-head-icon {
        display: inline-flex;
        color: var(--cinnabar);
      }
    }
    .section-body {
      padding: var(--space-lg);
    }
  }
  // ── 左栏 ──
  .grid-primary {
    .image-preview {
      margin-bottom: var(--space-md);
      .image-frame {
        background: var(--bg-body);
        border-radius: var(--radius-md);
        overflow: hidden;
        border: 1px solid var(--border-light);
        img {
          width: 100%;
          max-height: 360px;
          object-fit: contain;
          display: block;
          background: #fff;
        }
      }
    }
    .text-preview {
      margin-bottom: var(--space-md);
      .text-scroll {
        max-height: 300px;
        overflow-y: auto;
        font-size: 14px;
        line-height: 1.8;
        color: var(--text-regular);
        white-space: pre-wrap;
        padding: var(--space-md);
        background: var(--bg-body);
        border-radius: var(--radius-md);
        border: 1px solid var(--border-light);
      }
    }
    .file-meta {
      .meta-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        font-size: 13px;
        &:not(:last-child) {
          border-bottom: 1px solid var(--border-light);
        }
        .meta-key {
          color: var(--text-secondary);
        }
        .meta-val {
          color: var(--text-primary);
          font-weight: 500;
          &.type-badge {
            font-size: 11px;
            padding: 1px 10px;
            border-radius: var(--radius-full);
            background: oklch(50% 0.16 28 / 0.06);
            color: var(--cinnabar);
          }
        }
      }
    }
  }
  // ── 右栏 ──
  .grid-secondary {
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
      margin-bottom: var(--space-md);
      .info-cell {
        padding: 10px 0;
        border-bottom: 1px solid var(--border-light);
        &:nth-child(odd) {
          padding-right: 12px;
        }
        &:nth-child(even) {
          padding-left: 12px;
          border-left: 1px solid var(--border-light);
        }
        .info-cell-label {
          display: block;
          font-size: 11px;
          color: var(--text-tertiary);
          margin-bottom: 4px;
          letter-spacing: 0.5px;
        }
        .info-cell-value {
          font-size: 14px;
          color: var(--text-primary);
          font-weight: 500;
          &.title-value {
            font-family: var(--font-heading);
            font-size: 16px;
            font-weight: 700;
          }
          &.dynasty-badge {
            display: inline-block;
            font-size: 12px;
            padding: 0 10px;
            border-radius: var(--radius-full);
            background: oklch(50% 0.16 28 / 0.06);
            color: var(--cinnabar);
            font-weight: 600;
          }
        }
        .confidence-bar {
          display: inline-block;
          width: 80px;
          height: 6px;
          background: var(--border-color);
          border-radius: 3px;
          overflow: hidden;
          vertical-align: middle;
          margin-right: 6px;
          .confidence-fill {
            display: block;
            height: 100%;
            border-radius: 3px;
            background: linear-gradient(90deg, var(--cinnabar), oklch(55% 0.16 28));
            transition: width 0.8s var(--ease-out-expo);
          }
        }
        .confidence-num {
          font-size: 12px;
          color: var(--cinnabar);
          font-weight: 600;
        }
      }
    }
    .tags-row {
      display: flex;
      gap: 10px;
      margin-bottom: var(--space-md);
      padding-bottom: var(--space-md);
      border-bottom: 1px solid var(--border-light);
      .tags-label {
        font-size: 12px;
        color: var(--text-tertiary);
        flex-shrink: 0;
        padding-top: 2px;
      }
      .tags-list {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        .tag {
          font-size: 11px;
          padding: 2px 12px;
          border-radius: var(--radius-full);
          background: oklch(50% 0.16 28 / 0.06);
          color: var(--cinnabar);
          letter-spacing: 0.5px;
        }
        .no-tags {
          font-size: 12px;
          color: var(--text-tertiary);
        }
      }
    }
    .desc-block {
      margin-bottom: var(--space-md);
      .desc-label {
        display: block;
        font-size: 12px;
        color: var(--text-tertiary);
        margin-bottom: 6px;
      }
      .desc-text {
        font-size: 13px;
        color: var(--text-secondary);
        line-height: 1.8;
      }
    }
    .content-block {
      .content-label {
        display: block;
        font-size: 12px;
        color: var(--text-tertiary);
        margin-bottom: 6px;
      }
      .content-text {
        font-size: 14px;
        color: var(--text-regular);
        line-height: 2;
        max-height: 240px;
        overflow-y: auto;
        padding: var(--space-md);
        background: var(--bg-body);
        border-radius: var(--radius-md);
        border: 1px solid var(--border-light);
        font-family: var(--font-heading);
      }
    }
  }
  // ── 图表 ──
  .chart-card {
    .chart {
      height: 260px;
      width: 100%;
    }
  }
  // ── 相似 ──
  .similar-btn {
    all: unset;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0 20px;
    height: 40px;
    font-size: 13px;
    letter-spacing: 1px;
    color: #fff;
    background: linear-gradient(135deg, var(--cinnabar), oklch(42% 0.14 28));
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px oklch(50% 0.16 28 / 0.25);
    }
  }
  // ── 空 ──
  .detail-empty {
    text-align: center;
    padding: var(--space-4xl) 0;
    font-size: 15px;
    color: var(--text-secondary);
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
@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>