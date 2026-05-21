"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_websocket = require("../../utils/websocket.js");
const utils_request = require("../../utils/request.js");
const pageSize = 20;
const _sfc_main = {
  __name: "chat",
  props: {
    id: String,
    type: {
      type: String,
      default: "private"
    }
  },
  setup(__props) {
    const receiver = common_vendor.ref({});
    const currentUser = common_vendor.ref({});
    const inputText = common_vendor.ref("");
    const scrollToId = common_vendor.ref("");
    const loadingHistory = common_vendor.ref(false);
    const hasMoreHistory = common_vendor.ref(true);
    const messages = common_vendor.ref([]);
    let pageNum = 1;
    common_vendor.onLoad((options) => {
      const id = options.id;
      if (!id) {
        common_vendor.index.showToast({
          title: "参数错误",
          icon: "none"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
        return;
      }
      getCurrentUserInfo();
      getReceiver(id);
      registerWebSocketHandlers();
    });
    common_vendor.onShow(() => {
      if (utils_websocket.websocketManager) {
        utils_websocket.websocketManager.reconnectWebSocket();
      }
      refreshLatestMessages();
    });
    common_vendor.onHide(() => {
      saveDraft();
    });
    common_vendor.onUnload(() => {
      clearTimers();
      unregisterWebSocketHandlers();
    });
    const getCurrentUserInfo = () => {
      try {
        const userInfo = common_vendor.index.getStorageSync("userInfo");
        if (userInfo) {
          currentUser.value = userInfo;
        } else {
          common_vendor.index.__f__("warn", "at pages/message/chat.vue:183", "未找到当前用户信息");
          fetchCurrentUserInfo();
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/message/chat.vue:188", "获取当前用户信息失败:", error);
      }
    };
    const fetchCurrentUserInfo = async () => {
      try {
        const res = await utils_request.request.get("/userInfo/get");
        common_vendor.index.__f__("log", "at pages/message/chat.vue:196", "获取当前用户信息接口返回:", res);
        if (res && res.code === 0 && res.data) {
          currentUser.value = res.data;
          common_vendor.index.setStorageSync("userInfo", res.data);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/message/chat.vue:203", "从接口获取用户信息失败:", error);
      }
    };
    const getReceiver = async (id) => {
      common_vendor.index.__f__("log", "at pages/message/chat.vue:209", "开始获取对方信息，ID:", id);
      try {
        const res = await utils_request.request.get("/userInfo/getById", { params: { id } });
        if (res && res.code === 0 && res.data) {
          receiver.value = res.data;
          common_vendor.index.setNavigationBarTitle({
            title: receiver.value.nickname || "聊天"
          });
          loadHistoryMessages();
          const draft = common_vendor.index.getStorageSync(`chat_draft_${receiver.value.userId}`);
          if (draft) {
            inputText.value = draft;
            common_vendor.index.removeStorageSync(`chat_draft_${receiver.value.userId}`);
          }
        } else {
          common_vendor.index.__f__("error", "at pages/message/chat.vue:231", "接口返回数据异常:", res);
          common_vendor.index.showToast({
            title: (res == null ? void 0 : res.msg) || "获取用户信息失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/message/chat.vue:238", "获取对方信息失败:", error);
        common_vendor.index.showToast({
          title: "获取信息失败，请检查网络",
          icon: "none"
        });
      }
    };
    const loadHistoryMessages = async () => {
      if (loadingHistory.value || !hasMoreHistory.value || !receiver.value || !receiver.value.userId) {
        return;
      }
      loadingHistory.value = true;
      try {
        const res = await utils_request.request.get("/message/chat", {
          params: {
            receiverId: receiver.value.userId,
            current: pageNum,
            size: pageSize
          }
        });
        common_vendor.index.__f__("log", "at pages/message/chat.vue:262", "历史消息接口返回:", res);
        if (res && res.code === 0) {
          let historyMessages = [];
          const currentUserId = currentUser.value.userId || getCurrentUserId();
          if (Array.isArray(res.data)) {
            historyMessages = res.data;
          } else if (res.data && res.data.records) {
            historyMessages = res.data.records;
          } else if (res.data) {
            historyMessages = res.data;
          }
          common_vendor.index.__f__("log", "at pages/message/chat.vue:276", "获取到的消息列表:", historyMessages);
          if (historyMessages && historyMessages.length > 0) {
            const formattedMessages = historyMessages.map((msg) => ({
              id: msg.id || `msg_${Date.now()}_${Math.floor(Math.random() * 1e5)}`,
              type: msg.type || "text",
              content: msg.content || "",
              status: "success",
              timestamp: msg.timestamp ? new Date(msg.timestamp).getTime() : Date.now(),
              isOwn: msg.senderId === currentUserId || msg.fromUserId === currentUserId,
              receiverId: msg.receiverId || receiver.value.userId
            }));
            messages.value = [...formattedMessages.reverse(), ...messages.value];
            pageNum++;
            common_vendor.index.__f__("log", "at pages/message/chat.vue:292", `加载了 ${formattedMessages.length} 条消息，当前总数: ${messages.value.length}`);
            if (pageNum === 2 && formattedMessages.length > 0) {
              setTimeout(() => {
                scrollToBottom();
              }, 300);
            }
          } else {
            hasMoreHistory.value = false;
            common_vendor.index.__f__("log", "at pages/message/chat.vue:301", "没有更多历史消息");
          }
        } else {
          common_vendor.index.__f__("error", "at pages/message/chat.vue:304", "历史消息接口返回错误:", res);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/message/chat.vue:307", "加载历史消息异常:", error);
      } finally {
        loadingHistory.value = false;
      }
    };
    const sendTextMessage = () => {
      const text = inputText.value.trim();
      if (!text || !receiver.value || !receiver.value.userId)
        return;
      const message = {
        id: `send_${Date.now()}_${Math.floor(Math.random() * 1e5)}`,
        type: "text",
        content: text,
        isOwn: true,
        status: "sending",
        timestamp: Date.now(),
        receiverId: receiver.value.userId
      };
      messages.value.push(message);
      inputText.value = "";
      scrollToBottom();
      sendMessageToServer(message);
    };
    const sendMessageToServer = async (message) => {
      common_vendor.index.__f__("log", "at pages/message/chat.vue:337", "开始发送消息到服务器，消息内容:", message);
      try {
        const messageData = {
          receiverId: message.receiverId,
          content: message.content,
          type: message.type
        };
        common_vendor.index.__f__("log", "at pages/message/chat.vue:347", "发送的数据结构:", messageData);
        const res = await utils_request.request.post("/message/send", messageData);
        common_vendor.index.__f__("log", "at pages/message/chat.vue:351", "发送消息接口响应:", res);
        if (res && res.code === 0) {
          updateMessageStatus(message.id, "success");
          if (res.data && res.data.id) {
            const index = messages.value.findIndex((msg) => msg.id === message.id);
            if (index !== -1) {
              messages.value[index].id = res.data.id;
            }
          }
          if (utils_websocket.websocketManager) {
            const wsMessage = {
              type: "chat_message",
              data: {
                ...message,
                id: res.data && res.data.id || message.id,
                senderId: currentUser.value.userId
              }
            };
            const success = utils_websocket.websocketManager.sendMessage(wsMessage);
            common_vendor.index.__f__("log", "at pages/message/chat.vue:375", "WebSocket发送结果:", success);
          }
        } else {
          updateMessageStatus(message.id, "fail");
          common_vendor.index.__f__("error", "at pages/message/chat.vue:380", "消息发送失败，业务错误:", res);
          common_vendor.index.showToast({
            title: (res == null ? void 0 : res.msg) || "发送失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/message/chat.vue:387", "发送消息异常:", error);
        updateMessageStatus(message.id, "fail");
        common_vendor.index.showToast({
          title: "发送失败: " + (error.message || "网络错误"),
          icon: "none"
        });
      }
    };
    const updateMessageStatus = (messageId, status) => {
      const index = messages.value.findIndex((msg) => msg.id === messageId);
      if (index !== -1) {
        messages.value[index].status = status;
      }
    };
    const refreshLatestMessages = async () => {
      if (!receiver.value || !receiver.value.userId)
        return;
      try {
        const currentUserId = currentUser.value.userId || getCurrentUserId();
        const res = await utils_request.request.get("/message/chat", {
          params: {
            receiverId: receiver.value.userId,
            current: 1,
            size: pageSize
          }
        });
        if (res && res.code === 0) {
          let serverMessages = [];
          if (Array.isArray(res.data)) {
            serverMessages = res.data;
          } else if (res.data && res.data.records) {
            serverMessages = res.data.records;
          }
          if (serverMessages && serverMessages.length > 0) {
            const existingIds = new Set(messages.value.map((m) => m.id));
            let hasNew = false;
            serverMessages.forEach((msg) => {
              if (!existingIds.has(msg.id)) {
                messages.value.push({
                  id: msg.id,
                  type: msg.type || "text",
                  content: msg.content || "",
                  status: "success",
                  timestamp: msg.timestamp ? new Date(msg.timestamp).getTime() : Date.now(),
                  isOwn: msg.senderId === currentUserId,
                  receiverId: msg.receiverId || receiver.value.userId
                });
                hasNew = true;
              }
            });
            if (hasNew) {
              messages.value.sort((a, b) => a.timestamp - b.timestamp);
              scrollToBottom();
            }
          }
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/message/chat.vue:453", "刷新消息失败:", error);
      }
    };
    const handleIncomingMessage = (message) => {
      common_vendor.index.__f__("log", "at pages/message/chat.vue:459", "收到WebSocket消息:", message);
      common_vendor.index.__f__("log", "at pages/message/chat.vue:460", "当前receiver:", receiver.value);
      common_vendor.index.__f__("log", "at pages/message/chat.vue:461", "当前currentUser:", currentUser.value);
      if (!message || !message.content) {
        common_vendor.index.__f__("warn", "at pages/message/chat.vue:464", "收到空消息或无效消息");
        return;
      }
      const currentUserId = currentUser.value.userId || getCurrentUserId();
      const chatPartnerId = receiver.value && receiver.value.userId;
      const fromChatPartner = message.senderId && String(message.senderId) === String(chatPartnerId);
      const fromCurrentUser = message.senderId && String(message.senderId) === String(currentUserId);
      common_vendor.index.__f__("log", "at pages/message/chat.vue:476", "消息判断:", { fromChatPartner, fromCurrentUser, messageSenderId: message.senderId, chatPartnerId, currentUserId });
      if (receiver.value && (fromChatPartner || fromCurrentUser)) {
        const existingIndex = messages.value.findIndex(
          (msg) => msg.id && msg.id === message.id || msg.content === message.content && Math.abs(msg.timestamp - message.timestamp) < 2e3
        );
        if (existingIndex === -1) {
          messages.value.push({
            id: message.id || `ws_${Date.now()}_${Math.floor(Math.random() * 1e5)}`,
            type: message.type || "text",
            content: message.content || "",
            status: "success",
            timestamp: message.timestamp || Date.now(),
            isOwn: fromCurrentUser,
            receiverId: message.receiverId || receiver.value.userId
          });
          scrollToBottom();
          common_vendor.index.__f__("log", "at pages/message/chat.vue:495", "消息已添加到聊天界面");
        } else {
          common_vendor.index.__f__("log", "at pages/message/chat.vue:497", "消息重复，已跳过");
        }
      } else {
        common_vendor.index.__f__("log", "at pages/message/chat.vue:500", "消息不匹配当前聊天，已忽略");
      }
    };
    const registerWebSocketHandlers = () => {
      if (utils_websocket.websocketManager) {
        utils_websocket.websocketManager.onMessage("chat_message", handleIncomingMessage);
      }
    };
    const unregisterWebSocketHandlers = () => {
      if (utils_websocket.websocketManager) {
        utils_websocket.websocketManager.offMessage("chat_message", handleIncomingMessage);
      }
    };
    const getCurrentUserId = () => {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      return userInfo ? userInfo.userId || "" : "";
    };
    const scrollToBottom = () => {
      common_vendor.nextTick$1(() => {
        if (messages.value.length > 0) {
          const lastMsg = messages.value[messages.value.length - 1];
          scrollToId.value = "msg-" + lastMsg.id;
        }
      });
    };
    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    };
    const getMessageClass = (msg) => {
      return {
        "own-message": msg.isOwn,
        "other-message": !msg.isOwn,
        "message-sending": msg.status === "sending",
        "message-fail": msg.status === "fail"
      };
    };
    const getMessageWrapperClass = (msg) => {
      return {
        "own-wrapper": msg.isOwn,
        "other-wrapper": !msg.isOwn
      };
    };
    const clearTimers = () => {
    };
    const saveDraft = () => {
      if (inputText.value && receiver.value && receiver.value.userId) {
        common_vendor.index.setStorageSync(`chat_draft_${receiver.value.userId}`, inputText.value);
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: loadingHistory.value
      }, loadingHistory.value ? {} : {}, {
        b: common_vendor.f(messages.value, (msg, index, i0) => {
          return common_vendor.e({
            a: !msg.isOwn
          }, !msg.isOwn ? {
            b: receiver.value.avatar
          } : {}, {
            c: !msg.isOwn
          }, !msg.isOwn ? common_vendor.e({
            d: msg.status === "fail"
          }, msg.status === "fail" ? {} : {}, {
            e: common_vendor.t(msg.content),
            f: common_vendor.t(formatTime(msg.timestamp)),
            g: common_vendor.n(getMessageClass(msg))
          }) : {}, {
            h: msg.isOwn
          }, msg.isOwn ? common_vendor.e({
            i: msg.status === "fail"
          }, msg.status === "fail" ? {} : {}, {
            j: common_vendor.t(msg.content),
            k: common_vendor.t(formatTime(msg.timestamp)),
            l: common_vendor.n(getMessageClass(msg))
          }) : {}, {
            m: msg.isOwn
          }, msg.isOwn ? {
            n: currentUser.value.avatar
          } : {}, {
            o: msg.id,
            p: "msg-" + msg.id,
            q: common_vendor.n(getMessageWrapperClass(msg))
          });
        }),
        c: messages.value.length === 0 && !loadingHistory.value
      }, messages.value.length === 0 && !loadingHistory.value ? {} : {}, {
        d: scrollToId.value,
        e: common_vendor.o((...args) => _ctx.loadMoreHistory && _ctx.loadMoreHistory(...args), "75"),
        f: common_vendor.o(sendTextMessage, "70"),
        g: inputText.value,
        h: common_vendor.o(($event) => inputText.value = $event.detail.value, "0f"),
        i: inputText.value.trim() ? 1 : "",
        j: common_vendor.o(sendTextMessage, "32")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-013fa921"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/message/chat.js.map
