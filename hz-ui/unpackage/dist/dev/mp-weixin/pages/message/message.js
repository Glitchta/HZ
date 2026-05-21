"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  __name: "message",
  setup(__props, { expose: __expose }) {
    const activeTab = common_vendor.ref("all");
    const unreadCount = common_vendor.ref(0);
    const messages = common_vendor.ref([]);
    const state = common_vendor.reactive({
      wsConnected: false,
      timer: null
    });
    const totalUnreadCount = common_vendor.computed(() => {
      let total = 0;
      messages.value.forEach((msg) => {
        total += msg.unread || 0;
      });
      return total;
    });
    common_vendor.onMounted(() => {
      common_vendor.index.__f__("log", "at pages/message/message.vue:67", "消息页面加载");
      common_vendor.index.__f__("log", "at pages/message/message.vue:68", "初始 messages:", messages.value);
      getmessages();
      startPolling();
      updateUnreadBadge();
    });
    common_vendor.onShow(() => {
      getmessages();
    });
    common_vendor.onUnmounted(() => {
      if (state.timer) {
        clearInterval(state.timer);
      }
      closeWebSocket();
    });
    common_vendor.watch(totalUnreadCount, (newVal) => {
      unreadCount.value = newVal;
      common_vendor.index.__f__("log", "at pages/message/message.vue:88", "未读数更新:", newVal);
      updateTabBarBadge(newVal);
    });
    common_vendor.watch(activeTab, (newTab) => {
      common_vendor.index.__f__("log", "at pages/message/message.vue:94", "切换到Tab:", newTab);
      markAllAsRead(newTab);
    });
    const goToChat = (id) => {
      common_vendor.index.__f__("log", "at pages/message/message.vue:100", "跳转到聊天:", id);
      markAsRead(id);
      common_vendor.index.navigateTo({
        url: `/pages/message/chat?id=${id}`
      });
    };
    const getmessages = async () => {
      try {
        common_vendor.index.__f__("log", "at pages/message/message.vue:111", "开始获取消息列表...");
        const res = await utils_request.request.get("/message/get");
        common_vendor.index.__f__("log", "at pages/message/message.vue:113", "API响应:", res);
        if (res.code === 0 || res.success) {
          messages.value = res.data || [];
          common_vendor.index.__f__("log", "at pages/message/message.vue:117", "消息列表更新成功:", messages.value);
        } else {
          common_vendor.index.__f__("error", "at pages/message/message.vue:119", "获取消息列表失败:", res.message || res.msg);
          messages.value = [
            {
              id: "2047274345466511362",
              name: "微时代额",
              avatar: "https://via.placeholder.com/100",
              preview: "学长，高数题可以帮忙看看吗？",
              time: "刚刚",
              unread: 3
            },
            {
              id: "2047276902746243074",
              name: "皇城杰",
              avatar: "https://via.placeholder.com/100",
              preview: "学长，高数题可以帮忙看看吗？",
              time: "刚刚",
              unread: 3
            }
          ];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/message/message.vue:141", "请求失败:", error);
        messages.value = [
          {
            id: "2047274345466511362",
            name: "微时代额",
            avatar: "https://via.placeholder.com/100",
            preview: "学长，高数题可以帮忙看看吗？",
            time: "刚刚",
            unread: 3
          }
        ];
      }
    };
    const markAsRead = (id) => {
      const messageIndex = messages.value.findIndex((msg) => msg.id === id);
      if (messageIndex !== -1) {
        messages.value[messageIndex].unread = 0;
        messages.value = [...messages.value];
      }
      updateUnreadBadge();
    };
    const markAllAsRead = (type) => {
      common_vendor.index.__f__("log", "at pages/message/message.vue:169", "标记所有为已读:", type);
      messages.value = messages.value.map((msg) => ({
        ...msg,
        unread: 0
      }));
      updateUnreadBadge();
    };
    const updateTabBarBadge = (count) => {
      if (count > 0) {
        common_vendor.index.setTabBarBadge({
          index: 2,
          text: count > 99 ? "99+" : count.toString()
        });
      } else {
        common_vendor.index.removeTabBarBadge({ index: 2 });
      }
    };
    const closeWebSocket = () => {
      state.wsConnected = false;
    };
    const startPolling = () => {
      common_vendor.index.__f__("log", "at pages/message/message.vue:207", "开始轮询");
      state.timer = setInterval(async () => {
        common_vendor.index.__f__("log", "at pages/message/message.vue:210", "轮询检查新消息...");
      }, 3e4);
    };
    const updateUnreadBadge = () => {
      const count = totalUnreadCount.value;
      updateTabBarBadge(count);
    };
    const onImageError = (e) => {
      common_vendor.index.__f__("log", "at pages/message/message.vue:223", "图片加载失败:", e);
      e.target.src = "/static/default-avatar.png";
    };
    const formatTime = (time) => {
      if (!time)
        return "";
      const date = new Date(time);
      const now = /* @__PURE__ */ new Date();
      const diff = now - date;
      if (diff < 6e4) {
        return "刚刚";
      }
      if (diff < 36e5) {
        return Math.floor(diff / 6e4) + "分钟前";
      }
      if (diff < 864e5) {
        return Math.floor(diff / 36e5) + "小时前";
      }
      if (diff < 6048e5) {
        return Math.floor(diff / 864e5) + "天前";
      }
      return date.getMonth() + 1 + "-" + date.getDate();
    };
    __expose({
      unreadCount,
      messages,
      goToChat
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(messages.value, (message, index, i0) => {
          return common_vendor.e({
            a: message.avatar,
            b: common_vendor.o(onImageError, message.id || index),
            c: message.unread > 0
          }, message.unread > 0 ? {
            d: common_vendor.t(message.unread > 99 ? "99+" : message.unread)
          } : {}, {
            e: common_vendor.t(message.nickname),
            f: common_vendor.t(formatTime(message.timestamp)),
            g: common_vendor.t(message.content),
            h: message.id || index,
            i: common_vendor.o(($event) => goToChat(message.targetId), message.id || index)
          });
        }),
        b: messages.value.length === 0
      }, messages.value.length === 0 ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4c1b26cf"]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/message/message.js.map
