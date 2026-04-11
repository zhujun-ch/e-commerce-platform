<template>
  <div class="login-view">
    <div class="login-container">
      <div class="login-card">
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
          <h1 class="title">欢迎回来</h1>
          <p class="subtitle">登录您的账户继续探索</p>

          <form @submit.prevent="handleSubmit" class="login-form">
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
                  placeholder="请输入密码"
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

            <div class="form-options">
              <label class="remember-me">
                <input type="checkbox" v-model="rememberMe" />
                <span class="checkmark"></span>
                <span>记住我</span>
              </label>
              <a href="#" class="forgot-link">忘记密码？</a>
            </div>

            <button type="submit" class="submit-btn" :class="{ loading }" :disabled="loading">
              <span v-if="!loading">登 录</span>
              <span v-else class="loading-spinner"></span>
            </button>
          </form>

          <div class="divider">
            <span>或</span>
          </div>

          <div class="social-login">
            <button class="social-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
              </svg>
            </button>
            <button class="social-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="card-footer">
          <span>还没有账号？</span>
          <router-link to="/register" class="register-link">立即注册</router-link>
        </div>
      </div>

      <div class="login-decoration">
        <div class="deco-content">
          <blockquote class="deco-quote">
            "品质不在于昂贵，而在于对细节的执着"
          </blockquote>
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
import { useCartStore } from '../stores/cart'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const loading = ref(false)
const showPassword = ref(false)
const rememberMe = ref(false)
const emailFocus = ref(false)
const passwordFocus = ref(false)

const form = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: ''
})

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
  validateEmail()
  validatePassword()

  if (errors.email || errors.password) return

  loading.value = true
  try {
    const data = await authAPI.login(form)
    authStore.setAuth(data.token, data.user)
    await cartStore.fetchCart()
    ElMessage.success('登录成功')
    router.push('/')
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-view {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl) 0;
}

.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2xl);
  max-width: 1000px;
  width: 100%;
}

.login-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

/* Header */
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

/* Body */
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

/* Form */
.login-form {
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

.input-wrapper.error .input-icon {
  color: var(--color-error);
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

.error-text {
  font-size: 0.8rem;
  color: var(--color-error);
}

/* Options */
.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.remember-me input {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  position: relative;
  transition: all var(--transition-fast);
}

.remember-me input:checked + .checkmark {
  background: var(--color-accent-gold);
  border-color: var(--color-accent-gold);
}

.remember-me input:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 5px;
  height: 9px;
  border: solid var(--color-bg-primary);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.forgot-link {
  font-size: 0.875rem;
  color: var(--color-accent-gold);
}

/* Submit */
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
  opacity: 0.7;
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

/* Divider */
.divider {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin: var(--space-lg) 0;
  color: var(--color-text-muted);
  font-size: 0.8rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

/* Social */
.social-login {
  display: flex;
  justify-content: center;
  gap: var(--space-md);
}

.social-btn {
  width: 48px;
  height: 48px;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.social-btn:hover {
  border-color: var(--color-accent-gold);
  color: var(--color-accent-gold);
}

/* Footer */
.card-footer {
  padding: var(--space-lg);
  text-align: center;
  border-top: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.register-link {
  color: var(--color-accent-gold);
  margin-left: var(--space-xs);
  font-weight: 500;
}

/* Decoration */
.login-decoration {
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

.login-decoration::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 20%, rgba(201, 169, 98, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 80%, rgba(201, 169, 98, 0.08) 0%, transparent 50%);
}

.deco-content {
  position: relative;
  text-align: center;
}

.deco-quote {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 400;
  font-style: italic;
  color: var(--color-text-secondary);
  line-height: 1.5;
  max-width: 300px;
}

/* Responsive */
@media (max-width: 768px) {
  .login-container {
    grid-template-columns: 1fr;
  }

  .login-decoration {
    display: none;
  }
}
</style>
