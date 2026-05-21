<template>
  <view class="detail-container">
    <!-- 内容区域 -->
    <scroll-view class="detail-content" scroll-y="true">
      <!-- 帮助卡片 -->
      <view class="help-card">
        <!-- 状态标签 -->
        <view class="status-tag" :class="statusClass">
          {{ helpInfo.status }}
        </view>
        
        <!-- 标题和类型 -->
        <view class="title-section">
          <view class="type-badge" :class="typeClass">
            {{ helpInfo.type === '求助' ? '求助' : '帮忙' }}
          </view>
          <text class="help-title">{{ helpInfo.title }}</text>
        </view>
        
        <!-- 用户信息 -->
        <view class="user-info">
          <image 
            class="user-avatar" 
            :src="helpInfo.avatar || '/static/default-avatar.png'" 
            mode="aspectFill"
          ></image>
          <view class="user-detail">
            <text class="user-name">{{ helpInfo.nickname }}</text>
			<text class="help-time">{{formatTime(helpInfo.createTime)}}</text>
          </view>
        </view>
        
        <!-- 详细信息 -->
        <view class="detail-section">
          <view class="section-title">详细描述</view>
          <text class="help-content">{{ helpInfo.description || '暂无详细描述' }}</text>
          
          <!-- 图片展示 -->
          <view class="images-section" v-if="helpInfo.images && helpInfo.images.length > 0">
            <image 
              v-for="(img, index) in helpInfo.images" 
              :key="index"
              :src="img"
              class="detail-image"
              mode="aspectFill"
              @click="previewImage(index)"
            ></image>
          </view>
        </view>
        
        <!-- 其他信息 -->
        <view v-if="helpInfo.contact"  class="meta-info">
          <view class="meta-item">
            <uni-icons type="phone" size="16" color="#666"></uni-icons>
            <text class="meta-text">{{ helpInfo.contact }}</text>
          </view>
        </view>
      </view>
      
      <!-- 评论区域 -->
      <view class="comment-section">
        <view class="section-title">
          <text>评论 {{ commentCount }}</text>
        </view>

        <view v-if="commentList.length === 0 && !commentLoading" class="empty-comment">
          <image src="/static/hole/empty-comment.png" class="empty-comment-image"></image>
          <text class="empty-comment-text">暂无评论</text>
          <text class="empty-comment-subtext">快来发表第一条评论吧</text>
        </view>

        <view v-for="commentItem in commentList" :key="commentItem.id" class="comment-item primary-comment">
          <view class="comment-content" @click="showReplyInput(commentItem, 'comment')">
            <image class="comment-avatar" :src="commentItem.avatar || '/static/default-avatar.png'" mode="aspectFill"></image>
            <view class="comment-body">
              <view class="comment-user">
                <text class="comment-nickname">{{ commentItem.nickname || '匿名用户' }}</text>
              </view>
              <text class="comment-text">{{ commentItem.content }}</text>
              <view class="comment-info">
                <text class="comment-time">{{ formatTime(commentItem.createTime) }}</text>
                <view class="comment-like" @click.stop="toggleCommentLike(commentItem)" :class="{ liked: commentItem.isLiked }">
                  <uni-icons :type="commentItem.isLiked ? 'heart-filled' : 'heart'" :color="commentItem.isLiked ? '#ff6b6b' : '#999'" size="16"></uni-icons>
                  <text>{{ commentItem.likeCount || 0 }}</text>
                </view>
                <view v-if="currentUserId && currentUserId === commentItem.createUser" class="comment-delete" @click.stop="deleteComment(commentItem)">
                  <uni-icons type="trash" size="14" color="#ccc"></uni-icons>
                </view>
              </view>
            </view>
          </view>

          <view v-if="commentItem.children && commentItem.children.length > 0" class="reply-list">
            <view v-for="reply in commentItem.children" :key="reply.id" class="reply-item">
              <view class="reply-content" @click="showReplyInput(commentItem, 'reply', reply)">
                <image class="reply-avatar" :src="reply.avatar || '/static/default-avatar.png'" mode="aspectFill"></image>
                <view class="reply-body">
                  <view class="reply-user">
                    <text class="reply-nickname">{{ reply.nickname || '匿名用户' }}</text>
                    <text v-if="reply.replyId && reply.replyId !== commentItem.id && reply.replyIdNickname" class="reply-target">回复 {{ reply.replyIdNickname }}</text>
                  </view>
                  <text class="reply-text">{{ reply.content }}</text>
                  <view class="reply-info">
                    <text class="reply-time">{{ formatTime(reply.createTime) }}</text>
                    <view class="reply-like" @click.stop="toggleReplyLike(commentItem, reply)" :class="{ liked: reply.isLiked }">
                      <uni-icons :type="reply.isLiked ? 'heart-filled' : 'heart'" :color="reply.isLiked ? '#ff6b6b' : '#999'" size="16"></uni-icons>
                      <text>{{ reply.likeCount || 0 }}</text>
                    </view>
                    <view v-if="currentUserId && currentUserId === reply.createUser" class="comment-delete" @click.stop="deleteReply(commentItem, reply)">
                      <uni-icons type="trash" size="14" color="#ccc"></uni-icons>
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <view v-if="commentItem.children && commentItem.children.length > 0 && (commentItem.commentCount || 0) > commentItem.children.length" class="view-more-replies" @click="loadMoreReplies(commentItem)">查看更多回复</view>
          </view>
        </view>

        <view v-if="commentLoading" class="loading-comment">
          <uni-load-more status="loading"></uni-load-more>
        </view>
        <view v-if="commentNoMore && commentList.length > 0" class="no-more-comment">
          <text>没有更多评论了</text>
        </view>
      </view>
    </scroll-view>
    
    <!-- 底部操作栏 -->
    <view class="detail-footer" v-if="!showInputPopup && helpInfo.status !== '已结束'">
      <view class="footer-actions">
        <!-- 点赞按钮 -->
        <view class="action-collect" @click="handleLike">
          <uni-icons
            :type="isLiked ? 'heart-filled' : 'heart'"
            size="20"
            :color="isLiked ? '#ff6b6b' : '#666'"
          ></uni-icons>
          <text class="action-text">{{ helpInfo.likeCount || 0 }}</text>
        </view>

        <!-- 收藏按钮 -->
        <view class="action-collect" @click="handleCollect">
          <uni-icons
            :type="isCollected ? 'star-filled' : 'star'"
            size="20"
            :color="isCollected ? '#ffc107' : '#666'"
          ></uni-icons>
          <text class="action-text">收藏</text>
        </view>
        
        <!-- 评论输入框 -->
        <view v-if="!showInputPopup" class="comment-input-box" @click="showCommentPopup()">
          <text class="placeholder-text">说点什么...</text>
        </view>
        
		<button v-if="!showInputPopup && helpInfo.status !== '已结束'" class="action-btn primary" @click="handleContact">联系TA</button>
      </view>
    </view>
    
    <!-- 评论输入弹窗 -->
    <uni-popup ref="commentPopup" type="bottom" :mask-click="false" @change="onCommentPopupChange">
      <view class="reply-popup">
        <view class="reply-popup-header">
          <text class="reply-popup-title">发表评论</text>
          <view class="reply-popup-close" @click="closeCommentPopup"><uni-icons type="close" size="20" color="#999"></uni-icons></view>
        </view>
        <view class="reply-popup-content">
          <textarea v-model="comment.content" class="reply-popup-input" placeholder="写下你的评论..." placeholder-class="placeholder" :focus="true" maxlength="500" auto-height cursor-spacing="20"/>
        </view>
        <view class="reply-popup-footer">
          <view class="reply-popup-send" @click="submitComment" :class="{ disabled: !comment.content.trim() }"><text>发送</text></view>
        </view>
      </view>
    </uni-popup>

    <!-- 回复输入弹窗 -->
    <uni-popup ref="replyPopup" type="bottom" :mask-click="false" @change="onReplyPopupChange">
      <view class="reply-popup">
        <view class="reply-popup-header">
          <text class="reply-popup-title">回复 {{ replyTargetName }}</text>
          <view class="reply-popup-close" @click="closeReplyPopup"><uni-icons type="close" size="20" color="#999"></uni-icons></view>
        </view>
        <view class="reply-popup-content">
          <textarea v-model="replyInput" class="reply-popup-input" :placeholder="`回复 ${replyTargetName}：`" placeholder-class="placeholder" :focus="true" maxlength="500" auto-height cursor-spacing="20"/>
        </view>
        <view class="reply-popup-footer">
          <view class="reply-popup-send" @click="submitReply" :class="{ disabled: !replyInput.trim() }"><text>发送</text></view>
        </view>
      </view>
    </uni-popup>

    <!-- 联系弹窗 -->
    <uni-popup ref="contactPopup" type="center">
      <view class="contact-popup">
        <view class="popup-content">
          <text class="popup-title">联系方式</text>
          <view class="contact-info">
            <text class="contact-text">{{ helpInfo.contact || '暂未提供联系方式' }}</text>
          </view>
          <view class="popup-buttons">
            <button class="popup-btn copy" @click="copyContact">复制</button>
            <button class="popup-btn confirm" @click="closeContactPopup">确定</button>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import request from '../../utils/request'

// 路由参数
const query = ref({})

// 互助信息数据
const helpInfo = ref({
})
//
const userInfo = ref({
})

const currentUserId = computed(() => {
  const cached = uni.getStorageSync('currentUserId')
  if (cached) return String(cached)
  const ui = uni.getStorageSync('userInfo')
  if (ui && ui.userId) return String(ui.userId)
  if (ui && ui.id) return String(ui.id)
  return ''
})

const commentList = ref([])
const isCollected = ref(false)
const isLiked = ref(false)
const isMine = ref(false)
const showInputPopup = ref(false)

const commentLoading = ref(false)
const commentNoMore = ref(false)
const replyInput = ref('')
const replyTargetName = ref('')
const replyPopup = ref(null)
const commentPopup = ref(null)
const contactPopup = ref(null)

const replyData = reactive({ parentId: '', replyId: '' })
const comment = reactive({ content: '', parentId: '', replyId: '' })

const page = ref({ current: 1, size: 5, id: '' })

const commentCount = computed(() => {
  let count = 0
  commentList.value.forEach(item => {
    count++
    if (item.children) count += item.children.length
  })
  return count
})

// 计算属性
const statusClass = computed(() => {
  const status = helpInfo.value.status
  if (status === '已结束') return 'status-ended'
  if (status === '进行中') return 'status-solved'
  if (status === '待帮助') return 'status-pending'
})

const typeClass = computed(() => {
  return helpInfo.value.type === '帮忙' ? 'type-help' : 'type-resort'
})

// 生命周期
onLoad((options) => {
  query.value = options
  if (options.id) {
    fetchHelpDetail(options.id)
    page.value.id = options.id
    fetchComments(true)
  }
})

// 方法
const goBack = () => {
  uni.navigateBack()
}



const fetchHelpDetail = async (id) => {
  try {
    const res = await request.get(`/help/detail`,{
	params: {
		id: id
	}
	})
    helpInfo.value = res.data
    
    // 判断是否是自己的帖子
    const userInfo = uni.getStorageSync('userInfo')
    if (userInfo && userInfo.id === helpInfo.value.userId) {
      isMine.value = true
    }
    
    // 检查是否已收藏
    checkCollectionStatus(id)
    // 检查是否已点赞
    checkLikeStatus(id)
  } catch (error) {
    console.error('获取详情失败', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  }
}

const fetchComments = async (refresh = false) => {
  if (commentLoading.value) return
  commentLoading.value = true
  if (refresh) { page.value.current = 1; commentNoMore.value = false }
  try {
    const res = await request.post('/comment/list', page.value)
    if (res.code === 0) {
      const list = res.data || []
      if (refresh) commentList.value = list
      else commentList.value = [...commentList.value, ...list]
      if (list.length < page.value.size) commentNoMore.value = true
      else page.value.current++
    }
  } catch (e) { console.error('获取评论失败', e) }
  finally { commentLoading.value = false }
}

const checkCollectionStatus = async (helpId) => {
  try {
    const res = await request.post('/collection/check', { helpId: String(helpId) })
    isCollected.value = res.data === true
  } catch (error) {
    console.error('检查收藏状态失败', error)
  }
}

const checkLikeStatus = async (helpId) => {
  try {
    const res = await request.post('/like/check', { contentId: helpId, contentType: 'help' })
    isLiked.value = res.data === true
  } catch (error) {
    console.error('检查点赞状态失败', error)
  }
}

const handleLike = async () => {
  if (!uni.getStorageSync('token')) {
    uni.showModal({
      title: '提示',
      content: '请先登录',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({ url: '/pages/login/login' })
        }
      }
    })
    return
  }

  try {
    if (isLiked.value) {
      await request.post('/like/cancel', { contentId: helpInfo.value.id, contentType: 'help' })
      isLiked.value = false
      helpInfo.value.likeCount = Math.max(0, (helpInfo.value.likeCount || 1) - 1)
    } else {
      await request.post('/like/add', { contentId: helpInfo.value.id, contentType: 'help' })
      isLiked.value = true
      helpInfo.value.likeCount = (helpInfo.value.likeCount || 0) + 1
    }
  } catch (error) {
    console.error('点赞操作失败', error)
  }
}

const handleCollect = async () => {
  if (!uni.getStorageSync('token')) {
    uni.showModal({
      title: '提示',
      content: '请先登录',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({ url: '/pages/login/login' })
        }
      }
    })
    return
  }
  
  try {
    if (isCollected.value) {
      await request.post('/collection/cancel', { helpId: helpInfo.value.id, contentType: 'help' })
      isCollected.value = false
      uni.showToast({ title: '已取消收藏' })
    } else {
      await request.post('/collection/add', { helpId: helpInfo.value.id, contentType: 'help' })
      isCollected.value = true
      uni.showToast({ title: '收藏成功' })
    }
  } catch (error) {
    console.error('操作失败', error)
    uni.showToast({ 
      title: '操作失败',
      icon: 'none'
    })
  }
}

const handleContact = () => {
  if (helpInfo.value.createUser) {
    uni.navigateTo({
      url: `/pages/message/chat?id=${helpInfo.value.createUser}&name=${helpInfo.value.nickname}&avatar=${helpInfo.value.avatar || ''}`
    })
  } else {
    uni.showToast({
      title: '无法获取对方信息',
      icon: 'none'
    })
  }
}

const closeContactPopup = () => {
  contactPopup.value.close()
}

const copyContact = () => {
  if (!helpInfo.value.contact) return
  
  uni.setClipboardData({
    data: helpInfo.value.contact,
    success: () => {
      uni.showToast({ title: '已复制到剪贴板' })
    }
  })
}

const handleAction = async () => {
  if (isMine.value) return
  
  if (!uni.getStorageSync('token')) {
    uni.showModal({
      title: '提示',
      content: '请先登录',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({ url: '/pages/login/login' })
        }
      }
    })
    return
  }
  
  uni.showModal({
    title: '确认',
    content: helpInfo.value.type === 'help' ? '确认要帮助TA吗？' : '确认需要对方的帮助吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          const response = await request.post('/help/accept', { 
            helpId: helpInfo.value.id 
          })
          
          if (response.code === 200) {
            uni.showToast({ 
              title: '操作成功',
              success: () => {
                // 重新加载数据
                fetchHelpDetail(helpInfo.value.id)
              }
            })
          } else {
            uni.showToast({ 
              title: response.msg || '操作失败',
              icon: 'none'
            })
          }
        } catch (error) {
          console.error('操作失败', error)
          uni.showToast({ 
            title: '操作失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

const previewImage = (index) => {
  if (!helpInfo.value.images || helpInfo.value.images.length === 0) return
  
  const urls = helpInfo.value.images.map(img => img)
  uni.previewImage({
    current: index,
    urls: urls
  })
}

const showCommentPopup = () => {
  comment.content = ''
  commentPopup.value.open()
  showInputPopup.value = true
}
const closeCommentPopup = () => {
  commentPopup.value.close()
  showInputPopup.value = false
}
const showReplyInput = (cmt, type, reply = null) => {
  if (type === 'comment') {
    replyTargetName.value = cmt.nickname || '匿名用户'
    replyData.parentId = cmt.id
    replyData.replyId = cmt.id
  } else {
    replyTargetName.value = reply.nickname || '匿名用户'
    replyData.parentId = cmt.id
    replyData.replyId = reply.id
  }
  replyInput.value = ''
  replyPopup.value.open()
  showInputPopup.value = true
}
const closeReplyPopup = () => {
  replyPopup.value.close()
  replyInput.value = ''
  showInputPopup.value = false
}
const onCommentPopupChange = (e) => { showInputPopup.value = e.show }
const onReplyPopupChange = (e) => { showInputPopup.value = e.show }

const submitComment = async () => {
  if (!comment.content.trim()) return
  if (!uni.getStorageSync('token')) {
    uni.showModal({ title: '提示', content: '请先登录', success: (res) => { if (res.confirm) uni.navigateTo({ url: '/pages/login/login' }) } })
    return
  }
  try {
    const res = await request.post('/comment/insert', { contentId: helpInfo.value.id, parentId: '', content: comment.content, replyId: '' })
    if (res.code === 0) {
      uni.showToast({ title: '评论成功', icon: 'success' })
      await request.put('/help/comment', null, { params: { id: helpInfo.value.id } })
      fetchComments(true)
      closeCommentPopup()
    }
  } catch (e) { console.error('评论失败', e) }
}

const submitReply = async () => {
  if (!replyInput.value.trim()) return
  try {
    const res = await request.post('/comment/insert', { contentId: helpInfo.value.id, parentId: replyData.parentId, content: replyInput.value, replyId: replyData.replyId })
    if (res.code === 0) {
      uni.showToast({ title: '回复成功', icon: 'success' })
      await request.put('/help/comment', null, { params: { id: helpInfo.value.id } })
      fetchComments(true)
      closeReplyPopup()
    }
  } catch (e) { console.error('回复失败', e) }
}

const toggleCommentLike = async (item) => {
  try {
    const res = await request.post('/comment/like', { commentId: item.id, isLike: !item.isLiked })
    if (res.code === 0) {
      item.isLiked = !item.isLiked
      item.likeCount = item.isLiked ? (item.likeCount || 0) + 1 : Math.max(0, (item.likeCount || 1) - 1)
    }
  } catch (e) { console.error('点赞失败', e) }
}

const toggleReplyLike = async (parent, reply) => {
  try {
    const res = await request.post('/comment/like', { commentId: reply.id, isLike: !reply.isLiked })
    if (res.code === 0) {
      reply.isLiked = !reply.isLiked
      reply.likeCount = reply.isLiked ? (reply.likeCount || 0) + 1 : Math.max(0, (reply.likeCount || 1) - 1)
    }
  } catch (e) { console.error('点赞失败', e) }
}

const deleteComment = (comment) => {
    const myId = currentUserId.value || String(uni.getStorageSync('currentUserId') || '')
    if (myId && String(comment.createUser) !== myId) {
      uni.showToast({ title: '只能删除自己的评论', icon: 'none' })
      return
    }
    uni.showModal({
      title: '提示',
      content: '确定要删除这条评论吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            const result = await request.post('/comment/delete', { commentId: comment.id, contentType: 'help' })
            if (result.code === 0) {
              commentList.value = commentList.value.filter(c => c.id !== comment.id)
              commentCount.value--
              uni.showToast({ title: '已删除', icon: 'success' })
            } else {
              uni.showToast({ title: result.msg || '删除失败', icon: 'none' })
            }
          } catch (e) { console.error('删除评论失败', e) }
        }
      }
    })
  }

  const deleteReply = (parentComment, reply) => {
    const myId = currentUserId.value || String(uni.getStorageSync('currentUserId') || '')
    if (myId && String(reply.createUser) !== myId) {
      uni.showToast({ title: '只能删除自己的评论', icon: 'none' })
      return
    }
    uni.showModal({
      title: '提示',
      content: '确定要删除这条回复吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            const result = await request.post('/comment/delete', { commentId: reply.id, contentType: 'help' })
            if (result.code === 0) {
              parentComment.children = parentComment.children.filter(c => c.id !== reply.id)
              commentCount.value--
              uni.showToast({ title: '已删除', icon: 'success' })
            } else {
              uni.showToast({ title: result.msg || '删除失败', icon: 'none' })
            }
          } catch (e) { console.error('删除回复失败', e) }
        }
      }
    })
  }

  const loadMoreReplies = async (comment) => {
  try {
    const res = await request.post('/comment/replies', { parentId: comment.id, offset: 0, size: 20 })
    if (res.code === 0) {
      comment.children = res.data || []
    }
  } catch (e) { console.error('加载回复失败', e) }
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

</script>

<style scoped>
.detail-container {
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 头部 */
.detail-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 88rpx;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  z-index: 100;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.header-back {
  width: 60rpx;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.header-actions {
  width: 120rpx;
  display: flex;
  justify-content: flex-end;
}

.action-btn {
  background: #1890ff;
  color: #fff;
  font-size: 24rpx;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  line-height: 1;
  border: none;
}

/* 内容区域 */
.detail-content {
  padding-top: 30rpx;
  padding-bottom: 120rpx;
  box-sizing: border-box;
}

/* 帮助卡片 */
.help-card {
  background: #fff;
  margin: 20rpx;
  padding: 40rpx 30rpx;
  border-radius: 20rpx;
  position: relative;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
}

.status-tag {
  position: absolute;
  top: 30rpx;
  right: 30rpx;
  padding: 6rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
}

.status-pending {
  background: #fff7e6;
  color: #fa8c16;
}

.status-doing {
  background: #e6f7ff;
  color: #1890ff;
}

.status-ended {
  background: #f6f6f6;
  color: #999;
}
.status-solved {
  background-color: #f6ffed;
  color: #52c41a;
}

.title-section {
  margin-bottom: 40rpx;
  display: flex;
  align-items: center;
}

.type-badge {
  padding: 8rpx 20rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  margin-right: 20rpx;
  white-space: nowrap;
}

.type-help {
  background: #f6ffed;
  color: #52c41a;
}

.type-resort {
  background: #e6f7ff;
  color: #1890ff;
}

.help-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  line-height: 1.4;
  flex: 1;
}

/* 用户信息 */
.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
  padding-bottom: 30rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.user-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.user-detail {
  flex: 1;
}

.user-name {
  display: block;
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.post-time {
  font-size: 24rpx;
  color: #999;
}

/* 详细信息 */
.detail-section {
  margin-bottom: 40rpx;
}

.section-title {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 20rpx;
  padding-left: 20rpx;
  position: relative;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6rpx;
  height: 24rpx;
  background: #1890ff;
  border-radius: 3rpx;
}

.help-content {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
  display: block;
  margin-bottom: 30rpx;
  padding: 0 20rpx;
}

.images-section {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  padding: 0 20rpx;
}

.detail-image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 10rpx;
  background: #f0f0f0;
}

/* 元信息 */
.meta-info {
  padding: 30rpx 20rpx;
  background: #f9f9f9;
  border-radius: 10rpx;
}

.meta-item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.meta-item:last-child {
  margin-bottom: 0;
}

.meta-text {
  font-size: 24rpx;
  color: #666;
  margin-left: 10rpx;
}

/* 评论区域 */
.comment-section {
  background: #fff;
  margin: 20rpx;
  padding: 30rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
}
.comment-item { padding: 20rpx 0; border-bottom: 1rpx solid #f0f0f0; }
.comment-item:last-child { border-bottom: none; }
.comment-content { display: flex; gap: 16rpx; }
.comment-avatar { width: 64rpx; height: 64rpx; border-radius: 50%; flex-shrink: 0; background: #f0f0f0; }
.comment-body { flex: 1; }
.comment-user { display: flex; align-items: center; gap: 10rpx; margin-bottom: 10rpx; }
.comment-nickname { font-size: 28rpx; font-weight: 500; color: #333; }
.comment-text { font-size: 28rpx; line-height: 1.5; color: #333; display: block; margin-bottom: 15rpx; word-break: break-all; }
.comment-info { display: flex; align-items: center; }
.comment-time { font-size: 24rpx; color: #999; }
.comment-like { display: flex; align-items: center; gap: 8rpx; font-size: 24rpx; color: #999; margin-left: auto; }
.comment-like.liked { color: #ff6b6b; }
.comment-delete { margin-left: 20rpx; padding: 4rpx; }
.reply-list { margin-top: 20rpx; margin-left: 40rpx; padding-left: 20rpx; border-left: 2rpx solid #f0f0f0; }
.reply-item { padding: 20rpx 0; border-bottom: 1rpx solid #f8f8f8; }
.reply-item:last-child { border-bottom: none; }
.reply-content { display: flex; gap: 12rpx; }
.reply-avatar { width: 48rpx; height: 48rpx; border-radius: 50%; flex-shrink: 0; background: #f0f0f0; }
.reply-body { flex: 1; }
.reply-user { display: flex; align-items: center; gap: 10rpx; margin-bottom: 10rpx; flex-wrap: wrap; }
.reply-nickname { font-size: 26rpx; color: #333; font-weight: 500; }
.reply-target { font-size: 24rpx; color: #666; }
.reply-text { font-size: 28rpx; line-height: 1.4; color: #333; margin-bottom: 10rpx; word-break: break-all; }
.reply-info { display: flex; align-items: center; }
.reply-time { font-size: 22rpx; color: #999; }
.reply-like { display: flex; align-items: center; gap: 8rpx; font-size: 22rpx; color: #999; margin-left: auto; }
.reply-like.liked { color: #ff6b6b; }
.view-more-replies { text-align: center; padding: 16rpx 0; color: #999; font-size: 24rpx; }
.loading-comment, .no-more-comment { text-align: center; padding: 40rpx 0; color: #999; font-size: 28rpx; }
.empty-comment { display: flex; flex-direction: column; align-items: center; padding: 60rpx 0; text-align: center; }
.empty-comment-image { width: 200rpx; height: 200rpx; opacity: 0.3; margin-bottom: 30rpx; }
.empty-comment-text { font-size: 28rpx; color: #999; margin-bottom: 10rpx; }
.empty-comment-subtext { font-size: 24rpx; color: #ddd; }
.reply-popup { background-color: #fff; border-radius: 40rpx 40rpx 0 0; padding-bottom: env(safe-area-inset-bottom); }
.reply-popup-header { display: flex; justify-content: space-between; align-items: center; padding: 30rpx 30rpx 20rpx; border-bottom: 1rpx solid #f0f0f0; }
.reply-popup-title { font-size: 32rpx; font-weight: 600; color: #333; }
.reply-popup-close { padding: 10rpx; border-radius: 50%; background-color: #f8f9fa; }
.reply-popup-content { padding: 30rpx; }
.reply-popup-input { background-color: #f8f9fa; border-radius: 20rpx; padding: 20rpx 30rpx; font-size: 28rpx; color: #333; min-height: 120rpx; line-height: 1.5; width: 100%; box-sizing: border-box; }
.placeholder { color: #ccc; font-size: 28rpx; }
.reply-popup-footer { padding: 0 30rpx; display: flex; justify-content: flex-end; }
.reply-popup-send { padding: 20rpx 40rpx; background: linear-gradient(135deg, #007AFF, #0056CC); border-radius: 20rpx; color: #fff; font-size: 28rpx; font-weight: 500; }
.reply-popup-send.disabled { opacity: 0.6; }

/* 底部操作栏 */
.detail-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 20rpx 30rpx;
  box-shadow: 0 -2rpx 20rpx rgba(0,0,0,0.1);
  z-index: 100;
}

.footer-actions {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.action-collect {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80rpx;
}

.action-text {
  font-size: 20rpx;
  color: #666;
  margin-top: 6rpx;
}

.comment-input-box {
  flex: 1;
  height: 60rpx;
  background: #f0f0f0;
  border-radius: 30rpx;
  padding: 0 30rpx;
  display: flex;
  align-items: center;
}

.placeholder-text {
  font-size: 24rpx;
  color: #999;
}

.action-btn.primary {
  background: #1890ff;
  color: #fff;
  height: 60rpx;
  line-height: 60rpx;
  padding: 0 40rpx;
  border-radius: 30rpx;
  font-size: 28rpx;
  border: none;
}

.action-btn.primary[disabled] {
  background: #ccc;
  color: #fff;
}

.contact-popup {
  background: #fff;
  border-radius: 20rpx;
  width: 560rpx;
  overflow: hidden;
}

.popup-content {
  padding: 50rpx 30rpx 30rpx;
}

.contact-info {
  padding: 30rpx 0;
  border-top: 2rpx solid #f0f0f0;
  border-bottom: 2rpx solid #f0f0f0;
  margin: 30rpx 0;
}

.contact-text {
  font-size: 28rpx;
  color: #333;
  text-align: center;
  display: block;
}

.popup-buttons {
  display: flex;
  gap: 20rpx;
}

.popup-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
  border: none;
}

.popup-btn.copy {
  background: #f0f0f0;
  color: #333;
}

.popup-btn.confirm {
  background: #1890ff;
  color: #fff;
}
.help-time {
  font-size: 24rpx;
  color: #999;
}
</style>