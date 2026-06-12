<template>
  <div class="result-page">
    <!-- 页面标题 -->
    <div class="page-header animate-fade-in-up">
      <h1 class="page-title">
        <span class="page-title-deco">◆</span>
        识别结果详情
        <span class="page-title-deco">◆</span>
      </h1>
      <div class="header-actions">
        <el-button type="primary" :icon="Download" @click="exportResult">导出结果</el-button>
        <el-button :icon="Printer" @click="printResult">打印</el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-area animate-fade-in">
      <el-skeleton :rows="6" animated class="skeleton" />
    </div>

    <!-- 结果卡片 -->
    <div v-else-if="resultData" class="result-content">
      <el-row :gutter="24">
        <!-- 左侧：原文件 -->
        <el-col :xs="24" :md="12">
          <div class="section-card animate-fade-in-up delay-1">
            <div class="section-header">
              <el-icon class="section-icon"><Picture /></el-icon>
              <span>原文件</span>
            </div>

            <div class="section-body">
              <!-- 图片预览 -->
              <div v-if="resultData.fileType === 'image'" class="image-viewer">
                <el-image
                  :src="resultData.fileUrl || placeholderImg"
                  fit="contain"
                  class="preview-image"
                >
                  <template #error>
                    <div class="img-placeholder">
                      <el-icon :size="32"><Picture /></el-icon>
                      <span>预览不可用</span>
                    </div>
                  </template>
                </el-image>
              </div>

              <!-- 文本预览 -->
              <div v-else class="text-viewer">
                <div class="text-content">{{ resultData.rawData?.content || '(无原始文本)' }}</div>
              </div>

              <!-- 文件信息 -->
              <div class="file-meta">
                <el-descriptions :column="1" border size="small">
                  <el-descriptions-item label="文件名">
                    <span class="meta-value">{{ resultData.fileName }}</span>
                  </el-descriptions-item>
                  <el-descriptions-item label="文件类型">
                    <el-tag size="small" effect="plain">
                      {{ resultData.fileType === 'image' ? '图片' : '文本' }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="识别时间">
                    <span class="meta-value">{{ resultData.recognitionTime }}</span>
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </div>
          </div>
        </el-col>

        <!-- 右侧：结构化识别结果 -->
        <el-col :xs="24" :md="12">
          <div class="section-card animate-fade-in-up delay-2">
            <div class="section-header">
              <el-icon class="section-icon"><DataAnalysis /></el-icon>
              <span>结构化识别结果</span>
            </div>

            <div class="section-body">
              <el-descriptions :column="1" border size="small">
                <el-descriptions-item label="作品标题">
                  <strong>{{ resultData.result?.title || '未知' }}</strong>
                </el-descriptions-item>
                <el-descriptions-item label="作者">
                  {{ resultData.result?.author || '未知' }}
                </el-descriptions-item>
                <el-descriptions-item label="朝代">
                  <el-tag :type="getDynastyTagType(resultData.result?.dynasty)" size="small" effect="plain">
                    {{ resultData.result?.dynasty || '未知' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="识别置信度">
                  <el-progress
                    :percentage="confidencePercent"
                    :color="getConfidenceColor"
                    :stroke-width="12"
                    :format="() => confidencePercent + '%'"
                  />
                </el-descriptions-item>
                <el-descriptions-item label="标签">
                  <div class="tags-area">
                    <el-tag
                      v-for="tag in resultData.result?.tags"
                      :key="tag"
                      size="small"
                      effect="plain"
                      class="tag-item"
                    >
                      {{ tag }}
                    </el-tag>
                    <span v-if="!resultData.result?.tags?.length" class="no-tags">暂无标签</span>
                  </div>
                </el-descriptions-item>
                <el-descriptions-item label="作品描述">
                  <div class="description-text">{{ resultData.result?.description || '暂无描述' }}</div>
                </el-descriptions-item>
                <el-descriptions-item label="完整内容" v-if="resultData.result?.content">
                  <div class="full-content">{{ resultData.result?.content }}</div>
                </el-descriptions-item>
              </el-descriptions>

              <!-- 统计图表 -->
              <div class="statistics-section">
                <div class="stats-header">
                  <span class="stats-dot" />
                  统计分析
                </div>
                <div ref="chartRef" class="chart-container" />
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 操作按钮 -->
      <div class="action-bar animate-fade-in-up delay-4">
        <el-button size="large" @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <el-button type="primary" size="large" @click="goToSearch">
          检索相似资源
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 无数据 -->
    <div v-else class="empty-area animate-fade-in">
      <el-empty description="未找到识别结果" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Download, Printer, Picture, DataAnalysis, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import type { RecognitionResult } from '@/types'
import * as echarts from 'echarts'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const resultData = ref<RecognitionResult | null>(null)
const chartRef = ref<HTMLDivElement>()
const placeholderImg = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="%23f0f0f5"%3E%3Crect width="400" height="300" rx="8"/%3E%3Ctext x="200" y="150" text-anchor="middle" fill="%23a0a0b8" font-size="14"%3E图片预览%3C/text%3E%3C/svg%3E'

const confidencePercent = computed(() => {
  const conf = resultData.value?.result?.confidence || 0
  return Math.round(conf * 100)
})

const getConfidenceColor = computed(() => {
  const pct = confidencePercent.value
  if (pct >= 80) return '#7aab8c'
  if (pct >= 60) return '#d4a84b'
  return '#c23b22'
})

const getDynastyTagType = (dynasty?: string) => {
  const map: Record<string, string> = {
    '唐': 'success',
    '宋': 'primary',
    '元': 'warning',
    '明': 'info',
    '清': 'danger'
  }
  return map[dynasty || ''] || 'info'
}

// 获取 ECharts 颜色（实时读取 CSS 变量）
const getChartColors = (): string[] => {
  const style = getComputedStyle(document.documentElement)
  return [
    style.getPropertyValue('--cinnabar').trim() || '#c23b22',
    style.getPropertyValue('--gold').trim() || '#c9a96e',
    style.getPropertyValue('--celadon').trim() || '#7aab8c',
    style.getPropertyValue('--azure').trim() || '#5b7fa5'
  ]
}

// 模拟统计
const statisticsData = {
  tagsDistribution: [
    { name: '山水', value: 85 },
    { name: '人物', value: 60 },
    { name: '花鸟', value: 45 },
    { name: '书法', value: 30 }
  ]
}

const fetchData = async () => {
  const id = route.params.id as string
  if (!id) {
    ElMessage.error('参数错误')
    return
  }

  loading.value = true
  try {
    // 模拟请求对接
    // const res = await getRecognitionResultApi(id)
    // resultData.value = res

    // 模拟数据
    await new Promise(r => setTimeout(r, 500))
    resultData.value = {
      id,
      fileId: 'file-001',
      fileName: '示例文件.jpg',
      fileType: 'image',
      recognitionTime: new Date().toLocaleString(),
      result: {
        title: '山水图卷',
        dynasty: '唐',
        author: '王维（传）',
        description: '此卷以水墨描绘江南山水景致，山峦叠嶂，云雾缭绕，意境深远。',
        tags: ['山水', '水墨', '唐代', '王维'],
        content: '空山不见人，但闻人语响。返景入深林，复照青苔上。',
        confidence: 0.87
      },
      rawData: {
        content: '空山不见人，但闻人语响。返景入深林，复照青苔上。'
      }
    }

    await nextTick()
    initChart()
  } catch (error) {
    ElMessage.error('获取识别结果失败')
  } finally {
    loading.value = false
  }
}

const initChart = () => {
  if (!chartRef.value || !resultData.value) return

  const chart = echarts.init(chartRef.value)

  chart.setOption({
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderColor: 'var(--border-color)',
      borderWidth: 1,
      textStyle: {
        color: 'var(--text-primary)',
        fontSize: 12
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['42%', '68%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        padAngle: 2,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}',
          fontSize: 12,
          color: 'var(--text-secondary)'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0,0,0,0.15)'
          }
        },
        data: statisticsData.tagsDistribution.map((item, i) => ({
          ...item,
          itemStyle: {
            color: getChartColors()[i % 4]
          }
        }))
      }
    ]
  })
}

const exportResult = () => {
  const data = JSON.stringify(resultData.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `recognition_${resultData.value?.id || 'result'}.json`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('导出成功')
}

const printResult = () => window.print()
const goBack = () => router.back()

const goToSearch = () => {
  const title = resultData.value?.result?.title
  if (title) {
    router.push(`/search?keyword=${encodeURIComponent(title)}`)
  } else {
    router.push('/search')
  }
}

onMounted(() => fetchData())
</script>

<style scoped lang="scss">
.result-page {
  // ── 页面标题 ──
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
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

    .header-actions {
      display: flex;
      gap: 8px;
    }
  }

  // ── 加载骨架 ──
  .loading-area {
    .skeleton {
      padding: 24px;
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-color);
    }
  }

  // ── 分区卡片 ──
  .section-card {
    background: var(--bg-card);
    backdrop-filter: blur(8px);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    overflow: hidden;
    margin-bottom: 24px;
    transition: box-shadow var(--transition-normal);

    &:hover {
      box-shadow: var(--shadow-md);
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px 20px;
      font-size: 15px;
      font-weight: 600;
      color: var(--text-primary);
      border-bottom: 1px solid var(--border-color);
      background: rgba(245, 240, 232, 0.3);

      .section-icon {
        color: var(--cinnabar);
        font-size: 18px;
      }
    }

    .section-body {
      padding: 20px;
    }
  }

  // ── 图片预览 ──
  .image-viewer {
    margin-bottom: 16px;

    .preview-image {
      width: 100%;
      max-height: 400px;
      border-radius: var(--radius-md);
      background: var(--bg-body);
    }

    .img-placeholder {
      height: 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: var(--ink-300);
      font-size: 13px;
    }
  }

  // ── 文本预览 ──
  .text-viewer {
    margin-bottom: 16px;
    max-height: 320px;
    overflow-y: auto;

    .text-content {
      font-size: 14px;
      line-height: 1.8;
      color: var(--text-regular);
      white-space: pre-wrap;
      word-break: break-all;
    }
  }

  // ── 文件元信息 ──
  .file-meta {
    :deep(.el-descriptions__table) {
      td, th {
        padding: 8px 12px !important;
      }
    }

    .meta-value {
      color: var(--text-primary);
      font-weight: 500;
    }
  }

  // ── 标签区 ──
  .tags-area {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;

    .tag-item {
      font-size: 11px;
    }

    .no-tags {
      font-size: 12px;
      color: var(--ink-300);
    }
  }

  // ── 描述 / 全文 ──
  .description-text {
    line-height: 1.8;
    color: var(--text-regular);
    font-size: 13px;
  }

  .full-content {
    line-height: 2;
    color: var(--text-regular);
    font-size: 14px;
    max-height: 300px;
    overflow-y: auto;
  }

  // ── 统计图表 ──
  .statistics-section {
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid var(--border-color);

    .stats-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-regular);
      margin-bottom: 16px;

      .stats-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--cinnabar);
      }
    }

    .chart-container {
      height: 280px;
      width: 100%;
    }
  }

  // ── 操作栏 ──
  .action-bar {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 8px;
    padding: 20px 0 0;

    .el-button {
      min-width: 140px;
      letter-spacing: 1px;
    }
  }

  // ── 空状态 ──
  .empty-area {
    padding: 60px 0;
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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
