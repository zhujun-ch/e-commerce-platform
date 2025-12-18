import axios from 'axios'

// 创建axios实例
const apiClient = axios.create({
    baseURL: '/api/auth', // 使用vite.config.js中配置的代理
    withCredentials: true // 允许携带cookie
})

export default {
    /**
     * 用户登录
     * @param {string} username 用户名
     * @param {string} password 密码
     * @returns {Promise} 登录结果
     */
    login(username, password) {
        return apiClient.post('/login', { username, password })
    },

    /**
     * 获取当前用户信息
     * @returns {Promise} 用户信息
     */
    getUserInfo() {
        return apiClient.get('/userinfo')
    },

    /**
     * 用户登出
     * @returns {Promise} 登出结果
     */
    logout() {
        return apiClient.post('/logout')
    }
}