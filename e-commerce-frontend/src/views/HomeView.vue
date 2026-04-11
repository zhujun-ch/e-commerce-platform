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
  font-size: clamp(2.5rem, 7vw, 5rem);
  font-weight: 300;
  line-height: 1.1;
  letter-spacing: 0.08em;
  margin-bottom: var(--space-lg);
}

.hero-title-line {
  display: block;
  opacity: 0;
  transform: translateY(40px);
  animation: heroReveal 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.hero-title-line:nth-child(1) {
  animation-delay: 0.2s;
}

.hero-title-line:nth-child(2) {
  animation-delay: 0.4s;
}

.hero-title-line.accent {
  background: linear-gradient(135deg, var(--color-accent-gold-light) 0%, var(--color-accent-gold) 50%, var(--color-accent-gold-dark) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-style: italic;
  font-weight: 400;
}

@keyframes heroReveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-subtitle {
  font-size: 1rem;
  color: var(--color-text-muted);
  letter-spacing: 0.25em;
  font-weight: 300;
  opacity: 0;
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 0.6s;
}

.hero-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.deco-circle {
  position: absolute;
  width: 500px;
  height: 500px;
  border: 1px solid rgba(201, 169, 98, 0.1);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulseCircle 8s ease-in-out infinite;
}

.deco-circle:nth-child(2) {
  width: 600px;
  height: 600px;
  animation-delay: -2s;
}

.deco-circle:nth-child(3) {
  width: 700px;
  height: 700px;
  animation-delay: -4s;
}

@keyframes pulseCircle {
  0%, 100% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.1;
    transform: translate(-50%, -50%) scale(1.05);
  }
}

.deco-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(201, 169, 98, 0.15), transparent);
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
  left: 20px;
  color: var(--color-text-muted);
  pointer-events: none;
  transition: color var(--transition-fast);
}

.search-input-wrapper:focus-within .search-icon {
  color: var(--color-accent-gold);
}

.search-input {
  width: 100%;
  height: 56px;
  padding: 0 52px;
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
  box-shadow: 0 0 0 3px rgba(201, 169, 98, 0.08), 0 8px 24px rgba(0, 0, 0, 0.3);
}

.search-input::placeholder {
  color: var(--color-text-muted);
  letter-spacing: 0.05em;
}

.search-clear {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  border-radius: var(--radius-sm);
}

.search-clear:hover {
  color: var(--color-accent-gold);
  background: rgba(201, 169, 98, 0.1);
}

.search-btn {
  height: 56px;
  padding: 0 var(--space-xl);
  background: linear-gradient(135deg, var(--color-accent-gold) 0%, var(--color-accent-gold-dark) 100%);
  border: none;
  border-radius: var(--radius-lg);
  color: var(--color-bg-primary);
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.search-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--color-accent-gold-light) 0%, var(--color-accent-gold) 100%);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.search-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(201, 169, 98, 0.35);
}

.search-btn:hover::after {
  opacity: 1;
}

.search-btn span {
  position: relative;
  z-index: 1;
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
  padding: var(--space-md) var(--space-xl);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  color: var(--color-text-secondary);
  font-family: var(--font-body);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all var(--transition-base);
  letter-spacing: 0.03em;
}

.category-btn:hover {
  border-color: var(--color-accent-gold);
  color: var(--color-accent-gold);
  background: rgba(201, 169, 98, 0.05);
  transform: translateY(-2px);
}

.category-btn.active {
  background: linear-gradient(135deg, var(--color-accent-gold) 0%, var(--color-accent-gold-dark) 100%);
  border-color: var(--color-accent-gold);
  color: var(--color-bg-primary);
  box-shadow: 0 4px 20px rgba(201, 169, 98, 0.25);
}

.category-icon {
  font-size: 1.1rem;
  opacity: 0.8;
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
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
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
  padding: var(--space-lg);
}

.skeleton-line {
  height: 14px;
  background: linear-gradient(90deg, var(--color-bg-elevated) 25%, var(--color-bg-hover) 50%, var(--color-bg-elevated) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-md);
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
  font-size: 1.75rem;
  font-weight: 400;
  color: var(--color-text-primary);
  margin-bottom: var(--space-sm);
}

.empty-text {
  color: var(--color-text-muted);
  margin-bottom: var(--space-xl);
}

.empty-btn {
  padding: var(--space-md) var(--space-xl);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  font-family: var(--font-body);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-base);
  letter-spacing: 0.05em;
}

.empty-btn:hover {
  border-color: var(--color-accent-gold);
  color: var(--color-accent-gold);
  background: rgba(201, 169, 98, 0.05);
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
  min-width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  font-family: var(--font-body);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all var(--transition-base);
}

.page-btn:hover:not(:disabled),
.page-number:hover:not(.ellipsis) {
  border-color: var(--color-accent-gold);
  color: var(--color-accent-gold);
  background: rgba(201, 169, 98, 0.05);
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-number.active {
  background: linear-gradient(135deg, var(--color-accent-gold) 0%, var(--color-accent-gold-dark) 100%);
  border-color: var(--color-accent-gold);
  color: var(--color-bg-primary);
  box-shadow: 0 4px 16px rgba(201, 169, 98, 0.2);
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

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
