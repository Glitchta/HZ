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
    const query = common_vendor.ref({});
    const helpInfo = common_vendor.ref({});
    common_vendor.ref({});
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
    const commentList = common_vendor.ref([]);
    const isCollected = common_vendor.ref(false);
    const isLiked = common_vendor.ref(false);
    const isMine = common_vendor.ref(false);
    const showInputPopup = common_vendor.ref(false);
    const commentLoading = common_vendor.ref(false);
    const commentNoMore = common_vendor.ref(false);
    const replyInput = common_vendor.ref("");
    const replyTargetName = common_vendor.ref("");
    const replyPopup = common_vendor.ref(null);
    const commentPopup = common_vendor.ref(null);
    const contactPopup = common_vendor.ref(null);
    const replyData = common_vendor.reactive({ parentId: "", replyId: "" });
    const comment = common_vendor.reactive({ content: "", parentId: "", replyId: "" });
    const page = common_vendor.ref({ current: 1, size: 5, id: "" });
    const commentCount = common_vendor.computed(() => {
      let count = 0;
      commentList.value.forEach((item) => {
        count++;
        if (item.children)
          count += item.children.length;
      });
      return count;
    });
    const statusClass = common_vendor.computed(() => {
      const status = helpInfo.value.status;
      if (status === "已结束")
        return "status-ended";
      if (status === "进行中")
        return "status-solved";
      if (status === "待帮助")
        return "status-pending";
    });
    const typeClass = common_vendor.computed(() => {
      return helpInfo.value.type === "帮忙" ? "type-help" : "type-resort";
    });
    common_vendor.onLoad((options) => {
      query.value = options;
      if (options.id) {
        fetchHelpDetail(options.id);
        page.value.id = options.id;
        fetchComments(true);
      }
    });
    const fetchHelpDetail = async (id) => {
      try {
        const res = await utils_request.request.get(`/help/detail`, {
          params: {
            id
          }
        });
        helpInfo.value = res.data;
        const userInfo = common_vendor.index.getStorageSync("userInfo");
        if (userInfo && userInfo.id === helpInfo.value.userId) {
          isMine.value = true;
        }
        checkCollectionStatus(id);
        checkLikeStatus(id);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/help/detail.vue:312", "获取详情失败", error);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      }
    };
    const fetchComments = async (refresh = false) => {
      if (commentLoading.value)
        return;
      commentLoading.value = true;
      if (refresh) {
        page.value.current = 1;
        commentNoMore.value = false;
      }
      try {
        const res = await utils_request.request.post("/comment/list", page.value);
        if (res.code === 0) {
          const list = res.data || [];
          if (refresh)
            commentList.value = list;
          else
            commentList.value = [...commentList.value, ...list];
          if (list.length < page.value.size)
            commentNoMore.value = true;
          else
            page.value.current++;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/help/detail.vue:333", "获取评论失败", e);
      } finally {
        commentLoading.value = false;
      }
    };
    const checkCollectionStatus = async (helpId) => {
      try {
        const res = await utils_request.request.post("/collection/check", { helpId: String(helpId) });
        isCollected.value = res.data === true;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/help/detail.vue:342", "检查收藏状态失败", error);
      }
    };
    const checkLikeStatus = async (helpId) => {
      try {
        const res = await utils_request.request.post("/like/check", { contentId: helpId, contentType: "help" });
        isLiked.value = res.data === true;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/help/detail.vue:351", "检查点赞状态失败", error);
      }
    };
    const handleLike = async () => {
      if (!common_vendor.index.getStorageSync("token")) {
        common_vendor.index.showModal({
          title: "提示",
          content: "请先登录",
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.navigateTo({ url: "/pages/login/login" });
            }
          }
        });
        return;
      }
      try {
        if (isLiked.value) {
          await utils_request.request.post("/like/cancel", { contentId: helpInfo.value.id, contentType: "help" });
          isLiked.value = false;
          helpInfo.value.likeCount = Math.max(0, (helpInfo.value.likeCount || 1) - 1);
        } else {
          await utils_request.request.post("/like/add", { contentId: helpInfo.value.id, contentType: "help" });
          isLiked.value = true;
          helpInfo.value.likeCount = (helpInfo.value.likeCount || 0) + 1;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/help/detail.vue:380", "点赞操作失败", error);
      }
    };
    const handleCollect = async () => {
      if (!common_vendor.index.getStorageSync("token")) {
        common_vendor.index.showModal({
          title: "提示",
          content: "请先登录",
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.navigateTo({ url: "/pages/login/login" });
            }
          }
        });
        return;
      }
      try {
        if (isCollected.value) {
          await utils_request.request.post("/collection/cancel", { helpId: helpInfo.value.id, contentType: "help" });
          isCollected.value = false;
          common_vendor.index.showToast({ title: "已取消收藏" });
        } else {
          await utils_request.request.post("/collection/add", { helpId: helpInfo.value.id, contentType: "help" });
          isCollected.value = true;
          common_vendor.index.showToast({ title: "收藏成功" });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/help/detail.vue:409", "操作失败", error);
        common_vendor.index.showToast({
          title: "操作失败",
          icon: "none"
        });
      }
    };
    const handleContact = () => {
      if (helpInfo.value.createUser) {
        common_vendor.index.navigateTo({
          url: `/pages/message/chat?id=${helpInfo.value.createUser}&name=${helpInfo.value.nickname}&avatar=${helpInfo.value.avatar || ""}`
        });
      } else {
        common_vendor.index.showToast({
          title: "无法获取对方信息",
          icon: "none"
        });
      }
    };
    const closeContactPopup = () => {
      contactPopup.value.close();
    };
    const copyContact = () => {
      if (!helpInfo.value.contact)
        return;
      common_vendor.index.setClipboardData({
        data: helpInfo.value.contact,
        success: () => {
          common_vendor.index.showToast({ title: "已复制到剪贴板" });
        }
      });
    };
    const previewImage = (index) => {
      if (!helpInfo.value.images || helpInfo.value.images.length === 0)
        return;
      const urls = helpInfo.value.images.map((img) => img);
      common_vendor.index.previewImage({
        current: index,
        urls
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
    const onCommentPopupChange = (e) => {
      showInputPopup.value = e.show;
    };
    const onReplyPopupChange = (e) => {
      showInputPopup.value = e.show;
    };
    const submitComment = async () => {
      if (!comment.content.trim())
        return;
      if (!common_vendor.index.getStorageSync("token")) {
        common_vendor.index.showModal({ title: "提示", content: "请先登录", success: (res) => {
          if (res.confirm)
            common_vendor.index.navigateTo({ url: "/pages/login/login" });
        } });
        return;
      }
      try {
        const res = await utils_request.request.post("/comment/insert", { contentId: helpInfo.value.id, parentId: "", content: comment.content, replyId: "" });
        if (res.code === 0) {
          common_vendor.index.showToast({ title: "评论成功", icon: "success" });
          await utils_request.request.put("/help/comment", null, { params: { id: helpInfo.value.id } });
          fetchComments(true);
          closeCommentPopup();
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/help/detail.vue:552", "评论失败", e);
      }
    };
    const submitReply = async () => {
      if (!replyInput.value.trim())
        return;
      try {
        const res = await utils_request.request.post("/comment/insert", { contentId: helpInfo.value.id, parentId: replyData.parentId, content: replyInput.value, replyId: replyData.replyId });
        if (res.code === 0) {
          common_vendor.index.showToast({ title: "回复成功", icon: "success" });
          await utils_request.request.put("/help/comment", null, { params: { id: helpInfo.value.id } });
          fetchComments(true);
          closeReplyPopup();
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/help/detail.vue:565", "回复失败", e);
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
        common_vendor.index.__f__("error", "at pages/help/detail.vue:575", "点赞失败", e);
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
        common_vendor.index.__f__("error", "at pages/help/detail.vue:585", "点赞失败", e);
      }
    };
    const deleteComment = (comment2) => {
      const myId = currentUserId.value || String(common_vendor.index.getStorageSync("currentUserId") || "");
      if (myId && String(comment2.createUser) !== myId) {
        common_vendor.index.showToast({ title: "只能删除自己的评论", icon: "none" });
        return;
      }
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除这条评论吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              const result = await utils_request.request.post("/comment/delete", { commentId: comment2.id, contentType: "help" });
              if (result.code === 0) {
                commentList.value = commentList.value.filter((c) => c.id !== comment2.id);
                commentCount.value--;
                common_vendor.index.showToast({ title: "已删除", icon: "success" });
              } else {
                common_vendor.index.showToast({ title: result.msg || "删除失败", icon: "none" });
              }
            } catch (e) {
              common_vendor.index.__f__("error", "at pages/help/detail.vue:608", "删除评论失败", e);
            }
          }
        }
      });
    };
    const deleteReply = (parentComment, reply) => {
      const myId = currentUserId.value || String(common_vendor.index.getStorageSync("currentUserId") || "");
      if (myId && String(reply.createUser) !== myId) {
        common_vendor.index.showToast({ title: "只能删除自己的评论", icon: "none" });
        return;
      }
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除这条回复吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              const result = await utils_request.request.post("/comment/delete", { commentId: reply.id, contentType: "help" });
              if (result.code === 0) {
                parentComment.children = parentComment.children.filter((c) => c.id !== reply.id);
                commentCount.value--;
                common_vendor.index.showToast({ title: "已删除", icon: "success" });
              } else {
                common_vendor.index.showToast({ title: result.msg || "删除失败", icon: "none" });
              }
            } catch (e) {
              common_vendor.index.__f__("error", "at pages/help/detail.vue:634", "删除回复失败", e);
            }
          }
        }
      });
    };
    const loadMoreReplies = async (comment2) => {
      try {
        const res = await utils_request.request.post("/comment/replies", { parentId: comment2.id, offset: 0, size: 20 });
        if (res.code === 0) {
          comment2.children = res.data || [];
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/help/detail.vue:646", "加载回复失败", e);
      }
    };
    const formatTime = (time) => {
      if (!time)
        return "";
      const date = new Date(time);
      const now = /* @__PURE__ */ new Date();
      const diff = now - date;
      if (diff < 6e4) {
        return "刚刚";
      }
      if (diff < 36e5) {
        return Math.floor(diff / 6e4) + "分钟前";
      }
      if (diff < 864e5) {
        return Math.floor(diff / 36e5) + "小时前";
      }
      if (diff < 6048e5) {
        return Math.floor(diff / 864e5) + "天前";
      }
      return date.getMonth() + 1 + "-" + date.getDate();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(helpInfo.value.status),
        b: common_vendor.n(statusClass.value),
        c: common_vendor.t(helpInfo.value.type === "求助" ? "求助" : "帮忙"),
        d: common_vendor.n(typeClass.value),
        e: common_vendor.t(helpInfo.value.title),
        f: helpInfo.value.avatar || "/static/default-avatar.png",
        g: common_vendor.t(helpInfo.value.nickname),
        h: common_vendor.t(formatTime(helpInfo.value.createTime)),
        i: common_vendor.t(helpInfo.value.description || "暂无详细描述"),
        j: helpInfo.value.images && helpInfo.value.images.length > 0
      }, helpInfo.value.images && helpInfo.value.images.length > 0 ? {
        k: common_vendor.f(helpInfo.value.images, (img, index, i0) => {
          return {
            a: index,
            b: img,
            c: common_vendor.o(($event) => previewImage(index), index)
          };
        })
      } : {}, {
        l: helpInfo.value.contact
      }, helpInfo.value.contact ? {
        m: common_vendor.p({
          type: "phone",
          size: "16",
          color: "#666"
        }),
        n: common_vendor.t(helpInfo.value.contact)
      } : {}, {
        o: common_vendor.t(commentCount.value),
        p: commentList.value.length === 0 && !commentLoading.value
      }, commentList.value.length === 0 && !commentLoading.value ? {
        q: common_assets._imports_0$4
      } : {}, {
        r: common_vendor.f(commentList.value, (commentItem, k0, i0) => {
          return common_vendor.e({
            a: commentItem.avatar || "/static/default-avatar.png",
            b: common_vendor.t(commentItem.nickname || "匿名用户"),
            c: common_vendor.t(commentItem.content),
            d: common_vendor.t(formatTime(commentItem.createTime)),
            e: "bf511981-1-" + i0,
            f: common_vendor.p({
              type: commentItem.isLiked ? "heart-filled" : "heart",
              color: commentItem.isLiked ? "#ff6b6b" : "#999",
              size: "16"
            }),
            g: common_vendor.t(commentItem.likeCount || 0),
            h: common_vendor.o(($event) => toggleCommentLike(commentItem), commentItem.id),
            i: commentItem.isLiked ? 1 : "",
            j: currentUserId.value && currentUserId.value === commentItem.createUser
          }, currentUserId.value && currentUserId.value === commentItem.createUser ? {
            k: "bf511981-2-" + i0,
            l: common_vendor.p({
              type: "trash",
              size: "14",
              color: "#ccc"
            }),
            m: common_vendor.o(($event) => deleteComment(commentItem), commentItem.id)
          } : {}, {
            n: common_vendor.o(($event) => showReplyInput(commentItem, "comment"), commentItem.id),
            o: commentItem.children && commentItem.children.length > 0
          }, commentItem.children && commentItem.children.length > 0 ? common_vendor.e({
            p: common_vendor.f(commentItem.children, (reply, k1, i1) => {
              return common_vendor.e({
                a: reply.avatar || "/static/default-avatar.png",
                b: common_vendor.t(reply.nickname || "匿名用户"),
                c: reply.replyId && reply.replyId !== commentItem.id && reply.replyIdNickname
              }, reply.replyId && reply.replyId !== commentItem.id && reply.replyIdNickname ? {
                d: common_vendor.t(reply.replyIdNickname)
              } : {}, {
                e: common_vendor.t(reply.content),
                f: common_vendor.t(formatTime(reply.createTime)),
                g: "bf511981-3-" + i0 + "-" + i1,
                h: common_vendor.p({
                  type: reply.isLiked ? "heart-filled" : "heart",
                  color: reply.isLiked ? "#ff6b6b" : "#999",
                  size: "16"
                }),
                i: common_vendor.t(reply.likeCount || 0),
                j: common_vendor.o(($event) => toggleReplyLike(commentItem, reply), reply.id),
                k: reply.isLiked ? 1 : "",
                l: currentUserId.value && currentUserId.value === reply.createUser
              }, currentUserId.value && currentUserId.value === reply.createUser ? {
                m: "bf511981-4-" + i0 + "-" + i1,
                n: common_vendor.p({
                  type: "trash",
                  size: "14",
                  color: "#ccc"
                }),
                o: common_vendor.o(($event) => deleteReply(commentItem, reply), reply.id)
              } : {}, {
                p: common_vendor.o(($event) => showReplyInput(commentItem, "reply", reply), reply.id),
                q: reply.id
              });
            }),
            q: commentItem.children && commentItem.children.length > 0 && (commentItem.commentCount || 0) > commentItem.children.length
          }, commentItem.children && commentItem.children.length > 0 && (commentItem.commentCount || 0) > commentItem.children.length ? {
            r: common_vendor.o(($event) => loadMoreReplies(commentItem), commentItem.id)
          } : {}) : {}, {
            s: commentItem.id
          });
        }),
        s: commentLoading.value
      }, commentLoading.value ? {
        t: common_vendor.p({
          status: "loading"
        })
      } : {}, {
        v: commentNoMore.value && commentList.value.length > 0
      }, commentNoMore.value && commentList.value.length > 0 ? {} : {}, {
        w: !showInputPopup.value && helpInfo.value.status !== "已结束"
      }, !showInputPopup.value && helpInfo.value.status !== "已结束" ? common_vendor.e({
        x: common_vendor.p({
          type: isLiked.value ? "heart-filled" : "heart",
          size: "20",
          color: isLiked.value ? "#ff6b6b" : "#666"
        }),
        y: common_vendor.t(helpInfo.value.likeCount || 0),
        z: common_vendor.o(handleLike, "26"),
        A: common_vendor.p({
          type: isCollected.value ? "star-filled" : "star",
          size: "20",
          color: isCollected.value ? "#ffc107" : "#666"
        }),
        B: common_vendor.o(handleCollect, "6a"),
        C: !showInputPopup.value
      }, !showInputPopup.value ? {
        D: common_vendor.o(($event) => showCommentPopup(), "4e")
      } : {}, {
        E: !showInputPopup.value && helpInfo.value.status !== "已结束"
      }, !showInputPopup.value && helpInfo.value.status !== "已结束" ? {
        F: common_vendor.o(handleContact, "8c")
      } : {}) : {}, {
        G: common_vendor.p({
          type: "close",
          size: "20",
          color: "#999"
        }),
        H: common_vendor.o(closeCommentPopup, "50"),
        I: comment.content,
        J: common_vendor.o(($event) => comment.content = $event.detail.value, "5c"),
        K: common_vendor.o(submitComment, "26"),
        L: !comment.content.trim() ? 1 : "",
        M: common_vendor.sr(commentPopup, "bf511981-8", {
          "k": "commentPopup"
        }),
        N: common_vendor.o(onCommentPopupChange, "2c"),
        O: common_vendor.p({
          type: "bottom",
          ["mask-click"]: false
        }),
        P: common_vendor.t(replyTargetName.value),
        Q: common_vendor.p({
          type: "close",
          size: "20",
          color: "#999"
        }),
        R: common_vendor.o(closeReplyPopup, "95"),
        S: `回复 ${replyTargetName.value}：`,
        T: replyInput.value,
        U: common_vendor.o(($event) => replyInput.value = $event.detail.value, "c6"),
        V: common_vendor.o(submitReply, "72"),
        W: !replyInput.value.trim() ? 1 : "",
        X: common_vendor.sr(replyPopup, "bf511981-10", {
          "k": "replyPopup"
        }),
        Y: common_vendor.o(onReplyPopupChange, "ed"),
        Z: common_vendor.p({
          type: "bottom",
          ["mask-click"]: false
        }),
        aa: common_vendor.t(helpInfo.value.contact || "暂未提供联系方式"),
        ab: common_vendor.o(copyContact, "67"),
        ac: common_vendor.o(closeContactPopup, "ae"),
        ad: common_vendor.sr(contactPopup, "bf511981-12", {
          "k": "contactPopup"
        }),
        ae: common_vendor.p({
          type: "center"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bf511981"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/help/detail.js.map
