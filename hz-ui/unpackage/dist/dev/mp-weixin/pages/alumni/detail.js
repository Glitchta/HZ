"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_request = require("../../utils/request.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_icons2 + _easycom_uni_load_more2 + _easycom_uni_popup2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_load_more + _easycom_uni_popup)();
}
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    const detail = common_vendor.ref({});
    const commentList = common_vendor.ref([]);
    const currentUserId = common_vendor.computed(() => {
      const cached = common_vendor.index.getStorageSync("currentUserId");
      if (cached)
        return String(cached);
      const ui = common_vendor.index.getStorageSync("userInfo");
      if (ui && ui.userId)
        return String(ui.userId);
      if (ui && ui.id)
        return String(ui.id);
      return "";
    });
    const commentLoading = common_vendor.ref(false);
    const commentNoMore = common_vendor.ref(false);
    const showInputPopup = common_vendor.ref(false);
    const replyInput = common_vendor.ref("");
    const replyTargetName = common_vendor.ref("");
    const replyPopup = common_vendor.ref(null);
    const commentPopup = common_vendor.ref(null);
    const postId = common_vendor.ref("");
    const replyData = common_vendor.reactive({ parentId: "", replyId: "" });
    const comment = common_vendor.reactive({ content: "", parentId: "", replyId: "" });
    const commentCount = common_vendor.computed(() => {
      let count = 0;
      commentList.value.forEach((item) => {
        count++;
        if (item.children)
          count += item.children.length;
      });
      return count;
    });
    const isCollected = common_vendor.ref(false);
    common_vendor.onLoad((options) => {
      postId.value = options.id;
      if (postId.value) {
        fetchDetail();
        fetchComments(true);
        checkCollectionStatus();
        checkLikeStatus();
      }
    });
    const checkCollectionStatus = async () => {
      try {
        const res = await utils_request.request.post("/collection/check", { contentId: String(postId.value), contentType: "alumni" });
        isCollected.value = res.data === true;
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/alumni/detail.vue:266", "检查收藏失败", e);
      }
    };
    const checkLikeStatus = async () => {
      try {
        const res = await utils_request.request.post("/like/check", { contentId: String(postId.value), contentType: "alumni" });
        detail.value.isLiked = res.data === true;
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/alumni/detail.vue:273", "检查点赞失败", e);
      }
    };
    const handleCollect = async () => {
      if (!common_vendor.index.getStorageSync("token")) {
        common_vendor.index.showModal({ title: "提示", content: "请先登录", success: (res) => {
          if (res.confirm)
            common_vendor.index.navigateTo({ url: "/pages/login/login" });
        } });
        return;
      }
      try {
        if (isCollected.value) {
          await utils_request.request.post("/collection/cancel", { contentId: postId.value, contentType: "alumni" });
          isCollected.value = false;
          common_vendor.index.showToast({ title: "已取消收藏" });
        } else {
          await utils_request.request.post("/collection/add", { contentId: postId.value, contentType: "alumni" });
          isCollected.value = true;
          common_vendor.index.showToast({ title: "收藏成功" });
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/alumni/detail.vue:291", "收藏操作失败", e);
      }
    };
    const fetchDetail = async () => {
      try {
        const res = await utils_request.request.get("/dynamic/getById", { params: { id: postId.value } });
        if (res.code === 0)
          detail.value = res.data;
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/alumni/detail.vue:299", "获取详情失败", e);
      }
    };
    const fetchComments = async (refresh = false) => {
      if (commentLoading.value)
        return;
      commentLoading.value = true;
      try {
        const res = await utils_request.request.post("/comment/list", { current: 1, size: 50, id: postId.value });
        if (res.code === 0) {
          commentList.value = res.data || [];
          commentNoMore.value = true;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/alumni/detail.vue:313", "获取评论失败", e);
      } finally {
        commentLoading.value = false;
      }
    };
    const formatTime = (time) => {
      if (!time)
        return "";
      const date = new Date(time);
      const now = /* @__PURE__ */ new Date();
      const diff = now - date;
      if (diff < 6e4)
        return "刚刚";
      if (diff < 36e5)
        return Math.floor(diff / 6e4) + "分钟前";
      if (diff < 864e5)
        return Math.floor(diff / 36e5) + "小时前";
      if (diff < 6048e5)
        return Math.floor(diff / 864e5) + "天前";
      return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    };
    const previewImage = (index) => {
      common_vendor.index.previewImage({ urls: detail.value.images, current: index });
    };
    const toggleLike = async () => {
      if (!common_vendor.index.getStorageSync("token")) {
        common_vendor.index.showModal({ title: "提示", content: "请先登录", success: (res) => {
          if (res.confirm)
            common_vendor.index.navigateTo({ url: "/pages/login/login" });
        } });
        return;
      }
      try {
        const liked = !detail.value.isLiked;
        const res = await utils_request.request.post(liked ? "/like/add" : "/like/cancel", {
          contentId: postId.value,
          contentType: "alumni"
        });
        if (res.code === 0) {
          detail.value.isLiked = liked;
          detail.value.likeCount = liked ? (detail.value.likeCount || 0) + 1 : Math.max(0, (detail.value.likeCount || 1) - 1);
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/alumni/detail.vue:351", "点赞失败", e);
      }
    };
    const toggleCommentLike = async (item) => {
      try {
        const res = await utils_request.request.post("/comment/like", { commentId: item.id, isLike: !item.isLiked });
        if (res.code === 0) {
          item.isLiked = !item.isLiked;
          item.likeCount = item.isLiked ? (item.likeCount || 0) + 1 : Math.max(0, (item.likeCount || 1) - 1);
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/alumni/detail.vue:362", "点赞失败", e);
      }
    };
    const toggleReplyLike = async (parent, reply) => {
      try {
        const res = await utils_request.request.post("/comment/like", { commentId: reply.id, isLike: !reply.isLiked });
        if (res.code === 0) {
          reply.isLiked = !reply.isLiked;
          reply.likeCount = reply.isLiked ? (reply.likeCount || 0) + 1 : Math.max(0, (reply.likeCount || 1) - 1);
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/alumni/detail.vue:372", "点赞失败", e);
      }
    };
    const deleteComment = (comment2) => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除这条评论吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              const result = await utils_request.request.post("/comment/delete", { commentId: comment2.id, contentType: "alumni" });
              if (result.code === 0) {
                commentList.value = commentList.value.filter((c) => c.id !== comment2.id);
                commentCount.value--;
                common_vendor.index.showToast({ title: "已删除", icon: "success" });
              } else {
                common_vendor.index.showToast({ title: result.msg || "删除失败", icon: "none" });
              }
            } catch (e) {
              common_vendor.index.__f__("error", "at pages/alumni/detail.vue:390", "删除评论失败", e);
            }
          }
        }
      });
    };
    const deleteReply = (parentComment, reply) => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除这条回复吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              const result = await utils_request.request.post("/comment/delete", { commentId: reply.id, contentType: "alumni" });
              if (result.code === 0) {
                parentComment.children = parentComment.children.filter((c) => c.id !== reply.id);
                commentCount.value--;
                common_vendor.index.showToast({ title: "已删除", icon: "success" });
              } else {
                common_vendor.index.showToast({ title: result.msg || "删除失败", icon: "none" });
              }
            } catch (e) {
              common_vendor.index.__f__("error", "at pages/alumni/detail.vue:411", "删除回复失败", e);
            }
          }
        }
      });
    };
    const showCommentPopup = () => {
      comment.content = "";
      commentPopup.value.open();
      showInputPopup.value = true;
    };
    const closeCommentPopup = () => {
      commentPopup.value.close();
      showInputPopup.value = false;
    };
    const showReplyInput = (cmt, type, reply = null) => {
      if (type === "comment") {
        replyTargetName.value = cmt.nickname || "匿名用户";
        replyData.parentId = cmt.id;
        replyData.replyId = cmt.id;
      } else {
        replyTargetName.value = reply.nickname || "匿名用户";
        replyData.parentId = cmt.id;
        replyData.replyId = reply.id;
      }
      replyInput.value = "";
      replyPopup.value.open();
      showInputPopup.value = true;
    };
    const closeReplyPopup = () => {
      replyPopup.value.close();
      replyInput.value = "";
      showInputPopup.value = false;
    };
    const submitComment = async () => {
      if (!comment.content.trim())
        return;
      try {
        const res = await utils_request.request.post("/comment/insert", { contentId: postId.value, parentId: "", content: comment.content, replyId: "" });
        if (res.code === 0) {
          common_vendor.index.showToast({ title: "评论成功", icon: "success" });
          await utils_request.request.put("/dynamic/comment", null, { params: { id: postId.value } });
          fetchComments(true);
          closeCommentPopup();
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/alumni/detail.vue:455", "评论失败", e);
      }
    };
    const submitReply = async () => {
      if (!replyInput.value.trim())
        return;
      try {
        const res = await utils_request.request.post("/comment/insert", { contentId: postId.value, parentId: replyData.parentId, content: replyInput.value, replyId: replyData.replyId });
        if (res.code === 0) {
          common_vendor.index.showToast({ title: "回复成功", icon: "success" });
          await utils_request.request.put("/dynamic/comment", null, { params: { id: postId.value } });
          fetchComments(true);
          closeReplyPopup();
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/alumni/detail.vue:467", "回复失败", e);
      }
    };
    const loadMoreReplies = async (comment2) => {
      try {
        const res = await utils_request.request.post("/comment/replies", {
          parentId: comment2.id,
          offset: 0,
          size: 20
        });
        if (res.code === 0) {
          const replies = res.data || [];
          comment2.children = replies;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/alumni/detail.vue:478", "加载回复失败", e);
      }
    };
    const onCommentPopupChange = (e) => {
      showInputPopup.value = e.show;
    };
    const onReplyPopupChange = (e) => {
      showInputPopup.value = e.show;
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: detail.value.avatar || "/static/default-avatar.png",
        b: common_vendor.t(detail.value.nickname),
        c: common_vendor.t(formatTime(detail.value.createTime)),
        d: detail.value.title
      }, detail.value.title ? {
        e: common_vendor.t(detail.value.title)
      } : {}, {
        f: common_vendor.t(detail.value.content),
        g: detail.value.images && detail.value.images.length > 0
      }, detail.value.images && detail.value.images.length > 0 ? {
        h: common_vendor.f(detail.value.images, (img, index, i0) => {
          return {
            a: img,
            b: index,
            c: common_vendor.o(($event) => previewImage(index), index)
          };
        })
      } : {}, {
        i: common_vendor.p({
          type: detail.value.isLiked ? "heart-filled" : "heart",
          color: detail.value.isLiked ? "#ff6b6b" : "#999",
          size: "16"
        }),
        j: common_vendor.t(detail.value.likeCount || 0),
        k: common_vendor.o(toggleLike, "a6"),
        l: common_vendor.p({
          type: "chat",
          size: "16",
          color: "#999"
        }),
        m: common_vendor.t(detail.value.commentCount || 0),
        n: common_vendor.p({
          type: isCollected.value ? "star-filled" : "star",
          color: isCollected.value ? "#ffc107" : "#999",
          size: "16"
        }),
        o: common_vendor.o(handleCollect, "be"),
        p: common_vendor.t(commentCount.value),
        q: common_vendor.f(commentList.value, (item, k0, i0) => {
          return common_vendor.e({
            a: item.avatar || "/static/default-avatar.png",
            b: common_vendor.t(item.nickname || "匿名用户"),
            c: common_vendor.t(item.content),
            d: common_vendor.t(formatTime(item.createTime)),
            e: "5b01e732-3-" + i0,
            f: common_vendor.p({
              type: item.isLiked ? "heart-filled" : "heart",
              color: item.isLiked ? "#ff6b6b" : "#999",
              size: "16"
            }),
            g: common_vendor.t(item.likeCount || 0),
            h: common_vendor.o(($event) => toggleCommentLike(item), item.id),
            i: item.isLiked ? 1 : "",
            j: currentUserId.value && currentUserId.value === item.createUser
          }, currentUserId.value && currentUserId.value === item.createUser ? {
            k: "5b01e732-4-" + i0,
            l: common_vendor.p({
              type: "trash",
              size: "14",
              color: "#ccc"
            }),
            m: common_vendor.o(($event) => deleteComment(item), item.id)
          } : {}, {
            n: common_vendor.o(($event) => showReplyInput(item, "comment"), item.id),
            o: item.children && item.children.length > 0
          }, item.children && item.children.length > 0 ? {
            p: common_vendor.f(item.children, (reply, k1, i1) => {
              return common_vendor.e({
                a: reply.avatar || "/static/default-avatar.png",
                b: common_vendor.t(reply.nickname || "匿名用户"),
                c: reply.replyId && reply.replyId !== item.id
              }, reply.replyId && reply.replyId !== item.id ? {
                d: common_vendor.t(reply.replyIdNickname)
              } : {}, {
                e: common_vendor.t(reply.content),
                f: common_vendor.t(formatTime(reply.createTime)),
                g: "5b01e732-5-" + i0 + "-" + i1,
                h: common_vendor.p({
                  type: reply.isLiked ? "heart-filled" : "heart",
                  color: reply.isLiked ? "#ff6b6b" : "#999",
                  size: "16"
                }),
                i: common_vendor.t(reply.likeCount || 0),
                j: common_vendor.o(($event) => toggleReplyLike(item, reply), reply.id),
                k: reply.isLiked ? 1 : "",
                l: currentUserId.value && currentUserId.value === reply.createUser
              }, currentUserId.value && currentUserId.value === reply.createUser ? {
                m: "5b01e732-6-" + i0 + "-" + i1,
                n: common_vendor.p({
                  type: "trash",
                  size: "14",
                  color: "#ccc"
                }),
                o: common_vendor.o(($event) => deleteReply(item, reply), reply.id)
              } : {}, {
                p: common_vendor.o(($event) => showReplyInput(item, "reply", reply), reply.id),
                q: reply.id
              });
            })
          } : {}, {
            q: item.children && item.children.length > 0 && (item.commentCount || 0) > item.children.length
          }, item.children && item.children.length > 0 && (item.commentCount || 0) > item.children.length ? {
            r: common_vendor.o(($event) => loadMoreReplies(item), item.id)
          } : {}, {
            s: item.id
          });
        }),
        r: commentLoading.value
      }, commentLoading.value ? {
        s: common_vendor.p({
          status: "loading"
        })
      } : {}, {
        t: commentNoMore.value && commentList.value.length > 0
      }, commentNoMore.value && commentList.value.length > 0 ? {} : {}, {
        v: commentList.value.length === 0 && !commentLoading.value
      }, commentList.value.length === 0 && !commentLoading.value ? {
        w: common_assets._imports_0$4
      } : {}, {
        x: common_vendor.t(replyTargetName.value),
        y: common_vendor.p({
          type: "close",
          size: "20",
          color: "#999"
        }),
        z: common_vendor.o(closeReplyPopup, "25"),
        A: `回复 ${replyTargetName.value}：`,
        B: replyInput.value,
        C: common_vendor.o(($event) => replyInput.value = $event.detail.value, "4b"),
        D: common_vendor.o(submitReply, "9f"),
        E: !replyInput.value.trim() ? 1 : "",
        F: common_vendor.sr(replyPopup, "5b01e732-8", {
          "k": "replyPopup"
        }),
        G: common_vendor.o(onReplyPopupChange, "e3"),
        H: common_vendor.p({
          type: "bottom",
          ["mask-click"]: false
        }),
        I: common_vendor.p({
          type: "close",
          size: "20",
          color: "#999"
        }),
        J: common_vendor.o(closeCommentPopup, "8b"),
        K: comment.content,
        L: common_vendor.o(($event) => comment.content = $event.detail.value, "37"),
        M: common_vendor.o(submitComment, "61"),
        N: !comment.content.trim() ? 1 : "",
        O: common_vendor.sr(commentPopup, "5b01e732-10", {
          "k": "commentPopup"
        }),
        P: common_vendor.o(onCommentPopupChange, "e8"),
        Q: common_vendor.p({
          type: "bottom",
          ["mask-click"]: false
        }),
        R: !showInputPopup.value
      }, !showInputPopup.value ? {
        S: common_vendor.p({
          type: "compose",
          size: "20",
          color: "#fff"
        }),
        T: common_vendor.o(showCommentPopup, "25")
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5b01e732"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/alumni/detail.js.map
