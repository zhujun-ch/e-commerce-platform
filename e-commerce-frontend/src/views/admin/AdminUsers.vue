<template>
  <div class="users-admin">
    <div class="page-actions">
      <div class="search-box">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          v-model="searchKeyword"
          type="text"
          class="search-input"
          placeholder="搜索用户..."
          @keyup.enter="handleSearch"
        />
      </div>
    </div>

    <div class="table-card">
      <el-table
        v-loading="loading"
        :data="users"
        style="width: 100%"
        class="users-table"
      >
        <el-table-column label="用户信息" min-width="200">
          <template #default="{ row }">
            <div class="user-cell">
              <span class="user-name">{{ row.name }}</span>
              <span class="user-email">{{ row.email }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="角色" width="100">
          <template #default="{ row }">
            <span class="role-badge" :class="row.role">
              {{ row.role === 'admin' ? '管理员' : '用户' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="注册时间" width="140">
          <template #default="{ row }">
            <span class="reg-time">{{ formatTime(row.created_at) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <button
                v-if="row.role !== 'admin'"
                class="action-btn admin"
                @click="setAdmin(row)"
                title="设为管理员"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </button>
              <button class="action-btn delete" @click="deleteUser(row.id)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                </svg>
              </button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
          @current-change="fetchUsers"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { authAPI } from '../../api/auth'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const users = ref([])
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

function formatTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN')
}

function handleSearch() {
  currentPage.value = 1
  fetchUsers()
}

async function fetchUsers() {
  loading.value = true
  try {
    const data = await authAPI.getUsers()
    let allUsers = data.users || []

    if (searchKeyword.value) {
      const kw = searchKeyword.value.toLowerCase()
      allUsers = allUsers.filter(u =>
        u.name.toLowerCase().includes(kw) ||
        u.email.toLowerCase().includes(kw)
      )
    }

    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    users.value = allUsers.slice(start, end)
    total.value = allUsers.length
  } catch (error) {
    console.error('Failed to fetch users:', error)
    users.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

async function setAdmin(user) {
  try {
    await ElMessageBox.confirm(`确定要将 ${user.name} 设为管理员吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await authAPI.updateUserRole(user.id, 'admin')
    ElMessage.success('已将用户设为管理员')
    fetchUsers()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.response?.data?.error || '操作失败')
    }
  }
}

async function deleteUser(id) {
  try {
    await ElMessageBox.confirm('确定要删除此用户吗? 此操作不可撤销。', '删除用户', {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await authAPI.deleteUser(id)
    ElMessage.success('用户已删除')
    fetchUsers()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.response?.data?.error || '删除失败')
    }
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.users-admin {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.page-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-lg);
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
}

.search-input {
  width: 100%;
  height: 44px;
  padding: 0 16px 0 48px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  font-size: 0.9rem;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-text-primary);
}

.table-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.user-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.user-email {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.role-badge {
  padding: 2px 10px;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
}

.role-badge.admin {
  background: rgba(201, 130, 110, 0.15);
  color: #c9826e;
}

.role-badge.user {
  background: var(--color-bg-elevated);
  color: var(--color-text-secondary);
}

.reg-time {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.action-buttons {
  display: flex;
  gap: var(--space-sm);
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.action-btn:hover {
  border-color: var(--color-text-primary);
  color: var(--color-text-primary);
}

.action-btn.admin:hover {
  border-color: #c9826e;
  color: #c9826e;
}

.action-btn.delete:hover {
  border-color: var(--color-error);
  color: var(--color-error);
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: var(--space-lg);
  border-top: 1px solid var(--color-border);
}
</style>
