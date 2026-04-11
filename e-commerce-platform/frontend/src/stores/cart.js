import { defineStore } from 'pinia'
import { ref } from 'vue'
import { cartAPI } from '../api/cart'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const total = ref(0)

  async function fetchCart() {
    try {
      const data = await cartAPI.getCart()
      items.value = data.items || []
      total.value = Number(data.total) || 0
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    }
  }

  async function addItem(productId, quantity = 1) {
    try {
      await cartAPI.addItem({ product_id: productId, quantity })
      await fetchCart()
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async function updateItem(itemId, quantity) {
    try {
      await cartAPI.updateItem(itemId, { quantity })
      await fetchCart()
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async function removeItem(itemId) {
    try {
      await cartAPI.removeItem(itemId)
      await fetchCart()
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async function clearCart() {
    try {
      await cartAPI.clearCart()
      items.value = []
      total.value = 0
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  return {
    items,
    total,
    fetchCart,
    addItem,
    updateItem,
    removeItem,
    clearCart
  }
})
