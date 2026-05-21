<template>
  <view class="detail-container">
    <scroll-view class="detail-content" scroll-y>
      <view class="detail-card">
        <!-- 用户信息 -->
        <view class="user-info">
          <image
            class="user-avatar"
            :src="detail.avatar || '/static/default-avatar.png'"
            mode="aspectFill"
          ></image>
          <view class="user-detail">
            <text class="user-name">{{ detail.nickname }}</text>
            <text class="post-time">{{ formatTime(detail.createTime) }}</text>
          </view>
        </view>

        <!-- 标题 -->
        <text class="detail-title" v-if="detail.title">{{ detail.title }}</text>

        <!-- 内容 -->
        <view class="detail-text">
          <text>{{ detail.content }}</text>
        </view>

        <!-- 图片 -->
        <view class="detail-images" v-if="detail.images && detail.images.length > 0">
          <view
            v-for="(img, index) in detail.images"
            :key="index"
            class="detail-image-item"
            @click="previewImage(index)"
          >
            <image :src="img" class="detail-image" mode="aspectFill"></image>
          </view>
        </view>

        <!-- 底部统计 -->
        <view class="detail-meta">
          <view class="meta-stats">
            <view class="meta-stat" @click="toggleLike">
              <uni-icons
                :type="detail.isLiked ? 'heart-filled' : 'heart'"
                :color="detail.isLiked ? '#ff6b6b' : '#999'"
                size="16"
              ></uni-icons>
              <text>{{ detail.likeCount || 0 }}</text>
            </view>
            <view class="meta-stat">
              <uni-icons type="chat" size="16" color="#999"></uni-icons>
              <text>{{ detail.commentCount || 0 }}</text>
            </view>
            <view class="meta-stat" @click="handleCollect">
              <uni-icons
                :type="isCollected ? 'star-filled' : 'star'"
                :color="isCollected ? '#ffc107' : '#999'"
                size="16"
              ></uni-icons>
              <text>收藏</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 评论区域 -->
      <view class="comment-section">
        <view class="section-title">
          <text>评论 {{ commentCount }}</text>
        </view>

        <view v-for="item in commentList" :key="item.id" class="comment-item">
          <view class="comment-content" @click="showReplyInput(item, 'comment')">
            <image class="comment-avatar" :src="item.avatar || '/static/default-avatar.png'" mode="aspectFill"></image>
            <view class="comment-body">
            <view class="comment-user">
              <text class="comment-nickname">{{ item.nickname || '匿名用户' }}</text>
            </view>
            <text class="comment-text">{{ item.content }}</text>
            <view class="comment-info">
              <text class="comment-time">{{ formatTime(item.createTime) }}</text>
              <view class="comment-like" @click.stop="toggleCommentLike(item)" :class="{ liked: item.isLiked }">
                <uni-icons
                  :type="item.isLiked ? 'heart-filled' : 'heart'"
                  :color="item.isLiked ? '#ff6b6b' : '#999'"
                  size="16"
                ></uni-icons>
                <text>{{ item.likeCount || 0 }}</text>
              </view>
              <view v-if="currentUserId && currentUserId === item.createUser" class="comment-delete" @click.stop="deleteComment(item)">
                <uni-icons type="trash" size="14" color="#ccc"></uni-icons>
              </view>
            </view>
            </view>
          </view>

          <!-- 二级回复 -->
          <view v-if="item.children && item.children.length > 0" class="reply-list">
            <view v-for="reply in item.children" :key="reply.id" class="reply-item">
              <view class="reply-content" @click="showReplyInput(item, 'reply', reply)">
                <image class="reply-avatar" :src="reply.avatar || '/static/default-avatar.png'" mode="aspectFill"></image>
                <view class="reply-body">
                <view class="reply-user">
                  <text class="reply-nickname">{{ reply.nickname || '匿名用户' }}</text>
                  <text v-if="reply.replyId && reply.replyId !== item.id" class="reply-target">
                    回复 {{ reply.replyIdNickname }}
                  </text>
                </view>
                <text class="reply-text">{{ reply.content }}</text>
                <view class="reply-info">
                  <text class="reply-time">{{ formatTime(reply.createTime) }}</text>
                  <view class="reply-like" @click.stop="toggleReplyLike(item, reply)" :class="{ liked: reply.isLiked }">
                    <uni-icons
                      :type="reply.isLiked ? 'heart-filled' : 'heart'"
                      :color="reply.isLiked ? '#ff6b6b' : '#999'"
                      size="16"
                    ></uni-icons>
                    <text>{{ reply.likeCount || 0 }}</text>
                </view>
                <view v-if="currentUserId && currentUserId === reply.createUser" class="comment-delete" @click.stop="deleteReply(item, reply)">
                  <uni-icons type="trash" size="14" color="#ccc"></uni-icons>
                </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view
            v-if="item.children && item.children.length > 0 && (item.commentCount || 0) > item.children.length"
            class="load-replies"
            @click="loadMoreReplies(item)"
          >查看更多回复</view>
        </view>

        <view v-if="commentLoading" class="loading-comment">
          <uni-load-more status="loading"></uni-load-more>
        </view>
        <view v-if="commentNoMore && commentList.length > 0" class="no-more-comment">
          <text>没有更多评论了</text>
        </view>
        <view v-if="commentList.length === 0 && !commentLoading" class="empty-comment">
          <image src="/static/hole/empty-comment.png" class="empty-comment-image"></image>
          <text class="empty-comment-text">暂无评论</text>
          <text class="empty-comment-subtext">快来发表第一条评论吧</text>
        </view>
      </view>
    </scroll-view>

    <!-- 回复弹窗 -->
    <uni-popup ref="replyPopup" type="bottom" :mask-click="false" @change="onReplyPopupChange">
      <view class="reply-popup">
        <view class="reply-popup-header">
          <text class="reply-popup-title">回复 {{ replyTargetName }}</text>
          <view class="reply-popup-close" @click="closeReplyPopup">
            <uni-icons type="close" size="20" color="#999"></uni-icons>
          </view>
        </view>
        <view class="reply-popup-content">
          <textarea
            v-model="replyInput"
            class="reply-popup-input"
            :placeholder="`回复 ${replyTargetName}：`"
            placeholder-class="placeholder"
            :focus="true"
            maxlength="500"
            auto-height
          />
        </view>
        <view class="reply-popup-footer">
          <view class="reply-popup-send" @click="submitReply" :class="{ disabled: !replyInput.trim() }">
            <text>发送</text>
          </view>
        </view>
      </view>
    </uni-popup>

    <!-- 评论弹窗 -->
    <uni-popup ref="commentPopup" type="bottom" :mask-click="false" @change="onCommentPopupChange">
      <view class="reply-popup">
        <view class="reply-popup-header">
          <text class="reply-popup-title">发表评论</text>
          <view class="reply-popup-close" @click="closeCommentPopup">
            <uni-icons type="close" size="20" color="#999"></uni-icons>
          </view>
        </view>
        <view class="reply-popup-content">
          <textarea
            v-model="comment.content"
            class="reply-popup-input"
            placeholder="写下你的评论..."
            placeholder-class="placeholder"
            :focus="true"
            maxlength="500"
            auto-height
          />
        </view>
        <view class="reply-popup-footer">
          <view class="reply-popup-send" @click="submitComment" :class="{ disabled: !comment.content.trim() }">
            <text>发送</text>
          </view>
        </view>
      </view>
    </uni-popup>

    <!-- 写评论按钮 -->
    <view class="comment-fab" @click="showCommentPopup" v-if="!showInputPopup">
      <uni-icons type="compose" size="20" color="#fff"></uni-icons>
      <text>写评论</text>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import request from '../../utils/request'

const detail = ref({})
const commentList = ref([])
const currentUserId = computed(() => {
  const cached = uni.getStorageSync('currentUserId')
  if (cached) return String(cached)
  const ui = uni.getStorageSync('userInfo')
  if (ui && ui.userId) return String(ui.userId)
  if (ui && ui.id) return String(ui.id)
  return ''
})

const commentLoading = ref(false)
const commentNoMore = ref(false)
const showInputPopup = ref(false)
const replyInput = ref('')
const replyTargetName = ref('')
const replyPopup = ref(null)
const commentPopup = ref(null)
const postId = ref('')

const replyData = reactive({ parentId: '', replyId: '' })

const comment = reactive({ content: '', parentId: '', replyId: '' })

const commentCount = computed(() => {
  let count = 0
  commentList.value.forEach(item => {
    count++
    if (item.children) count += item.children.length
  })
  return count
})

const isCollected = ref(false)

onLoad((options) => {
  postId.value = options.id
  if (postId.value) {
    fetchDetail()
    fetchComments(true)
    checkCollectionStatus()
    checkLikeStatus()
  }
})

const checkCollectionStatus = async () => {
  try {
    const res = await request.post('/collection/check', { contentId: String(postId.value), contentType: 'alumni' })
    isCollected.value = res.data === true
  } catch (e) { console.error('检查收藏失败', e) }
}

const checkLikeStatus = async () => {
  try {
    const res = await request.post('/like/check', { contentId: String(postId.value), contentType: 'alumni' })
    detail.value.isLiked = res.data === true
  } catch (e) { console.error('检查点赞失败', e) }
}

const handleCollect = async () => {
  if (!uni.getStorageSync('token')) {
    uni.showModal({ title: '提示', content: '请先登录', success: (res) => { if (res.confirm) uni.navigateTo({ url: '/pages/login/login' }) } })
    return
  }
  try {
    if (isCollected.value) {
      await request.post('/collection/cancel', { contentId: postId.value, contentType: 'alumni' })
      isCollected.value = false
      uni.showToast({ title: '已取消收藏' })
    } else {
      await request.post('/collection/add', { contentId: postId.value, contentType: 'alumni' })
      isCollected.value = true
      uni.showToast({ title: '收藏成功' })
    }
  } catch (e) { console.error('收藏操作失败', e) }
}

const fetchDetail = async () => {
  try {
    const res = await request.get('/dynamic/getById', { params: { id: postId.value } })
    if (res.code === 0) detail.value = res.data
  } catch (e) {
    console.error('获取详情失败', e)
  }
}

const fetchComments = async (refresh = false) => {
  if (commentLoading.value) return
  commentLoading.value = true
  try {
    const res = await request.post('/comment/list', { current: 1, size: 50, id: postId.value })
    if (res.code === 0) {
      commentList.value = res.data || []
      commentNoMore.value = true
    }
  } catch (e) {
    console.error('获取评论失败', e)
  } finally {
    commentLoading.value = false
  }
}

const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const diff = now - date
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  if (diff < 604800000) return Math.floor(diff / 86400000) + '天前'
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
}

const previewImage = (index) => {
  uni.previewImage({ urls: detail.value.images, current: index })
}

const toggleLike = async () => {
  if (!uni.getStorageSync('token')) {
    uni.showModal({ title: '提示', content: '请先登录', success: (res) => { if (res.confirm) uni.navigateTo({ url: '/pages/login/login' }) } })
    return
  }
  try {
    const liked = !detail.value.isLiked
    const res = await request.post(liked ? '/like/add' : '/like/cancel', {
      contentId: postId.value,
      contentType: 'alumni'
    })
    if (res.code === 0) {
      detail.value.isLiked = liked
      detail.value.likeCount = liked ? (detail.value.likeCount || 0) + 1 : Math.max(0, (detail.value.likeCount || 1) - 1)
    }
  } catch (e) {
    console.error('点赞失败', e)
  }
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
  uni.showModal({
    title: '提示',
    content: '确定要删除这条评论吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          const result = await request.post('/comment/delete', { commentId: comment.id, contentType: 'alumni' })
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
  uni.showModal({
    title: '提示',
    content: '确定要删除这条回复吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          const result = await request.post('/comment/delete', { commentId: reply.id, contentType: 'alumni' })
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
const submitComment = async () => {
  if (!comment.content.trim()) return
  try {
    const res = await request.post('/comment/insert', { contentId: postId.value, parentId: '', content: comment.content, replyId: '' })
    if (res.code === 0) {
      uni.showToast({ title: '评论成功', icon: 'success' })
      await request.put('/dynamic/comment', null, { params: { id: postId.value } })
      fetchComments(true)
      closeCommentPopup()
    }
  } catch (e) { console.error('评论失败', e) }
}
const submitReply = async () => {
  if (!replyInput.value.trim()) return
  try {
    const res = await request.post('/comment/insert', { contentId: postId.value, parentId: replyData.parentId, content: replyInput.value, replyId: replyData.replyId })
    if (res.code === 0) {
      uni.showToast({ title: '回复成功', icon: 'success' })
      await request.put('/dynamic/comment', null, { params: { id: postId.value } })
      fetchComments(true)
      closeReplyPopup()
    }
  } catch (e) { console.error('回复失败', e) }
}
const loadMoreReplies = async (comment) => {
  try {
    const res = await request.post('/comment/replies', {
      parentId: comment.id, offset: 0, size: 20
    })
    if (res.code === 0) {
      const replies = res.data || []
      comment.children = replies
    }
  } catch (e) { console.error('加载回复失败', e) }
}

const onCommentPopupChange = (e) => { showInputPopup.value = e.show }
const onReplyPopupChange = (e) => { showInputPopup.value = e.show }
</script>

<style scoped>
.detail-container { min-height: 100vh; background-color: #f8f9fa; padding-bottom: 120rpx; }
.detail-content { height: calc(100vh - 120rpx); }
.detail-card { background-color: #fff; border-radius: 20rpx; padding: 40rpx; margin: 20rpx; box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05); }
.user-info { display: flex; align-items: center; margin-bottom: 30rpx; padding-bottom: 30rpx; border-bottom: 2rpx solid #f0f0f0; }
.user-avatar { width: 80rpx; height: 80rpx; border-radius: 50%; margin-right: 20rpx; }
.user-detail { flex: 1; }
.user-name { display: block; font-size: 28rpx; color: #333; font-weight: bold; margin-bottom: 8rpx; }
.post-time { font-size: 24rpx; color: #999; }
.detail-title { font-size: 36rpx; font-weight: bold; color: #333; margin-bottom: 20rpx; display: block; line-height: 1.4; }
.detail-text { font-size: 30rpx; line-height: 1.7; color: #333; margin-bottom: 30rpx; word-break: break-all; }
.detail-images { margin-bottom: 30rpx; }
.detail-image-item { margin-bottom: 20rpx; border-radius: 12rpx; overflow: hidden; background-color: #f5f5f5; }
.detail-image { width: 100%; height: 400rpx; display: block; }
.detail-meta { display: flex; justify-content: flex-end; align-items: center; padding-top: 20rpx; border-top: 1rpx solid #f0f0f0; }
.meta-stats { display: flex; gap: 30rpx; }
.meta-stat { display: flex; align-items: center; gap: 8rpx; font-size: 24rpx; color: #999; }
.comment-section { background-color: #fff; border-radius: 20rpx; padding: 30rpx; margin: 20rpx; box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05); }
.section-title { font-size: 32rpx; font-weight: bold; color: #333; margin-bottom: 30rpx; padding-bottom: 20rpx; border-bottom: 1rpx solid #f0f0f0; }
.comment-item { padding: 30rpx 0; border-bottom: 1rpx solid #f8f8f8; }
.comment-item:last-child { border-bottom: none; }
.comment-content { display: flex; gap: 16rpx; }
.comment-avatar { width: 64rpx; height: 64rpx; border-radius: 50%; flex-shrink: 0; background: #f0f0f0; }
.comment-body { flex: 1; }
.comment-user { margin-bottom: 15rpx; }
.reply-content { display: flex; gap: 12rpx; }
.reply-avatar { width: 48rpx; height: 48rpx; border-radius: 50%; flex-shrink: 0; background: #f0f0f0; }
.reply-body { flex: 1; }
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
.reply-user { display: flex; align-items: center; gap: 10rpx; margin-bottom: 10rpx; flex-wrap: wrap; }
.reply-nickname { font-size: 26rpx; color: #333; font-weight: 500; }
.reply-target { font-size: 24rpx; color: #666; }
.reply-text { font-size: 28rpx; line-height: 1.4; color: #333; margin-bottom: 10rpx; word-break: break-all; }
.reply-info { display: flex; align-items: center; }
.reply-time { font-size: 22rpx; color: #999; }
.reply-like { display: flex; align-items: center; gap: 8rpx; font-size: 22rpx; color: #999; margin-left: auto; }
.reply-like.liked { color: #ff6b6b; }
.loading-comment, .no-more-comment { text-align: center; padding: 40rpx 0; color: #999; font-size: 28rpx; }
.empty-comment { display: flex; flex-direction: column; align-items: center; padding: 60rpx 0; text-align: center; }
.empty-comment-image { width: 200rpx; height: 200rpx; opacity: 0.3; margin-bottom: 30rpx; }
.empty-comment-text { font-size: 28rpx; color: #ccc; margin-bottom: 10rpx; }
.empty-comment-subtext { font-size: 24rpx; color: #ddd; }
.comment-fab { position: fixed; bottom: 100rpx; right: 40rpx; display: flex; align-items: center; gap: 10rpx; padding: 20rpx 30rpx; background: linear-gradient(135deg, #007AFF, #0056CC); color: #fff; border-radius: 50rpx; box-shadow: 0 6rpx 20rpx rgba(0,122,255,0.4); font-size: 28rpx; font-weight: 500; z-index: 999; }
.comment-fab:active { opacity: 0.9; transform: scale(0.98); }
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
</style>
