import api from '../utils/axios'

export const cartAPI = {
  getCart() {
    return api.get('/cart')
  },
  addItem(data) {
    return api.post('/cart/items', data)
  },
  updateItem(id, data) {
    return api.put(`/cart/items/${id}`, data)
  },
  removeItem(id) {
    return api.delete(`/cart/items/${id}`)
  },
  clearCart() {
    return api.delete('/cart')
  }
}
