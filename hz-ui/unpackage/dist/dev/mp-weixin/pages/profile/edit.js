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
const minDate = "1950-01-01";
const _sfc_main = {
  __name: "edit",
  setup(__props, { expose: __expose }) {
    const formData = common_vendor.reactive({
      avatar: "",
      nickname: "",
      gender: 0,
      // 0: 未选择, 1: 男, 2: 女
      birthday: "",
      major: "",
      phone: "",
      email: ""
    });
    const isSaving = common_vendor.ref(false);
    const genderIndex = common_vendor.ref(0);
    common_vendor.ref("");
    common_vendor.ref(false);
    common_vendor.ref(null);
    common_vendor.ref(null);
    const originalData = common_vendor.reactive({});
    const genderOptions = ["未选择", "男", "女"];
    const maxDate = common_vendor.computed(() => {
      const now = /* @__PURE__ */ new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    });
    common_vendor.onLoad(() => {
      loadUserInfo();
    });
    const loadUserInfo = async () => {
      try {
        common_vendor.index.showLoading({ title: "加载中...", mask: true });
        const res = await utils_request.request.get("/userInfo/get");
        const user = res.data;
        formData.avatar = user.avatar || "";
        formData.nickname = user.nickname || "";
        formData.gender = user.gender || 0;
        formData.birthday = user.birthday || "";
        formData.major = user.major || "";
        formData.phone = user.phone || "";
        formData.email = user.email || "";
        formData.sign = user.sign || "";
        genderIndex.value = formData.gender;
        Object.assign(originalData, JSON.parse(JSON.stringify(formData)));
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/profile/edit.vue:208", "加载用户信息失败", error);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "error",
          duration: 2e3
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    };
    const chooseAvatar = () => {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: async (res) => {
          const tempFilePath = res.tempFilePaths[0];
          try {
            const result = await utils_request.request.upload("/upload/image", tempFilePath, "file", {});
            if (result && result.code === 0) {
              formData.avatar = result.data.url;
              common_vendor.index.__f__("log", "at pages/profile/edit.vue:235", "上传成功:", formData);
            } else {
              throw new Error(result.msg || "上传失败");
            }
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/profile/edit.vue:240", "上传图片失败", error);
            common_vendor.index.showToast({
              title: error.message || "上传失败",
              icon: "none"
            });
          }
        },
        fail: (error) => {
          common_vendor.index.__f__("error", "at pages/profile/edit.vue:248", "选择图片失败", error);
        }
      });
    };
    const onGenderChange = (e) => {
      const index = e.detail.value;
      genderIndex.value = index;
      formData.gender = index;
    };
    const onBirthdayChange = (e) => {
      formData.birthday = e.detail.value;
    };
    const saveInfo = async () => {
      if (!validateForm()) {
        return;
      }
      if (!hasChanges()) {
        common_vendor.index.showToast({
          title: "没有修改内容",
          icon: "none",
          duration: 1500
        });
        return;
      }
      isSaving.value = true;
      try {
        const submitData = {
          ...formData,
          gender: parseInt(formData.gender)
        };
        const res = await utils_request.request.put("/userInfo/update", submitData);
        if (res.code === 0) {
          Object.assign(originalData, JSON.parse(JSON.stringify(formData)));
          common_vendor.index.showToast({
            title: "保存成功",
            icon: "success",
            duration: 1500
          });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        } else {
          throw new Error(res.message || "保存失败");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/profile/edit.vue:315", "保存失败", error);
        common_vendor.index.showToast({
          title: error.message || "保存失败",
          icon: "error",
          duration: 2e3
        });
      } finally {
        isSaving.value = false;
      }
    };
    const validateForm = () => {
      if (!formData.nickname.trim()) {
        common_vendor.index.showToast({
          title: "请输入昵称",
          icon: "none",
          duration: 2e3
        });
        return false;
      }
      if (formData.nickname.length < 2) {
        common_vendor.index.showToast({
          title: "昵称至少2个字符",
          icon: "none",
          duration: 2e3
        });
        return false;
      }
      if (formData.phone && !/^1[3-9]\d{9}$/.test(formData.phone)) {
        common_vendor.index.showToast({
          title: "请输入正确的手机号",
          icon: "none",
          duration: 2e3
        });
        return false;
      }
      if (formData.email && !/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(formData.email)) {
        common_vendor.index.showToast({
          title: "请输入正确的邮箱",
          icon: "none",
          duration: 2e3
        });
        return false;
      }
      return true;
    };
    const hasChanges = () => {
      return JSON.stringify(formData) !== JSON.stringify(originalData);
    };
    common_vendor.onShow(() => {
      const isLoggedIn = common_vendor.index.getStorageSync("isLoggedIn");
      if (!isLoggedIn) {
        common_vendor.index.showModal({
          title: "未登录",
          content: "请先登录",
          showCancel: false,
          success: () => {
            common_vendor.index.navigateTo({
              url: "/pages/login/login"
            });
          }
        });
      }
    });
    common_vendor.onUnmounted(() => {
      if (hasChanges() && !isSaving.value)
        ;
    });
    __expose({
      formData,
      saveInfo,
      loadUserInfo
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: formData.avatar
      }, formData.avatar ? {
        b: formData.avatar
      } : {
        c: common_vendor.p({
          type: "person",
          size: "60",
          color: "#999"
        })
      }, {
        d: common_vendor.p({
          type: "camera",
          size: "30",
          color: "#fff"
        }),
        e: common_vendor.o(chooseAvatar, "ca"),
        f: isSaving.value,
        g: formData.nickname,
        h: common_vendor.o(($event) => formData.nickname = $event.detail.value, "ea"),
        i: common_vendor.t(formData.nickname.length),
        j: common_vendor.t(genderOptions[genderIndex.value] || "请选择性别"),
        k: common_vendor.p({
          type: "arrowright",
          size: "20",
          color: "#999"
        }),
        l: genderOptions,
        m: genderIndex.value,
        n: common_vendor.o(onGenderChange, "ce"),
        o: isSaving.value,
        p: common_vendor.t(formData.birthday || "请选择出生日期"),
        q: common_vendor.p({
          type: "arrowright",
          size: "20",
          color: "#999"
        }),
        r: formData.birthday,
        s: common_vendor.o(onBirthdayChange, "5b"),
        t: minDate,
        v: maxDate.value,
        w: isSaving.value,
        x: isSaving.value,
        y: formData.major,
        z: common_vendor.o(($event) => formData.major = $event.detail.value, "a8"),
        A: isSaving.value,
        B: formData.phone,
        C: common_vendor.o(($event) => formData.phone = $event.detail.value, "ce"),
        D: isSaving.value,
        E: formData.email,
        F: common_vendor.o(($event) => formData.email = $event.detail.value, "0d"),
        G: isSaving.value,
        H: formData.sign,
        I: common_vendor.o(($event) => formData.sign = $event.detail.value, "8f"),
        J: common_vendor.t(formData.sign.length),
        K: common_vendor.o(saveInfo, "f5"),
        L: _ctx.isIphoneX ? 1 : ""
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ead3e541"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/edit.js.map
