<template>
  <div class="dashboard">
    <div class="stats-grid animate-stagger">
      <div class="stat-card">
        <div class="stat-icon sales">
          <svg v-if="!loadingStats.sales" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
          </svg>
          <div v-else class="loading-spinner"></div>
        </div>
        <div class="stat-content">
          <span v-if="!loadingStats.sales" class="stat-value">¥{{ formatNumber(stats.totalSales) }}</span>
          <span v-else class="stat-value loading-placeholder"></span>
          <span class="stat-label">总销售额</span>
        </div>
        <div class="stat-trend up">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
          </svg>
          <span>+12.5%</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon orders">
          <svg v-if="!loadingStats.orders" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          <div v-else class="loading-spinner"></div>
        </div>
        <div class="stat-content">
          <span v-if="!loadingStats.orders" class="stat-value">{{ stats.totalOrders }}</span>
          <span v-else class="stat-value loading-placeholder"></span>
          <span class="stat-label">总订单数</span>
        </div>
        <div class="stat-trend up">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
          </svg>
          <span>+8.2%</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon products">
          <svg v-if="!loadingStats.products" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
          </svg>
          <div v-else class="loading-spinner"></div>
        </div>
        <div class="stat-content">
          <span v-if="!loadingStats.products" class="stat-value">{{ stats.totalProducts }}</span>
          <span v-else class="stat-value loading-placeholder"></span>
          <span class="stat-label">商品数量</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon users">
          <svg v-if="!loadingStats.users" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87"/>
            <path d="M16 3.13a4 4 0 010 7.75"/>
          </svg>
          <div v-else class="loading-spinner"></div>
        </div>
        <div class="stat-content">
          <span v-if="!loadingStats.users" class="stat-value">{{ stats.totalUsers }}</span>
          <span v-else class="stat-value loading-placeholder"></span>
          <span class="stat-label">用户数量</span>
        </div>
        <div class="stat-trend up">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
          </svg>
          <span>+5.1%</span>
        </div>
      </div>
    </div>

    <div class="charts-row">
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">销售趋势</h3>
          <div class="chart-period">
            <button
              v-for="period in ['7天', '30天', '90天']"
              :key="period"
              class="period-btn"
              :class="{ active: selectedPeriod === period }"
              @click="selectedPeriod = period"
            >
              {{ period }}
            </button>
          </div>
        </div>
        <div class="chart-body">
          <div class="chart-placeholder">
            <div class="chart-bars">
              <div v-for="(value, index) in chartData" :key="index" class="chart-bar-wrapper">
                <div class="chart-bar" :style="{ height: value + '%' }"></div>
                <span class="chart-label">{{ chartLabels[index] }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="chart-card small">
        <div class="chart-header">
          <h3 class="chart-title">订单状态分布</h3>
        </div>
        <div class="chart-body">
          <div class="status-distribution">
            <div class="status-item">
              <div class="status-color pending"></div>
              <span class="status-label">待支付</span>
              <span class="status-value">{{ orderStats.pending }}</span>
            </div>
            <div class="status-item">
              <div class="status-color paid"></div>
              <span class="status-label">已支付</span>
              <span class="status-value">{{ orderStats.paid }}</span>
            </div>
            <div class="status-item">
              <div class="status-color shipped"></div>
              <span class="status-label">已发货</span>
              <span class="status-value">{{ orderStats.shipped }}</span>
            </div>
            <div class="status-item">
              <div class="status-color delivered"></div>
              <span class="status-label">已完成</span>
              <span class="status-value">{{ orderStats.delivered }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="activity-section">
      <div class="section-header">
        <h3 class="section-title">最近订单</h3>
        <router-link to="/admin/orders" class="view-all">查看全部</router-link>
      </div>
      <div class="activity-list">
        <div v-for="order in recentOrders" :key="order.id" class="activity-item">
          <div class="activity-info">
            <span class="activity-id">订单 #{{ order.id }}</span>
            <span class="activity-user">{{ order.user_name || '用户' }}</span>
          </div>
          <div class="activity-amount">¥{{ Number(order.total_amount).toFixed(2) }}</div>
          <div class="activity-status" :class="order.status">
            {{ getStatusLabel(order.status) }}
          </div>
          <span class="activity-time">{{ formatTime(order.created_at) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { orderAPI } from '../../api/order'
import { productAPI } from '../../api/product'
import { getStatusLabel, formatTime } from '../../utils/formatters'

const selectedPeriod = ref('7天')

const stats = reactive({
  totalSales: 0,
  totalOrders: 0,
  totalProducts: 0,
  totalUsers: 0
})

const loadingStats = reactive({
  sales: false,
  orders: false,
  products: false,
  users: false
})

const orderStats = reactive({
  pending: 0,
  paid: 0,
  shipped: 0,
  delivered: 0
})

const recentOrders = ref([])

const chartData = ref([40, 65, 45, 80, 55, 70, 50])
const chartLabels = ref(['周一', '周二', '周三', '周四', '周五', '周六', '周日'])

function formatNumber(num) {
  return Number(num || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

async function fetchDashboardData() {
  // Set loading states for all stats
  loadingStats.sales = true
  loadingStats.orders = true
  loadingStats.products = true
  loadingStats.users = true

  try {
    const [ordersData, productsData] = await Promise.all([
      orderAPI.getAdminOrders().catch(() => ({ orders: [] })),
      productAPI.getProducts({ limit: 100 }).catch(() => ({ products: [] }))
    ])

    const orders = ordersData.orders || []

    // Update stats individually
    loadingStats.orders = false
    stats.totalOrders = orders.length

    loadingStats.products = false
    stats.totalProducts = productsData.products?.length || 0

    loadingStats.sales = false
    stats.totalSales = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0)

    orders.forEach(order => {
      const status = order.status || 'pending'
      if (orderStats[status] !== undefined) {
        orderStats[status]++
      }
    })

    recentOrders.value = orders.slice(0, 5)
    updateChartData(orders)

    loadingStats.users = false
    stats.totalUsers = '-'
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
    loadingStats.sales = false
    loadingStats.orders = false
    loadingStats.products = false
    loadingStats.users = false
  }
}

function updateChartData(orders) {
  const now = new Date()
  const days = []
  const sales = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    const dayName = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()]
    days.push(dayName)

    const daySales = orders
      .filter(o => o.created_at && o.created_at.startsWith(dateStr))
      .reduce((sum, o) => sum + Number(o.total_amount || 0), 0)
    sales.push(daySales)
  }

  const maxSale = Math.max(...sales, 1)
  chartData.value = sales.map(s => Math.round((s / maxSale) * 100))
  chartLabels.value = days
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-lg);
}

.stat-card {
  background: rgba(20, 20, 24, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(201, 169, 98, 0.1);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  position: relative;
  transition: all var(--transition-base);
}

.stat-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--radius-lg);
  padding: 1px;
  background: linear-gradient(135deg, rgba(201, 169, 98, 0.1) 0%, transparent 50%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-card:hover {
  border-color: rgba(201, 169, 98, 0.25);
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform var(--transition-bounce);
}

.stat-card:hover .stat-icon {
  transform: scale(1.1);
}

.stat-icon.sales {
  background: linear-gradient(135deg, rgba(201, 169, 98, 0.2) 0%, rgba(201, 169, 98, 0.05) 100%);
  color: var(--color-accent-gold);
}

.stat-icon.orders {
  background: linear-gradient(135deg, rgba(110, 181, 255, 0.2) 0%, rgba(110, 181, 255, 0.05) 100%);
  color: #6eb5ff;
}

.stat-icon.products {
  background: linear-gradient(135deg, rgba(125, 184, 125, 0.2) 0%, rgba(125, 184, 125, 0.05) 100%);
  color: var(--color-success);
}

.stat-icon.users {
  background: linear-gradient(135deg, rgba(201, 130, 110, 0.2) 0%, rgba(201, 130, 110, 0.05) 100%);
  color: #c9826e;
}

.stat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.stat-value {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 500;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
}

.loading-placeholder {
  display: inline-block;
  width: 80px;
  height: 2rem;
  background: linear-gradient(90deg, rgba(201, 169, 98, 0.1) 25%, rgba(201, 169, 98, 0.2) 50%, rgba(201, 169, 98, 0.1) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(201, 169, 98, 0.2);
  border-top-color: var(--color-accent-gold);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.stat-label {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  letter-spacing: 0.05em;
}

.stat-trend {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
}

.stat-trend.up {
  background: rgba(125, 184, 125, 0.15);
  color: var(--color-success);
}

.charts-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-lg);
}

.chart-card {
  background: rgba(20, 20, 24, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(201, 169, 98, 0.1);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-xl);
}

.chart-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 400;
  color: var(--color-text-primary);
}

.chart-period {
  display: flex;
  gap: var(--space-xs);
}

.period-btn {
  padding: var(--space-sm) var(--space-md);
  background: transparent;
  border: 1px solid rgba(201, 169, 98, 0.1);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.period-btn:hover {
  border-color: var(--color-accent-gold);
  color: var(--color-accent-gold);
}

.period-btn.active {
  background: linear-gradient(135deg, var(--color-accent-gold) 0%, var(--color-accent-gold-dark) 100%);
  border-color: var(--color-accent-gold);
  color: var(--color-bg-primary);
}

.chart-placeholder {
  height: 200px;
  display: flex;
  align-items: flex-end;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  gap: var(--space-md);
  padding-bottom: 30px;
}

.chart-bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  height: 100%;
  justify-content: flex-end;
  position: relative;
}

.chart-bar {
  width: 100%;
  background: linear-gradient(180deg, var(--color-accent-gold) 0%, var(--color-accent-gold-dark) 100%);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  min-height: 20px;
  transition: height 0.5s ease, box-shadow 0.3s ease;
}

.chart-bar:hover {
  box-shadow: 0 0 20px rgba(201, 169, 98, 0.3);
}

.chart-label {
  font-size: 0.7rem;
  color: var(--color-text-muted);
  position: absolute;
  bottom: 0;
}

.status-distribution {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.status-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.status-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: 0 0 8px currentColor;
}

.status-color.pending {
  background: var(--color-accent-gold);
  color: rgba(201, 169, 98, 0.5);
}

.status-color.paid {
  background: var(--color-success);
  color: rgba(125, 184, 125, 0.5);
}

.status-color.shipped {
  background: #6eb5ff;
  color: rgba(110, 181, 255, 0.5);
}

.status-color.delivered {
  background: #c9a962;
  color: rgba(201, 169, 98, 0.5);
}

.status-label {
  flex: 1;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.status-value {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.activity-section {
  background: rgba(20, 20, 24, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(201, 169, 98, 0.1);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-lg);
}

.section-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 400;
  color: var(--color-text-primary);
}

.view-all {
  font-size: 0.8rem;
  color: var(--color-accent-gold);
  transition: color var(--transition-fast);
}

.view-all:hover {
  color: var(--color-accent-gold-light);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.activity-item {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: var(--space-lg);
  align-items: center;
  padding: var(--space-lg);
  background: rgba(26, 26, 31, 0.5);
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
}

.activity-item:hover {
  background: rgba(26, 26, 31, 0.8);
  transform: translateX(4px);
}

.activity-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.activity-id {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.activity-user {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.activity-amount {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-accent-gold);
}

.activity-status {
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-xl);
  font-size: 0.75rem;
  font-weight: 500;
}

.activity-status.pending {
  background: rgba(201, 169, 98, 0.15);
  color: var(--color-warning);
}

.activity-status.paid,
.activity-status.delivered {
  background: rgba(125, 184, 125, 0.15);
  color: var(--color-success);
}

.activity-status.shipped {
  background: rgba(110, 181, 255, 0.15);
  color: #6eb5ff;
}

.activity-time {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .activity-item {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }
}
</style>
