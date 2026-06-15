<template>
  <div class="explore">
    <!-- 页面标识 -->
    <div class="page-lead animate-fade-in-up">
      <div class="lead-badge">
        <span class="badge-line" />
        <span class="badge-text">发现 · 探索</span>
        <span class="badge-line" />
      </div>
      <h1 class="lead-title">知识发现</h1>
      <p class="lead-desc">
        浏览传统文化数字馆藏，沿时间脉络与分类主题自由探索
      </p>
    </div>

    <!-- 朝代时间线 -->
    <section class="timeline-section animate-fade-in-up delay-1">
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
          @click="activeDynasty = activeDynasty === d.name ? null : d.name"
        >
          <span class="node-dot" :style="{ background: d.color }" />
          <span class="node-label">{{ d.name }}</span>
          <span class="node-count">{{ d.count }}</span>
        </button>
      </div>
    </section>

    <!-- 主区域 -->
    <div class="explore-grid">
      <!-- 左栏：分类浏览 -->
      <div class="grid-primary animate-fade-in-up delay-2">
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
            @click="activeCategory = activeCategory === cat.key ? null : cat.key"
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

        <div class="featured-grid">
          <div
            v-for="(item, idx) in filteredFeatured"
            :key="item.id"
            class="featured-card animate-fade-in-up"
            :style="{ animationDelay: `${0.06 * idx}s` }"
            @click="goDetail(item.id)"
          >
            <div class="featured-visual">
              <div class="visual-placeholder" :style="{ background: item.bg }">
                <div v-html="item.visual" />
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
      </div>

      <!-- 右栏：知识图谱简化版 -->
      <aside class="grid-aside animate-fade-in-up delay-3">
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
            <div class="graph-list">
              <div
                v-for="(edge, idx) in graphEdges"
                :key="idx"
                class="graph-edge"
              >
                <span class="edge-node edge-from" @click="navigateToSearch(edge.from)">
                  {{ edge.from }}
                </span>
                <span class="edge-relation">{{ edge.relation }}</span>
                <span class="edge-node edge-to" @click="navigateToSearch(edge.to)">
                  {{ edge.to }}
                </span>
              </div>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const activeDynasty = ref<string | null>(null)
const activeCategory = ref<string | null>(null)

// ── 朝代时间线 ──
const dynasties = [
  { name: '先秦', count: 42, color: 'oklch(60% 0.08 55)' },
  { name: '汉', count: 78, color: 'oklch(58% 0.09 45)' },
  { name: '魏晋', count: 95, color: 'oklch(56% 0.1 35)' },
  { name: '唐', count: 280, color: 'var(--cinnabar)' },
  { name: '宋', count: 210, color: 'oklch(65% 0.12 75)' },
  { name: '元', count: 65, color: 'oklch(60% 0.08 145)' },
  { name: '明', count: 160, color: 'oklch(52% 0.07 250)' },
  { name: '清', count: 120, color: 'oklch(55% 0.05 300)' }
]

// ── 分类 ──
const categories = [
  {
    key: 'calligraphy', label: '书法碑帖', count: 286,
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>'
  },
  {
    key: 'painting', label: '绘画卷轴', count: 412,
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>'
  },
  {
    key: 'poetry', label: '诗词文献', count: 523,
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'
  },
  {
    key: 'artifact', label: '器物工艺', count: 198,
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>'
  },
  {
    key: 'sculpture', label: '石窟造像', count: 87,
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>'
  },
  {
    key: 'architecture', label: '古建园林', count: 64,
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="4" y="2" width="16" height="20" rx="1"/><line x1="9" y1="22" x2="9" y2="18"/><line x1="15" y1="22" x2="15" y2="18"/></svg>'
  }
]

const getCategoryName = (key: string | null) => {
  if (!key) return ''
  return categories.find(c => c.key === key)?.label || ''
}

// ── 精选推荐 ──
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
}

const allFeatured: FeaturedItem[] = [
  {
    id: 'feat-01', title: '千里江山图', desc: '北宋青绿山水巅峰之作，以矿物颜料绘出壮丽山河，体现了宋代宫廷绘画的最高成就……', dynasty: '宋', author: '王希孟', category: '绘画',
    bg: 'linear-gradient(135deg, oklch(85% 0.04 145 / 0.3), oklch(75% 0.06 145 / 0.2))',
    accent: 'var(--celadon)',
    visual: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--celadon)" stroke-width="1" stroke-linecap="round"><path d="M2 20 L8 12 L14 16 L20 6 L22 8"/></svg>'
  },
  {
    id: 'feat-02', title: '《祭侄文稿》', desc: '颜真卿行书代表作，被称为"天下第二行书"，满纸忠愤，笔墨中尽显家国情怀……', dynasty: '唐', author: '颜真卿', category: '书法',
    bg: 'linear-gradient(135deg, oklch(85% 0.02 55 / 0.3), oklch(75% 0.03 40 / 0.2))',
    accent: 'var(--vermillion)',
    visual: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--vermillion)" stroke-width="1" stroke-linecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>'
  },
  {
    id: 'feat-03', title: '敦煌莫高窟第45窟', desc: '盛唐时期代表性洞窟，彩塑与壁画完美结合，展现佛教艺术的巅峰水准……', dynasty: '唐', author: '佚名', category: '石窟',
    bg: 'linear-gradient(135deg, oklch(80% 0.06 250 / 0.25), oklch(70% 0.05 220 / 0.15))',
    accent: 'var(--azure)',
    visual: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--azure)" stroke-width="1" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>'
  },
  {
    id: 'feat-04', title: '《永乐大典》残卷', desc: '明成祖朱棣敕修的大型类书，收录上古至明初典籍八千余种，是世界最大的百科全书……', dynasty: '明', author: '解缙等', category: '文献',
    bg: 'linear-gradient(135deg, oklch(85% 0.02 55 / 0.3), oklch(80% 0.04 50 / 0.2))',
    accent: 'var(--gold)',
    visual: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="1" stroke-linecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
  },
  {
    id: 'feat-05', title: '青花萧何月下追韩信梅瓶', desc: '元青花人物故事纹代表作，釉下青花发色浓艳，人物刻画生动传神，极为珍贵……', dynasty: '元', author: '景德镇窑', category: '器物',
    bg: 'linear-gradient(135deg, oklch(85% 0.03 250 / 0.3), oklch(78% 0.04 240 / 0.2))',
    accent: 'var(--azure)',
    visual: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--azure)" stroke-width="1" stroke-linecap="round"><path d="M5 3h14l3 6-3 12H5L2 9l3-6z"/></svg>'
  },
  {
    id: 'feat-06', title: '《诗经·国风》竹简', desc: '中国最早的诗歌总集，记录了西周至春秋时期的民间歌谣与社会风貌……', dynasty: '先秦', author: '佚名', category: '文献',
    bg: 'linear-gradient(135deg, oklch(82% 0.02 70 / 0.25), oklch(76% 0.03 60 / 0.18))',
    accent: 'oklch(55% 0.08 70)',
    visual: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="oklch(55% 0.08 70)" stroke-width="1" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'
  }
]

const filteredFeatured = computed(() => {
  return allFeatured.filter(item => {
    if (activeDynasty.value && item.dynasty !== activeDynasty.value) return false
    if (activeCategory.value) {
      const cat = categories.find(c => c.key === activeCategory.value)
      if (cat && item.category !== cat.label && item.category !== '文献') return false
    }
    return true
  })
})

// ── 文化词云 ──
const wordCloud = [
  { text: '山水', size: 20, opacity: 0.9, color: 'var(--celadon)' },
  { text: '书法', size: 18, opacity: 0.85, color: 'var(--vermillion)' },
  { text: '敦煌', size: 19, opacity: 0.9, color: 'var(--gold)' },
  { text: '青花', size: 16, opacity: 0.8, color: 'var(--azure)' },
  { text: '佛教', size: 17, opacity: 0.85, color: 'var(--cinnabar)' },
  { text: '唐诗', size: 18, opacity: 0.88, color: 'var(--cinnabar)' },
  { text: '宋词', size: 17, opacity: 0.85, color: 'var(--gold)' },
  { text: '水墨', size: 16, opacity: 0.8, color: 'var(--celadon)' },
  { text: '造像', size: 14, opacity: 0.75, color: 'var(--azure)' },
  { text: '诗经', size: 15, opacity: 0.78, color: 'var(--vermillion)' },
  { text: '器物', size: 14, opacity: 0.75, color: 'var(--gold)' },
  { text: '碑帖', size: 15, opacity: 0.78, color: 'var(--cinnabar)' },
  { text: '园林', size: 13, opacity: 0.7, color: 'var(--celadon)' },
  { text: '明代', size: 14, opacity: 0.75, color: 'var(--azure)' },
  { text: '唐代', size: 17, opacity: 0.85, color: 'var(--cinnabar)' },
  { text: '元代', size: 13, opacity: 0.7, color: 'var(--gold)' },
  { text: '乐府', size: 12, opacity: 0.68, color: 'var(--vermillion)' },
  { text: '纹样', size: 14, opacity: 0.75, color: 'var(--celadon)' },
  { text: '丝路', size: 15, opacity: 0.78, color: 'var(--gold)' },
  { text: '文人', size: 13, opacity: 0.7, color: 'var(--azure)' }
]

// ── 关联图谱边 ──
const graphEdges = [
  { from: '王维', relation: '开创', to: '文人山水画' },
  { from: '苏轼', relation: '影响', to: '宋代书法' },
  { from: '敦煌', relation: '交汇', to: '丝绸之路' },
  { from: '青花', relation: '融合', to: '伊斯兰纹样' },
  { from: '颜真卿', relation: '传承', to: '唐代楷书' },
  { from: '诗经', relation: '影响', to: '后世诗词' },
  { from: '佛教', relation: '催生', to: '石窟艺术' }
]

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
</script>

<style scoped lang="scss">
// ═══════════════════════════════════════════
// 当代山水 · 知识发现
// ═══════════════════════════════════════════

.explore {
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

    .node-count {
      font-size: 10px;
      color: var(--text-tertiary);
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
    height: 100px;
    overflow: hidden;

    .visual-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform var(--transition-slow);
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
    }
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

  // ── 关联图谱 ──
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
