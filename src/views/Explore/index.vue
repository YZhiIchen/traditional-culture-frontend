<template>
  <div class="explore">
    <!-- Hero 区域 -->
    <div class="hero-section animate-fade-in-up">
      <div class="hero-visual">
        <img src="/images/bg-explore.jpg" alt="古籍" class="hero-image" />
        <div class="hero-overlay" />
      </div>
      <div class="hero-content">
        <div class="lead-badge">
          <span class="badge-line" />
          <span class="badge-text">发现 · 探索</span>
          <span class="badge-line" />
        </div>
        <h1 class="hero-title">知识发现</h1>
        <p class="hero-desc">
          浏览传统文化数字馆藏，沿时间脉络与分类主题自由探索
        </p>
      </div>
    </div>

    <!-- 朝代时间线 -->
    <section class="timeline-section" v-reveal="{ delay: 80 }">
      <div class="section-label">
        <span class="label-dot">◆</span>
        朝代时间轴
      </div>
      <div class="timeline-track">
        <button
          v-for="d in dynasties"
          :key="d.name"
          class="timeline-node"
          :class="{ active: activeDynasty === d.name }"
          @click="onDynastyClick(d.name)"
        >
          <span class="node-dot" :style="{ background: d.color }" />
          <span class="node-label">{{ d.name }}</span>
          <span class="node-year">{{ d.year }}</span>
        </button>
      </div>
    </section>

    <!-- 主区域 -->
    <div class="explore-grid">
      <!-- 左栏：分类浏览 -->
      <div class="grid-primary" v-reveal="{ delay: 160 }">
        <!-- 分类标签 -->
        <div class="section-label">
          <span class="label-dot">◆</span>
          分类浏览
        </div>

        <div class="category-grid">
          <div
            v-for="cat in categories"
            :key="cat.key"
            class="category-card"
            :class="{ active: activeCategory === cat.key }"
            @click="onCategoryClick(cat.key)"
          >
            <div class="cat-icon" v-html="cat.icon" />
            <div class="cat-info">
              <span class="cat-name">{{ cat.label }}</span>
              <span class="cat-count">{{ cat.count }} 件</span>
            </div>
            <div class="cat-arrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round"
                   stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </div>
        </div>

        <!-- 检索按钮 -->
        <div class="search-redirect" v-if="activeCategory || activeDynasty">
          <button class="action-btn" @click="goSearchWithFilter">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                 stroke-linejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            检索 {{ activeDynasty }}{{ activeCategory ? getCategoryName(activeCategory) : '' }} 相关资源
          </button>
        </div>

        <!-- 精选内容 -->
        <div class="section-label" style="margin-top: var(--space-xl)">
          <span class="label-dot">◆</span>
          精选推荐
        </div>

        <div class="featured-grid" v-if="allFeatured.length">
          <div
            v-for="(item, idx) in allFeatured"
            :key="item.id"
            class="featured-card"
            v-reveal="{ delay: 60 * idx }"
            @click="goDetail(item.id)"
          >
            <div class="featured-visual">
              <div class="visual-media" :style="{ background: item.bg }">
                <img v-if="item.image" :src="item.image" :alt="item.title" class="media-img" />
                <div v-else class="media-fallback" v-html="item.visual" />
              </div>
              <div class="visual-badge" :style="{ color: item.accent }">
                {{ item.category }}
              </div>
            </div>
            <div class="featured-body">
              <h3 class="featured-title">{{ item.title }}</h3>
              <p class="featured-desc">{{ item.desc }}</p>
              <div class="featured-meta">
                <span class="meta-dynasty" :style="{ color: item.accent }">{{ item.dynasty }}</span>
                <span class="meta-author">· {{ item.author }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="featuredLoading" class="featured-loading">
          <span class="loading-dot" /><span class="loading-dot" /><span class="loading-dot" />
        </div>
        <div v-else class="featured-empty">
          <span>暂无符合条件的推荐内容</span>
          <button class="reset-btn" @click="activeDynasty = null; activeCategory = null; loadFeatured()">重置筛选</button>
        </div>
      </div>

      <!-- 右栏：知识图谱简化版 -->
      <aside class="grid-aside" v-reveal="{ delay: 240 }">
        <!-- 文化词云 -->
        <section class="section-card">
          <div class="section-head">
            <span class="section-head-title">文化词云</span>
          </div>
          <div class="section-body">
            <div class="word-cloud">
              <span
                v-for="word in wordCloud"
                :key="word.text"
                class="cloud-word"
                :style="{
                  fontSize: `${word.size}px`,
                  opacity: word.opacity,
                  color: word.color
                }"
                @click="navigateToSearch(word.text)"
              >
                {{ word.text }}
              </span>
            </div>
          </div>
        </section>

        <!-- 关联图谱摘要 -->
        <section class="section-card">
          <div class="section-head">
            <span class="section-head-title">关联发现</span>
            <span class="section-head-hint">基于知识图谱</span>
          </div>
          <div class="section-body">
            <!-- SVG 可视化图谱 -->
            <div class="graph-canvas" v-if="graphNodes.length">
              <svg width="240" height="240" viewBox="0 0 240 240">
                <!-- 连线 -->
                <g class="graph-links">
                  <line
                    v-for="(line, idx) in graphLines"
                    :key="'line-' + idx"
                    :x1="line.from.x" :y1="line.from.y"
                    :x2="line.to.x" :y2="line.to.y"
                    stroke="var(--cinnabar)"
                    stroke-width="1"
                    opacity="0.2"
                    stroke-dasharray="3,2"
                  />
                </g>
                <!-- 关系标签 -->
                <g class="graph-labels">
                  <text
                    v-for="(line, idx) in graphLines"
                    :key="'label-' + idx"
                    :x="line.midX" :y="line.midY"
                    text-anchor="middle"
                    dominant-baseline="middle"
                    font-size="9"
                    fill="var(--text-tertiary)"
                    style="font-style: italic"
                  >{{ line.relation }}</text>
                </g>
                <!-- 节点 -->
                <g class="graph-nodes">
                  <g
                    v-for="node in graphNodes"
                    :key="node.id"
                    :transform="`translate(${node.x}, ${node.y})`"
                    class="graph-node"
                    @click="navigateToSearch(node.id)"
                  >
                    <circle
                      :r="node.type === 'from' ? 18 : 14"
                      :fill="node.type === 'from' ? 'var(--cinnabar)' : 'var(--celadon)'"
                      opacity="0.15"
                      class="node-bg"
                    />
                    <circle
                      :r="node.type === 'from' ? 18 : 14"
                      :stroke="node.type === 'from' ? 'var(--cinnabar)' : 'var(--celadon)'"
                      stroke-width="1"
                      fill="none"
                      opacity="0.4"
                      class="node-ring"
                    />
                    <text
                      text-anchor="middle"
                      dominant-baseline="middle"
                      :font-size="node.id.length > 3 ? 8 : 10"
                      :fill="node.type === 'from' ? 'var(--cinnabar)' : 'var(--text-secondary)'"
                      style="font-weight: 500; pointer-events: none"
                    >{{ node.id.length > 4 ? node.id.slice(0, 3) + '…' : node.id }}</text>
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </section>

        <!-- 装饰 -->
        <div class="aside-ornament">
          <svg width="64" height="64" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="39" stroke="currentColor" stroke-width="0.5" opacity="0.1" />
            <circle cx="40" cy="40" r="25" stroke="currentColor" stroke-width="0.3" opacity="0.08" />
            <circle cx="40" cy="40" r="12" stroke="currentColor" stroke-width="0.5" opacity="0.06" />
            <circle cx="40" cy="40" r="3" fill="var(--cinnabar)" opacity="0.15" />
          </svg>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onActivated, onDeactivated } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'

const router = useRouter()

const activeDynasty = ref<string | null>(null)
const activeCategory = ref<string | null>(null)
const loading = ref(true)
const featuredLoading = ref(false)

// ── 朝代时间线（真实数据 + 年代显示）──
const dynasties = ref<{ name: string; count: number; year: string; color: string }[]>([
  { name: '先秦', count: 0, year: '前2070-前221', color: 'oklch(60% 0.08 55)' },
  { name: '汉', count: 0, year: '前202-220', color: 'oklch(58% 0.09 45)' },
  { name: '魏晋', count: 0, year: '220-589', color: 'oklch(56% 0.1 35)' },
  { name: '唐', count: 0, year: '618-907', color: 'var(--cinnabar)' },
  { name: '宋', count: 0, year: '960-1279', color: 'oklch(65% 0.12 75)' },
  { name: '元', count: 0, year: '1271-1368', color: 'oklch(60% 0.08 145)' },
  { name: '明', count: 0, year: '1368-1644', color: 'oklch(52% 0.07 250)' },
  { name: '清', count: 0, year: '1644-1912', color: 'oklch(55% 0.05 300)' }
])

// ── 分类（真实数据）──
const categoryIcons: Record<string, string> = {
  calligraphy: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
  painting: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
  poetry: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  artifact: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
  sculpture: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>',
  architecture: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="4" y="2" width="16" height="20" rx="1"/><line x1="9" y1="22" x2="9" y2="18"/><line x1="15" y1="22" x2="15" y2="18"/></svg>'
}

const categories = ref<{ key: string; label: string; count: number; icon: string }[]>([
  { key: 'calligraphy', label: '书法碑帖', count: 0, icon: categoryIcons['calligraphy'] },
  { key: 'painting', label: '绘画卷轴', count: 0, icon: categoryIcons['painting'] },
  { key: 'poetry', label: '诗词文献', count: 0, icon: categoryIcons['poetry'] },
  { key: 'artifact', label: '器物工艺', count: 0, icon: categoryIcons['artifact'] },
  { key: 'sculpture', label: '石窟造像', count: 0, icon: categoryIcons['sculpture'] },
  { key: 'architecture', label: '古建园林', count: 0, icon: categoryIcons['architecture'] },
])

const getCategoryName = (key: string | null) => {
  if (!key) return ''
  return categories.value.find(c => c.key === key)?.label || ''
}

// ── 精选推荐（真实数据）──
interface FeaturedItem {
  id: string
  title: string
  desc: string
  dynasty: string
  author: string
  category: string
  bg: string
  accent: string
  visual: string
  image?: string
}

const allFeatured = ref<FeaturedItem[]>([])

// ── 文化词云（真实数据）──
const wordCloud = ref<{ text: string; size: number; opacity: number; color: string }[]>([])

const colorPool = ['var(--celadon)', 'var(--vermillion)', 'var(--gold)', 'var(--azure)', 'var(--cinnabar)']

// ── 关联图谱（真实数据 + 可视化）──
interface GraphEdge {
  from: string
  relation: string
  to: string
}
const graphEdges = ref<GraphEdge[]>([])

// 计算图谱节点和边的 SVG 坐标（环形布局）
const graphNodes = computed(() => {
  if (!graphEdges.value.length) return []
  const nodeMap = new Map<string, { id: string; x: number; y: number; type: 'from' | 'to' }>()
  const allNodes = new Set<string>()
  graphEdges.value.forEach(e => {
    allNodes.add(e.from)
    allNodes.add(e.to)
  })
  const nodes = Array.from(allNodes)
  const cx = 120, cy = 120, r = 85
  nodes.forEach((id, i) => {
    const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2
    nodeMap.set(id, {
      id,
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      type: graphEdges.value.some(e => e.from === id) ? 'from' : 'to',
    })
  })
  return Array.from(nodeMap.values())
})

const graphLines = computed(() => {
  if (!graphEdges.value.length || !graphNodes.value.length) return []
  return graphEdges.value.map(edge => {
    const fromNode = graphNodes.value.find(n => n.id === edge.from)
    const toNode = graphNodes.value.find(n => n.id === edge.to)
    if (!fromNode || !toNode) return null
    const midX = (fromNode.x + toNode.x) / 2
    const midY = (fromNode.y + toNode.y) / 2
    return {
      from: fromNode,
      to: toNode,
      relation: edge.relation,
      midX,
      midY,
    }
  }).filter(Boolean) as { from: any; to: any; relation: string; midX: number; midY: number }[]
})

const navigateToSearch = (keyword: string) => {
  router.push(`/search?keyword=${encodeURIComponent(keyword)}`)
}

const goSearchWithFilter = () => {
  const parts: string[] = []
  if (activeDynasty.value) parts.push(activeDynasty.value)
  if (activeCategory.value) parts.push(getCategoryName(activeCategory.value))
  router.push(`/search?keyword=${encodeURIComponent(parts.join(' '))}`)
}

const goDetail = (id: string) => {
  router.push(`/recognition/${id}`)
}

// ── 加载精选推荐（支持筛选）──
const loadFeatured = async () => {
  featuredLoading.value = true
  try {
    const params: any = {}
    if (activeDynasty.value) params.dynasty = activeDynasty.value
    if (activeCategory.value) params.category = activeCategory.value

    const recommend: any = await request.get('/explore/recommend', params)
    if (recommend?.length) {
      const categoryColors: Record<string, { bg: string; accent: string }> = {
        '绘画': { bg: 'linear-gradient(135deg, oklch(85% 0.04 145 / 0.3), oklch(75% 0.06 145 / 0.2))', accent: 'var(--celadon)' },
        '书法': { bg: 'linear-gradient(135deg, oklch(85% 0.02 55 / 0.3), oklch(75% 0.03 40 / 0.2))', accent: 'var(--vermillion)' },
        '石窟': { bg: 'linear-gradient(135deg, oklch(80% 0.06 250 / 0.25), oklch(70% 0.05 220 / 0.15))', accent: 'var(--azure)' },
        '文献': { bg: 'linear-gradient(135deg, oklch(85% 0.02 55 / 0.3), oklch(80% 0.04 50 / 0.2))', accent: 'var(--gold)' },
        '器物': { bg: 'linear-gradient(135deg, oklch(85% 0.03 250 / 0.3), oklch(78% 0.04 240 / 0.2))', accent: 'var(--azure)' },
      }
      const defaultStyle = { bg: 'linear-gradient(135deg, oklch(85% 0.02 55 / 0.3), oklch(75% 0.03 40 / 0.2))', accent: 'var(--cinnabar)' }

      const categoryImages: Record<string, string> = {
        '绘画': '/images/painting-scroll.jpg',
        '书法': '/images/bg-explore.jpg',
        '器物': '/images/artifacts.jpg',
      }

      allFeatured.value = recommend.map((r: any) => {
        const style = categoryColors[r.category] || defaultStyle
        return {
          id: r.id,
          title: r.title,
          desc: r.desc || '暂无描述',
          dynasty: r.dynasty,
          author: r.author,
          category: r.category,
          bg: style.bg,
          accent: style.accent,
          image: r.image || categoryImages[r.category],
          visual: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>'
        }
      })
    } else {
      allFeatured.value = []
    }
  } catch {
    // 保留已有数据
  } finally {
    featuredLoading.value = false
  }
}

// ── 加载基础数据（朝代/分类/词云/图谱）──
let dataLoaded = false
const loadBaseData = async () => {
  try {
    const [dynRes, tagsRes, graphRes] = await Promise.all([
      request.get('/explore/dynasty-counts'),
      request.get('/dashboard/global-tags'),
      request.get('/explore/graph'),
    ])

    // 朝代（保留 year 字段，更新 count 和 color）
    const dynData: any[] = dynRes || []
    const dynMap = new Map(dynData.map(d => [d.name, d]))
    dynasties.value = dynasties.value.map(d => ({
      ...d,
      count: dynMap.get(d.name)?.count ?? 0,
      color: dynMap.get(d.name)?.color ?? d.color,
    }))

    // 分类（单独加载，支持后续朝代筛选复用）
    await loadCategories()

    // 词云
    const tagsData: any[] = tagsRes || []
    if (tagsData.length) {
      const maxCount = Math.max(...tagsData.map(t => t.count), 1)
      wordCloud.value = tagsData.slice(0, 20).map((t, i) => ({
        text: t.name,
        size: 12 + Math.round((t.count / maxCount) * 8),
        opacity: 0.6 + (t.count / maxCount) * 0.35,
        color: colorPool[i % colorPool.length],
      }))
    }

    // 图谱
    const graphData: any[] = graphRes || []
    if (graphData.length) {
      graphEdges.value = graphData.slice(0, 7)
    }

    dataLoaded = true
  } catch {
    // 保留默认数据
  }
}

// ── 加载分类统计（支持朝代筛选）──
const loadCategories = async () => {
  try {
    const params: any = {}
    if (activeDynasty.value) params.dynasty = activeDynasty.value
    const catData: any[] = await request.get('/explore/categories', params)
    const catMap = new Map(catData.map(c => [c.key, c]))
    categories.value = categories.value.map(c => ({
      ...c,
      count: catMap.get(c.key)?.count ?? 0,
    }))
  } catch {
    // 保留已有数据
  }
}

// ── 朝代/分类点击 → 筛选推荐 ──
const onDynastyClick = async (name: string) => {
  activeDynasty.value = activeDynasty.value === name ? null : name
  // 朝代变化时：重新加载分类数量 + 精选推荐
  await Promise.all([loadCategories(), loadFeatured()])
}

const onCategoryClick = (key: string) => {
  activeCategory.value = activeCategory.value === key ? null : key
  loadFeatured()
}

// ── 生命周期：keep-alive 优化 ──
onMounted(async () => {
  loading.value = true
  await Promise.all([loadBaseData(), loadFeatured()])
  loading.value = false
})

// keep-alive 重新激活时：如果数据超过 5 分钟未刷新则重新加载
let lastLoadTime = Date.now()
const STALE_THRESHOLD = 5 * 60 * 1000 // 5 分钟

onActivated(async () => {
  if (dataLoaded && Date.now() - lastLoadTime < STALE_THRESHOLD) {
    return // 数据新鲜，跳过
  }
  await loadBaseData()
  lastLoadTime = Date.now()
})

onDeactivated(() => {
  lastLoadTime = Date.now()
})
</script>

<style scoped lang="scss">
// ═══════════════════════════════════════════
// 当代山水 · 知识发现
// ═══════════════════════════════════════════

.explore {
  // ── Hero 区域 ──
  .hero-section {
    position: relative;
    margin: calc(var(--space-xl) * -1) calc(var(--space-2xl) * -1) var(--space-xl);
    min-height: 260px;
    display: flex;
    align-items: center;
    overflow: hidden;
    border-radius: 0 0 var(--radius-xl) var(--radius-xl);

    @media (max-width: 768px) {
      margin: calc(var(--space-md) * -1) calc(var(--space-md) * -1) var(--space-lg);
      min-height: 220px;
    }
  }

  .hero-visual {
    position: absolute;
    inset: 0;
    z-index: 0;

    .hero-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 40%;
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        oklch(12% 0.02 55 / 0.8) 0%,
        oklch(12% 0.02 55 / 0.5) 50%,
        oklch(12% 0.02 55 / 0.2) 100%
      );

      [data-theme='dark'] & {
        background: linear-gradient(
          90deg,
          oklch(8% 0.01 55 / 0.9) 0%,
          oklch(8% 0.01 55 / 0.6) 50%,
          oklch(8% 0.01 55 / 0.3) 100%
        );
      }
    }
  }

  .hero-content {
    position: relative;
    z-index: 1;
    padding: var(--space-2xl) var(--space-2xl);
    max-width: 600px;

    @media (max-width: 768px) {
      padding: var(--space-xl) var(--space-lg);
    }

    .lead-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;

      .badge-line {
        width: 20px;
        height: 1px;
        background: var(--gold);
        opacity: 0.5;
      }

      .badge-text {
        font-size: 11px;
        color: var(--gold);
        letter-spacing: 3px;
        text-transform: uppercase;
        opacity: 0.9;
      }
    }

    .hero-title {
      font-family: var(--font-heading);
      font-size: clamp(26px, 4vw, 36px);
      font-weight: 700;
      color: #fff;
      letter-spacing: 6px;
      text-shadow: 0 2px 12px oklch(12% 0.02 55 / 0.3);
      margin-bottom: 8px;
    }

    .hero-desc {
      font-size: 14px;
      color: oklch(90% 0.005 55 / 0.85);
      max-width: 440px;
      line-height: 1.7;
    }
  }

  .section-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: 1px;
    margin-bottom: var(--space-md);

    .label-dot {
      font-size: 6px;
      color: var(--cinnabar);
      opacity: 0.5;
    }
  }

  // ── 时间轴 ──
  .timeline-section {
    margin-bottom: var(--space-xl);
  }

  .timeline-track {
    display: flex;
    justify-content: space-between;
    gap: 0;
    padding: var(--space-md) 0;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-sm);
    overflow-x: auto;
    position: relative;

    // 底层连线
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 30px;
      right: 30px;
      height: 1px;
      background: linear-gradient(90deg,
        var(--border-color) 0%,
        var(--cinnabar) 50%,
        var(--border-color) 100%
      );
      opacity: 0.3;
    }
  }

  .timeline-node {
    all: unset;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    cursor: pointer;
    position: relative;
    z-index: 1;
    transition: all var(--transition-fast);
    border-radius: var(--radius-md);
    min-width: 60px;

    &:hover {
      background: oklch(50% 0.16 28 / 0.04);

      .node-label {
        color: var(--cinnabar);
      }
    }

    &.active {
      .node-dot {
        transform: scale(1.5);
        box-shadow: 0 0 12px currentColor;
      }

      .node-label {
        color: var(--cinnabar);
        font-weight: 700;
      }
    }

    .node-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      transition: all var(--transition-spring);
      flex-shrink: 0;
    }

    .node-label {
      font-family: var(--font-heading);
      font-size: 13px;
      color: var(--text-secondary);
      transition: all var(--transition-fast);
      white-space: nowrap;
    }

    .node-year {
      font-size: 10px;
      color: var(--text-tertiary);
      font-family: var(--font-mono, monospace);
      white-space: nowrap;
    }
  }

  // ── 双栏 ──
  .explore-grid {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: var(--space-lg);
    align-items: start;

    @media (max-width: 960px) {
      grid-template-columns: 1fr;
    }
  }

  // ── 分类网格 ──
  .category-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-md);
    margin-bottom: var(--space-lg);

    @media (max-width: 700px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .category-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: var(--space-md);
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--transition-fast);

    &:hover {
      border-color: var(--cinnabar);
      box-shadow: 0 0 0 2px oklch(50% 0.16 28 / 0.06);

      .cat-arrow {
        opacity: 1;
        transform: translateX(0);
      }
    }

    &.active {
      border-color: var(--cinnabar);
      background: oklch(50% 0.16 28 / 0.04);

      .cat-arrow {
        opacity: 1;
        color: var(--cinnabar);
      }

      .cat-name {
        color: var(--cinnabar);
      }
    }

    .cat-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-md);
      background: oklch(50% 0.16 28 / 0.06);
      color: var(--text-secondary);
      flex-shrink: 0;
      transition: color var(--transition-fast);
    }

    &:hover .cat-icon,
    &.active .cat-icon {
      color: var(--cinnabar);
    }

    .cat-info {
      flex: 1;
      min-width: 0;

      .cat-name {
        display: block;
        font-size: 13px;
        font-weight: 600;
        color: var(--text-primary);
        transition: color var(--transition-fast);
      }

      .cat-count {
        font-size: 11px;
        color: var(--text-tertiary);
      }
    }

    .cat-arrow {
      opacity: 0;
      transform: translateX(-4px);
      transition: all var(--transition-fast);
      color: var(--text-secondary);
    }
  }

  // ── 检索重定向 ──
  .search-redirect {
    text-align: center;
    margin-bottom: var(--space-lg);
  }

  .action-btn {
    all: unset;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0 24px;
    height: 42px;
    font-size: 14px;
    letter-spacing: 1px;
    border-radius: var(--radius-md);
    background: linear-gradient(135deg, var(--cinnabar), oklch(42% 0.14 28));
    color: #fff;
    cursor: pointer;
    transition: all var(--transition-fast);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px oklch(50% 0.16 28 / 0.25);
    }
  }

  // ── 精选推荐 ──
  .featured-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-md);

    @media (max-width: 700px) {
      grid-template-columns: 1fr;
    }
  }

  .featured-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    overflow: hidden;
    cursor: pointer;
    transition: all var(--transition-fast);
    box-shadow: var(--shadow-sm);

    &:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
      border-color: oklch(50% 0.16 28 / 0.15);

      .visual-placeholder {
        transform: scale(1.05);
      }
    }
  }

  .featured-visual {
    position: relative;
    height: 140px;
    overflow: hidden;

    .visual-media {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform var(--transition-slow);
      position: relative;

      .media-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform var(--transition-slow);
      }

      .media-fallback {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .visual-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      font-size: 10px;
      padding: 2px 8px;
      border-radius: var(--radius-full);
      background: var(--bg-card);
      font-weight: 500;
      z-index: 1;
    }
  }

  .featured-card:hover .visual-media .media-img {
    transform: scale(1.05);
  }

  .featured-body {
    padding: var(--space-md);

    .featured-title {
      font-family: var(--font-heading);
      font-size: 15px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 4px;
    }

    .featured-desc {
      font-size: 12px;
      color: var(--text-secondary);
      line-height: 1.6;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 8px;
    }

    .featured-meta {
      font-size: 12px;
      color: var(--text-tertiary);

      .meta-dynasty {
        font-weight: 600;
      }
    }
  }

  // ── 右侧栏 ──
  .grid-aside {
    position: sticky;
    top: var(--space-xl);
  }

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

      .section-head-hint {
        font-size: 11px;
        color: var(--text-tertiary);
      }
    }

    .section-body {
      padding: var(--space-md);
    }
  }

  // ── 文化词云 ──
  .word-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 2px;
    align-items: center;
    justify-content: center;
    padding: var(--space-sm) 0;
    min-height: 100px;

    .cloud-word {
      cursor: pointer;
      transition: all var(--transition-fast);
      font-weight: 500;
      padding: 2px 4px;
      border-radius: 2px;
      line-height: 1.2;

      &:hover {
        transform: scale(1.15);
        background: oklch(50% 0.16 28 / 0.06);
      }
    }
  }

  .featured-loading {
      display: flex;
      justify-content: center;
      gap: 6px;
      padding: var(--space-xl);

      .loading-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--cinnabar);
        animation: bounce 1.4s infinite ease-in-out;
        &:nth-child(2) { animation-delay: 0.2s; }
        &:nth-child(3) { animation-delay: 0.4s; }
      }
    }

    .featured-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-xl);
      color: var(--text-tertiary);
      font-size: 13px;

      .reset-btn {
        all: unset;
        font-size: 12px;
        padding: 4px 16px;
        border-radius: var(--radius-md);
        border: 1px solid var(--border-color);
        color: var(--cinnabar);
        cursor: pointer;
        transition: all var(--transition-fast);

        &:hover {
          background: var(--cinnabar);
          color: #fff;
          border-color: var(--cinnabar);
        }
      }
    }

    // ── 关联图谱 ──
  .graph-canvas {
      display: flex;
      justify-content: center;
      margin-bottom: var(--space-md);

      .graph-node {
        cursor: pointer;

        // hover 时放大圆环（用 SVG 属性而非 CSS transform，避免与 translate 冲突）
        &:hover .node-bg {
          opacity: 0.25;
        }
        &:hover .node-ring {
          stroke-width: 2;
          opacity: 0.7;
        }
      }
    }

    .graph-list {
    display: flex;
    flex-direction: column;
    gap: 6px;

    .graph-edge {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 0;
      font-size: 12px;

      .edge-node {
        padding: 2px 8px;
        border-radius: var(--radius-full);
        cursor: pointer;
        transition: all var(--transition-fast);

        &:hover {
          background: oklch(50% 0.16 28 / 0.08);
          color: var(--cinnabar);
        }

        &.edge-from {
          background: oklch(50% 0.16 28 / 0.05);
          color: var(--text-primary);
          font-weight: 500;
        }

        &.edge-to {
          background: var(--border-light);
          color: var(--text-secondary);
        }
      }

      .edge-relation {
        font-size: 10px;
        color: var(--text-tertiary);
        font-style: italic;
        flex-shrink: 0;
        padding: 0 2px;
      }
    }
  }

  // ── 装饰 ──
  .aside-ornament {
    margin-top: var(--space-lg);
    display: flex;
    justify-content: center;
    color: var(--text-primary);
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
