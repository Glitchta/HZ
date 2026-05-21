<template>
  <view class="help-create-page">
    <!-- 自定义导航栏 -->
    <view class="custom-nav-bar" v-if="showCustomNavBar">
      <view class="nav-left" @click="goBack">
        <uni-icons type="left" size="24" color="#333"></uni-icons>
        <text class="nav-title">我能帮忙</text>
      </view>
    </view>

    <scroll-view 
      class="scroll-view" 
      scroll-y 
      :scroll-top="scrollTop"
      @scroll="onScroll"
    >
      <view class="form-container">
        <!-- 帮忙类型 -->
        <view class="form-section">
          <view class="section-title">
            <text class="title-text">帮忙类型</text>
            <text class="required-mark">*</text>
          </view>
          <view class="type-grid">
            <view 
			  class="type-item"
              v-for="type in helpTypes" 
              :key="type.value"
              :class="{'active': formData.helpType === type.value}"
              @click="selectType(type.value)"
            >
              <image 
                :src="type.icon" 
                class="type-icon"
                :class="{'active-icon': formData.helpType === type.value}"
              ></image>
              <text class="type-text">{{ type.label }}</text>
            </view>
          </view>
        </view>

        <!-- 标题 -->
        <view class="form-section">
          <view class="section-title">
            <text class="title-text">标题</text>
            <text class="required-mark">*</text>
          </view>
          <input 
            v-model="formData.title"
            class="form-input"
            placeholder="请输入标题"
            placeholder-class="placeholder"
            maxlength="30"
            @input="checkTitleLength"
          />
          <view class="input-tips">
            <text>{{ formData.title.length }}/30</text>
          </view>
        </view>

        <!-- 详细描述 -->
        <view class="form-section">
          <view class="section-title">
            <text class="title-text">详细描述</text>
            <text class="required-mark">*</text>
          </view>
          <textarea 
            v-model="formData.description"
            class="form-textarea"
            placeholder="请详细描述您能帮忙的内容"
            placeholder-class="placeholder"
            maxlength="500"
            :auto-height="true"
            @input="checkDescriptionLength"
          />
          <view class="input-tips">
            <text>{{ formData.description.length }}/500</text>
          </view>
        </view>

        <!-- 上传图片 -->
        <view class="form-section">
          <view class="section-title">
            <text class="title-text">上传图片（可选）</text>
          </view>
          <view class="upload-container">
            <view 
              v-for="(image, index) in formData.images" 
              :key="index"
              class="image-item"
            >
              <image 
                :src="image"
                class="upload-image"
                mode="aspectFill"
              ></image>
              <view class="delete-btn" @click="deleteImage(index)">
                <uni-icons type="closeempty" size="16" color="#fff"></uni-icons>
              </view>
            </view>
            <view 
              v-if="formData.images.length < 9"
              class="upload-btn"
              @click="chooseImage"
            >
              <uni-icons type="plusempty" size="28" color="#ccc"></uni-icons>
              <text class="upload-text">上传图片</text>
            </view>
          </view>
          <view class="upload-tips">
            <text>最多可上传9张图片，支持JPG、PNG格式</text>
          </view>
        </view>

        <!-- 联系方式 -->
        <view class="form-section">
          <view class="section-title">
            <text class="title-text">联系方式</text>
          </view>
          <view class="contact-options">
            <view 
              v-for="(option, index) in contactOptions" 
              :key="option.value"
              class="contact-option"
              :class="{'active': formData.contactType === option.value}"
              @click="selectContactType(option.value)"
            >
              <text>{{ option.label }}</text>
              <view 
                v-if="formData.contactType === option.value" 
                class="active-dot"
              ></view>
            </view>
          </view>
          <input 
            v-if="formData.contactType === 'phone'"
            v-model="formData.contact"
            class="form-input"
            type="number"
            placeholder="请输入手机号码"
            placeholder-class="placeholder"
            maxlength="11"
          />
          <input 
            v-if="formData.contactType === 'wechat'"
            v-model="formData.contact"
            class="form-input"
            placeholder="请输入微信号"
            placeholder-class="placeholder"
            maxlength="20"
          />
          <input 
            v-if="formData.contactType === 'qq'"
            v-model="formData.contact"
            class="form-input"
            type="number"
            placeholder="请输入QQ号"
            placeholder-class="placeholder"
            maxlength="12"
          />
        </view>
      </view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar" :class="{'with-safe-area': isIphoneX}">
      <button 
        class="submit-btn" 
        :class="{'disabled': !canSubmit}"
        :disabled="!canSubmit"
        @click="submitHelp"
      >
        发布帮忙
      </button>
    </view>

    <!-- 加载中 -->
    <uni-load-more v-if="loading" status="loading" :content-text="{contentdown: '加载中'}" />
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { onLoad, onShow, onHide } from '@dcloudio/uni-app'
import request from '../../utils/request'


// 表单数据
const formData = reactive({
  helpType: 'study', // 类型
  title: '', // 标题
  description: '', // 描述
  images: [], // 图片数组
  contactType: 'phone', // 联系方式类型
  contact: ''// 联系方式
})

// 页面状态
const loading = ref(false)
const showCustomNavBar = ref(false)
const scrollTop = ref(0)
const isIphoneX = ref(false)

// 求助类型选项
const helpTypes = [
  { value: 'study', label: '学习方面', icon: '/static/help/study.png' },
  { value: 'life', label: '生活方面', icon: '/static/help/life.png' },
  { value: 'item', label: '物品借用', icon: '/static/help/item.png' },
  { value: 'skill', label: '特殊技能', icon: '/static/help/skill.png' },
  { value: 'other', label: '其他类型', icon: '/static/help/other.png' }
]

// 联系方式选项
const contactOptions = [
  { value: 'phone', label: '手机' },
  { value: 'wechat', label: '微信' },
  { value: 'qq', label: 'QQ' }
]

// 计算属性：是否可以提交
const canSubmit = computed(() => {
  return (
    formData.title.trim() &&
    formData.description.trim()
  )
})

onLoad((options) => {
  // 检测是否是iPhoneX及以上机型
  uni.getSystemInfo({
    success: (res) => {
      isIphoneX.value = res.model.includes('iPhone X')
    }
  })
  // 从缓存中获取用户信息
  const user = uni.getStorageSync('userInfo')
  if (user) {
    Object.assign(userInfo, user)
  }
  // 恢复草稿
  loadDraft()
})

onShow(() => {
  console.log('help-create页面显示')
  // 检查是否有其他逻辑导致跳转
})

onHide(() => {
  console.log('help-create页面隐藏')
  // 保存草稿
  saveDraft()
})

// 滚动事件处理
const onScroll = (e) => {
  const scrollTop = e.detail.scrollTop
  showCustomNavBar.value = scrollTop > 50
}

// 选择求助类型
const selectType = (helpType) => {
  formData.helpType = helpType
}

// 检查标题长度
const checkTitleLength = () => {
  if (formData.title.length > 30) {
    formData.title = formData.title.substring(0, 30)
  }
}

// 检查描述长度
const checkDescriptionLength = () => {
  if (formData.description.length > 500) {
    formData.description = formData.description.substring(0, 500)
  }
}

// 选择图片
const chooseImage = () => {
  const count = 9 - formData.images.length
  uni.chooseImage({
    count,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      // 处理图片上传
      res.tempFilePaths.forEach((tempFilePath) => {
        uploadImage(tempFilePath)
      })
    }
  })
}

// 上传图片
const uploadImage = async (tempFilePath) => {
  loading.value = true
  try {
    const result = await request.upload('/upload/image', tempFilePath, 'file', {})
    
    if (result && result.code === 0) {
      // 保存服务器返回的文件名
      formData.images.push(result.data.url)
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
  } finally {
    loading.value = false
  }
}

// 删除图片
const deleteImage = (index) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除这张图片吗？',
    success: async (res) => {
      if (res.confirm) {
	await request.post('/upload/delete', null, {
	params: {
		filePath: formData.images[index]
	}
	})
		formData.images.splice(index,1)
      }
    }
  })
}


// 选择联系方式类型
const selectContactType = (type) => {
  formData.contactType = type
  // 清空其他联系方式
  formData.contact = ''
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 保存草稿
const saveDraft = () => {
  if (formData.title || formData.description) {
    uni.setStorageSync('helpDraft', formData)
  }
}

// 加载草稿
const loadDraft = () => {
  const draft = uni.getStorageSync('helpDraft')
  if (draft) {
    Object.assign(formData, draft)
  }
}

// 表单验证
const validateForm = () => {
  if (!formData.title.trim()) {
    uni.showToast({
      title: '请输入求助标题',
      icon: 'none'
    })
    return false
  }
  
  if (!formData.description.trim()) {
    uni.showToast({
      title: '请输入详细描述',
      icon: 'none'
    })
    return false
  }
  
  if (formData.contactType === 'phone' && formData.contact!= '' && !/^1[3-9]\d{9}$/.test(formData.contact)) {
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none'
    })
    return false
  }
  
  if (formData.contactType === 'wechat' && formData.contact!= '' && !formData.contact.trim()) {
    uni.showToast({
      title: '请输入微信号',
      icon: 'none'
    })
    return false
  }
  
  if (formData.contactType === 'qq' && formData.contact!= '' && !/^\d{5,12}$/.test(formData.contact)) {
    uni.showToast({
      title: '请输入正确的QQ号',
      icon: 'none'
    })
    return false
  }
  
  return true
}

// 提交求助
const submitHelp = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
	
	// 清除草稿
	uni.removeStorageSync('helpDraft')
	
	//调用api
    await request.post('/help/help', formData)
    
    
    
    // 提交成功
    uni.showToast({
      title: '发布成功',
      icon: 'success',
      duration: 2000,
      success: () => {
        setTimeout(() => {
          uni.navigateBack()
          // 触发首页刷新
          uni.$emit('helpPublished')
        }, 1500)
      }
    })
    
  } catch (error) {
    console.error('发布失败', error)
    uni.showToast({
      title: '发布失败，请重试',
      icon: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.help-create-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.custom-nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 88rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  z-index: 1000;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}

.nav-left {
  display: flex;
  align-items: center;
}

.nav-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-left: 20rpx;
  color: #333;
}

.scroll-view {
  flex: 1;
  padding-top: env(safe-area-inset-top);
}

.form-container {
  padding: 30rpx;
  padding-bottom: 200rpx;
}

.form-section {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.required-mark {
  color: #f5222d;
  margin-left: 5rpx;
}

.type-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.type-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
  border-radius: 16rpx;
  border: 2rpx solid #eee;
  background-color: #fafafa;
  transition: all 0.3s;
}

.type-item.active {
  border-color: #1890ff;
  background-color: #e6f7ff;
}

.type-icon {
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 10rpx;
  filter: grayscale(100%);
  opacity: 0.7;
  transition: all 0.3s;
}

.active-icon {
  filter: grayscale(0%);
  opacity: 1;
}

.type-text {
  font-size: 24rpx;
  color: #666;
}

.type-item.active .type-text {
  color: #1890ff;
  font-weight: bold;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 20rpx;
  background-color: #fafafa;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
  border: 2rpx solid #eee;
line-height: 1.5; /* 明确设置行高 */
  min-height: 80rpx; /* 设置最小高度 */
  display: block; /* 确保是块级元素 */
}

.form-input:focus, .form-textarea:focus {
  border-color: #1890ff;
  background-color: #fff;
}

.form-textarea {
  min-height: 200rpx;
  line-height: 1.5;
}

.placeholder {
  color: #999;
  font-size: 28rpx;
  line-height: 1.5; /* 与输入框行高一致 */
  vertical-align: middle; /* 垂直居中 */
}

.input-tips {
  text-align: right;
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}

.upload-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.image-item {
  position: relative;
  width: 180rpx;
  height: 180rpx;
  border-radius: 12rpx;
  overflow: hidden;
}

.upload-image {
  width: 100%;
  height: 100%;
}

.delete-btn {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 40rpx;
  height: 40rpx;
  background-color: rgba(0,0,0,0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-btn {
  width: 180rpx;
  height: 180rpx;
  border: 2rpx dashed #ccc;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
}

.upload-text {
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}

.upload-tips {
  font-size: 24rpx;
  color: #999;
  margin-top: 20rpx;
}

.location-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  background-color: #fafafa;
  border-radius: 12rpx;
  border: 2rpx solid #eee;
}

.location-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.location-info {
  display: flex;
  flex-direction: column;
  margin-left: 20rpx;
  flex: 1;
}

.location-address {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 8rpx;
}

.location-name {
  font-size: 24rpx;
  color: #666;
}

.urgency-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.urgency-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
  border-radius: 16rpx;
  border: 2rpx solid #eee;
  background-color: #fafafa;
  transition: all 0.3s;
}

.urgency-item.active {
  border-color: transparent;
  color: #fff;
}

.urgency-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10rpx;
  background-color: #f5f5f5;
  transition: all 0.3s;
}

.urgency-item.active .urgency-icon {
  background-color: rgba(255,255,255,0.3);
}

.urgency-text {
  font-size: 24rpx;
  color: #666;
  transition: all 0.3s;
}

.urgency-item.active .urgency-text {
  color: #fff;
  font-weight: bold;
}

/* 紧急程度背景色 */
.low-bg { background-color: #52c41a; }
.normal-bg { background-color: #1890ff; }
.high-bg { background-color: #fa8c16; }
.urgent-bg { background-color: #f5222d; }

.contact-options {
  display: flex;
  margin-bottom: 20rpx;
  background-color: #f5f5f5;
  border-radius: 12rpx;
  padding: 4rpx;
}

.contact-option {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  font-size: 28rpx;
  color: #666;
  border-radius: 8rpx;
  position: relative;
  transition: all 0.3s;
}

.contact-option.active {
  background-color: #fff;
  color: #1890ff;
  font-weight: bold;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.active-dot {
  position: absolute;
  bottom: 8rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background-color: #1890ff;
}

.reward-input-wrapper {
  display: flex;
  align-items: center;
  background-color: #fafafa;
  border-radius: 12rpx;
  border: 2rpx solid #eee;
  padding: 0 20rpx;
  margin-bottom: 20rpx;
}

.reward-input {
  flex: 1;
  padding: 20rpx 0;
  font-size: 36rpx;
  font-weight: bold;
  color: #f5222d;
}

.reward-unit {
  font-size: 28rpx;
  color: #999;
  margin-left: 20rpx;
}

.reward-tips {
  font-size: 24rpx;
  color: #999;
  line-height: 1.5;
}

.my-points {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10rpx;
  padding: 15rpx 20rpx;
  background-color: #f0f7ff;
  border-radius: 12rpx;
  color: #1890ff;
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

.agreement {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #666;
}

.checkbox {
  width: 32rpx;
  height: 32rpx;
  border: 2rpx solid #ddd;
  border-radius: 6rpx;
  margin-right: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox.checked {
  border-color: #1890ff;
  background-color: #1890ff;
}

.agreement-text {
  line-height: 1.5;
}

.link {
  color: #1890ff;
  margin: 0 4rpx;
}

.submit-btn {
  background: linear-gradient(135deg, #1890ff, #096dd9);
  color: #fff;
  border-radius: 50rpx;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 32rpx;
  font-weight: bold;
  border: none;
  transition: all 0.3s;
}

.submit-btn:active {
  opacity: 0.9;
  transform: scale(0.98);
}

.submit-btn.disabled {
  background: #ccc;
  color: #999;
  opacity: 0.7;
}
</style>