import api from '../utils/axios'

export const orderAPI = {
  createOrder(data) {
    return api.post('/orders', data)
  },
  getOrders() {
    return api.get('/orders')
  },
  getAdminOrders(params) {
    return api.get('/orders/admin/all', { params })
  },
  getOrder(id) {
    return api.get(`/orders/${id}`)
  },
  updateOrderStatus(id, status) {
    return api.put(`/orders/${id}/status`, { status })
  }
}
