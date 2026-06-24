<template>
  <div class="home">
    <!-- 页面标识 -->
    <div class="page-lead animate-fade-in-up">
      <div class="lead-badge">
        <span class="badge-line" />
        <span class="badge-text">工作台</span>
        <span class="badge-line" />
      </div>
      <h1 class="lead-title">数字化保护工作台</h1>
      <p class="lead-desc">
        传统文化资源采集、识别、检索与研究的一站式入口
      </p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-row animate-fade-in-up delay-1">
      <div class="stat-card" v-for="(card, i) in statCards" :key="i"
           :style="{ animationDelay: `${0.05 * i}s` }">
        <div class="stat-icon" :style="{ background: card.bg }">
          <div v-html="card.icon" />
        </div>
        <div class="stat-body">
          <span class="stat-value">{{ card.value }}</span>
          <span class="stat-label">{{ card.label }}</span>
        </div>
        <div class="stat-trend" v-if="card.trend">
          <span class="trend-arrow" :class="card.trend > 0 ? 'up' : 'down'">
            {{ card.trend > 0 ? '↑' : '↓' }}
          </span>
          <span class="trend-num">{{ Math.abs(card.trend) }}</span>
        </div>
      </div>
    </div>

    <!-- 自动刷新指示 -->
    <div class="refresh-bar animate-fade-in">
      <span class="refresh-dot" :class="{ active: refreshing }" />
      <span class="refresh-text">
        {{ refreshing ? '正在更新…' : `数据每 ${REFRESH_INTERVAL}s 自动刷新` }}
      </span>
      <button class="refresh-btn" @click="loadData(true)">手动刷新</button>
    </div>

    <!-- 主区域：双栏 -->
    <div class="home-grid">
      <!-- 左栏：最近活动 -->
      <div class="grid-main animate-fade-in-up delay-2">
        <section class="section-card">
          <div class="section-head">
            <span class="section-head-title">系统最近识别</span>
            <router-link to="/history" class="section-head-link">我的记录 →</router-link>
          </div>
          <div class="section-body">
            <div
              v-for="(item, idx) in recentList"
              :key="item.id"
              class="recent-row"
              :style="{ animationDelay: `${0.1 + idx * 0.06}s` }"
              @click="goDetail(item.id)"
            >
              <div class="recent-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                     stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div class="recent-body">
                <span class="recent-title">{{ item.title }}</span>
                <span class="recent-meta">{{ item.dynasty }} · {{ item.type }}<template v-if="item.uploader"> · {{ item.uploader }}</template></span>
              </div>
              <div class="recent-time">
                <span>{{ formatTime(item.time) }}</span>
                <span class="recent-status" :class="item.status">
                  {{ item.status === 'done' ? '已完成' : '处理中' }}
                </span>
              </div>
            </div>
            <div v-if="recentList.length === 0" class="empty-hint">
              暂无识别记录，<router-link to="/upload">去上传</router-link>
            </div>
          </div>
        </section>

        <!-- 快捷操作 -->
        <div class="quick-actions">
          <router-link to="/upload" class="quick-card">
            <div class="quick-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                   stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <span class="quick-label">上传资源</span>
            <span class="quick-hint">图片 · 文本</span>
          </router-link>

          <router-link to="/search" class="quick-card">
            <div class="quick-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                   stroke-linejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <span class="quick-label">检索资源</span>
            <span class="quick-hint">关键词 · 筛选</span>
          </router-link>

          <router-link to="/explore" class="quick-card">
            <div class="quick-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                   stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
            </div>
            <span class="quick-label">知识发现</span>
            <span class="quick-hint">专题 · 图谱</span>
          </router-link>
        </div>
      </div>

      <!-- 右栏：侧边信息 -->
      <aside class="grid-aside animate-fade-in-up delay-3">
        <!-- 今日统计 -->
        <section class="section-card">
          <div class="section-head">
            <span class="section-head-title">系统概览</span>
          </div>
          <div class="section-body">
            <div class="today-stats">
              <div class="today-item">
                <span class="today-num">{{ todayStats.upload }}</span>
                <span class="today-label">今日上传</span>
              </div>
              <div class="today-item">
                <span class="today-num">{{ todayStats.recognized }}</span>
                <span class="today-label">今日识别</span>
              </div>
              <div class="today-item">
                <span class="today-num">{{ todayStats.users }}</span>
                <span class="today-label">注册用户</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 热门标签 -->
        <section class="section-card">
          <div class="section-head">
            <span class="section-head-title">全局热门标签</span>
          </div>
          <div class="section-body">
            <div class="tag-cloud">
              <span class="cloud-tag" v-for="tag in hotTags" :key="tag.name"
                    :style="{ fontSize: `${tag.size}px`, opacity: tag.opacity }"
                    @click="goSearch(tag.name)">
                {{ tag.name }}
              </span>
            </div>
          </div>
        </section>

        <!-- 朝代分布 -->
        <section class="section-card">
          <div class="section-head">
            <span class="section-head-title">全局朝代分布</span>
          </div>
          <div class="section-body">
            <div class="dynasty-bars">
              <div class="dynasty-bar-row" v-for="d in dynasties" :key="d.name">
                <span class="dynasty-name">{{ d.name }}</span>
                <span class="dynasty-track">
                  <span class="dynasty-fill" :style="{ width: `${d.pct}%` }" />
                </span>
                <span class="dynasty-num">{{ d.count }}</span>
              </div>
            </div>
          </div>
        </section>
      </aside>
    </div>

    <!-- 加载态 -->
    <div v-if="loading" class="home-loading animate-fade-in">
      <div class="loading-dot" />
      <span>加载工作台…</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, onActivated, onDeactivated } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'

const router = useRouter()
const loading = ref(true)
const refreshing = ref(false)

// 自动刷新间隔（秒）
const REFRESH_INTERVAL = 60
let refreshTimer: ReturnType<typeof setInterval> | null = null

// ── 统计卡片 ──
const statCards = ref([
  {
    label: '系统馆藏',
    value: '--',
    trend: 0,
    bg: 'oklch(55% 0.16 28 / 0.08)',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cinnabar)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>'
  },
  {
    label: '识别总数',
    value: '--',
    trend: 0,
    bg: 'oklch(58% 0.08 145 / 0.08)',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--celadon)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>'
  },
  {
    label: '本周新增',
    value: '--',
    trend: 0,
    bg: 'oklch(65% 0.12 75 / 0.08)',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>'
  },
  {
    label: '识别准确率',
    value: '--',
    trend: 0,
    bg: 'oklch(52% 0.07 250 / 0.08)',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--azure)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
  }
])

// ── 今日统计（真实数据）──
const todayStats = ref({ upload: 0, recognized: 0, users: 0 })

// ── 最近识别 ──
interface RecentItem {
  id: string
  title: string
  dynasty: string
  type: string
  time: number
  status: 'done' | 'processing'
  uploader?: string
}

const recentList = ref<RecentItem[]>([])

// ── 热门标签 ──
const hotTags = ref<{ name: string; size: number; opacity: number }[]>([])

// ── 朝代分布 ──
const dynasties = ref<{ name: string; count: number; pct: number }[]>([])

const formatTime = (ts: number) => {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  const hrs = Math.floor(diff / 3600000)
  if (mins < 1) return '刚刚'
  if (mins < 60) return `${mins} 分钟前`
  if (hrs < 24) return `${hrs} 小时前`
  return `${Math.floor(hrs / 24)} 天前`
}

const goDetail = (id: string) => {
  router.push(`/recognition/${id}`)
}

const goSearch = (keyword: string) => {
  router.push(`/search?keyword=${encodeURIComponent(keyword)}`)
}

// ── 数据加载（支持静默刷新）──
const loadData = async (silent = false) => {
  if (silent) {
    refreshing.value = true
  } else {
    loading.value = true
  }

  try {
    // 并行请求全局接口，减少总延迟
    const [statsRes, activityRes, tagsRes, dynRes] = await Promise.all([
      request.get('/dashboard/global-stats'),
      request.get('/dashboard/recent-activity'),
      request.get('/dashboard/global-tags'),
      request.get('/dashboard/global-dynasties')
    ])

    // 统计卡片
    const stats: any = statsRes
    statCards.value = [
      { label: '系统馆藏', value: String(stats.totalResources ?? 0), trend: stats.weekNew ?? 0, bg: 'oklch(55% 0.16 28 / 0.08)', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cinnabar)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>' },
      { label: '识别总数', value: String(stats.totalRecognized ?? 0), trend: 0, bg: 'oklch(58% 0.08 145 / 0.08)', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--celadon)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>' },
      { label: '本周新增', value: String(stats.weekNew ?? 0), trend: 0, bg: 'oklch(65% 0.12 75 / 0.08)', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>' },
      { label: '识别准确率', value: stats.avgConfidence || '--', trend: 0, bg: 'oklch(52% 0.07 250 / 0.08)', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--azure)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' }
    ]

    // 今日概览（真实数据）
    todayStats.value = {
      upload: stats.todayUpload ?? 0,
      recognized: stats.todayRecognized ?? 0,
      users: stats.totalUsers ?? 0
    }

    // 最近活动（全局）
    const activity: any[] = activityRes || []
    recentList.value = activity.map((r: any) => ({
      id: r.id,
      title: r.title || '未命名',
      dynasty: r.dynasty || '',
      type: r.type === 'image' ? '图片' : '文本',
      time: r.time ? new Date(r.time).getTime() : Date.now(),
      status: 'done' as const,
      uploader: r.uploader || ''
    }))

    // 热门标签（全局）
    const tags: any[] = tagsRes || []
    if (tags.length) {
      const maxCount = Math.max(...tags.map((t: any) => t.count), 1)
      hotTags.value = tags.slice(0, 15).map((t: any) => ({
        name: t.name,
        size: 12 + Math.round((t.count / maxCount) * 8),
        opacity: 0.6 + (t.count / maxCount) * 0.35
      }))
    }

    // 朝代分布（全局）
    const dynastiesData: any[] = dynRes || []
    dynasties.value = dynastiesData.map((d: any) => ({
      name: d.name,
      count: d.count,
      pct: d.pct
    }))
  } catch {
    // 静默刷新失败时保留已有数据
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

// ── 生命周期：keep-alive 优化 ──
// keep-alive 下 onMounted 只执行一次，onActivated 每次切回页面时执行
let lastRefreshTime = Date.now()

const startAutoRefresh = () => {
  if (refreshTimer) return
  refreshTimer = setInterval(() => loadData(true), REFRESH_INTERVAL * 1000)
}

const stopAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

onMounted(() => {
  loadData()
  startAutoRefresh()
})

// 切回页面时：如果数据超过 2 分钟未刷新，立即静默刷新
onActivated(() => {
  if (Date.now() - lastRefreshTime > 2 * 60 * 1000) {
    loadData(true)
  }
  startAutoRefresh()
})

// 切离页面时：暂停定时器，避免后台无效请求
onDeactivated(() => {
  lastRefreshTime = Date.now()
  stopAutoRefresh()
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<style scoped lang="scss">
// ═══════════════════════════════════════════
// 当代山水 · 工作台首页
// ═══════════════════════════════════════════

.home {
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

  // ── 统计卡片 ──
  .stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-md);
    margin-bottom: var(--space-lg);

    @media (max-width: 900px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: var(--space-lg);
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-fast);
    animation: fadeInUp 0.4s var(--ease-out-expo) both;

    &:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    .stat-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-body {
      display: flex;
      flex-direction: column;
      gap: 2px;

      .stat-value {
        font-family: var(--font-heading);
        font-size: 22px;
        font-weight: 700;
        color: var(--text-primary);
        letter-spacing: 1px;
      }

      .stat-label {
        font-size: 12px;
        color: var(--text-tertiary);
      }
    }

    .stat-trend {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 2px;

      .trend-arrow {
        font-size: 13px;
        font-weight: 700;

        &.up { color: var(--celadon); }
        &.down { color: var(--cinnabar); }
      }

      .trend-num {
        font-size: 12px;
        color: var(--text-secondary);
      }
    }
  }

  // ── 自动刷新指示栏 ──
  .refresh-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: var(--space-lg);
    font-size: 12px;
    color: var(--text-tertiary);

    .refresh-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--celadon);
      transition: all var(--transition-fast);

      &.active {
        background: var(--cinnabar);
        animation: pulse 1s ease-in-out infinite;
      }
    }

    .refresh-text {
      flex: 1;
    }

    .refresh-btn {
      all: unset;
      font-size: 11px;
      padding: 3px 12px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        color: var(--cinnabar);
        border-color: var(--cinnabar);
      }
    }
  }

  // ── 双栏网格 ──
  .home-grid {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: var(--space-lg);
    align-items: start;

    @media (max-width: 960px) {
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
    margin-bottom: var(--space-lg);

    .section-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px var(--space-lg);
      border-bottom: 1px solid var(--border-color);
      background: oklch(99% 0.002 55);

      [data-theme='dark'] & {
        background: oklch(14% 0.003 55);
      }

      .section-head-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--text-primary);
        letter-spacing: 1px;
      }

      .section-head-link {
        font-size: 12px;
        color: var(--cinnabar);
        text-decoration: none;
        transition: opacity var(--transition-fast);

        &:hover {
          opacity: 0.7;
        }
      }
    }

    .section-body {
      padding: var(--space-md);

      .empty-hint {
        text-align: center;
        font-size: 13px;
        color: var(--text-tertiary);
        padding: var(--space-lg) 0;

        a {
          color: var(--cinnabar);
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }

  // ── 最近识别行 ──
  .recent-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 8px;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    animation: fadeInUp 0.35s var(--ease-out-expo) both;

    &:hover {
      background: oklch(50% 0.16 28 / 0.04);
    }

    &:not(:last-child) {
      border-bottom: 1px solid var(--border-light);
    }

    .recent-icon {
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: oklch(50% 0.16 28 / 0.06);
      border-radius: var(--radius-md);
      color: var(--cinnabar);
      flex-shrink: 0;
    }

    .recent-body {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;

      .recent-title {
        font-size: 13.5px;
        font-weight: 500;
        color: var(--text-primary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .recent-meta {
        font-size: 11px;
        color: var(--text-tertiary);
      }
    }

    .recent-time {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2px;
      font-size: 11px;
      color: var(--text-tertiary);
      flex-shrink: 0;

      .recent-status {
        font-size: 10px;
        padding: 1px 8px;
        border-radius: var(--radius-full);

        &.done {
          background: oklch(58% 0.08 145 / 0.1);
          color: var(--celadon);
        }

        &.processing {
          background: oklch(65% 0.12 75 / 0.1);
          color: var(--gold);
          animation: pulse 2s ease-in-out infinite;
        }
      }
    }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  // ── 快捷操作 ──
  .quick-actions {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-md);

    .quick-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: var(--space-lg) var(--space-md);
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      text-decoration: none;
      cursor: pointer;
      transition: all var(--transition-fast);
      box-shadow: var(--shadow-sm);

      &:hover {
        border-color: var(--cinnabar);
        box-shadow: 0 0 0 2px oklch(50% 0.16 28 / 0.08);
        transform: translateY(-2px);

        .quick-icon {
          transform: scale(1.08);
          color: var(--cinnabar);
        }
      }

      .quick-icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-lg);
        background: oklch(50% 0.16 28 / 0.06);
        color: var(--text-secondary);
        transition: all var(--transition-spring);
      }

      .quick-label {
        font-size: 14px;
        font-weight: 600;
        color: var(--text-primary);
        letter-spacing: 1px;
      }

      .quick-hint {
        font-size: 11px;
        color: var(--text-tertiary);
      }
    }
  }

  // ── 右侧栏 ──
  .grid-aside {
    position: sticky;
    top: var(--space-xl);
  }

  // ── 今日概览 ──
  .today-stats {
    display: flex;
    gap: 0;

    .today-item {
      flex: 1;
      text-align: center;
      padding: 8px 0;

      &:not(:last-child) {
        border-right: 1px solid var(--border-light);
      }

      .today-num {
        display: block;
        font-family: var(--font-heading);
        font-size: 24px;
        font-weight: 700;
        color: var(--cinnabar);
      }

      .today-label {
        font-size: 11px;
        color: var(--text-tertiary);
        margin-top: 2px;
      }
    }
  }

  // ── 标签云 ──
  .tag-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .cloud-tag {
      cursor: pointer;
      color: var(--text-secondary);
      transition: all var(--transition-fast);
      font-weight: 450;
      padding: 2px 4px;
      border-radius: 3px;

      &:hover {
        color: var(--cinnabar);
        background: oklch(50% 0.16 28 / 0.06);
      }
    }
  }

  // ── 朝代分布 ──
  .dynasty-bars {
    display: flex;
    flex-direction: column;
    gap: 6px;

    .dynasty-bar-row {
      display: flex;
      align-items: center;
      gap: 8px;

      .dynasty-name {
        width: 32px;
        font-size: 11px;
        color: var(--text-secondary);
        text-align: right;
        flex-shrink: 0;
      }

      .dynasty-track {
        flex: 1;
        height: 6px;
        background: var(--border-color);
        border-radius: 3px;
        overflow: hidden;

        .dynasty-fill {
          display: block;
          height: 100%;
          border-radius: 3px;
          background: linear-gradient(90deg, oklch(55% 0.16 28 / 0.5), var(--cinnabar));
          transition: width 0.8s var(--ease-out-expo);
        }
      }

      .dynasty-num {
        width: 24px;
        font-size: 10px;
        color: var(--text-tertiary);
        text-align: right;
        flex-shrink: 0;
      }
    }
  }

  // ── 加载 ──
  .home-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: var(--space-2xl) 0;
    font-size: 14px;
    color: var(--text-secondary);

    .loading-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--cinnabar);
      animation: pulse 1s ease-in-out infinite;
    }
  }

  // ═══════════════════════════════════════
  // 移动端适配
  // ═══════════════════════════════════════
  @media (max-width: 768px) {
    .page-lead {
      margin-bottom: var(--space-md);

      .lead-title {
        font-size: 22px;
        letter-spacing: 2px;
      }

      .lead-desc {
        font-size: 12px;
      }
    }

    .stats-row {
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-sm);
      margin-bottom: var(--space-md);
    }

    .stat-card {
      padding: var(--space-md);
      gap: 10px;

      .stat-icon {
        width: 36px;
        height: 36px;
      }

      .stat-body .stat-value {
        font-size: 18px;
      }
    }

    .section-card {
      margin-bottom: var(--space-md);

      .section-head {
        padding: 10px var(--space-md);
      }

      .section-body {
        padding: var(--space-sm);
      }
    }

    .recent-row {
      padding: 8px 4px;
      gap: 10px;

      .recent-icon {
        width: 30px;
        height: 30px;
      }
    }

    .quick-actions {
      grid-template-columns: 1fr;
      gap: var(--space-sm);

      .quick-card {
        flex-direction: row;
        padding: var(--space-md);
        gap: 12px;

        .quick-icon {
          width: 40px;
          height: 40px;
        }
      }
    }

    .grid-aside {
      position: static;
    }

    .today-stats .today-item .today-num {
      font-size: 20px;
    }
  }

  // 超小屏：统计卡片变单列
  @media (max-width: 480px) {
    .stats-row {
      grid-template-columns: 1fr;
    }
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
