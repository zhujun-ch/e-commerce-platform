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
  }
}
