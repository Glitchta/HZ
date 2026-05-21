<template>
  <view class="hole-container">

    <!-- 发布按钮 -->
    <view class="publish-btn" @click="goToPublish">
      <uni-icons type="compose" size="24" color="#fff"></uni-icons>
      <text class="publish-text">发布树洞</text>
    </view>

    <!-- 树洞列表 -->
    <scroll-view 
      class="hole-list" 
      scroll-y 
      :refresher-enabled="true"
      :refresher-triggered="refresherTriggered"
      @refresherrefresh="onRefresh"
      @scrolltolower="onReachBottom"
    >
      <!-- 树洞项 -->
      <view 
        v-for="(item, index) in holeList" 
        :key="item.id"
        class="hole-item"
        @click="goToHoleDetail(item.id)"
      >
        <!-- 树洞内容 -->
        <view class="hole-content">
          <text class="hole-text">{{ item.content }}</text>
          
          <!-- 图片展示 -->
          <view class="hole-images" v-if="item.images && item.images.length > 0">
            <image 
              v-for="(img, imgIndex) in item.images.slice(0, 3)" 
              :key="imgIndex"
              :src="img"
              class="hole-image"
              mode="aspectFill"
              @click.stop="previewImage(item.images, imgIndex)"
            ></image>
            <view v-if="item.images.length > 3" class="image-more">
              <text>+{{ item.images.length - 3 }}</text>
            </view>
          </view>
        </view>

        <!-- 树洞底部信息 -->
        <view class="hole-footer">
          <view class="hole-meta">
            <view class="meta-item">
              <uni-icons type="calendar" size="16" color="#999"></uni-icons>
              <text class="meta-text">{{ formatTime(item.createTime) }}</text>
            </view>
            <view class="meta-item">
              <uni-icons type="chat" size="16" color="#999"></uni-icons>
              <text class="meta-text">{{ item.commentCount || 0 }}</text>
            </view>
            <view class="meta-item" @click.stop="toggleLike(item)">
              <uni-icons 
                :type="item.isLiked ? 'heart-filled' : 'heart'" 
                :color="item.isLiked ? '#ff6b6b' : '#999'"
                size="16"
              ></uni-icons>
              <text class="meta-text">{{ item.likeCount || 0 }}</text>
            </view>
          </view>
          
          <!-- 标签 -->
          <view class="hole-tags" v-if="item.tags && item.tags.length > 0">
            <view 
              v-for="tag in item.tags.slice(0, 3)" 
              :key="tag"
              class="hole-tag"
            >
              {{ tag }}
            </view>
            <view v-if="item.tags.length > 3" class="tag-more">...</view>
          </view>
        </view>
      </view>

      <!-- 加载更多 -->
      <view v-if="loading" class="loading-more">
        <uni-load-more status="loading"></uni-load-more>
      </view>
      
      <!-- 没有更多 -->
      <view v-if="noMoreData" class="no-more">
        <text>没有更多树洞了</text>
      </view>
      
      <!-- 空状态 -->
      <view v-if="holeList.length === 0 && !loading" class="empty-state">
        <image src="/static/hole/empty.png" class="empty-image"></image>
        <text class="empty-text">暂时还没有树洞</text>
        <text class="empty-subtext">点击发布按钮，分享你的第一个树洞</text>
      </view>
    </scroll-view>

  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad, onHide,onShow ,onPullDownRefresh } from '@dcloudio/uni-app'
import request from '../../utils/request'

// 响应式数据
const holeList = ref([])
const loading = ref(false)
const noMoreData = ref(false)
const refresherTriggered = ref(false)
const page = ref({
	current : 1,
	size : 5
})
// 筛选相关
const filterPopup = ref(null)
const currentSort = ref('time') // time: 最新, hot: 最热
const currentTags = ref([])
const sortOptions = [
  { label: '最新发布', value: 'time' },
  { label: '最多点赞', value: 'like' },
  { label: '最多评论', value: 'comment' }
]
const tagOptions = ['情感', '校园', '生活', '学习', '工作', '吐槽', '分享', '求助']

// 页面生命周期
onLoad(() => {
  console.log('树洞页面加载')
  fetchHoleList(true)
})

onShow(() => {
  console.log('树洞页面显示')
  // 如果从发布页面返回，刷新列表
  if (uni.getStorageSync('refreshHoleList')) {
    fetchHoleList(true)
    uni.removeStorageSync('refreshHoleList')
  }
})

onHide(() => {
  console.log('树洞页面隐藏')
})

// 下拉刷新
onPullDownRefresh(() => {
  fetchHoleList(true)
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 1000)
})

// 方法
const goToPublish = () => {
  uni.navigateTo({
    url: '/pages/hole/create'
  })
}

const goToHoleDetail = (id) => {
  uni.navigateTo({
    url: `/pages/hole/detail?id=${id}`
  })
}

const previewImage = (images, currentIndex) => {
  uni.previewImage({
    urls: images,
    current: currentIndex
  })
}

const showMoreAction = () => {
  uni.showActionSheet({
    itemList: ['筛选', '我的树洞', '关于树洞'],
    success: (res) => {
      switch (res.tapIndex) {
        case 0:
          filterPopup.value.open()
          break
        case 1:
          uni.navigateTo({ url: '/pages/help/hole-my' })
          break
        case 2:
          uni.showModal({
            title: '关于匿名树洞',
            content: '在这里，你可以匿名分享心情、倾诉烦恼。所有内容都是匿名的，请放心表达真实的自己。',
            showCancel: false
          })
          break
      }
    }
  })
}

// 获取树洞列表
const fetchHoleList = async (refresh = false) => {
  if (loading.value) return
  
  loading.value = true
  
  if (refresh) {
    holeList.value = []
    noMoreData.value = false
  }
  
  try {
    
    const res = await request.post('/hole/list', page.value)
    
    if (res.code === 0) {
      const newList = res.data || []
      
      if (refresh) {
        holeList.value = newList
      } else {
        holeList.value = [...holeList.value, ...newList]
      }
      
      // 判断是否还有更多数据
      if (newList.length < page.value.size) {
        noMoreData.value = true
      } else {
        page.value.current++
      }
    } else {
      uni.showToast({
        title: res.msg || '获取数据失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('获取树洞列表失败', error)
    uni.showToast({
      title: '网络错误，请重试',
      icon: 'none'
    })
  } finally {
    loading.value = false
    refresherTriggered.value = false
  }
}

// 下拉刷新
const onRefresh = () => {
  refresherTriggered.value = true
  fetchHoleList(true)
}

// 触底加载更多
const onReachBottom = () => {
  if (!loading.value && !noMoreData.value) {
    fetchHoleList(false)
  }
}

// 点赞/取消点赞
const toggleLike = async (item) => {
  try {
    const res = await request.post('/hole/like', {
      holeId: item.id,
      isLike: !item.isLiked
    })
    
    if (res.code === 200) {
      item.isLiked = !item.isLiked
      item.likeCount = item.isLiked ? (item.likeCount || 0) + 1 : Math.max(0, (item.likeCount || 1) - 1)
    } else {
      uni.showToast({
        title: res.msg || '操作失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('点赞失败', error)
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

const toggleTag = (tag) => {
  const index = currentTags.value.indexOf(tag)
  if (index > -1) {
    currentTags.value.splice(index, 1)
  } else {
    currentTags.value.push(tag)
  }
}

const resetFilter = () => {
  currentSort.value = 'time'
  currentTags.value = []
}

const confirmFilter = () => {
  filterPopup.value.close()
  fetchHoleList(true)
}

const closeFilterPopup = () => {
  filterPopup.value.close()
}
</script>

<style scoped>
.hole-container {
  padding-top: 20rpx;
  padding-left: 20rpx;
  padding-right: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 120rpx;
}

/* 顶部标题栏 */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40rpx 30rpx 20rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.top-title {
  display: flex;
  flex-direction: column;
}

.title-text {
  font-size: 40rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.title-sub {
  font-size: 24rpx;
  opacity: 0.9;
}

.top-actions {
  padding: 10rpx;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
}

/* 发布按钮 */
.publish-btn {
  position: fixed;
  bottom: 40rpx;
  right: 30rpx;
  z-index: 100;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50rpx;
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 6rpx 20rpx rgba(102, 126, 234, 0.4);
}

.publish-text {
  color: white;
  font-size: 28rpx;
  margin-left: 10rpx;
  font-weight: 500;
}

/* 树洞列表 */
.hole-list {
  height: calc(100vh - 200rpx);
}

.hole-item {
  background-color: #fbebff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.hole-item:active {
  transform: translateY(-2rpx);
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.1);
}

.hole-content {
  margin-bottom: 30rpx;
}

.hole-text {
  font-size: 30rpx;
  line-height: 1.6;
  color: #333;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 6;
  overflow: hidden;
  word-break: break-all;
}

/* 图片展示 */
.hole-images {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20rpx;
  gap: 10rpx;
}

.hole-image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 12rpx;
  background-color: #f5f5f5;
}

.image-more {
  width: 200rpx;
  height: 200rpx;
  border-radius: 12rpx;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 36rpx;
  font-weight: bold;
}

/* 树洞底部 */
.hole-footer {
  border-top: 1rpx solid #f0f0f0;
  padding-top: 20rpx;
}

.hole-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.meta-item {
  display: flex;
  align-items: center;
  color: #999;
  font-size: 24rpx;
}

.meta-text {
  margin-left: 8rpx;
}

/* 标签 */
.hole-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

.hole-tag {
  background-color: #e6f7ff;
  color: #1890ff;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
}

.tag-more {
  color: #999;
  font-size: 22rpx;
  line-height: 40rpx;
  margin-left: 10rpx;
}

/* 加载状态 */
.loading-more,
.no-more {
  text-align: center;
  padding: 40rpx 0;
  color: #999;
  font-size: 28rpx;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
  text-align: center;
}

.empty-image {
  width: 300rpx;
  height: 300rpx;
  opacity: 0.5;
  margin-bottom: 40rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #999;
  margin-bottom: 20rpx;
}

.empty-subtext {
  font-size: 28rpx;
  color: #ccc;
}

/* 筛选弹窗 */
.filter-popup {
  background-color: white;
  border-radius: 40rpx 40rpx 0 0;
  padding: 40rpx 30rpx;
  max-height: 80vh;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.popup-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.filter-section {
  margin-bottom: 40rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.option-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.option-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #f8f9fa;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #666;
  transition: all 0.3s;
}

.option-item.active {
  background-color: #e6f7ff;
  color: #1890ff;
  border: 1rpx solid #91d5ff;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.tag-option {
  padding: 12rpx 24rpx;
  background-color: #f8f9fa;
  border-radius: 20rpx;
  font-size: 26rpx;
  color: #666;
  transition: all 0.3s;
}

.tag-option.active {
  background-color: #e6f7ff;
  color: #1890ff;
  border: 1rpx solid #91d5ff;
}

.popup-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 40rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.btn-reset,
.btn-confirm {
  flex: 1;
  text-align: center;
  padding: 25rpx 0;
  border-radius: 12rpx;
  font-size: 30rpx;
  font-weight: 500;
}

.btn-reset {
  background-color: #f8f9fa;
  color: #666;
  margin-right: 20rpx;
}

.btn-confirm {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-left: 20rpx;
}
</style>