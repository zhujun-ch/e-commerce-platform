<template>
  <div id="app">
    <el-container class="app-container" v-if="$route.name !== 'Login'">
      <!-- 头部 -->
      <el-header class="app-header">
        <div class="header-content">
          <h1><el-icon><User /></el-icon> 学生信息管理系统</h1>
          <div class="header-info">
            <span>欢迎，{{ currentUser?.username }}</span>
            <el-button type="primary" size="small" @click="handleLogout" style="margin-left: 15px;">
              退出登录
            </el-button>
          </div>
        </div>
      </el-header>

      <!-- 主体内容 -->
      <el-main class="app-main">
        <router-view />
      </el-main>
    </el-container>

    <!-- 登录页面由路由控制 -->
    <router-view v-if="$route.name === 'Login'" />
  </div>
</template>

<script>
import { User } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import authService from './services/authService'

export default {
  name: 'App',
  components: {
    User
  },
  setup() {
    const router = useRouter()
    const currentUser = ref(null)

    // 检查用户登录状态
    const checkLoginStatus = async () => {
      try {
        const response = await authService.getUserInfo()
        const { code, data } = response.data

        if (code === 200 && data) {
          currentUser.value = data
        }
      } catch (error) {
        console.error('检查登录状态失败:', error)
      }
    }

    // 用户登出
    const handleLogout = () => {
      ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await authService.logout()
          currentUser.value = null
          ElMessage.success('退出登录成功')
          // 跳转到登录页面
          router.push('/login')
        } catch (error) {
          console.error('登出失败:', error)
          ElMessage.error('登出失败')
        }
      }).catch(() => {
        // 取消登出
      })
    }

    // 页面加载时检查登录状态
    onMounted(() => {
      checkLoginStatus()
    })

    return {
      currentUser,
      handleLogout
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  height: 100vh;
}

.app-container {
  height: 100vh;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 20px;
}

.header-content h1 {
  font-size: 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-info {
  font-size: 14px;
  opacity: 0.9;
  display: flex;
  align-items: center;
}

.app-main {
  padding: 20px;
  background-color: #f5f7fa;
  overflow: auto;
}
</style>