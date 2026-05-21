<template>
  <view class="container">
    <view class="tabs-wrap">
      <scroll-view scroll-x class="tabs-scroll" :show-scrollbar="false">
        <view class="tabs">
          <view
            v-for="tab in tabs"
            :key="tab.value"
            class="tab-item"
            :class="{'active': currentTab === tab.value}"
            @click="switchTab(tab.value)"
          >
            <text class="tab-text">{{ tab.label }}</text>
            <view v-if="currentTab === tab.value" class="tab-bar"></view>
          </view>
        </view>
      </scroll-view>
    </view>

    <scroll-view
      class="post-scroll"
      scroll-y
      :refresher-enabled="true"
      :refresher-triggered="refresherTriggered"
      @refresherrefresh="onRefresh"
      @scrolltolower="onReachBottom"
    >
      <view class="post-list">
      <view v-for="(item, index) in collectionList" :key="item.id" class="post-card">
        <uni-swipe-action>
          <uni-swipe-action-item
            :right-options="swipeOptions"
            @click="(e) => { if (e.index === 0) handleCancelCollect(item, index) }"
          >
            <view class="post-inner" @click="goToDetail(item)">
              <view class="post-header">
                <view class="type-tag" :style="{backgroundColor: getTypeColor(item.type)}">
                  <text class="type-tag-text">{{ getTypeLabel(item.type) }}</text>
                </view>
                <text class="post-time">{{ formatTime(item.createTime) }}</text>
              </view>
              <text class="post-title" v-if="item.title">{{ item.title }}</text>
              <text class="post-desc">{{ item.content }}</text>
              <view class="post-images" v-if="item.images && item.images.length > 0">
                <image
                  v-for="(img, imgIndex) in item.images.slice(0, 3)"
                  :key="imgIndex"
                  :src="img"
                  class="post-image"
                  mode="aspectFill"
                  @click.stop="previewImage(item.images, imgIndex)"
                ></image>
              </view>
              <view class="post-footer">
                <view class="footer-item">
                  <uni-icons type="chat" size="16" color="#999"></uni-icons>
                  <text class="footer-num">{{ item.commentCount || 0 }}</text>
                </view>
                <view class="footer-item">
                  <uni-icons type="heart" size="16" color="#999"></uni-icons>
                  <text class="footer-num">{{ item.likeCount || 0 }}</text>
                </view>
              </view>
            </view>
          </uni-swipe-action-item>
        </uni-swipe-action>
      </view>

      <view v-if="loading" class="loading-wrap">
        <uni-load-more status="loading"></uni-load-more>
      </view>
      <view v-if="noMoreData && collectionList.length > 0" class="no-more">
        <text>- 没有更多了 -</text>
      </view>
      <view v-if="collectionList.length === 0 && !loading" class="empty-state">
        <image src="/static/hole/empty.png" class="empty-img" mode="aspectFit"></image>
        <text class="empty-text">还没有收藏内容</text>
        <text class="empty-sub">快去发现感兴趣的内容吧~</text>
      </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import request from '../../utils/request'

const tabs = [
  { label: '全部', value: '' },
  { label: '求助', value: 'help' },
  { label: '失物招领', value: 'lost' },
  { label: '树洞', value: 'hole' },
  { label: '校友圈', value: 'alumni' }
]

const currentTab = ref('')
const collectionList = ref([])
const loading = ref(false)
const noMoreData = ref(false)
const refresherTriggered = ref(false)

const page = reactive({ current: 1, size: 10 })

const swipeOptions = ref([{ text: '取消收藏', style: { backgroundColor: '#FF9500' } }])

const typeLabelMap = { help: '求助', lost: '失物', hole: '树洞', alumni: '校友圈' }
const typeColorMap = { help: '#FF9500', lost: '#007AFF', hole: '#AF52DE', alumni: '#FF2D55' }
const typeDetailPathMap = { help: '/pages/help/detail', lost: '/pages/lost/detail', hole: '/pages/hole/detail', alumni: '/pages/alumni/detail' }

const getTypeLabel = (type) => typeLabelMap[type] || '其他'
const getTypeColor = (type) => typeColorMap[type] || '#999'

const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const diff = now - date
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  if (diff < 604800000) return Math.floor(diff / 86400000) + '天前'
  return date.getMonth() + 1 + '-' + date.getDate()
}

onLoad(() => { fetchCollectionList(true) })

const switchTab = (tab) => {
  if (currentTab.value === tab) return
  currentTab.value = tab
  collectionList.value = []
  page.current = 1
  noMoreData.value = false
  fetchCollectionList(true)
}

const fetchCollectionList = async (refresh = false) => {
  if (loading.value) return
  loading.value = true
  if (refresh) { page.current = 1; noMoreData.value = false }
  try {
    const res = await request.post('/collection/list', {
      current: page.current, size: page.size,
      contentType: currentTab.value
    })
    if (res.code === 0) {
      const list = res.data || []
      if (refresh) collectionList.value = list
      else collectionList.value = [...collectionList.value, ...list]
      if (list.length < page.size) noMoreData.value = true
      else page.current++
    }
  } catch (e) { console.error('获取收藏列表失败', e) }
  finally { loading.value = false; refresherTriggered.value = false }
}

const onRefresh = () => { refresherTriggered.value = true; fetchCollectionList(true) }
const onReachBottom = () => { if (!loading.value && !noMoreData.value) fetchCollectionList(false) }

const goToDetail = (item) => {
  const path = typeDetailPathMap[item.type] || '/pages/help/detail'
  uni.navigateTo({ url: path + '?id=' + item.id })
}

const previewImage = (images, current) => {
  uni.previewImage({ urls: images, current })
}

const handleCancelCollect = (item, index) => {
  uni.showModal({
    title: '提示',
    content: '确定取消收藏吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          const result = await request.post('/collection/cancel', { contentId: item.id, contentType: item.type })
          if (result.code === 0) {
            collectionList.value.splice(index, 1)
            uni.showToast({ title: '已取消收藏', icon: 'success' })
          }
        } catch (e) { console.error('取消收藏失败', e) }
      }
    }
  })
}
</script>

<style scoped>
.container { min-height: 100vh; background-color: #f5f5f5; display: flex; flex-direction: column; }
.tabs-wrap { background-color: #fff; padding-top: 10rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
.tabs-scroll { white-space: nowrap; }
.tabs { display: flex; padding: 0 20rpx; }
.tab-item { display: inline-flex; flex-direction: column; align-items: center; justify-content: center; padding: 20rpx 30rpx; position: relative; }
.tab-text { font-size: 28rpx; color: #666; transition: all 0.3s; }
.tab-item.active .tab-text { color: #FF9500; font-weight: bold; font-size: 30rpx; }
.tab-bar { position: absolute; bottom: 4rpx; width: 40rpx; height: 6rpx; background-color: #FF9500; border-radius: 3rpx; }
.post-scroll { flex: 1; }
.post-list { padding: 20rpx; }
.post-card { margin-bottom: 20rpx; }
.post-inner { background-color: #fff; border-radius: 20rpx; padding: 30rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
.post-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16rpx; }
.type-tag { padding: 6rpx 18rpx; border-radius: 20rpx; }
.type-tag-text { font-size: 22rpx; color: #fff; font-weight: 500; }
.post-time { font-size: 24rpx; color: #999; }
.post-title { font-size: 32rpx; font-weight: bold; color: #333; margin-bottom: 12rpx; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; line-height: 1.4; }
.post-desc { font-size: 28rpx; color: #666; line-height: 1.6; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 4; overflow: hidden; margin-bottom: 16rpx; }
.post-images { display: flex; flex-wrap: wrap; gap: 10rpx; margin-bottom: 20rpx; }
.post-image { width: 200rpx; height: 200rpx; border-radius: 12rpx; background-color: #f5f5f5; }
.post-footer { display: flex; align-items: center; padding-top: 20rpx; border-top: 1rpx solid #f0f0f0; gap: 40rpx; }
.footer-item { display: flex; align-items: center; gap: 8rpx; }
.footer-num { font-size: 24rpx; color: #999; }
.loading-wrap { padding: 40rpx 0; }
.no-more { text-align: center; padding: 40rpx 0; color: #ccc; font-size: 26rpx; }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 150rpx 0; }
.empty-img { width: 300rpx; height: 300rpx; opacity: 0.5; margin-bottom: 40rpx; }
.empty-text { font-size: 32rpx; color: #999; margin-bottom: 16rpx; }
.empty-sub { font-size: 26rpx; color: #ccc; }
</style>
