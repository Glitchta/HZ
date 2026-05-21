import request from './request'

class WebSocketManager {
  constructor() {
    this.socket = null
    this.socketConnected = false
    this.reconnectCount = 0
    this.maxReconnectCount = 5
    this.reconnectTimer = null
    this.messageHandlers = new Map()
    this.baseURL = this.getWebSocketBaseURL()
  }

  // 从request的baseURL获取WebSocket的baseURL
  getWebSocketBaseURL() {
    const httpBaseURL = request.baseURL
    return httpBaseURL.replace('http://', 'ws://').replace('https://', 'wss://')
  }

  // 初始化WebSocket连接
  initWebSocket() {
    try {
      const wsUrl = `${this.baseURL}/ws/chat`
      console.log('WebSocket连接地址:', wsUrl)
      
      this.socket = uni.connectSocket({
        url: wsUrl,
        success: () => {
          console.log('WebSocket连接创建成功')
        }
      })
      
      this.socket.onOpen(() => {
        console.log('WebSocket连接成功')
        this.socketConnected = true
        this.reconnectCount = 0
        
        // 发送认证信息
        this.sendAuthMessage()
      })
      
      this.socket.onMessage((res) => {
        try {
          const data = JSON.parse(res.data)
          this.handleWebSocketMessage(data)
        } catch (error) {
          console.error('WebSocket消息解析失败:', error)
        }
      })
      
      this.socket.onError((err) => {
        console.error('WebSocket错误:', err)
        this.socketConnected = false
      })
      
      this.socket.onClose(() => {
        console.log('WebSocket连接关闭')
        this.socketConnected = false
        // 尝试重连
        this.scheduleReconnect()
      })
      
    } catch (error) {
      console.error('WebSocket初始化失败:', error)
      this.scheduleReconnect()
    }
  }

  // 发送认证信息
  sendAuthMessage() {
    if (this.socket && this.socketConnected) {
      const token = uni.getStorageSync('token')
      const userInfo = uni.getStorageSync('userInfo')
      const userId = userInfo ? (userInfo.userId || userInfo.id) : ''
      
      const authData = {
        type: 'auth',
        token: token,
        userId: userId
      }
      this.socket.send({ data: JSON.stringify(authData) })
    }
  }

  // 处理WebSocket消息
  handleWebSocketMessage(data) {
    if (data.type === 'chat_message') {
      // 触发消息处理回调
      const handlers = this.messageHandlers.get('chat_message') || []
      handlers.forEach(handler => {
        try {
          handler(data.data)
        } catch (error) {
          console.error('WebSocket消息处理失败:', error)
        }
      })
    } else if (data.type === 'typing') {
      // 处理正在输入状态
      const handlers = this.messageHandlers.get('typing') || []
      handlers.forEach(handler => {
        try {
          handler(data)
        } catch (error) {
          console.error('WebSocket消息处理失败:', error)
        }
      })
    } else if (data.type === 'read_receipt') {
      // 处理已读回执
      const handlers = this.messageHandlers.get('read_receipt') || []
      handlers.forEach(handler => {
        try {
          handler(data)
        } catch (error) {
          console.error('WebSocket消息处理失败:', error)
        }
      })
    }
  }

// 发送消息
sendMessage(message) {
  if (this.socket && this.socketConnected) {
    if (message === undefined || message === null) {
      console.error('WebSocket发送消息失败: 消息为undefined或null')
      return false
    }
    try {
      const jsonString = JSON.stringify(message)
      this.socket.send({ data: jsonString })
      return true
    } catch (error) {
      console.error('WebSocket发送消息失败: JSON序列化错误', error)
      return false
    }
  } else {
    console.error('WebSocket未连接，无法发送消息')
    return false
  }
}

  // 注册消息处理器
  onMessage(type, handler) {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, [])
    }
    const handlers = this.messageHandlers.get(type)
    // 避免重复注册同一个handler
    if (!handlers.includes(handler)) {
      handlers.push(handler)
    }
  }

  // 移除消息处理器
  offMessage(type, handler) {
    if (this.messageHandlers.has(type)) {
      const handlers = this.messageHandlers.get(type)
      const index = handlers.indexOf(handler)
      if (index !== -1) {
        handlers.splice(index, 1)
      }
    }
  }

  // 重连逻辑
  scheduleReconnect() {
    if (this.reconnectCount < this.maxReconnectCount) {
      this.reconnectCount++
      const delay = Math.min(1000 * Math.pow(2, this.reconnectCount), 30000)
      
      this.reconnectTimer = setTimeout(() => {
        this.reconnectWebSocket()
      }, delay)
    }
  }

  // 重连WebSocket
  reconnectWebSocket() {
    if (!this.socketConnected) {
      this.initWebSocket()
    }
  }

  // 关闭WebSocket
  closeWebSocket() {
    if (this.socket) {
      this.socket.close()
      this.socket = null
      this.socketConnected = false
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  // 清理定时器
  clearTimers() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  // 刷新token后重新连接
  refreshConnection() {
    this.closeWebSocket()
    this.initWebSocket()
  }
}

// 创建单例实例
const websocketManager = new WebSocketManager()

// 监听token刷新事件
// 这里可以通过事件总线或者直接在token刷新后调用
// 暂时通过导出方法供外部调用
export const refreshWebSocketConnection = () => {
  websocketManager.refreshConnection()
}

export default websocketManager