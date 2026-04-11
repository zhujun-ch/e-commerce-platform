<template>
  <div class="profile-view">
    <div class="profile-header">
      <h1 class="profile-title">个人中心</h1>
    </div>

    <div v-loading="loading" class="profile-content">
      <div class="profile-card">
        <div class="user-header">
          <div class="user-avatar">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <circle cx="12" cy="8" r="4"/>
              <path d="M20 21a8 8 0 10-16 0"/>
            </svg>
          </div>
          <div class="user-info">
            <h2 class="user-name">{{ authStore.user?.name || '用户' }}</h2>
            <span class="user-email">{{ authStore.user?.email }}</span>
          </div>
        </div>

        <div class="user-stats">
          <div class="stat-item">
            <span class="stat-value">{{ formatDate(authStore.user?.created_at) }}</span>
            <span class="stat-label">注册时间</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">{{ authStore.user?.role || '普通用户' }}</span>
            <span class="stat-label">账户类型</span>
          </div>
        </div>
      </div>

      <div class="profile-card">
        <h3 class="card-title">修改个人信息</h3>
        <form @submit.prevent="handleUpdate" class="profile-form">
          <div class="form-group">
            <label class="form-label">姓名</label>
            <div class="input-wrapper" :class="{ focus: nameFocus, error: errors.name }">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="8" r="4"/>
                <path d="M20 21a8 8 0 10-16 0"/>
              </svg>
              <input
                v-model="form.name"
                type="text"
                class="form-input"
                placeholder="请输入姓名"
                @focus="nameFocus = true"
                @blur="nameFocus = false; validateName()"
              />
            </div>
            <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
          </div>

          <button type="submit" class="submit-btn" :class="{ loading: submitting }" :disabled="submitting">
            <span v-if="!submitting">保存修改</span>
            <span v-else class="loading-spinner"></span>
          </button>
        </form>
      </div>
    </div>
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
const nameFocus = ref(false)

const form = reactive({
  name: ''
})

const errors = reactive({
  name: ''
})

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

function validateName() {
  if (!form.name) {
    errors.name = '请输入姓名'
  } else {
    errors.name = ''
  }
}

async function handleUpdate() {
  validateName()
  if (errors.name) return

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

.profile-header {
  margin-bottom: var(--space-xl);
}

.profile-title {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

/* User Card */
.profile-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
}

.user-header {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--space-lg);
}

.user-avatar {
  width: 72px;
  height: 72px;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent-gold);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.user-name {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.user-email {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.user-stats {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.stat-value {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: var(--color-border);
}

/* Form Card */
.card-title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: var(--space-lg);
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  letter-spacing: 0.05em;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: var(--color-text-muted);
  pointer-events: none;
  transition: color var(--transition-fast);
}

.input-wrapper.focus .input-icon {
  color: var(--color-accent-gold);
}

.form-input {
  width: 100%;
  height: 48px;
  padding: 0 16px 0 48px;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  font-size: 0.95rem;
  transition: all var(--transition-base);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-accent-gold);
  box-shadow: 0 0 0 3px rgba(201, 169, 98, 0.1);
}

.input-wrapper.error .form-input {
  border-color: var(--color-error);
}

.error-text {
  font-size: 0.8rem;
  color: var(--color-error);
}

.submit-btn {
  height: 48px;
  background: linear-gradient(135deg, var(--color-accent-gold) 0%, var(--color-accent-gold-dark) 100%);
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-bg-primary);
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all var(--transition-base);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(201, 169, 98, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(15, 15, 15, 0.3);
  border-top-color: var(--color-bg-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
