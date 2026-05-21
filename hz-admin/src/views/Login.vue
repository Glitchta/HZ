<template>
  <div class="login-bg">
    <div class="login-card">
      <div class="login-left">
        <div class="brand-icon"><el-icon :size="40"><School /></el-icon></div>
        <h1>校园互助</h1>
        <p>管理后台</p>
      </div>
      <div class="login-right">
        <h3>欢迎回来</h3>
        <el-form :model="form" :rules="rules" ref="formRef">
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="用户名" size="large">
              <template #prefix><el-icon><User /></el-icon></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="form.password" type="password" placeholder="密码" size="large"
                      @keyup.enter="handleLogin" show-password>
              <template #prefix><el-icon><Lock /></el-icon></template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="handleLogin" size="large" class="login-btn">
              登 录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'
import { User, Lock, School } from '@element-plus/icons-vue'

const router = useRouter()
const auth = useAuthStore()
const formRef = ref(null)
const loading = ref(false)
const form = reactive({ username: '', password: '' })
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

async function handleLogin() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  loading.value = true
  try {
    await auth.login(form)
    ElMessage.success('登录成功')
    router.replace('/dashboard')
  } catch (e) {
    ElMessage.error(e.message || '登录失败')
  } finally { loading.value = false }
}
</script>

<style scoped>
.login-bg {
  height: 100vh; display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #e8f0fe 0%, #f0f5ff 30%, #f5f7fa 60%, #e6f0fa 100%);
}
.login-card { display: flex; width: 680px; border-radius: 14px; overflow: hidden; box-shadow: 0 8px 36px rgba(0,0,0,.06); }
.login-left {
  width: 260px; background: linear-gradient(135deg, #1677ff, #409EFF);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  color: #fff; padding: 36px;
}
.brand-icon { margin-bottom: 10px; }
.login-left h1 { margin: 0; font-size: 24px; font-weight: 700; }
.login-left p { margin: 4px 0 0; font-size: 13px; opacity: .85; }
.login-right { flex: 1; background: #fff; padding: 52px 44px; }
.login-right h3 { margin: 0 0 30px; font-size: 20px; color: #1a1a2e; font-weight: 600; }
.login-btn { width: 100%; border-radius: 8px; height: 44px; font-size: 16px; letter-spacing: 3px; }
</style>
