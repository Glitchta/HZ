"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "alumni",
  setup(__props, { expose: __expose }) {
    const dynamicList = common_vendor.ref([
      {
        id: 1,
        name: "王同学",
        avatar: "https://via.placeholder.com/100",
        time: "3小时前",
        content: "今天在图书馆发现了一本很好的学习资料，分享给大家！",
        images: [],
        likes: 24,
        comments: 8,
        liked: false
      },
      {
        id: 2,
        name: "李学长",
        avatar: "https://via.placeholder.com/100",
        time: "5小时前",
        content: "校园樱花开了，太美了！分享几张照片",
        images: [
          "https://via.placeholder.com/300x200",
          "https://via.placeholder.com/300x200"
        ],
        likes: 56,
        comments: 12,
        liked: true
      }
    ]);
    const state = common_vendor.reactive({
      loading: false,
      hasMore: true
    });
    const page = common_vendor.reactive({
      current: 1,
      size: 10
    });
    const hasImages = common_vendor.computed(() => {
      return dynamicList.value.some((item) => item.images && item.images.length > 0);
    });
    common_vendor.onMounted(() => {
      common_vendor.index.__f__("log", "at pages/alumni/alumni.vue:104", "校友圈页面加载");
      fetchDynamicList();
    });
    common_vendor.onShow(() => {
      common_vendor.index.__f__("log", "at pages/alumni/alumni.vue:109", "校友圈显示");
      common_vendor.index.showTabBar({
        animation: false
      });
      fetchDynamicList();
    });
    common_vendor.onPullDownRefresh(async () => {
      common_vendor.index.__f__("log", "at pages/alumni/alumni.vue:120", "下拉刷新");
      await refreshDynamicList();
      common_vendor.index.stopPullDownRefresh();
    });
    common_vendor.onReachBottom(async () => {
      if (!state.hasMore || state.loading)
        return;
      common_vendor.index.__f__("log", "at pages/alumni/alumni.vue:128", "加载更多");
      await loadMoreDynamic();
    });
    const goToPublish = () => {
      common_vendor.index.navigateTo({
        url: "/pages/alumni/create"
      });
    };
    const goToDynamicDetail = (id) => {
      common_vendor.index.navigateTo({
        url: `/pages/alumni/detail?id=${id}`
      });
    };
    const likeDynamic = (index) => {
      const item = dynamicList.value[index];
      item.liked = !item.liked;
      item.likes += item.liked ? 1 : -1;
      updateLikeStatus(item.id, item.liked);
      common_vendor.index.showToast({
        title: item.liked ? "已点赞" : "取消点赞",
        icon: "none"
      });
    };
    const goToComment = (id) => {
      common_vendor.index.navigateTo({
        url: `/pages/alumni/comment?id=${id}`
      });
    };
    const previewImage = (images, current) => {
      common_vendor.index.previewImage({
        urls: images,
        current
      });
    };
    const fetchDynamicList = async () => {
      state.loading = true;
      try {
        const res = await utils_request.request.post("/dynamic/list", page);
        dynamicList.value = res.data;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/alumni/alumni.vue:181", "获取动态列表失败", error);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "error"
        });
      } finally {
        state.loading = false;
      }
    };
    const refreshDynamicList = async () => {
      page.current = 1;
      await fetchDynamicList();
      common_vendor.index.showToast({
        title: "刷新成功",
        icon: "success"
      });
    };
    const loadMoreDynamic = async () => {
      if (!state.hasMore)
        return;
      page.current++;
      state.loading = true;
      try {
        const res = await utils_request.request.post("/dynamic/list", page);
        const moreData = res.data;
        dynamicList.value.push(...moreData);
        if (page.current >= 3) {
          state.hasMore = false;
          common_vendor.index.showToast({
            title: "没有更多了",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/alumni/alumni.vue:221", "加载更多失败", error);
        page.current--;
      } finally {
        state.loading = false;
      }
    };
    const updateLikeStatus = async (dynamicId, liked) => {
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
      dynamicList,
      state,
      hasImages,
      goToPublish,
      goToDynamicDetail,
      likeDynamic,
      goToComment,
      previewImage
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          type: "plus-filled",
          size: "20",
          color: "#fff"
        }),
        b: common_vendor.o(goToPublish, "8e"),
        c: common_vendor.f(dynamicList.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.avatar,
            b: common_vendor.t(item.nickname),
            c: common_vendor.t(formatTime(item.createTime)),
            d: common_vendor.t(item.title),
            e: item.images.length > 0
          }, item.images.length > 0 ? {
            f: common_vendor.f(item.images, (img, imgIndex, i1) => {
              return {
                a: imgIndex,
                b: img,
                c: common_vendor.o(($event) => previewImage(item.images, imgIndex), imgIndex)
              };
            })
          } : {}, {
            g: "96f06917-1-" + i0,
            h: common_vendor.p({
              type: item.liked ? "heart-filled" : "heart",
              size: "18",
              color: item.liked ? "#f00" : "#999"
            }),
            i: common_vendor.t(item.likes),
            j: common_vendor.o(($event) => likeDynamic(index), index),
            k: "96f06917-2-" + i0,
            l: common_vendor.t(item.comments),
            m: common_vendor.o(($event) => goToComment(item.id), index),
            n: index,
            o: common_vendor.o(($event) => goToDynamicDetail(item.id), index)
          });
        }),
        d: common_vendor.p({
          type: "chatbubble",
          size: "18",
          color: "#999"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-96f06917"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/alumni/alumni.js.map
