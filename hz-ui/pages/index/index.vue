<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-box" @click="goToSearch">
        <uni-icons type="search" size="18" color="#999"></uni-icons>
        <text class="search-text">搜索互助信息</text>
      </view>
    </view>

    <!-- 功能入口 -->
    <view class="function-grid">
      <view class="function-item" @click="goToPage('resort')">
        <view class="function-icon resort-icon">
			<image class="function-image resort-icon" src="/static/index/求助.png"></image>
		</view>
        <text class="function-text">我要求助</text>
      </view>
      <view class="function-item" @click="goToPage('help')">
        <view class="function-icon help-icon">
			<image class="function-image help-icon" src="/static/index/帮助.png"></image>
		</view>
        <text class="function-text">我能帮忙</text>
      </view>
      <view class="function-item" @click="goToPage('hole')">
        <view class="function-icon hole-icon">
			<image class="function-image hole-icon" src="/static/index/树洞.png"></image>
		</view>
        <text class="function-text">匿名树洞</text>
      </view>
      <view class="function-item" @click="goToPage('lost')">
        <view class="function-icon lost-icon">
			<image class="function-image lost-icon" src="/static/index/失物招领.png"></image>
		</view>
        <text class="function-text">失物招领</text>
      </view>
    </view>

    <!-- 热门互助 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">最新互助信息</text>
        <text class="section-more" @click="goToHelpList">查看更多</text>
      </view>
      
      <view class="help-list">
        <view 
          v-for="(item, index) in helpList" 
          :key="index" 
          class="help-item"
          @click="goToHelpDetail(item.id)"
        >
          <view class="help-header">
            <text class="help-type" :class="item.type === '求助' ? 'type-resort' : 'type-help'">{{item.type}}</text>
            <text class="help-time">{{formatTime(item.createTime)}}</text>
          </view>
          <text class="help-title">{{item.title}}</text>
		  <view class="dynamic-images" v-if="item.images.length > 0">
		    <image 
		      v-for="(img, imgIndex) in item.images.slice(0, 3)" 
		      :key="imgIndex"
		      :src="img"
		      class="dynamic-image"
		      mode="aspectFill"
		      @click="previewImage(item.images, imgIndex)"
		    ></image>
		  </view>
          <view class="help-footer">
            <text class="help-user">{{item.nickname}}</text>
            <text class="help-status" :class="item.status === '待帮助' || item.status === '已结束' ? 'status-pending' : 'status-solved' ">{{item.status}}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { onPageScroll, onReachBottom, onShow, onLoad, onHide } from '@dcloudio/uni-app'
import request from '../../utils/request'

// 响应式数据
const helpList = ref([
])
const page = ref({
	current : 1,
	size:5
})

// 计算属性
const urgentHelpList = computed(() => {
  return helpList.value.filter(item => item.type === '求助')
})
onHide(() => {
	console.log('首页隐藏')
	// 重置页面数据
	page.value.current = 1
})
onShow(() => {
  console.log('首页显示')
  
  uni.showTabBar({
	  animation:false
  })
  // 这里可以添加初始化数据
  fetchHelpList()
})
// 页面生命周期
onMounted(() => {
  getUserInfo()
  console.log('首页加载完成')
})

// 页面滚动事件
onPageScroll((e) => {
  // console.log('页面滚动', e.scrollTop)
})

// 触底事件
onReachBottom(() => {
  console.log('触底，加载更多')
  loadMoreData()
})

// 方法
const goToPage = (page) => {
  
  // 根据页面类型跳转
  switch(page) {
    case 'resort':
      uni.navigateTo({ url: '/pages/help/resort' })
      break
    case 'help':
      uni.navigateTo({ url: '/pages/help/help' })
      break
    case 'hole':
      uni.navigateTo({ url: '/pages/hole/list' })
      break
    case 'lost':
      uni.navigateTo({ url: '/pages/lost/list' })
      break
  }
}

const goToSearch = () => {
  uni.navigateTo({
    url: '/pages/search/search'
  })
}

const goToHelpList = () => {
  uni.navigateTo({
    url: '/pages/help/list'
  })
}

const goToHelpDetail = (id) => {
  uni.navigateTo({
    url: `/pages/help/detail?id=${id}`
  })
}

// 异步方法

const getUserInfo = async () => {
	try{
		const res = await request.get('/userInfo/get')
		uni.setStorageSync('userInfo',res.data)
			if (res.data && res.data.id) {
				uni.setStorageSync('currentUserId', String(res.data.userId))
			}
	}catch (error) {
		console.error('获取用户数据失败', error)
	}
}

const fetchHelpList = async () => {
  try {
    const res = await request.post('/help/list',page.value)
    helpList.value = res.data
	page.value.current = page.value.current + 1
  } catch (error) {
    console.error('获取数据失败', error)
  }
}

const loadMoreData = async () => {
	
const res = await request.post('/help/list',page.value)
console.log(res.data)
 if(res.data === null){
	 uni.showToast({
	   title: res.msg || '操作失败，请重试',
	   icon: 'none'
	 })
 }else{
	 // 加入更多数据
	 helpList.value.push(...res.data)
	 page.value.current = page.value.current + 1
 }
  
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

// 筛选相关方法
const selectSort = (sort) => {
  currentSort.value = sort
}

// 导出给模板使用
defineExpose({
  helpList,
  urgentHelpList,
  goToPage,
  goToSearch,
  goToHelpList,
  goToHelpDetail
})
</script>

<style scoped>
.dynamic-images {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20rpx;
}	
.dynamic-image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 10rpx;
  margin-right: 10rpx;
  margin-bottom: 10rpx;
  background-color: #f0f0f0;
}	
.container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.search-bar {
  padding: 20rpx 0;
}

.search-box {
  background-color: #fff;
  border-radius: 50rpx;
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}

.search-text {
  margin-left: 20rpx;
  color: #999;
  font-size: 28rpx;
}

.function-grid {
  display: flex;
  justify-content: space-around;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 40rpx 0;
  margin: 20rpx 0;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}

.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.function-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  margin-bottom: 10rpx;
}
.function-image {
	margin-top: 10rpx;
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 40rpx;
	margin-bottom: 10rpx;
}

.resort-icon { background-color: #e6f7ff; }
.help-icon { background-color: #dff2d7; }
.hole-icon { background-color: #e0d2e4; }
.lost-icon { background-color: #e1fce0; }
.function-text {
  font-size: 24rpx;
  color: #333;
}

.section {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-top: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.section-more {
  font-size: 24rpx;
  color: #999;
}

.help-item {
  border-bottom: 1rpx solid #eee;
  padding: 30rpx 0;
}

.help-item:last-child {
  border-bottom: none;
}

.help-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.help-type {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.type-resort {
  background-color: #e6f7ff;
  color: #1890ff;
}

.type-help {
  background-color: #f6ffed;
  color: #52c41a;
}

.help-time {
  font-size: 24rpx;
  color: #999;
}

.help-title {
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
  margin-bottom: 20rpx;
  display: block;
}

.help-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.help-user {
  font-size: 24rpx;
  color: #666;
}

.help-status {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.status-pending {
  background-color: #fff7e6;
  color: #fa8c16;
}

.status-solved {
  background-color: #f6ffed;
  color: #52c41a;
}
</style>