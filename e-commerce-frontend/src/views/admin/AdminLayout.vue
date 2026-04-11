<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="logo">
        <router-link to="/admin">
          <span class="logo-text">LUXE</span>
          <span class="logo-sub">Admin</span>
        </router-link>
      </div>
      <nav class="nav">
        <router-link to="/admin" class="nav-item" :class="{ active: $route.path === '/admin' }">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
          <span>仪表盘</span>
        </router-link>
        <router-link to="/admin/products" class="nav-item" :class="{ active: $route.path === '/admin/products' }">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
          </svg>
          <span>商品管理</span>
        </router-link>
        <router-link to="/admin/orders" class="nav-item" :class="{ active: $route.path === '/admin/orders' }">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <span>订单管理</span>
        </router-link>
        <router-link to="/admin/users" class="nav-item" :class="{ active: $route.path === '/admin/users' }">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
          </svg>
          <span>用户管理</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <router-link to="/" class="back-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          <span>返回商城</span>
        </router-link>
        <button class="logout-btn" @click="handleLogout">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span>退出登录</span>
        </button>
      </div>
    </aside>
    <main class="main-content">
      <header class="top-bar">
        <h1 class="page-title">{{ pageTitle }}</h1>
        <div class="user-info">
          <span>{{ userName }}</span>
        </div>
      </header>
      <div class="content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const pageTitle = computed(() => {
  const titles = {
    '/admin': '仪表盘',
    '/admin/products': '商品管理',
    '/admin/orders': '订单管理',
    '/admin/users': '用户管理'
  }
  return titles[route.path] || '管理后台'
})

const userName = computed(() => authStore.user?.name || 'Admin')

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg-primary);
}

.sidebar {
  width: 260px;
  background: rgba(20, 20, 24, 0.95);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(201, 169, 98, 0.08);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 100;
}

.sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
  background: linear-gradient(180deg, transparent, rgba(201, 169, 98, 0.2), transparent);
}

.logo {
  padding: var(--space-xl);
  border-bottom: 1px solid rgba(201, 169, 98, 0.08);
}

.logo a {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  transition: opacity var(--transition-fast);
}

.logo a:hover {
  opacity: 0.8;
}

.logo-text {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 500;
  color: var(--color-accent-gold);
  letter-spacing: 0.2em;
}

.logo-sub {
  font-size: 0.65rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.3em;
  margin-top: 2px;
}

.nav {
  flex: 1;
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-lg);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(180deg, var(--color-accent-gold), var(--color-accent-gold-dark));
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.nav-item:hover {
  background: rgba(201, 169, 98, 0.05);
  color: var(--color-text-primary);
}

.nav-item.active {
  background: rgba(201, 169, 98, 0.1);
  color: var(--color-accent-gold);
}

.nav-item.active::before {
  opacity: 1;
}

.nav-item svg {
  flex-shrink: 0;
  transition: transform var(--transition-fast);
}

.nav-item:hover svg {
  transform: scale(1.1);
}

.sidebar-footer {
  padding: var(--space-lg);
  border-top: 1px solid rgba(201, 169, 98, 0.08);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.back-link,
.logout-btn {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all var(--transition-fast);
  background: none;
  border: none;
  font-size: 0.85rem;
  cursor: pointer;
  width: 100%;
  text-align: left;
}

.back-link:hover,
.logout-btn:hover {
  background: rgba(201, 169, 98, 0.05);
  color: var(--color-accent-gold);
}

.main-content {
  flex: 1;
  margin-left: 260px;
  min-height: 100vh;
}

.top-bar {
  height: 72px;
  padding: 0 var(--space-xl);
  border-bottom: 1px solid rgba(201, 169, 98, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(20, 20, 24, 0.8);
  backdrop-filter: blur(20px);
  position: sticky;
  top: 0;
  z-index: 50;
}

.page-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--color-text-primary);
  letter-spacing: 0.05em;
}

.user-info {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  padding: var(--space-sm) var(--space-md);
  background: rgba(201, 169, 98, 0.05);
  border-radius: var(--radius-md);
  border: 1px solid rgba(201, 169, 98, 0.1);
}

.content {
  padding: var(--space-xl);
}
</style>
