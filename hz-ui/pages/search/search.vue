<template>
  <view class="container">
    <!-- 搜索输入栏 -->
    <view class="search-bar">
      <view class="search-input-wrap">
        <uni-icons type="search" size="18" color="#999"></uni-icons>
        <input
          class="search-input"
          v-model="keyword"
          placeholder="搜索互助信息..."
          :focus="true"
          confirm-type="search"
          @confirm="onSearch"
        />
        <uni-icons v-if="keyword" type="clear" size="18" color="#ccc" @click="clearSearch"></uni-icons>
      </view>
      <text class="search-cancel" @click="goBack">取消</text>
    </view>

    <!-- 类型筛选 -->
    <view class="tabs-wrap">
      <scroll-view scroll-x class="tabs-scroll" :show-scrollbar="false">
        <view class="tabs">
          <view v-for="tab in tabs" :key="tab.value" class="tab-item" :class="{'active': currentTab === tab.value}" @click="switchTab(tab.value)">
            <text class="tab-text">{{ tab.label }}</text>
            <view v-if="currentTab === tab.value" class="tab-bar"></view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 内容列表 -->
    <scroll-view class="result-scroll" scroll-y @scrolltolower="onReachBottom">
      <view class="result-list">
<view v-for="item in resultList" :key="item.type + '-' + item.id" class="result-card" @click="goToDetail(item)">
        <view class="card-header">
          <view class="type-tag" :style="{backgroundColor: getTypeColor(item.type)}">
            <text class="type-tag-text">{{ getTypeLabel(item.type) }}</text>
          </view>
          <text class="card-time">{{ formatTime(item.createTime) }}</text>
        </view>
        <text class="card-title" v-if="item.title">{{ item.title }}</text>
        <text class="card-desc">{{ item.content }}</text>
        <view class="card-images" v-if="item.images && item.images.length > 0">
          <image v-for="(img, i) in item.images.slice(0, 3)" :key="i" :src="img" class="card-image" mode="aspectFill" @click.stop="previewImage(item.images, i)"></image>
        </view>
      </view>

      <view v-if="searched && resultList.length === 0 && !loading" class="empty-state">
        <image src="/static/hole/empty.png" class="empty-img" mode="aspectFit"></image>
        <text class="empty-text">未找到相关内容</text>
        <text class="empty-sub">换个关键词试试吧~</text>
      </view>
      <view v-if="!searched && resultList.length === 0 && !loading" class="empty-state">
        <image src="/static/hole/empty.png" class="empty-img" mode="aspectFit"></image>
        <text class="empty-text">暂无内容</text>
        <text class="empty-sub">还没有人发过内容呢</text>
      </view>
      </view>
      <view v-if="loading" class="loading-wrap">
        <uni-load-more status="loading"></uni-load-more>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import request from '../../utils/request'

const tabs = [
  { label: '全部', value: '' },
  { label: '求助', value: 'help' },
  { label: '失物招领', value: 'lost' },
  { label: '树洞', value: 'hole' },
  { label: '校友圈', value: 'alumni' }
]

const keyword = ref('')
const currentTab = ref('')
const resultList = ref([])
const loading = ref(false)
const searched = ref(false)
const page = reactive({ current: 1, size: 10 })

const typeLabelMap = { help: '求助', lost: '失物', hole: '树洞', alumni: '校友圈' }
const typeColorMap = { help: '#FF9500', lost: '#007AFF', hole: '#AF52DE', alumni: '#FF2D55' }
const typeDetailPathMap = { help: '/pages/help/detail', lost: '/pages/lost/detail', hole: '/pages/hole/detail', alumni: '/pages/alumni/detail' }

const getTypeLabel = (t) => typeLabelMap[t] || '其他'
const getTypeColor = (t) => typeColorMap[t] || '#999'

const formatTime = (time) => {
  if (!time) return ''
  const d = new Date(time)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  if (diff < 604800000) return Math.floor(diff / 86400000) + '天前'
  return d.getMonth() + 1 + '-' + d.getDate()
}

const switchTab = (tab) => {
  if (currentTab.value === tab) return
  currentTab.value = tab
  if (!keyword.value.trim()) searched.value = false
  doSearch(true)
}

const clearSearch = () => {
  keyword.value = ''
  searched.value = false
  doSearch(true)
}

const goBack = () => { uni.navigateBack() }

onMounted(() => { doSearch(true) })

const onSearch = () => { searched.value = true; doSearch(true) }

const doSearch = async (refresh = false) => {
  if (loading.value) return
  loading.value = true
  searched.value = true
  if (refresh) { page.current = 1; resultList.value = [] }
  try {
    const res = await request.post('/search', {
      keyword: keyword.value.trim(),
      type: currentTab.value,
      current: page.current,
      size: page.size
    })
    if (res.code === 0) {
      const data = res.data || []
      if (refresh) resultList.value = data
      else resultList.value = [...resultList.value, ...data]
      if (data.length >= page.size) page.current++
    }
  } catch (e) { console.error('搜索失败', e) }
  finally { loading.value = false }
}

const onReachBottom = () => {
  if (!loading.value && resultList.value.length > 0) doSearch(false)
}

const goToDetail = (item) => {
  const path = typeDetailPathMap[item.type] || '/pages/help/detail'
  uni.navigateTo({ url: path + '?id=' + item.id })
}

const previewImage = (images, current) => {
  uni.previewImage({ urls: images, current })
}
</script>

<style scoped>
.container { min-height: 100vh; background: #f5f5f5; display: flex; flex-direction: column; }
.search-bar { display: flex; align-items: center; padding: 20rpx 30rpx; background: #fff; }
.search-input-wrap { flex: 1; display: flex; align-items: center; background: #f5f5f5; border-radius: 50rpx; padding: 16rpx 24rpx; }
.search-input { flex: 1; margin: 0 16rpx; font-size: 28rpx; color: #333; }
.search-cancel { font-size: 28rpx; color: #007AFF; margin-left: 20rpx; }
.tabs-wrap { background: #fff; padding-bottom: 6rpx; box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.03); }
.tabs-scroll { white-space: nowrap; }
.tabs { display: flex; padding: 0 20rpx; }
.tab-item { display: inline-flex; flex-direction: column; align-items: center; padding: 20rpx 30rpx; position: relative; }
.tab-text { font-size: 28rpx; color: #666; }
.tab-item.active .tab-text { color: #007AFF; font-weight: bold; }
.tab-bar { position: absolute; bottom: 4rpx; width: 32rpx; height: 4rpx; background: #007AFF; border-radius: 2rpx; }
.result-list { padding: 20rpx; }
.result-scroll { flex: 1; }
.result-card { background: #fff; border-radius: 16rpx; padding: 24rpx; margin-bottom: 16rpx; box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04); }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12rpx; }
.type-tag { padding: 4rpx 16rpx; border-radius: 20rpx; }
.type-tag-text { font-size: 22rpx; color: #fff; font-weight: 500; }
.card-time { font-size: 22rpx; color: #999; }
.card-title { font-size: 30rpx; font-weight: bold; color: #333; margin-bottom: 8rpx; }
.card-desc { font-size: 26rpx; color: #666; line-height: 1.5; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden; }
.card-images { display: flex; gap: 8rpx; margin-top: 12rpx; }
.card-image { width: 160rpx; height: 160rpx; border-radius: 10rpx; background: #f0f0f0; }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 150rpx 0; }
.empty-img { width: 240rpx; height: 240rpx; opacity: 0.4; margin-bottom: 30rpx; }
.empty-text { font-size: 28rpx; color: #999; margin-bottom: 8rpx; }
.empty-sub { font-size: 24rpx; color: #ccc; }
.loading-wrap { padding: 40rpx 0; }
</style>
