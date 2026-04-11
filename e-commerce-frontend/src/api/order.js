import api from '../utils/axios'

export const orderAPI = {
  createOrder(data) {
    return api.post('/orders', data)
  },
  getOrders() {
    return api.get('/orders')
  },
  getAdminOrders() {
    return api.get('/orders/admin/all')
  },
  getOrder(id) {
    return api.get(`/orders/${id}`)
  },
  updateOrderStatus(id, status) {
    return api.put(`/orders/${id}/status`, { status })
  }
}
