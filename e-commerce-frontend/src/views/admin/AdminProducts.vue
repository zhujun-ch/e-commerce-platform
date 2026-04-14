<template>
  <div class="products-admin">
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
          placeholder="搜索商品..."
          @keyup.enter="handleSearch"
        />
      </div>
      <select v-model="categoryFilter" class="filter-select" @change="fetchProducts">
        <option value="">全部分类</option>
        <option value="electronics">电子产品</option>
        <option value="clothing">服装</option>
        <option value="shoes">鞋履</option>
        <option value="accessories">配饰</option>
      </select>
      <button class="add-btn" @click="showAddDialog = true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        新增商品
      </button>
    </div>

    <div class="table-card">
      <el-table
        v-loading="loading"
        :data="products"
        style="width: 100%"
        class="products-table"
      >
        <el-table-column label="商品信息" min-width="200">
          <template #default="{ row }">
            <div class="product-cell">
              <span class="product-name">{{ row.name }}</span>
              <span class="product-desc">{{ row.description?.slice(0, 40) }}...</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="分类" width="120">
          <template #default="{ row }">
            <span class="category-tag">{{ getCategoryLabel(row.category) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="价格" width="120">
          <template #default="{ row }">
            <span class="price">¥{{ Number(row.price).toFixed(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="库存" width="100">
          <template #default="{ row }">
            <span class="stock" :class="{ low: row.stock < 10 }">{{ row.stock }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <button class="action-btn edit" @click="openEditDialog(row)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button class="action-btn delete" @click="deleteProduct(row.id)">
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
          @current-change="fetchProducts"
        />
      </div>
    </div>

    <!-- Add/Edit Product Dialog -->
    <el-dialog
      v-model="showAddDialog"
      :title="editingProduct ? '编辑商品' : '新增商品'"
      width="500px"
      class="product-dialog"
      :close-on-click-modal="false"
    >
      <form @submit.prevent="submitProduct" class="product-form">
        <div class="form-group">
          <label class="form-label">商品名称 *</label>
          <input
            v-model="productForm.name"
            type="text"
            class="form-input"
            placeholder="请输入商品名称"
            required
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">分类 *</label>
            <select v-model="productForm.category" class="form-select" required>
              <option value="">选择分类</option>
              <option value="electronics">电子产品</option>
              <option value="clothing">服装</option>
              <option value="shoes">鞋履</option>
              <option value="accessories">配饰</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">价格 *</label>
            <input
              v-model.number="productForm.price"
              type="number"
              step="0.01"
              min="0"
              class="form-input"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">库存 *</label>
          <input
            v-model.number="productForm.stock"
            type="number"
            min="0"
            class="form-input"
            placeholder="0"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">商品图片URL</label>
          <input
            v-model="productForm.image_url"
            type="url"
            class="form-input"
            placeholder="https://..."
          />
        </div>

        <div class="form-group">
          <label class="form-label">商品描述</label>
          <textarea
            v-model="productForm.description"
            class="form-textarea"
            rows="3"
            placeholder="请输入商品描述..."
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="closeDialog">取消</button>
          <button type="submit" class="submit-btn" :disabled="submitting">
            {{ submitting ? '提交中...' : (editingProduct ? '保存修改' : '创建商品') }}
          </button>
        </div>
      </form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { productAPI } from '../../api/product'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCategoryLabel } from '../../utils/categories'

const loading = ref(false)
const products = ref([])
const searchKeyword = ref('')
const categoryFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const showAddDialog = ref(false)
const editingProduct = ref(null)
const submitting = ref(false)

const productForm = reactive({
  name: '',
  category: '',
  price: null,
  stock: null,
  image_url: '',
  description: ''
})

function resetForm() {
  productForm.name = ''
  productForm.category = ''
  productForm.price = null
  productForm.stock = null
  productForm.image_url = ''
  productForm.description = ''
  editingProduct.value = null
}

function openEditDialog(product) {
  editingProduct.value = product
  productForm.name = product.name
  productForm.category = product.category || ''
  productForm.price = Number(product.price)
  productForm.stock = product.stock || 0
  productForm.image_url = product.image_url || ''
  productForm.description = product.description || ''
  showAddDialog.value = true
}

function closeDialog() {
  showAddDialog.value = false
  resetForm()
}

async function submitProduct() {
  if (!productForm.name || !productForm.category || !productForm.price || productForm.stock === null) {
    ElMessage.warning('请填写必填项')
    return
  }

  submitting.value = true
  try {
    const data = {
      name: productForm.name,
      category: productForm.category,
      price: productForm.price,
      stock: productForm.stock,
      image_url: productForm.image_url || undefined,
      description: productForm.description || undefined
    }

    if (editingProduct.value) {
      await productAPI.updateProduct(editingProduct.value.id, data)
      ElMessage.success('商品已更新')
    } else {
      await productAPI.createProduct(data)
      ElMessage.success('商品已创建')
    }
    closeDialog()
    fetchProducts()
  } catch (error) {
    ElMessage.error(error.response?.data?.error || '操作失败')
  } finally {
    submitting.value = false
  }
}

function handleSearch() {
  currentPage.value = 1
  fetchProducts()
}

async function fetchProducts() {
  loading.value = true
  try {
    const params = {
      category: categoryFilter.value || undefined,
      search: searchKeyword.value || undefined,
      page: currentPage.value,
      pageSize: pageSize.value
    }
    const data = await productAPI.getProducts(params)
    products.value = data.products || []
    total.value = data.total || 0
  } catch (error) {
    console.error('Failed to fetch products:', error)
    ElMessage.error('获取商品列表失败')
  } finally {
    loading.value = false
  }
}

async function deleteProduct(id) {
  try {
    await ElMessageBox.confirm('确定要删除此商品吗？此操作不可撤销。', '删除商品', {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await productAPI.deleteProduct(id)
    ElMessage.success('商品已删除')
    fetchProducts()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.response?.data?.error || '删除失败')
    }
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.products-admin {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.page-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-lg);
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  transition: color var(--transition-fast);
}

.search-box:focus-within .search-icon {
  color: var(--color-accent-gold);
}

.search-input {
  width: 100%;
  height: 48px;
  padding: 0 16px 0 48px;
  background: rgba(20, 20, 24, 0.8);
  border: 1px solid rgba(201, 169, 98, 0.1);
  border-radius: var(--radius-lg);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  font-size: 0.9rem;
  transition: all var(--transition-base);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-accent-gold);
  box-shadow: 0 0 0 3px rgba(201, 169, 98, 0.08);
}

.filter-select {
  height: 48px;
  min-width: 140px;
  padding: 0 var(--space-lg);
  background: rgba(20, 20, 24, 0.8);
  border: 1px solid rgba(201, 169, 98, 0.1);
  border-radius: var(--radius-lg);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-accent-gold);
}

.add-btn {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  height: 48px;
  padding: 0 var(--space-xl);
  background: linear-gradient(135deg, var(--color-accent-gold) 0%, var(--color-accent-gold-dark) 100%);
  border: none;
  border-radius: var(--radius-lg);
  color: var(--color-bg-primary);
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base);
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(201, 169, 98, 0.3);
}

.table-card {
  background: rgba(20, 20, 24, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(201, 169, 98, 0.1);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.product-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.product-desc {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.category-tag {
  padding: 4px 12px;
  background: rgba(201, 169, 98, 0.1);
  border-radius: var(--radius-xl);
  font-size: 0.75rem;
  color: var(--color-accent-gold);
}

.price {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-accent-gold);
}

.stock {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.stock.low {
  color: var(--color-error);
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: var(--space-sm);
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(201, 169, 98, 0.15);
  background: rgba(201, 169, 98, 0.05);
  color: var(--color-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
}

.action-btn:hover {
  border-color: var(--color-accent-gold);
  color: var(--color-accent-gold);
  background: rgba(201, 169, 98, 0.1);
  transform: translateY(-2px);
}

.action-btn.delete:hover {
  border-color: var(--color-error);
  color: var(--color-error);
  background: rgba(212, 115, 110, 0.1);
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: var(--space-lg);
  border-top: 1px solid rgba(201, 169, 98, 0.08);
}

/* Dialog Form Styles */
.product-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.form-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  letter-spacing: 0.05em;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: var(--space-md);
  background: rgba(26, 26, 31, 0.8);
  border: 1px solid rgba(201, 169, 98, 0.15);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  font-size: 0.9rem;
  transition: all var(--transition-fast);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-accent-gold);
  box-shadow: 0 0 0 3px rgba(201, 169, 98, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-select {
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-md);
  margin-top: var(--space-md);
}

.cancel-btn {
  padding: var(--space-md) var(--space-xl);
  background: transparent;
  border: 1px solid rgba(201, 169, 98, 0.2);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  font-family: var(--font-body);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.cancel-btn:hover {
  border-color: var(--color-accent-gold);
  color: var(--color-accent-gold);
}

.submit-btn {
  padding: var(--space-md) var(--space-xl);
  background: linear-gradient(135deg, var(--color-accent-gold) 0%, var(--color-accent-gold-dark) 100%);
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-bg-primary);
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(201, 169, 98, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

<style>
/* Global dialog styles */
.product-dialog .el-dialog {
  background: rgba(20, 20, 24, 0.95);
  border: 1px solid rgba(201, 169, 98, 0.15);
  border-radius: var(--radius-xl);
}

.product-dialog .el-dialog__header {
  border-bottom: 1px solid rgba(201, 169, 98, 0.1);
  padding: var(--space-lg) var(--space-xl);
}

.product-dialog .el-dialog__title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  color: var(--color-text-primary);
}

.product-dialog .el-dialog__body {
  padding: var(--space-xl);
}

.product-dialog .el-dialog__headerbtn .el-dialog__close {
  color: var(--color-text-muted);
}

.product-dialog .el-dialog__headerbtn:hover .el-dialog__close {
  color: var(--color-accent-gold);
}
</style>
