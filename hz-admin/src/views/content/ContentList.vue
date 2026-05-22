<template>
  <div class="page">
    <div class="page-header"><h2>内容管理</h2><span class="page-subtitle">管理所有校园互助内容</span></div>
    <el-card shadow="hover" class="table-card">
      <div class="toolbar">
        <el-input v-model="keyword" placeholder="搜索关键词" style="width:260px" clearable @clear="fetchList" @keyup.enter="fetchList" size="large">
          <template #prefix><el-icon><Search /></el-icon></template>
        </el-input>
        <el-button type="primary" @click="fetchList" size="large">搜索</el-button>
      </div>
      <el-table :data="tableData" v-loading="loading" stripe style="width:100%">
        <el-table-column label="类型" width="90">
          <template #default="{ row }">
            <el-tag :style="{ background: typeBgColor(row.type), color: '#333', border: 'none' }" size="small" round>{{ typeLabel(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" width="180" />
        <el-table-column prop="title" label="标题" min-width="160"><template #default="{row}">{{ row.title || '-' }}</template></el-table-column>
        <el-table-column prop="description" label="内容" min-width="220" show-overflow-tooltip />
        <el-table-column prop="nickname" label="发布者" width="110" />
        <el-table-column prop="commentCount" label="评论" width="70" align="center">
          <template #default="{row}"><span class="cnt-badge blue">{{ row.commentCount }}</span></template>
        </el-table-column>
        <el-table-column prop="likeCount" label="点赞" width="70" align="center">
          <template #default="{row}"><span class="cnt-badge red">{{ row.likeCount }}</span></template>
        </el-table-column>
        <el-table-column prop="createTime" label="发布时间" width="175" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="showDetail(row)">查看</el-button>
            <el-popconfirm title="确认删除？" @confirm="handleDelete(row)">
              <template #reference><el-button type="danger" link size="small">删除</el-button></template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="pager"><el-pagination v-model:current-page="current" :page-size="size" :total="total" layout="total, prev, pager, next" @current-change="fetchList" background /></div>
    </el-card>
    <el-dialog v-model="detailVisible" title="内容详情" width="600px" destroy-on-close>
      <el-descriptions :column="2" border v-if="detail" size="large">
        <el-descriptions-item label="ID">{{ detail.id }}</el-descriptions-item>
        <el-descriptions-item label="类型">{{ typeLabel(detail.type) }}</el-descriptions-item>
        <el-descriptions-item label="标题" :span="2">{{ detail.title || '-' }}</el-descriptions-item>
        <el-descriptions-item label="内容" :span="2">{{ detail.description || '-' }}</el-descriptions-item>
        <el-descriptions-item label="发布者">{{ detail.nickname || '-' }}</el-descriptions-item>
        <el-descriptions-item label="发布时间">{{ detail.createTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="评论数">{{ detail.commentCount }}</el-descriptions-item>
        <el-descriptions-item label="点赞数">{{ detail.likeCount }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import request from '../../utils/request'

const route = useRoute()
const current=ref(1),size=ref(10),total=ref(0),keyword=ref(''),loading=ref(false)
const tableData=ref([]),detailVisible=ref(false),detail=ref(null)
const contentType = ref(route.params.type || '')

watch(() => route.params.type, (val) => { contentType.value = val || ''; current.value = 1; fetchList() })
onMounted(()=>fetchList())

async function fetchList(){
  loading.value=true
  try{const r=await request.get('/content/list',{params:{current:current.value,size:size.value,type:contentType.value||undefined,keyword:keyword.value||undefined}});tableData.value=r.data||[]}finally{loading.value=false}
}
async function showDetail(row){try{const r=await request.get(`/content/${row.type.toLowerCase()}/${row.id}`);detail.value=r.data;detailVisible.value=true}catch(_){}}
async function handleDelete(row){try{await request.delete(`/content/${row.type.toLowerCase()}/${row.id}`);ElMessage.success('删除成功');fetchList()}catch(_){}}
function typeLabel(t){const m={HELP:'互助',HELP_ASK:'求助',HELP_OFFER:'帮忙',HOLE:'树洞',LOST:'失物招领',DYNAMIC:'校友圈'};return m[t]||t}
function typeBgColor(t){const m={HELP:'#f5d0d4',HELP_ASK:'#f5d0d4',HELP_OFFER:'#f0ddb8',HOLE:'#b8e8f0',LOST:'#b8e8d8',DYNAMIC:'#ece0c0'};return m[t]||'#e0e0e0'}
</script>

<style scoped>
.page { animation: fadeIn .35s ease; }
.page-header { margin-bottom: 20px; }
.page-header h2 { margin: 0; font-size: 20px; color: #1a1a2e; }
.page-subtitle { font-size: 13px; color: #999; }
.table-card { border-radius: 12px; }
.toolbar { display: flex; gap: 12px; margin-bottom: 16px; }
.pager { display: flex; justify-content: flex-end; margin-top: 16px; }
.cnt-badge { display: inline-block; min-width: 22px; padding: 1px 7px; border-radius: 10px; font-size: 12px; font-weight: 600; }
.cnt-badge.blue { background: #e6f4ff; color: #1677ff; }
.cnt-badge.red { background: #fff1f0; color: #ff4d4f; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
</style>
