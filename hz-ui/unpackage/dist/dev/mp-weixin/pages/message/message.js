"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  __name: "message",
  setup(__props) {
    const activeTab = common_vendor.ref("message");
    const unreadCount = common_vendor.ref(0);
    const announcements = common_vendor.ref([]);
    const messages = common_vendor.ref([]);
    const state = common_vendor.reactive({ wsConnected: false, timer: null });
    const totalUnreadCount = common_vendor.computed(() => {
      let total = 0;
      messages.value.forEach((msg) => {
        total += msg.unread || 0;
      });
      return total;
    });
    common_vendor.onMounted(() => {
      getmessages();
      fetchAnnouncements();
      startPolling();
      updateUnreadBadge();
    });
    common_vendor.onShow(() => {
      getmessages();
    });
    common_vendor.onUnmounted(() => {
      if (state.timer)
        clearInterval(state.timer);
      closeWebSocket();
    });
    common_vendor.watch(totalUnreadCount, (newVal) => {
      unreadCount.value = newVal;
      updateTabBarBadge(newVal);
    });
    const switchTab = (tab) => {
      activeTab.value = tab;
    };
    const goToChat = (id) => {
      markAsRead(id);
      common_vendor.index.navigateTo({ url: `/pages/message/chat?id=${id}` });
    };
    const fetchAnnouncements = async () => {
      try {
        const res = await utils_request.request.get("/announcement/list", { params: { current: 1, size: 50 } });
        if (res.code === 0 && res.data) {
          announcements.value = res.data.records || res.data || [];
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/message/message.vue:105", "获取公告失败", e);
      }
    };
    const showDetail = (item) => {
      common_vendor.index.showModal({
        title: item.title,
        content: item.content,
        showCancel: false,
        confirmText: "我知道了"
      });
    };
    const getmessages = async () => {
      try {
        const res = await utils_request.request.get("/message/get");
        if (res.code === 0 || res.success) {
          messages.value = res.data || [];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/message/message.vue:124", "请求失败:", error);
      }
    };
    const markAsRead = (id) => {
      const idx = messages.value.findIndex((msg) => msg.id === id);
      if (idx !== -1) {
        messages.value[idx].unread = 0;
        messages.value = [...messages.value];
      }
      updateUnreadBadge();
    };
    const updateTabBarBadge = (count) => {
      if (count > 0)
        common_vendor.index.setTabBarBadge({ index: 2, text: count > 99 ? "99+" : count.toString() });
      else
        common_vendor.index.removeTabBarBadge({ index: 2 });
    };
    const closeWebSocket = () => {
      state.wsConnected = false;
    };
    const startPolling = () => {
      state.timer = setInterval(async () => {
      }, 3e4);
    };
    const updateUnreadBadge = () => {
      updateTabBarBadge(totalUnreadCount.value);
    };
    const onImageError = (e) => {
      e.target.src = "/static/default-avatar.png";
    };
    const formatTime = (time) => {
      if (!time)
        return "";
      const date = new Date(time), now = /* @__PURE__ */ new Date(), diff = now - date;
      if (diff < 6e4)
        return "刚刚";
      if (diff < 36e5)
        return Math.floor(diff / 6e4) + "分钟前";
      if (diff < 864e5)
        return Math.floor(diff / 36e5) + "小时前";
      if (diff < 6048e5)
        return Math.floor(diff / 864e5) + "天前";
      return date.getMonth() + 1 + "-" + date.getDate();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: totalUnreadCount.value > 0
      }, totalUnreadCount.value > 0 ? {
        b: common_vendor.t(totalUnreadCount.value > 99 ? "99+" : totalUnreadCount.value)
      } : {}, {
        c: activeTab.value === "message" ? 1 : "",
        d: common_vendor.o(($event) => switchTab("message"), "29"),
        e: activeTab.value === "announcement" ? 1 : "",
        f: common_vendor.o(($event) => switchTab("announcement"), "60"),
        g: activeTab.value === "message"
      }, activeTab.value === "message" ? common_vendor.e({
        h: common_vendor.f(messages.value, (message, index, i0) => {
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
        i: messages.value.length === 0
      }, messages.value.length === 0 ? {} : {}) : {}, {
        j: activeTab.value === "announcement"
      }, activeTab.value === "announcement" ? common_vendor.e({
        k: common_vendor.f(announcements.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(formatTime(item.createTime)),
            b: common_vendor.t(item.title),
            c: common_vendor.t(item.content),
            d: item.id,
            e: common_vendor.o(($event) => showDetail(item), item.id)
          };
        }),
        l: announcements.value.length === 0
      }, announcements.value.length === 0 ? {} : {}) : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4c1b26cf"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/message/message.js.map
