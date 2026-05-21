<template>
  <view class="detail-container">

    <!-- 树洞内容 -->
    <scroll-view class="detail-content" scroll-y>
      <!-- 树洞卡片 -->
      <view class="detail-card">
        <!-- 内容 -->
        <view class="detail-text">
          <text>{{ holeDetail.content }}</text>
        </view>
        
        <!-- 图片展示 -->
        <view class="detail-images" v-if="holeDetail.images && holeDetail.images.length > 0">
          <view 
            v-for="(img, index) in holeDetail.images" 
            :key="index"
            class="detail-image-item"
            @click="previewImage(index)"
          >
            <image 
              :src="img" 
              class="detail-image"
              mode="aspectFill"
            ></image>
          </view>
        </view>
        
        <!-- 标签 -->
        <view class="detail-tags" v-if="holeDetail.tags && holeDetail.tags.length > 0">
          <view 
            v-for="tag in holeDetail.tags" 
            :key="tag"
            class="detail-tag"
          >
            {{ tag }}
          </view>
        </view>
        
        <!-- 元信息 -->
        <view class="detail-meta">
          <text class="meta-time">{{ formatTime(holeDetail.createTime) }}</text>
          <view class="meta-stats">
            <view class="meta-stat" @click="toggleLike">
              <uni-icons
                :type="holeDetail.isLiked ? 'heart-filled' : 'heart'"
                :color="holeDetail.isLiked ? '#ff6b6b' : '#999'"
                size="16"
              ></uni-icons>
              <text>{{ holeDetail.likeCount || 0 }}</text>
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

      <!-- 评论列表 -->
      <view class="comment-section">
        <view class="section-title">
          <text>评论 {{ commentCount }}</text>
        </view>
        
        <!-- 一级评论列表 -->
        <view 
          v-for="commentItem in commentList" 
          :key="commentItem.id"
          class="comment-item primary-comment"
        >
          <!-- 评论内容 -->
          <view class="comment-content" @click="showReplyInput(commentItem, 'comment')">
            <view class="comment-body">
            <view class="comment-user">
              <text class="comment-nickname">{{ commentItem.nickname || getAnonymousName(commentItem) }}</text>
            </view>
            <text class="comment-text">{{ commentItem.content }}</text>
            <view class="comment-info">
              <text class="comment-time">{{ formatTime(commentItem.createTime) }}</text>
              <view 
                class="comment-like" 
                @click.stop="toggleCommentLike(commentItem)"
                :class="{ liked: commentItem.isLiked }"
              >
                <uni-icons 
                  :type="commentItem.isLiked ? 'heart-filled' : 'heart'" 
                  :color="commentItem.isLiked ? '#ff6b6b' : '#999'"
                  size="16"
                ></uni-icons>
                <text>{{ commentItem.likeCount || 0 }}</text>
              </view>
              <view v-if="currentUserId && currentUserId === commentItem.createUser" class="comment-delete" @click.stop="deleteComment(commentItem)">
                <uni-icons type="trash" size="14" color="#ccc"></uni-icons>
              </view>
            </view>
            </view>
          </view>

          <!-- 二级评论（回复）列表 -->
          <view v-if="commentItem.children && commentItem.children.length > 0" class="reply-list">
            <view 
              v-for="reply in commentItem.children" 
              :key="reply.id"
              class="reply-item"
            >
              <view class="reply-content" @click="showReplyInput(commentItem, 'reply', reply)">
                <view class="reply-body">
                <view class="reply-user">
                  <text class="reply-nickname">{{ reply.nickname || getAnonymousName(reply) }}</text>
                  <!-- 只显示回复其他二级评论的"回复 XXX"，隐藏回复一级评论的 -->
                  <text v-if="reply.replyId && reply.replyId !== commentItem.id && reply.replyIdNickname" class="reply-target">
                    回复 {{ reply.replyIdNickname }}
                  </text>
                </view>
                <text class="reply-text">{{ reply.content }}</text>
                <view class="reply-info">
                  <text class="reply-time">{{ formatTime(reply.createTime) }}</text>
                  <view 
                    class="reply-like" 
                    @click.stop="toggleReplyLike(commentItem, reply)"
                    :class="{ liked: reply.isLiked }"
                  >
                    <uni-icons 
                      :type="reply.isLiked ? 'heart-filled' : 'heart'" 
                      :color="reply.isLiked ? '#ff6b6b' : '#999'"
                      size="16"
                    ></uni-icons>
                    <text>{{ reply.likeCount || 0 }}</text>
                  </view>
                  <view v-if="currentUserId && currentUserId === reply.createUser" class="comment-delete" @click.stop="deleteReply(commentItem, reply)">
                    <uni-icons type="trash" size="14" color="#ccc"></uni-icons>
                  </view>
                </view>
                </view>
              </view>
            </view>

            <!-- 查看更多回复 -->
            <view 
              v-if="commentItem.children && commentItem.children.length < commentItem.replyCount" 
              class="view-more-replies"
              @click="loadMoreReplies(commentItem)"
            >
              <text>查看全部{{ commentItem.replyCount }}条回复</text>
              <uni-icons type="arrowdown" size="16" color="#999"></uni-icons>
            </view>
          </view>
        </view>
        
        <!-- 加载更多 -->
        <view v-if="commentLoading" class="loading-comment">
          <uni-load-more status="loading"></uni-load-more>
        </view>
        
        <view v-if="commentNoMore" class="no-more-comment">
          <text>没有更多评论了</text>
        </view>
        
        <!-- 空评论 -->
        <view v-if="commentList.length === 0 && !commentLoading" class="empty-comment">
          <image src="/static/hole/empty-comment.png" class="empty-comment-image"></image>
          <text class="empty-comment-text">暂无评论</text>
          <text class="empty-comment-subtext">快来发表第一条评论吧</text>
        </view>
      </view>
    </scroll-view>

    <!-- 回复输入框（弹出层） -->
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
            cursor-spacing="20"
          />
        </view>
        <view class="reply-popup-footer">
          <view class="reply-popup-send" @click="submitReply" :class="{ disabled: !replyInput.trim() }">
            <text>发送</text>
          </view>
        </view>
      </view>
    </uni-popup>

    <!-- 评论输入框（弹出层） -->
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
            cursor-spacing="20"
          />
        </view>
        <view class="reply-popup-footer">
          <view class="reply-popup-send" @click="submitComment" :class="{ disabled: !comment.content.trim() }">
            <text>发送</text>
          </view>
        </view>
      </view>
    </uni-popup>

    <!-- 底部评论按钮（在弹出层显示时隐藏） -->
    <view class="comment-fab" @click="showCommentPopup" v-if="!showInputPopup">
      <uni-icons type="compose" size="20" color="#fff"></uni-icons>
      <text>写评论</text>
    </view>

    <!-- 操作菜单 -->
    <uni-popup ref="actionPopup" type="bottom">
      <view class="action-popup">
        <view class="action-item" @click="shareHole">
          <uni-icons type="share" size="20" color="#333"></uni-icons>
          <text>分享</text>
        </view>
        <view class="action-item" @click="reportHole">
          <uni-icons type="flag" size="20" color="#333"></uni-icons>
          <text>举报</text>
        </view>
        <view class="action-item cancel" @click="closeActionPopup">
          <text>取消</text>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import request from '../../utils/request'

// 响应式数据
const holeDetail = ref({})
const commentList = ref([])
const currentUserId = computed(() => {
  const cached = uni.getStorageSync('currentUserId')
  if (cached) return String(cached)
  const ui = uni.getStorageSync('userInfo')
  if (ui && ui.userId) return String(ui.userId)
  if (ui && ui.id) return String(ui.id)
  return ''
})

const replyInput = ref('')
const actionPopup = ref(null)
const replyPopup = ref(null)
const commentPopup = ref(null)
const commentLoading = ref(false)
const commentNoMore = ref(false)
const holeId = ref('')

// 控制评论按钮显示
const showInputPopup = ref(false)

// 匿名用户映射表
const anonymousNameMap = ref({})

// 回复相关数据
const replyData = reactive({
  contentId: '',
  parentId: '',       // 父评论ID（一级评论的ID）
  content: '',
  replyId: ''         // 回复的目标评论ID
})
const replyTargetName = ref('')
const replyTargetComment = ref(null)

const comment = reactive({
  contentId: '',
  parentId: '',
  content: '',
  replyId: ''
})

const page = ref({
  current: 1,
  size: 5,
  id: ''
})

// 计算属性
const commentCount = computed(() => {
  let count = 0
  commentList.value.forEach(item => {
    count++ // 一级评论
    if (item.children) {
      count += item.children.length
    }
  })
  return count
})

const isCollected = ref(false)

onLoad((options) => {
  holeId.value = options.id
  if (holeId.value) {
    fetchHoleDetail()
    fetchComments(true)
    checkCollectionStatus()
    checkLikeStatus()
  }
})

const checkCollectionStatus = async () => {
  try {
    const res = await request.post('/collection/check', { contentId: String(holeId.value), contentType: 'hole' })
    isCollected.value = res.data === true
  } catch (e) { console.error('检查收藏失败', e) }
}

const checkLikeStatus = async () => {
  try {
    const res = await request.post('/like/check', { contentId: String(holeId.value), contentType: 'hole' })
    holeDetail.value.isLiked = res.data === true
  } catch (e) { console.error('检查点赞失败', e) }
}

const handleCollect = async () => {
  if (!uni.getStorageSync('token')) {
    uni.showModal({ title: '提示', content: '请先登录', success: (res) => { if (res.confirm) uni.navigateTo({ url: '/pages/login/login' }) } })
    return
  }
  try {
    if (isCollected.value) {
      await request.post('/collection/cancel', { contentId: holeId.value, contentType: 'hole' })
      isCollected.value = false
      uni.showToast({ title: '已取消收藏' })
    } else {
      await request.post('/collection/add', { contentId: holeId.value, contentType: 'hole' })
      isCollected.value = true
      uni.showToast({ title: '收藏成功' })
    }
  } catch (e) { console.error('收藏操作失败', e) }
}

// 生成匿名用户名
const getAnonymousName = (comment) => {
  if (!comment.createUser) return '匿名用户'
  
  // 为每个树洞创建独立的匿名用户映射
  if (!anonymousNameMap.value[comment.createUser]) {
    // 生成三位数的随机数作为匿名用户标识
    const randomNum = Math.floor(Math.random() * 90000) + 10000
    anonymousNameMap.value[comment.createUser] = `匿名用户${randomNum}`
  }
  
  return anonymousNameMap.value[comment.createUser]
}

// 获取树洞详情
const fetchHoleDetail = async () => {
  try {
    const res = await request.get('/hole/getById', {
      params: { id: holeId.value }
    })
    if (res.code === 0) {
      holeDetail.value = res.data
    }
  } catch (error) {
    console.error('获取详情失败', error)
  }
}

// 获取评论（包含回复）
const fetchComments = async (refresh = false) => {
  if (commentLoading.value) return
  
  commentLoading.value = true
  
  try {
    page.value.id = holeId.value
    const res = await request.post('/comment/list', page.value)
	
    if (res.code === 0) {
      const comments = res.data || []
      
      // 处理评论数据，添加匿名用户名
      comments.forEach(item => {
        item.nickname = getAnonymousName(item)
        
        // 如果有回复列表，也处理回复
        if (item.children && item.children.length > 0) {
          item.children.forEach(child => {
            child.nickname = getAnonymousName(child)
            
            // 如果回复有目标用户，获取目标用户的匿名名
            if (child.replyId) {
              const targetComment = comments.find(c => c.id === child.replyId)
              if (targetComment) {
                child.replyIdNickname = targetComment.nickname || getAnonymousName(targetComment)
              } else {
                // 如果找不到目标评论，尝试在子评论中查找
                for (const parent of comments) {
                  if (parent.children) {
                    const targetReply = parent.children.find(r => r.id === child.replyId)
                    if (targetReply) {
                      child.replyIdNickname = targetReply.nickname || getAnonymousName(targetReply)
                      break
                    }
                  }
                }
              }
            }
          })
        }
      })
      
      // 处理回复结构
      const commentMap = {}
      const rootComments = []
      
      // 首先找出所有一级评论
      comments.forEach(item => {
        if (!item.parentId) {
          commentMap[item.id] = {
            ...item,
            children: item.children || []
          }
          rootComments.push(commentMap[item.id])
        }
      })
      
      // 将回复挂到对应的一级评论下
      comments.forEach(item => {
        if (item.parentId && commentMap[item.parentId]) {
          commentMap[item.parentId].children.push(item)
        }
      })
      
      if (refresh) {
        commentList.value = rootComments
      } else {
        commentList.value = [...commentList.value, ...rootComments]
      }
      
      if (comments.length < page.value.size) {
        commentNoMore.value = true
      } else {
        page.value.current++
      }
    }
  } catch (error) {
    console.error('获取评论失败', error)
  } finally {
    commentLoading.value = false
  }
}

// 监听评论弹出层状态变化
const onCommentPopupChange = (e) => {
  showInputPopup.value = e.show
}

// 监听回复弹出层状态变化
const onReplyPopupChange = (e) => {
  showInputPopup.value = e.show
}

// 显示评论输入框
const showCommentPopup = () => {
  comment.content = ''
  commentPopup.value.open()
  showInputPopup.value = true
}

// 关闭评论输入框
const closeCommentPopup = () => {
  commentPopup.value.close()
  comment.content = ''
  showInputPopup.value = false
}

// 显示回复输入框
const showReplyInput = (comment, type, reply = null) => {
  replyTargetComment.value = comment
  
  if (type === 'comment') {
    // 回复一级评论
    replyTargetName.value = comment.nickname || getAnonymousName(comment)
    replyData.parentId = comment.id
    replyData.replyId = comment.id
  } else if (type === 'reply') {
    // 回复二级评论
    replyTargetName.value = reply.nickname || getAnonymousName(reply)
    replyData.parentId = comment.id
    replyData.replyId = reply.id
  }
  
  replyInput.value = ''
  replyPopup.value.open()
  showInputPopup.value = true
}

// 关闭回复输入框
const closeReplyPopup = () => {
  replyPopup.value.close()
  replyInput.value = ''
  replyTargetName.value = ''
  replyData.parentId = ''
  replyData.replyId = ''
  replyTargetComment.value = null
  showInputPopup.value = false
}

// 提交回复
const submitReply = async () => {
  if (!replyInput.value.trim()) {
    uni.showToast({
      title: '请输入回复内容',
      icon: 'none'
    })
    return
  }
  
  try {
    const data = {
      contentId: holeId.value,
      parentId: replyData.parentId,
      content: replyInput.value,
      replyId: replyData.replyId
    }
    
    const res = await request.post('/comment/insert', data)
	//修改评论数
	await request.put('/hole/comment',null,{params:{id : holeId.value}})
    
    if (res.code === 0) {
      uni.showToast({
        title: '回复成功',
        icon: 'success'
      })
      
      // 刷新评论列表
      fetchComments(true)
      
      // 关闭弹出层
      closeReplyPopup()
    } else {
      uni.showToast({
        title: res.msg || '回复失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('回复失败', error)
    uni.showToast({
      title: '回复失败，请重试',
      icon: 'none'
    })
  }
}

// 提交一级评论
const submitComment = async () => {
  if (!comment.content.trim()) {
    uni.showToast({
      title: '请输入评论内容',
      icon: 'none'
    })
    return
  }
  
  try {
    const data = {
      contentId: holeId.value,
      parentId: '',
      content: comment.content,
      replyId: ''
    }
    
    const res = await request.post('/comment/insert', data)
	await request.put('/hole/comment',null,{params:{id : holeId.value}})
    
    if (res.code === 0) {
      uni.showToast({
        title: '评论成功',
        icon: 'success'
      })
      
      // 刷新评论列表
      fetchComments(true)
      
      // 关闭弹出层
      closeCommentPopup()
    } else {
      uni.showToast({
        title: res.msg || '评论失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('评论失败', error)
    uni.showToast({
      title: '评论失败，请重试',
      icon: 'none'
    })
  }
}

// 点赞评论
const toggleCommentLike = async (comment) => {
  try {
    const res = await request.post('/comment/like', {
      commentId: comment.id,
      isLike: !comment.isLiked
    })
    
    if (res.code === 0) {
      comment.isLiked = !comment.isLiked
      comment.likeCount = comment.isLiked 
        ? (comment.likeCount || 0) + 1 
        : Math.max(0, (comment.likeCount || 1) - 1)
    }
  } catch (error) {
    console.error('评论点赞失败', error)
  }
}

// 点赞回复
const toggleReplyLike = async (parentComment, reply) => {
  try {
    const res = await request.post('/comment/like', {
      commentId: reply.id,
      isLike: !reply.isLiked
    })
    
    if (res.code === 0) {
      reply.isLiked = !reply.isLiked
      reply.likeCount = reply.isLiked 
        ? (reply.likeCount || 0) + 1 
        : Math.max(0, (reply.likeCount || 1) - 1)
    }
  } catch (error) {
    console.error('回复点赞失败', error)
  }
}

const deleteComment = (comment) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除这条评论吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          const result = await request.post('/comment/delete', { commentId: comment.id, contentType: 'hole' })
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
          const result = await request.post('/comment/delete', { commentId: reply.id, contentType: 'hole' })
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

// 加载更多回复
const loadMoreReplies = async (comment) => {
  try {
    const res = await request.get('/comment/replies', {
      params: {
        parentId: comment.id,
        page: 1,
        size: 20
      }
    })
    
    if (res.code === 0) {
      const replies = res.data || []
      // 为回复添加匿名用户名
      replies.forEach(reply => {
        reply.nickname = getAnonymousName(reply)
      })
      comment.children = replies
    }
  } catch (error) {
    console.error('加载回复失败', error)
  }
}

// 返回
const goBack = () => {
  uni.navigateBack()
}

// 预览图片
const previewImage = (index) => {
  uni.previewImage({
    urls: holeDetail.value.images,
    current: index
  })
}

// 时间格式化
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

// 点赞/取消点赞
const toggleLike = async () => {
  if (!uni.getStorageSync('token')) {
    uni.showModal({ title: '提示', content: '请先登录', success: (res) => { if (res.confirm) uni.navigateTo({ url: '/pages/login/login' }) } })
    return
  }
  try {
    const liked = !holeDetail.value.isLiked
    const res = await request.post(liked ? '/like/add' : '/like/cancel', {
      contentId: holeId.value,
      contentType: 'hole'
    })
    if (res.code === 0) {
      holeDetail.value.isLiked = liked
      holeDetail.value.likeCount = liked
        ? (holeDetail.value.likeCount || 0) + 1
        : Math.max(0, (holeDetail.value.likeCount || 1) - 1)
    }
  } catch (error) {
    console.error('点赞失败', error)
  }
}

// 显示操作菜单
const showActionSheet = () => {
  actionPopup.value.open()
}

// 关闭操作菜单
const closeActionPopup = () => {
  actionPopup.value.close()
}

// 分享
const shareHole = () => {
  closeActionPopup()
  uni.showModal({
    title: '分享',
    content: '将树洞分享给好友',
    showCancel: false
  })
}

// 举报
const reportHole = () => {
  closeActionPopup()
  uni.showModal({
    title: '举报',
    content: '确定举报这条树洞吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '举报成功',
          icon: 'success'
        })
      }
    }
  })
}
</script>

<style scoped>
.detail-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-top: 20rpx;
  padding-bottom: 120rpx;
}

/* 内容区 */
.detail-content {
  height: calc(100vh - 120rpx);
}

/* 树洞卡片 */
.detail-card {
  background-color: white;
  border-radius: 20rpx;
  padding: 40rpx;
  margin: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.detail-text {
  font-size: 34rpx;
  line-height: 1.6;
  color: #333;
  margin-bottom: 40rpx;
  word-break: break-all;
}

/* 图片展示 */
.detail-images {
  margin-bottom: 40rpx;
}

.detail-image-item {
  margin-bottom: 20rpx;
  border-radius: 12rpx;
  overflow: hidden;
  background-color: #f5f5f5;
}

.detail-image {
  width: 100%;
  height: 400rpx;
  display: block;
}

/* 标签 */
.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.detail-tag {
  padding: 8rpx 20rpx;
  background-color: #e6f7ff;
  color: #1890ff;
  border-radius: 20rpx;
  font-size: 24rpx;
}

/* 元信息 */
.detail-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.meta-time {
  font-size: 24rpx;
  color: #999;
}

.meta-stats {
  display: flex;
  gap: 30rpx;
}

.meta-stat {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: #999;
}

/* 评论区域 */
.comment-section {
  background-color: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

/* 一级评论 */
.comment-item.primary-comment {
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f8f8f8;
  position: relative;
}

.comment-item.primary-comment:last-child {
  border-bottom: none;
}

.comment-content { display: flex; gap: 16rpx; margin-bottom: 20rpx; padding-right: 0; }
.comment-avatar { width: 64rpx; height: 64rpx; border-radius: 50%; flex-shrink: 0; background: #f0f0f0; }
.reply-avatar { width: 48rpx; height: 48rpx; border-radius: 50%; flex-shrink: 0; background: #f0f0f0; }
.comment-content-nobody {
}

.comment-user {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
}

.comment-nickname {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}

.comment-text {
  font-size: 28rpx;
  line-height: 1.5;
  color: #333;
  display: block;
  margin-bottom: 15rpx;
  word-break: break-all;
}

.comment-info {
  display: flex;
  align-items: center;
  padding-top: 10rpx;
  border-top: 1rpx solid #f0f0f0;
  margin-top: 10rpx;
}

.comment-time {
  font-size: 24rpx;
  color: #999;
}

.comment-like {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: #999;
  padding: 4rpx 8rpx;
  border-radius: 4rpx;
  margin-left: auto;
}

.comment-like.liked {
  color: #ff6b6b;
}
.comment-delete { margin-left: 20rpx; padding: 4rpx; }

/* 二级评论列表 */
.reply-list {
  margin-top: 20rpx;
  margin-left: 40rpx;
  padding-left: 20rpx;
  border-left: 2rpx solid #f0f0f0;
}

.reply-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f8f8f8;
  position: relative;
}

.reply-item:last-child {
  border-bottom: none;
}

.reply-content { display: flex; gap: 12rpx; padding-right: 0; }
.comment-body { flex: 1; }
.reply-body { flex: 1; }

.reply-user {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-bottom: 10rpx;
  flex-wrap: wrap;
}

.reply-nickname {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
}

.reply-target {
  font-size: 24rpx;
  color: #666;
}

.reply-text {
  font-size: 28rpx;
  line-height: 1.4;
  color: #333;
  margin-bottom: 10rpx;
  word-break: break-all;
}

.reply-info {
  display: flex;
  align-items: center;
  padding-top: 8rpx;
  border-top: 1rpx solid #f0f0f0;
  margin-top: 8rpx;
}

.reply-time {
  font-size: 22rpx;
  color: #999;
}

.reply-like {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 22rpx;
  color: #999;
  padding: 4rpx 8rpx;
  border-radius: 4rpx;
  margin-left: auto;
}

.reply-like.liked {
  color: #ff6b6b;
}

/* 查看更多回复 */
.view-more-replies {
  display: flex;
  align-items: center;
  gap: 10rpx;
  font-size: 24rpx;
  color: #999;
  padding: 20rpx 0;
  justify-content: center;
  background-color: #f8f9fa;
  border-radius: 10rpx;
  margin-top: 10rpx;
}

/* 回复弹出层 */
.reply-popup {
  background-color: white;
  border-radius: 40rpx 40rpx 0 0;
  padding-bottom: 30rpx;
  padding-bottom: env(safe-area-inset-bottom);
}

.reply-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 30rpx 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.reply-popup-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.reply-popup-close {
  padding: 10rpx;
  border-radius: 50%;
  background-color: #f8f9fa;
}

.reply-popup-content {
  padding: 30rpx;
}

.reply-popup-input {
  background-color: #f8f9fa;
  border-radius: 20rpx;
  padding: 20rpx 30rpx;
  font-size: 28rpx;
  color: #333;
  min-height: 120rpx;
  line-height: 1.5;
  width: 100%;
  box-sizing: border-box;
  resize: none;
}

.placeholder {
  color: #ccc;
  font-size: 28rpx;
}

.reply-popup-footer {
  padding: 0 30rpx;
  display: flex;
  justify-content: flex-end;
}

.reply-popup-send {
  padding: 20rpx 40rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  color: white;
  font-size: 28rpx;
  font-weight: 500;
  opacity: 1;
  transition: opacity 0.3s;
}

.reply-popup-send.disabled {
  opacity: 0.6;
}

/* 加载状态 */
.loading-comment,
.no-more-comment {
  text-align: center;
  padding: 40rpx 0;
  color: #999;
  font-size: 28rpx;
}

/* 空评论 */
.empty-comment {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 0;
  text-align: center;
}

.empty-comment-image {
  width: 200rpx;
  height: 200rpx;
  opacity: 0.3;
  margin-bottom: 30rpx;
}

.empty-comment-text {
  font-size: 28rpx;
  color: #ccc;
  margin-bottom: 10rpx;
}

.empty-comment-subtext {
  font-size: 24rpx;
  color: #ddd;
}

/* 底部评论按钮 */
.comment-fab {
  position: fixed;
  bottom: 100rpx;
  right: 40rpx;
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 20rpx 30rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50rpx;
  box-shadow: 0 6rpx 20rpx rgba(102, 126, 234, 0.4);
  font-size: 28rpx;
  font-weight: 500;
  z-index: 999;
  transition: transform 0.3s, opacity 0.3s;
}

.comment-fab:active {
  opacity: 0.9;
  transform: scale(0.98);
}

.comment-fab-hide {
  transform: translateY(100rpx);
  opacity: 0;
  pointer-events: none;
}

/* 操作菜单 */
.action-popup {
  background-color: white;
  border-radius: 40rpx 40rpx 0 0;
  padding: 40rpx 30rpx;
  padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
}

.action-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  padding: 30rpx;
  font-size: 32rpx;
  color: #333;
  border-bottom: 1rpx solid #f0f0f0;
}

.action-item:last-child {
  border-bottom: none;
}

.action-item.cancel {
  color: #ff4444;
  font-weight: 500;
  margin-top: 20rpx;
  background-color: #f8f9fa;
  border-radius: 20rpx;
}
</style>