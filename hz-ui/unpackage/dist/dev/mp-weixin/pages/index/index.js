"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
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
  __name: "index",
  setup(__props, { expose: __expose }) {
    const helpList = common_vendor.ref([]);
    const page = common_vendor.ref({
      current: 1,
      size: 5
    });
    const urgentHelpList = common_vendor.computed(() => {
      return helpList.value.filter((item) => item.type === "求助");
    });
    common_vendor.onHide(() => {
      common_vendor.index.__f__("log", "at pages/index/index.vue:96", "首页隐藏");
      page.value.current = 1;
    });
    common_vendor.onShow(() => {
      common_vendor.index.__f__("log", "at pages/index/index.vue:101", "首页显示");
      common_vendor.index.showTabBar({
        animation: false
      });
      fetchHelpList();
    });
    common_vendor.onMounted(() => {
      getUserInfo();
      common_vendor.index.__f__("log", "at pages/index/index.vue:112", "首页加载完成");
    });
    common_vendor.onPageScroll((e) => {
    });
    common_vendor.onReachBottom(() => {
      common_vendor.index.__f__("log", "at pages/index/index.vue:122", "触底，加载更多");
      loadMoreData();
    });
    const goToPage = (page2) => {
      switch (page2) {
        case "resort":
          common_vendor.index.navigateTo({ url: "/pages/help/resort" });
          break;
        case "help":
          common_vendor.index.navigateTo({ url: "/pages/help/help" });
          break;
        case "hole":
          common_vendor.index.navigateTo({ url: "/pages/hole/list" });
          break;
        case "lost":
          common_vendor.index.navigateTo({ url: "/pages/lost/list" });
          break;
      }
    };
    const goToSearch = () => {
      common_vendor.index.navigateTo({
        url: "/pages/search/search"
      });
    };
    const goToHelpList = () => {
      common_vendor.index.navigateTo({
        url: "/pages/help/list"
      });
    };
    const goToHelpDetail = (id) => {
      common_vendor.index.navigateTo({
        url: `/pages/help/detail?id=${id}`
      });
    };
    const getUserInfo = async () => {
      try {
        const res = await utils_request.request.get("/userInfo/get");
        common_vendor.index.setStorageSync("userInfo", res.data);
        if (res.data && res.data.id) {
          common_vendor.index.setStorageSync("currentUserId", String(res.data.userId));
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:174", "获取用户数据失败", error);
      }
    };
    const fetchHelpList = async () => {
      try {
        const res = await utils_request.request.post("/help/list", page.value);
        helpList.value = res.data;
        page.value.current = page.value.current + 1;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:184", "获取数据失败", error);
      }
    };
    const loadMoreData = async () => {
      const res = await utils_request.request.post("/help/list", page.value);
      common_vendor.index.__f__("log", "at pages/index/index.vue:191", res.data);
      if (res.data === null) {
        common_vendor.index.showToast({
          title: res.msg || "操作失败，请重试",
          icon: "none"
        });
      } else {
        helpList.value.push(...res.data);
        page.value.current = page.value.current + 1;
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
    __expose({
      helpList,
      urgentHelpList,
      goToPage,
      goToSearch,
      goToHelpList,
      goToHelpDetail
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          type: "search",
          size: "18",
          color: "#999"
        }),
        b: common_vendor.o(goToSearch, "43"),
        c: common_assets._imports_0,
        d: common_vendor.o(($event) => goToPage("resort"), "e1"),
        e: common_assets._imports_1,
        f: common_vendor.o(($event) => goToPage("help"), "2d"),
        g: common_assets._imports_2,
        h: common_vendor.o(($event) => goToPage("hole"), "dd"),
        i: common_assets._imports_3,
        j: common_vendor.o(($event) => goToPage("lost"), "ad"),
        k: common_vendor.o(goToHelpList, "20"),
        l: common_vendor.f(helpList.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.type),
            b: common_vendor.n(item.type === "求助" ? "type-resort" : "type-help"),
            c: common_vendor.t(formatTime(item.createTime)),
            d: common_vendor.t(item.title),
            e: item.images.length > 0
          }, item.images.length > 0 ? {
            f: common_vendor.f(item.images.slice(0, 3), (img, imgIndex, i1) => {
              return {
                a: imgIndex,
                b: img,
                c: common_vendor.o(($event) => _ctx.previewImage(item.images, imgIndex), imgIndex)
              };
            })
          } : {}, {
            g: common_vendor.t(item.nickname),
            h: common_vendor.t(item.status),
            i: common_vendor.n(item.status === "待帮助" || item.status === "已结束" ? "status-pending" : "status-solved"),
            j: index,
            k: common_vendor.o(($event) => goToHelpDetail(item.id), index)
          });
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
