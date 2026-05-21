<template>
  <view class="container">
    <!-- 发布按钮 -->
    <view class="publish-btn" @click="goToPublish">
      <uni-icons type="plus-filled" size="20" color="#fff"></uni-icons>
      <text>发布动态</text>
    </view>

    <!-- 动态列表 -->
    <view class="dynamic-list">
      <view 
        v-for="(item, index) in dynamicList" 
        :key="index" 
        class="dynamic-item"
        @click="goToDynamicDetail(item.id)"
      >
        <view class="dynamic-header">
          <image :src="item.avatar" class="avatar" mode="aspectFill"></image>
          <view class="user-info">
            <text class="user-name">{{item.nickname}}</text>
            <text class="post-time">{{formatTime(item.createTime)}}</text>
          </view>
        </view>
        
        <text class="dynamic-content">{{item.title}}</text>
        
        <view class="dynamic-images" v-if="item.images.length > 0">
          <image 
            v-for="(img, imgIndex) in item.images" 
            :key="imgIndex"
            :src="img"
            class="dynamic-image"
            mode="aspectFill"
            @click="previewImage(item.images, imgIndex)"
          ></image>
        </view>
        
        <view class="dynamic-footer">
          <view class="action-item" @click.stop="likeDynamic(index)">
            <uni-icons :type="item.liked ? 'heart-filled' : 'heart'" size="18" :color="item.liked ? '#f00' : '#999'"></uni-icons>
            <text>{{item.likes}}</text>
          </view>
          <view class="action-item" @click.stop="goToComment(item.id)">
            <uni-icons type="chatbubble" size="18" color="#999"></uni-icons>
            <text>{{item.comments}}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { onPullDownRefresh, onReachBottom,onShow } from '@dcloudio/uni-app'
import request from '../../utils/request'

// 响应式数据
const dynamicList = ref([
  {
    id: 1,
    name: '王同学',
    avatar: 'https://via.placeholder.com/100',
    time: '3小时前',
    content: '今天在图书馆发现了一本很好的学习资料，分享给大家！',
    images: [],
    likes: 24,
    comments: 8,
    liked: false
  },
  {
    id: 2,
    name: '李学长',
    avatar: 'https://via.placeholder.com/100',
    time: '5小时前',
    content: '校园樱花开了，太美了！分享几张照片',
    images: [
      'https://via.placeholder.com/300x200',
      'https://via.placeholder.com/300x200'
    ],
    likes: 56,
    comments: 12,
    liked: true
  }
])

// 响应式状态
const state = reactive({
  loading: false,
  hasMore: true,
})

const page = reactive({
	current: 1,
	size : 10
})
// 计算属性
const hasImages = computed(() => {
  return dynamicList.value.some(item => item.images && item.images.length > 0)
})

// 生命周期
onMounted(() => {
  console.log('校友圈页面加载')
  // 获取初始数据
  fetchDynamicList()
})
onShow(() => {
  console.log('校友圈显示')
  
  uni.showTabBar({
	  animation:false
  })
  // 这里可以添加初始化数据
  fetchDynamicList()
})

// 下拉刷新
onPullDownRefresh(async () => {
  console.log('下拉刷新')
  await refreshDynamicList()
  uni.stopPullDownRefresh()
})

// 上拉加载更多
onReachBottom(async () => {
  if (!state.hasMore || state.loading) return
  console.log('加载更多')
  await loadMoreDynamic()
})

// 方法
const goToPublish = () => {
  uni.navigateTo({
    url: '/pages/alumni/create'
  })
}

const goToDynamicDetail = (id) => {
  uni.navigateTo({
    url: `/pages/alumni/detail?id=${id}`
  })
}

const likeDynamic = (index) => {
  const item = dynamicList.value[index]
  item.liked = !item.liked
  item.likes += item.liked ? 1 : -1
  
  // 调用API更新点赞状态
  updateLikeStatus(item.id, item.liked)
  
  uni.showToast({
    title: item.liked ? '已点赞' : '取消点赞',
    icon: 'none'
  })
}

const goToComment = (id) => {
  uni.navigateTo({
    url: `/pages/alumni/comment?id=${id}`
  })
}

const previewImage = (images, current) => {
  uni.previewImage({
    urls: images,
    current: current
  })
}

// 异步方法
const fetchDynamicList = async () => {
  state.loading = true
  try {
    
    const res = await request.post('/dynamic/list',page)
	dynamicList.value = res.data

  } catch (error) {
    console.error('获取动态列表失败', error)
    uni.showToast({
      title: '加载失败',
      icon: 'error'
    })
  } finally {
    state.loading = false
  }
}

const refreshDynamicList = async () => {
  page.current = 1
  await fetchDynamicList()
  uni.showToast({
    title: '刷新成功',
    icon: 'success'
  })
}

const loadMoreDynamic = async () => {
  if (!state.hasMore) return
  
  page.current++
  state.loading = true
  
  try {
	const res = await request.post("/dynamic/list",page)
	const moreData = res.data

    dynamicList.value.push(...moreData)
    
    // 模拟没有更多数据
    if (page.current >= 3) {
      state.hasMore = false
      uni.showToast({
        title: '没有更多了',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('加载更多失败', error)
    page.current-- // 回退页码
  } finally {
    state.loading = false
  }
}

const updateLikeStatus = async (dynamicId, liked) => {
  try {
    // 调用API更新点赞状态
    // await uni.request({
    //   url: '/api/dynamic/like',
    //   method: 'POST',
    //   data: { dynamicId, liked }
    // })
  } catch (error) {
    console.error('更新点赞状态失败', error)
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

// 导出
defineExpose({
  dynamicList,
  state,
  hasImages,
  goToPublish,
  goToDynamicDetail,
  likeDynamic,
  goToComment,
  previewImage
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

.publish-btn {
  background: linear-gradient(135deg, #9dbde7,#9dbde7);
  color: #fff;
  padding: 20rpx 30rpx;
  border-radius: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 122, 255, 0.3);
}

.publish-btn text {
  margin-left: 10rpx;
  font-weight: bold;
}

.dynamic-list {
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}

.dynamic-item {
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
}

.dynamic-item:last-child {
  border-bottom: none;
}

.dynamic-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.post-time {
  font-size: 24rpx;
  color: #999;
}

.dynamic-content {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
  margin-bottom: 20rpx;
  display: block;
}

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

.dynamic-footer {
  display: flex;
  padding-top: 20rpx;
  border-top: 1rpx solid #f5f5f5;
}

.action-item {
  display: flex;
  align-items: center;
  margin-right: 40rpx;
  color: #666;
}

.action-item text {
  margin-left: 10rpx;
  font-size: 24rpx;
}
</style>