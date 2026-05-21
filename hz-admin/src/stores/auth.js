import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('admin_token') || '')
  const username = ref(localStorage.getItem('admin_username') || '')
  const role = ref(localStorage.getItem('admin_role') || '')

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => role.value === 'ADMIN')

  async function login(form) {
    const res = await axios.post('/user/login', {
      username: form.username,
      password: form.password
    })
    const data = res.data
    if (data.code !== 0) {
      throw new Error(data.msg || '登录失败')
    }
    const user = data.data
    if (user.role !== 'ADMIN') {
      throw new Error('无管理员权限')
    }
    token.value = user.accessToken
    username.value = user.username
    role.value = user.role
    localStorage.setItem('admin_token', user.accessToken)
    localStorage.setItem('admin_username', user.username)
    localStorage.setItem('admin_role', user.role)
  }

  function logout() {
    token.value = ''
    username.value = ''
    role.value = ''
    localStorage.clear()
  }

  return { token, username, role, isLoggedIn, isAdmin, login, logout }
})
