<template>
  <div class="product-view" v-loading="loading">
    <div class="back-nav">
      <button class="back-btn" @click="$router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        返回
      </button>
    </div>

    <div v-if="product" class="product-detail">
      <div class="product-content">
        <div class="product-gallery">
          <div class="main-image">
            <img
              :src="product.image_url || placeholderImage"
              :alt="product.name"
              @error="handleImageError"
            />
            <div v-if="product.discount" class="discount-badge">-{{ product.discount }}%</div>
          </div>
        </div>

        <div class="product-info">
          <span class="product-category">{{ getCategoryLabel(product.category) }}</span>
          <h1 class="product-name">{{ product.name }}</h1>

          <div class="price-section">
            <div class="current-price">
              <span class="price-symbol">¥</span>
              <span class="price-value">{{ formatPrice(product.price) }}</span>
            </div>
            <div v-if="product.original_price" class="original-price">
              <span>¥{{ formatPrice(product.original_price) }}</span>
            </div>
          </div>

          <div class="meta-section">
            <div class="meta-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
              </svg>
              <span>库存: {{ product.stock > 0 ? product.stock : '缺货' }}</span>
            </div>
            <div class="meta-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>上架时间: {{ formatDate(product.created_at) }}</span>
            </div>
            <div v-if="product.sales && product.sales > 0" class="meta-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span>销量: {{ product.sales }}</span>
            </div>
          </div>

          <div class="divider"></div>

          <div class="description-section">
            <h3 class="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              商品介绍
            </h3>
            <p class="description-text">{{ product.description || '暂无商品介绍' }}</p>
          </div>

          <div class="divider"></div>

          <div class="action-section">
            <div class="quantity-selector">
              <span class="quantity-label">数量</span>
              <div class="quantity-control">
                <button class="qty-btn" @click="decrementQty" :disabled="quantity <= 1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
                <input type="number" v-model.number="quantity" class="qty-input" min="1" :max="product.stock" />
                <button class="qty-btn" @click="incrementQty" :disabled="quantity >= product.stock">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="action-buttons">
              <button
                class="add-to-cart-btn"
                :class="{ loading: addingToCart }"
                :disabled="!authStore.isLoggedIn || product.stock <= 0 || addingToCart"
                @click="handleAddToCart"
              >
                <svg v-if="!addingToCart" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                <span v-if="!addingToCart">{{ product.stock <= 0 ? '暂时缺货' : '加入购物车' }}</span>
                <span v-else class="loading-spinner"></span>
              </button>

              <button
                v-if="!authStore.isLoggedIn"
                class="login-hint"
                @click="$router.push('/login')"
              >
                请先登录后再购买
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productAPI } from '../api/product'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const loading = ref(false)
const product = ref(null)
const quantity = ref(1)
const addingToCart = ref(false)

const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iIzIxMjEyMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNTAlIC01MCkiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjY2NjYiPuKAo+i/jzwvdGV4dD48L3N2Zz4='

const categoryMap = {
  'Electronics': '电子产品',
  'Clothing': '服装配饰',
  'Food': '美食生鲜',
  'Books': '图书音像'
}

function handleImageError(e) {
  e.target.src = placeholderImage
}

function getCategoryLabel(category) {
  return categoryMap[category] || category || '精选好物'
}

function formatPrice(price) {
  if (typeof price === 'number') {
    return price.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  return price
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

function incrementQty() {
  if (quantity.value < product.value.stock) {
    quantity.value++
  }
}

function decrementQty() {
  if (quantity.value > 1) {
    quantity.value--
  }
}

async function fetchProduct() {
  loading.value = true
  try {
    const data = await productAPI.getProduct(route.params.id)
    product.value = data.product
  } catch (error) {
    ElMessage.error('获取商品信息失败')
    router.push('/')
  } finally {
    loading.value = false
  }
}

async function handleAddToCart() {
  if (!authStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  if (product.value.stock <= 0) {
    ElMessage.warning('该商品暂时缺货')
    return
  }
  addingToCart.value = true
  try {
    const result = await cartStore.addItem(product.value.id, quantity.value)
    if (result.success) {
      ElMessage.success('已加入购物车')
    } else {
      ElMessage.error(result.error || '加入购物车失败')
    }
  } finally {
    addingToCart.value = false
  }
}

onMounted(() => {
  fetchProduct()
})
</script>

<style scoped>
.product-view {
  max-width: 1200px;
  margin: 0 auto;
}

.back-nav {
  margin-bottom: var(--space-xl);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  font-family: var(--font-body);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.back-btn:hover {
  border-color: var(--color-accent-gold);
  color: var(--color-accent-gold);
}

.product-detail {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
}

.product-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2xl);
}

/* Gallery */
.product-gallery {
  position: relative;
}

.main-image {
  position: relative;
  aspect-ratio: 1;
  background: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.discount-badge {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  background: linear-gradient(135deg, #d4736e 0%, #c45c5c 100%);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: var(--radius-md);
}

/* Product Info */
.product-category {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-accent-gold);
  opacity: 0.8;
}

.product-name {
  font-family: var(--font-display);
  font-size: 2.25rem;
  font-weight: 500;
  color: var(--color-text-primary);
  line-height: 1.2;
  margin: var(--space-md) 0 var(--space-xl);
}

/* Price */
.price-section {
  display: flex;
  align-items: baseline;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.current-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price-symbol {
  font-size: 1.25rem;
  color: var(--color-accent-gold);
  font-weight: 500;
}

.price-value {
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 600;
  color: var(--color-accent-gold);
  letter-spacing: -0.02em;
}

.original-price {
  font-size: 1rem;
  color: var(--color-text-muted);
  text-decoration: line-through;
}

/* Meta */
.meta-section {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-lg);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.meta-item svg {
  color: var(--color-text-muted);
}

/* Divider */
.divider {
  height: 1px;
  background: var(--color-border);
  margin: var(--space-xl) 0;
}

/* Description */
.section-title {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: var(--space-md);
}

.section-title svg {
  color: var(--color-accent-gold);
}

.description-text {
  color: var(--color-text-secondary);
  line-height: 1.8;
  font-size: 0.95rem;
  background: var(--color-bg-elevated);
  padding: var(--space-lg);
  border-radius: var(--radius-md);
  min-height: 80px;
}

/* Action */
.action-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.quantity-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.quantity-control {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.qty-btn {
  width: 40px;
  height: 40px;
  background: var(--color-bg-elevated);
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.qty-btn:hover:not(:disabled) {
  background: var(--color-bg-hover);
  color: var(--color-accent-gold);
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-input {
  width: 60px;
  height: 40px;
  background: var(--color-bg-elevated);
  border: none;
  border-left: 1px solid var(--color-border);
  border-right: 1px solid var(--color-border);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  font-size: 0.95rem;
  text-align: center;
  -moz-appearance: textfield;
}

.qty-input::-webkit-outer-spin-button,
.qty-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.add-to-cart-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  height: 56px;
  background: linear-gradient(135deg, var(--color-accent-gold) 0%, var(--color-accent-gold-dark) 100%);
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-bg-primary);
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all var(--transition-base);
}

.add-to-cart-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(201, 169, 98, 0.4);
}

.add-to-cart-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.login-hint {
  background: transparent;
  border: none;
  color: var(--color-accent-gold);
  font-family: var(--font-body);
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: underline;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(15, 15, 15, 0.3);
  border-top-color: var(--color-bg-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .product-content {
    grid-template-columns: 1fr;
  }

  .product-name {
    font-size: 1.75rem;
  }

  .price-value {
    font-size: 2.5rem;
  }
}
</style>
