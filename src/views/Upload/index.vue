<template>
  <div class="upload-page">
    <el-card class="upload-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="title">资源上传</span>
          <el-tag type="info">支持图片和文本文件</el-tag>
        </div>
      </template>

      <el-tabs v-model="activeTab" class="upload-tabs">
        <!-- 图片上传 -->
        <el-tab-pane label="图片上传" name="image">
          <el-upload
            class="image-uploader"
            drag
            :auto-upload="false"
            :on-change="handleImageChange"
            :before-upload="beforeUpload"
            :limit="1"
            accept="image/jpeg,image/png,image/jpg,image/webp"
          >
            <el-icon class="upload-icon"><Upload /></el-icon>
            <div class="upload-text">
              <span>点击或拖拽图片到此区域上传</span>
              <span class="upload-hint">支持 JPG、PNG、WEBP 格式，单张不超过 10MB</span>
            </div>
          </el-upload>

          <!-- 预览区域 -->
          <div v-if="imagePreview" class="preview-container">
            <div class="preview-header">
              <span>图片预览</span>
              <el-button type="danger" link @click="clearImage">清除</el-button>
            </div>
            <el-image :src="imagePreview" fit="contain" class="preview-image" />
            <div class="preview-info">
              <span>文件名: {{ currentFile?.name }}</span>
              <span>大小: {{ formatFileSize(currentFile?.size || 0) }}</span>
            </div>
            <el-button type="primary" :loading="uploadLoading" @click="uploadImage">
              {{ uploadLoading ? '识别中...' : '开始识别' }}
            </el-button>
          </div>
        </el-tab-pane>

        <!-- 文本上传 -->
        <el-tab-pane label="文本上传" name="text">
          <el-form :model="textForm" :rules="textRules" ref="textFormRef" label-width="80px">
            <el-form-item label="标题" prop="title">
              <el-input v-model="textForm.title" placeholder="请输入文本标题" />
            </el-form-item>
            <el-form-item label="内容" prop="content">
              <el-input
                v-model="textForm.content"
                type="textarea"
                :rows="10"
                placeholder="请输入或粘贴文本内容..."
                maxlength="10000"
                show-word-limit
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="textUploadLoading" @click="uploadText">
                {{ textUploadLoading ? '识别中...' : '提交识别' }}
              </el-button>
              <el-button @click="resetTextForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 识别结果弹窗 -->
    <el-dialog v-model="resultDialogVisible" title="识别结果" width="600px">
      <div class="result-content">
        <el-alert
          title="识别完成"
          type="success"
          :description="`文件 ${currentFile?.name || textForm.title} 已成功识别`"
          show-icon
        />
        <div style="margin-top: 16px">
          <p>识别结果ID: {{ resultId }}</p>
          <p>识别时间: {{ new Date().toLocaleString() }}</p>
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
import type { UploadFile, UploadRawFile } from 'element-plus'
import type { FormInstance } from 'element-plus'

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

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 图片上传前验证
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

// 图片选择变化
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

// 清除图片
const clearImage = () => {
  imagePreview.value = ''
  currentFile.value = null
}

// 上传图片
const uploadImage = async () => {
  if (!currentFile.value) {
    ElMessage.warning('请先选择图片')
    return
  }

  uploadLoading.value = true
  
  // 模拟上传和识别
  setTimeout(() => {
    resultId.value = 'mock-id-' + Date.now()
    resultDialogVisible.value = true
    clearImage()
    ElMessage.success('上传成功，识别完成')
    uploadLoading.value = false
  }, 1500)
}

// 上传文本
const uploadText = async () => {
  if (!textFormRef.value) return

  await textFormRef.value.validate(async (valid) => {
    if (!valid) return

    textUploadLoading.value = true
    
    // 模拟上传和识别
    setTimeout(() => {
      resultId.value = 'mock-id-' + Date.now()
      resultDialogVisible.value = true
      resetTextForm()
      ElMessage.success('提交成功，识别完成')
      textUploadLoading.value = false
    }, 1500)
  })
}

// 重置文本表单
const resetTextForm = () => {
  textForm.title = ''
  textForm.content = ''
}

// 跳转详情
const goToDetail = () => {
  router.push(`/recognition/${resultId.value}`)
  resultDialogVisible.value = false
}
</script>

<style scoped lang="scss">
.upload-page {
  .upload-card {
    max-width: 1200px;
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
  
  .image-uploader {
    :deep(.el-upload-dragger) {
      padding: 40px;
      
      .upload-icon {
        font-size: 48px;
        color: #409eff;
        margin-bottom: 16px;
      }
      
      .upload-text {
        display: flex;
        flex-direction: column;
        gap: 8px;
        
        .upload-hint {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
  
  .preview-container {
    margin-top: 24px;
    padding: 16px;
    background: #f5f7fa;
    border-radius: 8px;
    
    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      font-weight: 600;
    }
    
    .preview-image {
      width: 100%;
      max-height: 400px;
      margin-bottom: 12px;
      border-radius: 4px;
    }
    
    .preview-info {
      display: flex;
      gap: 24px;
      font-size: 12px;
      color: #666;
      margin-bottom: 16px;
    }
  }
}
</style>