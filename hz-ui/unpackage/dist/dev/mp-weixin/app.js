"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const utils_websocket = require("./utils/websocket.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/alumni/alumni.js";
  "./pages/message/message.js";
  "./pages/profile/profile.js";
  "./pages/search/search.js";
  "./pages/login/login.js";
  "./pages/login/register.js";
  "./pages/help/resort.js";
  "./pages/help/help.js";
  "./pages/help/detail.js";
  "./pages/profile/collection.js";
  "./pages/profile/likes.js";
  "./pages/profile/edit.js";
  "./pages/hole/list.js";
  "./pages/hole/create.js";
  "./pages/hole/detail.js";
  "./pages/lost/list.js";
  "./pages/lost/create.js";
  "./pages/lost/detail.js";
  "./pages/message/chat.js";
  "./pages/alumni/create.js";
  "./pages/alumni/detail.js";
  "./pages/alumni/my-posts.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:6", "App Launch");
    utils_websocket.websocketManager.initWebSocket();
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:11", "App Show");
    if (!utils_websocket.websocketManager.socketConnected) {
      utils_websocket.websocketManager.reconnectWebSocket();
    }
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:18", "App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
