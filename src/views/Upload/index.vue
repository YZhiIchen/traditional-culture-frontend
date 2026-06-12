<template>
  <div class="upload-page">
    <!-- 页面标题 -->
    <div class="page-header animate-fade-in-up">
      <div class="header-content">
        <h1 class="page-title">
          <span class="page-title-deco">◆</span>
          资源上传
          <span class="page-title-deco">◆</span>
        </h1>
        <p class="page-desc">上传传统文化资源，启动智能识别与数字化保存</p>
      </div>
      <el-tag type="primary" effect="plain" class="header-tag animate-fade-in-up delay-2">
        支持图片和文本文件
      </el-tag>
    </div>

    <!-- 上传选项卡卡片 -->
    <el-card shadow="never" class="upload-card animate-fade-in-up delay-1">
      <el-tabs v-model="activeTab" class="upload-tabs">
        <!-- ═══ 图片上传 ═══ -->
        <el-tab-pane label="图片上传" name="image">
          <div class="tab-content">
            <el-upload
              class="image-uploader"
              drag
              :auto-upload="false"
              :on-change="handleImageChange"
              :before-upload="beforeUpload"
              :limit="1"
              accept="image/jpeg,image/png,image/jpg,image/webp"
            >
              <el-icon class="upload-icon"><UploadFilled /></el-icon>
              <div class="upload-text">
                <span>点击或拖拽图片到此处上传</span>
                <span class="upload-hint">支持 JPG、PNG、WEBP 格式，单张不超过 10MB</span>
              </div>
            </el-upload>

            <!-- 预览区 + 识别操作 -->
            <transition name="preview">
              <div v-if="imagePreview" class="preview-container">
                <div class="preview-header">
                  <span class="preview-label">
                    <span class="label-dot" />
                    图片预览
                  </span>
                  <el-button type="danger" link size="small" @click="clearImage">
                    <el-icon><Delete /></el-icon>
                    清除
                  </el-button>
                </div>

                <div class="preview-image-wrapper">
                  <el-image :src="imagePreview" fit="contain" class="preview-image" />
                </div>

                <div class="preview-info">
                  <div class="info-item">
                    <span class="info-label">文件</span>
                    <span class="info-value">{{ currentFile?.name }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">大小</span>
                    <span class="info-value">{{ formatFileSize(currentFile?.size || 0) }}</span>
                  </div>
                </div>

                <el-button
                  type="primary"
                  size="large"
                  :loading="uploadLoading"
                  class="action-btn animate-fade-in-up delay-2"
                  @click="uploadImage"
                >
                  <el-icon v-if="!uploadLoading"><MagicStick /></el-icon>
                  {{ uploadLoading ? '识别中...' : '开始识别' }}
                </el-button>
              </div>
            </transition>

            <!-- 空状态 -->
            <div v-if="!imagePreview" class="empty-hint animate-fade-in delay-3">
              <span class="empty-deco">⛰</span>
              <span>选择图片后将在此显示预览</span>
            </div>
          </div>
        </el-tab-pane>

        <!-- ═══ 文本上传 ═══ -->
        <el-tab-pane label="文本上传" name="text">
          <div class="tab-content animate-fade-in-up">
            <el-form :model="textForm" :rules="textRules" ref="textFormRef" label-width="60px">
              <el-form-item label="标题" prop="title">
                <el-input
                  v-model="textForm.title"
                  placeholder="请输入文本标题"
                  :prefix-icon="EditPen"
                />
              </el-form-item>

              <el-form-item label="内容" prop="content">
                <el-input
                  v-model="textForm.content"
                  type="textarea"
                  :rows="12"
                  placeholder="请输入或粘贴文本内容..."
                  maxlength="10000"
                  show-word-limit
                />
              </el-form-item>

              <el-form-item>
                <div class="text-actions">
                  <el-button
                    type="primary"
                    size="large"
                    :loading="textUploadLoading"
                    @click="uploadText"
                  >
                    <el-icon v-if="!textUploadLoading"><MagicStick /></el-icon>
                    {{ textUploadLoading ? '识别中...' : '提交识别' }}
                  </el-button>
                  <el-button size="large" @click="resetTextForm">
                    <el-icon><Refresh /></el-icon>
                    重置
                  </el-button>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 识别结果对话框 -->
    <el-dialog
      v-model="resultDialogVisible"
      title="识别完成"
      width="520px"
      :close-on-click-modal="false"
      top="20vh"
    >
      <div class="dialog-result">
        <div class="dialog-success-icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" stroke="var(--cinnabar)" stroke-width="2" fill="rgba(194,59,34,0.06)" />
            <path d="M16 24L22 30L32 18" stroke="var(--cinnabar)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <p class="dialog-text">文件 <strong>{{ currentFile?.name || textForm.title }}</strong> 已成功识别</p>
        <div class="dialog-meta">
          <div class="meta-item">
            <span class="meta-label">识别 ID</span>
            <span class="meta-value">{{ resultId }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">识别时间</span>
            <span class="meta-value">{{ new Date().toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="resultDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="goToDetail">查看详情</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { UploadFile, UploadRawFile, FormInstance } from 'element-plus'
import { UploadFilled, Delete, MagicStick, EditPen, Refresh } from '@element-plus/icons-vue'

const router = useRouter()

// 状态
const activeTab = ref('image')
const imagePreview = ref('')
const currentFile = ref<File | null>(null)
const uploadLoading = ref(false)
const textUploadLoading = ref(false)
const resultDialogVisible = ref(false)
const resultId = ref('')

// 文本表单
const textFormRef = ref<FormInstance>()
const textForm = reactive({
  title: '',
  content: ''
})

const textRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
}

// ── 工具函数 ──

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// ── 图片上传 ──

const beforeUpload = (file: UploadRawFile) => {
  const isImage = file.type.startsWith('image/')
  const isLt10M = file.size / 1024 / 1024 < 10

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('图片大小不能超过 10MB!')
    return false
  }
  return true
}

const handleImageChange = (file: UploadFile) => {
  const rawFile = file.raw
  if (!rawFile) return
  currentFile.value = rawFile
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(rawFile)
}

const clearImage = () => {
  imagePreview.value = ''
  currentFile.value = null
}

const uploadImage = async () => {
  if (!currentFile.value) {
    ElMessage.warning('请先选择图片')
    return
  }
  uploadLoading.value = true
  setTimeout(() => {
    resultId.value = 'mock-id-' + Date.now()
    resultDialogVisible.value = true
    clearImage()
    ElMessage.success('上传成功，识别完成')
    uploadLoading.value = false
  }, 1500)
}

// ── 文本上传 ──

const uploadText = async () => {
  if (!textFormRef.value) return
  await textFormRef.value.validate(async (valid) => {
    if (!valid) return
    textUploadLoading.value = true
    setTimeout(() => {
      resultId.value = 'mock-id-' + Date.now()
      resultDialogVisible.value = true
      resetTextForm()
      ElMessage.success('提交成功，识别完成')
      textUploadLoading.value = false
    }, 1500)
  })
}

const resetTextForm = () => {
  textForm.title = ''
  textForm.content = ''
}

// ── 导航 ──

const goToDetail = () => {
  router.push(`/recognition/${resultId.value}`)
  resultDialogVisible.value = false
}
</script>

<style scoped lang="scss">
.upload-page {
  // ── 页面标题 ──
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;

    .header-content {
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

    .header-tag {
      flex-shrink: 0;
    }
  }

  // ── 上传卡片 ──
  .upload-card {
    position: relative;

    :deep(.el-card__body) {
      padding: 24px;
    }
  }

  .tab-content {
    min-height: 200px;
  }

  // ── 图片上传区 ──
  .image-uploader {
    width: 100%;

    :deep(.el-upload) {
      width: 100%;
    }

    :deep(.el-upload-dragger) {
      width: 100%;
      padding: 48px 24px;
      background: rgba(245, 240, 232, 0.4);
      border: 2px dashed var(--border-color);
      border-radius: var(--radius-lg);
      transition: all var(--transition-normal);

      &:hover {
        border-color: var(--cinnabar);
        background: rgba(194, 59, 34, 0.03);
      }

      .upload-icon {
        font-size: 48px;
        color: var(--cinnabar);
        opacity: 0.6;
        margin-bottom: 16px;
      }

      .upload-text {
        display: flex;
        flex-direction: column;
        gap: 8px;
        font-size: 14px;
        color: var(--text-secondary);

        .upload-hint {
          font-size: 12px;
          color: var(--ink-300);
        }
      }
    }
  }

  // ── 预览过渡 ──
  .preview-enter-active {
    animation: fadeInUp 0.35s ease both;
  }

  .preview-leave-active {
    animation: fadeInUp 0.2s ease reverse both;
  }

  // ── 预览区 ──
  .preview-container {
    margin-top: 24px;
    padding: 20px;
    background: rgba(245, 240, 232, 0.5);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-color);

    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .preview-label {
        font-size: 14px;
        font-weight: 600;
        color: var(--text-regular);
        display: flex;
        align-items: center;
        gap: 8px;

        .label-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--cinnabar);
        }
      }
    }

    .preview-image-wrapper {
      background: var(--bg-card-solid);
      border-radius: var(--radius-md);
      padding: 8px;
      margin-bottom: 16px;
      border: 1px solid var(--border-light);

      .preview-image {
        width: 100%;
        max-height: 400px;
        border-radius: 4px;
      }
    }

    .preview-info {
      display: flex;
      gap: 24px;
      margin-bottom: 20px;

      .info-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;

        .info-label {
          color: var(--text-secondary);
          background: var(--bg-body);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .info-value {
          color: var(--text-regular);
          font-weight: 500;
        }
      }
    }

    .action-btn {
      width: 100%;
      height: 44px;
      font-size: 15px;
      letter-spacing: 2px;
      border-radius: var(--radius-md);
    }
  }

  // ── 空状态 ──
  .empty-hint {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 40px 0;
    color: var(--text-secondary);
    font-size: 13px;

    .empty-deco {
      font-size: 32px;
      opacity: 0.15;
    }
  }

  // ── 文本表单 ──
  :deep(.el-form) {
    .el-form-item__label {
      font-weight: 500;
      color: var(--text-regular);
    }

    .el-input__wrapper {
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
      }
    }
  }

  .text-actions {
    display: flex;
    gap: 12px;
    margin-top: 8px;

    .el-button--primary {
      min-width: 160px;
      letter-spacing: 2px;
    }
  }

  // ── 对话框 ──
  :deep(.el-dialog) {
    border-radius: var(--radius-xl);
    background: var(--bg-card-solid);

    .el-dialog__body {
      padding: 24px 32px;
    }
  }

  .dialog-result {
    text-align: center;

    .dialog-success-icon {
      margin: 0 auto 16px;
    }

    .dialog-text {
      font-size: 15px;
      color: var(--text-regular);
      margin-bottom: 20px;
    }

    .dialog-meta {
      background: var(--bg-body);
      border-radius: var(--radius-md);
      padding: 16px;

      .meta-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        font-size: 13px;

        &:not(:last-child) {
          border-bottom: 1px solid var(--border-light);
        }

        .meta-label {
          color: var(--text-secondary);
        }

        .meta-value {
          color: var(--text-primary);
          font-weight: 500;
          font-family: monospace;
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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
