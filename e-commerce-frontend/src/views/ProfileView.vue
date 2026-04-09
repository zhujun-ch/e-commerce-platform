<template>
  <div class="profile-view">
    <h1>个人中心</h1>
    <el-card v-loading="loading">
      <el-descriptions :column="1" border v-if="authStore.user">
        <el-descriptions-item label="姓名">{{ authStore.user.name }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ authStore.user.email }}</el-descriptions-item>
        <el-descriptions-item label="角色">{{ authStore.user.role }}</el-descriptions-item>
        <el-descriptions-item label="注册时间">
          {{ new Date(authStore.user.created_at).toLocaleString() }}
        </el-descriptions-item>
      </el-descriptions>

      <el-divider />

      <h3>修改个人信息</h3>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleUpdate" :loading="submitting">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { authAPI } from '../api/auth'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'

const authStore = useAuthStore()

const loading = ref(false)
const submitting = ref(false)
const formRef = ref(null)

const form = reactive({
  name: ''
})

const rules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ]
}

async function handleUpdate() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    await authAPI.updateProfile(form)
    await authStore.fetchProfile()
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  if (authStore.user) {
    form.name = authStore.user.name || ''
  }
})
</script>

<style scoped>
.profile-view {
  max-width: 600px;
  margin: 0 auto;
}
h1 {
  margin-bottom: 20px;
}
h3 {
  margin: 15px 0;
}
</style>
