<template>
  <div class="page">
    <div class="page-header"><h2>公告管理</h2><span class="page-subtitle">推送系统公告给所有用户</span></div>

    <!-- 发布公告卡片 -->
    <el-card shadow="hover" class="create-card">
      <template #header><span class="card-title">发布新公告</span></template>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="60px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入公告标题" maxlength="100" show-word-limit size="large" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="3" placeholder="请输入公告内容" maxlength="500" show-word-limit size="large" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="handleCreate" size="large">发布公告</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 已有公告列表 -->
    <el-card shadow="hover" class="table-card" style="margin-top:20px">
      <template #header><span class="card-title">历史公告</span></template>
      <el-table :data="tableData" v-loading="loading" stripe style="width:100%">
        <el-table-column prop="id" label="ID" width="180" />
        <el-table-column prop="title" label="标题" min-width="180" />
        <el-table-column prop="content" label="内容" min-width="280" show-overflow-tooltip />
        <el-table-column prop="createTime" label="发布时间" width="175" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-popconfirm title="确认删除？" @confirm="handleDelete(row)">
              <template #reference><el-button type="danger" link size="small">删除</el-button></template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="pager">
        <el-pagination v-model:current-page="current" :page-size="size" :total="total"
                       layout="total, prev, pager, next" @current-change="fetchList" background />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '../../utils/request'

const current = ref(1), size = ref(10), total = ref(0), loading = ref(false), submitting = ref(false)
const tableData = ref([]), formRef = ref(null)

const form = reactive({ title: '', content: '' })
const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
}

onMounted(() => fetchList())

async function fetchList() {
  loading.value = true
  try {
    const r = await request.get('/announcement/list', { params: { current: current.value, size: size.value } })
    const d = r.data
    tableData.value = d.records || []
    total.value = d.total || 0
  } finally { loading.value = false }
}

async function handleCreate() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    await request.post('/announcement/create', { title: form.title, content: form.content })
    ElMessage.success('公告已发布')
    form.title = ''; form.content = ''
    fetchList()
  } catch (_) { /* handled */ }
  finally { submitting.value = false }
}

async function handleDelete(row) {
  try {
    await request.delete(`/announcement/${row.id}`)
    ElMessage.success('已删除')
    fetchList()
  } catch (_) { /* handled */ }
}
</script>

<style scoped>
.page { animation: fadeIn .35s ease; }
.page-header { margin-bottom: 20px; }
.page-header h2 { margin: 0; font-size: 20px; color: #1a1a2e; }
.page-subtitle { font-size: 13px; color: #999; }
.create-card, .table-card { border-radius: 12px; }
.card-title { font-weight: 600; font-size: 15px; color: #333; }
.pager { display: flex; justify-content: flex-end; margin-top: 16px; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
</style>
