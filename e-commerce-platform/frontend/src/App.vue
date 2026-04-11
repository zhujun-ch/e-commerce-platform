<template>
  <div class="app">
    <div class="app-background">
      <div class="bg-gradient"></div>
      <div class="bg-noise"></div>
    </div>
    <Navbar />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <footer class="footer">
      <div class="footer-content">
        <span class="footer-brand">LUXE</span>
        <span class="footer-divider">|</span>
        <span class="footer-tagline">精致生活，从选择开始</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>

<style scoped>
.app {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
}

.app-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  overflow: hidden;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 0%, rgba(201, 169, 98, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 100%, rgba(201, 169, 98, 0.05) 0%, transparent 50%),
    linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%);
}

.bg-noise {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E");
}

.main-content {
  flex: 1;
  padding: var(--space-xl) var(--space-lg);
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.footer {
  padding: var(--space-xl) var(--space-lg);
  text-align: center;
  border-top: 1px solid var(--color-border);
  margin-top: auto;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
}

.footer-brand {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-accent-gold);
  letter-spacing: 0.3em;
}

.footer-divider {
  color: var(--color-border);
}

.footer-tagline {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  letter-spacing: 0.1em;
}

/* Page Transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
