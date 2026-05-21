"use strict";
const common_vendor = require("../../common/vendor.js");
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
  __name: "resort",
  setup(__props) {
    const formData = common_vendor.reactive({
      helpType: "study",
      // 求助类型
      title: "",
      // 标题
      description: "",
      // 描述
      images: [],
      // 图片数组
      contactType: "phone",
      // 联系方式类型
      contact: ""
      // 联系方式
    });
    const userInfo = common_vendor.reactive({
      name: "张三",
      avatar: "/static/avatar/default.png"
    });
    const loading = common_vendor.ref(false);
    const showCustomNavBar = common_vendor.ref(false);
    const scrollTop = common_vendor.ref(0);
    const isIphoneX = common_vendor.ref(false);
    const helpTypes = [
      { value: "study", label: "学习求助", icon: "/static/help/study.png" },
      { value: "life", label: "生活求助", icon: "/static/help/life.png" },
      { value: "item", label: "借用物品", icon: "/static/help/item.png" },
      { value: "skill", label: "技能求助", icon: "/static/help/skill.png" },
      { value: "other", label: "其他求助", icon: "/static/help/other.png" }
    ];
    const contactOptions = [
      { value: "phone", label: "手机" },
      { value: "wechat", label: "微信" },
      { value: "qq", label: "QQ" }
    ];
    const canSubmit = common_vendor.computed(() => {
      return formData.title.trim() && formData.description.trim();
    });
    common_vendor.onLoad((options) => {
      common_vendor.index.getSystemInfo({
        success: (res) => {
          isIphoneX.value = res.model.includes("iPhone X");
        }
      });
      const user = common_vendor.index.getStorageSync("userInfo");
      if (user) {
        Object.assign(userInfo, user);
      }
      loadDraft();
    });
    common_vendor.onShow(() => {
      common_vendor.index.__f__("log", "at pages/help/resort.vue:251", "help-create页面显示");
    });
    common_vendor.onHide(() => {
      common_vendor.index.__f__("log", "at pages/help/resort.vue:256", "help-create页面隐藏");
      saveDraft();
    });
    const onScroll = (e) => {
      const scrollTop2 = e.detail.scrollTop;
      showCustomNavBar.value = scrollTop2 > 50;
    };
    const selectType = (helpType) => {
      formData.helpType = helpType;
    };
    const checkTitleLength = () => {
      if (formData.title.length > 30) {
        formData.title = formData.title.substring(0, 30);
      }
    };
    const checkDescriptionLength = () => {
      if (formData.description.length > 500) {
        formData.description = formData.description.substring(0, 500);
      }
    };
    const chooseImage = () => {
      const count = 9 - formData.images.length;
      common_vendor.index.chooseImage({
        count,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          res.tempFilePaths.forEach((tempFilePath) => {
            uploadImage(tempFilePath);
          });
        }
      });
    };
    const uploadImage = async (tempFilePath) => {
      loading.value = true;
      try {
        const result = await utils_request.request.upload("/upload/image", tempFilePath, "file", {});
        if (result && result.code === 0) {
          formData.images.push(result.data.url);
          common_vendor.index.__f__("log", "at pages/help/resort.vue:311", "上传成功:", formData);
        } else {
          throw new Error(result.msg || "上传失败");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/help/resort.vue:316", "上传图片失败", error);
        common_vendor.index.showToast({
          title: error.message || "上传失败",
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    };
    const deleteImage = (index) => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除这张图片吗？",
        success: async (res) => {
          if (res.confirm) {
            await utils_request.request.post("/upload/delete", null, {
              params: {
                filePath: formData.images[index]
              }
            });
            formData.images.splice(index, 1);
          }
        }
      });
    };
    const selectContactType = (type) => {
      formData.contactType = type;
      formData.contact = "";
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const saveDraft = () => {
      if (formData.title || formData.description) {
        common_vendor.index.setStorageSync("helpDraft", formData);
      }
    };
    const loadDraft = () => {
      const draft = common_vendor.index.getStorageSync("helpDraft");
      if (draft) {
        Object.assign(formData, draft);
      }
    };
    const validateForm = () => {
      if (!formData.title.trim()) {
        common_vendor.index.showToast({
          title: "请输入求助标题",
          icon: "none"
        });
        return false;
      }
      if (!formData.description.trim()) {
        common_vendor.index.showToast({
          title: "请输入详细描述",
          icon: "none"
        });
        return false;
      }
      if (formData.contactType === "phone" && formData.contact != "" && !/^1[3-9]\d{9}$/.test(formData.contact)) {
        common_vendor.index.showToast({
          title: "请输入正确的手机号",
          icon: "none"
        });
        return false;
      }
      if (formData.contactType === "wechat" && formData.contact != "" && !formData.contact.trim()) {
        common_vendor.index.showToast({
          title: "请输入微信号",
          icon: "none"
        });
        return false;
      }
      if (formData.contactType === "qq" && formData.contact != "" && !/^\d{5,12}$/.test(formData.contact)) {
        common_vendor.index.showToast({
          title: "请输入正确的QQ号",
          icon: "none"
        });
        return false;
      }
      return true;
    };
    const submitHelp = async () => {
      if (!validateForm())
        return;
      loading.value = true;
      try {
        common_vendor.index.removeStorageSync("helpDraft");
        await utils_request.request.post("/help/resort", formData);
        common_vendor.index.showToast({
          title: "发布成功",
          icon: "success",
          duration: 2e3,
          success: () => {
            setTimeout(() => {
              common_vendor.index.navigateBack();
              common_vendor.index.$emit("helpPublished");
            }, 1500);
          }
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/help/resort.vue:448", "发布失败", error);
        common_vendor.index.showToast({
          title: "发布失败，请重试",
          icon: "error"
        });
      } finally {
        loading.value = false;
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: showCustomNavBar.value
      }, showCustomNavBar.value ? {
        b: common_vendor.p({
          type: "left",
          size: "24",
          color: "#333"
        }),
        c: common_vendor.o(goBack, "ba")
      } : {}, {
        d: common_vendor.f(helpTypes, (type, k0, i0) => {
          return {
            a: type.icon,
            b: formData.helpType === type.value ? 1 : "",
            c: common_vendor.t(type.label),
            d: type.value,
            e: formData.helpType === type.value ? 1 : "",
            f: common_vendor.o(($event) => selectType(type.value), type.value)
          };
        }),
        e: common_vendor.o([($event) => formData.title = $event.detail.value, checkTitleLength], "42"),
        f: formData.title,
        g: common_vendor.t(formData.title.length),
        h: common_vendor.o([($event) => formData.description = $event.detail.value, checkDescriptionLength], "b2"),
        i: formData.description,
        j: common_vendor.t(formData.description.length),
        k: common_vendor.f(formData.images, (image, index, i0) => {
          return {
            a: image,
            b: "ad00b70c-1-" + i0,
            c: common_vendor.o(($event) => deleteImage(index), index),
            d: index
          };
        }),
        l: common_vendor.p({
          type: "closeempty",
          size: "16",
          color: "#fff"
        }),
        m: formData.images.length < 9
      }, formData.images.length < 9 ? {
        n: common_vendor.p({
          type: "plusempty",
          size: "28",
          color: "#ccc"
        }),
        o: common_vendor.o(chooseImage, "48")
      } : {}, {
        p: common_vendor.f(contactOptions, (option, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(option.label),
            b: formData.contactType === option.value
          }, formData.contactType === option.value ? {} : {}, {
            c: option.value,
            d: formData.contactType === option.value ? 1 : "",
            e: common_vendor.o(($event) => selectContactType(option.value), option.value)
          });
        }),
        q: formData.contactType === "phone"
      }, formData.contactType === "phone" ? {
        r: formData.contact,
        s: common_vendor.o(($event) => formData.contact = $event.detail.value, "94")
      } : {}, {
        t: formData.contactType === "wechat"
      }, formData.contactType === "wechat" ? {
        v: formData.contact,
        w: common_vendor.o(($event) => formData.contact = $event.detail.value, "6b")
      } : {}, {
        x: formData.contactType === "qq"
      }, formData.contactType === "qq" ? {
        y: formData.contact,
        z: common_vendor.o(($event) => formData.contact = $event.detail.value, "d9")
      } : {}, {
        A: scrollTop.value,
        B: common_vendor.o(onScroll, "26"),
        C: !canSubmit.value ? 1 : "",
        D: !canSubmit.value,
        E: common_vendor.o(submitHelp, "b3"),
        F: isIphoneX.value ? 1 : "",
        G: loading.value
      }, loading.value ? {
        H: common_vendor.p({
          status: "loading",
          ["content-text"]: {
            contentdown: "加载中"
          }
        })
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ad00b70c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/help/resort.js.map
