<template>
  <div class="search-page">
    <el-card shadow="never">
      <template #header>
        <span class="title">资源检索</span>
      </template>
      
      <el-form :inline="true">
        <el-form-item label="关键词">
          <el-input
            v-model="keyword"
            placeholder="请输入搜索关键词"
            clearable
            size="large"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
      
      <div v-if="hasSearched" class="result-area">
        <el-empty v-if="!loading && results.length === 0" description="暂无搜索结果" />
        <div v-else class="result-list">
          <div v-for="i in 3" :key="i" class="result-item">
            <h3>示例结果 {{ i }}</h3>
            <p>这是搜索 "{{ keyword }}" 的示例结果</p>
            <el-button type="primary" link>查看详情</el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const keyword = ref('')
const loading = ref(false)
const hasSearched = ref(false)
const results = ref([])

const handleSearch = () => {
  if (!keyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  
  loading.value = true
  hasSearched.value = true
  
  setTimeout(() => {
    loading.value = false
    ElMessage.success(`搜索 "${keyword.value}" 完成`)
  }, 500)
}
</script>

<style scoped lang="scss">
.search-page {
  max-width: 1200px;
  margin: 0 auto;
  
  .title {
    font-size: 18px;
    font-weight: 600;
  }
  
  .result-area {
    margin-top: 24px;
    
    .result-list {
      .result-item {
        padding: 16px;
        border-bottom: 1px solid #e8e8e8;
        
        h3 {
          margin: 0 0 8px 0;
        }
        
        p {
          margin: 0 0 8px 0;
          color: #666;
        }
      }
    }
  }
}
</style>