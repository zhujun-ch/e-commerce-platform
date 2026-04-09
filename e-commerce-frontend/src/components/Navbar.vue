<template>
  <div class="navbar-wrapper">
    <el-menu mode="horizontal" :ellipsis="false" router class="navbar">
      <el-menu-item index="/" class="logo-item">
        <span class="logo">
          <span class="logo-icon">🛒</span>
          电商平台
        </span>
      </el-menu-item>
      <div class="flex-grow" />
      <el-menu-item index="/cart" class="cart-item">
        <el-badge :value="cartCount" :hidden="cartCount === 0" :max="99" class="cart-badge">
          <span class="cart-text">
            <span class="cart-icon">🛍️</span>
            购物车
          </span>
        </el-badge>
      </el-menu-item>
      <el-menu-item v-if="!authStore.isLoggedIn" index="/login" class="auth-item">登录</el-menu-item>
      <el-menu-item v-if="!authStore.isLoggedIn" index="/register" class="auth-item">注册</el-menu-item>
      <el-sub-menu v-if="authStore.isLoggedIn" index="user" class="user-menu">
        <template #title>
          <span class="user-avatar">👤</span>
          {{ authStore.user?.name || authStore.user?.email }}
        </template>
        <el-menu-item index="/profile">个人中心</el-menu-item>
        <el-menu-item index="/orders">我的订单</el-menu-item>
        <el-menu-item @click="handleLogout">退出登录</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const cartCount = computed(() => cartStore.items.length)

onMounted(() => {
  if (authStore.isLoggedIn) {
    cartStore.fetchCart()
  }
})

function handleLogout() {
  authStore.logout()
  cartStore.items = []
  cartStore.total = 0
  ElMessage.success('已退出登录')
  router.push('/')
}
</script>

<style scoped>
.navbar-wrapper {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 12px rgba(102, 126, 234, 0.3);
}
.navbar {
  background: transparent;
  border: none;
  max-width: 1200px;
  margin: 0 auto;
}
:deep(.el-menu--horizontal .el-menu-item) {
  color: white;
  font-weight: 500;
}
:deep(.el-menu--horizontal .el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.15) !important;
  color: white;
}
:deep(.el-menu--horizontal .el-sub-menu .el-sub-menu__title) {
  color: white;
  font-weight: 500;
}
:deep(.el-menu--horizontal .el-sub-menu:hover .el-sub-menu__title) {
  background: rgba(255, 255, 255, 0.15) !important;
  color: white;
}
.logo-item {
  font-size: 20px;
}
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  color: white;
  font-size: 20px;
}
.logo-icon {
  font-size: 24px;
}
.flex-grow {
  flex-grow: 1;
}
.cart-item {
  position: relative;
}
.cart-badge {
  margin-right: 5px;
}
:deep(.el-badge__content) {
  background: linear-gradient(135deg, #ff6b6b, #ee5a5a);
  border: none;
  box-shadow: 0 2px 8px rgba(255, 77, 79, 0.4);
}
.cart-text {
  display: flex;
  align-items: center;
  gap: 6px;
}
.cart-icon {
  font-size: 18px;
}
.auth-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  margin: 0 8px;
  padding: 0 20px !important;
}
.auth-item:hover {
  background: rgba(255, 255, 255, 0.25) !important;
}
.user-menu :deep(.el-sub-menu__title) {
  display: flex;
  align-items: center;
  gap: 6px;
}
.user-avatar {
  font-size: 20px;
}
</style>
