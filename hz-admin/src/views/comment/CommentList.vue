<template>
  <div class="page">
    <div class="page-header"><h2>评论管理</h2><span class="page-subtitle">管理所有评论内容</span></div>
    <el-card shadow="hover" class="table-card">
      <div class="toolbar">
        <el-input v-model="keyword" placeholder="搜索评论内容" style="width:280px" clearable @clear="fetchList" @keyup.enter="fetchList" size="large">
          <template #prefix><el-icon><Search /></el-icon></template>
        </el-input>
        <el-button type="primary" @click="fetchList" size="large">搜索</el-button>
      </div>
      <el-table :data="tableData" v-loading="loading" stripe style="width:100%">
        <el-table-column prop="id" label="ID" width="180" />
        <el-table-column prop="content" label="内容" min-width="280" show-overflow-tooltip />
        <el-table-column prop="createUser" label="用户ID" width="180" />
        <el-table-column label="层级" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.parentId ? 'warning' : 'info'" size="small" effect="dark" round>
              {{ row.parentId ? '回复' : '顶级' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="likeCount" label="点赞" width="70" align="center" />
        <el-table-column prop="createTime" label="时间" width="175" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-popconfirm title="确认删除？" @confirm="handleDelete(row)">
              <template #reference><el-button type="danger" link size="small">删除</el-button></template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="pager"><el-pagination v-model:current-page="current" :page-size="size" :total="total" layout="total, prev, pager, next" @current-change="fetchList" background /></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import request from '../../utils/request'

const current=ref(1),size=ref(10),total=ref(0),keyword=ref(''),loading=ref(false)
const tableData=ref([])
onMounted(()=>fetchList())

async function fetchList(){
  loading.value=true
  try{const r=await request.get('/comment/list',{params:{current:current.value,size:size.value,keyword:keyword.value||undefined}});const d=r.data;tableData.value=d.records||[];total.value=d.total||0}finally{loading.value=false}
}
async function handleDelete(row){try{await request.delete(`/comment/${row.id}`);ElMessage.success('删除成功');fetchList()}catch(_){}}
</script>

<style scoped>
.page { animation: fadeIn .35s ease; }
.page-header { margin-bottom: 20px; }
.page-header h2 { margin: 0; font-size: 20px; color: #1a1a2e; }
.page-subtitle { font-size: 13px; color: #999; }
.table-card { border-radius: 12px; }
.toolbar { display: flex; gap: 12px; margin-bottom: 16px; }
.pager { display: flex; justify-content: flex-end; margin-top: 16px; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
</style>
