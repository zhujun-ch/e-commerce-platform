<template>
  <div class="checkout-view">
    <div class="checkout-header">
      <button class="back-btn" @click="$router.push('/cart')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        返回购物车
      </button>
      <h1 class="checkout-title">确认订单</h1>
    </div>

    <div v-loading="loading" class="checkout-content">
      <div class="checkout-grid">
        <!-- Shipping Form -->
        <div class="checkout-form-section">
          <h2 class="section-title">
            <span class="section-number">01</span>
            收货信息
          </h2>
          <form class="shipping-form">
            <div class="form-group">
              <label class="form-label">收货地址</label>
              <textarea
                v-model="form.shipping_address"
                class="form-textarea"
                :class="{ error: errors.address }"
                placeholder="请输入详细收货地址，包括省市区、街道门牌号等"
                rows="3"
                @blur="validateAddress"
              ></textarea>
              <span v-if="errors.address" class="error-text">{{ errors.address }}</span>
            </div>
          </form>

          <h2 class="section-title">
            <span class="section-number">02</span>
            支付方式
          </h2>
          <div class="payment-options">
            <label class="payment-option" :class="{ selected: paymentMethod === 'alipay' }">
              <input type="radio" v-model="paymentMethod" value="alipay" />
              <div class="option-content">
                <div class="option-icon alipay">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.5 2C9.46 2 7 4.46 7 7.5c0 1.87.94 3.53 2.38 4.5L8 14.5l4.5-3.5c.5.12.98.2 1.5.2 3.04 0 5.5-2.46 5.5-5.5S15.54 2 12.5 2z"/>
                  </svg>
                </div>
                <div class="option-details">
                  <span class="option-name">支付宝</span>
                  <span class="option-desc">推荐</span>
                </div>
              </div>
              <div class="option-check">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </label>

            <label class="payment-option" :class="{ selected: paymentMethod === 'wechat' }">
              <input type="radio" v-model="paymentMethod" value="wechat" />
              <div class="option-content">
                <div class="option-icon wechat">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.5 11a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                  </svg>
                </div>
                <div class="option-details">
                  <span class="option-name">微信支付</span>
                </div>
              </div>
              <div class="option-check">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </label>

            <label class="payment-option" :class="{ selected: paymentMethod === 'card' }">
              <input type="radio" v-model="paymentMethod" value="card" />
              <div class="option-content">
                <div class="option-icon card">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                </div>
                <div class="option-details">
                  <span class="option-name">银行卡</span>
                </div>
              </div>
              <div class="option-check">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </label>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="order-summary-section">
          <h2 class="section-title">
            <span class="section-number">03</span>
            订单摘要
          </h2>

          <div class="order-items">
            <div v-for="item in cartStore.items" :key="item.id" class="order-item">
              <div class="item-info">
                <img :src="item.product_image_url || placeholderImage" class="item-image" @error="handleImageError" />
                <div class="item-details">
                  <span class="item-name">{{ item.product_name || item.name }}</span>
                  <span class="item-qty">x {{ item.quantity }}</span>
                </div>
              </div>
              <span class="item-price">¥{{ (item.product_price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>

          <div class="order-totals">
            <div class="total-row">
              <span class="total-label">商品总价</span>
              <span class="total-value">¥{{ Number(cartStore.total).toFixed(2) }}</span>
            </div>
            <div class="total-row">
              <span class="total-label">运费</span>
              <span class="total-value">免运费</span>
            </div>
            <div class="total-row grand">
              <span class="total-label">合计</span>
              <span class="total-value">¥{{ Number(cartStore.total).toFixed(2) }}</span>
            </div>
          </div>

          <button
            class="submit-order-btn"
            :class="{ loading: submitting }"
            :disabled="submitting || !form.shipping_address"
            @click="handleSubmit"
          >
            <span v-if="!submitting">提交订单</span>
            <span v-else class="loading-spinner"></span>
          </button>

          <p class="submit-note">点击提交订单即表示您同意我们的服务条款</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { orderAPI } from '../api/order'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const loading = ref(false)
const submitting = ref(false)
const paymentMethod = ref('alipay')

const form = reactive({
  shipping_address: ''
})

const errors = reactive({
  address: ''
})

const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC01MCUgLTUwJSkiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2NjYiPuKAo+i/jzwvdGV4dD48L3N2Zz4='

function handleImageError(e) {
  e.target.src = placeholderImage
}

function validateAddress() {
  if (!form.shipping_address) {
    errors.address = '请输入收货地址'
  } else {
    errors.address = ''
  }
}

async function handleSubmit() {
  validateAddress()

  if (errors.address) return

  if (cartStore.items.length === 0) {
    ElMessage.warning('购物车是空的')
    return
  }

  submitting.value = true
  try {
    const data = await orderAPI.createOrder({
      shipping_address: form.shipping_address
    })
    ElMessage.success('订单创建成功')
    await cartStore.fetchCart()
    router.push(`/order/${data.order_id}`)
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '订单创建失败')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  if (!authStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
  }
})
</script>

<style scoped>
.checkout-view {
  max-width: 1100px;
  margin: 0 auto;
}

.checkout-header {
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
  margin-bottom: var(--space-lg);
}

.back-btn:hover {
  border-color: var(--color-accent-gold);
  color: var(--color-accent-gold);
}

.checkout-title {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

/* Grid */
.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: var(--space-xl);
}

/* Section */
.section-title {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: var(--space-lg);
}

.section-number {
  font-family: var(--font-display);
  font-size: 0.875rem;
  color: var(--color-accent-gold);
  opacity: 0.6;
}

/* Form Section */
.checkout-form-section {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
}

.shipping-form {
  margin-bottom: var(--space-2xl);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.form-textarea {
  width: 100%;
  padding: var(--space-md);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  font-size: 0.95rem;
  resize: vertical;
  transition: all var(--transition-base);
}

.form-textarea:focus {
  outline: none;
  border-color: var(--color-accent-gold);
  box-shadow: 0 0 0 3px rgba(201, 169, 98, 0.1);
}

.form-textarea.error {
  border-color: var(--color-error);
}

.error-text {
  font-size: 0.8rem;
  color: var(--color-error);
}

/* Payment Options */
.payment-options {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.payment-option {
  display: flex;
  align-items: center;
  padding: var(--space-md);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.payment-option:hover {
  border-color: var(--color-accent-gold);
}

.payment-option.selected {
  border-color: var(--color-accent-gold);
  background: rgba(201, 169, 98, 0.05);
}

.payment-option input {
  display: none;
}

.option-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.option-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-icon.alipay {
  background: linear-gradient(135deg, #1677ff 0%, #0958d9 100%);
  color: white;
}

.option-icon.wechat {
  background: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
  color: white;
}

.option-icon.card {
  background: var(--color-bg-hover);
  color: var(--color-accent-gold);
}

.option-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.option-name {
  font-size: 0.95rem;
  color: var(--color-text-primary);
  font-weight: 500;
}

.option-desc {
  font-size: 0.75rem;
  color: var(--color-accent-gold);
}

.option-check {
  width: 24px;
  height: 24px;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: transparent;
  transition: all var(--transition-fast);
}

.payment-option.selected .option-check {
  background: var(--color-accent-gold);
  border-color: var(--color-accent-gold);
  color: var(--color-bg-primary);
}

/* Order Summary Section */
.order-summary-section {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  position: sticky;
  top: 100px;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--space-lg);
  max-height: 300px;
  overflow-y: auto;
}

.order-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item-info {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.item-image {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  background: var(--color-bg-elevated);
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-name {
  font-size: 0.875rem;
  color: var(--color-text-primary);
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-qty {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.item-price {
  font-family: var(--font-display);
  font-size: 0.95rem;
  color: var(--color-text-primary);
}

/* Totals */
.order-totals {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-label {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.total-value {
  font-size: 0.95rem;
  color: var(--color-text-primary);
}

.total-row.grand {
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-border);
}

.total-row.grand .total-label {
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.total-row.grand .total-value {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-accent-gold);
}

/* Submit */
.submit-order-btn {
  width: 100%;
  height: 52px;
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

.submit-order-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(201, 169, 98, 0.4);
}

.submit-order-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.submit-note {
  text-align: center;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: var(--space-md);
}

/* Responsive */
@media (max-width: 900px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }

  .order-summary-section {
    position: static;
  }
}
</style>
