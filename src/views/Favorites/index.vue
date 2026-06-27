<template>
  <div class="favorites">
    <div class="page-hero" v-reveal="{ delay: 0 }">
      <img src="/images/bg-favorites.jpg" alt="" class="page-hero-bg" />
      <div class="page-hero-overlay" />
      <div class="page-hero-content">
        <div class="hero-badge">
          <span class="hero-badge-line" />
          <span class="hero-badge-text">我的 · 收藏</span>
          <span class="hero-badge-line" />
        </div>
        <h1 class="hero-title">我的收藏</h1>
        <p class="hero-desc">收藏感兴趣的传统文化资源</p>
      </div>
    </div>

    <!-- 批量操作 -->
    <div v-if="selected.length > 0" class="batch-bar">
      <span class="batch-count">已选 {{ selected.length }} 项</span>
      <button class="batch-action-btn" @click="batchUnfavorite">取消收藏</button>
      <button class="batch-cancel-btn" @click="selected = []">取消选择</button>
    </div>

    <div v-if="loading" class="skeleton-area"><div class="skeleton-row" v-for="n in 3" :key="n" /></div>

    <div v-else-if="list.length === 0" class="empty-state" v-reveal="{ delay: 160 }">
      <div class="empty-visual">
        <img src="/images/artifacts.jpg" alt="" class="empty-img" />
        <div class="empty-img-overlay" />
      </div>
      <p class="empty-title">暂无收藏</p>
      <p class="empty-hint">去检索或识别页面收藏感兴趣的资源</p>
    </div>

    <div v-else class="fav-grid">
      <div v-for="item in list" :key="item.id" class="fav-card"
           :class="{ selected: selected.includes(item.id) }">
        <div class="card-checkbox" @click.stop>
          <input type="checkbox" :checked="selected.includes(item.id)"
                 @change="toggleSelect(item.id)" class="select-cb" />
        </div>
        <div class="fav-body" @click="goDetail(item.id)">
          <div class="fav-thumb">
            <div class="fav-icon">{{ item.fileType === 'image' ? '🖼' : '📄' }}</div>
          </div>
          <div class="fav-info">
            <h3 class="fav-title">{{ item.result?.title || item.fileName }}</h3>
            <p class="fav-meta">{{ item.result?.dynasty }} · {{ item.result?.author }}</p>
            <div class="fav-tags" v-if="item.result?.tags?.length">
              <span class="mini-tag" v-for="t in item.result.tags.slice(0,3)">{{ t }}</span>
            </div>
          </div>
        </div>
        <button class="fav-remove" @click.stop="removeFav(item.id)">取消收藏</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

const router = useRouter()
const loading = ref(true)
const list = ref<any[]>([])
const selected = ref<string[]>([])

onMounted(async () => {
  try {
    const res: any = await request.get('/favorite/list')
    list.value = res || []
  } catch { /* */ } finally { loading.value = false }
})

const toggleSelect = (id: string) => {
  const idx = selected.value.indexOf(id)
  if (idx === -1) selected.value.push(id)
  else selected.value.splice(idx, 1)
}

const goDetail = (id: string) => router.push(`/recognition/${id}`)

const removeFav = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定取消收藏？', '', { type: 'warning', confirmButtonText: '取消收藏', cancelButtonText: '保留', confirmButtonClass: 'el-button--danger' })
    await request.delete(`/favorite/${id}`)
    list.value = list.value.filter(i => i.id !== id)
    ElMessage.success('已取消收藏')
  } catch { /* */ }
}

const batchUnfavorite = async () => {
  if (selected.value.length === 0) return
  try {
    const ids = selected.value.slice()
    await Promise.all(ids.map(id => request.delete(`/favorite/${id}`)))
    list.value = list.value.filter(i => !ids.includes(i.id))
    ElMessage.success(`已取消收藏 ${ids.length} 项`)
    selected.value = []
  } catch { /* */ }
}
</script>

<style scoped lang="scss">
.batch-bar { display: flex; align-items: center; gap: var(--space-md); padding: 8px var(--space-lg); margin-bottom: var(--space-md); background: oklch(50% 0.16 28 / 0.04); border: 1px solid var(--cinnabar); border-radius: var(--radius-lg);
  .batch-count { font-size: 13px; font-weight: 600; color: var(--cinnabar); }
  .batch-action-btn, .batch-cancel-btn { all: unset; font-size: 12px; padding: 4px 14px; border-radius: var(--radius-md); cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
  .batch-action-btn { background: var(--cinnabar); color: #fff; &:hover { opacity: 0.85; } }
  .batch-cancel-btn { border: 1px solid var(--border-color); color: var(--text-secondary); &:hover { border-color: var(--ink-400); } }
}
.fav-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--space-md); }
.fav-card { display: flex; align-items: center; gap: 8px; padding: var(--space-md); background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); transition: all var(--transition-fast);
  &.selected { border-color: var(--cinnabar); background: oklch(50% 0.16 28 / 0.03); } }
.card-checkbox { flex-shrink: 0;
  .select-cb { width: 16px; height: 16px; accent-color: var(--cinnabar); cursor: pointer; } }
.fav-body { flex: 1; display: flex; align-items: center; gap: var(--space-md); cursor: pointer; min-width: 0; }
.fav-thumb { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: oklch(50% 0.16 28 / 0.05); border-radius: var(--radius-md); flex-shrink: 0;
  .fav-icon { font-size: 20px; } }
.fav-info { flex: 1; min-width: 0; }
.fav-title { font-size: 14px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.fav-meta { font-size: 12px; color: var(--text-tertiary); margin: 2px 0 4px; }
.fav-tags { display: flex; gap: 4px; flex-wrap: wrap;
  .mini-tag { font-size: 10px; padding: 0 6px; border-radius: var(--radius-full); background: oklch(50% 0.16 28 / 0.04); color: var(--cinnabar); } }
.fav-remove { all: unset; font-size: 11px; color: var(--text-tertiary); cursor: pointer; flex-shrink: 0; padding: 2px 8px; border-radius: var(--radius-md); transition: all var(--transition-fast);
  &:hover { color: var(--cinnabar); background: oklch(50% 0.16 28 / 0.06); } }
.skeleton-area { .skeleton-row { height: 80px; margin-bottom: 8px; border-radius: var(--radius-lg); background: var(--bg-card); border: 1px solid var(--border-color); animation: shimmer 1.5s infinite; background-image: linear-gradient(90deg,var(--bg-card) 0%,var(--border-color) 50%,var(--bg-card) 100%); background-size: 200% 100%; } }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
.empty-state {
    text-align: center;
    padding: var(--space-xl) 0 var(--space-3xl);
    color: var(--text-tertiary);

    .empty-visual {
      position: relative;
      width: 240px;
      height: 160px;
      margin: 0 auto var(--space-xl);
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-md);

      .empty-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .empty-img-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, transparent 40%, var(--bg-body) 100%);
      }
    }

    .empty-title {
      font-size: 16px;
      color: var(--text-regular);
      margin-bottom: 6px;
    }
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

  .fav-grid {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }

  .fav-card {
    padding: var(--space-sm) var(--space-md);
    gap: 8px;

    .fav-body {
      gap: var(--space-sm);

      .fav-thumb {
        width: 36px;
        height: 36px;

        .fav-icon {
          font-size: 16px;
        }
      }

      .fav-info {
        .fav-title {
          font-size: 13px;
        }

        .fav-meta {
          font-size: 11px;
        }

        .fav-tags {
          .mini-tag {
            font-size: 9px;
            padding: 1px 5px;
          }
        }
      }
    }
  }

  .batch-bar {
    flex-wrap: wrap;
    gap: 8px;
    padding: 8px var(--space-md);
  }

  .empty-state {
    .empty-visual {
      width: 180px;
      height: 120px;
    }
  }
}
</style>
