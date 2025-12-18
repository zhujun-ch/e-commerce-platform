<template>
  <div class="student-management">
    <!-- 操作栏 -->
    <el-card class="operation-card" shadow="hover">
      <div class="operation-bar">
        <el-button type="primary" @click="handleAdd" :icon="Plus">
          添加学生
        </el-button>
        <el-button @click="refreshData" :icon="Refresh">
          刷新
        </el-button>
        <div class="search-bar">
          <el-input
              v-model="searchKeyword"
              placeholder="搜索学生姓名或学号"
              :prefix-icon="Search"
              style="width: 300px"
              @input="handleSearch"
          />
        </div>
      </div>
    </el-card>

    <!-- 学生列表 -->
    <el-card class="student-list-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>学生列表</span>
          <el-tag type="primary">{{ filteredStudents.length }} 名学生</el-tag>
        </div>
      </template>

      <el-table
          :data="filteredStudents"
          v-loading="loading"
          style="width: 100%"
          :default-sort="{ prop: 'id', order: 'ascending' }"
      >
        <el-table-column prop="id" label="ID" width="80" sortable />
        <el-table-column prop="studentId" label="学号" width="120" sortable />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="gender" label="性别" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.gender === '男' ? 'primary' : 'danger'">
              {{ scope.row.gender }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" width="80" />
        <el-table-column prop="className" label="班级" width="150" />
        <el-table-column prop="major" label="专业" width="200" />
        <el-table-column prop="phone" label="电话" width="130" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="address" label="地址" min-width="200" show-overflow-tooltip />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)" :icon="Edit">
              编辑
            </el-button>
            <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.row)"
                :icon="Delete"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog
        :title="dialogTitle"
        v-model="dialogVisible"
        width="600px"
        :before-close="handleClose"
    >
      <el-form
          :model="form"
          :rules="rules"
          ref="formRef"
          label-width="100px"
          class="student-form"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学号" prop="studentId">
              <el-input v-model="form.studentId" placeholder="请输入学号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="form.gender">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input-number
                  v-model="form.age"
                  :min="15"
                  :max="30"
                  controls-position="right"
                  style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="班级" prop="className">
              <el-input v-model="form.className" placeholder="请输入班级" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业" prop="major">
              <el-input v-model="form.major" placeholder="请输入专业" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入电话" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>

        <el-form-item label="地址" prop="address">
          <el-input
              v-model="form.address"
              type="textarea"
              :rows="2"
              placeholder="请输入地址"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh, Search, Edit, Delete } from '@element-plus/icons-vue'
import axios from 'axios'

export default {
  name: 'StudentManagement',
  setup() {
    const students = ref([])
    const loading = ref(false)
    const dialogVisible = ref(false)
    const submitting = ref(false)
    const searchKeyword = ref('')
    const formRef = ref()
    const isEdit = ref(false)
    const currentEditId = ref(null)

    const form = reactive({
      studentId: '',
      name: '',
      gender: '男',
      age: 18,
      className: '',
      major: '',
      phone: '',
      email: '',
      address: ''
    })

    const rules = {
      studentId: [
        { required: true, message: '请输入学号', trigger: 'blur' }
      ],
      name: [
        { required: true, message: '请输入姓名', trigger: 'blur' }
      ],
      gender: [
        { required: true, message: '请选择性别', trigger: 'change' }
      ],
      age: [
        { required: true, message: '请输入年龄', trigger: 'blur' }
      ],
      className: [
        { required: true, message: '请输入班级', trigger: 'blur' }
      ],
      major: [
        { required: true, message: '请输入专业', trigger: 'blur' }
      ]
    }

    const dialogTitle = computed(() => isEdit.value ? '编辑学生信息' : '添加学生信息')

    const filteredStudents = computed(() => {
      if (!searchKeyword.value) return students.value
      const keyword = searchKeyword.value.toLowerCase()
      return students.value.filter(student =>
          student.name.toLowerCase().includes(keyword) ||
          student.studentId.toLowerCase().includes(keyword) ||
          student.className.toLowerCase().includes(keyword) ||
          student.major.toLowerCase().includes(keyword)
      )
    })

    // 获取学生列表
    const fetchStudents = async () => {
      loading.value = true
      try {
        const response = await axios.get('/api/student/list')
        if (response.data.code === 200) {
          students.value = response.data.data || []
        } else {
          ElMessage.error('获取学生列表失败：' + response.data.message)
        }
      } catch (error) {
        ElMessage.error('网络错误，请检查后端服务是否启动')
        console.error('Error fetching students:', error)
      } finally {
        loading.value = false
      }
    }

    // 添加学生
    const addStudent = async (studentData) => {
      try {
        const response = await axios.post('/api/student/add', studentData)
        return response.data.code === 200
      } catch (error) {
        console.error('Error adding student:', error)
        return false
      }
    }

    // 更新学生
    const updateStudent = async (studentData) => {
      try {
        const response = await axios.put('/api/student/update', studentData)
        return response.data.code === 200
      } catch (error) {
        console.error('Error updating student:', error)
        return false
      }
    }

    // 删除学生
    const deleteStudent = async (id) => {
      try {
        const response = await axios.delete(`/api/student/delete/${id}`)
        return response.data.code === 200
      } catch (error) {
        console.error('Error deleting student:', error)
        return false
      }
    }

    // 处理添加
    const handleAdd = () => {
      isEdit.value = false
      currentEditId.value = null
      Object.keys(form).forEach(key => {
        if (key === 'gender') {
          form[key] = '男'
        } else if (key === 'age') {
          form[key] = 18
        } else {
          form[key] = ''
        }
      })
      dialogVisible.value = true
    }

    // 处理编辑
    const handleEdit = (student) => {
      isEdit.value = true
      currentEditId.value = student.id
      Object.keys(form).forEach(key => {
        form[key] = student[key] || ''
      })
      dialogVisible.value = true
    }

    // 处理删除
    const handleDelete = async (student) => {
      try {
        await ElMessageBox.confirm(
            `确定要删除学生 "${student.name}" 吗？`,
            '警告',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }
        )

        const success = await deleteStudent(student.id)
        if (success) {
          ElMessage.success('删除成功')
          await fetchStudents()
        } else {
          ElMessage.error('删除失败')
        }
      } catch (error) {
        // 用户取消删除
      }
    }

    // 处理提交
    const handleSubmit = async () => {
      if (!formRef.value) return

      try {
        await formRef.value.validate()
        submitting.value = true

        const studentData = { ...form }
        if (isEdit.value) {
          studentData.id = currentEditId.value
        }

        const success = isEdit.value
            ? await updateStudent(studentData)
            : await addStudent(studentData)

        if (success) {
          ElMessage.success(isEdit.value ? '更新成功' : '添加成功')
          dialogVisible.value = false
          await fetchStudents()
        } else {
          ElMessage.error(isEdit.value ? '更新失败' : '添加失败')
        }
      } catch (error) {
        console.error('Form validation failed:', error)
      } finally {
        submitting.value = false
      }
    }

    // 处理关闭对话框
    const handleClose = () => {
      dialogVisible.value = false
      if (formRef.value) {
        formRef.value.resetFields()
      }
    }

    // 处理搜索
    const handleSearch = () => {
      // 搜索逻辑已经在computed属性中处理
    }

    // 刷新数据
    const refreshData = () => {
      fetchStudents()
      ElMessage.success('数据已刷新')
    }

    onMounted(() => {
      fetchStudents()
    })

    return {
      students,
      loading,
      dialogVisible,
      submitting,
      searchKeyword,
      form,
      rules,
      formRef,
      dialogTitle,
      filteredStudents,
      Plus,
      Refresh,
      Search,
      Edit,
      Delete,
      handleAdd,
      handleEdit,
      handleDelete,
      handleSubmit,
      handleClose,
      handleSearch,
      refreshData
    }
  }
}
</script>

<style scoped>
.student-management {
  max-width: 1400px;
  margin: 0 auto;
}

.operation-card {
  margin-bottom: 20px;
}

.operation-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  display: flex;
  gap: 10px;
}

.student-list-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.student-form {
  padding: 0 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.el-table {
  margin-top: 10px;
}

.el-table .el-button {
  margin-right: 5px;
}

.el-table .el-button:last-child {
  margin-right: 0;
}
</style>