<template>
  <view class="publish-container">
    <!-- 内容编辑区 -->
    <scroll-view class="publish-content" scroll-y>
      <!-- 发布按钮 -->
      <view class="publish-btn" @click="publishHole">
        <uni-icons type="compose" size="24" color="#fff"></uni-icons>
        <text class="publish-text">发布</text>
      </view>
      
      <view class="form-container">
        <!-- 文本输入 -->
        <textarea
          v-model="formData.description"
          class="content-input"
          placeholder="填写失物信息"
          placeholder-class="placeholder"
          maxlength="1000"
          auto-height
        ></textarea>
        
        <!-- 字数统计 -->
        <view class="word-count">
          <text>{{ formData.description.length || 0 }}/1000</text> <!-- 添加 || 0 避免初始值为空时的错误 -->
        </view>

        <!-- 图片上传 -->
        <view class="upload-section">
          <text class="section-title">添加图片（可选）</text>
          <view class="image-list">
            <view 
              v-for="(img, index) in formData.images" 
              :key="index"
              class="image-item"
            >
              <image 
                :src="img" 
                class="upload-image"
                mode="aspectFill"
                @click="previewImage(index)"
              />
              <view class="image-remove" @click="removeImage(index)">
                <uni-icons type="closeempty" size="20" color="#fff"></uni-icons>
              </view>
            </view>
            
            <view 
              v-if="formData.images.length < 9"
              class="image-upload-btn"
              @click="chooseImage"
            >
              <uni-icons type="plusempty" size="40" color="#ccc"></uni-icons>
              <text class="upload-text">添加图片</text>
            </view>
          </view>
        </view>

      </view>
    </scroll-view>

    <!-- 加载遮罩 -->
    <view v-if="loading" class="loading-mask">
      <uni-load-more status="loading"></uni-load-more>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import request from '../../utils/request'

// 响应式数据
const formData = reactive({
  description: '',
  images: []
})
const selectedTags = ref([])
const customTag = ref('')
const loading = ref(false)

onLoad(() => {
  console.log('发布页面加载')
})

// 方法
const goBack = () => {
  uni.navigateBack()
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
const removeImage = (index) => { 
  uni.showModal({
    title: '提示',
    content: '确定要删除这张图片吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await request.post('/upload/delete', null, {
            params: {
              filePath: formData.images[index]
            }
          })
          formData.images.splice(index, 1)
        } catch (error) {
          console.error('删除图片失败', error)
          uni.showToast({
            title: '删除失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

// 预览图片
const previewImage = (index) => {
  uni.previewImage({
    urls: formData.images,
    current: index
  })
}

// 发布
const publishHole = async () => {
  if (!formData.description.trim()) {
    uni.showToast({
      title: '请输入内容',
      icon: 'none'
    })
    return
  }
  
  if (formData.description.length < 5) {
    uni.showToast({
      title: '内容至少5个字',
      icon: 'none'
    })
    return
  }
  
  loading.value = true
  
  try {
    // 提交
    const res = await request.post('/lost/insert', formData)
    
    if (res.code === 0) {  // 根据你的后端接口返回码调整
      uni.showToast({
        title: '发布成功',
        icon: 'success'
      })
      
      // 设置需要刷新列表
      uni.setStorageSync('refreshLostList', true)
      
      // 清空表单
      formData.description = ''
      formData.images = []
      selectedTags.value = []
      
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    } else {
      uni.showToast({
        title: res.msg || '发布失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('发布失败', error)
    uni.showToast({
      title: '发布失败，请重试',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.publish-container {
  min-height: 100vh;
  padding: 20rpx;
  background-color: #f8f9fa;
}

/* 顶部导航 */
.publish-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: white;
  border-bottom: 1rpx solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  color: #333;
  font-size: 28rpx;
  padding: 10rpx 20rpx;
}

.header-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

/* 内容区 */
.publish-content {
  height: calc(100vh - 100rpx);
}

.content-input {
  min-height: 300rpx;
  width: calc(100vw - 100rpx);
  font-size: 32rpx;
  line-height: 1.6;
  background-color: white;
  padding: 30rpx;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 20rpx;
}

.placeholder {
  color: #ccc;
}

.word-count {
  text-align: right;
  color: #999;
  font-size: 24rpx;
  margin-bottom: 40rpx;
}

/* 上传区域 */
.upload-section,
.tag-section {
  background-color: white;
  padding: 30rpx;
  border-radius: 20rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  display: block;
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 30rpx;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.image-item {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  border-radius: 12rpx;
  overflow: hidden;
}

.upload-image {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}

.image-remove {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  width: 40rpx;
  height: 40rpx;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-upload-btn {
  width: 200rpx;
  height: 200rpx;
  border: 2rpx dashed #ddd;
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

/* 标签区域 */
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.tag-item {
  padding: 12rpx 24rpx;
  background-color: #f8f9fa;
  border-radius: 20rpx;
  font-size: 26rpx;
  color: #666;
  transition: all 0.3s;
}

.tag-item.selected {
  background-color: #e6f7ff;
  color: #1890ff;
  border: 1rpx solid #91d5ff;
}

.custom-tag-input {
  background-color: #f8f9fa;
  border-radius: 20rpx;
  padding: 20rpx 30rpx;
  font-size: 28rpx;
  color: #333;
}

/* 发布说明 */
.notice {
  background-color: white;
  padding: 30rpx;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.notice-title {
  display: block;
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 20rpx;
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.notice-list text {
  font-size: 24rpx;
  color: #999;
  line-height: 1.5;
}

/* 加载遮罩 */
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
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

</style>