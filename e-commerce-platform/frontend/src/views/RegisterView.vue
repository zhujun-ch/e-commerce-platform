<template>
  <div class="register-view">
    <div class="register-container">
      <div class="register-card">
        <div class="card-header">
          <router-link to="/" class="back-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </router-link>
          <div class="brand-mark">
            <span class="brand-text">LUXE</span>
          </div>
        </div>

        <div class="card-body">
          <h1 class="title">创建账户</h1>
          <p class="subtitle">加入我们，开始品质之旅</p>

          <form @submit.prevent="handleSubmit" class="register-form">
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
                  placeholder="请输入您的姓名"
                  @focus="nameFocus = true"
                  @blur="nameFocus = false; validateName()"
                />
              </div>
              <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">邮箱地址</label>
              <div class="input-wrapper" :class="{ focus: emailFocus, error: errors.email }">
                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  v-model="form.email"
                  type="email"
                  class="form-input"
                  placeholder="请输入邮箱"
                  @focus="emailFocus = true"
                  @blur="emailFocus = false; validateEmail()"
                />
              </div>
              <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">密码</label>
              <div class="input-wrapper" :class="{ focus: passwordFocus, error: errors.password }">
                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="创建密码（至少6位）"
                  @focus="passwordFocus = true"
                  @blur="passwordFocus = false; validatePassword()"
                />
                <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                  <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
              <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
            </div>

            <div class="form-terms">
              <label class="agree-terms">
                <input type="checkbox" v-model="agreeTerms" />
                <span class="checkmark"></span>
                <span>我已阅读并同意 <a href="#">《服务条款》</a> 和 <a href="#">《隐私政策》</a></span>
              </label>
            </div>

            <button type="submit" class="submit-btn" :class="{ loading }" :disabled="loading || !agreeTerms">
              <span v-if="!loading">创建账户</span>
              <span v-else class="loading-spinner"></span>
            </button>
          </form>
        </div>

        <div class="card-footer">
          <span>已有账号？</span>
          <router-link to="/login" class="login-link">立即登录</router-link>
        </div>
      </div>

      <div class="register-decoration">
        <div class="deco-content">
          <div class="deco-features">
            <div class="feature-item">
              <div class="feature-icon">✦</div>
              <span>品质保障</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">✦</div>
              <span>精选好物</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">✦</div>
              <span>专属服务</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../api/auth'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const showPassword = ref(false)
const agreeTerms = ref(false)
const nameFocus = ref(false)
const emailFocus = ref(false)
const passwordFocus = ref(false)

const form = reactive({
  name: '',
  email: '',
  password: ''
})

const errors = reactive({
  name: '',
  email: '',
  password: ''
})

function validateName() {
  if (!form.name) {
    errors.name = '请输入姓名'
  } else {
    errors.name = ''
  }
}

function validateEmail() {
  if (!form.email) {
    errors.email = '请输入邮箱'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = '请输入正确的邮箱格式'
  } else {
    errors.email = ''
  }
}

function validatePassword() {
  if (!form.password) {
    errors.password = '请输入密码'
  } else if (form.password.length < 6) {
    errors.password = '密码至少6位'
  } else {
    errors.password = ''
  }
}

async function handleSubmit() {
  validateName()
  validateEmail()
  validatePassword()

  if (errors.name || errors.email || errors.password) return

  loading.value = true
  try {
    const data = await authAPI.register(form)
    authStore.setAuth(data.token, data.user)
    ElMessage.success('注册成功')
    router.push('/')
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-view {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl) 0;
}

.register-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2xl);
  max-width: 1000px;
  width: 100%;
}

.register-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
}

.back-link {
  color: var(--color-text-muted);
  transition: color var(--transition-fast);
}

.back-link:hover {
  color: var(--color-accent-gold);
}

.brand-mark {
  display: flex;
  align-items: center;
}

.brand-text {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.3em;
  color: var(--color-accent-gold);
}

.card-body {
  padding: var(--space-xl);
}

.title {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: var(--space-xs);
}

.subtitle {
  color: var(--color-text-muted);
  margin-bottom: var(--space-xl);
}

.register-form {
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
  height: 52px;
  padding: 0 48px;
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

.toggle-password {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--transition-fast);
}

.toggle-password:hover {
  color: var(--color-accent-gold);
}

.form-terms {
  margin-top: var(--space-sm);
}

.agree-terms {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  cursor: pointer;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  line-height: 1.4;
}

.agree-terms input {
  display: none;
}

.checkmark {
  width: 16px;
  height: 16px;
  min-width: 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  position: relative;
  transition: all var(--transition-fast);
  margin-top: 2px;
}

.agree-terms input:checked + .checkmark {
  background: var(--color-accent-gold);
  border-color: var(--color-accent-gold);
}

.agree-terms input:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 1px;
  width: 4px;
  height: 8px;
  border: solid var(--color-bg-primary);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.agree-terms a {
  color: var(--color-accent-gold);
}

.submit-btn {
  height: 52px;
  background: linear-gradient(135deg, var(--color-accent-gold) 0%, var(--color-accent-gold-dark) 100%);
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-bg-primary);
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  cursor: pointer;
  transition: all var(--transition-base);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(201, 169, 98, 0.4);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(15, 15, 15, 0.3);
  border-top-color: var(--color-bg-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.card-footer {
  padding: var(--space-lg);
  text-align: center;
  border-top: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.login-link {
  color: var(--color-accent-gold);
  margin-left: var(--space-xs);
  font-weight: 500;
}

/* Decoration */
.register-decoration {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2xl);
  position: relative;
  overflow: hidden;
}

.register-decoration::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 70% 30%, rgba(201, 169, 98, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 30% 70%, rgba(201, 169, 98, 0.08) 0%, transparent 50%);
}

.deco-content {
  position: relative;
}

.deco-features {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-family: var(--font-display);
  font-size: 1.25rem;
  color: var(--color-text-secondary);
}

.feature-icon {
  font-size: 1.5rem;
  color: var(--color-accent-gold);
}

@media (max-width: 768px) {
  .register-container {
    grid-template-columns: 1fr;
  }

  .register-decoration {
    display: none;
  }
}
</style>
