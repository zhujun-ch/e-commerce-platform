import api from '../utils/axios'

export const paymentAPI = {
  createPayment(data) {
    return api.post('/payments/create', data)
  },
  getPayment(id) {
    return api.get(`/payments/${id}`)
  },
  refund(data) {
    return api.post('/payments/refund', data)
  }
}
