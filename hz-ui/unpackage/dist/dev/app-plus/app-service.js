if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global2 = uni.requireGlobal();
  ArrayBuffer = global2.ArrayBuffer;
  Int8Array = global2.Int8Array;
  Uint8Array = global2.Uint8Array;
  Uint8ClampedArray = global2.Uint8ClampedArray;
  Int16Array = global2.Int16Array;
  Uint16Array = global2.Uint16Array;
  Int32Array = global2.Int32Array;
  Uint32Array = global2.Uint32Array;
  Float32Array = global2.Float32Array;
  Float64Array = global2.Float64Array;
  BigInt64Array = global2.BigInt64Array;
  BigUint64Array = global2.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const ON_SHOW = "onShow";
  const ON_HIDE = "onHide";
  const ON_LOAD = "onLoad";
  const ON_PAGE_SCROLL = "onPageScroll";
  const ON_REACH_BOTTOM = "onReachBottom";
  const ON_PULL_DOWN_REFRESH = "onPullDownRefresh";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return typeof component === "string" ? easycom : component;
  }
  const createLifeCycleHook = (lifecycle, flag = 0) => (hook, target = vue.getCurrentInstance()) => {
    !vue.isInSSRComponentSetup && vue.injectHook(lifecycle, hook, target);
  };
  const onShow = /* @__PURE__ */ createLifeCycleHook(
    ON_SHOW,
    1 | 2
    /* HookFlags.PAGE */
  );
  const onHide = /* @__PURE__ */ createLifeCycleHook(
    ON_HIDE,
    1 | 2
    /* HookFlags.PAGE */
  );
  const onLoad = /* @__PURE__ */ createLifeCycleHook(
    ON_LOAD,
    2
    /* HookFlags.PAGE */
  );
  const onPageScroll = /* @__PURE__ */ createLifeCycleHook(
    ON_PAGE_SCROLL,
    2
    /* HookFlags.PAGE */
  );
  const onReachBottom = /* @__PURE__ */ createLifeCycleHook(
    ON_REACH_BOTTOM,
    2
    /* HookFlags.PAGE */
  );
  const onPullDownRefresh = /* @__PURE__ */ createLifeCycleHook(
    ON_PULL_DOWN_REFRESH,
    2
    /* HookFlags.PAGE */
  );
  const fontData = [
    {
      "font_class": "arrow-down",
      "unicode": ""
    },
    {
      "font_class": "arrow-left",
      "unicode": ""
    },
    {
      "font_class": "arrow-right",
      "unicode": ""
    },
    {
      "font_class": "arrow-up",
      "unicode": ""
    },
    {
      "font_class": "auth",
      "unicode": ""
    },
    {
      "font_class": "auth-filled",
      "unicode": ""
    },
    {
      "font_class": "back",
      "unicode": ""
    },
    {
      "font_class": "bars",
      "unicode": ""
    },
    {
      "font_class": "calendar",
      "unicode": ""
    },
    {
      "font_class": "calendar-filled",
      "unicode": ""
    },
    {
      "font_class": "camera",
      "unicode": ""
    },
    {
      "font_class": "camera-filled",
      "unicode": ""
    },
    {
      "font_class": "cart",
      "unicode": ""
    },
    {
      "font_class": "cart-filled",
      "unicode": ""
    },
    {
      "font_class": "chat",
      "unicode": ""
    },
    {
      "font_class": "chat-filled",
      "unicode": ""
    },
    {
      "font_class": "chatboxes",
      "unicode": ""
    },
    {
      "font_class": "chatboxes-filled",
      "unicode": ""
    },
    {
      "font_class": "chatbubble",
      "unicode": ""
    },
    {
      "font_class": "chatbubble-filled",
      "unicode": ""
    },
    {
      "font_class": "checkbox",
      "unicode": ""
    },
    {
      "font_class": "checkbox-filled",
      "unicode": ""
    },
    {
      "font_class": "checkmarkempty",
      "unicode": ""
    },
    {
      "font_class": "circle",
      "unicode": ""
    },
    {
      "font_class": "circle-filled",
      "unicode": ""
    },
    {
      "font_class": "clear",
      "unicode": ""
    },
    {
      "font_class": "close",
      "unicode": ""
    },
    {
      "font_class": "closeempty",
      "unicode": ""
    },
    {
      "font_class": "cloud-download",
      "unicode": ""
    },
    {
      "font_class": "cloud-download-filled",
      "unicode": ""
    },
    {
      "font_class": "cloud-upload",
      "unicode": ""
    },
    {
      "font_class": "cloud-upload-filled",
      "unicode": ""
    },
    {
      "font_class": "color",
      "unicode": ""
    },
    {
      "font_class": "color-filled",
      "unicode": ""
    },
    {
      "font_class": "compose",
      "unicode": ""
    },
    {
      "font_class": "contact",
      "unicode": ""
    },
    {
      "font_class": "contact-filled",
      "unicode": ""
    },
    {
      "font_class": "down",
      "unicode": ""
    },
    {
      "font_class": "bottom",
      "unicode": ""
    },
    {
      "font_class": "download",
      "unicode": ""
    },
    {
      "font_class": "download-filled",
      "unicode": ""
    },
    {
      "font_class": "email",
      "unicode": ""
    },
    {
      "font_class": "email-filled",
      "unicode": ""
    },
    {
      "font_class": "eye",
      "unicode": ""
    },
    {
      "font_class": "eye-filled",
      "unicode": ""
    },
    {
      "font_class": "eye-slash",
      "unicode": ""
    },
    {
      "font_class": "eye-slash-filled",
      "unicode": ""
    },
    {
      "font_class": "fire",
      "unicode": ""
    },
    {
      "font_class": "fire-filled",
      "unicode": ""
    },
    {
      "font_class": "flag",
      "unicode": ""
    },
    {
      "font_class": "flag-filled",
      "unicode": ""
    },
    {
      "font_class": "folder-add",
      "unicode": ""
    },
    {
      "font_class": "folder-add-filled",
      "unicode": ""
    },
    {
      "font_class": "font",
      "unicode": ""
    },
    {
      "font_class": "forward",
      "unicode": ""
    },
    {
      "font_class": "gear",
      "unicode": ""
    },
    {
      "font_class": "gear-filled",
      "unicode": ""
    },
    {
      "font_class": "gift",
      "unicode": ""
    },
    {
      "font_class": "gift-filled",
      "unicode": ""
    },
    {
      "font_class": "hand-down",
      "unicode": ""
    },
    {
      "font_class": "hand-down-filled",
      "unicode": ""
    },
    {
      "font_class": "hand-up",
      "unicode": ""
    },
    {
      "font_class": "hand-up-filled",
      "unicode": ""
    },
    {
      "font_class": "headphones",
      "unicode": ""
    },
    {
      "font_class": "heart",
      "unicode": ""
    },
    {
      "font_class": "heart-filled",
      "unicode": ""
    },
    {
      "font_class": "help",
      "unicode": ""
    },
    {
      "font_class": "help-filled",
      "unicode": ""
    },
    {
      "font_class": "home",
      "unicode": ""
    },
    {
      "font_class": "home-filled",
      "unicode": ""
    },
    {
      "font_class": "image",
      "unicode": ""
    },
    {
      "font_class": "image-filled",
      "unicode": ""
    },
    {
      "font_class": "images",
      "unicode": ""
    },
    {
      "font_class": "images-filled",
      "unicode": ""
    },
    {
      "font_class": "info",
      "unicode": ""
    },
    {
      "font_class": "info-filled",
      "unicode": ""
    },
    {
      "font_class": "left",
      "unicode": ""
    },
    {
      "font_class": "link",
      "unicode": ""
    },
    {
      "font_class": "list",
      "unicode": ""
    },
    {
      "font_class": "location",
      "unicode": ""
    },
    {
      "font_class": "location-filled",
      "unicode": ""
    },
    {
      "font_class": "locked",
      "unicode": ""
    },
    {
      "font_class": "locked-filled",
      "unicode": ""
    },
    {
      "font_class": "loop",
      "unicode": ""
    },
    {
      "font_class": "mail-open",
      "unicode": ""
    },
    {
      "font_class": "mail-open-filled",
      "unicode": ""
    },
    {
      "font_class": "map",
      "unicode": ""
    },
    {
      "font_class": "map-filled",
      "unicode": ""
    },
    {
      "font_class": "map-pin",
      "unicode": ""
    },
    {
      "font_class": "map-pin-ellipse",
      "unicode": ""
    },
    {
      "font_class": "medal",
      "unicode": ""
    },
    {
      "font_class": "medal-filled",
      "unicode": ""
    },
    {
      "font_class": "mic",
      "unicode": ""
    },
    {
      "font_class": "mic-filled",
      "unicode": ""
    },
    {
      "font_class": "micoff",
      "unicode": ""
    },
    {
      "font_class": "micoff-filled",
      "unicode": ""
    },
    {
      "font_class": "minus",
      "unicode": ""
    },
    {
      "font_class": "minus-filled",
      "unicode": ""
    },
    {
      "font_class": "more",
      "unicode": ""
    },
    {
      "font_class": "more-filled",
      "unicode": ""
    },
    {
      "font_class": "navigate",
      "unicode": ""
    },
    {
      "font_class": "navigate-filled",
      "unicode": ""
    },
    {
      "font_class": "notification",
      "unicode": ""
    },
    {
      "font_class": "notification-filled",
      "unicode": ""
    },
    {
      "font_class": "paperclip",
      "unicode": ""
    },
    {
      "font_class": "paperplane",
      "unicode": ""
    },
    {
      "font_class": "paperplane-filled",
      "unicode": ""
    },
    {
      "font_class": "person",
      "unicode": ""
    },
    {
      "font_class": "person-filled",
      "unicode": ""
    },
    {
      "font_class": "personadd",
      "unicode": ""
    },
    {
      "font_class": "personadd-filled",
      "unicode": ""
    },
    {
      "font_class": "personadd-filled-copy",
      "unicode": ""
    },
    {
      "font_class": "phone",
      "unicode": ""
    },
    {
      "font_class": "phone-filled",
      "unicode": ""
    },
    {
      "font_class": "plus",
      "unicode": ""
    },
    {
      "font_class": "plus-filled",
      "unicode": ""
    },
    {
      "font_class": "plusempty",
      "unicode": ""
    },
    {
      "font_class": "pulldown",
      "unicode": ""
    },
    {
      "font_class": "pyq",
      "unicode": ""
    },
    {
      "font_class": "qq",
      "unicode": ""
    },
    {
      "font_class": "redo",
      "unicode": ""
    },
    {
      "font_class": "redo-filled",
      "unicode": ""
    },
    {
      "font_class": "refresh",
      "unicode": ""
    },
    {
      "font_class": "refresh-filled",
      "unicode": ""
    },
    {
      "font_class": "refreshempty",
      "unicode": ""
    },
    {
      "font_class": "reload",
      "unicode": ""
    },
    {
      "font_class": "right",
      "unicode": ""
    },
    {
      "font_class": "scan",
      "unicode": ""
    },
    {
      "font_class": "search",
      "unicode": ""
    },
    {
      "font_class": "settings",
      "unicode": ""
    },
    {
      "font_class": "settings-filled",
      "unicode": ""
    },
    {
      "font_class": "shop",
      "unicode": ""
    },
    {
      "font_class": "shop-filled",
      "unicode": ""
    },
    {
      "font_class": "smallcircle",
      "unicode": ""
    },
    {
      "font_class": "smallcircle-filled",
      "unicode": ""
    },
    {
      "font_class": "sound",
      "unicode": ""
    },
    {
      "font_class": "sound-filled",
      "unicode": ""
    },
    {
      "font_class": "spinner-cycle",
      "unicode": ""
    },
    {
      "font_class": "staff",
      "unicode": ""
    },
    {
      "font_class": "staff-filled",
      "unicode": ""
    },
    {
      "font_class": "star",
      "unicode": ""
    },
    {
      "font_class": "star-filled",
      "unicode": ""
    },
    {
      "font_class": "starhalf",
      "unicode": ""
    },
    {
      "font_class": "trash",
      "unicode": ""
    },
    {
      "font_class": "trash-filled",
      "unicode": ""
    },
    {
      "font_class": "tune",
      "unicode": ""
    },
    {
      "font_class": "tune-filled",
      "unicode": ""
    },
    {
      "font_class": "undo",
      "unicode": ""
    },
    {
      "font_class": "undo-filled",
      "unicode": ""
    },
    {
      "font_class": "up",
      "unicode": ""
    },
    {
      "font_class": "top",
      "unicode": ""
    },
    {
      "font_class": "upload",
      "unicode": ""
    },
    {
      "font_class": "upload-filled",
      "unicode": ""
    },
    {
      "font_class": "videocam",
      "unicode": ""
    },
    {
      "font_class": "videocam-filled",
      "unicode": ""
    },
    {
      "font_class": "vip",
      "unicode": ""
    },
    {
      "font_class": "vip-filled",
      "unicode": ""
    },
    {
      "font_class": "wallet",
      "unicode": ""
    },
    {
      "font_class": "wallet-filled",
      "unicode": ""
    },
    {
      "font_class": "weibo",
      "unicode": ""
    },
    {
      "font_class": "weixin",
      "unicode": ""
    }
  ];
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const getVal = (val) => {
    const reg = /^[0-9]*$/g;
    return typeof val === "number" || reg.test(val) ? val + "px" : val;
  };
  const _sfc_main$9 = {
    name: "UniIcons",
    emits: ["click"],
    props: {
      type: {
        type: String,
        default: ""
      },
      color: {
        type: String,
        default: "#333333"
      },
      size: {
        type: [Number, String],
        default: 16
      },
      customPrefix: {
        type: String,
        default: ""
      },
      fontFamily: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        icons: fontData
      };
    },
    computed: {
      unicode() {
        let code = this.icons.find((v) => v.font_class === this.type);
        if (code) {
          return code.unicode;
        }
        return "";
      },
      iconSize() {
        return getVal(this.size);
      },
      styleObj() {
        if (this.fontFamily !== "") {
          return `color: ${this.color}; font-size: ${this.iconSize}; font-family: ${this.fontFamily};`;
        }
        return `color: ${this.color}; font-size: ${this.iconSize};`;
      }
    },
    methods: {
      _onClick() {
        this.$emit("click");
      }
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "text",
      {
        style: vue.normalizeStyle($options.styleObj),
        class: vue.normalizeClass(["uni-icons", ["uniui-" + $props.type, $props.customPrefix, $props.customPrefix ? $props.type : ""]]),
        onClick: _cache[0] || (_cache[0] = (...args) => $options._onClick && $options._onClick(...args))
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__scopeId", "data-v-d31e1c47"], ["__file", "D:/develop/code/HZ/hz-ui/uni_modules/uni-icons/components/uni-icons/uni-icons.vue"]]);
  const _imports_0$2 = "/static/index/求助.png";
  const _imports_1$1 = "/static/index/帮助.png";
  const _imports_2$2 = "/static/index/树洞.png";
  const _imports_3 = "/static/index/失物招领.png";
  const _sfc_main$8 = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      const helpList = vue.ref([
        {
          id: 1,
          type: "求助",
          typeClass: "type-help",
          title: "求高数辅导，周三下午有空",
          user: "张三",
          time: "2小时前",
          status: "待帮助",
          statusClass: "status-pending"
        },
        {
          id: 2,
          type: "帮助",
          typeClass: "type-offer",
          title: "可帮忙代取快递，南校区",
          user: "李四",
          time: "5小时前",
          status: "已解决",
          statusClass: "status-solved"
        }
      ]);
      const urgentHelpList = vue.computed(() => {
        return helpList.value.filter((item) => item.type === "求助");
      });
      onShow(() => {
        formatAppLog("log", "at pages/index/index.vue:102", "首页加载完成");
        uni.showTabBar({
          animation: false
        });
        fetchHelpList();
      });
      vue.onMounted(() => {
        formatAppLog("log", "at pages/index/index.vue:112", "首页加载完成");
        fetchHelpList();
      });
      onPageScroll((e) => {
      });
      onReachBottom(() => {
        formatAppLog("log", "at pages/index/index.vue:125", "触底，加载更多");
        loadMoreData();
      });
      const goToPage = (page) => {
        uni.showToast({
          title: `跳转到${page}页面`,
          icon: "none"
        });
        switch (page) {
          case "help":
            uni.navigateTo({ url: "/pages/help/create" });
            break;
          case "offer":
            uni.navigateTo({ url: "/pages/help/offer" });
            break;
          case "emergency":
            uni.navigateTo({ url: "/pages/help/emergency" });
            break;
          case "lost":
            uni.navigateTo({ url: "/pages/lost/list" });
            break;
        }
      };
      const goToSearch = () => {
        uni.navigateTo({
          url: "/pages/search/search"
        });
      };
      const goToHelpList = () => {
        uni.navigateTo({
          url: "/pages/help/list"
        });
      };
      const goToHelpDetail = (id) => {
        uni.navigateTo({
          url: `/pages/help/detail?id=${id}`
        });
      };
      const fetchHelpList = async () => {
      };
      const loadMoreData = async () => {
        const moreData = [
          {
            id: 3,
            type: "求助",
            typeClass: "type-help",
            title: "求借一本《高等数学》教材",
            user: "王五",
            time: "1天前",
            status: "待帮助",
            statusClass: "status-pending"
          }
        ];
        helpList.value.push(...moreData);
      };
      __expose({
        helpList,
        urgentHelpList,
        goToPage,
        goToSearch,
        goToHelpList,
        goToHelpDetail
      });
      const __returned__ = { helpList, urgentHelpList, goToPage, goToSearch, goToHelpList, goToHelpDetail, fetchHelpList, loadMoreData, ref: vue.ref, onMounted: vue.onMounted, computed: vue.computed, get onPageScroll() {
        return onPageScroll;
      }, get onReachBottom() {
        return onReachBottom;
      }, get onShow() {
        return onShow;
      }, get onLoad() {
        return onLoad;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 搜索栏 "),
      vue.createElementVNode("view", { class: "search-bar" }, [
        vue.createElementVNode("view", {
          class: "search-box",
          onClick: $setup.goToSearch
        }, [
          vue.createVNode(_component_uni_icons, {
            type: "search",
            size: "18",
            color: "#999"
          }),
          vue.createElementVNode("text", { class: "search-text" }, "搜索互助信息")
        ])
      ]),
      vue.createCommentVNode(" 功能入口 "),
      vue.createElementVNode("view", { class: "function-grid" }, [
        vue.createElementVNode("view", {
          class: "function-item",
          onClick: _cache[0] || (_cache[0] = ($event) => $setup.goToPage("help"))
        }, [
          vue.createElementVNode("view", { class: "function-icon help-icon" }, [
            vue.createElementVNode("image", {
              class: "function-image help-icon",
              src: _imports_0$2
            })
          ]),
          vue.createElementVNode("text", { class: "function-text" }, "我要求助")
        ]),
        vue.createElementVNode("view", {
          class: "function-item",
          onClick: _cache[1] || (_cache[1] = ($event) => $setup.goToPage("offer"))
        }, [
          vue.createElementVNode("view", { class: "function-icon offer-icon" }, [
            vue.createElementVNode("image", {
              class: "function-image offer-icon",
              src: _imports_1$1
            })
          ]),
          vue.createElementVNode("text", { class: "function-text" }, "我能帮忙")
        ]),
        vue.createElementVNode("view", {
          class: "function-item",
          onClick: _cache[2] || (_cache[2] = ($event) => $setup.goToPage("emergency"))
        }, [
          vue.createElementVNode("view", { class: "function-icon emergency-icon" }, [
            vue.createElementVNode("image", {
              class: "function-image emergency-icon",
              src: _imports_2$2
            })
          ]),
          vue.createElementVNode("text", { class: "function-text" }, "匿名树洞")
        ]),
        vue.createElementVNode("view", {
          class: "function-item",
          onClick: _cache[3] || (_cache[3] = ($event) => $setup.goToPage("lost"))
        }, [
          vue.createElementVNode("view", { class: "function-icon lost-icon" }, [
            vue.createElementVNode("image", {
              class: "function-image lost-icon",
              src: _imports_3
            })
          ]),
          vue.createElementVNode("text", { class: "function-text" }, "失物招领")
        ])
      ]),
      vue.createCommentVNode(" 热门互助 "),
      vue.createElementVNode("view", { class: "section" }, [
        vue.createElementVNode("view", { class: "section-header" }, [
          vue.createElementVNode("text", { class: "section-title" }, "最新求助"),
          vue.createElementVNode("text", {
            class: "section-more",
            onClick: $setup.goToHelpList
          }, "查看更多")
        ]),
        vue.createElementVNode("view", { class: "help-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.helpList, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                class: "help-item",
                onClick: ($event) => $setup.goToHelpDetail(item.id)
              }, [
                vue.createElementVNode("view", { class: "help-header" }, [
                  vue.createElementVNode(
                    "text",
                    {
                      class: vue.normalizeClass(["help-type", item.typeClass])
                    },
                    vue.toDisplayString(item.type),
                    3
                    /* TEXT, CLASS */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "help-time" },
                    vue.toDisplayString(item.time),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode(
                  "text",
                  { class: "help-title" },
                  vue.toDisplayString(item.title),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "help-footer" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "help-user" },
                    vue.toDisplayString(item.user),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    {
                      class: vue.normalizeClass(["help-status", item.statusClass])
                    },
                    vue.toDisplayString(item.status),
                    3
                    /* TEXT, CLASS */
                  )
                ])
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-1cf27b2a"], ["__file", "D:/develop/code/HZ/hz-ui/pages/index/index.vue"]]);
  const _sfc_main$7 = {
    __name: "alumni",
    setup(__props, { expose: __expose }) {
      const dynamicList = vue.ref([
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
      const state = vue.reactive({
        loading: false,
        hasMore: true,
        currentPage: 1,
        pageSize: 10
      });
      const hasImages = vue.computed(() => {
        return dynamicList.value.some((item) => item.images && item.images.length > 0);
      });
      vue.onMounted(() => {
        formatAppLog("log", "at pages/alumni/alumni.vue:101", "校友圈页面加载");
        fetchDynamicList();
      });
      onPullDownRefresh(async () => {
        formatAppLog("log", "at pages/alumni/alumni.vue:108", "下拉刷新");
        await refreshDynamicList();
        uni.stopPullDownRefresh();
      });
      onReachBottom(async () => {
        if (!state.hasMore || state.loading)
          return;
        formatAppLog("log", "at pages/alumni/alumni.vue:116", "加载更多");
        await loadMoreDynamic();
      });
      const goToPublish = () => {
        uni.navigateTo({
          url: "/pages/alumni/publish"
        });
      };
      const goToDynamicDetail = (id) => {
        uni.navigateTo({
          url: `/pages/alumni/detail?id=${id}`
        });
      };
      const likeDynamic = (index) => {
        const item = dynamicList.value[index];
        item.liked = !item.liked;
        item.likes += item.liked ? 1 : -1;
        updateLikeStatus(item.id, item.liked);
        uni.showToast({
          title: item.liked ? "已点赞" : "取消点赞",
          icon: "none"
        });
      };
      const goToComment = (id) => {
        uni.navigateTo({
          url: `/pages/alumni/comment?id=${id}`
        });
      };
      const previewImage = (images, current) => {
        uni.previewImage({
          urls: images,
          current
        });
      };
      const fetchDynamicList = async () => {
        state.loading = true;
        try {
          await new Promise((resolve) => setTimeout(resolve, 1e3));
        } catch (error) {
          formatAppLog("error", "at pages/alumni/alumni.vue:174", "获取动态列表失败", error);
          uni.showToast({
            title: "加载失败",
            icon: "error"
          });
        } finally {
          state.loading = false;
        }
      };
      const refreshDynamicList = async () => {
        state.currentPage = 1;
        dynamicList.value = [];
        await fetchDynamicList();
        uni.showToast({
          title: "刷新成功",
          icon: "success"
        });
      };
      const loadMoreDynamic = async () => {
        if (!state.hasMore)
          return;
        state.currentPage++;
        state.loading = true;
        try {
          const moreData = [
            {
              id: 3,
              name: "赵同学",
              avatar: "https://via.placeholder.com/100",
              time: "1天前",
              content: "有谁知道明天讲座的具体时间吗？",
              images: [],
              likes: 15,
              comments: 3,
              liked: false
            }
          ];
          await new Promise((resolve) => setTimeout(resolve, 1e3));
          dynamicList.value.push(...moreData);
          if (state.currentPage >= 3) {
            state.hasMore = false;
            uni.showToast({
              title: "没有更多了",
              icon: "none"
            });
          }
        } catch (error) {
          formatAppLog("error", "at pages/alumni/alumni.vue:228", "加载更多失败", error);
          state.currentPage--;
        } finally {
          state.loading = false;
        }
      };
      const updateLikeStatus = async (dynamicId, liked) => {
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
      const __returned__ = { dynamicList, state, hasImages, goToPublish, goToDynamicDetail, likeDynamic, goToComment, previewImage, fetchDynamicList, refreshDynamicList, loadMoreDynamic, updateLikeStatus, ref: vue.ref, reactive: vue.reactive, onMounted: vue.onMounted, computed: vue.computed, nextTick: vue.nextTick, get onPullDownRefresh() {
        return onPullDownRefresh;
      }, get onReachBottom() {
        return onReachBottom;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 发布按钮 "),
      vue.createElementVNode("view", {
        class: "publish-btn",
        onClick: $setup.goToPublish
      }, [
        vue.createVNode(_component_uni_icons, {
          type: "plus-filled",
          size: "20",
          color: "#fff"
        }),
        vue.createElementVNode("text", null, "发布动态")
      ]),
      vue.createCommentVNode(" 动态列表 "),
      vue.createElementVNode("view", { class: "dynamic-list" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.dynamicList, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: index,
              class: "dynamic-item",
              onClick: ($event) => $setup.goToDynamicDetail(item.id)
            }, [
              vue.createElementVNode("view", { class: "dynamic-header" }, [
                vue.createElementVNode("image", {
                  src: item.avatar,
                  class: "avatar",
                  mode: "aspectFill"
                }, null, 8, ["src"]),
                vue.createElementVNode("view", { class: "user-info" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "user-name" },
                    vue.toDisplayString(item.name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "post-time" },
                    vue.toDisplayString(item.time),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              vue.createElementVNode(
                "text",
                { class: "dynamic-content" },
                vue.toDisplayString(item.content),
                1
                /* TEXT */
              ),
              item.images.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "dynamic-images"
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(item.images, (img, imgIndex) => {
                    return vue.openBlock(), vue.createElementBlock("image", {
                      key: imgIndex,
                      src: img,
                      class: "dynamic-image",
                      mode: "aspectFill",
                      onClick: ($event) => $setup.previewImage(item.images, imgIndex)
                    }, null, 8, ["src", "onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode("view", { class: "dynamic-footer" }, [
                vue.createElementVNode("view", {
                  class: "action-item",
                  onClick: vue.withModifiers(($event) => $setup.likeDynamic(index), ["stop"])
                }, [
                  vue.createVNode(_component_uni_icons, {
                    type: item.liked ? "heart-filled" : "heart",
                    size: "18",
                    color: item.liked ? "#f00" : "#999"
                  }, null, 8, ["type", "color"]),
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString(item.likes),
                    1
                    /* TEXT */
                  )
                ], 8, ["onClick"]),
                vue.createElementVNode("view", {
                  class: "action-item",
                  onClick: vue.withModifiers(($event) => $setup.goToComment(item.id), ["stop"])
                }, [
                  vue.createVNode(_component_uni_icons, {
                    type: "chatbubble",
                    size: "18",
                    color: "#999"
                  }),
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString(item.comments),
                    1
                    /* TEXT */
                  )
                ], 8, ["onClick"])
              ])
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])
    ]);
  }
  const PagesAlumniAlumni = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-96f06917"], ["__file", "D:/develop/code/HZ/hz-ui/pages/alumni/alumni.vue"]]);
  const _sfc_main$6 = {
    __name: "message",
    setup(__props, { expose: __expose }) {
      const activeTab = vue.ref("system");
      const unreadCount = vue.ref(0);
      const state = vue.reactive({
        // 消息数据
        messages: {
          system: [
            {
              id: 1,
              name: "系统通知",
              avatar: "https://via.placeholder.com/100",
              preview: "您的求助信息已有同学回复，快去看看吧！",
              time: "10:30",
              unread: 1
            }
          ],
          private: [
            {
              id: 3,
              name: "李同学",
              avatar: "https://via.placeholder.com/100",
              preview: "学长，高数题可以帮忙看看吗？",
              time: "刚刚",
              unread: 3
            }
          ],
          help: [
            {
              id: 5,
              name: "互助通知",
              avatar: "https://via.placeholder.com/100",
              preview: "有人回复了你的求助：图书馆座位问题",
              time: "1天前",
              unread: 2
            }
          ]
        },
        // WebSocket连接
        wsConnected: false,
        // 定时器
        timer: null
      });
      const filteredMessages = vue.computed(() => {
        return state.messages[activeTab.value] || [];
      });
      const totalUnreadCount = vue.computed(() => {
        let total = 0;
        Object.values(state.messages).forEach((list) => {
          list.forEach((msg) => {
            total += msg.unread || 0;
          });
        });
        return total;
      });
      const tabs = [
        { type: "system", name: "系统消息" },
        { type: "private", name: "私信" },
        { type: "help", name: "互助消息" }
      ];
      vue.onMounted(() => {
        formatAppLog("log", "at pages/message/message.vue:116", "消息页面加载");
        initWebSocket();
        startPolling();
        updateUnreadBadge();
      });
      vue.onUnmounted(() => {
        if (state.timer) {
          clearInterval(state.timer);
        }
        closeWebSocket();
      });
      vue.watch(totalUnreadCount, (newVal) => {
        unreadCount.value = newVal;
        if (newVal > 0) {
          uni.setTabBarBadge({
            index: 2,
            // 消息页是第三个tab
            text: newVal > 99 ? "99+" : newVal.toString()
          });
        } else {
          uni.removeTabBarBadge({ index: 2 });
        }
      });
      vue.watch(activeTab, (newTab) => {
        formatAppLog("log", "at pages/message/message.vue:147", "切换到Tab:", newTab);
        markAllAsRead(newTab);
      });
      const switchTab = (tabType) => {
        activeTab.value = tabType;
      };
      const goToChat = (id) => {
        markAsRead(id);
        uni.navigateTo({
          url: `/pages/message/chat?id=${id}`
        });
      };
      const markAsRead = (id) => {
        Object.keys(state.messages).forEach((type) => {
          state.messages[type] = state.messages[type].map((msg) => {
            if (msg.id === id) {
              return { ...msg, unread: 0 };
            }
            return msg;
          });
        });
        updateUnreadBadge();
      };
      const markAllAsRead = (type) => {
        if (state.messages[type]) {
          state.messages[type] = state.messages[type].map((msg) => ({
            ...msg,
            unread: 0
          }));
        }
        updateUnreadBadge();
      };
      const initWebSocket = () => {
      };
      const closeWebSocket = () => {
        state.wsConnected = false;
      };
      const handleWebSocketMessage = (data) => {
        switch (data.type) {
          case "new_message":
            addNewMessage(data.message);
            break;
          case "message_read":
            updateMessageStatus(data.messageId, "read");
            break;
        }
      };
      const addNewMessage = (message) => {
        const { type } = message;
        if (state.messages[type]) {
          state.messages[type].unshift(message);
          if (activeTab.value !== type) {
            uni.showToast({
              title: `新消息：${message.preview}`,
              icon: "none",
              duration: 3e3
            });
          }
        }
        updateUnreadBadge();
      };
      const updateMessageStatus = (messageId, status) => {
        Object.keys(state.messages).forEach((type) => {
          const index = state.messages[type].findIndex((msg) => msg.id === messageId);
          if (index !== -1) {
            state.messages[type][index].status = status;
          }
        });
      };
      const startPolling = () => {
        state.timer = setInterval(async () => {
          await pollNewMessages();
        }, 3e4);
      };
      const pollNewMessages = async () => {
      };
      const updateUnreadBadge = () => {
        const count = totalUnreadCount.value;
        if (count > 0) {
          uni.setTabBarBadge({
            index: 2,
            text: count > 99 ? "99+" : count.toString()
          });
        } else {
          uni.removeTabBarBadge({ index: 2 });
        }
      };
      __expose({
        activeTab,
        unreadCount,
        state,
        tabs,
        filteredMessages,
        totalUnreadCount,
        switchTab,
        goToChat,
        markAsRead,
        markAllAsRead
      });
      const __returned__ = { activeTab, unreadCount, state, filteredMessages, totalUnreadCount, tabs, switchTab, goToChat, markAsRead, markAllAsRead, initWebSocket, closeWebSocket, handleWebSocketMessage, addNewMessage, updateMessageStatus, startPolling, pollNewMessages, updateUnreadBadge, ref: vue.ref, reactive: vue.reactive, computed: vue.computed, onMounted: vue.onMounted, onUnmounted: vue.onUnmounted, watch: vue.watch };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 消息类型切换 "),
      vue.createElementVNode("view", { class: "message-tabs" }, [
        (vue.openBlock(), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.tabs, (tab, index) => {
            return vue.createElementVNode("view", {
              key: index,
              class: vue.normalizeClass(["tab-item", { active: $setup.activeTab === tab.type }]),
              onClick: ($event) => $setup.switchTab(tab.type)
            }, [
              vue.createElementVNode(
                "text",
                null,
                vue.toDisplayString(tab.name),
                1
                /* TEXT */
              ),
              $setup.activeTab === tab.type ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "tab-line"
              })) : vue.createCommentVNode("v-if", true)
            ], 10, ["onClick"]);
          }),
          64
          /* STABLE_FRAGMENT */
        ))
      ]),
      vue.createCommentVNode(" 消息列表 "),
      vue.createElementVNode("view", { class: "message-list" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.filteredMessages, (message, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: index,
              class: "message-item",
              onClick: ($event) => $setup.goToChat(message.id)
            }, [
              vue.createElementVNode("view", { class: "message-left" }, [
                vue.createElementVNode("image", {
                  src: message.avatar,
                  class: "avatar",
                  mode: "aspectFill"
                }, null, 8, ["src"]),
                message.unread > 0 ? (vue.openBlock(), vue.createElementBlock(
                  "view",
                  {
                    key: 0,
                    class: "unread-badge"
                  },
                  vue.toDisplayString(message.unread),
                  1
                  /* TEXT */
                )) : vue.createCommentVNode("v-if", true)
              ]),
              vue.createElementVNode("view", { class: "message-content" }, [
                vue.createElementVNode("view", { class: "message-header" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "user-name" },
                    vue.toDisplayString(message.name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "message-time" },
                    vue.toDisplayString(message.time),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode(
                  "text",
                  { class: "message-preview" },
                  vue.toDisplayString(message.preview),
                  1
                  /* TEXT */
                )
              ])
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])
    ]);
  }
  const PagesMessageMessage = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-4c1b26cf"], ["__file", "D:/develop/code/HZ/hz-ui/pages/message/message.vue"]]);
  const _sfc_main$5 = {
    __name: "profile",
    setup(__props, { expose: __expose }) {
      const userInfo = vue.ref({
        name: "好心人",
        studentId: "666",
        avatar: "/static/avatar/头像.png",
        tags: ["好心", "神秘", "未知"]
      });
      const userStats = vue.ref({
        helps: 6,
        helped: 66,
        points: 666
      });
      const state = vue.reactive({
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
            key: "collection",
            icon: "star",
            text: "我的收藏",
            color: "#FF9500",
            badge: 3
          },
          {
            key: "settings",
            icon: "gear",
            text: "设置",
            color: "#4CD964",
            badge: 0
          },
          {
            key: "feedback",
            icon: "help",
            text: "反馈帮助",
            color: "#FF3B30",
            badge: 0
          }
        ]
      });
      const formattedPoints = vue.computed(() => {
        return userStats.value.points.toLocaleString();
      });
      const completionRate = vue.computed(() => {
        if (userStats.value.helps === 0)
          return 0;
        return Math.round(userStats.value.helped / userStats.value.helps * 100);
      });
      const level = vue.computed(() => {
        const points = userStats.value.points;
        if (points < 100)
          return "热心新人";
        if (points < 500)
          return "互助达人";
        if (points < 1e3)
          return "校园明星";
        return "超级大佬";
      });
      vue.onMounted(() => {
        formatAppLog("log", "at pages/profile/profile.vue:142", "我的页面加载");
        checkLoginStatus();
        fetchUserInfo();
        fetchUserStats();
      });
      onShow(() => {
        formatAppLog("log", "at pages/profile/profile.vue:149", "我的页面显示");
        uni.showTabBar({
          animation: true
        });
        state.isLoggedIn = uni.getStorageSync("isLoggedIn");
        refreshData();
      });
      onHide(() => {
        formatAppLog("log", "at pages/profile/profile.vue:160", "我的页面隐藏");
      });
      vue.watch(() => state.isLoggedIn, (isLoggedIn) => {
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
        uni.navigateTo({
          url: "/pages/profile/edit"
        });
      };
      const goToMyHelps = () => {
        if (!state.isLoggedIn) {
          showLoginModal();
          return;
        }
        uni.navigateTo({
          url: "/pages/help/my-list?type=help"
        });
      };
      const goToMyHelped = () => {
        if (!state.isLoggedIn) {
          showLoginModal();
          return;
        }
        uni.navigateTo({
          url: "/pages/help/my-list?type=helped"
        });
      };
      const goToMyPoints = () => {
        if (!state.isLoggedIn) {
          showLoginModal();
          return;
        }
        uni.navigateTo({
          url: "/pages/profile/points"
        });
      };
      const goToMyPosts = () => {
        if (!state.isLoggedIn) {
          showLoginModal();
          return;
        }
        uni.navigateTo({
          url: "/pages/alumni/my-posts"
        });
      };
      const goToMyCollection = () => {
        if (!state.isLoggedIn) {
          showLoginModal();
          return;
        }
        uni.navigateTo({
          url: "/pages/profile/collection"
        });
      };
      const goToSettings = () => {
        uni.navigateTo({
          url: "/pages/profile/settings"
        });
      };
      const goToFeedback = () => {
        uni.navigateTo({
          url: "/pages/feedback/index"
        });
      };
      const logout = () => {
        uni.showModal({
          title: "提示",
          content: "确定要退出登录吗？",
          success: async (res) => {
            if (res.confirm) {
              uni.setStorageSync("isLoggedIn", false);
              await performLogout();
            }
          }
        });
      };
      const showLoginModal = () => {
        uni.showModal({
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
        uni.hideTabBar({
          animation: false
          // 立即隐藏，无动画
        });
        uni.navigateTo({
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
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
          formatAppLog("error", "at pages/profile/profile.vue:317", "获取用户信息失败", error);
          if (error.statusCode === 401) {
            state.isLoggedIn = false;
            uni.removeStorageSync("token");
          }
        } finally {
          state.loading = false;
        }
      };
      const fetchUserStats = async () => {
        if (!state.isLoggedIn)
          return;
        try {
          await new Promise((resolve) => setTimeout(resolve, 300));
        } catch (error) {
          formatAppLog("error", "at pages/profile/profile.vue:343", "获取用户统计失败", error);
        }
      };
      const refreshData = async () => {
        if (state.isLoggedIn) {
          await Promise.all([fetchUserInfo(), fetchUserStats()]);
        }
      };
      const performLogout = async () => {
        try {
          uni.removeStorageSync("token");
          uni.removeStorageSync("userInfo");
          state.isLoggedIn = false;
          uni.showToast({
            title: "已退出登录",
            icon: "success",
            duration: 1500
          });
          setTimeout(() => {
            uni.reLaunch({
              url: "/pages/login/index"
            });
          }, 1500);
        } catch (error) {
          formatAppLog("error", "at pages/profile/profile.vue:383", "退出登录失败", error);
          uni.showToast({
            title: "退出登录失败",
            icon: "error"
          });
        }
      };
      const resetUserData = () => {
      };
      const validateToken = async (token) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(true);
          }, 100);
        });
      };
      const handleFunctionClick = (func) => {
        const handlers = {
          posts: goToMyPosts,
          collection: goToMyCollection,
          settings: goToSettings,
          feedback: goToFeedback
        };
        if (handlers[func.key]) {
          handlers[func.key]();
        }
      };
      __expose({
        userInfo,
        userStats,
        state,
        formattedPoints,
        completionRate,
        level,
        goToUserInfo,
        goToMyHelps,
        goToMyHelped,
        goToMyPoints,
        logout,
        handleFunctionClick
      });
      const __returned__ = { userInfo, userStats, state, formattedPoints, completionRate, level, goToUserInfo, goToMyHelps, goToMyHelped, goToMyPoints, goToMyPosts, goToMyCollection, goToSettings, goToFeedback, logout, showLoginModal, goToLogin, checkLoginStatus, fetchUserInfo, fetchUserStats, refreshData, performLogout, resetUserData, validateToken, handleFunctionClick, ref: vue.ref, reactive: vue.reactive, onMounted: vue.onMounted, computed: vue.computed, watch: vue.watch, get onShow() {
        return onShow;
      }, get onHide() {
        return onHide;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 用户信息 "),
      vue.createElementVNode("view", {
        class: "user-info-card",
        onClick: $setup.goToUserInfo
      }, [
        vue.createElementVNode("view", { class: "user-avatar" }, [
          vue.createElementVNode("image", {
            src: $setup.userInfo.avatar,
            class: "avatar",
            mode: "aspectFill"
          }, null, 8, ["src"]),
          vue.createElementVNode("view", { class: "edit-avatar" }, "编辑")
        ]),
        vue.createElementVNode("view", { class: "user-detail" }, [
          vue.createElementVNode(
            "text",
            { class: "user-name" },
            vue.toDisplayString($setup.userInfo.name),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "text",
            { class: "user-id" },
            "uid: " + vue.toDisplayString($setup.userInfo.studentId),
            1
            /* TEXT */
          ),
          vue.createElementVNode("view", { class: "user-tags" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.userInfo.tags, (tag) => {
                return vue.openBlock(), vue.createElementBlock(
                  "text",
                  {
                    class: "user-tag",
                    key: tag
                  },
                  vue.toDisplayString(tag),
                  1
                  /* TEXT */
                );
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ]),
        vue.createVNode(_component_uni_icons, {
          type: "right",
          size: "20",
          color: "#999"
        })
      ]),
      vue.createCommentVNode(" 数据统计 "),
      vue.createElementVNode("view", { class: "stats-grid" }, [
        vue.createElementVNode("view", {
          class: "stat-item",
          onClick: $setup.goToMyHelps
        }, [
          vue.createElementVNode(
            "text",
            { class: "stat-number" },
            vue.toDisplayString($setup.userStats.helps),
            1
            /* TEXT */
          ),
          vue.createElementVNode("text", { class: "stat-label" }, "我的求助")
        ]),
        vue.createElementVNode("view", {
          class: "stat-item",
          onClick: $setup.goToMyHelped
        }, [
          vue.createElementVNode(
            "text",
            { class: "stat-number" },
            vue.toDisplayString($setup.userStats.helped),
            1
            /* TEXT */
          ),
          vue.createElementVNode("text", { class: "stat-label" }, "我的帮助")
        ]),
        vue.createElementVNode("view", {
          class: "stat-item",
          onClick: $setup.goToMyPoints
        }, [
          vue.createElementVNode(
            "text",
            { class: "stat-number" },
            vue.toDisplayString($setup.userStats.points),
            1
            /* TEXT */
          ),
          vue.createElementVNode("text", { class: "stat-label" }, "互助积分")
        ])
      ]),
      vue.createCommentVNode(" 功能列表 "),
      vue.createElementVNode("view", { class: "function-list" }, [
        vue.createElementVNode("view", {
          class: "function-item",
          onClick: $setup.goToMyPosts
        }, [
          vue.createVNode(_component_uni_icons, {
            type: "compose",
            size: "24",
            color: "#007AFF"
          }),
          vue.createElementVNode("text", { class: "function-text" }, "我的发布"),
          vue.createVNode(_component_uni_icons, {
            type: "right",
            size: "20",
            color: "#999"
          })
        ]),
        vue.createElementVNode("view", {
          class: "function-item",
          onClick: $setup.goToMyCollection
        }, [
          vue.createVNode(_component_uni_icons, {
            type: "star",
            size: "24",
            color: "#FF9500"
          }),
          vue.createElementVNode("text", { class: "function-text" }, "我的收藏"),
          vue.createVNode(_component_uni_icons, {
            type: "right",
            size: "20",
            color: "#999"
          })
        ]),
        vue.createElementVNode("view", {
          class: "function-item",
          onClick: $setup.goToSettings
        }, [
          vue.createVNode(_component_uni_icons, {
            type: "gear",
            size: "24",
            color: "#4CD964"
          }),
          vue.createElementVNode("text", { class: "function-text" }, "设置"),
          vue.createVNode(_component_uni_icons, {
            type: "right",
            size: "20",
            color: "#999"
          })
        ]),
        vue.createElementVNode("view", {
          class: "function-item",
          onClick: $setup.goToFeedback
        }, [
          vue.createVNode(_component_uni_icons, {
            type: "help",
            size: "24",
            color: "#FF3B30"
          }),
          vue.createElementVNode("text", { class: "function-text" }, "反馈帮助"),
          vue.createVNode(_component_uni_icons, {
            type: "right",
            size: "20",
            color: "#999"
          })
        ])
      ]),
      vue.createCommentVNode(" 退出登录 "),
      $setup.state.isLoggedIn ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "logout-btn",
        onClick: $setup.logout
      }, [
        vue.createElementVNode("text", null, "退出登录")
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesProfileProfile = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-dd383ca2"], ["__file", "D:/develop/code/HZ/hz-ui/pages/profile/profile.vue"]]);
  class Request {
    constructor(config = {}) {
      this.baseURL = config.baseURL || "";
      this.timeout = config.timeout || 1e4;
      this.interceptors = {
        request: [],
        response: []
      };
    }
    request(config) {
      let url = config.url;
      if (config.params) {
        const params = new URLSearchParams();
        Object.keys(config.params).forEach((key) => {
          if (config.params[key] !== void 0 && config.params[key] !== null) {
            params.append(key, config.params[key]);
          }
        });
        const queryString = params.toString();
        if (queryString) {
          url = url + (url.includes("?") ? "&" : "?") + queryString;
        }
      }
      formatAppLog("log", "at utils/request.js:28", `[Request] ${config.method || "GET"} ${url}`, config.data || {});
      let finalConfig = { ...config, url };
      try {
        for (const interceptor of this.interceptors.request) {
          finalConfig = interceptor(finalConfig) || finalConfig;
        }
      } catch (error) {
        formatAppLog("error", "at utils/request.js:37", "[Request] 请求拦截器错误:", error);
        return Promise.reject(error);
      }
      return new Promise((resolve, reject) => {
        const requestTask = uni.request({
          url: this.baseURL + finalConfig.url,
          method: finalConfig.method || "GET",
          data: finalConfig.data || {},
          header: {
            "Content-Type": "application/json",
            ...finalConfig.headers
          },
          timeout: finalConfig.timeout || this.timeout,
          success: (response) => {
            formatAppLog("log", "at utils/request.js:52", `[Request] 响应 ${response.statusCode} ${finalConfig.url}`);
            let finalResponse = response;
            try {
              for (const interceptor of this.interceptors.response) {
                const result = interceptor(finalResponse, finalConfig);
                if (result) {
                  finalResponse = result;
                }
              }
              if (finalResponse.statusCode >= 200 && finalResponse.statusCode < 300) {
                resolve(finalResponse.data);
              } else {
                const error = new Error(`HTTP ${finalResponse.statusCode}`);
                error.statusCode = finalResponse.statusCode;
                error.data = finalResponse.data;
                reject(error);
              }
            } catch (error) {
              formatAppLog("error", "at utils/request.js:74", "[Request] 响应拦截器错误或业务错误:", error);
              reject(error);
            }
          },
          fail: (error) => {
            formatAppLog("error", "at utils/request.js:79", "[Request] 请求失败:", error);
            reject(error);
          }
        });
        if (finalConfig.cancelToken) {
          finalConfig.cancelToken.promise.then((reason) => {
            requestTask.abort();
            reject(reason);
          });
        }
      });
    }
    get(url, config = {}) {
      return this.request({ ...config, url, method: "GET" });
    }
    post(url, data, config = {}) {
      return this.request({ ...config, url, data, method: "POST" });
    }
    put(url, data, config = {}) {
      return this.request({ ...config, url, data, method: "PUT" });
    }
    delete(url, data, config = {}) {
      return this.request({ ...config, url, data, method: "DELETE" });
    }
    // 添加拦截器
    useRequestInterceptor(interceptor) {
      this.interceptors.request.push(interceptor);
    }
    useResponseInterceptor(interceptor) {
      this.interceptors.response.push(interceptor);
    }
  }
  const request = new Request({
    baseURL: "http://localhost:8080",
    timeout: 15e3
  });
  request.useRequestInterceptor((config) => {
    const token = uni.getStorageSync("token");
    if (token) {
      config.headers = {
        ...config.headers,
        "Authorization": `Bearer ${token}`
      };
    }
    return config;
  });
  request.useResponseInterceptor((response, config) => {
    const { statusCode, data } = response;
    formatAppLog("log", "at utils/request.js:142", "[拦截器] 处理响应:", { statusCode, data });
    if (statusCode === 401) {
      uni.removeStorageSync("token");
      uni.removeStorageSync("refreshToken");
      uni.showToast({
        title: "登录已过期，请重新登录",
        icon: "none"
      });
      uni.reLaunch({ url: "/pages/login/login" });
      const error = new Error("登录已过期");
      error.code = 401;
      error.data = data;
      throw error;
    }
    if (statusCode === 403) {
      uni.showToast({
        title: "权限不足",
        icon: "none"
      });
      const error = new Error("权限不足");
      error.code = 403;
      error.data = data;
      throw error;
    }
    if (statusCode === 200 && data && typeof data.code !== "undefined") {
      const successCodes = [0];
      if (!successCodes.includes(data.code)) {
        uni.showToast({
          title: data.msg || "操作失败，请重试",
          icon: "none"
        });
        const error = new Error(data.msg || `业务错误[${data.code}]`);
        error.code = data.code;
        error.data = data;
        error.isBusinessError = true;
        throw error;
      } else {
        if (config.url.includes("/user/login")) {
          if (data.data && data.data.accessToken) {
            uni.setStorageSync("token", data.data.accessToken);
            if (data.data.refreshToken) {
              uni.setStorageSync("refreshToken", data.data.refreshToken);
            }
            formatAppLog("log", "at utils/request.js:199", "[拦截器] 已存储token:", data.data.accessToken);
          }
        }
      }
    }
    if (statusCode < 200 || statusCode >= 300) {
      const error = new Error(`HTTP错误: ${statusCode}`);
      error.statusCode = statusCode;
      error.data = data;
      throw error;
    }
    return response;
  });
  const _imports_0$1 = "/static/images/login-bg.png";
  const _imports_1 = "/static/icons/user.png";
  const _imports_2$1 = "/static/icons/clear.png";
  const _imports_2 = "/static/icons/lock.png";
  const _imports_4 = "/static/icons/wechat.png";
  const _imports_5 = "/static/icons/qq.png";
  const _imports_6 = "/static/icons/apple.png";
  const _sfc_main$4 = {
    __name: "login",
    setup(__props, { expose: __expose }) {
      __expose();
      const loginForm = vue.ref({
        username: "",
        password: ""
      });
      const showPassword = vue.ref(false);
      const rememberMe = vue.ref(false);
      const loading = vue.ref(false);
      const activeInput = vue.ref("");
      const canLogin = vue.computed(() => {
        return loginForm.value.username.trim() && loginForm.value.password.trim();
      });
      vue.onMounted(() => {
        const savedUsername = uni.getStorageSync("rememberedUsername");
        const savedPassword = uni.getStorageSync("rememberedPassword");
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
            uni.showToast({
              title: "请输入用户名",
              icon: "none"
            });
            loading.value = false;
            return;
          }
          if (loginForm.value.password.length < 6) {
            uni.showToast({
              title: "密码长度不能少于6位",
              icon: "none"
            });
            loading.value = false;
            return;
          }
          if (rememberMe.value) {
            uni.setStorageSync("rememberedUsername", loginForm.value.username);
            uni.setStorageSync("rememberedPassword", loginForm.value.password);
          } else {
            uni.removeStorageSync("rememberedUsername");
            uni.removeStorageSync("rememberedPassword");
          }
          await request.post("/user/login", loginForm.value);
          uni.showToast({
            title: "登录成功",
            icon: "success"
          });
          uni.setStorageSync("isLoggedIn", true);
          uni.switchTab({
            url: "/pages/index/index"
          });
        } catch (error) {
          formatAppLog("error", "at pages/login/login.vue:225", "登录失败:", error);
          uni.showToast({
            title: error.message || "登录失败，请重试",
            icon: "none"
          });
        } finally {
          loading.value = false;
        }
      };
      const thirdPartyLogin = (type) => {
        uni.showModal({
          title: "提示",
          content: `即将通过${type}登录，此功能需配置相应SDK`,
          showCancel: false
        });
      };
      const goToRegister = () => {
        uni.navigateTo({
          url: "/pages/login/register"
        });
      };
      const goToForgotPassword = () => {
        uni.navigateTo({
          url: "/pages/forgot-password/forgot-password"
        });
      };
      const showAgreement = () => {
        uni.navigateTo({
          url: "/pages/webview/webview?url=https://example.com/agreement"
        });
      };
      const showPrivacy = () => {
        uni.navigateTo({
          url: "/pages/webview/webview?url=https://example.com/privacy"
        });
      };
      const __returned__ = { loginForm, showPassword, rememberMe, loading, activeInput, canLogin, inputFocus, inputBlur, clearInput, togglePassword, toggleRemember, handleLogin, thirdPartyLogin, goToRegister, goToForgotPassword, showAgreement, showPrivacy, ref: vue.ref, computed: vue.computed, onMounted: vue.onMounted, get request() {
        return request;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "login-container" }, [
      vue.createCommentVNode(" 头部背景 "),
      vue.createElementVNode("view", { class: "header-bg" }, [
        vue.createElementVNode("image", {
          src: _imports_0$1,
          mode: "aspectFill",
          class: "bg-image"
        }),
        vue.createElementVNode("view", { class: "header-content" }, [
          vue.createElementVNode("text", { class: "welcome-text" }, "欢迎回来"),
          vue.createElementVNode("text", { class: "sub-text" }, "请登录您的账户")
        ])
      ]),
      vue.createCommentVNode(" 登录表单 "),
      vue.createElementVNode("view", { class: "form-container" }, [
        vue.createElementVNode("view", { class: "form-card" }, [
          vue.createCommentVNode(" 用户名输入 "),
          vue.createElementVNode("view", { class: "input-group" }, [
            vue.createElementVNode("view", { class: "input-item" }, [
              vue.createElementVNode("image", {
                src: _imports_1,
                class: "input-icon"
              }),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  type: "text",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.loginForm.username = $event),
                  placeholder: "请输入用户名",
                  "placeholder-class": "placeholder",
                  onFocus: _cache[1] || (_cache[1] = ($event) => $setup.inputFocus("username")),
                  onBlur: $setup.inputBlur
                },
                null,
                544
                /* NEED_HYDRATION, NEED_PATCH */
              ), [
                [vue.vModelText, $setup.loginForm.username]
              ]),
              $setup.loginForm.username ? (vue.openBlock(), vue.createElementBlock("image", {
                key: 0,
                src: _imports_2$1,
                class: "clear-icon",
                onClick: _cache[2] || (_cache[2] = ($event) => $setup.clearInput("username"))
              })) : vue.createCommentVNode("v-if", true)
            ]),
            vue.createCommentVNode(" 密码输入 "),
            vue.createElementVNode("view", { class: "input-item" }, [
              vue.createElementVNode("image", {
                src: _imports_2,
                class: "input-icon"
              }),
              vue.createCommentVNode(" 关键修改在这里：同时使用 :type 和 :password 属性 "),
              vue.withDirectives(vue.createElementVNode("input", {
                type: $setup.showPassword ? "text" : "password",
                password: !$setup.showPassword,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.loginForm.password = $event),
                placeholder: "请输入密码",
                "placeholder-class": "placeholder",
                onFocus: _cache[4] || (_cache[4] = ($event) => $setup.inputFocus("password")),
                onBlur: $setup.inputBlur
              }, null, 40, ["type", "password"]), [
                [vue.vModelDynamic, $setup.loginForm.password]
              ]),
              vue.createElementVNode("image", {
                src: $setup.showPassword ? "/static/login/eye-open.png" : "/static/login/eye-close.png",
                class: "eye-icon",
                onClick: $setup.togglePassword
              }, null, 8, ["src"])
            ])
          ]),
          vue.createCommentVNode(" 记住密码和忘记密码 "),
          vue.createElementVNode("view", { class: "form-options" }, [
            vue.createElementVNode("view", {
              class: "remember-me",
              onClick: $setup.toggleRemember
            }, [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["checkbox", { checked: $setup.rememberMe }])
                },
                [
                  $setup.rememberMe ? (vue.openBlock(), vue.createElementBlock("text", {
                    key: 0,
                    class: "checkmark"
                  }, "✓")) : vue.createCommentVNode("v-if", true)
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode("text", { class: "option-text" }, "记住密码")
            ]),
            vue.createElementVNode("text", {
              class: "forgot-password",
              onClick: $setup.goToForgotPassword
            }, "忘记密码？")
          ]),
          vue.createCommentVNode(" 登录按钮 "),
          vue.createElementVNode("button", {
            class: vue.normalizeClass(["login-btn", { disabled: !$setup.canLogin }]),
            disabled: !$setup.canLogin,
            onClick: $setup.handleLogin,
            loading: $setup.loading
          }, vue.toDisplayString($setup.loading ? "登录中..." : "登录"), 11, ["disabled", "loading"]),
          vue.createCommentVNode(" 第三方登录 "),
          vue.createElementVNode("view", { class: "third-party-login" }, [
            vue.createElementVNode("text", { class: "divider" }, "其他方式登录"),
            vue.createElementVNode("view", { class: "third-party-icons" }, [
              vue.createElementVNode("view", {
                class: "third-icon",
                onClick: _cache[5] || (_cache[5] = ($event) => $setup.thirdPartyLogin("wechat"))
              }, [
                vue.createElementVNode("image", {
                  src: _imports_4,
                  class: "third-icon-img"
                }),
                vue.createElementVNode("text", { class: "third-icon-text" }, "微信")
              ]),
              vue.createElementVNode("view", {
                class: "third-icon",
                onClick: _cache[6] || (_cache[6] = ($event) => $setup.thirdPartyLogin("qq"))
              }, [
                vue.createElementVNode("image", {
                  src: _imports_5,
                  class: "third-icon-img"
                }),
                vue.createElementVNode("text", { class: "third-icon-text" }, "QQ")
              ]),
              vue.createElementVNode("view", {
                class: "third-icon",
                onClick: _cache[7] || (_cache[7] = ($event) => $setup.thirdPartyLogin("apple"))
              }, [
                vue.createElementVNode("image", {
                  src: _imports_6,
                  class: "third-icon-img"
                }),
                vue.createElementVNode("text", { class: "third-icon-text" }, "Apple")
              ])
            ])
          ]),
          vue.createCommentVNode(" 注册提示 "),
          vue.createElementVNode("view", { class: "register-tip" }, [
            vue.createElementVNode("text", null, "还没有账号？"),
            vue.createElementVNode("text", {
              class: "register-link",
              onClick: $setup.goToRegister
            }, "立即注册")
          ])
        ])
      ]),
      vue.createCommentVNode(" 协议 "),
      vue.createElementVNode("view", { class: "agreement" }, [
        vue.createElementVNode("text", null, "登录即代表您已同意"),
        vue.createElementVNode("text", {
          class: "agreement-link",
          onClick: $setup.showAgreement
        }, "《用户协议》"),
        vue.createElementVNode("text", null, "和"),
        vue.createElementVNode("text", {
          class: "agreement-link",
          onClick: $setup.showPrivacy
        }, "《隐私政策》")
      ])
    ]);
  }
  const PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-e4e4508d"], ["__file", "D:/develop/code/HZ/hz-ui/pages/login/login.vue"]]);
  const _imports_0 = "/static/icons/back.png";
  const _sfc_main$3 = {
    __name: "register",
    setup(__props, { expose: __expose }) {
      __expose();
      const registerForm = vue.ref({
        username: "",
        password: "",
        confirmPassword: ""
      });
      const showPassword = vue.ref(false);
      const showConfirmPassword = vue.ref(false);
      const agreement = vue.ref(false);
      const passwordMatch = vue.ref(true);
      const usernameValid = vue.ref(true);
      const loading = vue.ref(false);
      const canRegister = vue.computed(() => {
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
            uni.showToast({
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
          uni.showToast({
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
          await request.post("/user/register", registerForm.value);
          uni.showToast({
            title: "注册成功",
            icon: "success"
          });
          registerForm.value = {
            username: "",
            password: "",
            confirmPassword: ""
          };
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        } catch (error) {
          formatAppLog("error", "at pages/login/register.vue:212", "注册失败，错误信息:", error.message, "错误码:", error.code, "完整错误:", error);
          if (error.code === -1) {
            formatAppLog("log", "at pages/login/register.vue:219", "用户名已存在，清空密码字段");
            registerForm.value.username = "";
            registerForm.value.password = "";
            registerForm.value.confirmPassword = "";
          } else if (((_a = error.message) == null ? void 0 : _a.includes("网络")) || ((_b = error.message) == null ? void 0 : _b.includes("超时"))) {
            uni.showToast({
              title: "网络连接失败，请检查网络",
              icon: "none"
            });
          }
        } finally {
          formatAppLog("log", "at pages/login/register.vue:235", "注册流程结束，重置loading状态");
          loading.value = false;
        }
      };
      const validateForm = () => {
        if (!registerForm.value.username) {
          uni.showToast({
            title: "请输入用户名",
            icon: "none"
          });
          return false;
        }
        if (!usernameValid.value) {
          uni.showToast({
            title: "用户名格式不正确",
            icon: "none"
          });
          return false;
        }
        if (registerForm.value.password.length < 6) {
          uni.showToast({
            title: "密码长度不能少于6位",
            icon: "none"
          });
          return false;
        }
        if (registerForm.value.password !== registerForm.value.confirmPassword) {
          uni.showToast({
            title: "两次输入的密码不一致",
            icon: "none"
          });
          return false;
        }
        if (!agreement.value) {
          uni.showToast({
            title: "请先阅读并同意协议",
            icon: "none"
          });
          return false;
        }
        return true;
      };
      const goBack = () => {
        uni.navigateBack();
      };
      const goToLogin = () => {
        uni.navigateTo({
          url: "/pages/login/login"
        });
      };
      const showAgreement = () => {
        uni.navigateTo({
          url: "/pages/webview/webview?url=https://example.com/agreement"
        });
      };
      const showPrivacy = () => {
        uni.navigateTo({
          url: "/pages/webview/webview?url=https://example.com/privacy"
        });
      };
      vue.onUnmounted(() => {
      });
      const __returned__ = { registerForm, showPassword, showConfirmPassword, agreement, passwordMatch, usernameValid, loading, canRegister, togglePassword, toggleConfirmPassword, checkPasswordMatch, checkUsername, checkPassword, toggleAgreement, handleRegister, validateForm, goBack, goToLogin, showAgreement, showPrivacy, ref: vue.ref, computed: vue.computed, onUnmounted: vue.onUnmounted, get request() {
        return request;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "register-container" }, [
      vue.createCommentVNode(" 头部 "),
      vue.createElementVNode("view", { class: "register-header" }, [
        vue.createElementVNode("view", {
          class: "back-btn",
          onClick: $setup.goBack
        }, [
          vue.createElementVNode("image", {
            src: _imports_0,
            class: "back-icon"
          })
        ]),
        vue.createElementVNode("text", { class: "header-title" }, "注册账号")
      ]),
      vue.createCommentVNode(" 注册表单 "),
      vue.createElementVNode("view", { class: "form-container" }, [
        vue.createElementVNode("view", { class: "form-card" }, [
          vue.createCommentVNode(" 用户名输入 "),
          vue.createElementVNode("view", { class: "input-item" }, [
            vue.createElementVNode("image", {
              src: _imports_1,
              class: "input-icon"
            }),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                type: "text",
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.registerForm.username = $event),
                placeholder: "请输入用户名(6-18位字母或数字)",
                "placeholder-class": "placeholder",
                maxlength: "18",
                onBlur: $setup.checkUsername
              },
              null,
              544
              /* NEED_HYDRATION, NEED_PATCH */
            ), [
              [vue.vModelText, $setup.registerForm.username]
            ])
          ]),
          vue.createCommentVNode(" 密码输入 "),
          vue.createElementVNode("view", { class: "input-item" }, [
            vue.createElementVNode("image", {
              src: _imports_2,
              class: "input-icon"
            }),
            vue.withDirectives(vue.createElementVNode("input", {
              type: $setup.showPassword ? "text" : "password",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.registerForm.password = $event),
              placeholder: "请设置6-18位密码",
              "placeholder-class": "placeholder",
              maxlength: "18",
              onBlur: $setup.checkPassword
            }, null, 40, ["type"]), [
              [vue.vModelDynamic, $setup.registerForm.password]
            ]),
            vue.createElementVNode("image", {
              src: $setup.showPassword ? "/static/icons/eye-open.png" : "/static/icons/eye-close.png",
              class: "eye-icon",
              onClick: $setup.togglePassword
            }, null, 8, ["src"])
          ]),
          vue.createCommentVNode(" 确认密码 "),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["input-item", { "input-error": !$setup.passwordMatch && $setup.registerForm.confirmPassword }])
            },
            [
              vue.createElementVNode("image", {
                src: _imports_2,
                class: "input-icon"
              }),
              vue.withDirectives(vue.createElementVNode("input", {
                type: $setup.showConfirmPassword ? "text" : "password",
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.registerForm.confirmPassword = $event),
                placeholder: "请再次输入密码",
                "placeholder-class": "placeholder",
                onInput: $setup.checkPasswordMatch
              }, null, 40, ["type"]), [
                [vue.vModelDynamic, $setup.registerForm.confirmPassword]
              ]),
              vue.createElementVNode("image", {
                src: $setup.showConfirmPassword ? "/static/icons/eye-open.png" : "/static/icons/eye-close.png",
                class: "eye-icon",
                onClick: $setup.toggleConfirmPassword
              }, null, 8, ["src"])
            ],
            2
            /* CLASS */
          ),
          !$setup.passwordMatch && $setup.registerForm.confirmPassword ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "error-tip"
          }, "两次输入的密码不一致")) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 协议同意 "),
          vue.createElementVNode("view", {
            class: "agreement-check",
            onClick: $setup.toggleAgreement
          }, [
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["checkbox", { checked: $setup.agreement }])
              },
              [
                $setup.agreement ? (vue.openBlock(), vue.createElementBlock("text", {
                  key: 0,
                  class: "checkmark"
                }, "✓")) : vue.createCommentVNode("v-if", true)
              ],
              2
              /* CLASS */
            ),
            vue.createElementVNode("view", { class: "agreement-text" }, [
              vue.createElementVNode("text", null, "我已阅读并同意"),
              vue.createElementVNode("text", {
                class: "agreement-link",
                onClick: vue.withModifiers($setup.showAgreement, ["stop"])
              }, "《用户协议》"),
              vue.createElementVNode("text", null, "和"),
              vue.createElementVNode("text", {
                class: "agreement-link",
                onClick: vue.withModifiers($setup.showPrivacy, ["stop"])
              }, "《隐私政策》")
            ])
          ]),
          vue.createCommentVNode(" 注册按钮 "),
          vue.createElementVNode("button", {
            class: vue.normalizeClass(["register-btn", { disabled: !$setup.canRegister }]),
            disabled: !$setup.canRegister,
            onClick: $setup.handleRegister,
            loading: $setup.loading
          }, vue.toDisplayString($setup.loading ? "注册中..." : "立即注册"), 11, ["disabled", "loading"]),
          vue.createCommentVNode(" 已有账号 "),
          vue.createElementVNode("view", { class: "login-tip" }, [
            vue.createElementVNode("text", null, "已有账号？"),
            vue.createElementVNode("text", {
              class: "login-link",
              onClick: $setup.goToLogin
            }, "立即登录")
          ])
        ])
      ])
    ]);
  }
  const PagesLoginRegister = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-838b72c9"], ["__file", "D:/develop/code/HZ/hz-ui/pages/login/register.vue"]]);
  const isObject = (val) => val !== null && typeof val === "object";
  const defaultDelimiters = ["{", "}"];
  class BaseFormatter {
    constructor() {
      this._caches = /* @__PURE__ */ Object.create(null);
    }
    interpolate(message, values, delimiters = defaultDelimiters) {
      if (!values) {
        return [message];
      }
      let tokens = this._caches[message];
      if (!tokens) {
        tokens = parse(message, delimiters);
        this._caches[message] = tokens;
      }
      return compile(tokens, values);
    }
  }
  const RE_TOKEN_LIST_VALUE = /^(?:\d)+/;
  const RE_TOKEN_NAMED_VALUE = /^(?:\w)+/;
  function parse(format, [startDelimiter, endDelimiter]) {
    const tokens = [];
    let position = 0;
    let text = "";
    while (position < format.length) {
      let char = format[position++];
      if (char === startDelimiter) {
        if (text) {
          tokens.push({ type: "text", value: text });
        }
        text = "";
        let sub = "";
        char = format[position++];
        while (char !== void 0 && char !== endDelimiter) {
          sub += char;
          char = format[position++];
        }
        const isClosed = char === endDelimiter;
        const type = RE_TOKEN_LIST_VALUE.test(sub) ? "list" : isClosed && RE_TOKEN_NAMED_VALUE.test(sub) ? "named" : "unknown";
        tokens.push({ value: sub, type });
      } else {
        text += char;
      }
    }
    text && tokens.push({ type: "text", value: text });
    return tokens;
  }
  function compile(tokens, values) {
    const compiled = [];
    let index = 0;
    const mode = Array.isArray(values) ? "list" : isObject(values) ? "named" : "unknown";
    if (mode === "unknown") {
      return compiled;
    }
    while (index < tokens.length) {
      const token = tokens[index];
      switch (token.type) {
        case "text":
          compiled.push(token.value);
          break;
        case "list":
          compiled.push(values[parseInt(token.value, 10)]);
          break;
        case "named":
          if (mode === "named") {
            compiled.push(values[token.value]);
          } else {
            {
              console.warn(`Type of token '${token.type}' and format of value '${mode}' don't match!`);
            }
          }
          break;
        case "unknown":
          {
            console.warn(`Detect 'unknown' type of token!`);
          }
          break;
      }
      index++;
    }
    return compiled;
  }
  const LOCALE_ZH_HANS = "zh-Hans";
  const LOCALE_ZH_HANT = "zh-Hant";
  const LOCALE_EN = "en";
  const LOCALE_FR = "fr";
  const LOCALE_ES = "es";
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty.call(val, key);
  const defaultFormatter = new BaseFormatter();
  function include(str, parts) {
    return !!parts.find((part) => str.indexOf(part) !== -1);
  }
  function startsWith(str, parts) {
    return parts.find((part) => str.indexOf(part) === 0);
  }
  function normalizeLocale(locale, messages2) {
    if (!locale) {
      return;
    }
    locale = locale.trim().replace(/_/g, "-");
    if (messages2 && messages2[locale]) {
      return locale;
    }
    locale = locale.toLowerCase();
    if (locale === "chinese") {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf("zh") === 0) {
      if (locale.indexOf("-hans") > -1) {
        return LOCALE_ZH_HANS;
      }
      if (locale.indexOf("-hant") > -1) {
        return LOCALE_ZH_HANT;
      }
      if (include(locale, ["-tw", "-hk", "-mo", "-cht"])) {
        return LOCALE_ZH_HANT;
      }
      return LOCALE_ZH_HANS;
    }
    let locales = [LOCALE_EN, LOCALE_FR, LOCALE_ES];
    if (messages2 && Object.keys(messages2).length > 0) {
      locales = Object.keys(messages2);
    }
    const lang = startsWith(locale, locales);
    if (lang) {
      return lang;
    }
  }
  class I18n {
    constructor({ locale, fallbackLocale, messages: messages2, watcher, formater: formater2 }) {
      this.locale = LOCALE_EN;
      this.fallbackLocale = LOCALE_EN;
      this.message = {};
      this.messages = {};
      this.watchers = [];
      if (fallbackLocale) {
        this.fallbackLocale = fallbackLocale;
      }
      this.formater = formater2 || defaultFormatter;
      this.messages = messages2 || {};
      this.setLocale(locale || LOCALE_EN);
      if (watcher) {
        this.watchLocale(watcher);
      }
    }
    setLocale(locale) {
      const oldLocale = this.locale;
      this.locale = normalizeLocale(locale, this.messages) || this.fallbackLocale;
      if (!this.messages[this.locale]) {
        this.messages[this.locale] = {};
      }
      this.message = this.messages[this.locale];
      if (oldLocale !== this.locale) {
        this.watchers.forEach((watcher) => {
          watcher(this.locale, oldLocale);
        });
      }
    }
    getLocale() {
      return this.locale;
    }
    watchLocale(fn) {
      const index = this.watchers.push(fn) - 1;
      return () => {
        this.watchers.splice(index, 1);
      };
    }
    add(locale, message, override = true) {
      const curMessages = this.messages[locale];
      if (curMessages) {
        if (override) {
          Object.assign(curMessages, message);
        } else {
          Object.keys(message).forEach((key) => {
            if (!hasOwn(curMessages, key)) {
              curMessages[key] = message[key];
            }
          });
        }
      } else {
        this.messages[locale] = message;
      }
    }
    f(message, values, delimiters) {
      return this.formater.interpolate(message, values, delimiters).join("");
    }
    t(key, locale, values) {
      let message = this.message;
      if (typeof locale === "string") {
        locale = normalizeLocale(locale, this.messages);
        locale && (message = this.messages[locale]);
      } else {
        values = locale;
      }
      if (!hasOwn(message, key)) {
        console.warn(`Cannot translate the value of keypath ${key}. Use the value of keypath as default.`);
        return key;
      }
      return this.formater.interpolate(message[key], values).join("");
    }
  }
  function watchAppLocale(appVm, i18n) {
    if (appVm.$watchLocale) {
      appVm.$watchLocale((newLocale) => {
        i18n.setLocale(newLocale);
      });
    } else {
      appVm.$watch(() => appVm.$locale, (newLocale) => {
        i18n.setLocale(newLocale);
      });
    }
  }
  function getDefaultLocale() {
    if (typeof uni !== "undefined" && uni.getLocale) {
      return uni.getLocale();
    }
    if (typeof global !== "undefined" && global.getLocale) {
      return global.getLocale();
    }
    return LOCALE_EN;
  }
  function initVueI18n(locale, messages2 = {}, fallbackLocale, watcher) {
    if (typeof locale !== "string") {
      const options = [
        messages2,
        locale
      ];
      locale = options[0];
      messages2 = options[1];
    }
    if (typeof locale !== "string") {
      locale = getDefaultLocale();
    }
    if (typeof fallbackLocale !== "string") {
      fallbackLocale = typeof __uniConfig !== "undefined" && __uniConfig.fallbackLocale || LOCALE_EN;
    }
    const i18n = new I18n({
      locale,
      fallbackLocale,
      messages: messages2,
      watcher
    });
    let t2 = (key, values) => {
      if (typeof getApp !== "function") {
        t2 = function(key2, values2) {
          return i18n.t(key2, values2);
        };
      } else {
        let isWatchedAppLocale = false;
        t2 = function(key2, values2) {
          const appVm = getApp().$vm;
          if (appVm) {
            appVm.$locale;
            if (!isWatchedAppLocale) {
              isWatchedAppLocale = true;
              watchAppLocale(appVm, i18n);
            }
          }
          return i18n.t(key2, values2);
        };
      }
      return t2(key, values);
    };
    return {
      i18n,
      f(message, values, delimiters) {
        return i18n.f(message, values, delimiters);
      },
      t(key, values) {
        return t2(key, values);
      },
      add(locale2, message, override = true) {
        return i18n.add(locale2, message, override);
      },
      watch(fn) {
        return i18n.watchLocale(fn);
      },
      getLocale() {
        return i18n.getLocale();
      },
      setLocale(newLocale) {
        return i18n.setLocale(newLocale);
      }
    };
  }
  const en = {
    "uni-load-more.contentdown": "Pull up to show more",
    "uni-load-more.contentrefresh": "loading...",
    "uni-load-more.contentnomore": "No more data"
  };
  const zhHans = {
    "uni-load-more.contentdown": "上拉显示更多",
    "uni-load-more.contentrefresh": "正在加载...",
    "uni-load-more.contentnomore": "没有更多数据了"
  };
  const zhHant = {
    "uni-load-more.contentdown": "上拉顯示更多",
    "uni-load-more.contentrefresh": "正在加載...",
    "uni-load-more.contentnomore": "沒有更多數據了"
  };
  const messages = {
    en,
    "zh-Hans": zhHans,
    "zh-Hant": zhHant
  };
  let platform;
  setTimeout(() => {
    platform = uni.getSystemInfoSync().platform;
  }, 16);
  const {
    t
  } = initVueI18n(messages);
  const _sfc_main$2 = {
    name: "UniLoadMore",
    emits: ["clickLoadMore"],
    props: {
      status: {
        // 上拉的状态：more-loading前；loading-loading中；noMore-没有更多了
        type: String,
        default: "more"
      },
      showIcon: {
        type: Boolean,
        default: true
      },
      iconType: {
        type: String,
        default: "auto"
      },
      iconSize: {
        type: Number,
        default: 24
      },
      color: {
        type: String,
        default: "#777777"
      },
      contentText: {
        type: Object,
        default() {
          return {
            contentdown: "",
            contentrefresh: "",
            contentnomore: ""
          };
        }
      },
      showText: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        webviewHide: false,
        platform,
        imgBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzlBMzU3OTlEOUM0MTFFOUI0NTZDNERBQURBQzI4RkUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzlBMzU3OUFEOUM0MTFFOUI0NTZDNERBQURBQzI4RkUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDOUEzNTc5N0Q5QzQxMUU5QjQ1NkM0REFBREFDMjhGRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDOUEzNTc5OEQ5QzQxMUU5QjQ1NkM0REFBREFDMjhGRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pt+ALSwAAA6CSURBVHja1FsLkFZVHb98LM+F5bHL8khA1iSeiyQBCRM+YGqKUnnJTDLGI0BGZlKDIU2MMglUiDApEZvSsZnQtBRJtKwQNKQMFYeRDR10WOLd8ljYXdh+v8v5fR3Od+797t1dnOnO/Ofce77z+J//+b/P+ZqtXbs2sJ9MJhNUV1cHJ06cCJo3bx7EPc2aNcvpy7pWrVoF+/fvDyoqKoI2bdoE9fX1F7TjN8a+EXBn/fkfvw942Tf+wYMHg9mzZwfjxo0LDhw4EPa1x2MbFw/fOGfPng1qa2tzcCkILsLDydq2bRsunpOTMM7TD/W/tZDZhPdeKD+yGxHhdu3aBV27dg3OnDlzMVANMheLAO3btw8KCwuDmpoaX5OxbgUIMEq7K8IcPnw4KCsrC/r37x8cP378/4cAXAB3vqSkJMuiDhTkw+XcuXNhOWbMmKBly5YhUT8xArhyFvP0BfwRsAuwxJZJsm/nzp2DTp06he/OU+cZ64K6o0ePBkOHDg2GDx8e6gEbJ5Q/NHNuAJQ1hgBeHUDlR7nVTkY8rQAvAi4z34vR/mPs1FoRsaCgIJThI0eOBC1atEiFGGV+5MiRoS45efJkqFjJFXV1dQuA012m2WcwTw98fy6CqBdsaiIO4CScrGPHjvk4odhavPquRtFWXEC25VgkREKOCh/qDSq+vn37htzD/mZTOmOc5U7zKzBPEedygWshcDyWvs30igAbU+6oyMgJBCFhwQE0fccxN60Ay9iebbjoDh06hMowjQxT4fXq1SskArmHZpkArvixp/kWzHdMeArExSJEaiXIjjRjRJ4DaAGWpibLzXN3Fm1vA5teBgh3j1Rv3bp1YgKwPdmf2p9zcyNYYgPKMfY0T5f5nNYdw158nJ8QawW4CLKwiOBSEgO/hok2eBydR+3dYH+PLxA5J8Vv0KBBwenTp0P2JWAx6+yFEBfs8lMY+y0SWMBNI9E4ThKi58VKTg3FQZS1RQF1cz27eC0QHMu+3E0SkUowjhVt5VdaWhp07949ZHv2Qd1EjDXM2cla1M0nl3GxAs3J9yREzyTdFVKVFOaE9qRA8GM0WebRuo9JGZKA7Mv2SeS/Z8+eoQ9BArMfFrLGo6jvxbhHbJZnKX2Rzz1O7QhJJ9Cs2ZMaWIyq/zhdeqPNfIoHd58clIQD+JSXl4dKlyIAuBdVXZwFVWKspSSoxE++h8x4k3uCnEhE4I5KwRiFWGOU0QWKiCYLbdoRMRKAu2kQ9vkfLU6dOhX06NEjlH+yMRZSinnuyWnYosVcji8CEA/6Cg2JF+IIUBqnGKUTCNwtwBN4f89RiK1R96DEgO2o0NDmtEdvVFdVVYV+P3UAPUEs6GFwV3PHmXkD4vh74iDFJysVI/MlaQhwKeBNTLYX5VuA8T4/gZxA4MRGFxDB6R7OmYPfyykGRJbyie+XnGYnQIC/coH9+vULiYrxrkL9ZA9+0ykaHIfEpM7ge8TiJ2CsHYwyMfafAF1yCGBHYIbCVDjDjKt7BeB51D+LgQa6OkG7IDYEEtvQ7lnXLKLtLdLuJBpE4gPUXcW2+PkZwOex+4cGDhwYDBkyRL7/HFcEwUGPo/8uWRUpYnfxGHco8HkewLHLyYmAawAPuIFZxhOpDfJQ8gbUv41yORAptMWBNr6oqMhWird5+u+iHmBb2nhjDV7HWBNQTgK8y11l5NetWzc5ULscAtSj7nbNI0skhWeUZCc0W4nyH/jO4Vz0u1IeYhbk4AiwM6tjxIWByHsoZ9qcIBPJd/y+DwPfBESOmCa/QF3WiZHucLlEDpNxcNhmheEOPgdQNx6/VZFQzFZ5TN08AHXQt2Ii3EdyFuUsPtTcGPhW5iMiCNELvz+Gdn9huG4HUJaW/w3g0wxV0XaG7arG2WeKiUWYM4Y7GO5ezshTARbbWGw/DvXkpp/ivVvE0JVoMxN4rpGzJMhE5Pl+xlATsDIqikP9F9D2z3h9nOksEUFhK+qO4rcPkoalMQ/HqJLIyb3F3JdjrCcw1yZ8joyJLR5gCo54etlag7qIoeNh1N1BRYj3DTFJ0elotxPlVzkGuYAmL0VSJVGAJA41c4Z6A3BzTLfn0HYwYKEI6CUAMzZEWvLsIcQOo1AmmyyM72nHJCfYsogflGV6jEk9vyQZXSuq6w4c16NsGcGZbwOPr+H1RkOk2LEzjNepxQkihHSCQ4ynAYNRx2zMKV92CQMWqj8J0BRE8EShxRFN6YrfCRhC0x3r/Zm4IbQCcmJoV0kMamllccR6FjHqUC5F2R/wS2dcymOlfAKOS4KmzQb5cpNC2MC7JhVn5wjXoJ44rYhLh8n0eXOCorJxa7POjbSlCGVczr34/RsAmrcvo9s+wGp3tzVhntxiXiJ4nvEYb4FJkf0O8HocAePmLvCxnL0AORraVekJk6TYjDabRVXfRE2lCN1h6ZQRN1+InUbsCpKwoBZHh0dODN9JBCUffItXxEavTQkUtnfTVAplCWL3JISz29h4NjotnuSsQKJCk8dF+kJR6RARjrqFVmfPnj3ZbK8cIJ0msd6jgHPGtfVTQ8VLmlvh4mct9sobRmPic0DyDQQnx/NlfYUgyz59+oScsH379pAwXABD32nTpoUHIToESeI5mnbE/UqDdyLcafEBf2MCqgC7NwxIbMREJQ0g4D4sfJwnD+AmRrII05cfMWJE+L1169bQr+fip06dGp4oJ83lmYd5wj/EmMa4TaHivo4EeCguYZBnkB5g2aWA69OIEnUHOaGysjIYMGBAMGnSpODYsWPZwCpFmm4lNq+4gSLQA7jcX8DwtjEyRC8wjabnXEx9kfWnTJkSJkAo90xpJVV+FmcVNeYAF5zWngS4C4O91MBxmAv8blLEpbjI5sz9MTdAhcgkCT1RO8mZkAjfiYpTEvStAS53Uw1vAiUGgZ3GpuQEYvoiBqlIan7kSDHnTwJQFNiPu0+5VxCVYhcZIjNrdXUDdp+Eq5AZ3Gkg8QAyVZRZIk4Tl4QAbF9cXJxNYZMAtAokgs4BrNxEpCtteXg7DDTMDKYNSuQdKsnJBek7HxewvxaosWxLYXtw+cJp18217wql4aKCfBNoEu0O5VU+PhctJ0YeXD4C6JQpyrlpSLTojpGGGN5YwNziChdIZLk4lvLcFJ9jMX3QdiImY9bmGQU+TRUL5CHITTRlgF8D9ouD1MfmLoEPl5xokIumZ2cfgMpHt47IW9N64Hsh7wQYYjyIugWuF5fCqYncXRd5vPMWyizzvhi/32+nvG0dZc9vR6fZOu0md5e+uC408FvKSIOZwXlGvxPv95izA2Vtvg1xKFWARI+vMX66HUhpQQb643uW1bSjuTWyw2SBvDrBvjFic1eGGlz5esq3ko9uSIlBRqPuFcCv8F4WIcN12nVaBd0SaYwI6PDDImR11JkqgHcPmQssjxIn6bUshygDFJUTxPMpHk+jfjPgupgdnYV2R/g7xSjtpah8RJBewhwf0gGK6XI92u4wXFEU40afJ4DN4h5LcAd+40HI3JgJecuT0c062W0i2hQJUTcxan3/CMW1PF2K6bbA+Daz4xRs1D3Br1Cm0OihKCqizW78/nXAF/G5TXrEcVzaNMH6CyMswqsAHqDyDLEyou8lwOXnKF8DjI6KjV3KzMBiXkDH8ij/H214J5A596ekrZ3F0zXlWeL7+P5eUrNo3/QwC15uxthuzidy7DzKRwEDaAViiDgKbTbz7CJnzo0bN7pIfIiid8SuPwn25o3QCmpnyjlZkyxPP8EomCJzrGb7GJMx7tNsq4MT2xMUYaiErZOluTzKsnz3gwCeCZyVRZJfYplNEokEjwrPtxlxjeYAk+F1F74VAzPxQRNYYdtpOUvWs8J1sGhBJMNsb7igN8plJs1eSmLIhLKE4rvaCX27gOhLpLOsIzJ7qn/i+wZzcvSOZ23/du8TZjwV8zHIXoP4R3ifBxiFz1dcVpa3aPntPE+c6TmIWE9EtcMmAcPdWAhYhAXxcLOQi9L1WhD1Sc8p1d2oL7XGiRKp8F4A2i8K/nfI+y/gsTDJ/YC/8+AD5Uh04KHiGl+cIFPnBDDrPMjwRGkLXyxO4VGbfQWnDH2v0bVWE3C9QOXlepbgjEfIJQI6XDG3z5ahD9cw2pS78ipB85wyScNTvsVzlzzhL8/jRrnmVjfFJK/m3m4nj9vbgQTguT8XZTjsm672R5uJKEaQmBI/c58gyus8ZDagLpEVSJBIyHp4jn++xqPV71OgQgJYEWOtZ/haxRtKmWOBu8xdBLftWltsY84zE6WIEy/eIOWL+BaayMx+KHtL7EAkqdNDLiEXmEMUHniedtJqg9HmZtfvt26vNi0BdG3Ft3g8ZOf7PAu59TxtzivLNIekyi+wD1i8CuUiD9FXAa8C+/xS3JPmZnomyc7H+fb4/Se0bk41Fel621r4cgVxbq91V4jVqwB7HTe2M7jgB+QWHavZkDRPmZcASoZEmBx6i75bGjPcMdL4/VKGFAGWZkGzPG0XAbdL9A81G5LOmUnC9hHKJeO7dcUMjblSl12867ElFTtaGl20xvvLGPdVz/8TVuU7y0x1PG7vtNg24oz9Uo/Z412++VFWI7Fcog9tu9Lm6gvRmIPv9x1xmQAu6RDkXtbOtlGEmpgD5Nvnyc0dcv0EE6cfdi1HmhMf9wDF3k3gtRvEedhxjpgfqPb9PU9iEJHnyOUA7bQUXh6kq/D7l2iTjWv7XOD530BDr8jIrus+srXjt4MzumJMHuTsBa63YKE1+RR5lBjEikCCnWKWiHdzOgKO+nRIBAF88za/IFmJ3eMZov4CYxGBabcpGL8EYx+SeMXJeRwHNsV/h+vdxeuhEpN3ZyNY78Gm2fknJxVGhyjixPiQvVkNzT1elD9Py/aTAL64Hb9vcYmC9zfdXdT/C1LeGbg4rnBaAihDFJH12W5ulfNCNe/xTsP3bp8ikzJs5BF+5PNfAQYAPaseTdsEcaYAAAAASUVORK5CYII="
      };
    },
    computed: {
      iconSnowWidth() {
        return (Math.floor(this.iconSize / 24) || 1) * 2;
      },
      contentdownText() {
        return this.contentText.contentdown || t("uni-load-more.contentdown");
      },
      contentrefreshText() {
        return this.contentText.contentrefresh || t("uni-load-more.contentrefresh");
      },
      contentnomoreText() {
        return this.contentText.contentnomore || t("uni-load-more.contentnomore");
      }
    },
    mounted() {
      var pages = getCurrentPages();
      var page = pages[pages.length - 1];
      var currentWebview = page.$getAppWebview();
      currentWebview.addEventListener("hide", () => {
        this.webviewHide = true;
      });
      currentWebview.addEventListener("show", () => {
        this.webviewHide = false;
      });
    },
    methods: {
      onClick() {
        this.$emit("clickLoadMore", {
          detail: {
            status: this.status
          }
        });
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "uni-load-more",
      onClick: _cache[0] || (_cache[0] = (...args) => $options.onClick && $options.onClick(...args))
    }, [
      !$data.webviewHide && ($props.iconType === "circle" || $props.iconType === "auto" && $data.platform === "android") && $props.status === "loading" && $props.showIcon ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 0,
          style: vue.normalizeStyle({ width: $props.iconSize + "px", height: $props.iconSize + "px" }),
          class: "uni-load-more__img uni-load-more__img--android-MP"
        },
        [
          vue.createElementVNode(
            "view",
            {
              class: "uni-load-more__img-icon",
              style: vue.normalizeStyle({ borderTopColor: $props.color, borderTopWidth: $props.iconSize / 12 })
            },
            null,
            4
            /* STYLE */
          ),
          vue.createElementVNode(
            "view",
            {
              class: "uni-load-more__img-icon",
              style: vue.normalizeStyle({ borderTopColor: $props.color, borderTopWidth: $props.iconSize / 12 })
            },
            null,
            4
            /* STYLE */
          ),
          vue.createElementVNode(
            "view",
            {
              class: "uni-load-more__img-icon",
              style: vue.normalizeStyle({ borderTopColor: $props.color, borderTopWidth: $props.iconSize / 12 })
            },
            null,
            4
            /* STYLE */
          )
        ],
        4
        /* STYLE */
      )) : !$data.webviewHide && $props.status === "loading" && $props.showIcon ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 1,
          style: vue.normalizeStyle({ width: $props.iconSize + "px", height: $props.iconSize + "px" }),
          class: "uni-load-more__img uni-load-more__img--ios-H5"
        },
        [
          vue.createElementVNode("image", {
            src: $data.imgBase64,
            mode: "widthFix"
          }, null, 8, ["src"])
        ],
        4
        /* STYLE */
      )) : vue.createCommentVNode("v-if", true),
      $props.showText ? (vue.openBlock(), vue.createElementBlock(
        "text",
        {
          key: 2,
          class: "uni-load-more__text",
          style: vue.normalizeStyle({ color: $props.color })
        },
        vue.toDisplayString($props.status === "more" ? $options.contentdownText : $props.status === "loading" ? $options.contentrefreshText : $options.contentnomoreText),
        5
        /* TEXT, STYLE */
      )) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const __easycom_1 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-9245e42c"], ["__file", "D:/develop/code/HZ/hz-ui/uni_modules/uni-load-more/components/uni-load-more/uni-load-more.vue"]]);
  const _sfc_main$1 = {
    __name: "create",
    setup(__props, { expose: __expose }) {
      __expose();
      const formData = vue.reactive({
        type: "study",
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
      const images = vue.ref([]);
      const userInfo = vue.reactive({
        name: "张三",
        avatar: "/static/avatar/default.png"
      });
      const loading = vue.ref(false);
      const showCustomNavBar = vue.ref(false);
      const scrollTop = vue.ref(0);
      const isIphoneX = vue.ref(false);
      const helpTypes = [
        { value: "study", label: "学习求助", icon: "/static/help/study.png" },
        { value: "life", label: "生活帮助", icon: "/static/help/life.png" },
        { value: "item", label: "物品借用", icon: "/static/help/item.png" },
        { value: "skill", label: "技能求助", icon: "/static/help/skill.png" },
        { value: "other", label: "其他求助", icon: "/static/help/other.png" }
      ];
      const contactOptions = [
        { value: "phone", label: "手机" },
        { value: "wechat", label: "微信" },
        { value: "qq", label: "QQ" }
      ];
      const canSubmit = vue.computed(() => {
        return formData.title.trim() && formData.description.trim() && formData.contact;
      });
      onLoad((options) => {
        uni.getSystemInfo({
          success: (res) => {
            isIphoneX.value = res.model.includes("iPhone X");
          }
        });
        const user = uni.getStorageSync("userInfo");
        if (user) {
          Object.assign(userInfo, user);
        }
        loadDraft();
      });
      onShow(() => {
        formatAppLog("log", "at pages/help/create.vue:256", "help-create页面显示");
      });
      onHide(() => {
        formatAppLog("log", "at pages/help/create.vue:261", "help-create页面隐藏");
        saveDraft();
      });
      const onScroll = (e) => {
        const scrollTop2 = e.detail.scrollTop;
        showCustomNavBar.value = scrollTop2 > 50;
      };
      const selectType = (type) => {
        formData.type = type;
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
        uni.chooseImage({
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
          const token = uni.getStorageSync("token");
          const baseURL = "http://localhost:8080";
          const result = await uni.uploadFile({
            url: baseURL + "/upload/image",
            // 使用baseURL
            filePath: tempFilePath,
            name: "file",
            header: {
              "Authorization": token ? `Bearer ${token}` : ""
            }
          });
          if (result.statusCode === 200) {
            const data = JSON.parse(result.data);
            if (data.code === 0) {
              formData.images.push(data.data.url);
              images.value.push("/static/upload/" + data.data.filePath);
            } else {
              throw new Error(data.msg || "上传失败");
            }
          } else {
            throw new Error(`上传失败: HTTP ${result.statusCode}`);
          }
        } catch (error) {
          formatAppLog("error", "at pages/help/create.vue:339", "上传图片失败", error);
        } finally {
          loading.value = false;
        }
      };
      const deleteImage = (index) => {
        uni.showModal({
          title: "提示",
          content: "确定要删除这张图片吗？",
          success: async (res) => {
            if (res.confirm) {
              await request.post("/upload/delete", null, {
                params: {
                  filePath: "D:/develop/code/HZ/hz-ui" + images.value[index]
                }
              });
              images.value.splice(index, 1);
            }
          }
        });
      };
      const selectContactType = (type) => {
        formData.contactType = type;
        formData.contact = "";
      };
      const goBack = () => {
        uni.navigateBack();
      };
      const saveDraft = () => {
        if (formData.title || formData.description) {
          uni.setStorageSync("helpDraft", formData);
        }
      };
      const loadDraft = () => {
        const draft = uni.getStorageSync("helpDraft");
        if (draft) {
          Object.assign(formData, draft);
        }
      };
      const validateForm = () => {
        if (!formData.title.trim()) {
          uni.showToast({
            title: "请输入求助标题",
            icon: "none"
          });
          return false;
        }
        if (!formData.description.trim()) {
          uni.showToast({
            title: "请输入详细描述",
            icon: "none"
          });
          return false;
        }
        if (formData.contactType === "phone" && !/^1[3-9]\d{9}$/.test(formData.contact)) {
          uni.showToast({
            title: "请输入正确的手机号",
            icon: "none"
          });
          return false;
        }
        if (formData.contactType === "wechat" && !formData.contact.trim()) {
          uni.showToast({
            title: "请输入微信号",
            icon: "none"
          });
          return false;
        }
        if (formData.contactType === "qq" && !/^\d{5,12}$/.test(formData.contact)) {
          uni.showToast({
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
          await request.post("/help/create", formData);
          uni.removeStorageSync("helpDraft");
          uni.showToast({
            title: "发布成功",
            icon: "success",
            duration: 2e3,
            success: () => {
              setTimeout(() => {
                uni.navigateBack();
                uni.$emit("helpPublished");
              }, 1500);
            }
          });
        } catch (error) {
          formatAppLog("error", "at pages/help/create.vue:465", "发布失败", error);
          uni.showToast({
            title: "发布失败，请重试",
            icon: "error"
          });
        } finally {
          loading.value = false;
        }
      };
      const __returned__ = { formData, images, userInfo, loading, showCustomNavBar, scrollTop, isIphoneX, helpTypes, contactOptions, canSubmit, onScroll, selectType, checkTitleLength, checkDescriptionLength, chooseImage, uploadImage, deleteImage, selectContactType, goBack, saveDraft, loadDraft, validateForm, submitHelp, ref: vue.ref, reactive: vue.reactive, computed: vue.computed, onMounted: vue.onMounted, get onLoad() {
        return onLoad;
      }, get onShow() {
        return onShow;
      }, get onHide() {
        return onHide;
      }, get request() {
        return request;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0);
    const _component_uni_load_more = resolveEasycom(vue.resolveDynamicComponent("uni-load-more"), __easycom_1);
    return vue.openBlock(), vue.createElementBlock("view", { class: "help-create-page" }, [
      vue.createCommentVNode(" 自定义导航栏 "),
      $setup.showCustomNavBar ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "custom-nav-bar"
      }, [
        vue.createElementVNode("view", {
          class: "nav-left",
          onClick: $setup.goBack
        }, [
          vue.createVNode(_component_uni_icons, {
            type: "left",
            size: "24",
            color: "#333"
          }),
          vue.createElementVNode("text", { class: "nav-title" }, "我要求助")
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("scroll-view", {
        class: "scroll-view",
        "scroll-y": "",
        "scroll-top": $setup.scrollTop,
        onScroll: $setup.onScroll
      }, [
        vue.createElementVNode("view", { class: "form-container" }, [
          vue.createCommentVNode(" 求助类型 "),
          vue.createElementVNode("view", { class: "form-section" }, [
            vue.createElementVNode("view", { class: "section-title" }, [
              vue.createElementVNode("text", { class: "title-text" }, "求助类型"),
              vue.createElementVNode("text", { class: "required-mark" }, "*")
            ]),
            vue.createElementVNode("view", { class: "type-grid" }, [
              (vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.helpTypes, (type) => {
                  return vue.createElementVNode("view", {
                    class: vue.normalizeClass(["type-item", { "active": $setup.formData.type === type.value }]),
                    key: type.value,
                    onClick: ($event) => $setup.selectType(type.value)
                  }, [
                    vue.createElementVNode("image", {
                      src: type.icon,
                      class: vue.normalizeClass(["type-icon", { "active-icon": $setup.formData.type === type.value }])
                    }, null, 10, ["src"]),
                    vue.createElementVNode(
                      "text",
                      { class: "type-text" },
                      vue.toDisplayString(type.label),
                      1
                      /* TEXT */
                    )
                  ], 10, ["onClick"]);
                }),
                64
                /* STABLE_FRAGMENT */
              ))
            ])
          ]),
          vue.createCommentVNode(" 标题 "),
          vue.createElementVNode("view", { class: "form-section" }, [
            vue.createElementVNode("view", { class: "section-title" }, [
              vue.createElementVNode("text", { class: "title-text" }, "求助标题"),
              vue.createElementVNode("text", { class: "required-mark" }, "*")
            ]),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.formData.title = $event),
                class: "form-input",
                placeholder: "请输入求助标题（如：求高数辅导、急借教材等）",
                "placeholder-class": "placeholder",
                maxlength: "30",
                onInput: $setup.checkTitleLength
              },
              null,
              544
              /* NEED_HYDRATION, NEED_PATCH */
            ), [
              [vue.vModelText, $setup.formData.title]
            ]),
            vue.createElementVNode("view", { class: "input-tips" }, [
              vue.createElementVNode(
                "text",
                null,
                vue.toDisplayString($setup.formData.title.length) + "/30",
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createCommentVNode(" 详细描述 "),
          vue.createElementVNode("view", { class: "form-section" }, [
            vue.createElementVNode("view", { class: "section-title" }, [
              vue.createElementVNode("text", { class: "title-text" }, "详细描述"),
              vue.createElementVNode("text", { class: "required-mark" }, "*")
            ]),
            vue.withDirectives(vue.createElementVNode(
              "textarea",
              {
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.formData.description = $event),
                class: "form-textarea",
                placeholder: "请详细描述您的求助内容，包括具体需求、时间、要求等",
                "placeholder-class": "placeholder",
                maxlength: "500",
                "auto-height": true,
                onInput: $setup.checkDescriptionLength
              },
              null,
              544
              /* NEED_HYDRATION, NEED_PATCH */
            ), [
              [vue.vModelText, $setup.formData.description]
            ]),
            vue.createElementVNode("view", { class: "input-tips" }, [
              vue.createElementVNode(
                "text",
                null,
                vue.toDisplayString($setup.formData.description.length) + "/500",
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createCommentVNode(" 上传图片 "),
          vue.createElementVNode("view", { class: "form-section" }, [
            vue.createElementVNode("view", { class: "section-title" }, [
              vue.createElementVNode("text", { class: "title-text" }, "上传图片（可选）")
            ]),
            vue.createElementVNode("view", { class: "upload-container" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.images, (image, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: index,
                    class: "image-item"
                  }, [
                    vue.createElementVNode("image", {
                      src: image,
                      class: "upload-image",
                      mode: "aspectFill"
                    }, null, 8, ["src"]),
                    vue.createElementVNode("view", {
                      class: "delete-btn",
                      onClick: ($event) => $setup.deleteImage(index)
                    }, [
                      vue.createVNode(_component_uni_icons, {
                        type: "closeempty",
                        size: "16",
                        color: "#fff"
                      })
                    ], 8, ["onClick"])
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              )),
              $setup.images.length < 9 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "upload-btn",
                onClick: $setup.chooseImage
              }, [
                vue.createVNode(_component_uni_icons, {
                  type: "plusempty",
                  size: "28",
                  color: "#ccc"
                }),
                vue.createElementVNode("text", { class: "upload-text" }, "上传图片")
              ])) : vue.createCommentVNode("v-if", true)
            ]),
            vue.createElementVNode("view", { class: "upload-tips" }, [
              vue.createElementVNode("text", null, "最多可上传9张图片，支持JPG、PNG格式")
            ])
          ]),
          vue.createCommentVNode(" 联系方式 "),
          vue.createElementVNode("view", { class: "form-section" }, [
            vue.createElementVNode("view", { class: "section-title" }, [
              vue.createElementVNode("text", { class: "title-text" }, "联系方式"),
              vue.createElementVNode("text", { class: "required-mark" }, "*")
            ]),
            vue.createElementVNode("view", { class: "contact-options" }, [
              (vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.contactOptions, (option, index) => {
                  return vue.createElementVNode("view", {
                    key: option.value,
                    class: vue.normalizeClass(["contact-option", { "active": $setup.formData.contactType === option.value }]),
                    onClick: ($event) => $setup.selectContactType(option.value)
                  }, [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(option.label),
                      1
                      /* TEXT */
                    ),
                    $setup.formData.contactType === option.value ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "active-dot"
                    })) : vue.createCommentVNode("v-if", true)
                  ], 10, ["onClick"]);
                }),
                64
                /* STABLE_FRAGMENT */
              ))
            ]),
            $setup.formData.contactType === "phone" ? vue.withDirectives((vue.openBlock(), vue.createElementBlock(
              "input",
              {
                key: 0,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.formData.contact = $event),
                class: "form-input",
                type: "number",
                placeholder: "请输入手机号码",
                "placeholder-class": "placeholder",
                maxlength: "11"
              },
              null,
              512
              /* NEED_PATCH */
            )), [
              [vue.vModelText, $setup.formData.contact]
            ]) : vue.createCommentVNode("v-if", true),
            $setup.formData.contactType === "wechat" ? vue.withDirectives((vue.openBlock(), vue.createElementBlock(
              "input",
              {
                key: 1,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.formData.contact = $event),
                class: "form-input",
                placeholder: "请输入微信号",
                "placeholder-class": "placeholder",
                maxlength: "20"
              },
              null,
              512
              /* NEED_PATCH */
            )), [
              [vue.vModelText, $setup.formData.contact]
            ]) : vue.createCommentVNode("v-if", true),
            $setup.formData.contactType === "qq" ? vue.withDirectives((vue.openBlock(), vue.createElementBlock(
              "input",
              {
                key: 2,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.formData.contact = $event),
                class: "form-input",
                type: "number",
                placeholder: "请输入QQ号",
                "placeholder-class": "placeholder",
                maxlength: "12"
              },
              null,
              512
              /* NEED_PATCH */
            )), [
              [vue.vModelText, $setup.formData.contact]
            ]) : vue.createCommentVNode("v-if", true)
          ])
        ])
      ], 40, ["scroll-top"]),
      vue.createCommentVNode(" 底部操作栏 "),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["bottom-bar", { "with-safe-area": $setup.isIphoneX }])
        },
        [
          vue.createElementVNode("button", {
            class: vue.normalizeClass(["submit-btn", { "disabled": !$setup.canSubmit }]),
            disabled: !$setup.canSubmit,
            onClick: $setup.submitHelp
          }, " 发布求助 ", 10, ["disabled"])
        ],
        2
        /* CLASS */
      ),
      vue.createCommentVNode(" 加载中 "),
      $setup.loading ? (vue.openBlock(), vue.createBlock(_component_uni_load_more, {
        key: 1,
        status: "loading",
        "content-text": { contentdown: "加载中" }
      })) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesHelpCreate = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-701f7029"], ["__file", "D:/develop/code/HZ/hz-ui/pages/help/create.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/alumni/alumni", PagesAlumniAlumni);
  __definePage("pages/message/message", PagesMessageMessage);
  __definePage("pages/profile/profile", PagesProfileProfile);
  __definePage("pages/login/login", PagesLoginLogin);
  __definePage("pages/login/register", PagesLoginRegister);
  __definePage("pages/help/create", PagesHelpCreate);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "D:/develop/code/HZ/hz-ui/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
