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
  __name: "create",
  setup(__props) {
    const formData = common_vendor.reactive({
      description: "",
      images: []
    });
    const selectedTags = common_vendor.ref([]);
    common_vendor.ref("");
    const loading = common_vendor.ref(false);
    common_vendor.onLoad(() => {
      common_vendor.index.__f__("log", "at pages/lost/create.vue:83", "发布页面加载");
    });
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
          common_vendor.index.__f__("log", "at pages/lost/create.vue:116", "上传成功:", formData);
        } else {
          throw new Error(result.msg || "上传失败");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/lost/create.vue:121", "上传图片失败", error);
        common_vendor.index.showToast({
          title: error.message || "上传失败",
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    };
    const removeImage = (index) => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除这张图片吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              await utils_request.request.post("/upload/delete", null, {
                params: {
                  filePath: formData.images[index]
                }
              });
              formData.images.splice(index, 1);
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/lost/create.vue:146", "删除图片失败", error);
              common_vendor.index.showToast({
                title: "删除失败",
                icon: "none"
              });
            }
          }
        }
      });
    };
    const previewImage = (index) => {
      common_vendor.index.previewImage({
        urls: formData.images,
        current: index
      });
    };
    const publishHole = async () => {
      if (!formData.description.trim()) {
        common_vendor.index.showToast({
          title: "请输入内容",
          icon: "none"
        });
        return;
      }
      if (formData.description.length < 5) {
        common_vendor.index.showToast({
          title: "内容至少5个字",
          icon: "none"
        });
        return;
      }
      loading.value = true;
      try {
        const res = await utils_request.request.post("/lost/insert", formData);
        if (res.code === 0) {
          common_vendor.index.showToast({
            title: "发布成功",
            icon: "success"
          });
          common_vendor.index.setStorageSync("refreshLostList", true);
          formData.description = "";
          formData.images = [];
          selectedTags.value = [];
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        } else {
          common_vendor.index.showToast({
            title: res.msg || "发布失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/lost/create.vue:213", "发布失败", error);
        common_vendor.index.showToast({
          title: "发布失败，请重试",
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          type: "compose",
          size: "24",
          color: "#fff"
        }),
        b: common_vendor.o(publishHole, "e7"),
        c: formData.description,
        d: common_vendor.o(($event) => formData.description = $event.detail.value, "bc"),
        e: common_vendor.t(formData.description.length || 0),
        f: common_vendor.f(formData.images, (img, index, i0) => {
          return {
            a: img,
            b: common_vendor.o(($event) => previewImage(index), index),
            c: "93205b2a-1-" + i0,
            d: common_vendor.o(($event) => removeImage(index), index),
            e: index
          };
        }),
        g: common_vendor.p({
          type: "closeempty",
          size: "20",
          color: "#fff"
        }),
        h: formData.images.length < 9
      }, formData.images.length < 9 ? {
        i: common_vendor.p({
          type: "plusempty",
          size: "40",
          color: "#ccc"
        }),
        j: common_vendor.o(chooseImage, "92")
      } : {}, {
        k: loading.value
      }, loading.value ? {
        l: common_vendor.p({
          status: "loading"
        })
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-93205b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/lost/create.js.map
