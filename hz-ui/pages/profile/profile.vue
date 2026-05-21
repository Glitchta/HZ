<template>
  <view class="container">
    <!-- 用户信息 -->
    <view class="user-info-card" @click="goToUserInfo">
      <view class="user-avatar">
        <image :src="userInfo.avatar" class="avatar" mode="aspectFill"></image>
        <view class="edit-avatar">编辑</view>
      </view>
      <view class="user-detail">
        <text class="user-name">{{userInfo.nickname}}</text>
        <text class="user-id">uid: {{userInfo.id}}</text>
		<text class="user-id">{{userInfo.sign}}</text>
      </view>
      <uni-icons type="right" size="20" color="#999"></uni-icons>
    </view>

    <!-- 数据统计 -->
    <view class="stats-grid">
      <view class="stat-item" @click="goToMyHelps">
        <text class="stat-number">{{userStats.helps}}</text>
        <text class="stat-label">我的求助</text>
      </view>
      <view class="stat-item" @click="goToMyHelped">
        <text class="stat-number">{{userStats.helped}}</text>
        <text class="stat-label">我的帮助</text>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="function-list">
      <view class="function-item" @click="goToMyPosts">
        <uni-icons type="compose" size="24" color="#007AFF"></uni-icons>
        <text class="function-text">我的发布</text>
        <uni-icons type="right" size="20" color="#999"></uni-icons>
      </view>
      <view class="function-item" @click="goToMyLikes">
        <uni-icons type="heart" size="24" color="#ff6b6b"></uni-icons>
        <text class="function-text">我的点赞</text>
        <uni-icons type="right" size="20" color="#999"></uni-icons>
      </view>
      <view class="function-item" @click="goToMyCollection">
        <uni-icons type="star" size="24" color="#FF9500"></uni-icons>
        <text class="function-text">我的收藏</text>
        <uni-icons type="right" size="20" color="#999"></uni-icons>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-btn" @click="logout" v-if="state.isLoggedIn">
      <text>退出登录</text>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { onShow, onHide } from '@dcloudio/uni-app'
import request from '../../utils/request'

// 响应式数据
const userInfo = ref({
  nickname: '好心人',
  id: '666',
  avatar: '/static/avatar/头像.png',
  tags: ''
})

const userStats = ref({
  helps: 0,
  helped: 0
})

// 响应式状态
const state = reactive({
  loading: false,
  isLoggedIn: false,
  showLoginModal: false,
  // 功能列表
  functions: [
    {
      key: 'posts',
      icon: 'compose',
      text: '我的发布',
      color: '#007AFF',
      badge: 0
    },
    {
      key: 'likes',
      icon: 'heart',
      text: '我的点赞',
      color: '#ff6b6b',
      badge: 0
    },
    {
      key: 'collection',
      icon: 'star',
      text: '我的收藏',
      color: '#FF9500',
      badge: 0
    },
  ]
})


// 生命周期
onMounted(() => {
  console.log('我的页面加载')
  checkLoginStatus()
  fetchUserInfo()
  fetchUserStats()
})

onShow(() => {
  console.log('我的页面显示')
  //更新登录状态
  state.isLoggedIn = uni.getStorageSync('isLoggedIn')
  // 每次显示页面时刷新数据
  refreshData()
})

onHide(() => {
  console.log('我的页面隐藏')
})

// 监听登录状态变化
watch(() => state.isLoggedIn, (isLoggedIn) => {
  if (isLoggedIn) {
    fetchUserInfo()
    fetchUserStats()
  } else {
    // 未登录状态，重置数据
    resetUserData()
  }
})

// 方法
const goToUserInfo = () => {
  if (!state.isLoggedIn) {
    showLoginModal()
    return
  }
  uni.navigateTo({
    url: '/pages/profile/edit'
  })
}

const goToMyHelps = () => {
  if (!state.isLoggedIn) {
    showLoginModal()
    return
  }
  uni.navigateTo({
    url: '/pages/alumni/my-posts?tab=help'
  })
}

const goToMyHelped = () => {
  if (!state.isLoggedIn) {
    showLoginModal()
    return
  }
  uni.navigateTo({
    url: '/pages/alumni/my-posts?tab=helped'
  })
}

const goToMyPosts = () => {
  if (!state.isLoggedIn) {
    showLoginModal()
    return
  }
  uni.navigateTo({
    url: '/pages/alumni/my-posts'
  })
}

const goToMyLikes = () => {
  if (!state.isLoggedIn) {
    showLoginModal()
    return
  }
  uni.navigateTo({
    url: '/pages/profile/likes'
  })
}

const goToMyCollection = () => {
  if (!state.isLoggedIn) {
    showLoginModal()
    return
  }
  uni.navigateTo({
    url: '/pages/profile/collection'
  })
}

const logout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: async (res) => {
      if (res.confirm) {
		//更新登录状态
		uni.setStorageSync('isLoggedIn',false)
        await performLogout()
      }
    }
  })
}

const showLoginModal = () => {
  uni.showModal({
    title: '未登录',
    content: '请先登录',
    confirmText: '去登录',
    success: (res) => {
      if (res.confirm) {
        goToLogin()
      }
    }
  })
}

const goToLogin = () => {
  uni.hideTabBar({
	animation: false  // 立即隐藏，无动画
  })
  uni.navigateTo({
    url: '/pages/login/login'
  })
}

// 异步方法
const checkLoginStatus = async () => {
  // try {
  //   // 检查本地存储的token
  //   const token = uni.getStorageSync('token')
  //   state.isLoggedIn = !!token

  //   if (token) {
  //     // 验证token有效性
  //     // const valid = await validateToken(token)
  //     // state.isLoggedIn = valid
  //   }
  // } catch (error) {
  //   console.error('检查登录状态失败', error)
  //   state.isLoggedIn = false
  // }
}

const fetchUserInfo = async () => {
  if (!state.isLoggedIn) return

  state.loading = true
  try {
   const res = await request.get("/userInfo/get")
   userInfo.value = res.data

  } catch (error) {
    console.error('获取用户信息失败', error)
    if (error.statusCode === 403) {
      // token过期
      state.isLoggedIn = false
      uni.removeStorageSync('token')
    }
  } finally {
    state.loading = false
  }
}

const fetchUserStats = async () => {
  if (!state.isLoggedIn) return

  try {
    const res = await request.get('/help/count')
    if (res.code === 0 && res.data) {
      userStats.value.helps = res.data.resortCount || 0
      userStats.value.helped = res.data.helpCount || 0
    }
  } catch (error) {
    console.error('获取用户统计失败', error)
  }
}

const refreshData = async () => {
  if (state.isLoggedIn) {
    await Promise.all([fetchUserInfo(), fetchUserStats()])
  }
}

const performLogout = async () => {
  try {
    // 清除本地存储
    uni.removeStorageSync('token')
    uni.removeStorageSync('userInfo')
    uni.removeStorageSync('currentUserId')

    // 更新状态
    state.isLoggedIn = false

    // 重置为默认信息
    resetUserData()

    uni.showToast({
      title: '已退出登录',
      icon: 'success',
      duration: 1500
    })

  } catch (error) {
    console.error('退出登录失败', error)
    uni.showToast({
      title: '退出登录失败',
      icon: 'error'
    })
  }
}

const resetUserData = () => {
  userInfo.value = {
    nickname: '好心人',
    id: '666',
    avatar: '/static/avatar/头像.png',
    sign: '这个人很懒，什么都没留下~'
  }
  userStats.value = {
    helps: 0,
    helped: 0
  }
}

// 模拟验证token
const validateToken = async (token) => {
  return new Promise(resolve => {
    setTimeout(() => {
      // 这里应该有实际的验证逻辑
      resolve(true)
    }, 100)
  })
}

// 处理功能点击
const handleFunctionClick = (func) => {
  const handlers = {
    posts: goToMyPosts,
    likes: goToMyLikes,
    collection: goToMyCollection
  }

  if (handlers[func.key]) {
    handlers[func.key]()
  }
}

// 导出
defineExpose({
  userInfo,
  userStats,
  state,
  goToUserInfo,
  goToMyHelps,
  goToMyHelped,
  logout,
  handleFunctionClick
})
</script>
<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

.user-info-card {
  background: linear-gradient(135deg, #9dbde7 0%,#9dbde7 0%);
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  display: flex;
  align-items: center;
  color: #fff;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(112, 158, 221, 0.3);
}

.user-avatar {
  position: relative;
  margin-right: 30rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.edit-avatar {
  position: absolute;
  bottom: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10rpx);
  padding: 6rpx 12rpx;
  border-radius: 20rpx;
  font-size: 20rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
}

.user-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.user-id {
  font-size: 30rpx;
  opacity: 0.9;
  margin-bottom: 15rpx;
}

.user-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

.user-tag {
  background: rgba(255, 255, 255, 0.2);
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  font-size: 20rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.3);
}

.stats-grid {
  display: flex;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 40rpx 0;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1rpx solid #eee;
}

.stat-item:last-child {
  border-right: none;
}

.stat-number {
  font-size: 40rpx;
  font-weight: bold;
  color: #007AFF;
  margin-bottom: 10rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #666;
}

.function-list {
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
  margin-bottom: 30rpx;
}

.function-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
}

.function-item:last-child {
  border-bottom: none;
}

.function-text {
  flex: 1;
  margin-left: 20rpx;
  font-size: 28rpx;
  color: #333;
}

.logout-btn {
  background-color: #fff;
  color: #ff3b30;
  padding: 30rpx;
  border-radius: 20rpx;
  text-align: center;
  font-size: 28rpx;
  font-weight: bold;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}
</style>
