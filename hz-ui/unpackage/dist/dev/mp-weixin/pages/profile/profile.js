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
  __name: "profile",
  setup(__props, { expose: __expose }) {
    const userInfo = common_vendor.ref({
      nickname: "好心人",
      id: "666",
      avatar: "/static/avatar/头像.png",
      tags: ""
    });
    const userStats = common_vendor.ref({
      helps: 0,
      helped: 0
    });
    const state = common_vendor.reactive({
      loading: false,
      isLoggedIn: false,
      showLoginModal: false,
      // 功能列表
      functions: [
        {
          key: "posts",
          icon: "compose",
          text: "我的发布",
          color: "#007AFF",
          badge: 0
        },
        {
          key: "likes",
          icon: "heart",
          text: "我的点赞",
          color: "#ff6b6b",
          badge: 0
        },
        {
          key: "collection",
          icon: "star",
          text: "我的收藏",
          color: "#FF9500",
          badge: 0
        }
      ]
    });
    common_vendor.onMounted(() => {
      common_vendor.index.__f__("log", "at pages/profile/profile.vue:107", "我的页面加载");
      checkLoginStatus();
      fetchUserInfo();
      fetchUserStats();
    });
    common_vendor.onShow(() => {
      common_vendor.index.__f__("log", "at pages/profile/profile.vue:114", "我的页面显示");
      state.isLoggedIn = common_vendor.index.getStorageSync("isLoggedIn");
      refreshData();
    });
    common_vendor.onHide(() => {
      common_vendor.index.__f__("log", "at pages/profile/profile.vue:122", "我的页面隐藏");
    });
    common_vendor.watch(() => state.isLoggedIn, (isLoggedIn) => {
      if (isLoggedIn) {
        fetchUserInfo();
        fetchUserStats();
      } else {
        resetUserData();
      }
    });
    const goToUserInfo = () => {
      if (!state.isLoggedIn) {
        showLoginModal();
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/profile/edit"
      });
    };
    const goToMyHelps = () => {
      if (!state.isLoggedIn) {
        showLoginModal();
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/alumni/my-posts?tab=help"
      });
    };
    const goToMyHelped = () => {
      if (!state.isLoggedIn) {
        showLoginModal();
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/alumni/my-posts?tab=helped"
      });
    };
    const goToMyPosts = () => {
      if (!state.isLoggedIn) {
        showLoginModal();
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/alumni/my-posts"
      });
    };
    const goToMyLikes = () => {
      if (!state.isLoggedIn) {
        showLoginModal();
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/profile/likes"
      });
    };
    const goToMyCollection = () => {
      if (!state.isLoggedIn) {
        showLoginModal();
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/profile/collection"
      });
    };
    const logout = () => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: async (res) => {
          if (res.confirm) {
            common_vendor.index.setStorageSync("isLoggedIn", false);
            await performLogout();
          }
        }
      });
    };
    const showLoginModal = () => {
      common_vendor.index.showModal({
        title: "未登录",
        content: "请先登录",
        confirmText: "去登录",
        success: (res) => {
          if (res.confirm) {
            goToLogin();
          }
        }
      });
    };
    const goToLogin = () => {
      common_vendor.index.hideTabBar({
        animation: false
        // 立即隐藏，无动画
      });
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    };
    const checkLoginStatus = async () => {
    };
    const fetchUserInfo = async () => {
      if (!state.isLoggedIn)
        return;
      state.loading = true;
      try {
        const res = await utils_request.request.get("/userInfo/get");
        userInfo.value = res.data;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/profile/profile.vue:260", "获取用户信息失败", error);
        if (error.statusCode === 403) {
          state.isLoggedIn = false;
          common_vendor.index.removeStorageSync("token");
        }
      } finally {
        state.loading = false;
      }
    };
    const fetchUserStats = async () => {
      if (!state.isLoggedIn)
        return;
      try {
        const res = await utils_request.request.get("/help/count");
        if (res.code === 0 && res.data) {
          userStats.value.helps = res.data.resortCount || 0;
          userStats.value.helped = res.data.helpCount || 0;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/profile/profile.vue:281", "获取用户统计失败", error);
      }
    };
    const refreshData = async () => {
      if (state.isLoggedIn) {
        await Promise.all([fetchUserInfo(), fetchUserStats()]);
      }
    };
    const performLogout = async () => {
      try {
        common_vendor.index.removeStorageSync("token");
        common_vendor.index.removeStorageSync("userInfo");
        common_vendor.index.removeStorageSync("currentUserId");
        state.isLoggedIn = false;
        resetUserData();
        common_vendor.index.showToast({
          title: "已退出登录",
          icon: "success",
          duration: 1500
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/profile/profile.vue:311", "退出登录失败", error);
        common_vendor.index.showToast({
          title: "退出登录失败",
          icon: "error"
        });
      }
    };
    const resetUserData = () => {
      userInfo.value = {
        nickname: "好心人",
        id: "666",
        avatar: "/static/avatar/头像.png",
        sign: "这个人很懒，什么都没留下~"
      };
      userStats.value = {
        helps: 0,
        helped: 0
      };
    };
    const handleFunctionClick = (func) => {
      const handlers = {
        posts: goToMyPosts,
        likes: goToMyLikes,
        collection: goToMyCollection
      };
      if (handlers[func.key]) {
        handlers[func.key]();
      }
    };
    __expose({
      userInfo,
      userStats,
      state,
      goToUserInfo,
      goToMyHelps,
      goToMyHelped,
      logout,
      handleFunctionClick
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: userInfo.value.avatar,
        b: common_vendor.t(userInfo.value.nickname),
        c: common_vendor.t(userInfo.value.id),
        d: common_vendor.t(userInfo.value.sign),
        e: common_vendor.p({
          type: "right",
          size: "20",
          color: "#999"
        }),
        f: common_vendor.o(goToUserInfo, "e1"),
        g: common_vendor.t(userStats.value.helps),
        h: common_vendor.o(goToMyHelps, "48"),
        i: common_vendor.t(userStats.value.helped),
        j: common_vendor.o(goToMyHelped, "ff"),
        k: common_vendor.p({
          type: "compose",
          size: "24",
          color: "#007AFF"
        }),
        l: common_vendor.p({
          type: "right",
          size: "20",
          color: "#999"
        }),
        m: common_vendor.o(goToMyPosts, "2a"),
        n: common_vendor.p({
          type: "heart",
          size: "24",
          color: "#ff6b6b"
        }),
        o: common_vendor.p({
          type: "right",
          size: "20",
          color: "#999"
        }),
        p: common_vendor.o(goToMyLikes, "74"),
        q: common_vendor.p({
          type: "star",
          size: "24",
          color: "#FF9500"
        }),
        r: common_vendor.p({
          type: "right",
          size: "20",
          color: "#999"
        }),
        s: common_vendor.o(goToMyCollection, "8c"),
        t: state.isLoggedIn
      }, state.isLoggedIn ? {
        v: common_vendor.o(logout, "cf")
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-dd383ca2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/profile.js.map
