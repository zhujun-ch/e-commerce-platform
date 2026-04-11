<template>
  <header class="navbar">
    <div class="navbar-inner">
      <router-link to="/" class="brand">
        <span class="brand-icon">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L2 8v12l12 6 12-6V8L14 2z" stroke="currentColor" stroke-width="1.5" fill="none"/>
            <path d="M14 8v12M8 11l6 3 6-3" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </span>
        <span class="brand-text">LUXE</span>
      </router-link>

      <nav class="nav-links">
        <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">
          <span class="nav-link-text">首页</span>
        </router-link>
        <router-link to="/cart" class="nav-link cart-link" :class="{ active: $route.path === '/cart' }">
          <span class="cart-wrapper">
            <svg class="cart-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <span v-if="cartCount > 0" class="cart-badge">{{ cartCount > 99 ? '99+' : cartCount }}</span>
          </span>
        </router-link>

        <template v-if="!authStore.isLoggedIn">
          <router-link to="/login" class="nav-link auth-link">
            <span class="auth-text">登录</span>
          </router-link>
          <router-link to="/register" class="nav-link auth-link register">
            <span class="auth-text">注册</span>
          </router-link>
        </template>

        <template v-else>
          <div class="user-menu" @click="menuVisible = !menuVisible" ref="menuRef">
            <div class="user-trigger">
              <span class="user-avatar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M20 21a8 8 0 10-16 0"/>
                </svg>
              </span>
              <span class="user-name">{{ authStore.user?.name || authStore.user?.email?.split('@')[0] }}</span>
              <svg class="chevron" :class="{ rotated: menuVisible }" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
            <transition name="dropdown">
              <div v-if="menuVisible" class="dropdown-menu">
                <router-link to="/profile" class="dropdown-item" @click="menuVisible = false">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M20 21a8 8 0 10-16 0"/>
                  </svg>
                  个人中心
                </router-link>
                <router-link to="/orders" class="dropdown-item" @click="menuVisible = false">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                  我的订单
                </router-link>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item logout" @click="handleLogout">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  退出登录
                </button>
              </div>
            </transition>
          </div>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const menuVisible = ref(false)
const menuRef = ref(null)

const cartCount = computed(() => cartStore.items.length)

function handleClickOutside(e) {
  if (menuRef.value && !menuRef.value.contains(e.target)) {
    menuVisible.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  if (authStore.isLoggedIn) {
    cartStore.fetchCart()
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function handleLogout() {
  menuVisible.value = false
  authStore.logout()
  cartStore.items = []
  cartStore.total = 0
  ElMessage.success('已退出登录')
  router.push('/')
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(15, 15, 15, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border);
}

.navbar-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Brand */
.brand {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--color-text-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.brand:hover {
  color: var(--color-accent-gold);
}

.brand-icon {
  color: var(--color-accent-gold);
  display: flex;
  align-items: center;
}

.brand-text {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.3em;
  color: var(--color-accent-gold);
}

/* Nav Links */
.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

.nav-link {
  position: relative;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  padding: var(--space-sm) 0;
  transition: color var(--transition-fast);
}

.nav-link:hover,
.nav-link.active {
  color: var(--color-accent-gold);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--color-accent-gold);
  transition: width var(--transition-base);
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

/* Cart */
.cart-link {
  padding: var(--space-sm);
}

.cart-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.cart-icon {
  transition: transform var(--transition-fast);
}

.cart-link:hover .cart-icon {
  transform: scale(1.1);
}

.cart-badge {
  position: absolute;
  top: -6px;
  right: -8px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: linear-gradient(135deg, var(--color-accent-gold) 0%, var(--color-accent-gold-dark) 100%);
  color: var(--color-bg-primary);
  font-size: 0.65rem;
  font-weight: 600;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Auth Links */
.auth-link {
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  margin-left: var(--space-sm);
}

.auth-link::after {
  display: none;
}

.auth-link:hover {
  border-color: var(--color-accent-gold);
  background: rgba(201, 169, 98, 0.08);
}

.auth-link.register {
  background: linear-gradient(135deg, var(--color-accent-gold) 0%, var(--color-accent-gold-dark) 100%);
  border: none;
  color: var(--color-bg-primary);
}

.auth-link.register:hover {
  background: linear-gradient(135deg, var(--color-accent-gold-light) 0%, var(--color-accent-gold) 100%);
  color: var(--color-bg-primary);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(201, 169, 98, 0.3);
}

.auth-link.register::after {
  display: none;
}

/* User Menu */
.user-menu {
  position: relative;
  margin-left: var(--space-sm);
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--color-text-secondary);
}

.user-trigger:hover {
  border-color: var(--color-accent-gold);
  color: var(--color-accent-gold);
}

.user-avatar {
  width: 28px;
  height: 28px;
  background: var(--color-bg-elevated);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent-gold);
}

.user-name {
  font-size: 0.875rem;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chevron {
  transition: transform var(--transition-fast);
}

.chevron.rotated {
  transform: rotate(180deg);
}

/* Dropdown */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-sm);
  box-shadow: var(--shadow-lg);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  border: none;
  background: none;
  width: 100%;
  text-align: left;
}

.dropdown-item:hover {
  background: var(--color-bg-hover);
  color: var(--color-accent-gold);
}

.dropdown-item.logout {
  color: var(--color-error);
}

.dropdown-item.logout:hover {
  background: rgba(212, 115, 110, 0.1);
  color: var(--color-error);
}

.dropdown-divider {
  height: 1px;
  background: var(--color-border);
  margin: var(--space-sm) 0;
}

/* Dropdown Animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}
</style>
