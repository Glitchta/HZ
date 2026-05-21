<script>
import websocketManager from './utils/websocket'

export default {
  onLaunch: function() {
    console.log('App Launch')
    // 初始化WebSocket连接
    websocketManager.initWebSocket()
  },
  onShow: function() {
    console.log('App Show')
    // 恢复WebSocket连接
    if (!websocketManager.socketConnected) {
      websocketManager.reconnectWebSocket()
    }
  },
  onHide: function() {
    console.log('App Hide')
  }
}
</script>

<style>
/* 每个页面公共css */
page {
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
}

.container {
  min-height: 100vh;
  box-sizing: border-box;
}

/* 基础样式 */
::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
  color: transparent;
}
</style>