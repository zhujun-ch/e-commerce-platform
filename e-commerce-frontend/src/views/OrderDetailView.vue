<template>
  <div class="order-detail-view" v-loading="loading">
    <el-page-header @back="$router.push('/orders')" content="订单详情" />

    <el-card v-if="order" class="order-card">
      <div class="order-header">
        <span class="order-id">订单号: {{ order.id }}</span>
        <el-tag :type="getStatusType(order.status)">{{ order.status }}</el-tag>
      </div>

      <el-divider />

      <div class="order-info">
        <p><strong>收货地址:</strong> {{ order.shipping_address }}</p>
        <p><strong>下单时间:</strong> {{ new Date(order.created_at).toLocaleString() }}</p>
      </div>

      <el-divider />

      <div class="order-items">
        <h3>商品列表</h3>
        <el-table :data="items" border>
          <el-table-column prop="name" label="商品名称" />
          <el-table-column prop="price" label="单价" width="120">
            <template #default="{ row }">¥{{ row.price }}</template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" width="100" />
          <el-table-column label="小计" width="120">
            <template #default="{ row }">¥{{ (row.price * row.quantity).toFixed(2) }}</template>
          </el-table-column>
        </el-table>
      </div>

      <div class="order-total">
        <span>订单总金额:</span>
        <span class="total-amount">¥{{ order.total_amount }}</span>
      </div>

      <div class="order-actions" v-if="order.status === 'pending'">
        <el-button type="primary" @click="handlePay">去支付</el-button>
      </div>
    </el-card>
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
  try {
    const paymentData = await paymentAPI.createPayment({
      order_id: order.value.id,
      amount: order.value.total_amount
    })
    ElMessage.success('支付成功')
    await fetchOrder()
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '支付失败')
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
.order-card {
  margin-top: 20px;
}
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.order-id {
  color: #606266;
}
.order-info p {
  margin: 8px 0;
}
.order-items {
  margin: 20px 0;
}
.order-total {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  font-size: 18px;
}
.total-amount {
  color: #f56c6c;
  font-weight: bold;
  font-size: 24px;
}
.order-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
