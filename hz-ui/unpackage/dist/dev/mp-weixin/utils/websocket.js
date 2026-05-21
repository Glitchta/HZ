"use strict";
const common_vendor = require("../common/vendor.js");
const utils_request = require("./request.js");
class WebSocketManager {
  constructor() {
    this.socket = null;
    this.socketConnected = false;
    this.reconnectCount = 0;
    this.maxReconnectCount = 5;
    this.reconnectTimer = null;
    this.messageHandlers = /* @__PURE__ */ new Map();
    this.baseURL = this.getWebSocketBaseURL();
  }
  // 从request的baseURL获取WebSocket的baseURL
  getWebSocketBaseURL() {
    const httpBaseURL = utils_request.request.baseURL;
    return httpBaseURL.replace("http://", "ws://").replace("https://", "wss://");
  }
  // 初始化WebSocket连接
  initWebSocket() {
    try {
      const wsUrl = `${this.baseURL}/ws/chat`;
      common_vendor.index.__f__("log", "at utils/websocket.js:24", "WebSocket连接地址:", wsUrl);
      this.socket = common_vendor.index.connectSocket({
        url: wsUrl,
        success: () => {
          common_vendor.index.__f__("log", "at utils/websocket.js:29", "WebSocket连接创建成功");
        }
      });
      this.socket.onOpen(() => {
        common_vendor.index.__f__("log", "at utils/websocket.js:34", "WebSocket连接成功");
        this.socketConnected = true;
        this.reconnectCount = 0;
        this.sendAuthMessage();
      });
      this.socket.onMessage((res) => {
        try {
          const data = JSON.parse(res.data);
          this.handleWebSocketMessage(data);
        } catch (error) {
          common_vendor.index.__f__("error", "at utils/websocket.js:47", "WebSocket消息解析失败:", error);
        }
      });
      this.socket.onError((err) => {
        common_vendor.index.__f__("error", "at utils/websocket.js:52", "WebSocket错误:", err);
        this.socketConnected = false;
      });
      this.socket.onClose(() => {
        common_vendor.index.__f__("log", "at utils/websocket.js:57", "WebSocket连接关闭");
        this.socketConnected = false;
        this.scheduleReconnect();
      });
    } catch (error) {
      common_vendor.index.__f__("error", "at utils/websocket.js:64", "WebSocket初始化失败:", error);
      this.scheduleReconnect();
    }
  }
  // 发送认证信息
  sendAuthMessage() {
    if (this.socket && this.socketConnected) {
      const token = common_vendor.index.getStorageSync("token");
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      const userId = userInfo ? userInfo.userId || userInfo.id : "";
      const authData = {
        type: "auth",
        token,
        userId
      };
      this.socket.send({ data: JSON.stringify(authData) });
    }
  }
  // 处理WebSocket消息
  handleWebSocketMessage(data) {
    if (data.type === "chat_message") {
      const handlers = this.messageHandlers.get("chat_message") || [];
      handlers.forEach((handler) => {
        try {
          handler(data.data);
        } catch (error) {
          common_vendor.index.__f__("error", "at utils/websocket.js:94", "WebSocket消息处理失败:", error);
        }
      });
    } else if (data.type === "typing") {
      const handlers = this.messageHandlers.get("typing") || [];
      handlers.forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          common_vendor.index.__f__("error", "at utils/websocket.js:104", "WebSocket消息处理失败:", error);
        }
      });
    } else if (data.type === "read_receipt") {
      const handlers = this.messageHandlers.get("read_receipt") || [];
      handlers.forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          common_vendor.index.__f__("error", "at utils/websocket.js:114", "WebSocket消息处理失败:", error);
        }
      });
    }
  }
  // 发送消息
  sendMessage(message) {
    if (this.socket && this.socketConnected) {
      if (message === void 0 || message === null) {
        common_vendor.index.__f__("error", "at utils/websocket.js:124", "WebSocket发送消息失败: 消息为undefined或null");
        return false;
      }
      try {
        const jsonString = JSON.stringify(message);
        this.socket.send({ data: jsonString });
        return true;
      } catch (error) {
        common_vendor.index.__f__("error", "at utils/websocket.js:132", "WebSocket发送消息失败: JSON序列化错误", error);
        return false;
      }
    } else {
      common_vendor.index.__f__("error", "at utils/websocket.js:136", "WebSocket未连接，无法发送消息");
      return false;
    }
  }
  // 注册消息处理器
  onMessage(type, handler) {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    const handlers = this.messageHandlers.get(type);
    if (!handlers.includes(handler)) {
      handlers.push(handler);
    }
  }
  // 移除消息处理器
  offMessage(type, handler) {
    if (this.messageHandlers.has(type)) {
      const handlers = this.messageHandlers.get(type);
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }
  // 重连逻辑
  scheduleReconnect() {
    if (this.reconnectCount < this.maxReconnectCount) {
      this.reconnectCount++;
      const delay = Math.min(1e3 * Math.pow(2, this.reconnectCount), 3e4);
      this.reconnectTimer = setTimeout(() => {
        this.reconnectWebSocket();
      }, delay);
    }
  }
  // 重连WebSocket
  reconnectWebSocket() {
    if (!this.socketConnected) {
      this.initWebSocket();
    }
  }
  // 关闭WebSocket
  closeWebSocket() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.socketConnected = false;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
  // 清理定时器
  clearTimers() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
  // 刷新token后重新连接
  refreshConnection() {
    this.closeWebSocket();
    this.initWebSocket();
  }
}
const websocketManager = new WebSocketManager();
const websocketManager$1 = websocketManager;
exports.websocketManager = websocketManager$1;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/websocket.js.map
