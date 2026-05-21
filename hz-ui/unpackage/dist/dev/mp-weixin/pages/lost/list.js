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
    const lostList = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const noMoreData = common_vendor.ref(false);
    const refresherTriggered = common_vendor.ref(false);
    const page = common_vendor.ref({
      current: 1,
      size: 5
    });
    common_vendor.onLoad(() => {
      common_vendor.index.__f__("log", "at pages/lost/list.vue:124", "树洞页面加载");
      fetchlostList(true);
    });
    common_vendor.onShow(() => {
      common_vendor.index.__f__("log", "at pages/lost/list.vue:129", "树洞页面显示");
      if (common_vendor.index.getStorageSync("refreshLostList")) {
        fetchlostList(true);
        common_vendor.index.removeStorageSync("refreshLostList");
      }
    });
    common_vendor.onHide(() => {
      common_vendor.index.__f__("log", "at pages/lost/list.vue:138", "树洞页面隐藏");
    });
    common_vendor.onPullDownRefresh(() => {
      fetchlostList(true);
      setTimeout(() => {
        common_vendor.index.stopPullDownRefresh();
      }, 1e3);
    });
    const goToPublish = () => {
      common_vendor.index.navigateTo({
        url: "/pages/lost/create"
      });
    };
    const goToHoleDetail = (id) => {
      common_vendor.index.navigateTo({
        url: `/pages/lost/detail?id=${id}`
      });
    };
    const previewImage = (images, currentIndex) => {
      common_vendor.index.previewImage({
        urls: images,
        current: currentIndex
      });
    };
    const fetchlostList = async (refresh = false) => {
      if (loading.value)
        return;
      loading.value = true;
      if (refresh) {
        lostList.value = [];
        noMoreData.value = false;
      }
      try {
        const res = await utils_request.request.post("/lost/list", page.value);
        if (res.code === 0) {
          const newList = res.data || [];
          if (refresh) {
            lostList.value = newList;
          } else {
            lostList.value = [...lostList.value, ...newList];
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
        common_vendor.index.__f__("error", "at pages/lost/list.vue:207", "获取失物列表失败", error);
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
      fetchlostList(true);
    };
    const onReachBottom = () => {
      if (!loading.value && !noMoreData.value) {
        fetchlostList(false);
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
        common_vendor.index.__f__("error", "at pages/lost/list.vue:249", "点赞失败", error);
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
        c: common_vendor.f(lostList.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.avatar,
            b: common_vendor.t(item.nickname),
            c: common_vendor.t(formatTime(item.createTime)),
            d: common_vendor.t(item.description),
            e: item.images && item.images.length > 0
          }, item.images && item.images.length > 0 ? common_vendor.e({
            f: common_vendor.f(item.images.slice(0, 3), (img, imgIndex, i1) => {
              return {
                a: imgIndex,
                b: img,
                c: common_vendor.o(($event) => previewImage(item.images, imgIndex), imgIndex)
              };
            }),
            g: item.images.length > 3
          }, item.images.length > 3 ? {
            h: common_vendor.t(item.images.length - 3)
          } : {}) : {}, {
            i: "55db0c94-1-" + i0,
            j: common_vendor.t(item.commentCount || 0),
            k: "55db0c94-2-" + i0,
            l: common_vendor.p({
              type: item.isLiked ? "heart-filled" : "heart",
              color: item.isLiked ? "#ff6b6b" : "#999",
              size: "16"
            }),
            m: common_vendor.t(item.likeCount || 0),
            n: common_vendor.o(($event) => toggleLike(item), item.id),
            o: item.tags && item.tags.length > 0
          }, item.tags && item.tags.length > 0 ? common_vendor.e({
            p: common_vendor.f(item.tags.slice(0, 3), (tag, k1, i1) => {
              return {
                a: common_vendor.t(tag),
                b: tag
              };
            }),
            q: item.tags.length > 3
          }, item.tags.length > 3 ? {} : {}) : {}, {
            r: item.id,
            s: common_vendor.o(($event) => goToHoleDetail(item.id), item.id)
          });
        }),
        d: common_vendor.p({
          type: "chat",
          size: "16",
          color: "#999"
        }),
        e: loading.value
      }, loading.value ? {
        f: common_vendor.p({
          status: "loading"
        })
      } : {}, {
        g: noMoreData.value
      }, noMoreData.value ? {} : {}, {
        h: lostList.value.length === 0 && !loading.value
      }, lostList.value.length === 0 && !loading.value ? {
        i: common_assets._imports_0$1
      } : {}, {
        j: refresherTriggered.value,
        k: common_vendor.o(onRefresh, "ec"),
        l: common_vendor.o(onReachBottom, "4e")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-55db0c94"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/lost/list.js.map
