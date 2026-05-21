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
  __name: "likes",
  setup(__props) {
    const tabs = [
      { label: "全部", value: "" },
      { label: "失物招领", value: "lost" },
      { label: "树洞", value: "hole" },
      { label: "校友圈", value: "alumni" }
    ];
    const currentTab = common_vendor.ref("");
    const likeList = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const noMoreData = common_vendor.ref(false);
    const refresherTriggered = common_vendor.ref(false);
    const page = common_vendor.reactive({ current: 1, size: 10 });
    const swipeOptions = common_vendor.ref([{ text: "取消点赞", style: { backgroundColor: "#ff6b6b" } }]);
    const typeLabelMap = { lost: "失物", hole: "树洞", alumni: "校友圈" };
    const typeColorMap = { lost: "#007AFF", hole: "#AF52DE", alumni: "#FF2D55" };
    const typeDetailPathMap = { lost: "/pages/lost/detail", hole: "/pages/hole/detail", alumni: "/pages/alumni/detail" };
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
    common_vendor.onLoad(() => {
      fetchLikeList(true);
    });
    const switchTab = (tab) => {
      if (currentTab.value === tab)
        return;
      currentTab.value = tab;
      likeList.value = [];
      page.current = 1;
      noMoreData.value = false;
      fetchLikeList(true);
    };
    const fetchLikeList = async (refresh = false) => {
      if (loading.value)
        return;
      loading.value = true;
      if (refresh) {
        page.current = 1;
        noMoreData.value = false;
      }
      try {
        const res = await utils_request.request.post("/like/list", {
          current: page.current,
          size: page.size,
          contentType: currentTab.value
        });
        if (res.code === 0) {
          const list = res.data || [];
          if (refresh)
            likeList.value = list;
          else
            likeList.value = [...likeList.value, ...list];
          if (list.length < page.size)
            noMoreData.value = true;
          else
            page.current++;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/profile/likes.vue:153", "获取点赞列表失败", e);
      } finally {
        loading.value = false;
        refresherTriggered.value = false;
      }
    };
    const onRefresh = () => {
      refresherTriggered.value = true;
      fetchLikeList(true);
    };
    const onReachBottom = () => {
      if (!loading.value && !noMoreData.value)
        fetchLikeList(false);
    };
    const goToDetail = (item) => {
      const path = typeDetailPathMap[item.type] || "/pages/hole/detail";
      common_vendor.index.navigateTo({ url: path + "?id=" + item.id });
    };
    const previewImage = (images, current) => {
      common_vendor.index.previewImage({ urls: images, current });
    };
    const handleCancelLike = (item, index) => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定取消点赞吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              const result = await utils_request.request.post("/like/cancel", { contentId: item.id, contentType: item.type });
              if (result.code === 0) {
                likeList.value.splice(index, 1);
                common_vendor.index.showToast({ title: "已取消点赞", icon: "success" });
              }
            } catch (e) {
              common_vendor.index.__f__("error", "at pages/profile/likes.vue:181", "取消点赞失败", e);
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
        b: common_vendor.f(likeList.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(getTypeLabel(item.type)),
            b: getTypeColor(item.type),
            c: common_vendor.t(formatTime(item.createTime)),
            d: item.title
          }, item.title ? {
            e: common_vendor.t(item.title)
          } : {}, {
            f: common_vendor.t(item.content),
            g: item.images && item.images.length > 0
          }, item.images && item.images.length > 0 ? {
            h: common_vendor.f(item.images.slice(0, 3), (img, imgIndex, i1) => {
              return {
                a: imgIndex,
                b: img,
                c: common_vendor.o(($event) => previewImage(item.images, imgIndex), imgIndex)
              };
            })
          } : {}, {
            i: "dcf91ebd-2-" + i0 + "," + ("dcf91ebd-1-" + i0),
            j: common_vendor.t(item.commentCount || 0),
            k: "dcf91ebd-3-" + i0 + "," + ("dcf91ebd-1-" + i0),
            l: common_vendor.t(item.likeCount || 0),
            m: common_vendor.o(($event) => goToDetail(item), item.id),
            n: common_vendor.o((e) => {
              if (e.index === 0)
                handleCancelLike(item, index);
            }, item.id),
            o: "dcf91ebd-1-" + i0 + "," + ("dcf91ebd-0-" + i0),
            p: "dcf91ebd-0-" + i0,
            q: item.id
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
          color: "#ff6b6b"
        }),
        e: common_vendor.p({
          ["right-options"]: swipeOptions.value
        }),
        f: loading.value
      }, loading.value ? {
        g: common_vendor.p({
          status: "loading"
        })
      } : {}, {
        h: noMoreData.value && likeList.value.length > 0
      }, noMoreData.value && likeList.value.length > 0 ? {} : {}, {
        i: likeList.value.length === 0 && !loading.value
      }, likeList.value.length === 0 && !loading.value ? {
        j: common_assets._imports_0$1
      } : {}, {
        k: refresherTriggered.value,
        l: common_vendor.o(onRefresh, "37"),
        m: common_vendor.o(onReachBottom, "75")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-dcf91ebd"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/likes.js.map
