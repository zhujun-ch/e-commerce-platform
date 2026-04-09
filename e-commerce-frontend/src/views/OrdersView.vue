<template>
  <div class="orders-view">
    <h1>我的订单</h1>
    <div v-loading="loading">
      <el-empty v-if="orders.length === 0" description="暂无订单">
        <el-button type="primary" @click="$router.push('/')">去购物</el-button>
      </el-empty>

      <div v-else>
        <el-card v-for="order in orders" :key="order.id" class="order-card" @click="$router.push(`/order/${order.id}`)">
          <div class="order-header">
            <span class="order-id">订单号: {{ order.id }}</span>
            <el-tag :type="getStatusType(order.status)">{{ order.status }}</el-tag>
          </div>
          <div class="order-items">
            <div v-for="item in order.items" :key="item.id" class="order-item">
              <span>{{ item.product_name || item.name }} x {{ item.quantity }}</span>
              <span>¥{{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>
          <div class="order-footer">
            <span class="order-date">{{ new Date(order.created_at).toLocaleString() }}</span>
            <span class="order-total">总计: ¥{{ order.total_amount }}</span>
          </div>
        </el-card>
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

function getStatusType(status) {
  const map = {
    pending: 'warning',
    paid: 'success',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'info'
  }
  return map[status] || ''
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
  max-width: 800px;
  margin: 0 auto;
}
h1 {
  margin-bottom: 20px;
}
.order-card {
  margin-bottom: 15px;
  cursor: pointer;
}
.order-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.order-id {
  color: #606266;
  font-size: 12px;
}
.order-items {
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}
.order-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
}
.order-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
.order-date {
  color: #909399;
  font-size: 12px;
}
.order-total {
  font-weight: bold;
  color: #f56c6c;
}
</style>
