<template>
  <el-card :body-style="{ padding: '0px' }" class="product-card" @click="$router.push(`/product/${product.id}`)">
    <div class="image-wrapper">
      <img
        :src="product.image_url || placeholderImage"
        class="product-image"
        @error="handleImageError"
      />
      <div v-if="product.discount" class="discount-tag">-{{ product.discount }}%</div>
      <div v-if="product.is_hot" class="hot-tag">热门</div>
      <div v-if="product.sales && product.sales > 0" class="sales-tag">销量 {{ product.sales }}</div>
    </div>
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <div class="price-row">
        <span class="product-price">¥{{ product.price }}</span>
        <span v-if="product.original_price" class="original-price">¥{{ product.original_price }}</span>
      </div>
      <p class="product-category" v-if="product.category">{{ product.category }}</p>
    </div>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNTAlIC01MCkiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5MDkzOTMiPuKAo+i/jzwvdGV4dD48L3N2Zz4='

function handleImageError(e) {
  e.target.src = placeholderImage
}
</script>

<style scoped>
.product-card {
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: none;
}
.product-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}
.image-wrapper {
  position: relative;
  overflow: hidden;
}
.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.product-card:hover .product-image {
  transform: scale(1.08);
}
.discount-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a5a);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}
.hot-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  background: linear-gradient(135deg, #ffa500, #ff8c00);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}
.sales-tag {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
}
.product-info {
  padding: 14px;
}
.product-name {
  font-size: 15px;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #333;
  font-weight: 500;
}
.price-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
}
.product-price {
  color: #ff4d4f;
  font-size: 22px;
  font-weight: bold;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
.original-price {
  color: #999;
  font-size: 13px;
  text-decoration: line-through;
}
.product-category {
  font-size: 12px;
  color: #909399;
}
</style>
