import api from '../utils/axios'

export const authAPI = {
  register(data) {
    return api.post('/auth/register', data)
  },
  login(data) {
    return api.post('/auth/login', data)
  },
  getProfile() {
    return api.get('/auth/profile')
  },
  updateProfile(data) {
    return api.put('/auth/profile', data)
  },
  getUsers() {
    return api.get('/auth/admin/users')
  },
  updateUserRole(id, role) {
    return api.put(`/auth/admin/users/${id}/role`, { role })
  },
  deleteUser(id) {
    return api.delete(`/auth/admin/users/${id}`)
  }
}
