<template>
  <div class="cart-view">
    <h1>购物车</h1>
    <div v-loading="loading">
      <el-empty v-if="cartStore.items.length === 0" description="购物车是空的">
        <el-button type="primary" @click="$router.push('/')">去购物</el-button>
      </el-empty>

      <div v-else>
        <el-table :data="cartStore.items" style="width: 100%">
          <el-table-column label="商品图片" width="120">
            <template #default="{ row }">
              <img
                :src="row.product_image_url || placeholderImage"
                class="cart-item-image"
                @error="handleImageError($event)"
              />
            </template>
          </el-table-column>
          <el-table-column label="商品">
            <template #default="{ row }">
              <div class="cart-item">
                <span>{{ row.product_name || row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="价格" prop="product_price" width="120">
            <template #default="{ row }">
              ¥{{ row.product_price }}
            </template>
          </el-table-column>
          <el-table-column label="数量" width="200">
            <template #default="{ row }">
              <el-input-number
                v-model="row.quantity"
                :min="1"
                @change="handleUpdateQuantity(row.id, row.quantity)"
              />
            </template>
          </el-table-column>
          <el-table-column label="小计" width="120">
            <template #default="{ row }">
              ¥{{ (row.product_price * row.quantity).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button type="danger" @click="handleRemove(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="cart-footer">
          <div class="cart-total">
            总计: ¥{{ Number(cartStore.total).toFixed(2) }}
          </div>
          <div class="cart-actions">
            <el-button @click="handleClearCart">清空购物车</el-button>
            <el-button type="primary" @click="$router.push('/checkout')">去结算</el-button>
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

const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC01MCUgLTUwJSkiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5MDkzOTMiPuKAo+i/jzwvdGV4dD48L3N2Zz4='

function handleImageError(e) {
  e.target.src = placeholderImage
}

async function handleUpdateQuantity(id, quantity) {
  await cartStore.updateItem(id, quantity)
}

async function handleRemove(id) {
  await cartStore.removeItem(id)
  ElMessage.success('已删除')
}

async function handleClearCart() {
  await ElMessageBox.confirm('确定要清空购物车吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await cartStore.clearCart()
  ElMessage.success('购物车已清空')
}

onMounted(() => {
  if (authStore.isLoggedIn) {
    cartStore.fetchCart()
  }
})
</script>

<style scoped>
.cart-view {
  max-width: 900px;
  margin: 0 auto;
}
h1 {
  margin-bottom: 20px;
}
.cart-item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}
.cart-footer {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}
.cart-total {
  font-size: 20px;
  font-weight: bold;
  color: #f56c6c;
}
.cart-actions {
  display: flex;
  gap: 10px;
}
</style>
