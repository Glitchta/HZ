<template>
  <view class="container">
    <!-- 顶部分栏 -->
    <view class="tab-bar">
      <view class="tab-item" :class="{ active: activeTab === 'message' }" @click="switchTab('message')">
        <text>消息</text>
        <view class="tab-badge" v-if="totalUnreadCount > 0">{{ totalUnreadCount > 99 ? '99+' : totalUnreadCount }}</view>
      </view>
      <view class="tab-item" :class="{ active: activeTab === 'announcement' }" @click="switchTab('announcement')">
        <text>公告</text>
      </view>
    </view>

    <!-- 消息列表 -->
    <view class="message-list" v-if="activeTab === 'message'">
      <view
        v-for="(message, index) in messages"
        :key="message.id || index"
        class="message-item"
        @click="goToChat(message.targetId)"
      >
        <view class="message-left">
          <image :src="message.avatar" class="avatar" mode="aspectFill" @error="onImageError"></image>
          <view class="unread-badge" v-if="message.unread > 0">
            {{message.unread > 99 ? '99+' : message.unread}}
          </view>
        </view>
        <view class="message-content">
          <view class="message-header">
            <text class="user-name">{{message.nickname}}</text>
            <text class="message-time">{{formatTime(message.timestamp)}}</text>
          </view>
          <text class="message-preview">{{message.content}}</text>
        </view>
      </view>
      <view v-if="messages.length === 0" class="empty-state"><text>暂无消息</text></view>
    </view>

    <!-- 公告列表 -->
    <view class="announcement-list" v-if="activeTab === 'announcement'">
      <view v-for="item in announcements" :key="item.id" class="announcement-card" @click="showDetail(item)">
        <view class="ann-card-top">
          <view class="ann-card-badge">公告</view>
          <text class="ann-card-time">{{ formatTime(item.createTime) }}</text>
        </view>
        <text class="ann-card-title">{{ item.title }}</text>
        <text class="ann-card-content">{{ item.content }}</text>
        <view class="ann-card-bottom">
          <text class="ann-card-tip">点击查看详情</text>
          <text class="ann-card-arrow">›</text>
        </view>
      </view>
      <view v-if="announcements.length === 0" class="empty-state"><text>暂无公告</text></view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import request from '../../utils/request'
import { onShow } from '@dcloudio/uni-app'

const activeTab = ref('message')
const unreadCount = ref(0)
const announcements = ref([])
const messages = ref([])

const state = reactive({ wsConnected: false, timer: null })

const totalUnreadCount = computed(() => {
  let total = 0
  messages.value.forEach(msg => { total += msg.unread || 0 })
  return total
})

onMounted(() => {
  getmessages()
  fetchAnnouncements()
  startPolling()
  updateUnreadBadge()
})

onShow(() => { getmessages() })

onUnmounted(() => { if (state.timer) clearInterval(state.timer); closeWebSocket() })

watch(totalUnreadCount, (newVal) => {
  unreadCount.value = newVal
  updateTabBarBadge(newVal)
})

const switchTab = (tab) => { activeTab.value = tab }

const goToChat = (id) => {
  markAsRead(id)
  uni.navigateTo({ url: `/pages/message/chat?id=${id}` })
}

const fetchAnnouncements = async () => {
  try {
    const res = await request.get('/announcement/list', { params: { current: 1, size: 50 } })
    if (res.code === 0 && res.data) {
      announcements.value = res.data.records || res.data || []
    }
  } catch (e) { console.error('获取公告失败', e) }
}

const showDetail = (item) => {
  uni.showModal({
    title: item.title,
    content: item.content,
    showCancel: false,
    confirmText: '我知道了'
  })
}

const getmessages = async () => {
  try {
    const res = await request.get('/message/get')
    if (res.code === 0 || res.success) {
      messages.value = res.data || []
    }
  } catch (error) {
    console.error('请求失败:', error)
  }
}

const markAsRead = (id) => {
  const idx = messages.value.findIndex(msg => msg.id === id)
  if (idx !== -1) { messages.value[idx].unread = 0; messages.value = [...messages.value] }
  updateUnreadBadge()
}

const updateTabBarBadge = (count) => {
  if (count > 0) uni.setTabBarBadge({ index: 2, text: count > 99 ? '99+' : count.toString() })
  else uni.removeTabBarBadge({ index: 2 })
}

const initWebSocket = () => {}
const closeWebSocket = () => { state.wsConnected = false }
const startPolling = () => { state.timer = setInterval(async () => {}, 30000) }
const updateUnreadBadge = () => { updateTabBarBadge(totalUnreadCount.value) }
const onImageError = (e) => { e.target.src = '/static/default-avatar.png' }

const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time), now = new Date(), diff = now - date
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  if (diff < 604800000) return Math.floor(diff / 86400000) + '天前'
  return date.getMonth() + 1 + '-' + date.getDate()
}
</script>

<style scoped>
.container { min-height: 100vh; background-color: #f5f5f5; padding: 20rpx; }

/* 分栏 */
.tab-bar {
  display: flex; background: #fff; border-radius: 16rpx; margin-bottom: 20rpx; padding: 8rpx; box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}
.tab-item {
  flex: 1; text-align: center; padding: 16rpx 0; font-size: 28rpx; color: #666; border-radius: 12rpx; transition: all .2s; position: relative; display: flex; align-items: center; justify-content: center; gap: 8rpx;
}
.tab-item.active { background: #409EFF; color: #fff; font-weight: 600; }
.tab-badge {
  background: #ff3b30; color: #fff; min-width: 32rpx; height: 32rpx; border-radius: 16rpx; font-size: 20rpx; display: flex; align-items: center; justify-content: center; padding: 0 6rpx;
}

/* 消息 */
.message-list {}
.message-item {
  display: flex; align-items: center; background-color: #fff; padding: 30rpx; border-radius: 20rpx; margin-bottom: 20rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}
.message-left { position: relative; margin-right: 20rpx; }
.avatar { width: 100rpx; height: 100rpx; border-radius: 50%; background-color: #f0f0f0; }
.unread-badge {
  position: absolute; top: -10rpx; right: -10rpx; background-color: #ff3b30; color: #fff; min-width: 40rpx; height: 40rpx; border-radius: 20rpx; font-size: 20rpx; display: flex; align-items: center; justify-content: center; padding: 0 10rpx;
}
.message-content { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.message-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15rpx; }
.user-name { font-size: 30rpx; font-weight: bold; color: #333; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 20rpx; }
.message-time { font-size: 24rpx; color: #999; flex-shrink: 0; }
.message-preview { font-size: 26rpx; color: #666; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; line-height: 1.4; }

/* 公告 */
.announcement-list {}
.announcement-card {
  background: linear-gradient(135deg, #fff9f0, #fff7e6);
  border: 2rpx solid #f5d78e;
  border-radius: 20rpx;
  padding: 28rpx 30rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(230,162,60,0.12);
}
.ann-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16rpx; }
.ann-card-badge {
  background: linear-gradient(135deg, #e6a23c, #f0c040);
  color: #fff;
  font-size: 22rpx; font-weight: bold;
  padding: 6rpx 18rpx; border-radius: 8rpx;
}
.ann-card-time { font-size: 22rpx; color: #b8860b; }
.ann-card-title { font-size: 32rpx; font-weight: bold; color: #333; margin-bottom: 14rpx; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: block; }
.ann-card-content { font-size: 26rpx; color: #888; line-height: 1.6; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; margin-bottom: 18rpx; }
.ann-card-bottom { display: flex; align-items: center; justify-content: space-between; border-top: 1rpx solid #f5d78e; padding-top: 14rpx; }
.ann-card-tip { font-size: 22rpx; color: #d4a017; }
.ann-card-arrow { font-size: 28rpx; color: #d4a017; font-weight: bold; }

.empty-state { display: flex; justify-content: center; align-items: center; height: 300rpx; font-size: 28rpx; color: #999; }
</style>
