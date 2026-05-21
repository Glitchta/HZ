"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_request = require("../../utils/request.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_icons2 + _easycom_uni_load_more2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_load_more)();
}
const _sfc_main = {
  __name: "list",
  setup(__props) {
    const holeList = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const noMoreData = common_vendor.ref(false);
    const refresherTriggered = common_vendor.ref(false);
    const page = common_vendor.ref({
      current: 1,
      size: 5
    });
    common_vendor.ref(null);
    common_vendor.ref("time");
    common_vendor.ref([]);
    common_vendor.onLoad(() => {
      common_vendor.index.__f__("log", "at pages/hole/list.vue:129", "树洞页面加载");
      fetchHoleList(true);
    });
    common_vendor.onShow(() => {
      common_vendor.index.__f__("log", "at pages/hole/list.vue:134", "树洞页面显示");
      if (common_vendor.index.getStorageSync("refreshHoleList")) {
        fetchHoleList(true);
        common_vendor.index.removeStorageSync("refreshHoleList");
      }
    });
    common_vendor.onHide(() => {
      common_vendor.index.__f__("log", "at pages/hole/list.vue:143", "树洞页面隐藏");
    });
    common_vendor.onPullDownRefresh(() => {
      fetchHoleList(true);
      setTimeout(() => {
        common_vendor.index.stopPullDownRefresh();
      }, 1e3);
    });
    const goToPublish = () => {
      common_vendor.index.navigateTo({
        url: "/pages/hole/create"
      });
    };
    const goToHoleDetail = (id) => {
      common_vendor.index.navigateTo({
        url: `/pages/hole/detail?id=${id}`
      });
    };
    const previewImage = (images, currentIndex) => {
      common_vendor.index.previewImage({
        urls: images,
        current: currentIndex
      });
    };
    const fetchHoleList = async (refresh = false) => {
      if (loading.value)
        return;
      loading.value = true;
      if (refresh) {
        holeList.value = [];
        noMoreData.value = false;
      }
      try {
        const res = await utils_request.request.post("/hole/list", page.value);
        if (res.code === 0) {
          const newList = res.data || [];
          if (refresh) {
            holeList.value = newList;
          } else {
            holeList.value = [...holeList.value, ...newList];
          }
          if (newList.length < page.value.size) {
            noMoreData.value = true;
          } else {
            page.value.current++;
          }
        } else {
          common_vendor.index.showToast({
            title: res.msg || "获取数据失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/hole/list.vue:234", "获取树洞列表失败", error);
        common_vendor.index.showToast({
          title: "网络错误，请重试",
          icon: "none"
        });
      } finally {
        loading.value = false;
        refresherTriggered.value = false;
      }
    };
    const onRefresh = () => {
      refresherTriggered.value = true;
      fetchHoleList(true);
    };
    const onReachBottom = () => {
      if (!loading.value && !noMoreData.value) {
        fetchHoleList(false);
      }
    };
    const toggleLike = async (item) => {
      try {
        const res = await utils_request.request.post("/hole/like", {
          holeId: item.id,
          isLike: !item.isLiked
        });
        if (res.code === 200) {
          item.isLiked = !item.isLiked;
          item.likeCount = item.isLiked ? (item.likeCount || 0) + 1 : Math.max(0, (item.likeCount || 1) - 1);
        } else {
          common_vendor.index.showToast({
            title: res.msg || "操作失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/hole/list.vue:276", "点赞失败", error);
      }
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
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          type: "compose",
          size: "24",
          color: "#fff"
        }),
        b: common_vendor.o(goToPublish, "7a"),
        c: common_vendor.f(holeList.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.content),
            b: item.images && item.images.length > 0
          }, item.images && item.images.length > 0 ? common_vendor.e({
            c: common_vendor.f(item.images.slice(0, 3), (img, imgIndex, i1) => {
              return {
                a: imgIndex,
                b: img,
                c: common_vendor.o(($event) => previewImage(item.images, imgIndex), imgIndex)
              };
            }),
            d: item.images.length > 3
          }, item.images.length > 3 ? {
            e: common_vendor.t(item.images.length - 3)
          } : {}) : {}, {
            f: "6fdf2d0e-1-" + i0,
            g: common_vendor.t(formatTime(item.createTime)),
            h: "6fdf2d0e-2-" + i0,
            i: common_vendor.t(item.commentCount || 0),
            j: "6fdf2d0e-3-" + i0,
            k: common_vendor.p({
              type: item.isLiked ? "heart-filled" : "heart",
              color: item.isLiked ? "#ff6b6b" : "#999",
              size: "16"
            }),
            l: common_vendor.t(item.likeCount || 0),
            m: common_vendor.o(($event) => toggleLike(item), item.id),
            n: item.tags && item.tags.length > 0
          }, item.tags && item.tags.length > 0 ? common_vendor.e({
            o: common_vendor.f(item.tags.slice(0, 3), (tag, k1, i1) => {
              return {
                a: common_vendor.t(tag),
                b: tag
              };
            }),
            p: item.tags.length > 3
          }, item.tags.length > 3 ? {} : {}) : {}, {
            q: item.id,
            r: common_vendor.o(($event) => goToHoleDetail(item.id), item.id)
          });
        }),
        d: common_vendor.p({
          type: "calendar",
          size: "16",
          color: "#999"
        }),
        e: common_vendor.p({
          type: "chat",
          size: "16",
          color: "#999"
        }),
        f: loading.value
      }, loading.value ? {
        g: common_vendor.p({
          status: "loading"
        })
      } : {}, {
        h: noMoreData.value
      }, noMoreData.value ? {} : {}, {
        i: holeList.value.length === 0 && !loading.value
      }, holeList.value.length === 0 && !loading.value ? {
        j: common_assets._imports_0$1
      } : {}, {
        k: refresherTriggered.value,
        l: common_vendor.o(onRefresh, "e6"),
        m: common_vendor.o(onReachBottom, "69")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6fdf2d0e"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/hole/list.js.map
