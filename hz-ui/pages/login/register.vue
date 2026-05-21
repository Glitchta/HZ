<template>
  <view class="register-container">
    <!-- 头部 -->
    <view class="register-header">
      <view class="back-btn" @tap="goBack">
        <image src="/static/icons/back.png" class="back-icon"></image>
      </view>
      <text class="header-title">注册账号</text>
    </view>

    <!-- 注册表单 -->
    <view class="form-container">
      <view class="form-card">
        <!-- 用户名输入 -->
        <view class="input-item">
          <image src="/static/icons/user.png" class="input-icon"></image>
          <input
            type="text"
            v-model="registerForm.username"
            placeholder="请输入用户名(6-18位字母或数字)"
            placeholder-class="placeholder"
            maxlength="18"
            @blur="checkUsername"
          />
        </view>
        
        <!-- 密码输入 -->
        <view class="input-item">
          <image src="/static/icons/lock.png" class="input-icon"></image>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="registerForm.password"
            placeholder="请设置6-18位密码"
            placeholder-class="placeholder"
            maxlength="18"
            @blur="checkPassword"
          />
          <image
            :src="showPassword ? '/static/icons/eye-open.png' : '/static/icons/eye-close.png'"
            class="eye-icon"
            @tap="togglePassword"
          ></image>
        </view>
        
        <!-- 确认密码 -->
        <view class="input-item" :class="{ 'input-error': !passwordMatch && registerForm.confirmPassword }">
          <image src="/static/icons/lock.png" class="input-icon"></image>
          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            v-model="registerForm.confirmPassword"
            placeholder="请再次输入密码"
            placeholder-class="placeholder"
            @input="checkPasswordMatch"
          />
          <image
            :src="showConfirmPassword ? '/static/icons/eye-open.png' : '/static/icons/eye-close.png'"
            class="eye-icon"
            @tap="toggleConfirmPassword"
          ></image>
        </view>
        <view v-if="!passwordMatch && registerForm.confirmPassword" class="error-tip">两次输入的密码不一致</view>
        
        <!-- 协议同意 -->
        <view class="agreement-check" @tap="toggleAgreement">
          <view class="checkbox" :class="{ checked: agreement }">
            <text v-if="agreement" class="checkmark">✓</text>
          </view>
          <view class="agreement-text">
            <text>我已阅读并同意</text>
            <text class="agreement-link" @tap.stop="showAgreement">《用户协议》</text>
            <text>和</text>
            <text class="agreement-link" @tap.stop="showPrivacy">《隐私政策》</text>
          </view>
        </view>
        
        <!-- 注册按钮 -->
        <button
          class="register-btn"
          :class="{ disabled: !canRegister }"
          :disabled="!canRegister"
          @tap="handleRegister"
          :loading="loading"
        >
          {{ loading ? '注册中...' : '立即注册' }}
        </button>
        
        <!-- 已有账号 -->
        <view class="login-tip">
          <text>已有账号？</text>
          <text class="login-link" @tap="goToLogin">立即登录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import request from '../../utils/request'

// 注册表单数据
const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

// 状态管理
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const agreement = ref(false)
const passwordMatch = ref(true)
const usernameValid = ref(true)
const loading = ref(false)

// 计算属性
const canRegister = computed(() => {
  return (
    registerForm.value.username &&
    registerForm.value.password &&
    registerForm.value.confirmPassword &&
    passwordMatch.value &&
    usernameValid.value &&
    agreement.value
  )
})

// 切换密码可见性
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

// 检查密码匹配
const checkPasswordMatch = () => {
  passwordMatch.value = registerForm.value.password === registerForm.value.confirmPassword
}

// 检查用户名格式
const checkUsername = () => {
  const username = registerForm.value.username
  if (username) {
    // 用户名规则：6-18位，只能包含字母、数字、下划线
    const usernameRegex = /^[a-zA-Z0-9_]{6,18}$/
    usernameValid.value = usernameRegex.test(username)
    
    if (!usernameValid.value) {
      uni.showToast({
        title: '用户名格式不正确(6-18位字母、数字或下划线)',
        icon: 'none'
      })
    }
  } else {
    usernameValid.value = true
  }
}

// 检查密码强度
const checkPassword = () => {
  const password = registerForm.value.password
  if (password && password.length < 6) {
    uni.showToast({
      title: '密码长度不能少于6位',
      icon: 'none'
    })
  }
}

// 切换协议同意
const toggleAgreement = () => {
  agreement.value = !agreement.value
}

// 注册处理

const handleRegister = async () => {
  if (!canRegister.value || loading.value) return
  
  loading.value = true
  
  try {
    // 验证表单
    if (!validateForm()) {
      loading.value = false
      return
    }

    await request.post('/user/register', registerForm.value)
    
    // 注册成功
    uni.showToast({
      title: '注册成功',
      icon: 'success'
    })
    
    // 可以清空表单
    registerForm.value = {
      username: '',
      password: '',
      confirmPassword: ''
    }
    
    // 跳转到登录页面
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
    
  } catch (error) {
    console.error('注册失败，错误信息:', error.message, '错误码:', error.code, '完整错误:', error)
    
    // 注意：拦截器已经显示了错误提示，这里不需要再显示
    // 只需要处理特定情况
    
    // 如果是用户名已存在的错误
    if (error.code === -1) {
      console.log('用户名已存在，清空密码字段')
      // 清空输入框
	  registerForm.value.username = ''
      registerForm.value.password = ''
      registerForm.value.confirmPassword = ''
    } else if (error.message?.includes('网络') || error.message?.includes('超时')) {
      // 网络相关错误，拦截器可能没有处理
      uni.showToast({
        title: '网络连接失败，请检查网络',
        icon: 'none'
      })
    }
    // 其他错误已经在拦截器中处理了，这里不需要重复处理
    
  } finally {
    // 重要：无论成功还是失败，都要重置 loading 状态
    console.log('注册流程结束，重置loading状态')
    loading.value = false
    
    // 注意：移除 uni.hideLoading()，因为我们使用的是 button 的 loading 属性
    // 而不是 uni.showLoading()
  }
}

// 表单验证
const validateForm = () => {
  // 验证用户名
  if (!registerForm.value.username) {
    uni.showToast({
      title: '请输入用户名',
      icon: 'none'
    })
    return false
  }
  
  if (!usernameValid.value) {
    uni.showToast({
      title: '用户名格式不正确',
      icon: 'none'
    })
    return false
  }
  
  // 验证密码
  if (registerForm.value.password.length < 6) {
    uni.showToast({
      title: '密码长度不能少于6位',
      icon: 'none'
    })
    return false
  }
  
  // 验证密码匹配
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    uni.showToast({
      title: '两次输入的密码不一致',
      icon: 'none'
    })
    return false
  }
  
  // 验证协议
  if (!agreement.value) {
    uni.showToast({
      title: '请先阅读并同意协议',
      icon: 'none'
    })
    return false
  }
  
  return true
}

// 页面跳转
const goBack = () => {
  uni.navigateBack()
}

const goToLogin = () => {
  uni.navigateTo({
    url: '/pages/login/login'
  })
}

const showAgreement = () => {
  uni.navigateTo({
    url: '/pages/webview/webview?url=https://example.com/agreement'
  })
}

const showPrivacy = () => {
  uni.navigateTo({
    url: '/pages/webview/webview?url=https://example.com/privacy'
  })
}

// 清理定时器
onUnmounted(() => {
  // 如果有其他定时器，可以在这里清理
})
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg,#9dbde7 0%,#709edd 100%);
  padding: 40rpx 0;
}

.register-header {
  display: flex;
  align-items: center;
  padding: 0 40rpx 40rpx;
  color: white;
  position: relative;
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.back-icon {
  width: 40rpx;
  height: 40rpx;
}

.back-btn:active {
  opacity: 0.7;
}

.header-title {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 50rpx;
  font-weight: bold;
  z-index: 0;
}

.form-container {
  padding: 0 40rpx;
}

.form-card {
  background: white;
  border-radius: 24rpx;
  padding: 60rpx 40rpx;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.1);
}

.input-item {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 12rpx;
  padding: 0 30rpx;
  height: 100rpx;
  margin-bottom: 30rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s;
}

.input-item:focus-within {
  border-color: #667eea;
  background: #f0f2ff;
}

.input-item.input-error {
  border-color: #ff4444;
  background: #fff5f5;
}

.input-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 20rpx;
}

input {
  flex: 1;
  height: 100%;
  font-size: 30rpx;
  color: #333;
}

.placeholder {
  color: #999;
  font-size: 30rpx;
}

.eye-icon {
  width: 40rpx;
  height: 40rpx;
  margin-left: 20rpx;
  opacity: 0.5;
}

.eye-icon:active {
  opacity: 0.8;
}

.error-tip {
  color: #ff4444;
  font-size: 24rpx;
  margin-top: -20rpx;
  margin-bottom: 20rpx;
  padding-left: 10rpx;
}

.agreement-check {
  display: flex;
  align-items: flex-start;
  margin-bottom: 60rpx;
  padding: 0 10rpx;
}

.checkbox {
  width: 36rpx;
  height: 36rpx;
  border: 2rpx solid #ccc;
  border-radius: 6rpx;
  margin-right: 12rpx;
  margin-top: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  flex-shrink: 0;
}

.checkbox.checked {
  background: #667eea;
  border-color: #667eea;
}

.checkmark {
  color: white;
  font-size: 24rpx;
  font-weight: bold;
}

.agreement-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  flex: 1;
}

.agreement-link {
  color: #667eea;
  margin: 0 4rpx;
}

.register-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  height: 100rpx;
  line-height: 100rpx;
  border-radius: 12rpx;
  font-size: 36rpx;
  border: none;
  margin-bottom: 50rpx;
  position: relative;
  overflow: hidden;
}

.register-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  opacity: 0;
  transition: opacity 0.3s;
}

.register-btn:not([disabled]):active::after {
  opacity: 1;
}

.register-btn.disabled {
  background: #ccc;
  color: #999;
}

.login-tip {
  text-align: center;
  font-size: 28rpx;
  color: #666;
}

.login-link {
  color: #667eea;
  margin-left: 10rpx;
  font-weight: 500;
}
</style>