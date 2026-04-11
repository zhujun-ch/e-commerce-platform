import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI } from '../api/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref(localStorage.getItem('token') || '')

  const isLoggedIn = computed(() => !!token.value)

  function setAuth(newToken, newUser) {
    token.value = newToken
    user.value = newUser
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  async function fetchProfile() {
    if (!token.value) return
    try {
      const data = await authAPI.getProfile()
      user.value = data.user
      localStorage.setItem('user', JSON.stringify(data.user))
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    }
  }

  return {
    user,
    token,
    isLoggedIn,
    setAuth,
    logout,
    fetchProfile
  }
})
