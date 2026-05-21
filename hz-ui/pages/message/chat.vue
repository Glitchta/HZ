<template>
  <view class="chat-container">
    <!-- 聊天内容区域 -->
    <scroll-view 
      class="chat-content" 
      scroll-y 
      :scroll-into-view="scrollToId"
      :scroll-with-animation="true"
      @scrolltoupper="loadMoreHistory"
    >
      <!-- 加载更多提示 -->
      <view class="load-more" v-if="loadingHistory">
        <text>加载中...</text>
      </view>
      

      <!-- 消息列表 -->
      <view 
        v-for="(msg, index) in messages" 
        :key="msg.id"
        :id="'msg-' + msg.id"
        class="message-wrapper"
        :class="getMessageWrapperClass(msg)"
      >
        <!-- 对方头像和昵称 -->
        <view class="message-header-info" v-if="!msg.isOwn">
          <image :src="receiver.avatar" class="msg-avatar" mode="aspectFill"></image>
        </view>

        <!-- 对方消息气泡 -->
        <view class="message-bubble" :class="getMessageClass(msg)" v-if="!msg.isOwn">
          <!-- 发送失败提示 -->
          <view class="send-fail" v-if="msg.status === 'fail'">
            <text class="fail-text">发送失败，点击重试</text>
          </view>

          <!-- 消息内容 -->
          <view class="message-content">
            <!-- 文本消息 -->
            <text class="message-text">{{ msg.content }}</text>
          </view>

          <!-- 消息状态 -->
          <view class="message-status">
            <text class="message-time">{{ formatTime(msg.timestamp) }}</text>
          </view>
        </view>

        <!-- 自己的消息气泡 -->
        <view class="message-bubble" :class="getMessageClass(msg)" v-if="msg.isOwn">
          <!-- 发送失败提示 -->
          <view class="send-fail" v-if="msg.status === 'fail'">
            <text class="fail-text">发送失败，点击重试</text>
          </view>

          <!-- 消息内容 -->
          <view class="message-content">
            <!-- 文本消息 -->
            <text class="message-text">{{ msg.content }}</text>
          </view>

          <!-- 消息状态 -->
          <view class="message-status">
            <text class="message-time">{{ formatTime(msg.timestamp) }}</text>
          </view>
        </view>

        <!-- 发送方头像（自己的消息） -->
        <view class="own-avatar-container" v-if="msg.isOwn">
          <image :src="currentUser.avatar" class="own-avatar" mode="aspectFill"></image>
        </view>
      </view>

      <!-- 没有消息提示 -->
      <view class="no-message" v-if="messages.length === 0 && !loadingHistory">
        <text>暂无消息，开始聊天吧~</text>
      </view>

    </scroll-view>

    <!-- 输入区域 -->
    <view class="chat-input-area">
      <!-- 文本输入 -->
      <view class="input-container">
        <textarea
          v-model="inputText"
          class="chat-input"
          placeholder="输入消息..."
          :maxlength="500"
          :auto-height="true"
          :show-confirm-bar="false"
          @confirm="sendTextMessage"
        ></textarea>
      </view>

      <!-- 发送按钮 -->
      <view class="send-container">
        <view 
          class="send-btn" 
          :class="{ 'send-btn-active': inputText.trim() }" 
          @click="sendTextMessage"
        >
          <text>发送</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { onLoad, onShow, onHide, onUnload } from '@dcloudio/uni-app'
import websocketManager from '../../utils/websocket'
import request from '../../utils/request'

// 页面参数
const props = defineProps({
  id: String,
  type: {
    type: String,
    default: 'private'
  }
})

// 响应式数据
const receiver = ref({})
const currentUser = ref({})  // 当前用户信息
const inputText = ref('')
const scrollToId = ref('')
const loadingHistory = ref(false)
const hasMoreHistory = ref(true)
const messages = ref([])
let typingTimer = null
let lastSendTime = 0
const pageSize = 20
let pageNum = 1

// 初始化
onLoad((options) => {
  const id = options.id
  if (!id) {
    uni.showToast({
      title: '参数错误',
      icon: 'none'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
    return
  }
  
  // 获取当前用户信息
  getCurrentUserInfo()
  
  getReceiver(id)
  registerWebSocketHandlers()
})

onShow(() => {
  if (websocketManager) {
    websocketManager.reconnectWebSocket()
  }
  // 从服务端拉取最新消息，防止WebSocket推送丢失
  refreshLatestMessages()
})

onHide(() => {
  saveDraft()
})

onUnload(() => {
  clearTimers()
  unregisterWebSocketHandlers()
})

// 获取当前用户信息
const getCurrentUserInfo = () => {
  try {
    const userInfo = uni.getStorageSync('userInfo')
    if (userInfo) {
      currentUser.value = userInfo
    } else {
      console.warn('未找到当前用户信息')
      // 尝试从接口获取
      fetchCurrentUserInfo()
    }
  } catch (error) {
    console.error('获取当前用户信息失败:', error)
  }
}

// 从接口获取当前用户信息
const fetchCurrentUserInfo = async () => {
  try {
    const res = await request.get('/userInfo/get')
    console.log('获取当前用户信息接口返回:', res)
    if (res && res.code === 0 && res.data) {
      currentUser.value = res.data
      // 保存到本地存储
      uni.setStorageSync('userInfo', res.data)
    }
  } catch (error) {
    console.error('从接口获取用户信息失败:', error)
  }
}

// 获取对方信息
const getReceiver = async (id) => {
  console.log('开始获取对方信息，ID:', id)
  try {
    const res = await request.get('/userInfo/getById', { params: { id: id } })
    
    if (res && res.code === 0 && res.data) {
      receiver.value = res.data
      
      // 设置页面标题
      uni.setNavigationBarTitle({
        title: receiver.value.nickname || '聊天'
      })
      
      // 加载历史消息
      loadHistoryMessages()
      
      // 恢复草稿
      const draft = uni.getStorageSync(`chat_draft_${receiver.value.userId}`)
      if (draft) {
        inputText.value = draft
        uni.removeStorageSync(`chat_draft_${receiver.value.userId}`)
      }
    } else {
      console.error('接口返回数据异常:', res)
      uni.showToast({
        title: res?.msg || '获取用户信息失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('获取对方信息失败:', error)
    uni.showToast({
      title: '获取信息失败，请检查网络',
      icon: 'none'
    })
  }
}

// 加载历史消息
const loadHistoryMessages = async () => {
  if (loadingHistory.value || !hasMoreHistory.value || !receiver.value || !receiver.value.userId) {
    return
  }
  
  loadingHistory.value = true
  try {
    const res = await request.get('/message/chat', {
      params: {
        receiverId: receiver.value.userId,
        current: pageNum,
        size: pageSize
      }
    })
    
    console.log('历史消息接口返回:', res)
    
    if (res && res.code === 0) {
      let historyMessages = []
      const currentUserId = currentUser.value.userId || getCurrentUserId()
      
      if (Array.isArray(res.data)) {
        historyMessages = res.data
      } else if (res.data && res.data.records) {
        historyMessages = res.data.records
      } else if (res.data) {
        historyMessages = res.data
      }
      
      console.log('获取到的消息列表:', historyMessages)
      
      if (historyMessages && historyMessages.length > 0) {
        const formattedMessages = historyMessages.map(msg => ({
          id: msg.id || `msg_${Date.now()}_${Math.floor(Math.random() * 100000)}`,
          type: msg.type || 'text',
          content: msg.content || '',
          status: 'success',
          timestamp: msg.timestamp ? new Date(msg.timestamp).getTime() : Date.now(),
          isOwn: (msg.senderId === currentUserId || msg.fromUserId === currentUserId),
          receiverId: msg.receiverId || receiver.value.userId
        }))
        
        messages.value = [...formattedMessages.reverse(), ...messages.value]
        pageNum++
        
        console.log(`加载了 ${formattedMessages.length} 条消息，当前总数: ${messages.value.length}`)
        
        if (pageNum === 2 && formattedMessages.length > 0) {
          setTimeout(() => {
            scrollToBottom()
          }, 300)
        }
      } else {
        hasMoreHistory.value = false
        console.log('没有更多历史消息')
      }
    } else {
      console.error('历史消息接口返回错误:', res)
    }
  } catch (error) {
    console.error('加载历史消息异常:', error)
  } finally {
    loadingHistory.value = false
  }
}

// 发送文本消息
const sendTextMessage = () => {
  const text = inputText.value.trim()
  if (!text || !receiver.value || !receiver.value.userId) return
  
  const message = {
    id: `send_${Date.now()}_${Math.floor(Math.random() * 100000)}`,
    type: 'text',
    content: text,
    isOwn: true,
    status: 'sending',
    timestamp: Date.now(),
    receiverId: receiver.value.userId
  }
  
  messages.value.push(message)
  inputText.value = ''
  scrollToBottom()
  sendMessageToServer(message)
  lastSendTime = Date.now()
}

// 发送消息到服务器
const sendMessageToServer = async (message) => {
  console.log('开始发送消息到服务器，消息内容:', message)
  
  try {
    // 构造发送给服务器的消息体
    const messageData = {
      receiverId: message.receiverId,
      content: message.content,
      type: message.type
    }
    
    console.log('发送的数据结构:', messageData)
    
    const res = await request.post('/message/send', messageData)
    
    console.log('发送消息接口响应:', res)
    
    if (res && res.code === 0) {
      updateMessageStatus(message.id, 'success')
      
      // 如果服务器返回了新的消息ID，更新本地ID
      if (res.data && res.data.id) {
        const index = messages.value.findIndex(msg => msg.id === message.id)
        if (index !== -1) {
          messages.value[index].id = res.data.id
        }
      }
      
      // 尝试通过WebSocket发送
      if (websocketManager) {
        const wsMessage = {
          type: 'chat_message',
          data: {
            ...message,
            id: (res.data && res.data.id) || message.id,
            senderId: currentUser.value.userId
          }
        }
        const success = websocketManager.sendMessage(wsMessage)
        console.log('WebSocket发送结果:', success)
      }
    } else {
      // 发送失败
      updateMessageStatus(message.id, 'fail')
      console.error('消息发送失败，业务错误:', res)
      uni.showToast({
        title: res?.msg || '发送失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('发送消息异常:', error)
    updateMessageStatus(message.id, 'fail')
    uni.showToast({
      title: '发送失败: ' + (error.message || '网络错误'),
      icon: 'none'
    })
  }
}

// 更新消息状态
const updateMessageStatus = (messageId, status) => {
  const index = messages.value.findIndex(msg => msg.id === messageId)
  if (index !== -1) {
    messages.value[index].status = status
  }
}

// 从服务端刷新最新消息
const refreshLatestMessages = async () => {
  if (!receiver.value || !receiver.value.userId) return

  try {
    const currentUserId = currentUser.value.userId || getCurrentUserId()
    const res = await request.get('/message/chat', {
      params: {
        receiverId: receiver.value.userId,
        current: 1,
        size: pageSize
      }
    })

    if (res && res.code === 0) {
      let serverMessages = []
      if (Array.isArray(res.data)) {
        serverMessages = res.data
      } else if (res.data && res.data.records) {
        serverMessages = res.data.records
      }

      if (serverMessages && serverMessages.length > 0) {
        // 只添加本地不存在的消息
        const existingIds = new Set(messages.value.map(m => m.id))
        let hasNew = false
        serverMessages.forEach(msg => {
          if (!existingIds.has(msg.id)) {
            messages.value.push({
              id: msg.id,
              type: msg.type || 'text',
              content: msg.content || '',
              status: 'success',
              timestamp: msg.timestamp ? new Date(msg.timestamp).getTime() : Date.now(),
              isOwn: (msg.senderId === currentUserId),
              receiverId: msg.receiverId || receiver.value.userId
            })
            hasNew = true
          }
        })

        if (hasNew) {
          // 按时间戳排序
          messages.value.sort((a, b) => a.timestamp - b.timestamp)
          scrollToBottom()
        }
      }
    }
  } catch (error) {
    console.error('刷新消息失败:', error)
  }
}

// WebSocket消息处理器
const handleIncomingMessage = (message) => {
  console.log('收到WebSocket消息:', message)
  console.log('当前receiver:', receiver.value)
  console.log('当前currentUser:', currentUser.value)

  if (!message || !message.content) {
    console.warn('收到空消息或无效消息')
    return
  }

  // 检查消息是否与当前聊天相关
  const currentUserId = currentUser.value.userId || getCurrentUserId()
  const chatPartnerId = receiver.value && receiver.value.userId

  // 消息来自当前聊天对象 或 发给当前聊天对象
  const fromChatPartner = message.senderId && String(message.senderId) === String(chatPartnerId)
  const fromCurrentUser = message.senderId && String(message.senderId) === String(currentUserId)

  console.log('消息判断:', { fromChatPartner, fromCurrentUser, messageSenderId: message.senderId, chatPartnerId, currentUserId })

  if (receiver.value && (fromChatPartner || fromCurrentUser)) {
    const existingIndex = messages.value.findIndex(msg =>
      (msg.id && msg.id === message.id) ||
      (msg.content === message.content && Math.abs(msg.timestamp - message.timestamp) < 2000)
    )

    if (existingIndex === -1) {
      messages.value.push({
        id: message.id || `ws_${Date.now()}_${Math.floor(Math.random() * 100000)}`,
        type: message.type || 'text',
        content: message.content || '',
        status: 'success',
        timestamp: message.timestamp || Date.now(),
        isOwn: fromCurrentUser,
        receiverId: message.receiverId || receiver.value.userId
      })
      scrollToBottom()
      console.log('消息已添加到聊天界面')
    } else {
      console.log('消息重复，已跳过')
    }
  } else {
    console.log('消息不匹配当前聊天，已忽略')
  }
}

// 注册WebSocket消息处理器
const registerWebSocketHandlers = () => {
  if (websocketManager) {
    websocketManager.onMessage('chat_message', handleIncomingMessage)
  }
}

// 移除WebSocket消息处理器
const unregisterWebSocketHandlers = () => {
  if (websocketManager) {
    websocketManager.offMessage('chat_message', handleIncomingMessage)
  }
}

// 工具方法
const getCurrentUserId = () => {
  const userInfo = uni.getStorageSync('userInfo')
  return userInfo ? (userInfo.userId || '') : ''
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messages.value.length > 0) {
      const lastMsg = messages.value[messages.value.length - 1]
      scrollToId.value = 'msg-' + lastMsg.id
    }
  })
}

const scrollToMessage = (msgId) => {
  scrollToId.value = 'msg-' + msgId
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const formatTimeDivider = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 86400000)
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  
  if (messageDate.getTime() === today.getTime()) {
    return '今天'
  } else if (messageDate.getTime() === yesterday.getTime()) {
    return '昨天'
  } else {
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }
}

const showTimeDivider = (index) => {
  if (index === 0) return true
  
  const currentMsg = messages.value[index]
  const prevMsg = messages.value[index - 1]
  
  const currentDate = new Date(currentMsg.timestamp)
  const prevDate = new Date(prevMsg.timestamp)
  
  return (
    currentDate.getDate() !== prevDate.getDate() ||
    currentDate.getMonth() !== prevDate.getMonth() ||
    currentDate.getFullYear() !== prevDate.getFullYear()
  )
}

const getMessageClass = (msg) => {
  return {
    'own-message': msg.isOwn,
    'other-message': !msg.isOwn,
    'message-sending': msg.status === 'sending',
    'message-fail': msg.status === 'fail'
  }
}

const getMessageWrapperClass = (msg) => {
  return {
    'own-wrapper': msg.isOwn,
    'other-wrapper': !msg.isOwn
  }
}

// 清理定时器
const clearTimers = () => {
  if (typingTimer) clearTimeout(typingTimer)
}

// 保存草稿
const saveDraft = () => {
  if (inputText.value && receiver.value && receiver.value.userId) {
    uni.setStorageSync(`chat_draft_${receiver.value.userId}`, inputText.value)
  }
}
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

/* 聊天内容区域 */
.chat-content {
  flex: 1;
  padding: 20rpx;
  overflow: hidden;
  box-sizing: border-box;
}

/* 加载更多提示 */
.load-more {
  text-align: center;
  padding: 30rpx;
  color: #999;
  font-size: 28rpx;
}

/* 历史消息分隔线 */
.history-divider {
  text-align: center;
  padding: 20rpx 0;
  color: #999;
  font-size: 24rpx;
  position: relative;
}

.history-divider::before,
.history-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 30%;
  height: 1rpx;
  background-color: #eee;
}

.history-divider::before {
  left: 0;
}

.history-divider::after {
  right: 0;
}

/* 消息包装器 */
.message-wrapper {
  margin-bottom: 30rpx;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
  display: flex;
  align-items: flex-start;
  min-height: 100rpx;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 自己消息布局 - 头像在右侧，消息在左侧 */
.own-wrapper {
  justify-content: flex-end;
  flex-direction: row; /* 从左到右：气泡 -> 头像 */
}

/* 对方消息布局 - 头像在左侧，消息在右侧 */
.other-wrapper {
  justify-content: flex-start;
  flex-direction: row; /* 从左到右：头像 -> 气泡 */
}

/* 动画效果 */
.own-wrapper {
  animation: slideInRight 0.3s ease forwards;
}

.other-wrapper {
  animation: slideInLeft 0.3s ease forwards;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100rpx);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-100rpx);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 时间分隔线 */
.time-divider {
  text-align: center;
  padding: 20rpx 0;
  color: #999;
  font-size: 24rpx;
  width: 100%;
}

/* 对方头像和昵称 */
.message-header-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20rpx;
  width: 80rpx;
  flex-shrink: 0;
}

.msg-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 10rpx;
  background-color: #f0f0f0;
}

.msg-nickname {
  font-size: 20rpx;
  color: #666;
  margin-top: 5rpx;
  text-align: center;
  max-width: 80rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 发送方头像容器 - 在气泡右侧 */
.own-avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 20rpx;
  width: 80rpx;
  flex-shrink: 0;
  order: 2; /* 确保头像在右侧 */
}

.own-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 10rpx;
  background-color: #f0f0f0;
}

/* 消息气泡 */
.message-bubble {
  max-width: 70%;
  min-width: 120rpx;
  position: relative;
  padding: 20rpx;
  animation: bubbleAppear 0.3s ease;
  display: flex;
  flex-direction: column;
  border-radius: 20rpx;
  word-wrap: break-word;
  word-break: break-word;
  flex-shrink: 0;
}

@keyframes bubbleAppear {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* 自己消息气泡 - 右侧气泡，尾巴在右侧 */
.own-message {
  background: linear-gradient(135deg, #95ec69, #95ec69);
  color: #fff;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  border-bottom-left-radius: 20rpx;
  border-bottom-right-radius: 5rpx;
  order: 1; /* 确保气泡在左侧 */
  align-self: flex-end;
  margin-right: 0;
  margin-left: auto;
}

/* 对方消息气泡 - 左侧气泡，尾巴在左侧 */
.other-message {
  background-color: #fff;
  color: #333;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  border-bottom-left-radius: 5rpx;
  border-bottom-right-radius: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
  order: 2; /* 确保气泡在右侧 */
  align-self: flex-start;
  margin-left: 0;
  margin-right: auto;
}

/* 发送中状态 */
.message-sending {
  opacity: 0.7;
}

/* 发送失败提示 */
.send-fail {
  position: absolute;
  top: -30rpx;
  right: 0;
  font-size: 24rpx;
  color: #ff3b30;
  text-align: right;
  white-space: nowrap;
}

.own-message .send-fail {
  right: auto;
  left: 0;
  text-align: left;
}

.fail-text {
  font-size: 24rpx;
  color: #ff3b30;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 4rpx 8rpx;
  border-radius: 8rpx;
}

/* 消息内容 */
.message-content {
  margin-bottom: 10rpx;
  min-width: 0; /* 防止文本溢出 */
}

.message-text {
  font-size: 28rpx;
  line-height: 1.5;
  word-wrap: break-word;
  word-break: break-word;
}

.own-message .message-text {
  color: #fff;
}

.other-message .message-text {
  color: #333;
}

/* 消息状态 */
.message-status {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 24rpx;
  margin-top: 5rpx;
  opacity: 0.8;
}

.own-message .message-status {
  justify-content: flex-end;
  color: rgba(255, 255, 255, 0.8);
}

.other-message .message-status {
  justify-content: flex-start;
  color: #999;
}

.message-time {
  font-size: 22rpx;
}

/* 没有消息提示 */
.no-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200rpx;
  color: #999;
  font-size: 28rpx;
  text-align: center;
  padding: 40rpx;
}

/* 输入区域 */
.chat-input-area {
  display: flex;
  align-items: flex-end;
  background-color: #fff;
  border-top: 1rpx solid #eee;
  padding: 20rpx;
  box-sizing: border-box;
  min-height: 100rpx;
  position: relative;
  z-index: 10;
}

/* 输入框容器 */
.input-container {
  flex: 1;
  margin-right: 20rpx;
  display: flex;
  align-items: center;
  background-color: #f8f8f8;
  border-radius: 40rpx;
  padding: 0 20rpx;
  min-height: 60rpx;
  max-height: 200rpx;
}

.chat-input {
  width: 100%;
  padding: 20rpx 0;
  font-size: 28rpx;
  line-height: 1.5;
  min-height: 40rpx;
  max-height: 160rpx;
  background-color: transparent;
  border: none;
  outline: none;
  resize: none;
  box-sizing: border-box;
}

/* 发送按钮容器 */
.send-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120rpx;
}

.send-btn {
  width: 100rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e4e4e4;
  border-radius: 30rpx;
  font-size: 28rpx;
  color: #999;
  transition: all 0.3s;
}

.send-btn-active {
  background-color: #07c160;
  color: #fff;
}
</style>