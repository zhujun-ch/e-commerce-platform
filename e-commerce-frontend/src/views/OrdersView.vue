<template>
  <div class="orders-view">
    <div class="orders-header">
      <h1 class="orders-title">我的订单</h1>
      <span class="orders-count">{{ orders.length }} 个订单</span>
    </div>

    <div v-loading="loading">
      <el-empty v-if="orders.length === 0" class="empty-state">
        <template #image>
          <div class="empty-illustration">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
        </template>
        <template #description>
          <p class="empty-text">暂无订单</p>
        </template>
        <el-button type="primary" @click="$router.push('/')" class="empty-btn">
          去购物
        </el-button>
      </el-empty>

      <div v-else class="orders-list animate-stagger">
        <div
          v-for="order in orders"
          :key="order.id"
          class="order-card"
          @click="$router.push(`/order/${order.id}`)"
        >
          <div class="order-header">
            <div class="order-meta">
              <span class="order-id">订单号 {{ order.id }}</span>
              <span class="order-date">{{ formatDate(order.created_at) }}</span>
            </div>
            <div class="order-status" :class="getStatusClass(order.status)">
              <span class="status-dot"></span>
              {{ getStatusLabel(order.status) }}
            </div>
          </div>

          <div class="order-items">
            <div v-for="item in order.items" :key="item.id" class="order-item">
              <span class="item-name">{{ item.product_name || item.name }}</span>
              <span class="item-qty">x {{ item.quantity }}</span>
              <span class="item-price">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>

          <div class="order-footer">
            <div class="order-total">
              <span class="total-label">合计</span>
              <span class="total-value">¥{{ Number(order.total_amount).toFixed(2) }}</span>
            </div>
            <div class="order-action">
              <span class="view-detail">查看详情</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { orderAPI } from '../api/order'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const orders = ref([])

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

function formatDate(dateStr) {
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

async function fetchOrders() {
  if (!authStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  loading.value = true
  try {
    const data = await orderAPI.getOrders()
    orders.value = data.orders || []
  } catch (error) {
    ElMessage.error('获取订单失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.orders-view {
  max-width: 900px;
  margin: 0 auto;
}

.orders-header {
  display: flex;
  align-items: baseline;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.orders-title {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.orders-count {
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

/* Orders List */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.order-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  cursor: pointer;
  transition: all var(--transition-base);
}

.order-card:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

/* Order Header */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--color-border);
}

.order-meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.order-id {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
  letter-spacing: 0.05em;
}

.order-date {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.order-status {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 0.8rem;
  font-weight: 500;
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-xl);
  background: var(--color-bg-elevated);
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

/* Order Items */
.order-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-md) 0;
}

.order-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-size: 0.875rem;
}

.item-name {
  flex: 1;
  color: var(--color-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-qty {
  color: var(--color-text-muted);
  font-size: 0.8rem;
}

.item-price {
  font-family: var(--font-display);
  color: var(--color-text-primary);
  min-width: 80px;
  text-align: right;
}

/* Order Footer */
.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-border);
}

.total-label {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-right: var(--space-sm);
}

.total-value {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-accent-gold);
}

.order-action {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  color: var(--color-text-muted);
  font-size: 0.8rem;
  transition: color var(--transition-fast);
}

.order-card:hover .order-action {
  color: var(--color-accent-gold);
}
</style>
