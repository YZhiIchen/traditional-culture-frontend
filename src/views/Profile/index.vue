<template>
  <div class="profile">
    <!-- Hero -->
    <div class="page-hero" v-reveal="{ delay: 0 }">
      <img src="/images/bg-profile.jpg" alt="" class="page-hero-bg" />
      <div class="page-hero-overlay" />
      <div class="page-hero-content">
        <div class="hero-badge">
          <span class="hero-badge-line" />
          <span class="hero-badge-text">个人中心</span>
          <span class="hero-badge-line" />
        </div>
        <h1 class="hero-title">个人信息</h1>
        <p class="hero-desc">管理你的账户信息与偏好设置</p>
      </div>
    </div>

    <!-- 非对称双栏 -->
    <div class="profile-grid">
      <!-- 左栏：用户头像 + 概览 -->
      <div class="profile-aside" v-reveal="{ delay: 80 }">
        <div class="avatar-card">
        <div class="avatar-box">
          <div class="avatar-wrap">
            <img v-if="avatarUrl" :src="avatarDisplay" class="avatar-img" alt="头像" />
            <span v-else class="avatar-char">{{ currentInitial }}</span>
          </div>
          <button class="avatar-edit" title="更换头像" @click="triggerFileSelect">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round"
                 stroke-linejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </button>
        </div>
          <input ref="fileInput" type="file" accept="image/jpeg,image/png" hidden @change="handleAvatarChange" />
          <h2 class="avatar-name">{{ localForm.nickname ? localForm.nickname : '昵称不能为空' }}</h2>
          <p class="avatar-role">@{{ localForm.username || 'yangzhi' }}</p>

          <div class="avatar-stats">
            <div class="stat">
              <span class="stat-num">{{ uploadCount }}</span>
              <span class="stat-label">上传</span>
            </div>
            <div class="stat">
              <span class="stat-num">{{ recognizeCount }}</span>
              <span class="stat-label">识别</span>
            </div>
            <div class="stat">
              <span class="stat-num">{{ favoriteCount }}</span>
              <span class="stat-label">收藏</span>
            </div>
          </div>
        </div>

        <div class="info-card">
          <div class="info-row">
            <span class="info-k">注册时间</span>
            <span class="info-v">2026-06</span>
          </div>
          <div class="info-row">
            <span class="info-k">最后登录</span>
            <span class="info-v">{{ lastLogin }}</span>
          </div>
        </div>
      </div>

      <!-- 右栏：编辑表单 -->
      <div class="profile-main animate-fade-in-up delay-2">
        <div class="form-section">
          <div class="section-head">
            <span class="section-head-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                   stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <span>基本信息</span>
          </div>

          <div class="section-body">
            <el-form
              ref="formRef"
              :model="localForm"
              :rules="rules"
              label-position="top"
              class="profile-form"
            >
              <el-form-item label="昵称" prop="nickname">
                <div class="input-group">
                  <input v-model="localForm.nickname" placeholder="你的昵称" class="input-field" />
                </div>
              </el-form-item>

              <el-form-item label="用户名" prop="username">
                <div class="input-group">
                  <input v-model="localForm.username" placeholder="登录用户名" class="input-field" disabled />
                </div>
              </el-form-item>

              <el-form-item label="邮箱" prop="email">
                <div class="input-group">
                  <input v-model="localForm.email" placeholder="your@email.com" class="input-field" />
                </div>
              </el-form-item>

              <el-form-item label="个人简介" prop="bio">
                <div class="input-group textarea">
                  <textarea v-model="localForm.bio" placeholder="写一段简短的个人介绍…" class="input-field textarea-field" rows="4" />
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <!-- 密码修改 -->
        <div class="form-section">
          <div class="section-head">
            <span class="section-head-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                   stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <span>修改密码</span>
          </div>

          <div class="section-body">
            <el-form
              ref="pwdFormRef"
              :model="pwdForm"
              :rules="pwdRules"
              label-position="top"
              class="profile-form"
            >
              <el-form-item label="当前密码" prop="current">
                <div class="input-group">
                  <input v-model="pwdForm.current" :type="showPwd.current ? 'text' : 'password'" placeholder="输入当前密码" class="input-field" autocomplete="off" />
                  <span
                    class="pwd-toggle"
                    @mousedown.prevent="showPwd.current = true"
                    @mouseup="showPwd.current = false"
                    @mouseleave="showPwd.current = false"
                    title="按住查看密码"
                  >
                    <svg v-if="!showPwd.current" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  </span>
                </div>
              </el-form-item>

              <el-form-item label="新密码" prop="newPwd">
                <div class="input-group">
                  <input v-model="pwdForm.newPwd" :type="showPwd.newPwd ? 'text' : 'password'" placeholder="6-20 位字符" class="input-field" autocomplete="off" />
                  <span
                    class="pwd-toggle"
                    @mousedown.prevent="showPwd.newPwd = true"
                    @mouseup="showPwd.newPwd = false"
                    @mouseleave="showPwd.newPwd = false"
                    title="按住查看密码"
                  >
                    <svg v-if="!showPwd.newPwd" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  </span>
                </div>
              </el-form-item>

              <el-form-item label="确认新密码" prop="confirm">
                <div class="input-group">
                  <input v-model="pwdForm.confirm" :type="showPwd.confirm ? 'text' : 'password'" placeholder="再次输入新密码" class="input-field" autocomplete="off" />
                  <span
                    class="pwd-toggle"
                    @mousedown.prevent="showPwd.confirm = true"
                    @mouseup="showPwd.confirm = false"
                    @mouseleave="showPwd.confirm = false"
                    title="按住查看密码"
                  >
                    <svg v-if="!showPwd.confirm" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  </span>
                </div>
              </el-form-item>
            </el-form>
          </div>

          <!-- 密码修改按钮 -->
          <div class="pwd-actions">
            <button class="action-btn" :class="{ loading: pwdSaving }" :disabled="pwdSaving" @click="changePassword">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round"
                   stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              {{ pwdSaving ? '修改中 …' : '修改密码' }}
            </button>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <button class="action-btn" :loading="saving" @click="saveProfile">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round"
                 stroke-linejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            {{ saving ? '保存中 …' : '保存修改' }}
          </button>
          <button class="ghost-btn" @click="resetProfile">取消</button>
          <button class="ghost-btn danger" @click="handleLogout">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                 stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            退出登录
          </button>
          <button class="ghost-btn danger-outline" @click="handleDeleteAccount">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                 stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            注销账号
          </button>
        </div>
      </div>
    </div>

    <!-- 头像裁剪弹窗 -->
    <div v-if="cropVisible" class="crop-mask" @mousedown="onMaskMouseDown" @click.self="onMaskClick">
      <div class="crop-dialog">
        <h3 class="crop-title">裁剪头像</h3>
        <p class="crop-tip">拖动调整位置，滚轮缩放（0.9~1.2）</p>
        <div
          class="crop-stage"
          ref="cropStageRef"
          @mousedown="startDrag"
          @wheel.prevent="onWheel"
        >
          <img
            ref="cropImgRef"
            :src="rawImage"
            class="crop-img"
            :style="{ left: imgPos.x + 'px', top: imgPos.y + 'px', width: rawImgSize.w * imgScale + 'px', height: rawImgSize.h * imgScale + 'px' }"
            draggable="false"
          />
          <div class="crop-frame"></div>
        </div>
        <p class="crop-scale-tip">缩放：{{ Math.round(imgScale * 100) }}%</p>
        <div class="crop-actions">
          <button class="crop-btn cancel" @click="closeCrop">取消</button>
          <button class="crop-btn confirm" @click="confirmCrop">确认裁剪</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { getUserInfoApi } from '@/api/auth'
import request from '@/utils/request'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const pwdFormRef = ref<FormInstance>()
const saving = ref(false)
const pwdSaving = ref(false)

const lastLogin = new Date().toLocaleString('zh-CN')

const localForm = reactive({
  nickname: '',
  username: '',
  email: '',
  bio: ''
})

// 用户统计数据
const uploadCount = ref('0')
const recognizeCount = ref('0')
const favoriteCount = ref('0')

// 头像
const avatarUrl = ref('')
const avatarVersion = ref(0)
const avatarDisplay = computed(() => {
  if (!avatarUrl.value) return ''
  const sep = avatarUrl.value.includes('?') ? '&' : '?'
  return avatarVersion.value ? `${avatarUrl.value}${sep}v=${avatarVersion.value}` : avatarUrl.value
})
const fileInput = ref<HTMLInputElement>()
const currentInitial = computed(() => localForm.nickname?.[0]?.toUpperCase() || 'U')

// 裁剪相关
const cropVisible = ref(false)
const rawImage = ref('')
const cropStageRef = ref<HTMLElement>()
const cropImgRef = ref<HTMLImageElement>()
const imgPos = reactive({ x: 0, y: 0 })
const imgScale = ref(1)
const dragging = ref(false)
const moved = ref(false)
const dragStart = reactive({ x: 0, y: 0, ox: 0, oy: 0 })
const rawImgSize = reactive({ w: 0, h: 0 })
const CROP_SIZE = 256
const MIN_SCALE = 0.9
const MAX_SCALE = 1.2
const MAX_AVATAR_DIM = 500

const triggerFileSelect = () => {
  fileInput.value?.click()
}

// 限制拖动范围
const clampImgPos = () => {
  const scaledW = rawImgSize.w * imgScale.value
  const scaledH = rawImgSize.h * imgScale.value
  if (imgPos.x > 0) imgPos.x = 0
  if (imgPos.x < CROP_SIZE - scaledW) imgPos.x = CROP_SIZE - scaledW
  if (imgPos.y > 0) imgPos.y = 0
  if (imgPos.y < CROP_SIZE - scaledH) imgPos.y = CROP_SIZE - scaledH
}

const handleAvatarChange = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  input.value = ''

  // 先校验尺寸 ≤500×500
  const img = new Image()
  const url = URL.createObjectURL(file)
  img.src = url
  await new Promise((r) => { img.onload = r; img.onerror = r })
  URL.revokeObjectURL(url)

  if (img.width > MAX_AVATAR_DIM || img.height > MAX_AVATAR_DIM) {
    ElMessage.error(`图片尺寸不能超过 ${MAX_AVATAR_DIM}×${MAX_AVATAR_DIM}，当前 ${img.width}×${img.height}`)
    return
  }

  const reader = new FileReader()
  reader.onload = (ev) => {
    rawImage.value = ev.target?.result as string
    const img2 = new Image()
    img2.onload = () => {
      // 缩放到适合预览的尺寸（最长边 256）
      const scale = Math.min(1, CROP_SIZE / Math.max(img2.width, img2.height))
      rawImgSize.w = img2.width * scale
      rawImgSize.h = img2.height * scale
      imgScale.value = 1
      // 居中
      imgPos.x = (CROP_SIZE - rawImgSize.w) / 2
      imgPos.y = (CROP_SIZE - rawImgSize.h) / 2
      clampImgPos()
      moved.value = false
      dragging.value = false
      dragStartedInside.value = false
      mouseDownOnMask = false
      cropVisible.value = true
    }
    img2.src = rawImage.value
  }
  reader.readAsDataURL(file)
}

const onWheel = (e: WheelEvent) => {
  e.preventDefault()
  const delta = e.deltaY > 0 ? -0.05 : 0.05
  let next = imgScale.value + delta
  if (next < MIN_SCALE) next = MIN_SCALE
  if (next > MAX_SCALE) next = MAX_SCALE
  imgScale.value = next
  clampImgPos()
}

const startDrag = (e: MouseEvent) => {
  dragging.value = true
  moved.value = false
  dragStartedInside.value = true
  dragStart.x = e.clientX
  dragStart.y = e.clientY
  dragStart.ox = imgPos.x
  dragStart.oy = imgPos.y
  const move = (ev: MouseEvent) => {
    if (!dragging.value) return
    if (Math.abs(ev.clientX - dragStart.x) > 3 || Math.abs(ev.clientY - dragStart.y) > 3) {
      moved.value = true
    }
    imgPos.x = dragStart.ox + (ev.clientX - dragStart.x)
    imgPos.y = dragStart.oy + (ev.clientY - dragStart.y)
    clampImgPos()
  }
  const up = () => {
    dragging.value = false
    document.removeEventListener('mousemove', move)
    document.removeEventListener('mouseup', up)
    // 拖拽结束后保留 moved 状态一段时间，防止 click 事件误触发关闭
    if (moved.value) {
      setTimeout(() => { moved.value = false }, 150)
    }
    // 延迟重置 dragStartedInside，确保 click 事件先处理完
    setTimeout(() => { dragStartedInside.value = false }, 0)
  }
  document.addEventListener('mousemove', move)
  document.addEventListener('mouseup', up)
}

// ── 裁剪弹窗关闭逻辑 ──
// 核心思路：区分"从裁剪框内拖拽到框外释放"和"直接点击遮罩层"
// - mousedown 在裁剪框内 → dragStartedInside = true → 拖拽释放不关闭
// - mousedown 直接在遮罩层上 → dragStartedInside = false → 点击关闭
let mouseDownOnMask = false
const dragStartedInside = ref(false)

const onMaskMouseDown = (e: MouseEvent) => {
  // 记录 mousedown 是否直接发生在遮罩层上（而非弹窗内部）
  mouseDownOnMask = (e.target === e.currentTarget)
}

const onMaskClick = () => {
  // 仅当 mousedown 和 click 都发生在遮罩层上，且不是从裁剪框内拖出的操作时，才关闭
  if (mouseDownOnMask && !dragStartedInside.value && !moved.value) {
    closeCrop()
  }
  // 重置状态
  mouseDownOnMask = false
  dragStartedInside.value = false
}

const closeCrop = () => {
  cropVisible.value = false
  rawImage.value = ''
  moved.value = false
  dragging.value = false
  mouseDownOnMask = false
  dragStartedInside.value = false
}

const confirmCrop = async () => {
  const realImg = new Image()
  realImg.src = rawImage.value
  await new Promise((r) => { realImg.onload = r; realImg.onerror = r })

  // 图片在 stage 显示尺寸
  const dispW = rawImgSize.w * imgScale.value
  const dispH = rawImgSize.h * imgScale.value
  // stage 坐标转原图坐标的比例
  const ratioX = realImg.width / dispW
  const ratioY = realImg.height / dispH
  // 裁剪框(0,0,CROP_SIZE,CROP_SIZE) 在原图上的区域
  let sx = -imgPos.x * ratioX
  let sy = -imgPos.y * ratioY
  let sw = CROP_SIZE * ratioX
  let sh = CROP_SIZE * ratioY
  // 边界保护
  if (sx < 0) { sw += sx; sx = 0 }
  if (sy < 0) { sh += sy; sy = 0 }
  if (sx + sw > realImg.width) sw = realImg.width - sx
  if (sy + sh > realImg.height) sh = realImg.height - sy
  if (sw <= 0 || sh <= 0) {
    ElMessage.error('裁剪区域无效')
    return
  }

  const canvas = document.createElement('canvas')
  canvas.width = CROP_SIZE
  canvas.height = CROP_SIZE
  const ctx = canvas.getContext('2d')!
  ctx.beginPath()
  ctx.arc(CROP_SIZE / 2, CROP_SIZE / 2, CROP_SIZE / 2, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()
  ctx.drawImage(realImg, sx, sy, sw, sh, 0, 0, CROP_SIZE, CROP_SIZE)
  cropVisible.value = false
  moved.value = false
  dragging.value = false
  dragStartedInside.value = false
  mouseDownOnMask = false

  const blob: Blob = await new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b!), 'image/png')
  })
  const file = new File([blob], 'avatar.png', { type: 'image/png' })
  try {
    const res: any = await request.upload('/user/avatar', file)
    if (res?.avatar) {
      avatarUrl.value = res.avatar
      avatarVersion.value = Date.now()
    }
    ElMessage.success('头像已更新')
  } catch (err: any) {
    ElMessage.error(err.message || '头像上传失败')
  }
}

const rules: FormRules = {
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }]
}

const pwdForm = reactive({
  current: '',
  newPwd: '',
  confirm: ''
})

const showPwd = reactive({
  current: false,
  newPwd: false,
  confirm: false
})

const validateNew = (_rule: any, value: string, callback: any) => {
  if (value && value.length < 6) {
    callback(new Error('至少 6 位字符'))
  } else {
    callback()
  }
}

const validateConfirm = (_rule: any, value: string, callback: any) => {
  if (value !== pwdForm.newPwd) {
    callback(new Error('两次密码不一致'))
  } else {
    callback()
  }
}

const pwdRules: FormRules = {
  current: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { validator: validateNew, trigger: 'blur' }
  ],
  confirm: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirm, trigger: 'blur' }
  ]
}

const saveProfile = async () => {
  if (!formRef.value) return

  const ok = await formRef.value.validate().catch(() => false)
  if (!ok) return

  saving.value = true
  try {
    await request.put('/user/profile', {
      nickname: localForm.nickname,
      email: localForm.email,
      bio: localForm.bio
    })
    // 如果 userStore 有 fetchUserInfo，同步刷新
    try { userStore.fetchUserInfo() } catch {}
    ElMessage.success('个人信息已更新')
  } catch (e: any) {
    ElMessage.error(e.message || '更新失败')
  } finally {
    saving.value = false
  }
}

// 修改密码（独立按钮触发）
const changePassword = async () => {
  if (!pwdFormRef.value) return

  const ok = await pwdFormRef.value.validate().catch(() => false)
  if (!ok) return

  pwdSaving.value = true
  try {
    await request.put('/user/password', {
      current: pwdForm.current,
      newPwd: pwdForm.newPwd
    })
    ElMessage.success('密码已修改，请重新登录')
    pwdForm.current = ''
    pwdForm.newPwd = ''
    pwdForm.confirm = ''
    // 修改密码后自动登出，回到登录页
    localStorage.removeItem('token')
    userStore.token = ''
    userStore.userInfo = null
    setTimeout(() => router.push('/login'), 800)
  } catch (e: any) {
    ElMessage.error(e.message || '密码修改失败')
  } finally {
    pwdSaving.value = false
  }
}

const loadUserInfo = async () => {
  try {
    const info = await getUserInfoApi()
    localForm.nickname = (info as any).nickname || ''
    localForm.username = (info as any).username || ''
    localForm.email = (info as any).email || ''
    localForm.bio = (info as any).bio || ''
    avatarUrl.value = (info as any).avatar || ''
    if (avatarUrl.value) avatarVersion.value = Date.now()
  } catch {
    // 静默
  }
}

// 加载用户数据
onMounted(async () => {
  await loadUserInfo()

  try {
    // 加载统计
    const stats: any = await request.get('/dashboard/stats')
    uploadCount.value = String(stats.totalResources || 0)
    recognizeCount.value = String(stats.totalRecognized || 0)

    const favs: any = await request.get('/favorite/list')
    favoriteCount.value = String(favs?.length || 0)
  } catch {
    // 静默
  }
})

const resetProfile = async () => {
  // 恢复到未保存状态：重新拉取后端信息 + 清空密码输入
  await loadUserInfo()
  pwdForm.current = ''
  pwdForm.newPwd = ''
  pwdForm.confirm = ''
  formRef.value?.clearValidate()
  pwdFormRef.value?.clearValidate()
  ElMessage.info('取消')
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定退出登录？', '', {
      confirmButtonText: '退出',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    })
    localStorage.removeItem('token')
    ElMessage.success('已退出')
    router.push('/login')
  } catch {
    /* cancelled */
  }
}

const handleDeleteAccount = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要注销账号？此操作不可撤销，所有个人数据将被匿名化处理。',
      '注销账号',
      { confirmButtonText: '确认注销', cancelButtonText: '取消', type: 'warning', confirmButtonClass: 'el-button--danger' }
    )
    await ElMessageBox.confirm(
      '账号注销后上传记录将被匿名化，数据保留30天后彻底清除。是否继续？',
      '再次确认',
      { confirmButtonText: '确认注销', cancelButtonText: '取消', type: 'error', confirmButtonClass: 'el-button--danger' }
    )
    await request.delete('/user/account')
    ElMessage.success('账号已注销')
    localStorage.removeItem('token')
    router.push('/login')
  } catch {
    /* cancelled */
  }
}
</script>

<style scoped lang="scss">
// ═══════════════════════════════════════════
// 当代山水 · 个人中心
// ═══════════════════════════════════════════

.profile {
  // ── 网格 ──
  .profile-grid {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: var(--space-lg);
    align-items: start;

    @media (max-width: 800px) {
      grid-template-columns: 1fr;
    }
  }

  // ── 左栏 ──
  .profile-aside {
    .avatar-card {
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-color);
      padding: var(--space-xl);
      text-align: center;
      box-shadow: var(--shadow-sm);
      margin-bottom: var(--space-md);

      .avatar-box {
        position: relative;
        display: inline-block;
        width: 80px;
        height: 80px;
        margin-bottom: 12px;
      }

      .avatar-wrap {
        position: relative;
        display: inline-block;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        overflow: hidden;

        .avatar-img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-char {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--cinnabar), oklch(42% 0.14 28));
          color: #fff;
          font-size: 28px;
          font-weight: 700;
          font-family: var(--font-heading);
        }
      }

      // 头像编辑按钮（pen 图标）— 圆形悬浮按钮
      .avatar-edit {
        all: unset;
        position: absolute;
        bottom: -4px;
        right: -4px;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--cinnabar), oklch(42% 0.14 28));
        border: 2px solid var(--bg-card);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #fff;
        transition: all var(--transition-fast);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        box-sizing: border-box;
        z-index: 2;

        &:hover {
          transform: scale(1.12);
          box-shadow: 0 4px 12px oklch(50% 0.16 28 / 0.35);
        }

        &:active {
          transform: scale(1.05);
        }
      }

      .avatar-name {
        font-family: var(--font-heading);
        font-size: 18px;
        font-weight: 700;
        color: var(--text-primary);
        letter-spacing: 1px;
      }

      .avatar-role {
        font-size: 12px;
        color: var(--text-tertiary);
        margin-top: 4px;
        letter-spacing: 0.5px;
      }

      .avatar-stats {
        display: flex;
        justify-content: center;
        gap: 24px;
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid var(--border-light);

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;

          .stat-num {
            font-size: 18px;
            font-weight: 700;
            color: var(--text-primary);
            font-family: var(--font-heading);
          }

          .stat-label {
            font-size: 11px;
            color: var(--text-tertiary);
            letter-spacing: 1px;
          }
        }
      }
    }

    .info-card {
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-color);
      padding: var(--space-md) var(--space-lg);

      .info-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        font-size: 12px;

        &:not(:last-child) {
          border-bottom: 1px solid var(--border-light);
        }

        .info-k { color: var(--text-tertiary); }
        .info-v { color: var(--text-secondary); }
      }
    }
  }

  // ── 右栏 ──
  .profile-main {
    .form-section {
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-color);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
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

        [data-theme='dark'] & { background: oklch(14% 0.003 55); }

        .section-head-icon { color: var(--cinnabar); display: inline-flex; }
      }

      .section-body {
        padding: var(--space-lg);
      }
    }
  }

  // ── 头像编辑（笔图标悬浮）──
  .avatar-edit-wrap {
    position: relative;
    width: 100px;
    height: 100px;
    margin: 0 auto var(--space-lg);

    .avatar-circle {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--cinnabar), oklch(40% 0.14 28));
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;

      .avatar-img { width: 100%; height: 100%; object-fit: cover; }

      .avatar-initial {
        font-family: var(--font-heading);
        font-size: 38px;
        font-weight: 700;
        color: #fff;
      }
    }

    .avatar-edit-btn {
      position: absolute;
      right: 0;
      bottom: 6px;
      width: 32px;
      height: 32px;
      background: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      cursor: pointer;
      color: #666;
      transition: all var(--transition-fast);

      &:hover {
        background: #f0f0f0;
        color: var(--cinnabar);
        transform: scale(1.1);
      }
    }
  }

  // ── 表单 ──
  .profile-form {
    :deep(.el-form-item) { margin-bottom: 18px; }

    :deep(.el-form-item__label) {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
      padding-bottom: 4px;
    }

    :deep(.el-form-item__content) {
      width: 100%;
    }
  }

  .input-group {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 14px;
    height: 44px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: oklch(99% 0.002 55);
    transition: border-color var(--transition-fast);

    [data-theme='dark'] & { background: oklch(16% 0.003 55); }

    &:focus-within {
      border-color: var(--cinnabar);
      box-shadow: 0 0 0 2px oklch(50% 0.16 28 / 0.08);
    }

    &.textarea {
      height: auto;
      padding: 10px 14px;
    }

    .input-field {
      all: unset;
      flex: 1;
      font-size: 14px;
      color: var(--text-primary);
      font-family: var(--font-body);
      line-height: 1.4;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      &::placeholder { color: var(--text-placeholder); }

      &.textarea-field {
        resize: vertical;
        min-height: 80px;
        line-height: 1.6;
      }
    }
  }

  // ── 操作按钮 ──
  .form-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .action-btn {
    all: unset;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0 22px;
    height: 42px;
    font-size: 14px;
    letter-spacing: 1px;
    border-radius: var(--radius-md);
    background: linear-gradient(135deg, var(--cinnabar), oklch(42% 0.14 28));
    color: #fff;
    cursor: pointer;
    transition: all var(--transition-fast);
    font-family: var(--font-heading);

    svg { flex-shrink: 0; }

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px oklch(50% 0.16 28 / 0.2);
    }

    &:active { transform: translateY(0); }
  }

  .ghost-btn {
    all: unset;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0 16px;
    height: 42px;
    font-size: 13px;
    color: var(--text-secondary);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    border: 1px solid var(--border-color);

    svg { flex-shrink: 0; }

    &:hover {
      color: var(--text-regular);
      border-color: var(--ink-400);
      background: oklch(50% 0.16 28 / 0.03);
    }

    &.danger {
      color: var(--cinnabar);
      border-color: oklch(50% 0.16 28 / 0.2);

      &:hover { background: oklch(50% 0.16 28 / 0.06); }
    }

    &.danger-outline {
      color: var(--cinnabar);
      border-color: oklch(50% 0.16 28 / 0.15);
      opacity: 0.55;

      &:hover {
        opacity: 1;
        background: oklch(50% 0.16 28 / 0.06);
        border-color: var(--cinnabar);
      }
    }
  }
}

// ── 动画 ──
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

// 头像裁剪弹窗
.crop-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  user-select: none;
  -webkit-user-select: none;
}
.crop-dialog {
  background: var(--bg-card, #fff);
  border-radius: 16px;
  padding: 24px;
  width: 360px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}
.crop-title {
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary, #1a1a1a);
}
.crop-tip {
  margin: 0 0 16px;
  font-size: 13px;
  color: var(--text-secondary, #888);
}
.crop-stage {
  position: relative;
  width: 256px;
  height: 256px;
  margin: 0 auto 12px;
  overflow: hidden;
  background: #000;
  cursor: move;
  border-radius: 50%;
  user-select: none;
  -webkit-user-select: none;
}
.crop-img {
  position: absolute;
  user-select: none;
  pointer-events: none;
  max-width: none;
  transition: transform 0.05s ease-out;
}
.crop-frame {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 256px;
  height: 256px;
  border: 2px solid rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.45);
  pointer-events: none;
}
.crop-scale-tip {
  margin: 0 0 12px;
  text-align: center;
  font-size: 12px;
  color: var(--text-secondary, #888);
}
.crop-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.crop-btn {
  padding: 8px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}
.crop-btn.cancel {
  background: #f0f0f0;
  color: #666;
}
.crop-btn.confirm {
  background: #3b82f6;
  color: #fff;
}
.crop-btn.confirm:hover {
  background: #2563eb;
}

// ═══════════════════════════════════════
// 移动端适配
// ═══════════════════════════════════════
@media (max-width: 768px) {
  .page-hero {
    min-height: 160px;

    .page-hero-content {
      padding: var(--space-lg);

      .hero-title {
        font-size: 22px;
        letter-spacing: 3px;
      }

      .hero-desc {
        font-size: 12px;
      }
    }
  }

  .profile-grid {
    .profile-aside {
      .avatar-card {
        padding: var(--space-md);

        .avatar-box {
          .avatar-wrap {
            width: 64px;
            height: 64px;
          }
        }
      }
    }
  }

  .info-grid {
    grid-template-columns: 1fr !important;

    .info-cell {
      &:nth-child(odd), &:nth-child(even) {
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
    }
  }
}
</style>