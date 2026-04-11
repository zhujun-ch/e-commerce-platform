<template>
  <div class="orders-admin">
    <div class="page-actions">
      <div class="search-box">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          v-model="searchKeyword"
          type="text"
          class="search-input"
          placeholder="搜索订单..."
          @keyup.enter="handleSearch"
        />
      </div>
      <select v-model="statusFilter" class="filter-select" @change="fetchOrders">
        <option value="">全部状态</option>
        <option value="pending">待支付</option>
        <option value="paid">已支付</option>
        <option value="shipped">已发货</option>
        <option value="delivered">已完成</option>
        <option value="cancelled">已取消</option>
      </select>
    </div>

    <div class="table-card">
      <el-table
        v-loading="loading"
        :data="orders"
        style="width: 100%"
        class="orders-table"
      >
        <el-table-column label="订单信息" min-width="200">
          <template #default="{ row }">
            <div class="order-cell">
              <span class="order-id">#{{ row.id }}</span>
              <span class="order-user">{{ row.user_name || '用户' }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="商品" min-width="180">
          <template #default="{ row }">
            <div class="order-products">
              <span v-for="(item, idx) in (row.items || []).slice(0, 2)" :key="idx" class="product-tag">
                {{ item.product_name || '商品' }} x{{ item.quantity }}
              </span>
              <span v-if="(row.items || []).length > 2" class="more-items">+{{ row.items.length - 2 }} 更多</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="金额" width="120">
          <template #default="{ row }">
            <span class="amount">¥{{ Number(row.total_amount).toFixed(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <span class="status-badge" :class="row.status">
              {{ getStatusLabel(row.status) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="时间" width="140">
          <template #default="{ row }">
            <span class="order-time">{{ formatTime(row.created_at) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <button class="action-btn view" @click="viewOrder(row)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
              <button v-if="row.status === 'paid'" class="action-btn ship" @click="updateStatus(row, 'shipped')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="1" y="3" width="15" height="13"/>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </button>
              <button v-if="row.status === 'shipped'" class="action-btn deliver" @click="updateStatus(row, 'delivered')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </button>
              <button v-if="['pending', 'paid'].includes(row.status)" class="action-btn cancel" @click="updateStatus(row, 'cancelled')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
          @current-change="fetchOrders"
        />
      </div>
    </div>

    <el-dialog
      v-model="detailVisible"
      title="订单详情"
      width="500px"
      class="order-dialog"
    >
      <div v-if="currentOrder" class="order-detail">
        <div class="detail-header">
          <div>
            <div class="order-short-id">#{{ currentOrder.id.slice(-8) }}</div>
            <div class="order-meta">
              <div class="order-meta-row">
                <span class="order-meta-label">用户</span>
                <span class="order-meta-value">{{ currentOrder.user_name || '用户' }}</span>
              </div>
              <div class="order-meta-row">
                <span class="order-meta-label">状态</span>
                <span class="status-badge" :class="currentOrder.status">{{ getStatusLabel(currentOrder.status) }}</span>
              </div>
              <div class="order-meta-row">
                <span class="order-meta-label">时间</span>
                <span class="order-meta-value">{{ formatDateTime(currentOrder.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h4>商品清单</h4>
          <div v-for="(item, idx) in currentOrder.items || []" :key="idx" class="item-row">
            <div class="item-info">
              <span class="item-name">{{ item.product_name || '商品' }}</span>
              <span class="item-quantity">x{{ item.quantity }}</span>
            </div>
            <span class="item-price">¥{{ Number(item.price * item.quantity).toFixed(2) }}</span>
          </div>
        </div>

        <div class="detail-section total">
          <span class="total-label">订单总额</span>
          <span class="total-amount">¥{{ Number(currentOrder.total_amount).toFixed(2) }}</span>
        </div>

        <div v-if="currentOrder.status !== 'delivered' && currentOrder.status !== 'cancelled'" class="detail-actions">
          <button v-if="currentOrder.status === 'paid'" class="action-btn-large ship" @click="updateStatus(currentOrder, 'shipped'); detailVisible = false">
            确认发货
          </button>
          <button v-if="currentOrder.status === 'shipped'" class="action-btn-large deliver" @click="updateStatus(currentOrder, 'delivered'); detailVisible = false">
            确认完成
          </button>
          <button v-if="['pending', 'paid'].includes(currentOrder.status)" class="action-btn-large cancel" @click="updateStatus(currentOrder, 'cancelled'); detailVisible = false">
            取消订单
          </button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { orderAPI } from '../../api/order'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const orders = ref([])
const searchKeyword = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const detailVisible = ref(false)
const currentOrder = ref(null)

function getStatusLabel(status) {
  const map = {
    pending: '待支付',
    paid: '已支付',
    shipped: '已发货',
    delivered: '已完成',
    cancelled: '已取消'
  }
  return map[status] || status
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN')
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

function handleSearch() {
  currentPage.value = 1
  fetchOrders()
}

async function fetchOrders() {
  loading.value = true
  try {
    const data = await orderAPI.getAdminOrders()
    let allOrders = data.orders || []

    if (statusFilter.value) {
      allOrders = allOrders.filter(o => o.status === statusFilter.value)
    }

    if (searchKeyword.value) {
      const kw = searchKeyword.value.toLowerCase()
      allOrders = allOrders.filter(o =>
        o.id.toLowerCase().includes(kw) ||
        (o.user_name && o.user_name.toLowerCase().includes(kw))
      )
    }

    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    orders.value = allOrders.slice(start, end)
    total.value = allOrders.length
  } catch (error) {
    console.error('Failed to fetch orders:', error)
  } finally {
    loading.value = false
  }
}

function viewOrder(order) {
  currentOrder.value = order
  detailVisible.value = true
}

async function updateStatus(order, status) {
  try {
    await orderAPI.updateOrderStatus(order.id, status)
    ElMessage.success('订单状态已更新')
    detailVisible.value = false
    fetchOrders()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.orders-admin {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.page-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-lg);
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  transition: color var(--transition-fast);
}

.search-box:focus-within .search-icon {
  color: var(--color-accent-gold);
}

.search-input {
  width: 100%;
  height: 48px;
  padding: 0 16px 0 48px;
  background: rgba(20, 20, 24, 0.8);
  border: 1px solid rgba(201, 169, 98, 0.1);
  border-radius: var(--radius-lg);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  font-size: 0.9rem;
  transition: all var(--transition-base);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-accent-gold);
  box-shadow: 0 0 0 3px rgba(201, 169, 98, 0.08);
}

.filter-select {
  height: 48px;
  padding: 0 var(--space-lg);
  background: rgba(20, 20, 24, 0.8);
  border: 1px solid rgba(201, 169, 98, 0.1);
  border-radius: var(--radius-lg);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-accent-gold);
}

.table-card {
  background: rgba(20, 20, 24, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(201, 169, 98, 0.1);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.order-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.order-id {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.order-user {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.order-products {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.product-tag {
  padding: 4px 10px;
  background: rgba(201, 169, 98, 0.08);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  color: var(--color-accent-gold);
}

.more-items {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.amount {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-accent-gold);
}

.status-badge {
  padding: 4px 12px;
  border-radius: var(--radius-xl);
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.pending {
  background: rgba(201, 169, 98, 0.15);
  color: var(--color-warning);
}

.status-badge.paid,
.status-badge.delivered {
  background: rgba(125, 184, 125, 0.15);
  color: var(--color-success);
}

.status-badge.shipped {
  background: rgba(110, 181, 255, 0.15);
  color: #6eb5ff;
}

.status-badge.cancelled {
  background: rgba(212, 115, 110, 0.15);
  color: var(--color-error);
}

.order-time {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.action-buttons {
  display: flex;
  gap: var(--space-sm);
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(201, 169, 98, 0.15);
  background: rgba(201, 169, 98, 0.05);
  color: var(--color-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
}

.action-btn:hover {
  border-color: var(--color-accent-gold);
  color: var(--color-accent-gold);
  background: rgba(201, 169, 98, 0.1);
  transform: translateY(-2px);
}

.action-btn.ship:hover {
  border-color: #6eb5ff;
  color: #6eb5ff;
  background: rgba(110, 181, 255, 0.1);
}

.action-btn.deliver:hover {
  border-color: var(--color-success);
  color: var(--color-success);
  background: rgba(125, 184, 125, 0.1);
}

.action-btn.cancel:hover {
  border-color: var(--color-error);
  color: var(--color-error);
  background: rgba(212, 115, 110, 0.1);
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: var(--space-lg);
  border-top: 1px solid rgba(201, 169, 98, 0.08);
}

.order-detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid rgba(201, 169, 98, 0.1);
}

.order-short-id {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.order-meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.order-meta-row {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.order-meta-label {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  min-width: 60px;
}

.order-meta-value {
  font-size: 0.875rem;
  color: var(--color-text-primary);
}

.detail-section {
  padding: var(--space-lg) 0;
  border-bottom: 1px solid rgba(201, 169, 98, 0.08);
}

.detail-section h4 {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: var(--space-md);
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) 0;
  border-bottom: 1px dashed rgba(201, 169, 98, 0.1);
}

.item-row:last-child {
  border-bottom: none;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.item-quantity {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.item-price {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-accent-gold);
}

.detail-section.total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: none;
  padding-top: var(--space-lg);
}

.total-label {
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.total-amount {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 500;
  color: var(--color-accent-gold);
}

.detail-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: flex-end;
  padding-top: var(--space-lg);
}

.action-btn-large {
  padding: var(--space-md) var(--space-xl);
  border-radius: var(--radius-lg);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base);
  border: 1px solid;
}

.action-btn-large.ship {
  background: rgba(110, 181, 255, 0.1);
  border-color: #6eb5ff;
  color: #6eb5ff;
}

.action-btn-large.deliver {
  background: rgba(125, 184, 125, 0.1);
  border-color: var(--color-success);
  color: var(--color-success);
}

.action-btn-large.cancel {
  background: rgba(212, 115, 110, 0.1);
  border-color: var(--color-error);
  color: var(--color-error);
}

.action-btn-large:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}
</style>
