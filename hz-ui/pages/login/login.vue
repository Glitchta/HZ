<template>
  <view class="login-container">
    <!-- 头部背景 -->
    <view class="header-bg">
      <image src="/static/images/login-bg.png" mode="aspectFill" class="bg-image"></image>
      <view class="header-content">
        <text class="welcome-text">欢迎回来</text>
        <text class="sub-text">请登录您的账户</text>
      </view>
    </view>

    <!-- 登录表单 -->
    <view class="form-container">
      <view class="form-card">
        <!-- 用户名输入 -->
        <view class="input-group">
          <view class="input-item">
            <image src="/static/icons/user.png" class="input-icon"></image>
            <input
              type="text"
              v-model="loginForm.username"
              placeholder="请输入用户名"
              placeholder-class="placeholder"
              @focus="inputFocus('username')"
              @blur="inputBlur"
            />
            <image
              v-if="loginForm.username"
              src="/static/icons/clear.png"
              class="clear-icon"
              @tap="clearInput('username')"
            ></image>
          </view>
          
          <!-- 密码输入 -->
          <view class="input-item">
            <image src="/static/icons/lock.png" class="input-icon"></image>
            <!-- 关键修改在这里：同时使用 :type 和 :password 属性 -->
            <input
              :type="showPassword ? 'text' : 'password'"
              :password="!showPassword"
              v-model="loginForm.password"
              placeholder="请输入密码"
              placeholder-class="placeholder"
              @focus="inputFocus('password')"
              @blur="inputBlur"
            />
            <image
              :src="showPassword ? '/static/login/eye-open.png' : '/static/login/eye-close.png'"
              class="eye-icon"
              @tap="togglePassword"
            ></image>
          </view>
        </view>

        <!-- 记住密码和忘记密码 -->
        <view class="form-options">
          <view class="remember-me" @tap="toggleRemember">
            <view class="checkbox" :class="{ checked: rememberMe }">
              <text v-if="rememberMe" class="checkmark">✓</text>
            </view>
            <text class="option-text">记住密码</text>
          </view>
          <text class="forgot-password" @tap="goToForgotPassword">忘记密码？</text>
        </view>

        <!-- 登录按钮 -->
        <button
          class="login-btn"
          :class="{ disabled: !canLogin }"
          :disabled="!canLogin"
          @tap="handleLogin"
          :loading="loading"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>

        <!-- 微信登录 -->
        <view class="third-party-login">
          <text class="divider">其他方式登录</text>
          <view class="third-party-icons">
            <view class="wechat-login-btn" :class="{ disabled: wxLoading }" @tap="wxLogin">
              <image src="/static/icons/wechat.png" class="wechat-btn-icon"></image>
              <text class="wechat-btn-text">{{ wxLoading ? '登录中...' : '微信一键登录' }}</text>
            </view>
          </view>
        </view>

        <!-- 注册提示 -->
        <view class="register-tip">
          <text>还没有账号？</text>
          <text class="register-link" @tap="goToRegister">立即注册</text>
        </view>
      </view>
    </view>

    <!-- 协议 -->
    <view class="agreement">
      <text>登录即代表您已同意</text>
      <text class="agreement-link" @tap="showAgreement">《用户协议》</text>
      <text>和</text>
      <text class="agreement-link" @tap="showPrivacy">《隐私政策》</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import request from '../../utils/request'

// 登录表单数据
const loginForm = ref({
  username: '',
  password: ''
})

// 状态管理
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)
const wxLoading = ref(false)
const activeInput = ref('')

// 计算属性：是否可以登录
const canLogin = computed(() => {
  return loginForm.value.username.trim() && loginForm.value.password.trim()
})

// 生命周期
onMounted(() => {
  // 尝试读取记住的用户名密码
  const savedUsername = uni.getStorageSync('rememberedUsername')
  const savedPassword = uni.getStorageSync('rememberedPassword')
  
  if (savedUsername && savedPassword) {
    loginForm.value.username = savedUsername
    loginForm.value.password = savedPassword
    rememberMe.value = true
  }
})

// 输入框焦点处理
const inputFocus = (field) => {
  activeInput.value = field
}

const inputBlur = () => {
  activeInput.value = ''
}

// 清除输入
const clearInput = (field) => {
  loginForm.value[field] = ''
}

// 切换密码可见性
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// 切换记住密码
const toggleRemember = () => {
  rememberMe.value = !rememberMe.value
}

// 登录处理
const handleLogin = async () => {
  if (!canLogin.value || loading.value) return
  
  loading.value = true
  
  try {
    // 验证用户名
    if (!loginForm.value.username) {
      uni.showToast({
        title: '请输入用户名',
        icon: 'none'
      })
      loading.value = false
      return
    }
    
    // 验证密码长度
    if (loginForm.value.password.length < 6) {
      uni.showToast({
        title: '密码长度不能少于6位',
        icon: 'none'
      })
      loading.value = false
      return
    }
    
    // 保存记住的密码
    if (rememberMe.value) {
      uni.setStorageSync('rememberedUsername', loginForm.value.username)
      uni.setStorageSync('rememberedPassword', loginForm.value.password)
    } else {
      uni.removeStorageSync('rememberedUsername')
      uni.removeStorageSync('rememberedPassword')
    }
    
    // 登录请求
    await request.post('/user/login', loginForm.value)
    
    // 登录成功
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })
	//更新登录状态
	uni.setStorageSync('isLoggedIn',true)
    // 跳转到首页
      uni.switchTab({
        url: '/pages/index/index'
      })
    
  } catch (error) {
    console.error('登录失败:', error)
    uni.showToast({
      title: error.message || '登录失败，请重试',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 微信登录
const wxLogin = async () => {
  if (wxLoading.value) return

  wxLoading.value = true
  try {
    // 1. 调用微信登录获取code
    const [err, res] = await new Promise((resolve) => {
      uni.login({
        provider: 'weixin',
        success: (res) => resolve([null, res]),
        fail: (err) => resolve([err, null])
      })
    })

    if (err || !res || !res.code) {
      uni.showToast({
        title: '获取微信授权失败',
        icon: 'none'
      })
      return
    }

    // 2. 发送code到后端
    await request.post('/user/wxLogin', { code: res.code })

    // 3. 登录成功
    uni.setStorageSync('isLoggedIn', true)
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })

    uni.switchTab({
      url: '/pages/index/index'
    })
  } catch (error) {
    console.error('微信登录失败:', error)
  } finally {
    wxLoading.value = false
  }
}

// 页面跳转
const goToRegister = () => {
  uni.navigateTo({
    url: '/pages/login/register'
  })
}

const goToForgotPassword = () => {
  uni.navigateTo({
    url: '/pages/forgot-password/forgot-password'
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
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #9dbde7 0%,#709edd 100%);
}

.header-bg {
  height: 280rpx;
  position: relative;
}

.bg-image {
  width: 100%;
  height: 100%;
  opacity: 0.8;
}

.header-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
}

.welcome-text {
  font-size: 48rpx;
  font-weight: bold;
  margin-bottom: 16rpx;
}

.sub-text {
  font-size: 28rpx;
  opacity: 0.9;
}

.form-container {
  padding: 0 40rpx;
  position: relative;
  z-index: 1;
  margin-top: -40rpx;
}

.form-card {
  background: white;
  border-radius: 24rpx;
  padding: 60rpx 40rpx;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.1);
}

.input-group {
  margin-bottom: 50rpx;
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

.clear-icon, .eye-icon {
  width: 40rpx;
  height: 40rpx;
  margin-left: 20rpx;
  opacity: 0.5;
}

.clear-icon:active, .eye-icon:active {
  opacity: 0.8;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 60rpx;
}

.remember-me {
  display: flex;
  align-items: center;
}

.checkbox {
  width: 36rpx;
  height: 36rpx;
  border: 2rpx solid #ccc;
  border-radius: 6rpx;
  margin-right: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
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

.option-text, .forgot-password {
  font-size: 28rpx;
  color: #666;
}

.forgot-password {
  color: #667eea;
}

.forgot-password:active, .register-link:active, .agreement-link:active {
  opacity: 0.7;
}

.login-btn {
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

.login-btn::after {
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

.login-btn:not([disabled]):active::after {
  opacity: 1;
}

.login-btn.disabled {
  background: #ccc;
  color: #999;
}

.third-party-login {
  text-align: center;
  margin-bottom: 50rpx;
}

.divider {
  display: block;
  text-align: center;
  color: #999;
  font-size: 28rpx;
  position: relative;
  margin-bottom: 40rpx;
}

.divider::before, .divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 30%;
  height: 1rpx;
  background: #eee;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.third-party-icons {
  display: flex;
  justify-content: center;
  gap: 80rpx;
}

.wechat-login-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wechat-login-btn.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.wechat-btn-icon {
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 16rpx;
  border-radius: 50%;
  background: #f5f5f5;
  padding: 20rpx;
  box-sizing: content-box;
}

.wechat-btn-text {
  font-size: 24rpx;
  color: #666;
}

.register-tip {
  text-align: center;
  font-size: 28rpx;
  color: #666;
}

.register-link {
  color: #667eea;
  margin-left: 10rpx;
  font-weight: 500;
}

.agreement {
  text-align: center;
  font-size: 24rpx;
  color: #000000;
  padding: 40rpx 0;
  line-height: 1.6;
}

.agreement-link {
  color: #0000ff;
  margin: 0 4rpx;
}
</style>