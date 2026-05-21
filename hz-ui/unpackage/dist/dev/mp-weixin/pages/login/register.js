"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  __name: "register",
  setup(__props) {
    const registerForm = common_vendor.ref({
      username: "",
      password: "",
      confirmPassword: ""
    });
    const showPassword = common_vendor.ref(false);
    const showConfirmPassword = common_vendor.ref(false);
    const agreement = common_vendor.ref(false);
    const passwordMatch = common_vendor.ref(true);
    const usernameValid = common_vendor.ref(true);
    const loading = common_vendor.ref(false);
    const canRegister = common_vendor.computed(() => {
      return registerForm.value.username && registerForm.value.password && registerForm.value.confirmPassword && passwordMatch.value && usernameValid.value && agreement.value;
    });
    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };
    const toggleConfirmPassword = () => {
      showConfirmPassword.value = !showConfirmPassword.value;
    };
    const checkPasswordMatch = () => {
      passwordMatch.value = registerForm.value.password === registerForm.value.confirmPassword;
    };
    const checkUsername = () => {
      const username = registerForm.value.username;
      if (username) {
        const usernameRegex = /^[a-zA-Z0-9_]{6,18}$/;
        usernameValid.value = usernameRegex.test(username);
        if (!usernameValid.value) {
          common_vendor.index.showToast({
            title: "用户名格式不正确(6-18位字母、数字或下划线)",
            icon: "none"
          });
        }
      } else {
        usernameValid.value = true;
      }
    };
    const checkPassword = () => {
      const password = registerForm.value.password;
      if (password && password.length < 6) {
        common_vendor.index.showToast({
          title: "密码长度不能少于6位",
          icon: "none"
        });
      }
    };
    const toggleAgreement = () => {
      agreement.value = !agreement.value;
    };
    const handleRegister = async () => {
      var _a, _b;
      if (!canRegister.value || loading.value)
        return;
      loading.value = true;
      try {
        if (!validateForm()) {
          loading.value = false;
          return;
        }
        await utils_request.request.post("/user/register", registerForm.value);
        common_vendor.index.showToast({
          title: "注册成功",
          icon: "success"
        });
        registerForm.value = {
          username: "",
          password: "",
          confirmPassword: ""
        };
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/register.vue:212", "注册失败，错误信息:", error.message, "错误码:", error.code, "完整错误:", error);
        if (error.code === -1) {
          common_vendor.index.__f__("log", "at pages/login/register.vue:219", "用户名已存在，清空密码字段");
          registerForm.value.username = "";
          registerForm.value.password = "";
          registerForm.value.confirmPassword = "";
        } else if (((_a = error.message) == null ? void 0 : _a.includes("网络")) || ((_b = error.message) == null ? void 0 : _b.includes("超时"))) {
          common_vendor.index.showToast({
            title: "网络连接失败，请检查网络",
            icon: "none"
          });
        }
      } finally {
        common_vendor.index.__f__("log", "at pages/login/register.vue:235", "注册流程结束，重置loading状态");
        loading.value = false;
      }
    };
    const validateForm = () => {
      if (!registerForm.value.username) {
        common_vendor.index.showToast({
          title: "请输入用户名",
          icon: "none"
        });
        return false;
      }
      if (!usernameValid.value) {
        common_vendor.index.showToast({
          title: "用户名格式不正确",
          icon: "none"
        });
        return false;
      }
      if (registerForm.value.password.length < 6) {
        common_vendor.index.showToast({
          title: "密码长度不能少于6位",
          icon: "none"
        });
        return false;
      }
      if (registerForm.value.password !== registerForm.value.confirmPassword) {
        common_vendor.index.showToast({
          title: "两次输入的密码不一致",
          icon: "none"
        });
        return false;
      }
      if (!agreement.value) {
        common_vendor.index.showToast({
          title: "请先阅读并同意协议",
          icon: "none"
        });
        return false;
      }
      return true;
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const goToLogin = () => {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
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
    common_vendor.onUnmounted(() => {
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0$3,
        b: common_vendor.o(goBack, "59"),
        c: common_assets._imports_1$1,
        d: common_vendor.o(checkUsername, "c1"),
        e: registerForm.value.username,
        f: common_vendor.o(($event) => registerForm.value.username = $event.detail.value, "98"),
        g: common_assets._imports_2$1,
        h: showPassword.value ? "text" : "password",
        i: common_vendor.o(checkPassword, "49"),
        j: registerForm.value.password,
        k: common_vendor.o(($event) => registerForm.value.password = $event.detail.value, "ed"),
        l: showPassword.value ? "/static/icons/eye-open.png" : "/static/icons/eye-close.png",
        m: common_vendor.o(togglePassword, "44"),
        n: common_assets._imports_2$1,
        o: showConfirmPassword.value ? "text" : "password",
        p: common_vendor.o([($event) => registerForm.value.confirmPassword = $event.detail.value, checkPasswordMatch], "b6"),
        q: registerForm.value.confirmPassword,
        r: showConfirmPassword.value ? "/static/icons/eye-open.png" : "/static/icons/eye-close.png",
        s: common_vendor.o(toggleConfirmPassword, "ee"),
        t: !passwordMatch.value && registerForm.value.confirmPassword ? 1 : "",
        v: !passwordMatch.value && registerForm.value.confirmPassword
      }, !passwordMatch.value && registerForm.value.confirmPassword ? {} : {}, {
        w: agreement.value
      }, agreement.value ? {} : {}, {
        x: agreement.value ? 1 : "",
        y: common_vendor.o(showAgreement, "fc"),
        z: common_vendor.o(showPrivacy, "dc"),
        A: common_vendor.o(toggleAgreement, "20"),
        B: common_vendor.t(loading.value ? "注册中..." : "立即注册"),
        C: !canRegister.value ? 1 : "",
        D: !canRegister.value,
        E: common_vendor.o(handleRegister, "a3"),
        F: loading.value,
        G: common_vendor.o(goToLogin, "c6")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-838b72c9"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/register.js.map
