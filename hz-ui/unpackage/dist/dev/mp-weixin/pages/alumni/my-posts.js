"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_request = require("../../utils/request.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_swipe_action_item2 = common_vendor.resolveComponent("uni-swipe-action-item");
  const _easycom_uni_swipe_action2 = common_vendor.resolveComponent("uni-swipe-action");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_icons2 + _easycom_uni_swipe_action_item2 + _easycom_uni_swipe_action2 + _easycom_uni_load_more2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_swipe_action_item = () => "../../uni_modules/uni-swipe-action/components/uni-swipe-action-item/uni-swipe-action-item.js";
const _easycom_uni_swipe_action = () => "../../uni_modules/uni-swipe-action/components/uni-swipe-action/uni-swipe-action.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_swipe_action_item + _easycom_uni_swipe_action + _easycom_uni_load_more)();
}
const _sfc_main = {
  __name: "my-posts",
  setup(__props) {
    const tabs = [
      { label: "全部", value: "all" },
      { label: "求助", value: "help" },
      { label: "帮助", value: "helped" },
      { label: "失物招领", value: "lost" },
      { label: "树洞", value: "hole" },
      { label: "校友圈", value: "alumni" }
    ];
    const currentTab = common_vendor.ref("all");
    const postList = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const noMoreData = common_vendor.ref(false);
    const refresherTriggered = common_vendor.ref(false);
    const page = common_vendor.reactive({
      current: 1,
      size: 10
    });
    const defaultSwipeOptions = [{ text: "删除", style: { backgroundColor: "#FF3B30" } }];
    const swipeOptionsMap = common_vendor.reactive({});
    const setSwipeOptions = (item) => {
      const options = [{ text: "删除", style: { backgroundColor: "#FF3B30" } }];
      if (item.type === "help" || item.type === "helped") {
        if (item.status === "待帮助" || item.status === "进行中") {
          options.unshift({ text: "结束", style: { backgroundColor: "#FF9500" } });
        } else {
          options.unshift({ text: "开始", style: { backgroundColor: "#4CD964" } });
        }
      }
      swipeOptionsMap[item.id] = options;
    };
    const typeLabelMap = {
      help: "求助",
      helped: "帮助",
      lost: "失物",
      hole: "树洞",
      alumni: "校友圈"
    };
    const typeColorMap = {
      help: "#FF9500",
      helped: "#4CD964",
      lost: "#007AFF",
      hole: "#AF52DE",
      alumni: "#FF2D55"
    };
    const typeDetailPathMap = {
      help: "/pages/help/detail",
      helped: "/pages/help/detail",
      lost: "/pages/lost/detail",
      hole: "/pages/hole/detail",
      alumni: "/pages/alumni/detail"
    };
    const getTypeLabel = (type) => typeLabelMap[type] || "其他";
    const getTypeColor = (type) => typeColorMap[type] || "#999";
    const formatTime = (time) => {
      if (!time)
        return "";
      const date = new Date(time);
      const now = /* @__PURE__ */ new Date();
      const diff = now - date;
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
    common_vendor.onLoad((options) => {
      if (options && options.tab) {
        currentTab.value = options.tab;
      }
      fetchPostList(true);
    });
    common_vendor.onShow(() => {
      if (common_vendor.index.getStorageSync("refreshMyPosts")) {
        fetchPostList(true);
        common_vendor.index.removeStorageSync("refreshMyPosts");
      }
    });
    const switchTab = (tab) => {
      if (currentTab.value === tab)
        return;
      currentTab.value = tab;
      postList.value = [];
      page.current = 1;
      noMoreData.value = false;
      fetchPostList(true);
    };
    const fetchPostList = async (refresh = false) => {
      if (loading.value)
        return;
      loading.value = true;
      if (refresh) {
        page.current = 1;
        noMoreData.value = false;
      }
      try {
        const res = await utils_request.request.post("/my-posts/list", {
          current: page.current,
          size: page.size,
          type: currentTab.value === "all" ? "" : currentTab.value
        });
        if (res.code === 0) {
          const list = (res.data || []).map((item) => {
            setSwipeOptions(item);
            return item;
          });
          if (refresh) {
            postList.value = list;
          } else {
            postList.value = [...postList.value, ...list];
          }
          if (list.length < page.size) {
            noMoreData.value = true;
          } else {
            page.current++;
          }
        } else {
          common_vendor.index.showToast({ title: res.msg || "加载失败", icon: "none" });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/alumni/my-posts.vue:250", "获取我的发布列表失败", error);
        common_vendor.index.showToast({ title: "网络错误，请重试", icon: "none" });
      } finally {
        loading.value = false;
        refresherTriggered.value = false;
      }
    };
    const onRefresh = () => {
      refresherTriggered.value = true;
      fetchPostList(true);
    };
    const onReachBottom = () => {
      if (!loading.value && !noMoreData.value) {
        fetchPostList(false);
      }
    };
    const goToDetail = (item) => {
      const path = typeDetailPathMap[item.type] || "/pages/help/detail";
      common_vendor.index.navigateTo({ url: `${path}?id=${item.id}` });
    };
    const previewImage = (images, current) => {
      common_vendor.index.previewImage({ urls: images, current });
    };
    const handleSwipeAction = (e, item, index) => {
      const options = swipeOptionsMap[item.id] || defaultSwipeOptions;
      if (options[e.index] && options[e.index].text === "删除") {
        handleDelete(item, index);
      } else {
        handleToggleStatus(item, index);
      }
    };
    const handleToggleStatus = (item, index) => {
      let newStatus, actionText;
      if (item.type === "help") {
        if (item.status === "待帮助") {
          newStatus = "已解决";
          actionText = "结束";
        } else {
          newStatus = "待帮助";
          actionText = "开始";
        }
      } else {
        if (item.status === "进行中") {
          newStatus = "已结束";
          actionText = "结束";
        } else {
          newStatus = "进行中";
          actionText = "开始";
        }
      }
      common_vendor.index.showModal({
        title: "提示",
        content: `确定要${actionText}这条发布吗？`,
        success: async (res) => {
          if (res.confirm) {
            try {
              const result = await utils_request.request.put("/help/status", { id: item.id, status: newStatus });
              if (result.code === 0) {
                postList.value[index].status = newStatus;
                setSwipeOptions(postList.value[index]);
                common_vendor.index.showToast({ title: `已${actionText}`, icon: "success" });
              } else {
                common_vendor.index.showToast({ title: result.msg || "操作失败", icon: "none" });
              }
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/alumni/my-posts.vue:321", "状态更新失败", error);
              common_vendor.index.showToast({ title: "操作失败，请重试", icon: "none" });
            }
          }
        }
      });
    };
    const handleDelete = (item, index) => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除这条发布吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              const result = await utils_request.request.post("/my-posts/delete", { id: item.id, type: item.type });
              if (result.code === 0) {
                postList.value.splice(index, 1);
                common_vendor.index.showToast({ title: "已删除", icon: "success" });
              } else {
                common_vendor.index.showToast({ title: result.msg || "删除失败", icon: "none" });
              }
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/alumni/my-posts.vue:344", "删除失败", error);
              common_vendor.index.showToast({ title: "删除失败，请重试", icon: "none" });
            }
          }
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(tabs, (tab, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(tab.label),
            b: currentTab.value === tab.value
          }, currentTab.value === tab.value ? {} : {}, {
            c: tab.value,
            d: currentTab.value === tab.value ? 1 : "",
            e: common_vendor.o(($event) => switchTab(tab.value), tab.value)
          });
        }),
        b: common_vendor.f(postList.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(getTypeLabel(item.type)),
            b: getTypeColor(item.type),
            c: common_vendor.t(formatTime(item.createTime)),
            d: item.title
          }, item.title ? {
            e: common_vendor.t(item.title)
          } : {}, {
            f: common_vendor.t(item.content || item.description),
            g: item.images && item.images.length > 0
          }, item.images && item.images.length > 0 ? common_vendor.e({
            h: common_vendor.f(item.images.slice(0, 3), (img, imgIndex, i1) => {
              return {
                a: imgIndex,
                b: img,
                c: common_vendor.o(($event) => previewImage(item.images, imgIndex), imgIndex)
              };
            }),
            i: item.images.length > 3
          }, item.images.length > 3 ? {
            j: common_vendor.t(item.images.length - 3)
          } : {}) : {}, {
            k: "fdb46f71-2-" + i0 + "," + ("fdb46f71-1-" + i0),
            l: common_vendor.t(item.commentCount || 0),
            m: "fdb46f71-3-" + i0 + "," + ("fdb46f71-1-" + i0),
            n: common_vendor.t(item.likeCount || 0),
            o: "fdb46f71-4-" + i0 + "," + ("fdb46f71-1-" + i0),
            p: common_vendor.t(item.viewCount || 0),
            q: common_vendor.o(($event) => goToDetail(item), item.id),
            r: common_vendor.o((e) => handleSwipeAction(e, item, index), item.id),
            s: "fdb46f71-1-" + i0 + "," + ("fdb46f71-0-" + i0),
            t: common_vendor.p({
              ["right-options"]: swipeOptionsMap[item.id] || defaultSwipeOptions
            }),
            v: "fdb46f71-0-" + i0,
            w: item.id
          });
        }),
        c: common_vendor.p({
          type: "chat",
          size: "16",
          color: "#999"
        }),
        d: common_vendor.p({
          type: "heart",
          size: "16",
          color: "#999"
        }),
        e: common_vendor.p({
          type: "eye",
          size: "16",
          color: "#999"
        }),
        f: loading.value
      }, loading.value ? {
        g: common_vendor.p({
          status: "loading"
        })
      } : {}, {
        h: noMoreData.value && postList.value.length > 0
      }, noMoreData.value && postList.value.length > 0 ? {} : {}, {
        i: postList.value.length === 0 && !loading.value
      }, postList.value.length === 0 && !loading.value ? {
        j: common_assets._imports_0$1
      } : {}, {
        k: refresherTriggered.value,
        l: common_vendor.o(onRefresh, "4b"),
        m: common_vendor.o(onReachBottom, "52")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-fdb46f71"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/alumni/my-posts.js.map
