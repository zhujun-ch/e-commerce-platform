<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title animate-fade-in-up">
          <span class="hero-title-line">精致生活</span>
          <span class="hero-title-line accent">从选择开始</span>
        </h1>
        <p class="hero-subtitle animate-fade-in-up" style="animation-delay: 0.1s">
          探索品质好物，感受非凡体验
        </p>
      </div>
      <div class="hero-decoration">
        <div class="deco-circle"></div>
        <div class="deco-line"></div>
      </div>
    </section>

    <!-- Search & Filter Section -->
    <section class="controls animate-stagger">
      <div class="search-wrapper">
        <div class="search-input-wrapper">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            v-model="searchKeyword"
            type="text"
            class="search-input"
            placeholder="搜索商品..."
            @keyup.enter="handleSearch"
          />
          <button v-if="searchKeyword" class="search-clear" @click="clearSearch">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <button class="search-btn" @click="handleSearch">
          <span>搜索</span>
        </button>
      </div>

      <div class="category-wrapper">
        <button
          v-for="cat in categories"
          :key="cat.value"
          class="category-btn"
          :class="{ active: selectedCategory === cat.value }"
          @click="handleCategoryChange(cat.value)"
        >
          <span class="category-icon">{{ cat.icon }}</span>
          <span class="category-label">{{ cat.label }}</span>
        </button>
      </div>
    </section>

    <!-- Products Grid -->
    <section class="products-section">
      <div v-if="loading" class="loading-container">
        <div class="skeleton-grid">
          <div v-for="n in 8" :key="n" class="skeleton-card">
            <div class="skeleton-image"></div>
            <div class="skeleton-content">
              <div class="skeleton-line short"></div>
              <div class="skeleton-line"></div>
              <div class="skeleton-line medium"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="products.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 15s1.5 2 4 2 4-2 4-2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
        </div>
        <h3 class="empty-title">暂无商品</h3>
        <p class="empty-text">试试其他搜索条件吧</p>
        <button class="empty-btn" @click="resetFilters">重置筛选</button>
      </div>

      <div v-else class="products-grid animate-stagger">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          class="grid-item"
        />
      </div>

      <!-- Pagination -->
      <div v-if="total > pageSize" class="pagination-wrapper">
        <div class="pagination">
          <button
            class="page-btn prev"
            :disabled="currentPage === 1"
            @click="handlePageChange(currentPage - 1)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          <div class="page-numbers">
            <button
              v-for="page in visiblePages"
              :key="page"
              class="page-number"
              :class="{ active: page === currentPage, ellipsis: page === '...' }"
              @click="page !== '...' && handlePageChange(page)"
            >
              {{ page }}
            </button>
          </div>

          <button
            class="page-btn next"
            :disabled="currentPage === totalPages"
            @click="handlePageChange(currentPage + 1)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { productAPI } from '../api/product'
import ProductCard from '../components/ProductCard.vue'

const loading = ref(false)
const products = ref([])
const searchKeyword = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)

const categories = [
  { value: '', label: '全部', icon: '◈' },
  { value: 'Electronics', label: '电子产品', icon: '◉' },
  { value: 'Clothing', label: '服装配饰', icon: '◎' },
  { value: 'Food', label: '美食生鲜', icon: '○' },
  { value: 'Books', label: '图书音像', icon: '◇' }
]

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i)
    }
    if (current < total - 2) pages.push('...')
    pages.push(total)
  }
  return pages
})

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

function clearSearch() {
  searchKeyword.value = ''
  handleSearch()
}

function handleCategoryChange(category) {
  selectedCategory.value = category
  currentPage.value = 1
  fetchProducts()
}

function handlePageChange(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchProducts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function resetFilters() {
  searchKeyword.value = ''
  selectedCategory.value = ''
  currentPage.value = 1
  fetchProducts()
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.home-view {
  padding-top: var(--space-xl);
}

/* Hero */
.hero {
  text-align: center;
  padding: var(--space-3xl) 0;
  position: relative;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: 0.1em;
  margin-bottom: var(--space-md);
}

.hero-title-line {
  display: block;
}

.hero-title-line.accent {
  color: var(--color-accent-gold);
  font-style: italic;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: var(--color-text-muted);
  letter-spacing: 0.2em;
}

.hero-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.deco-circle {
  position: absolute;
  width: 400px;
  height: 400px;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.3;
}

.deco-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-border), transparent);
}

/* Controls */
.controls {
  max-width: 1000px;
  margin: 0 auto var(--space-2xl);
}

.search-wrapper {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.search-input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  color: var(--color-text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 52px;
  padding: 0 48px;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  font-size: 0.95rem;
  transition: all var(--transition-base);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-accent-gold);
  box-shadow: 0 0 0 3px rgba(201, 169, 98, 0.1);
}

.search-input::placeholder {
  color: var(--color-text-muted);
}

.search-clear {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--transition-fast);
}

.search-clear:hover {
  color: var(--color-accent-gold);
}

.search-btn {
  height: 52px;
  padding: 0 var(--space-xl);
  background: linear-gradient(135deg, var(--color-accent-gold) 0%, var(--color-accent-gold-dark) 100%);
  border: none;
  border-radius: var(--radius-lg);
  color: var(--color-bg-primary);
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all var(--transition-base);
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(201, 169, 98, 0.3);
}

/* Categories */
.category-wrapper {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  flex-wrap: wrap;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  color: var(--color-text-secondary);
  font-family: var(--font-body);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--transition-base);
}

.category-btn:hover {
  border-color: var(--color-accent-gold);
  color: var(--color-accent-gold);
}

.category-btn.active {
  background: linear-gradient(135deg, var(--color-accent-gold) 0%, var(--color-accent-gold-dark) 100%);
  border-color: var(--color-accent-gold);
  color: var(--color-bg-primary);
}

.category-icon {
  font-size: 1rem;
}

/* Products Grid */
.products-section {
  min-height: 400px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-lg);
}

.grid-item {
  opacity: 0;
  animation: fadeInUp 0.5s ease-out forwards;
}

/* Loading Skeleton */
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-lg);
}

.skeleton-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.skeleton-image {
  aspect-ratio: 1;
  background: linear-gradient(90deg, var(--color-bg-elevated) 25%, var(--color-bg-hover) 50%, var(--color-bg-elevated) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-content {
  padding: var(--space-md);
}

.skeleton-line {
  height: 14px;
  background: linear-gradient(90deg, var(--color-bg-elevated) 25%, var(--color-bg-hover) 50%, var(--color-bg-elevated) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-sm);
}

.skeleton-line.short {
  width: 40%;
}

.skeleton-line.medium {
  width: 70%;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--space-3xl) 0;
}

.empty-icon {
  color: var(--color-text-muted);
  opacity: 0.4;
  margin-bottom: var(--space-lg);
}

.empty-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--color-text-primary);
  margin-bottom: var(--space-sm);
}

.empty-text {
  color: var(--color-text-muted);
  margin-bottom: var(--space-xl);
}

.empty-btn {
  padding: var(--space-sm) var(--space-xl);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  font-family: var(--font-body);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.empty-btn:hover {
  border-color: var(--color-accent-gold);
  color: var(--color-accent-gold);
}

/* Pagination */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: var(--space-2xl);
}

.pagination {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.page-btn,
.page-number {
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  font-family: var(--font-body);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.page-btn:hover:not(:disabled),
.page-number:hover:not(.ellipsis) {
  border-color: var(--color-accent-gold);
  color: var(--color-accent-gold);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-number.active {
  background: linear-gradient(135deg, var(--color-accent-gold) 0%, var(--color-accent-gold-dark) 100%);
  border-color: var(--color-accent-gold);
  color: var(--color-bg-primary);
}

.page-number.ellipsis {
  cursor: default;
  border: none;
  background: none;
}

.page-numbers {
  display: flex;
  gap: var(--space-xs);
}
</style>
