import api from '../utils/axios'

export const orderAPI = {
  createOrder(data) {
    return api.post('/orders', data)
  },
  getOrders() {
    return api.get('/orders')
  },
  getOrder(id) {
    return api.get(`/orders/${id}`)
  },
  updateOrderStatus(id, data) {
    return api.put(`/orders/${id}/status`, data)
  }
}
