<template>
  <div class="product-card" @click="$router.push(`/product/${product.id}`)">
    <div class="card-image-wrapper">
      <img
        :src="product.image_url || placeholderImage"
        class="card-image"
        @error="handleImageError"
        loading="lazy"
      />
      <div class="card-overlay"></div>
      <div v-if="product.discount" class="card-tag discount">-{{ product.discount }}%</div>
      <div v-if="product.is_hot" class="card-tag hot">热门</div>
      <div class="card-actions">
        <button class="action-btn quick-view" @click.stop="$router.push(`/product/${product.id}`)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
      </div>
    </div>
    <div class="card-content">
      <span class="card-category">{{ categoryLabel }}</span>
      <h3 class="card-title">{{ product.name }}</h3>
      <div class="card-footer">
        <div class="card-price">
          <span class="price-symbol">¥</span>
          <span class="price-value">{{ formatPrice(product.price) }}</span>
          <span v-if="product.original_price" class="price-original">¥{{ formatPrice(product.original_price) }}</span>
        </div>
        <div v-if="product.sales && product.sales > 0" class="card-sales">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          {{ product.sales }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getCategoryLabel } from '../utils/categories'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const categoryLabel = computed(() => {
  return getCategoryLabel(props.product.category)
})

const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzIxMjEyMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNTAlIC01MCkiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjY2NjYiPtin6L/pfY8L3N2Zz4='

function handleImageError(e) {
  e.target.src = placeholderImage
}

function formatPrice(price) {
  if (typeof price === 'number') {
    return price.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  return price
}
</script>

<style scoped>
.product-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.product-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--radius-lg);
  padding: 1px;
  background: linear-gradient(
    135deg,
    transparent 0%,
    rgba(201, 169, 98, 0.2) 50%,
    transparent 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.product-card:hover::before {
  opacity: 1;
}

.product-card:hover {
  transform: translateY(-10px) scale(1.02);
  border-color: var(--color-border-hover);
  box-shadow:
    0 24px 48px rgba(0, 0, 0, 0.5),
    0 0 80px rgba(201, 169, 98, 0.1);
}

/* Image */
.card-image-wrapper {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1;
  background: var(--color-bg-elevated);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover .card-image {
  transform: scale(1.12);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    transparent 40%,
    rgba(8, 8, 10, 0.7) 100%
  );
  opacity: 0;
  transition: opacity 0.5s ease;
}

.product-card:hover .card-overlay {
  opacity: 1;
}

/* Tags */
.card-tag {
  position: absolute;
  padding: 6px 12px;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: var(--radius-sm);
  z-index: 2;
  animation: fadeInScale 0.4s ease forwards;
}

.card-tag.discount {
  top: 16px;
  right: 16px;
  background: linear-gradient(135deg, #d4736e 0%, #b54a4a 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(212, 115, 110, 0.3);
}

.card-tag.hot {
  top: 16px;
  left: 16px;
  background: linear-gradient(135deg, var(--color-accent-gold) 0%, var(--color-accent-gold-dark) 100%);
  color: var(--color-bg-primary);
  box-shadow: 0 4px 16px rgba(201, 169, 98, 0.3);
}

/* Quick Actions */
.card-actions {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%) translateY(30px);
  opacity: 0;
  display: flex;
  gap: 12px;
  z-index: 2;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.product-card:hover .card-actions {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

.action-btn {
  width: 44px;
  height: 44px;
  background: rgba(8, 8, 10, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(201, 169, 98, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--transition-bounce);
}

.action-btn:hover {
  background: linear-gradient(135deg, var(--color-accent-gold) 0%, var(--color-accent-gold-dark) 100%);
  border-color: var(--color-accent-gold);
  color: var(--color-bg-primary);
  transform: scale(1.15);
  box-shadow: 0 8px 24px rgba(201, 169, 98, 0.3);
}

.action-btn:active {
  transform: scale(0.95);
}

/* Content */
.card-content {
  padding: var(--space-lg);
}

.card-category {
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-accent-gold);
  opacity: 0.7;
}

.card-title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 500;
  color: var(--color-text-primary);
  margin: var(--space-sm) 0 var(--space-md);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color var(--transition-fast);
}

.product-card:hover .card-title {
  color: var(--color-accent-gold-light);
}

.card-footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.card-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price-symbol {
  font-size: 0.9rem;
  color: var(--color-accent-gold);
  font-weight: 400;
}

.price-value {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 500;
  color: var(--color-accent-gold);
  letter-spacing: -0.02em;
}

.price-original {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  text-decoration: line-through;
  margin-left: var(--space-sm);
}

.card-sales {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.card-sales svg {
  color: var(--color-accent-gold);
  opacity: 0.5;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
