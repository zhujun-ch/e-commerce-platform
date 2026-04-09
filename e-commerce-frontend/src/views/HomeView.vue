<template>
  <div class="home-view">
    <div class="search-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索商品..."
        @keyup.enter="handleSearch"
        style="width: 300px"
      >
        <template #append>
          <el-button :icon="Search" @click="handleSearch" />
        </template>
      </el-input>
    </div>

    <div class="category-filter">
      <el-radio-group v-model="selectedCategory" @change="handleCategoryChange">
        <el-radio-button :label="''">全部</el-radio-button>
        <el-radio-button :label="'Electronics'">电子产品</el-radio-button>
        <el-radio-button :label="'Clothing'">服装</el-radio-button>
        <el-radio-button :label="'Food'">食品</el-radio-button>
        <el-radio-button :label="'Books'">图书</el-radio-button>
      </el-radio-group>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-skeleton">
        <div v-for="n in 8" :key="n" class="skeleton-card"></div>
      </div>
    </div>
    <div v-else-if="products.length === 0" class="empty-state">
      <el-empty description="暂无商品" />
    </div>
    <div v-else class="product-grid">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>

    <el-pagination
      v-if="total > 0"
      class="pagination"
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="prev, pager, next"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { productAPI } from '../api/product'
import ProductCard from '../components/ProductCard.vue'

const loading = ref(false)
const products = ref([])
const searchKeyword = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)

async function fetchProducts() {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: pageSize.value
    }
    if (searchKeyword.value) {
      params.search = searchKeyword.value
    }
    if (selectedCategory.value) {
      params.category = selectedCategory.value
    }
    const data = await productAPI.getProducts(params)
    products.value = data.products || []
    total.value = data.pagination?.total || 0
  } catch (error) {
    console.error('Failed to fetch products:', error)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  currentPage.value = 1
  fetchProducts()
}

function handleCategoryChange() {
  currentPage.value = 1
  fetchProducts()
}

function handlePageChange(page) {
  currentPage.value = page
  fetchProducts()
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.home-view {
  max-width: 1200px;
  margin: 0 auto;
}
.search-bar {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}
.category-filter {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.pagination {
  margin-top: 30px;
  justify-content: center;
}
/* Loading skeleton styles */
.loading-container {
  width: 100%;
}
.loading-skeleton {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
}
.skeleton-card {
  height: 300px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 8px;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
/* Empty state */
.empty-state {
  padding: 60px 0;
  text-align: center;
}
</style>
