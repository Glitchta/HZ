<template>
  <view class="edit-container">

    <!-- 主要内容区 -->
    <scroll-view class="scroll-view" scroll-y="true" :scroll-with-animation="true">
	<view class="form-container">	
      <!-- 头像上传 -->
      <view class="avatar-section">
        <view class="section-title">头像</view>
        <view class="avatar-upload" @click="chooseAvatar">
          <view class="avatar-preview">
            <image 
              :src="formData.avatar" 
              class="avatar-image" 
              mode="aspectFill"
              v-if="formData.avatar"
            ></image>
            <view class="avatar-placeholder" v-else>
              <uni-icons type="person" size="60" color="#999"></uni-icons>
            </view>
            <view class="avatar-edit-overlay">
              <uni-icons type="camera" size="30" color="#fff"></uni-icons>
            </view>
          </view>
          <text class="avatar-tips">点击更换头像</text>
        </view>
      </view>

      <!-- 个人信息表单 -->
      <view class="form-section">
        <view class="section-title">基本信息</view>
        
        <view class="form-item">
          <text class="item-label">昵称</text>
          <input 
            v-model="formData.nickname" 
            class="item-input" 
            placeholder="请输入昵称"
            maxlength="20"
            :disabled="isSaving"
          />
          <text class="input-count">{{ formData.nickname.length }}/20</text>
        </view>

        <view class="form-item">
          <text class="item-label">性别</text>
          <picker 
            :range="genderOptions" 
            :value="genderIndex" 
            @change="onGenderChange"
            :disabled="isSaving"
          >
            <view class="picker-item">
              <text>{{ genderOptions[genderIndex] || '请选择性别' }}</text>
              <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
            </view>
          </picker>
        </view>

        <view class="form-item">
          <text class="item-label">生日</text>
          <picker 
            mode="date" 
            :value="formData.birthday" 
            @change="onBirthdayChange"
            :start="minDate"
            :end="maxDate"
            :disabled="isSaving"
          >
            <view class="picker-item">
              <text>{{ formData.birthday || '请选择出生日期' }}</text>
              <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
            </view>
          </picker>
        </view>

        <view class="form-item">
          <text class="item-label">专业</text>
          <input 
            v-model="formData.major" 
            class="item-input" 
            placeholder="请输入专业"
            maxlength="30"
            :disabled="isSaving"
          />
        </view>

        <view class="form-item">
          <text class="item-label">手机号</text>
          <input 
            v-model="formData.phone" 
            class="item-input" 
            placeholder="请输入手机号"
            type="number"
            maxlength="11"
            :disabled="isSaving"
          />
        </view>

        <view class="form-item">
          <text class="item-label">邮箱</text>
          <input 
            v-model="formData.email" 
            class="item-input" 
            placeholder="请输入邮箱"
            type="email"
            :disabled="isSaving"
          />
        </view>
</view>
      <!-- 个人简介 -->
      <view class="form-section">
        <view class="section-title">个人签名</view>
        <view class="intro-item">
          <textarea 
            v-model="formData.sign" 
            class="intro-textarea" 
            placeholder="介绍一下自己吧..."
            maxlength="200"
            :auto-height="true"
            :disabled="isSaving"
          />
          <view class="intro-counter">
            <text class="counter-text">{{ formData.sign.length }}/200</text>
          </view>
        </view>
      </view>
 </view>
    </scroll-view>
<!-- 底部操作栏 -->
    <view class="bottom-bar" :class="{'with-safe-area': isIphoneX}">
      <button 
        class="submit-btn" 
        @click="saveInfo"
      >
        保存
      </button>
    </view>
</view>


</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { onShow, onLoad } from '@dcloudio/uni-app'
import request from '../../utils/request'

// 表单数据
const formData = reactive({
  avatar: '',
  nickname: '',
  gender: 0, // 0: 未选择, 1: 男, 2: 女
  birthday: '',
  major: '',
  phone: '',
  email: '',
})

// 状态管理
const isSaving = ref(false)
const genderIndex = ref(0)
const newTag = ref('')
const showAddTag = ref(false)
const tagPopup = ref(null)
const tagDrawer = ref(null)
const originalData = reactive({})

// 预设选项
const genderOptions = ['未选择', '男', '女']
// 日期范围
const minDate = '1950-01-01'
const maxDate = computed(() => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
})

// 页面加载
onLoad(() => {
  loadUserInfo()
})

// 加载用户信息
const loadUserInfo = async () => {
  try {
    uni.showLoading({ title: '加载中...', mask: true })
    
    const res = await request.get("/userInfo/get")
    const user = res.data
    
    // 填充表单数据
    formData.avatar = user.avatar || ''
    formData.nickname = user.nickname || ''
    formData.gender = user.gender || 0
    formData.birthday = user.birthday || ''
    formData.major = user.major || ''
    formData.phone = user.phone || ''
    formData.email = user.email || ''
    formData.sign = user.sign || ''
    
    // 设置性别选择器索引
    genderIndex.value = formData.gender
    
    // 保存原始数据用于比较
    Object.assign(originalData, JSON.parse(JSON.stringify(formData)))
    
  } catch (error) {
    console.error('加载用户信息失败', error)
    uni.showToast({
      title: '加载失败',
      icon: 'error',
      duration: 2000
    })
  } finally {
    uni.hideLoading()
  }
}

// 选择头像
const chooseAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async (res) => {
      const tempFilePath = res.tempFilePaths[0]
      
      // 这里可以添加上传到服务器的逻辑
      try {
        const result = await request.upload('/upload/image', tempFilePath, 'file', {})
        
        if (result && result.code === 0) {
          // 保存服务器返回的url
          formData.avatar = result.data.url
          console.log('上传成功:', formData)
        } else {
          throw new Error(result.msg || '上传失败')
        }
      } catch (error) {
        console.error('上传图片失败', error)
        uni.showToast({
          title: error.message || '上传失败',
          icon: 'none'
        })
      }
    },
    fail: (error) => {
      console.error('选择图片失败', error)
    }
  })
}

// 性别选择
const onGenderChange = (e) => {
  const index = e.detail.value
  genderIndex.value = index
  formData.gender = index
}

// 生日选择
const onBirthdayChange = (e) => {
  formData.birthday = e.detail.value
}

// 保存信息
const saveInfo = async () => {
  // 表单验证
  if (!validateForm()) {
    return
  }
  
  // 检查是否有修改
  if (!hasChanges()) {
    uni.showToast({
      title: '没有修改内容',
      icon: 'none',
      duration: 1500
    })
    return
  }
  
  isSaving.value = true
  
  try {
    
    // 准备提交数据
    const submitData = {
      ...formData,
      gender: parseInt(formData.gender)
    }
    
    // 调用更新接口
    const res = await request.put("/userInfo/update", submitData)
    
    if (res.code === 0) {
      
      // 更新原始数据
      Object.assign(originalData, JSON.parse(JSON.stringify(formData)))
      
      uni.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 1500
      })
      
      // 返回上一页
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    } else {
      throw new Error(res.message || '保存失败')
    }
    
  } catch (error) {
    console.error('保存失败', error)
    uni.showToast({
      title: error.message || '保存失败',
      icon: 'error',
      duration: 2000
    })
  } finally {
    isSaving.value = false
  }
}

// 表单验证
const validateForm = () => {
  // 昵称验证
  if (!formData.nickname.trim()) {
    uni.showToast({
      title: '请输入昵称',
      icon: 'none',
      duration: 2000
    })
    return false
  }
  
  if (formData.nickname.length < 2) {
    uni.showToast({
      title: '昵称至少2个字符',
      icon: 'none',
      duration: 2000
    })
    return false
  }
  
  // 手机号验证
  if (formData.phone && !/^1[3-9]\d{9}$/.test(formData.phone)) {
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none',
      duration: 2000
    })
    return false
  }
  
  // 邮箱验证
  if (formData.email && !/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(formData.email)) {
    uni.showToast({
      title: '请输入正确的邮箱',
      icon: 'none',
      duration: 2000
    })
    return false
  }
  
  return true
}

// 检查是否有修改
const hasChanges = () => {
  return JSON.stringify(formData) !== JSON.stringify(originalData)
}

// 标签管理
const showTagModal = () => {
  tagDrawer.value.open()
}

const closeTagDrawer = () => {
  tagDrawer.value.close()
}

const toggleTag = (tag) => {
  const index = formData.tags.indexOf(tag)
  if (index > -1) {
    formData.tags.splice(index, 1)
  } else if (formData.tags.length < 5) {
    formData.tags.push(tag)
  } else {
    uni.showToast({
      title: '最多添加5个标签',
      icon: 'none',
      duration: 1500
    })
  }
}

const removeTag = (index) => {
  formData.tags.splice(index, 1)
}

const addTag = () => {
  if (!newTag.value.trim()) {
    uni.showToast({
      title: '请输入标签内容',
      icon: 'none',
      duration: 1500
    })
    return
  }
  
  if (formData.tags.length >= 5) {
    uni.showToast({
      title: '最多添加5个标签',
      icon: 'none',
      duration: 1500
    })
    return
  }
  
  if (formData.tags.includes(newTag.value)) {
    uni.showToast({
      title: '标签已存在',
      icon: 'none',
      duration: 1500
    })
    return
  }
  
  if (newTag.value.length > 6) {
    uni.showToast({
      title: '标签最多6个字',
      icon: 'none',
      duration: 1500
    })
    return
  }
  
  formData.tags.push(newTag.value)
  newTag.value = ''
  showAddTag.value = false
}

const cancelAddTag = () => {
  newTag.value = ''
  showAddTag.value = false
}

// 返回上一页
const goBack = () => {
  if (hasChanges()) {
    uni.showModal({
      title: '提示',
      content: '您有未保存的修改，确定要离开吗？',
      success: (res) => {
        if (res.confirm) {
          uni.navigateBack()
        }
      }
    })
  } else {
    uni.navigateBack()
  }
}

// 页面显示时重新检查登录状态
onShow(() => {
  const isLoggedIn = uni.getStorageSync('isLoggedIn')
  if (!isLoggedIn) {
    uni.showModal({
      title: '未登录',
      content: '请先登录',
      showCancel: false,
      success: () => {
        uni.navigateTo({
          url: '/pages/login/login'
        })
      }
    })
  }
})

// 页面卸载前提示保存
onUnmounted(() => {
  if (hasChanges() && !isSaving.value) {
    // 这里可以添加自动保存的逻辑
  }
})

// 暴露方法
defineExpose({
  formData,
  saveInfo,
  loadUserInfo
})
</script>

<style scoped>
.edit-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

/* 导航栏样式 */
.nav-bar {
  height: 88rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-left {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #333;
}

.nav-left text {
  margin-left: 8rpx;
}

.nav-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.nav-right {
  width: 120rpx;
  text-align: right;
}

.save-btn {
  font-size: 28rpx;
  color: #007AFF;
  font-weight: 500;
}

.save-btn.saving {
  color: #999;
}

/* 内容区域 */
.content {
  flex: 1;
  padding: 0 30rpx 30rpx;
}

/* 区块样式 */
.avatar-section,
.form-section {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.section-title.with-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-text {
  font-size: 24rpx;
  color: #007AFF;
  font-weight: normal;
}

/* 头像上传 */
.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-preview {
  position: relative;
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f0f0f0;
  margin-bottom: 20rpx;
}

.avatar-image {
  width: 100%;
  height: 100%;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e0e0e0;
}

.avatar-edit-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-preview:hover .avatar-edit-overlay {
  opacity: 1;
}

.avatar-tips {
  font-size: 24rpx;
  color: #999;
}

/* 表单项目 */
.form-item {
  display: flex;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
  position: relative;
}

.form-item:last-child {
  border-bottom: none;
}

.item-label {
  width: 140rpx;
  font-size: 28rpx;
  color: #333;
  flex-shrink: 0;
}

.item-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  padding: 0 20rpx;
  min-height: 40rpx;
}

.picker-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
  min-height: 40rpx;
}

.picker-item text {
  color: #999;
}

.input-count {
  position: absolute;
  right: 0;
  bottom: 10rpx;
  font-size: 24rpx;
  color: #999;
}

/* 个人简介 */
.intro-item {
  position: relative;
}

.intro-textarea {
  width: 95%;
  min-height: 200rpx;
  padding: 20rpx;
  background-color: #f8f8f8;
  border-radius: 10rpx;
  font-size: 28rpx;
  line-height: 1.5;
  color: #333;
}

.intro-counter {
  text-align: right;
  margin-top: 10rpx;
}

.counter-text {
  font-size: 24rpx;
  color: #999;
}

/* 标签样式 */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  padding: 10rpx 20rpx;
  background-color: #f0f7ff;
  border-radius: 30rpx;
  font-size: 24rpx;
  color: #007AFF;
  border: 1rpx solid #cce5ff;
}

.tag-item.add-tag {
  background-color: #fff;
  border: 1rpx dashed #007AFF;
  color: #007AFF;
}

.tag-item text {
  margin-right: 8rpx;
}

.tags-tips {
  display: block;
  font-size: 24rpx;
  color: #999;
  text-align: center;
}

/* 抽屉样式 */
.drawer-content {
  padding: 40rpx 30rpx;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.drawer-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.tag-category {
  margin-bottom: 40rpx;
}

.category-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #666;
  margin-bottom: 20rpx;
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.tag-option {
  padding: 12rpx 24rpx;
  background-color: #f5f5f5;
  border-radius: 30rpx;
  font-size: 24rpx;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8rpx;
  transition: all 0.3s;
}

.tag-option.selected {
  background-color: #007AFF;
  color: #fff;
}

/* 添加标签输入框 */
.add-tag-input {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 30rpx;
  border-top: 1rpx solid #f0f0f0;
  box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.1);
  z-index: 1000;
}

.tag-input {
  width: 100%;
  padding: 20rpx 30rpx;
  background-color: #f8f8f8;
  border-radius: 10rpx;
  font-size: 28rpx;
  margin-bottom: 30rpx;
}

.tag-input-actions {
  display: flex;
  gap: 20rpx;
}

.tag-btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
  border: none;
}

.tag-btn.cancel {
  background-color: #f0f0f0;
  color: #666;
}

.tag-btn.confirm {
  background-color: #007AFF;
  color: #fff;
}

.scroll-view {
  flex: 1;
  padding-top: env(safe-area-inset-top);
}

.form-container {
  padding: 30rpx;
  padding-bottom: 200rpx;
}
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 20rpx 30rpx;
  box-shadow: 0 -2rpx 20rpx rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  z-index: 1000;
}
.bottom-bar.with-safe-area {
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
}
.submit-btn {
  background: linear-gradient(135deg, #1890ff, #096dd9);
  color: #fff;
  border-radius: 20rpx;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 32rpx;
  font-weight: bold;
  border: none;
  transition: all 0.3s;
}

/* 响应式调整 */
@media (max-width: 375px) {
  .content {
    padding: 0 20rpx 20rpx;
  }
  
  .avatar-section,
  .form-section {
    padding: 30rpx;
    padding-bottom: 200rpx;
  }
  
  .form-item {
    padding: 20rpx 0;
  }
}
</style>