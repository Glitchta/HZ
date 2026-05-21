"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const loginForm = common_vendor.ref({
      username: "",
      password: ""
    });
    const showPassword = common_vendor.ref(false);
    const rememberMe = common_vendor.ref(false);
    const loading = common_vendor.ref(false);
    const wxLoading = common_vendor.ref(false);
    const activeInput = common_vendor.ref("");
    const canLogin = common_vendor.computed(() => {
      return loginForm.value.username.trim() && loginForm.value.password.trim();
    });
    common_vendor.onMounted(() => {
      const savedUsername = common_vendor.index.getStorageSync("rememberedUsername");
      const savedPassword = common_vendor.index.getStorageSync("rememberedPassword");
      if (savedUsername && savedPassword) {
        loginForm.value.username = savedUsername;
        loginForm.value.password = savedPassword;
        rememberMe.value = true;
      }
    });
    const inputFocus = (field) => {
      activeInput.value = field;
    };
    const inputBlur = () => {
      activeInput.value = "";
    };
    const clearInput = (field) => {
      loginForm.value[field] = "";
    };
    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };
    const toggleRemember = () => {
      rememberMe.value = !rememberMe.value;
    };
    const handleLogin = async () => {
      if (!canLogin.value || loading.value)
        return;
      loading.value = true;
      try {
        if (!loginForm.value.username) {
          common_vendor.index.showToast({
            title: "请输入用户名",
            icon: "none"
          });
          loading.value = false;
          return;
        }
        if (loginForm.value.password.length < 6) {
          common_vendor.index.showToast({
            title: "密码长度不能少于6位",
            icon: "none"
          });
          loading.value = false;
          return;
        }
        if (rememberMe.value) {
          common_vendor.index.setStorageSync("rememberedUsername", loginForm.value.username);
          common_vendor.index.setStorageSync("rememberedPassword", loginForm.value.password);
        } else {
          common_vendor.index.removeStorageSync("rememberedUsername");
          common_vendor.index.removeStorageSync("rememberedPassword");
        }
        await utils_request.request.post("/user/login", loginForm.value);
        common_vendor.index.showToast({
          title: "登录成功",
          icon: "success"
        });
        common_vendor.index.setStorageSync("isLoggedIn", true);
        common_vendor.index.switchTab({
          url: "/pages/index/index"
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/login.vue:218", "登录失败:", error);
        common_vendor.index.showToast({
          title: error.message || "登录失败，请重试",
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    };
    const wxLogin = async () => {
      if (wxLoading.value)
        return;
      wxLoading.value = true;
      try {
        const [err, res] = await new Promise((resolve) => {
          common_vendor.index.login({
            provider: "weixin",
            success: (res2) => resolve([null, res2]),
            fail: (err2) => resolve([err2, null])
          });
        });
        if (err || !res || !res.code) {
          common_vendor.index.showToast({
            title: "获取微信授权失败",
            icon: "none"
          });
          return;
        }
        await utils_request.request.post("/user/wxLogin", { code: res.code });
        common_vendor.index.setStorageSync("isLoggedIn", true);
        common_vendor.index.showToast({
          title: "登录成功",
          icon: "success"
        });
        common_vendor.index.switchTab({
          url: "/pages/index/index"
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/login.vue:265", "微信登录失败:", error);
      } finally {
        wxLoading.value = false;
      }
    };
    const goToRegister = () => {
      common_vendor.index.navigateTo({
        url: "/pages/login/register"
      });
    };
    const goToForgotPassword = () => {
      common_vendor.index.navigateTo({
        url: "/pages/forgot-password/forgot-password"
      });
    };
    const showAgreement = () => {
      common_vendor.index.navigateTo({
        url: "/pages/webview/webview?url=https://example.com/agreement"
      });
    };
    const showPrivacy = () => {
      common_vendor.index.navigateTo({
        url: "/pages/webview/webview?url=https://example.com/privacy"
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0$2,
        b: common_assets._imports_1$1,
        c: common_vendor.o(($event) => inputFocus("username"), "7f"),
        d: common_vendor.o(inputBlur, "4e"),
        e: loginForm.value.username,
        f: common_vendor.o(($event) => loginForm.value.username = $event.detail.value, "cc"),
        g: loginForm.value.username
      }, loginForm.value.username ? {
        h: common_assets._imports_2$2,
        i: common_vendor.o(($event) => clearInput("username"), "e4")
      } : {}, {
        j: common_assets._imports_2$1,
        k: showPassword.value ? "text" : "password",
        l: !showPassword.value,
        m: common_vendor.o(($event) => inputFocus("password"), "f8"),
        n: common_vendor.o(inputBlur, "05"),
        o: loginForm.value.password,
        p: common_vendor.o(($event) => loginForm.value.password = $event.detail.value, "4c"),
        q: showPassword.value ? "/static/login/eye-open.png" : "/static/login/eye-close.png",
        r: common_vendor.o(togglePassword, "de"),
        s: rememberMe.value
      }, rememberMe.value ? {} : {}, {
        t: rememberMe.value ? 1 : "",
        v: common_vendor.o(toggleRemember, "40"),
        w: common_vendor.o(goToForgotPassword, "fb"),
        x: common_vendor.t(loading.value ? "登录中..." : "登录"),
        y: !canLogin.value ? 1 : "",
        z: !canLogin.value,
        A: common_vendor.o(handleLogin, "f2"),
        B: loading.value,
        C: common_assets._imports_4,
        D: common_vendor.t(wxLoading.value ? "登录中..." : "微信一键登录"),
        E: wxLoading.value ? 1 : "",
        F: common_vendor.o(wxLogin, "e6"),
        G: common_vendor.o(goToRegister, "44"),
        H: common_vendor.o(showAgreement, "b1"),
        I: common_vendor.o(showPrivacy, "c1")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
