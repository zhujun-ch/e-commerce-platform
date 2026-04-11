<template>
  <div class="order-detail-view" v-loading="loading">
    <div class="detail-header">
      <button class="back-btn" @click="$router.push('/orders')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        返回订单列表
      </button>
      <h1 class="detail-title">订单详情</h1>
    </div>

    <div v-if="order" class="order-detail">
      <div class="detail-card">
        <div class="card-header">
          <div class="order-info">
            <span class="order-id">订单号 {{ order.id }}</span>
            <span class="order-date">{{ formatDateTime(order.created_at) }}</span>
          </div>
          <div class="order-status" :class="getStatusClass(order.status)">
            <span class="status-dot"></span>
            {{ getStatusLabel(order.status) }}
          </div>
        </div>

        <div class="card-section">
          <h3 class="section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            收货地址
          </h3>
          <p class="section-content">{{ order.shipping_address }}</p>
        </div>

        <div class="card-section">
          <h3 class="section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            商品列表
          </h3>
          <div class="items-list">
            <div v-for="item in items" :key="item.id" class="order-item">
              <div class="item-info">
                <span class="item-name">{{ item.product_name || item.name }}</span>
                <span class="item-qty">x {{ item.quantity }}</span>
              </div>
              <span class="item-price">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <div class="total-section">
            <span class="total-label">订单总额</span>
            <span class="total-value">¥{{ Number(order.total_amount).toFixed(2) }}</span>
          </div>

          <div v-if="order.status === 'pending'" class="action-section">
            <button class="pay-btn" :class="{ loading: paying }" :disabled="paying" @click="handlePay">
              <span v-if="!paying">立即支付</span>
              <span v-else class="loading-spinner"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { orderAPI } from '../api/order'
import { paymentAPI } from '../api/payment'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const order = ref(null)
const items = ref([])
const paying = ref(false)

const statusMap = {
  pending: { label: '待支付', class: 'warning' },
  paid: { label: '已支付', class: 'success' },
  shipped: { label: '已发货', class: 'info' },
  delivered: { label: '已完成', class: 'success' },
  cancelled: { label: '已取消', class: 'default' }
}

function getStatusLabel(status) {
  return statusMap[status]?.label || status
}

function getStatusClass(status) {
  return statusMap[status]?.class || 'default'
}

function formatDateTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function fetchOrder() {
  loading.value = true
  try {
    const data = await orderAPI.getOrder(route.params.id)
    order.value = data.order
    items.value = data.items || []
  } catch (error) {
    ElMessage.error('获取订单详情失败')
    router.push('/orders')
  } finally {
    loading.value = false
  }
}

async function handlePay() {
  paying.value = true
  try {
    await paymentAPI.createPayment({
      order_id: order.value.id,
      amount: order.value.total_amount
    })
    ElMessage.success('支付成功')
    await fetchOrder()
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '支付失败')
  } finally {
    paying.value = false
  }
}

onMounted(() => {
  fetchOrder()
})
</script>

<style scoped>
.order-detail-view {
  max-width: 800px;
  margin: 0 auto;
}

.detail-header {
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

.detail-title {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

/* Detail Card */
.order-detail {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--space-xl);
  background: var(--color-bg-elevated);
  border-bottom: 1px solid var(--color-border);
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.order-id {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text-primary);
  letter-spacing: 0.05em;
}

.order-date {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.order-status {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 0.8rem;
  font-weight: 500;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-xl);
  background: var(--color-bg-card);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.order-status.warning {
  color: var(--color-warning);
}

.order-status.success {
  color: var(--color-success);
}

.order-status.info {
  color: #6eb5ff;
}

.order-status.default {
  color: var(--color-text-muted);
}

/* Sections */
.card-section {
  padding: var(--space-xl);
  border-bottom: 1px solid var(--color-border);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: var(--space-md);
}

.section-title svg {
  color: var(--color-accent-gold);
}

.section-content {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
}

/* Items List */
.items-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md);
  background: var(--color-bg-elevated);
  border-radius: var(--radius-md);
}

.item-info {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.item-name {
  font-size: 0.95rem;
  color: var(--color-text-primary);
}

.item-qty {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.item-price {
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--color-text-primary);
}

/* Footer */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-xl);
}

.total-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.total-label {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.total-value {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-accent-gold);
}

.action-section {
  display: flex;
  gap: var(--space-md);
}

.pay-btn {
  height: 48px;
  padding: 0 var(--space-xl);
  background: linear-gradient(135deg, var(--color-accent-gold) 0%, var(--color-accent-gold-dark) 100%);
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-bg-primary);
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all var(--transition-base);
}

.pay-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(201, 169, 98, 0.4);
}

.pay-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(15, 15, 15, 0.3);
  border-top-color: var(--color-bg-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
