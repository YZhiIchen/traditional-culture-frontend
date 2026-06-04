<template>
  <div class="result-page">
    <el-card class="result-card" shadow="never" v-loading="loading">
      <template #header>
        <div class="card-header">
          <span class="title">识别结果详情</span>
          <div>
            <el-button type="primary" :icon="Download" @click="exportResult">导出结果</el-button>
            <el-button :icon="Printer" @click="printResult">打印</el-button>
          </div>
        </div>
      </template>

      <div v-if="resultData" class="result-content">
        <!-- 左右两栏布局 -->
        <el-row :gutter="24">
          <!-- 左侧原文件 -->
          <el-col :xs="24" :sm="12">
            <div class="section">
              <div class="section-title">
                <el-icon><Picture /></el-icon>
                <span>原文件</span>
              </div>
              <div class="original-file">
                <div v-if="resultData.fileType === 'image'" class="image-viewer">
                  <el-image :src="resultData.fileUrl" fit="contain" class="original-image" />
                </div>
                <div v-else class="text-viewer">
                  <el-input type="textarea" :rows="20" :model-value="resultData.rawData?.content" readonly />
                </div>
                <div class="file-info">
                  <el-descriptions :column="1" border size="small">
                    <el-descriptions-item label="文件名">{{ resultData.fileName }}</el-descriptions-item>
                    <el-descriptions-item label="文件类型">{{ resultData.fileType }}</el-descriptions-item>
                    <el-descriptions-item label="识别时间">{{ resultData.recognitionTime }}</el-descriptions-item>
                  </el-descriptions>
                </div>
              </div>
            </div>
          </el-col>

          <!-- 右侧结构化结果 -->
          <el-col :xs="24" :sm="12">
            <div class="section">
              <div class="section-title">
                <el-icon><DataAnalysis /></el-icon>
                <span>结构化识别结果</span>
              </div>
              <div class="structured-result">
                <el-descriptions :column="1" border>
                  <el-descriptions-item label="作品标题">
                    <strong>{{ resultData.result?.title || '未知' }}</strong>
                  </el-descriptions-item>
                  <el-descriptions-item label="作者">
                    {{ resultData.result?.author || '未知' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="朝代">
                    <el-tag :type="getDynastyTagType(resultData.result?.dynasty)">
                      {{ resultData.result?.dynasty || '未知' }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="识别置信度">
                    <el-progress :percentage="confidencePercent" :color="getConfidenceColor" />
                  </el-descriptions-item>
                  <el-descriptions-item label="标签">
                    <el-tag
                      v-for="tag in resultData.result?.tags"
                      :key="tag"
                      size="small"
                      style="margin: 4px"
                      effect="plain"
                    >
                      {{ tag }}
                    </el-tag>
                    <el-tag v-if="!resultData.result?.tags?.length" size="small" type="info">暂无标签</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="作品描述">
                    <div class="description">{{ resultData.result?.description || '暂无描述' }}</div>
                  </el-descriptions-item>
                  <el-descriptions-item label="完整内容" v-if="resultData.result?.content">
                    <div class="full-content">{{ resultData.result?.content }}</div>
                  </el-descriptions-item>
                </el-descriptions>

                <!-- 统计图表 -->
                <div class="statistics" v-if="statisticsData">
                  <div class="sub-title">统计分析</div>
                  <div ref="chartRef" class="chart"></div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button @click="goBack">返回</el-button>
          <el-button type="primary" @click="goToSearch">检索相似资源</el-button>
        </div>
      </div>

      <el-empty v-else description="未找到识别结果" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Download, Printer, Picture, DataAnalysis } from '@element-plus/icons-vue'
import { getRecognitionResultApi } from '@/api/recognition'
import type { RecognitionResult } from '@/types'
import * as echarts from 'echarts'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const resultData = ref<RecognitionResult | null>(null)
const chartRef = ref<HTMLDivElement>()

const confidencePercent = computed(() => {
  return ((resultData.value?.result?.confidence || 0) * 100).toFixed(0)
})

const getConfidenceColor = computed(() => {
  const percent = parseInt(confidencePercent.value)
  if (percent >= 80) return '#67c23a'
  if (percent >= 60) return '#e6a23c'
  return '#f56c6c'
})

const getDynastyTagType = (dynasty?: string) => {
  const types: Record<string, string> = {
    '唐': 'success',
    '宋': 'primary',
    '元': 'warning',
    '明': 'info',
    '清': 'danger'
  }
  return types[dynasty || ''] || 'info'
}

// 统计数据（示例）
const statisticsData = ref({
  tagsDistribution: [
    { name: '山水', value: 85 },
    { name: '人物', value: 60 },
    { name: '花鸟', value: 45 },
    { name: '书法', value: 30 }
  ]
})

// 获取数据
const fetchData = async () => {
  const id = route.params.id as string
  if (!id) {
    ElMessage.error('参数错误')
    return
  }

  loading.value = true
  try {
    const res = await getRecognitionResultApi(id)
    resultData.value = res.data
    await nextTick()
    initChart()
  } catch (error) {
    ElMessage.error('获取识别结果失败')
  } finally {
    loading.value = false
  }
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  const chart = echarts.init(chartRef.value)
  chart.setOption({
    title: {
      text: '标签分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: statisticsData.value.tagsDistribution,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  })
}

// 导出结果
const exportResult = () => {
  const data = JSON.stringify(resultData.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `recognition_${resultData.value?.id}.json`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('导出成功')
}

// 打印
const printResult = () => {
  window.print()
}

// 返回
const goBack = () => {
  router.back()
}

// 检索相似资源
const goToSearch = () => {
  if (resultData.value?.result?.title) {
    router.push(`/search?keyword=${encodeURIComponent(resultData.value.result.title)}`)
  } else {
    router.push('/search')
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.result-page {
  .result-card {
    max-width: 1400px;
    margin: 0 auto;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .title {
        font-size: 18px;
        font-weight: 600;
      }
    }
  }
  
  .result-content {
    .section {
      margin-bottom: 24px;
      
      .section-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 2px solid #409eff;
      }
      
      .original-image {
        width: 100%;
        max-height: 400px;
        object-fit: contain;
      }
      
      .file-info {
        margin-top: 16px;
      }
      
      .structured-result {
        .description, .full-content {
          line-height: 1.8;
          text-indent: 2em;
        }
        
        .statistics {
          margin-top: 24px;
          
          .sub-title {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 12px;
          }
          
          .chart {
            height: 300px;
          }
        }
      }
    }
    
    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e8e8e8;
    }
  }
}

@media print {
  .action-buttons, .card-header :deep(.el-button) {
    display: none;
  }
}
</style>