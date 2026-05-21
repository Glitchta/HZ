<template>
  <view class="container">
    <!-- 消息列表 -->
    <view class="message-list">
      <view 
        v-for="(message, index) in messages" 
        :key="message.id || index" 
        class="message-item"
        @click="goToChat(message.targetId)"
      >
        <view class="message-left">
          <image 
            :src="message.avatar" 
            class="avatar" 
            mode="aspectFill"
            @error="onImageError"
          ></image>
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
      
      <!-- 空状态 -->
      <view v-if="messages.length === 0" class="empty-state">
        <text>暂无消息</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import request from '../../utils/request'
import { onPageScroll, onReachBottom, onShow, onLoad, onHide } from '@dcloudio/uni-app'

const activeTab = ref('all')
const unreadCount = ref(0)

// 使用 ref 来存储消息列表
const messages = ref([])

const state = reactive({
  wsConnected: false,
  timer: null
})

// 修正计算属性
const totalUnreadCount = computed(() => {
  let total = 0
  messages.value.forEach(msg => {  
    total += msg.unread || 0
  })
  return total
})

// 生命周期
onMounted(() => {
  console.log('消息页面加载')
  console.log('初始 messages:', messages.value)
  getmessages()
  startPolling()
  updateUnreadBadge()
})

onShow(() => {
	getmessages()
})

onUnmounted(() => {
  if (state.timer) {
    clearInterval(state.timer)
  }
  closeWebSocket()
})

// 监听未读数变化
watch(totalUnreadCount, (newVal) => {
  unreadCount.value = newVal
  console.log('未读数更新:', newVal)
  updateTabBarBadge(newVal)
})

// 监听 activeTab 变化
watch(activeTab, (newTab) => {
  console.log('切换到Tab:', newTab)
  markAllAsRead(newTab)
})

// 方法
const goToChat = (id) => {
  console.log('跳转到聊天:', id)
  markAsRead(id)
  
  uni.navigateTo({
    url: `/pages/message/chat?id=${id}`
  })
}

// 获取消息列表
const getmessages = async () => {
  try {
    console.log('开始获取消息列表...')
    const res = await request.get('/message/get')
    console.log('API响应:', res)
    
    if (res.code === 0 || res.success) {  // 根据你的API返回格式调整
      messages.value = res.data || []
      console.log('消息列表更新成功:', messages.value)
    } else {
      console.error('获取消息列表失败:', res.message || res.msg)
      // 如果API失败，使用默认数据
      messages.value = [
        {
          id: '2047274345466511362',
          name: '微时代额',
          avatar: 'https://via.placeholder.com/100',
          preview: '学长，高数题可以帮忙看看吗？',
          time: '刚刚',
          unread: 3
        },
        {
          id: '2047276902746243074',
          name: '皇城杰',
          avatar: 'https://via.placeholder.com/100',
          preview: '学长，高数题可以帮忙看看吗？',
          time: '刚刚',
          unread: 3
        }
      ]
    }
  } catch (error) {
    console.error('请求失败:', error)
    // 使用默认数据
    messages.value = [
      {
        id: '2047274345466511362',
        name: '微时代额',
        avatar: 'https://via.placeholder.com/100',
        preview: '学长，高数题可以帮忙看看吗？',
        time: '刚刚',
        unread: 3
      }
    ]
  }
}

// 标记单条消息为已读
const markAsRead = (id) => {
  const messageIndex = messages.value.findIndex(msg => msg.id === id)
  if (messageIndex !== -1) {
    messages.value[messageIndex].unread = 0
    // 重新赋值以触发响应式更新
    messages.value = [...messages.value]
  }
  updateUnreadBadge()
}

// 标记所有消息为已读
const markAllAsRead = (type) => {
  console.log('标记所有为已读:', type)
  messages.value = messages.value.map(msg => ({
    ...msg,
    unread: 0
  }))
  updateUnreadBadge()
}

// 更新TabBar徽标
const updateTabBarBadge = (count) => {
  if (count > 0) {
    uni.setTabBarBadge({
      index: 2,
      text: count > 99 ? '99+' : count.toString()
    })
  } else {
    uni.removeTabBarBadge({ index: 2 })
  }
}

// 初始化WebSocket
const initWebSocket = () => {
  console.log('初始化 WebSocket')
  // 后续实现
}

const closeWebSocket = () => {
  state.wsConnected = false
}

// 添加新消息
const addNewMessage = (message) => {
  messages.value = [message, ...messages.value]
  updateUnreadBadge()
}

// 开始轮询
const startPolling = () => {
  console.log('开始轮询')
  // 每30秒检查一次新消息
  state.timer = setInterval(async () => {
    console.log('轮询检查新消息...')
    // 这里可以调用API检查新消息
  }, 30000)
}

// 更新未读徽标
const updateUnreadBadge = () => {
  const count = totalUnreadCount.value
  updateTabBarBadge(count)
}

// 图片加载失败处理
const onImageError = (e) => {
  console.log('图片加载失败:', e)
  // 可以设置默认头像
  e.target.src = '/static/default-avatar.png'
}

// 时间格式化
const formatTime = (time) => {
  if (!time) return ''
  
  const date = new Date(time)
  const now = new Date()
  const diff = now - date
  
  // 一分钟内
  if (diff < 60000) {
    return '刚刚'
  }
  
  // 一小时内
  if (diff < 3600000) {
    return Math.floor(diff / 60000) + '分钟前'
  }
  
  // 一天内
  if (diff < 86400000) {
    return Math.floor(diff / 3600000) + '小时前'
  }
  
  // 一周内
  if (diff < 604800000) {
    return Math.floor(diff / 86400000) + '天前'
  }
  
  // 更早的日期
  return date.getMonth() + 1 + '-' + date.getDate()
}


// 导出
defineExpose({
  unreadCount,
  messages,
  goToChat
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

.message-list {
  /* 可以添加一些样式 */
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300rpx;
  font-size: 28rpx;
  color: #999;
}

.message-item {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 30rpx;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}

.message-left {
  position: relative;
  margin-right: 20rpx;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background-color: #f0f0f0;
}

.unread-badge {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  background-color: #ff3b30;
  color: #fff;
  min-width: 40rpx;
  height: 40rpx;
  border-radius: 20rpx;
  font-size: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10rpx;
  box-sizing: border-box;
}

.message-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.user-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 20rpx;
}

.message-time {
  font-size: 24rpx;
  color: #999;
  flex-shrink: 0;
}

.message-preview {
  font-size: 26rpx;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
}
</style>