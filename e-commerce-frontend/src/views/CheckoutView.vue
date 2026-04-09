<template>
  <div class="checkout-view">
    <h1>确认订单</h1>
    <el-card v-loading="loading">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="收货地址" prop="shipping_address">
          <el-input
            v-model="form.shipping_address"
            type="textarea"
            :rows="3"
            placeholder="请输入详细收货地址"
          />
        </el-form-item>
      </el-form>

      <div class="order-summary">
        <h3>订单摘要</h3>
        <div v-if="cartStore.items.length > 0">
          <div v-for="item in cartStore.items" :key="item.id" class="order-item">
            <span>{{ item.product_name || item.name }} x {{ item.quantity }}</span>
            <span>¥{{ (item.product_price * item.quantity).toFixed(2) }}</span>
          </div>
          <div class="order-total">
            <span>总计:</span>
            <span>¥{{ Number(cartStore.total).toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <div class="checkout-actions">
        <el-button @click="$router.push('/cart')">返回购物车</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          提交订单
        </el-button>
      </div>
    </el-card>
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
const formRef = ref(null)

const form = reactive({
  shipping_address: ''
})

const rules = {
  shipping_address: [
    { required: true, message: '请输入收货地址', trigger: 'blur' }
  ]
}

async function handleSubmit() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

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
  max-width: 700px;
  margin: 0 auto;
}
h1 {
  margin-bottom: 20px;
}
.order-summary {
  margin: 20px 0;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
}
.order-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}
.order-total {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #ddd;
}
.checkout-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>
