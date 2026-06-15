<template>
  <div class="upload">
    <!-- 页面标识 -->
    <div class="page-lead animate-fade-in-up">
      <div class="lead-badge">
        <span class="badge-line" />
        <span class="badge-text">01 · 上传</span>
        <span class="badge-line" />
      </div>
      <h1 class="lead-title">资源上架</h1>
      <p class="lead-desc">
        将传统文化资源载入平台，启动智能识别与数字化保存
      </p>
    </div>

    <!-- 主区域：非对称布局 -->
    <div class="upload-canvas">
      <!-- ↓↓↓ 左侧：上传面板 ↓↓↓ -->
      <div class="canvas-main animate-fade-in-up delay-1">
        <!-- Tab 切换 -->
        <div class="tab-bar">
          <button
            class="tab-item"
            :class="{ active: activeTab === 'image' }"
            @click="activeTab = 'image'"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                 stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            图片上传
          </button>
          <button
            class="tab-item"
            :class="{ active: activeTab === 'text' }"
            @click="activeTab = 'text'"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                 stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            文本上传
          </button>
        </div>

        <!-- ═══ 图片上传区 ═══ -->
        <div v-if="activeTab === 'image'" class="tab-panel">
          <!-- 拖拽区 -->
          <div
            class="dropzone"
            :class="{ 'has-file': !!imagePreview }"
            @drop.prevent="handleDrop"
            @dragover.prevent
            @click="triggerFileInput"
          >
            <input
              ref="fileInputRef"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              class="file-input-hidden"
              @change="handleFileSelect"
            />

            <template v-if="!imagePreview">
              <div class="dropzone-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="1" stroke-linecap="round"
                     stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <div class="dropzone-text">
                <span class="dropzone-main">点击或拖拽图片至此</span>
                <span class="dropzone-hint">JPG / PNG / WEBP · 单张 ≤ 10MB</span>
              </div>
            </template>

            <!-- 预览 -->
            <div v-else class="preview-wrap" @click.stop>
              <div class="preview-image">
                <img :src="imagePreview" alt="预览" />
              </div>
              <div class="preview-meta">
                <span class="meta-name">{{ currentFile?.name }}</span>
                <span class="meta-size">{{ formatSize(currentFile?.size || 0) }}</span>
              </div>
              <div class="preview-actions">
                <button class="preview-btn remove" @click.stop="clearImage">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  清除
                </button>
                <button class="preview-btn change" @click.stop="triggerFileInput">
                  重新选择
                </button>
              </div>
            </div>
          </div>

          <!-- 识别按钮 -->
          <button
            v-if="imagePreview"
            class="action-btn animate-fade-in-up delay-2"
            :class="{ loading: imageLoading }"
            :disabled="imageLoading"
            @click="recognizeImage"
          >
            <svg v-if="!imageLoading" width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                 stroke-linejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span>{{ imageLoading ? '识别中 …' : '智能识别' }}</span>
          </button>
        </div>

        <!-- ═══ 文本上传区 ═══ -->
        <div v-else class="tab-panel">
          <div class="text-form">
            <div class="field">
              <label class="field-label">作品标题</label>
              <input
                v-model="textForm.title"
                placeholder="为这份文本起个名字"
                class="field-input"
              />
            </div>

            <div class="field textarea-field">
              <label class="field-label">文本内容</label>
              <textarea
                v-model="textForm.content"
                placeholder="请输入或粘贴文本内容…"
                rows="12"
                maxlength="10000"
                class="field-textarea"
              />
              <span class="text-count">{{ textForm.content.length }} / 10000</span>
            </div>

            <div class="text-actions">
              <button
                class="action-btn"
                :class="{ loading: textLoading }"
                :disabled="textLoading"
                @click="submitText"
              >
                <svg v-if="!textLoading" width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                     stroke-linejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                <span>{{ textLoading ? '识别中 …' : '提交识别' }}</span>
              </button>
              <button class="ghost-btn" @click="resetText">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                     stroke-linejoin="round">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
                重置
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ↓↓↓ 右侧：提示卡片（非对称） ↓↓↓ -->
      <aside class="canvas-aside animate-fade-in-up delay-2">
        <div class="aside-card">
          <div class="aside-card-top">
            <span class="aside-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                   stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </span>
          </div>
          <h3 class="aside-title">使用提示</h3>
          <ul class="aside-list">
            <li>图片文字识别准确度与图片清晰度相关</li>
            <li>支持繁体 / 简体 / 古籍文字识别</li>
            <li>识别后自动生成结构化元数据</li>
          </ul>
        </div>

        <div class="aside-ornament">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="39" stroke="currentColor" stroke-width="0.5" opacity="0.15" />
            <path d="M20 50 Q30 35 40 38 Q50 41 60 28"
                  stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.12" />
            <circle cx="60" cy="28" r="2" fill="currentColor" opacity="0.08" />
          </svg>
        </div>
      </aside>
    </div>

    <!-- 识别结果对话框 -->
    <div v-if="resultVisible" class="result-modal-mask" @click.self="resultVisible = false">
      <div class="result-modal animate-fade-in-scale">
        <div class="result-modal-inner">
          <div class="result-check">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="var(--cinnabar)" stroke-width="1.5"
                      fill="oklch(50% 0.16 28 / 0.06)" />
              <path d="M16 24L22 30L32 18" stroke="var(--cinnabar)" stroke-width="2.5"
                    stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>

          <h2 class="result-title">识别完成</h2>
          <p class="result-desc">
            文件 <strong>{{ resultFileName }}</strong> 已成功处理
          </p>

          <div class="result-meta">
            <div class="result-meta-row">
              <span class="meta-k">识别 ID</span>
              <span class="meta-v">{{ resultId }}</span>
            </div>
            <div class="result-meta-row">
              <span class="meta-k">识别时间</span>
              <span class="meta-v">{{ resultTime }}</span>
            </div>
          </div>

          <div class="result-actions">
            <button class="ghost-btn" @click="resultVisible = false">关闭</button>
            <button class="action-btn" @click="goDetail">查看详情</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const activeTab = ref<'image' | 'text'>('image')
const fileInputRef = ref<HTMLInputElement>()
const imagePreview = ref('')
const currentFile = ref<File | null>(null)
const imageLoading = ref(false)
const textLoading = ref(false)

// 文本表单
const textForm = reactive({
  title: '',
  content: ''
})

// 结果弹窗
const resultVisible = ref(false)
const resultId = ref('')
const resultFileName = ref('')
const resultTime = ref('')

// ── 工具 ──

const formatSize = (bytes: number) => {
  if (!bytes) return '0 B'
  const k = 1024
  const units = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + units[i]
}

const triggerFileInput = () => fileInputRef.value?.click()

const handleFileSelect = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) processFile(file)
}

const handleDrop = (e: DragEvent) => {
  const file = e.dataTransfer?.files?.[0]
  if (file) processFile(file)
}

const processFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    ElMessage.warning('仅支持图片文件')
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    ElMessage.warning('图片不超过 10MB')
    return
  }

  currentFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const clearImage = () => {
  imagePreview.value = ''
  currentFile.value = null
}

const recognizeImage = () => {
  if (!currentFile.value) return
  imageLoading.value = true
  setTimeout(() => {
    resultFileName.value = currentFile.value?.name || ''
    showResult()
    clearImage()
    imageLoading.value = false
  }, 1200)
}

const submitText = () => {
  if (!textForm.title.trim() || !textForm.content.trim()) {
    ElMessage.warning('请填写标题和内容')
    return
  }

  textLoading.value = true
  setTimeout(() => {
    resultFileName.value = textForm.title
    showResult()
    resetText()
    textLoading.value = false
  }, 1200)
}

const showResult = () => {
  resultId.value = 'rec-' + Date.now().toString(36)
  resultTime.value = new Date().toLocaleString('zh-CN')
  resultVisible.value = true
  ElMessage.success('识别完成')
}

const resetText = () => {
  textForm.title = ''
  textForm.content = ''
}

const goDetail = () => {
  resultVisible.value = false
  router.push(`/recognition/${resultId.value}`)
}
</script>

<style scoped lang="scss">
// ═══════════════════════════════════════════
// 当代山水 · 资源上传
// ═══════════════════════════════════════════

.upload {
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
      max-width: 480px;
      line-height: 1.6;
    }
  }

  // ── 非对称画布 ──
  .upload-canvas {
    display: grid;
    grid-template-columns: 1fr 220px;
    gap: var(--space-lg);
    align-items: start;

    @media (max-width: 960px) {
      grid-template-columns: 1fr;
    }
  }

  // ── 主面板 ──
  .canvas-main {
    background: var(--bg-card);
    border-radius: var(--radius-xl);
    border: 1px solid var(--border-color);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
  }

  // ── Tab 栏 ──
  .tab-bar {
    display: flex;
    border-bottom: 1px solid var(--border-color);
    padding: 4px 4px 0;

    .tab-item {
      all: unset;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      font-size: 13px;
      color: var(--text-secondary);
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all var(--transition-fast);

      svg {
        opacity: 0.6;
        transition: opacity var(--transition-fast);
      }

      &:hover {
        color: var(--text-regular);
        background: oklch(50% 0.16 28 / 0.03);
      }

      &.active {
        color: var(--cinnabar);
        border-bottom-color: var(--cinnabar);

        svg {
          opacity: 1;
        }
      }
    }
  }

  // ── Tab 内容 ──
  .tab-panel {
    padding: var(--space-lg);
  }

  // ── 文件输入隐藏 ──
  .file-input-hidden {
    display: none;
  }

  // ── 拖拽区 ──
  .dropzone {
    position: relative;
    border: 2px dashed var(--border-color);
    border-radius: var(--radius-lg);
    padding: 48px 24px;
    text-align: center;
    cursor: pointer;
    transition: all var(--transition-fast);
    background: oklch(99% 0.002 55);

    [data-theme='dark'] & {
      background: oklch(16% 0.003 55);
    }

    &:hover {
      border-color: var(--ink-400);
    }

    &.has-file {
      border-style: solid;
      border-color: var(--border-color);
      cursor: default;
      padding: var(--space-md);
    }
  }

  .dropzone-icon {
    color: var(--cinnabar);
    opacity: 0.4;
    margin-bottom: 12px;
  }

  .dropzone-text {
    display: flex;
    flex-direction: column;
    gap: 6px;

    .dropzone-main {
      font-size: 14px;
      color: var(--text-regular);
    }

    .dropzone-hint {
      font-size: 12px;
      color: var(--text-tertiary);
    }
  }

  // ── 预览 ──
  .preview-wrap {
    .preview-image {
      width: 100%;
      max-height: 320px;
      border-radius: var(--radius-md);
      overflow: hidden;
      background: var(--bg-body);
      margin-bottom: 12px;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
      }
    }

    .preview-meta {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-bottom: 12px;

      .meta-name {
        font-size: 13px;
        color: var(--text-regular);
        font-weight: 500;
      }

      .meta-size {
        font-size: 12px;
        color: var(--text-tertiary);
      }
    }

    .preview-actions {
      display: flex;
      gap: 8px;
      justify-content: center;

      .preview-btn {
        all: unset;
        font-size: 12px;
        padding: 4px 14px;
        border-radius: var(--radius-full);
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        transition: all var(--transition-fast);

        &.remove {
          color: var(--cinnabar);
          border: 1px solid oklch(50% 0.16 28 / 0.2);

          &:hover {
            background: oklch(50% 0.16 28 / 0.06);
          }
        }

        &.change {
          color: var(--text-secondary);
          border: 1px solid var(--border-color);

          &:hover {
            color: var(--text-regular);
            border-color: var(--ink-400);
          }
        }
      }
    }
  }

  // ── 文本表单 ──
  .text-form {
    .field {
      margin-bottom: 18px;

      .field-label {
        display: block;
        font-size: 12px;
        font-weight: 600;
        color: var(--text-secondary);
        margin-bottom: 6px;
        letter-spacing: 0.5px;
      }

      .field-input {
        all: unset;
        display: block;
        width: 100%;
        height: 42px;
        padding: 0 14px;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        font-size: 14px;
        color: var(--text-primary);
        background: oklch(99% 0.002 55);
        transition: border-color var(--transition-fast);
        box-sizing: border-box;

        [data-theme='dark'] & {
          background: oklch(16% 0.003 55);
        }

        &:focus {
          border-color: var(--cinnabar);
          box-shadow: 0 0 0 2px oklch(50% 0.16 28 / 0.08);
        }

        &::placeholder {
          color: var(--text-placeholder);
        }
      }

      .field-textarea {
        all: unset;
        display: block;
        width: 100%;
        min-height: 280px;
        padding: 14px;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        font-size: 14px;
        color: var(--text-primary);
        background: oklch(99% 0.002 55);
        transition: border-color var(--transition-fast);
        line-height: 1.8;
        resize: vertical;
        box-sizing: border-box;

        [data-theme='dark'] & {
          background: oklch(16% 0.003 55);
        }

        &:focus {
          border-color: var(--cinnabar);
          box-shadow: 0 0 0 2px oklch(50% 0.16 28 / 0.08);
        }

        &::placeholder {
          color: var(--text-placeholder);
        }
      }

      .text-count {
        display: block;
        text-align: right;
        font-size: 11px;
        color: var(--text-tertiary);
        margin-top: 4px;
      }
    }

    .text-actions {
      display: flex;
      gap: 12px;
      margin-top: 4px;
    }
  }

  // ── 操作按钮 ──
  .action-btn {
    all: unset;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 24px;
    height: 44px;
    font-size: 14px;
    letter-spacing: 2px;
    border-radius: var(--radius-md);
    background: linear-gradient(135deg, var(--cinnabar), oklch(42% 0.14 28));
    color: #fff;
    cursor: pointer;
    transition: all var(--transition-fast);
    font-family: var(--font-heading);

    svg {
      flex-shrink: 0;
    }

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px oklch(50% 0.16 28 / 0.25);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }

    &.loading {
      letter-spacing: 4px;
    }
  }

  .action-btn + .ghost-btn,
  .ghost-btn {
    all: unset;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0 16px;
    height: 44px;
    font-size: 13px;
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

  // ── 右侧边栏 ──
  .canvas-aside {
    position: sticky;
    top: var(--space-xl);

    .aside-card {
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-color);
      padding: var(--space-lg);
      box-shadow: var(--shadow-sm);

      .aside-card-top {
        margin-bottom: 12px;

        .aside-icon {
          display: inline-flex;
          width: 38px;
          height: 38px;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
          background: oklch(50% 0.16 28 / 0.06);
          color: var(--cinnabar);
        }
      }

      .aside-title {
        font-family: var(--font-heading);
        font-size: 15px;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 12px;
      }

      .aside-list {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 8px;

        li {
          font-size: 12.5px;
          color: var(--text-secondary);
          line-height: 1.5;
          padding-left: 12px;
          position: relative;

          &::before {
            content: '·';
            position: absolute;
            left: 0;
            color: var(--cinnabar);
            opacity: 0.5;
          }
        }
      }
    }

    .aside-ornament {
      margin-top: var(--space-lg);
      display: flex;
      justify-content: flex-end;
      color: var(--text-primary);
    }
  }

  // ═══════════════════════════════════════
  // 结果弹窗
  // ═══════════════════════════════════════
  .result-modal-mask {
    position: fixed;
    inset: 0;
    z-index: 2000;
    background: var(--bg-overlay);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.2s ease;
  }

  .result-modal {
    background: var(--bg-card);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    width: 420px;
    max-width: 90vw;
    animation: scaleIn 0.3s var(--ease-out-expo);
  }

  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  .result-modal-inner {
    padding: var(--space-2xl) var(--space-xl);
    text-align: center;
  }

  .result-check {
    margin-bottom: 12px;
  }

  .result-title {
    font-family: var(--font-heading);
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 8px;
  }

  .result-desc {
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 20px;

    strong {
      color: var(--text-regular);
    }
  }

  .result-meta {
    background: var(--bg-body);
    border-radius: var(--radius-md);
    padding: 12px 16px;
    margin-bottom: 20px;
    text-align: left;

    .result-meta-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 13px;

      &:not(:last-child) {
        border-bottom: 1px solid var(--border-light);
      }

      .meta-k {
        color: var(--text-secondary);
      }

      .meta-v {
        color: var(--text-primary);
        font-weight: 500;
        font-family: monospace;
        font-size: 12px;
      }
    }
  }

  .result-actions {
    display: flex;
    gap: 12px;
    justify-content: center;

    .action-btn {
      min-width: 120px;
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

@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
