<template>
  <div class="page">
    <div class="page-header"><h2>用户管理</h2><span class="page-subtitle">管理系统注册用户</span></div>
    <el-card shadow="hover" class="table-card">
      <div class="toolbar">
        <el-input v-model="keyword" placeholder="搜索用户名/昵称" style="width:260px" clearable @clear="fetchList" @keyup.enter="fetchList" size="large">
          <template #prefix><el-icon><Search /></el-icon></template>
        </el-input>
        <el-button type="primary" @click="fetchList" size="large">搜索</el-button>
      </div>
      <el-table :data="tableData" v-loading="loading" stripe style="width:100%">
        <el-table-column prop="id" label="ID" width="180" />
        <el-table-column prop="username" label="用户名" width="130" />
        <el-table-column prop="nickname" label="昵称" width="130" />
        <el-table-column prop="phone" label="手机号" width="140" />
        <el-table-column label="角色" width="90">
          <template #default="{ row }">
            <el-tag :type="row.role === 'ADMIN' ? 'danger' : 'info'" size="small" effect="dark" round>
              {{ row.role === 'ADMIN' ? '管理员' : '用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <span class="dot" :class="row.status === 1 ? 'off' : 'on'"></span>
            {{ row.status === 1 ? '已禁用' : '正常' }}
          </template>
        </el-table-column>
        <el-table-column prop="major" label="专业" min-width="130" />
        <el-table-column label="操作" width="170" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="showDetail(row)">详情</el-button>
            <el-popconfirm :title="row.status === 1 ? '确认启用？' : '确认禁用？'" @confirm="toggleStatus(row)">
              <template #reference>
                <el-button :type="row.status === 1 ? 'success' : 'danger'" link size="small">
                  {{ row.status === 1 ? '启用' : '禁用' }}
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="pager"><el-pagination v-model:current-page="current" :page-size="size" :total="total" layout="total, prev, pager, next" @current-change="fetchList" background /></div>
    </el-card>
    <el-dialog v-model="detailVisible" title="用户详情" width="520px" destroy-on-close>
      <el-descriptions :column="1" border v-if="detail" size="large">
        <el-descriptions-item label="ID">{{ detail.id }}</el-descriptions-item>
        <el-descriptions-item label="用户名">{{ detail.username }}</el-descriptions-item>
        <el-descriptions-item label="昵称">{{ detail.nickname }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ detail.phone || '-' }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ detail.email || '-' }}</el-descriptions-item>
        <el-descriptions-item label="专业">{{ detail.major || '-' }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ detail.gender === 1 ? '男' : detail.gender === 2 ? '女' : '未知' }}</el-descriptions-item>
        <el-descriptions-item label="签名">{{ detail.sign || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import request from '../../utils/request'

const current=ref(1),size=ref(10),total=ref(0),keyword=ref(''),loading=ref(false)
const tableData=ref([]),detailVisible=ref(false),detail=ref(null)
onMounted(()=>fetchList())

async function fetchList(){
  loading.value=true
  try{const r=await request.get('/user/list',{params:{current:current.value,size:size.value,keyword:keyword.value}});tableData.value=r.data||[]}finally{loading.value=false}
}
async function showDetail(row){try{const r=await request.get(`/user/${row.id}`);detail.value={...row,...r.data};detailVisible.value=true}catch(_){}}
async function toggleStatus(row){const ns=row.status===1?0:1;try{await request.put(`/user/${row.id}/status`,{status:ns});row.status=ns;ElMessage.success(ns===1?'已禁用':'已启用')}catch(_){}}
</script>

<style scoped>
.page { animation: fadeIn .35s ease; }
.page-header { margin-bottom: 20px; }
.page-header h2 { margin: 0; font-size: 20px; color: #1a1a2e; }
.page-subtitle { font-size: 13px; color: #999; }
.table-card { border-radius: 12px; }
.toolbar { display: flex; gap: 12px; margin-bottom: 16px; }
.pager { display: flex; justify-content: flex-end; margin-top: 16px; }
.dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; margin-right: 5px; vertical-align: middle; }
.dot.on { background: #52c41a; box-shadow: 0 0 5px #52c41a66; }
.dot.off { background: #ff4d4f; box-shadow: 0 0 5px #ff4d4f66; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
</style>
