import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import StudentManagement from '../components/StudentManagement.vue'
import authService from '../services/authService.js'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: StudentManagement,
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
    // 检查路由是否需要认证
    if (to.meta.requiresAuth) {
        try {
            // 检查用户是否已登录
            const response = await authService.getUserInfo()
            const { code, data } = response.data

            if (code === 200 && data) {
                // 用户已登录，允许访问
                next()
            } else {
                // 用户未登录，重定向到登录页面
                next('/login')
            }
        } catch (error) {
            // 网络错误或其他异常，重定向到登录页面
            console.error('检查登录状态失败:', error)
            next('/login')
        }
    } else {
        // 不需要认证的路由，直接访问
        next()
    }
})

export default router