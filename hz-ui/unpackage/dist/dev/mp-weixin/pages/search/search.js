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
  __name: "search",
  setup(__props) {
    const tabs = [
      { label: "全部", value: "" },
      { label: "求助", value: "help" },
      { label: "失物招领", value: "lost" },
      { label: "树洞", value: "hole" },
      { label: "校友圈", value: "alumni" }
    ];
    const keyword = common_vendor.ref("");
    const currentTab = common_vendor.ref("");
    const resultList = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const searched = common_vendor.ref(false);
    const page = common_vendor.reactive({ current: 1, size: 10 });
    const typeLabelMap = { help: "求助", lost: "失物", hole: "树洞", alumni: "校友圈" };
    const typeColorMap = { help: "#FF9500", lost: "#007AFF", hole: "#AF52DE", alumni: "#FF2D55" };
    const typeDetailPathMap = { help: "/pages/help/detail", lost: "/pages/lost/detail", hole: "/pages/hole/detail", alumni: "/pages/alumni/detail" };
    const getTypeLabel = (t) => typeLabelMap[t] || "其他";
    const getTypeColor = (t) => typeColorMap[t] || "#999";
    const formatTime = (time) => {
      if (!time)
        return "";
      const d = new Date(time);
      const now = /* @__PURE__ */ new Date();
      const diff = now - d;
      if (diff < 6e4)
        return "刚刚";
      if (diff < 36e5)
        return Math.floor(diff / 6e4) + "分钟前";
      if (diff < 864e5)
        return Math.floor(diff / 36e5) + "小时前";
      if (diff < 6048e5)
        return Math.floor(diff / 864e5) + "天前";
      return d.getMonth() + 1 + "-" + d.getDate();
    };
    const switchTab = (tab) => {
      if (currentTab.value === tab)
        return;
      currentTab.value = tab;
      if (!keyword.value.trim())
        searched.value = false;
      doSearch(true);
    };
    const clearSearch = () => {
      keyword.value = "";
      searched.value = false;
      doSearch(true);
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    common_vendor.onMounted(() => {
      doSearch(true);
    });
    const onSearch = () => {
      searched.value = true;
      doSearch(true);
    };
    const doSearch = async (refresh = false) => {
      if (loading.value)
        return;
      loading.value = true;
      searched.value = true;
      if (refresh) {
        page.current = 1;
        resultList.value = [];
      }
      try {
        const res = await utils_request.request.post("/search", {
          keyword: keyword.value.trim(),
          type: currentTab.value,
          current: page.current,
          size: page.size
        });
        if (res.code === 0) {
          const data = res.data || [];
          if (refresh)
            resultList.value = data;
          else
            resultList.value = [...resultList.value, ...data];
          if (data.length >= page.size)
            page.current++;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/search/search.vue:142", "搜索失败", e);
      } finally {
        loading.value = false;
      }
    };
    const onReachBottom = () => {
      if (!loading.value && resultList.value.length > 0)
        doSearch(false);
    };
    const goToDetail = (item) => {
      const path = typeDetailPathMap[item.type] || "/pages/help/detail";
      common_vendor.index.navigateTo({ url: path + "?id=" + item.id });
    };
    const previewImage = (images, current) => {
      common_vendor.index.previewImage({ urls: images, current });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          type: "search",
          size: "18",
          color: "#999"
        }),
        b: common_vendor.o(onSearch, "58"),
        c: keyword.value,
        d: common_vendor.o(($event) => keyword.value = $event.detail.value, "d8"),
        e: keyword.value
      }, keyword.value ? {
        f: common_vendor.o(clearSearch, "0b"),
        g: common_vendor.p({
          type: "clear",
          size: "18",
          color: "#ccc"
        })
      } : {}, {
        h: common_vendor.o(goBack, "98"),
        i: common_vendor.f(tabs, (tab, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(tab.label),
            b: currentTab.value === tab.value
          }, currentTab.value === tab.value ? {} : {}, {
            c: tab.value,
            d: currentTab.value === tab.value ? 1 : "",
            e: common_vendor.o(($event) => switchTab(tab.value), tab.value)
          });
        }),
        j: common_vendor.f(resultList.value, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(getTypeLabel(item.type)),
            b: getTypeColor(item.type),
            c: common_vendor.t(formatTime(item.createTime)),
            d: item.title
          }, item.title ? {
            e: common_vendor.t(item.title)
          } : {}, {
            f: common_vendor.t(item.content),
            g: item.images && item.images.length > 0
          }, item.images && item.images.length > 0 ? {
            h: common_vendor.f(item.images.slice(0, 3), (img, i, i1) => {
              return {
                a: i,
                b: img,
                c: common_vendor.o(($event) => previewImage(item.images, i), i)
              };
            })
          } : {}, {
            i: item.type + "-" + item.id,
            j: common_vendor.o(($event) => goToDetail(item), item.type + "-" + item.id)
          });
        }),
        k: searched.value && resultList.value.length === 0 && !loading.value
      }, searched.value && resultList.value.length === 0 && !loading.value ? {
        l: common_assets._imports_0$1
      } : {}, {
        m: !searched.value && resultList.value.length === 0 && !loading.value
      }, !searched.value && resultList.value.length === 0 && !loading.value ? {
        n: common_assets._imports_0$1
      } : {}, {
        o: loading.value
      }, loading.value ? {
        p: common_vendor.p({
          status: "loading"
        })
      } : {}, {
        q: common_vendor.o(onReachBottom, "a1")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c10c040c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/search/search.js.map
