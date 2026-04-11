<template>
  <div class="cart-view">
    <div class="cart-header">
      <h1 class="cart-title">我的购物车</h1>
      <span class="cart-count">{{ cartStore.items.length }} 件商品</span>
    </div>

    <div v-loading="loading">
      <el-empty v-if="cartStore.items.length === 0" class="empty-state">
        <template #image>
          <div class="empty-illustration">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </div>
        </template>
        <template #description>
          <p class="empty-text">购物车是空的</p>
        </template>
        <el-button type="primary" @click="$router.push('/')" class="empty-btn">
          去逛逛
        </el-button>
      </el-empty>

      <div v-else class="cart-content">
        <div class="cart-table-wrapper">
          <table class="cart-table">
            <thead>
              <tr>
                <th class="col-product">商品</th>
                <th class="col-price">单价</th>
                <th class="col-quantity">数量</th>
                <th class="col-subtotal">小计</th>
                <th class="col-action"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in cartStore.items" :key="item.id" class="cart-item">
                <td class="col-product">
                  <div class="product-info">
                    <img
                      :src="item.product_image_url || placeholderImage"
                      class="product-image"
                      @error="handleImageError"
                    />
                    <div class="product-details">
                      <span class="product-name">{{ item.product_name || item.name }}</span>
                      <span class="product-category">{{ item.category || '精选好物' }}</span>
                    </div>
                  </div>
                </td>
                <td class="col-price">
                  <span class="price">¥{{ Number(item.product_price).toFixed(2) }}</span>
                </td>
                <td class="col-quantity">
                  <div class="quantity-control">
                    <button
                      class="qty-btn"
                      @click="decrementQty(item)"
                      :disabled="item.quantity <= 1"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </button>
                    <input
                      type="number"
                      v-model.number="item.quantity"
                      class="qty-input"
                      min="1"
                      @change="handleUpdateQuantity(item.id, item.quantity)"
                    />
                    <button class="qty-btn" @click="incrementQty(item)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </button>
                  </div>
                </td>
                <td class="col-subtotal">
                  <span class="subtotal">¥{{ (item.product_price * item.quantity).toFixed(2) }}</span>
                </td>
                <td class="col-action">
                  <button class="remove-btn" @click="confirmRemove(item.id)">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="cart-summary">
          <div class="summary-left">
            <button class="clear-btn" @click="confirmClear">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
              清空购物车
            </button>
          </div>

          <div class="summary-right">
            <div class="summary-row">
              <span class="summary-label">商品总价</span>
              <span class="summary-value">¥{{ Number(cartStore.total).toFixed(2) }}</span>
            </div>
            <div class="summary-row total">
              <span class="summary-label">合计</span>
              <span class="summary-value">¥{{ Number(cartStore.total).toFixed(2) }}</span>
            </div>
            <button class="checkout-btn" @click="$router.push('/checkout')">
              <span>去结算</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { ElMessage, ElMessageBox } from 'element-plus'

const cartStore = useCartStore()
const authStore = useAuthStore()
const loading = ref(false)

const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC01MCUgLTUwJSkiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2NjYiPuKAo+i/jzwvdGV4dD48L3N2Zz4='

function handleImageError(e) {
  e.target.src = placeholderImage
}

function incrementQty(item) {
  item.quantity++
  handleUpdateQuantity(item.id, item.quantity)
}

function decrementQty(item) {
  if (item.quantity > 1) {
    item.quantity--
    handleUpdateQuantity(item.id, item.quantity)
  }
}

async function handleUpdateQuantity(id, quantity) {
  await cartStore.updateItem(id, quantity)
}

async function confirmRemove(id) {
  try {
    await ElMessageBox.confirm('确定要删除这件商品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await cartStore.removeItem(id)
    ElMessage.success('已删除')
  } catch {
    // cancelled
  }
}

async function confirmClear() {
  try {
    await ElMessageBox.confirm('确定要清空购物车吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await cartStore.clearCart()
    ElMessage.success('购物车已清空')
  } catch {
    // cancelled
  }
}

onMounted(() => {
  if (authStore.isLoggedIn) {
    cartStore.fetchCart()
  }
})
</script>

<style scoped>
.cart-view {
  max-width: 1100px;
  margin: 0 auto;
}

/* Header */
.cart-header {
  display: flex;
  align-items: baseline;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.cart-title {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.cart-count {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

/* Empty State */
.empty-state {
  padding: var(--space-3xl) 0;
}

.empty-illustration {
  color: var(--color-text-muted);
  opacity: 0.3;
}

.empty-text {
  color: var(--color-text-muted);
  font-size: 1rem;
}

.empty-btn {
  margin-top: var(--space-lg);
  background: linear-gradient(135deg, var(--color-accent-gold) 0%, var(--color-accent-gold-dark) 100%);
  border: none;
  color: var(--color-bg-primary);
}

/* Cart Content */
.cart-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

/* Table */
.cart-table-wrapper {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.cart-table {
  width: 100%;
  border-collapse: collapse;
}

.cart-table th {
  padding: var(--space-md) var(--space-lg);
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-accent-gold);
  background: var(--color-bg-elevated);
  border-bottom: 1px solid var(--color-border);
}

.cart-table td {
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
  vertical-align: middle;
}

.cart-item:last-child td {
  border-bottom: none;
}

/* Product Info */
.product-info {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.product-image {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: var(--radius-md);
  background: var(--color-bg-elevated);
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.product-name {
  font-size: 0.95rem;
  color: var(--color-text-primary);
  font-weight: 500;
}

.product-category {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

/* Price */
.price {
  font-family: var(--font-display);
  font-size: 1.1rem;
  color: var(--color-text-primary);
}

/* Quantity Control */
.quantity-control {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  width: fit-content;
}

.qty-btn {
  width: 36px;
  height: 36px;
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
  width: 48px;
  height: 36px;
  background: var(--color-bg-elevated);
  border: none;
  border-left: 1px solid var(--color-border);
  border-right: 1px solid var(--color-border);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  font-size: 0.9rem;
  text-align: center;
  -moz-appearance: textfield;
}

.qty-input::-webkit-outer-spin-button,
.qty-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.qty-input:focus {
  outline: none;
}

/* Subtotal */
.subtotal {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-accent-gold);
}

/* Remove */
.remove-btn {
  width: 36px;
  height: 36px;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.remove-btn:hover {
  background: rgba(212, 115, 110, 0.1);
  border-color: var(--color-error);
  color: var(--color-error);
}

/* Summary */
.cart-summary {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--space-xl);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.summary-left {
  display: flex;
  align-items: center;
}

.clear-btn {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  font-family: var(--font-body);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.clear-btn:hover {
  border-color: var(--color-error);
  color: var(--color-error);
}

.summary-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-md);
}

.summary-row {
  display: flex;
  align-items: center;
  gap: var(--space-xl);
}

.summary-label {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.summary-value {
  font-family: var(--font-display);
  font-size: 1.1rem;
  color: var(--color-text-primary);
}

.summary-row.total {
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-border);
}

.summary-row.total .summary-label {
  font-size: 1rem;
  color: var(--color-text-primary);
  font-weight: 500;
}

.summary-row.total .summary-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-accent-gold);
}

.checkout-btn {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-xl);
  background: linear-gradient(135deg, var(--color-accent-gold) 0%, var(--color-accent-gold-dark) 100%);
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-bg-primary);
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all var(--transition-base);
  margin-top: var(--space-sm);
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(201, 169, 98, 0.4);
}
</style>
