<template>
  <el-container class="layout">
    <el-aside width="220px" class="sidebar">
      <div class="logo-area">
        <div class="logo-icon"><el-icon :size="20"><School /></el-icon></div>
        <span class="logo-text">校园互助管理</span>
      </div>
      <el-menu :default-active="activeMenu" router class="side-menu">
        <el-menu-item index="/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/contents">
          <el-icon><Document /></el-icon>
          <span>内容管理</span>
        </el-menu-item>
        <el-menu-item index="/comments">
          <el-icon><ChatDotRound /></el-icon>
          <span>评论管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container class="main-area">
      <el-header class="topbar">
        <div class="topbar-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="route.meta.title">{{ route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="topbar-right">
          <el-avatar :size="28" icon="UserFilled" />
          <span class="topbar-user">{{ username }}</span>
          <el-button type="danger" text @click="handleLogout">退出</el-button>
        </div>
      </el-header>
      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { DataAnalysis, User, Document, ChatDotRound, School } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const activeMenu = computed(() => {
  const p = route.path
  if (p.startsWith('/users')) return '/users'
  if (p.startsWith('/contents')) return '/contents'
  if (p.startsWith('/comments')) return '/comments'
  return '/dashboard'
})
const username = computed(() => localStorage.getItem('admin_username') || '')

function handleLogout() { auth.logout(); router.replace('/login') }
</script>

<style scoped>
.layout { height: 100vh; }
.sidebar { background: #fff; border-right: 1px solid #eee; overflow: hidden; display: flex; flex-direction: column; }
.logo-area { height: 60px; display: flex; align-items: center; gap: 10px; padding: 0 18px; border-bottom: 1px solid #f0f0f0; }
.logo-icon { color: #409EFF; }
.logo-text { font-size: 16px; font-weight: 700; color: #1a1a2e; }

.side-menu { border-right: none; flex: 1; padding-top: 4px; }
.side-menu :deep(.el-menu-item) {
  margin: 2px 10px; border-radius: 10px; height: 42px; line-height: 42px; font-size: 14px; color: #555; transition: all .2s;
}
.side-menu :deep(.el-menu-item:hover) { background: #f0f5ff !important; color: #409EFF !important; }
.side-menu :deep(.el-menu-item.is-active) { background: #e6f4ff !important; color: #1677ff !important; font-weight: 600; }

.main-area { background: #f5f7fa; }
.topbar { height: 52px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; box-shadow: 0 1px 4px rgba(0,0,0,.04); z-index: 10; }
.topbar-left { display: flex; align-items: center; }
.topbar-right { display: flex; align-items: center; gap: 10px; }
.topbar-user { color: #666; font-size: 14px; }
.main-content { background: #f5f7fa; padding: 24px; overflow-y: auto; }

.fade-enter-active, .fade-leave-active { transition: all .2s ease; }
.fade-enter-from { opacity: 0; transform: translateX(8px); }
.fade-leave-to { opacity: 0; transform: translateX(-8px); }
</style>
