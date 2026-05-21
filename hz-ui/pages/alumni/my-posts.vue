<template>
  <view class="container">
    <!-- 顶部Tab切换 -->
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

    <!-- 列表区域 -->
    <scroll-view
      class="post-scroll"
      scroll-y
      :refresher-enabled="true"
      :refresher-triggered="refresherTriggered"
      @refresherrefresh="onRefresh"
      @scrolltolower="onReachBottom"
    >
      <view class="post-list">
      <view
        v-for="(item, index) in postList"
        :key="item.id"
        class="post-card"
      >
        <!-- 左滑操作 -->
        <uni-swipe-action>
          <uni-swipe-action-item
            :right-options="swipeOptionsMap[item.id] || defaultSwipeOptions"
            @click="(e) => handleSwipeAction(e, item, index)"
          >
            <view class="post-inner" @click="goToDetail(item)">
              <!-- 头部：类型标签 + 时间 -->
              <view class="post-header">
                <view class="type-tag" :style="{backgroundColor: getTypeColor(item.type)}">
                  <text class="type-tag-text">{{ getTypeLabel(item.type) }}</text>
                </view>
                <text class="post-time">{{ formatTime(item.createTime) }}</text>
              </view>

              <!-- 标题 -->
              <text class="post-title" v-if="item.title">{{ item.title }}</text>

              <!-- 内容 -->
              <text class="post-desc">{{ item.content || item.description }}</text>

              <!-- 图片 -->
              <view class="post-images" v-if="item.images && item.images.length > 0">
                <image
                  v-for="(img, imgIndex) in item.images.slice(0, 3)"
                  :key="imgIndex"
                  :src="img"
                  class="post-image"
                  mode="aspectFill"
                  @click.stop="previewImage(item.images, imgIndex)"
                ></image>
                <view v-if="item.images.length > 3" class="image-more">
                  <text>+{{ item.images.length - 3 }}</text>
                </view>
              </view>

              <!-- 底部统计 -->
              <view class="post-footer">
                <view class="footer-item">
                  <uni-icons type="chat" size="16" color="#999"></uni-icons>
                  <text class="footer-num">{{ item.commentCount || 0 }}</text>
                </view>
                <view class="footer-item">
                  <uni-icons type="heart" size="16" color="#999"></uni-icons>
                  <text class="footer-num">{{ item.likeCount || 0 }}</text>
                </view>
                <view class="footer-item">
                  <uni-icons type="eye" size="16" color="#999"></uni-icons>
                  <text class="footer-num">{{ item.viewCount || 0 }}</text>
                </view>
              </view>
            </view>
          </uni-swipe-action-item>
        </uni-swipe-action>
      </view>

      <!-- 加载更多 -->
      <view v-if="loading" class="loading-wrap">
        <uni-load-more status="loading"></uni-load-more>
      </view>

      <!-- 没有更多 -->
      <view v-if="noMoreData && postList.length > 0" class="no-more">
        <text>— 没有更多了 —</text>
      </view>

      <!-- 空状态 -->
      <view v-if="postList.length === 0 && !loading" class="empty-state">
        <image src="/static/hole/empty.png" class="empty-img" mode="aspectFit"></image>
        <text class="empty-text">还没有发布内容</text>
        <text class="empty-sub">快去发布你的第一条内容吧~</text>
      </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import request from '../../utils/request'

const tabs = [
  { label: '全部', value: 'all' },
  { label: '求助', value: 'help' },
  { label: '帮助', value: 'helped' },
  { label: '失物招领', value: 'lost' },
  { label: '树洞', value: 'hole' },
  { label: '校友圈', value: 'alumni' }
]

const currentTab = ref('all')
const postList = ref([])
const loading = ref(false)
const noMoreData = ref(false)
const refresherTriggered = ref(false)

const page = reactive({
  current: 1,
  size: 10
})

const defaultSwipeOptions = [{ text: '删除', style: { backgroundColor: '#FF3B30' } }]
const swipeOptionsMap = reactive({})

const setSwipeOptions = (item) => {
  const options = [{ text: '删除', style: { backgroundColor: '#FF3B30' } }]
  if (item.type === 'help' || item.type === 'helped') {
    if (item.status === '待帮助' || item.status === '进行中') {
      options.unshift({ text: '结束', style: { backgroundColor: '#FF9500' } })
    } else {
      options.unshift({ text: '开始', style: { backgroundColor: '#4CD964' } })
    }
  }
  swipeOptionsMap[item.id] = options
}

const typeLabelMap = {
  help: '求助',
  helped: '帮助',
  lost: '失物',
  hole: '树洞',
  alumni: '校友圈'
}

const typeColorMap = {
  help: '#FF9500',
  helped: '#4CD964',
  lost: '#007AFF',
  hole: '#AF52DE',
  alumni: '#FF2D55'
}

const typeDetailPathMap = {
  help: '/pages/help/detail',
  helped: '/pages/help/detail',
  lost: '/pages/lost/detail',
  hole: '/pages/hole/detail',
  alumni: '/pages/alumni/detail'
}

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

onLoad((options) => {
  if (options && options.tab) {
    currentTab.value = options.tab
  }
  fetchPostList(true)
})

onShow(() => {
  if (uni.getStorageSync('refreshMyPosts')) {
    fetchPostList(true)
    uni.removeStorageSync('refreshMyPosts')
  }
})

const switchTab = (tab) => {
  if (currentTab.value === tab) return
  currentTab.value = tab
  postList.value = []
  page.current = 1
  noMoreData.value = false
  fetchPostList(true)
}

const fetchPostList = async (refresh = false) => {
  if (loading.value) return
  loading.value = true

  if (refresh) {
    page.current = 1
    noMoreData.value = false
  }

  try {
    const res = await request.post('/my-posts/list', {
      current: page.current,
      size: page.size,
      type: currentTab.value === 'all' ? '' : currentTab.value
    })

    if (res.code === 0) {
      const list = (res.data || []).map(item => {
        setSwipeOptions(item)
        return item
      })
      if (refresh) {
        postList.value = list
      } else {
        postList.value = [...postList.value, ...list]
      }
      if (list.length < page.size) {
        noMoreData.value = true
      } else {
        page.current++
      }
    } else {
      uni.showToast({ title: res.msg || '加载失败', icon: 'none' })
    }
  } catch (error) {
    console.error('获取我的发布列表失败', error)
    uni.showToast({ title: '网络错误，请重试', icon: 'none' })
  } finally {
    loading.value = false
    refresherTriggered.value = false
  }
}

const onRefresh = () => {
  refresherTriggered.value = true
  fetchPostList(true)
}

const onReachBottom = () => {
  if (!loading.value && !noMoreData.value) {
    fetchPostList(false)
  }
}

const goToDetail = (item) => {
  const path = typeDetailPathMap[item.type] || '/pages/help/detail'
  uni.navigateTo({ url: `${path}?id=${item.id}` })
}

const previewImage = (images, current) => {
  uni.previewImage({ urls: images, current })
}

const handleSwipeAction = (e, item, index) => {
  const options = swipeOptionsMap[item.id] || defaultSwipeOptions
  if (options[e.index] && options[e.index].text === '删除') {
    handleDelete(item, index)
  } else {
    handleToggleStatus(item, index)
  }
}

const handleToggleStatus = (item, index) => {
  let newStatus, actionText
  if (item.type === 'help') {
    if (item.status === '待帮助') {
      newStatus = '已解决'
      actionText = '结束'
    } else {
      newStatus = '待帮助'
      actionText = '开始'
    }
  } else {
    if (item.status === '进行中') {
      newStatus = '已结束'
      actionText = '结束'
    } else {
      newStatus = '进行中'
      actionText = '开始'
    }
  }
  uni.showModal({
    title: '提示',
    content: `确定要${actionText}这条发布吗？`,
    success: async (res) => {
      if (res.confirm) {
        try {
          const result = await request.put('/help/status', { id: item.id, status: newStatus })
          if (result.code === 0) {
            postList.value[index].status = newStatus
            setSwipeOptions(postList.value[index])
            uni.showToast({ title: `已${actionText}`, icon: 'success' })
          } else {
            uni.showToast({ title: result.msg || '操作失败', icon: 'none' })
          }
        } catch (error) {
          console.error('状态更新失败', error)
          uni.showToast({ title: '操作失败，请重试', icon: 'none' })
        }
      }
    }
  })
}

const handleDelete = (item, index) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除这条发布吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          const result = await request.post('/my-posts/delete', { id: item.id, type: item.type })
          if (result.code === 0) {
            postList.value.splice(index, 1)
            uni.showToast({ title: '已删除', icon: 'success' })
          } else {
            uni.showToast({ title: result.msg || '删除失败', icon: 'none' })
          }
        } catch (error) {
          console.error('删除失败', error)
          uni.showToast({ title: '删除失败，请重试', icon: 'none' })
        }
      }
    }
  })
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

/* 顶部Tab */
.tabs-wrap {
  background-color: #fff;
  padding-top: 10rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.tabs-scroll {
  white-space: nowrap;
}

.tabs {
  display: flex;
  padding: 0 20rpx;
}

.tab-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20rpx 30rpx;
  position: relative;
}

.tab-text {
  font-size: 28rpx;
  color: #666;
  transition: all 0.3s;
}

.tab-item.active .tab-text {
  color: #007AFF;
  font-weight: bold;
  font-size: 30rpx;
}

.tab-bar {
  position: absolute;
  bottom: 4rpx;
  width: 40rpx;
  height: 6rpx;
  background-color: #007AFF;
  border-radius: 3rpx;
}

/* 列表滚动区 */
.post-scroll { flex: 1; }
.post-list { padding: 20rpx; }

/* 卡片 */
.post-card {
  margin-bottom: 20rpx;
}

.post-inner {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.type-tag {
  padding: 6rpx 18rpx;
  border-radius: 20rpx;
}

.type-tag-text {
  font-size: 22rpx;
  color: #fff;
  font-weight: 500;
}

.post-time {
  font-size: 24rpx;
  color: #999;
}

.post-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  line-height: 1.4;
}

.post-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
  margin-bottom: 16rpx;
}

/* 图片 */
.post-images {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-bottom: 20rpx;
}

.post-image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 12rpx;
  background-color: #f5f5f5;
}

.image-more {
  width: 200rpx;
  height: 200rpx;
  border-radius: 12rpx;
  background-color: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 36rpx;
  font-weight: bold;
}

/* 底部统计 */
.post-footer {
  display: flex;
  align-items: center;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
  gap: 40rpx;
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.footer-num {
  font-size: 24rpx;
  color: #999;
}

/* 加载/空状态 */
.loading-wrap {
  padding: 40rpx 0;
}

.no-more {
  text-align: center;
  padding: 40rpx 0;
  color: #ccc;
  font-size: 26rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 150rpx 0;
}

.empty-img {
  width: 300rpx;
  height: 300rpx;
  opacity: 0.5;
  margin-bottom: 40rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #999;
  margin-bottom: 16rpx;
}

.empty-sub {
  font-size: 26rpx;
  color: #ccc;
}
</style>
