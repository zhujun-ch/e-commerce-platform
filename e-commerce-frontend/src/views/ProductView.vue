<template>
  <div class="product-view" v-loading="loading">
    <el-card v-if="product" class="product-detail">
      <div class="product-content">
        <div class="product-image">
          <img :src="product.image_url || 'https://via.placeholder.com/400'" />
        </div>
        <div class="product-info">
          <h1 class="product-name">{{ product.name }}</h1>
          <p class="product-price">¥{{ product.price }}</p>
          <p class="product-category" v-if="product.category">分类: {{ product.category }}</p>
          <p class="product-description" v-if="product.description">{{ product.description }}</p>
          <p class="product-stock">库存: {{ product.stock }}</p>

          <div class="action-area">
            <el-input-number v-model="quantity" :min="1" :max="product.stock" />
            <el-button type="primary" @click="handleAddToCart" :disabled="!authStore.isLoggedIn">
              加入购物车
            </el-button>
          </div>
          <el-button v-if="!authStore.isLoggedIn" type="text" @click="$router.push('/login')">
            请先登录
          </el-button>
        </div>
      </div>
    </el-card>
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
  const result = await cartStore.addItem(product.value.id, quantity.value)
  if (result.success) {
    ElMessage.success('已加入购物车')
  } else {
    ElMessage.error(result.error || '加入购物车失败')
  }
}

onMounted(() => {
  fetchProduct()
})
</script>

<style scoped>
.product-view {
  max-width: 1000px;
  margin: 0 auto;
}
.product-content {
  display: flex;
  gap: 30px;
}
.product-image {
  flex: 0 0 400px;
}
.product-image img {
  width: 100%;
  border-radius: 8px;
}
.product-info {
  flex: 1;
}
.product-name {
  font-size: 24px;
  margin-bottom: 15px;
}
.product-price {
  color: #f56c6c;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 15px;
}
.product-category,
.product-description,
.product-stock {
  color: #606266;
  margin-bottom: 10px;
}
.action-area {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}
</style>
