<template>
  <div class="dashboard">
    <div class="page-header">
      <h2>仪表盘</h2>
      <span class="page-subtitle">校园互助数据概览</span>
    </div>

    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="(card, i) in statCards" :key="i">
        <div class="stat-card" :style="{ background: card.gradient }">
          <div class="stat-icon"><el-icon :size="26"><component :is="card.icon" /></el-icon></div>
          <div class="stat-info">
            <div class="stat-value">{{ card.value }}</div>
            <div class="stat-label">{{ card.label }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card shadow="hover" class="chart-card">
          <template #header><div class="card-title">内容类型分布</div></template>
          <div ref="pieChart" class="chart-box"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" class="chart-card">
          <template #header><div class="card-title">数据统计对比</div></template>
          <div ref="barChart" class="chart-box"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { User, Service, ChatSquare, DataLine, Picture, Star, Collection, Clock } from '@element-plus/icons-vue'
import request from '../utils/request'

const pieChart = ref(null), barChart = ref(null)
let pieInst = null, barInst = null

const statCards = ref([
  { label: '用户总数', value: 0, icon: User, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { label: '求助帖', value: 0, icon: Service, gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { label: '树洞', value: 0, icon: ChatSquare, gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { label: '失物招领', value: 0, icon: Picture, gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { label: '校友圈', value: 0, icon: DataLine, gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { label: '点赞', value: 0, icon: Star, gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
  { label: '评论', value: 0, icon: Clock, gradient: 'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)' },
  { label: '收藏', value: 0, icon: Collection, gradient: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' }
])

onMounted(async () => {
  try {
    const res = await request.get('/dashboard/stats')
    const d = res.data
    const keys = ['totalUsers','totalHelps','totalHoles','totalLosts','totalDynamics','totalLikes','totalComments','totalCollections']
    statCards.value.forEach((c, i) => c.value = d[keys[i]] || 0)
    await nextTick(); initCharts(d)
  } catch (_) {}
})

function initCharts(d) {
  pieInst = echarts.init(pieChart.value)
  pieInst.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { fontSize: 12 } },
    series: [{
      type: 'pie', radius: ['50%', '72%'], center: ['50%', '46%'],
      avoidLabelOverlap: false, itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 3 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 15, fontWeight: 'bold' } },
      data: [
        { value: d.totalHelps||0, name: '求助帖', itemStyle: { color: '#f5576c' } },
        { value: d.totalHoles||0, name: '树洞', itemStyle: { color: '#00f2fe' } },
        { value: d.totalLosts||0, name: '失物招领', itemStyle: { color: '#38f9d7' } },
        { value: d.totalDynamics||0, name: '校友圈', itemStyle: { color: '#fee140' } }
      ]
    }]
  })

  barInst = echarts.init(barChart.value)
  barInst.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: ['用户','求助','树洞','失物','校友圈','点赞','评论','收藏'] },
    yAxis: { type: 'value' },
    series: [{
      type: 'bar', barWidth: '45%',
      itemStyle: { borderRadius: 6 },
      data: [
        { value: d.totalUsers||0, itemStyle: { color: '#667eea' } },
        { value: d.totalHelps||0, itemStyle: { color: '#f5576c' } },
        { value: d.totalHoles||0, itemStyle: { color: '#00f2fe' } },
        { value: d.totalLosts||0, itemStyle: { color: '#38f9d7' } },
        { value: d.totalDynamics||0, itemStyle: { color: '#fee140' } },
        { value: d.totalLikes||0, itemStyle: { color: '#a18cd1' } },
        { value: d.totalComments||0, itemStyle: { color: '#d57eeb' } },
        { value: d.totalCollections||0, itemStyle: { color: '#8ec5fc' } }
      ]
    }]
  })
}

onUnmounted(() => { pieInst?.dispose(); barInst?.dispose() })
</script>

<style scoped>
.dashboard { animation: fadeIn .35s ease; }
.page-header { margin-bottom: 24px; }
.page-header h2 { margin: 0; font-size: 20px; color: #1a1a2e; }
.page-subtitle { font-size: 13px; color: #999; margin-top: 2px; display: block; }

.stat-row { margin-bottom: 24px; }
.stat-card {
  border-radius: 12px; padding: 20px 16px; margin-bottom: 18px;
  color: #fff; display: flex; align-items: center; gap: 14px;
  cursor: pointer; transition: transform .2s, box-shadow .2s;
  box-shadow: 0 4px 16px rgba(0,0,0,.08);
}
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.12); }
.stat-icon { opacity: .9; }
.stat-info { flex: 1; }
.stat-value { font-size: 26px; font-weight: 700; line-height: 1.2; }
.stat-label { font-size: 13px; opacity: .85; margin-top: 2px; }

.chart-row { margin-bottom: 20px; }
.chart-card { border-radius: 12px; }
.card-title { font-weight: 600; font-size: 15px; color: #333; }
.chart-box { width: 100%; height: 300px; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
</style>
