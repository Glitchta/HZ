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
    const lostDetail = common_vendor.ref({});
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
    const replyInput = common_vendor.ref("");
    const actionPopup = common_vendor.ref(null);
    const replyPopup = common_vendor.ref(null);
    const commentPopup = common_vendor.ref(null);
    const commentLoading = common_vendor.ref(false);
    const commentNoMore = common_vendor.ref(false);
    const lostId = common_vendor.ref("");
    const showInputPopup = common_vendor.ref(false);
    const replyData = common_vendor.reactive({
      contentId: "",
      parentId: "",
      // 父评论ID（一级评论的ID）
      content: "",
      replyId: ""
      // 回复的目标评论ID
    });
    const replyTargetName = common_vendor.ref("");
    const replyTargetComment = common_vendor.ref(null);
    const comment = common_vendor.reactive({
      contentId: "",
      parentId: "",
      content: "",
      replyId: ""
    });
    const page = common_vendor.ref({
      current: 1,
      size: 5,
      id: ""
    });
    const commentCount = common_vendor.computed(() => {
      let count = 0;
      commentList.value.forEach((item) => {
        count++;
        if (item.children) {
          count += item.children.length;
        }
      });
      return count;
    });
    const isCollected = common_vendor.ref(false);
    common_vendor.onLoad((options) => {
      lostId.value = options.id;
      if (lostId.value) {
        fetchlostDetail();
        fetchComments(true);
        checkCollectionStatus();
        checkLikeStatus();
      }
    });
    const checkCollectionStatus = async () => {
      try {
        const res = await utils_request.request.post("/collection/check", { contentId: String(lostId.value), contentType: "lost" });
        isCollected.value = res.data === true;
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/lost/detail.vue:352", "检查收藏失败", e);
      }
    };
    const checkLikeStatus = async () => {
      try {
        const res = await utils_request.request.post("/like/check", { contentId: String(lostId.value), contentType: "lost" });
        lostDetail.value.isLiked = res.data === true;
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/lost/detail.vue:359", "检查点赞失败", e);
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
          await utils_request.request.post("/collection/cancel", { contentId: lostId.value, contentType: "lost" });
          isCollected.value = false;
          common_vendor.index.showToast({ title: "已取消收藏" });
        } else {
          await utils_request.request.post("/collection/add", { contentId: lostId.value, contentType: "lost" });
          isCollected.value = true;
          common_vendor.index.showToast({ title: "收藏成功" });
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/lost/detail.vue:377", "收藏操作失败", e);
      }
    };
    const fetchlostDetail = async () => {
      try {
        const res = await utils_request.request.get("/lost/getById", {
          params: { id: lostId.value }
        });
        if (res.code === 0) {
          lostDetail.value = res.data;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/lost/detail.vue:390", "获取详情失败", error);
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
        page.value.id = lostId.value;
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
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/lost/detail.vue:411", "获取评论失败", error);
      } finally {
        commentLoading.value = false;
      }
    };
    const onCommentPopupChange = (e) => {
      showInputPopup.value = e.show;
    };
    const onReplyPopupChange = (e) => {
      showInputPopup.value = e.show;
    };
    const showCommentPopup = () => {
      comment.content = "";
      commentPopup.value.open();
      showInputPopup.value = true;
    };
    const closeCommentPopup = () => {
      commentPopup.value.close();
      comment.content = "";
      showInputPopup.value = false;
    };
    const showReplyInput = (comment2, type, reply = null) => {
      replyTargetComment.value = comment2;
      if (type === "comment") {
        replyTargetName.value = comment2.nickname || "匿名用户";
        replyData.parentId = comment2.id;
        replyData.replyId = comment2.id;
      } else if (type === "reply") {
        replyTargetName.value = reply.nickname || "匿名用户";
        replyData.parentId = comment2.id;
        replyData.replyId = reply.id;
      }
      replyInput.value = "";
      replyPopup.value.open();
      showInputPopup.value = true;
    };
    const closeReplyPopup = () => {
      replyPopup.value.close();
      replyInput.value = "";
      replyTargetName.value = "";
      replyData.parentId = "";
      replyData.replyId = "";
      replyTargetComment.value = null;
      showInputPopup.value = false;
    };
    const submitReply = async () => {
      if (!replyInput.value.trim()) {
        common_vendor.index.showToast({
          title: "请输入回复内容",
          icon: "none"
        });
        return;
      }
      try {
        const data = {
          contentId: lostId.value,
          parentId: replyData.parentId,
          content: replyInput.value,
          replyId: replyData.replyId
        };
        const res = await utils_request.request.post("/comment/insert", data);
        await utils_request.request.put("/lost/comment", null, { params: { id: lostId.value } });
        if (res.code === 0) {
          common_vendor.index.showToast({
            title: "回复成功",
            icon: "success"
          });
          fetchComments(true);
          closeReplyPopup();
        } else {
          common_vendor.index.showToast({
            title: res.msg || "回复失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/lost/detail.vue:513", "回复失败", error);
        common_vendor.index.showToast({
          title: "回复失败，请重试",
          icon: "none"
        });
      }
    };
    const submitComment = async () => {
      if (!comment.content.trim()) {
        common_vendor.index.showToast({
          title: "请输入评论内容",
          icon: "none"
        });
        return;
      }
      try {
        const data = {
          contentId: lostId.value,
          parentId: "",
          content: comment.content,
          replyId: ""
        };
        const res = await utils_request.request.post("/comment/insert", data);
        await utils_request.request.put("/lost/comment", null, { params: { id: lostId.value } });
        if (res.code === 0) {
          common_vendor.index.showToast({
            title: "评论成功",
            icon: "success"
          });
          fetchComments(true);
          closeCommentPopup();
        } else {
          common_vendor.index.showToast({
            title: res.msg || "评论失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/lost/detail.vue:560", "评论失败", error);
        common_vendor.index.showToast({
          title: "评论失败，请重试",
          icon: "none"
        });
      }
    };
    const toggleCommentLike = async (comment2) => {
      try {
        const res = await utils_request.request.post("/comment/like", {
          commentId: comment2.id,
          isLike: !comment2.isLiked
        });
        if (res.code === 0) {
          comment2.isLiked = !comment2.isLiked;
          comment2.likeCount = comment2.isLiked ? (comment2.likeCount || 0) + 1 : Math.max(0, (comment2.likeCount || 1) - 1);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/lost/detail.vue:583", "评论点赞失败", error);
      }
    };
    const toggleReplyLike = async (parentComment, reply) => {
      try {
        const res = await utils_request.request.post("/comment/like", {
          commentId: reply.id,
          isLike: !reply.isLiked
        });
        if (res.code === 0) {
          reply.isLiked = !reply.isLiked;
          reply.likeCount = reply.isLiked ? (reply.likeCount || 0) + 1 : Math.max(0, (reply.likeCount || 1) - 1);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/lost/detail.vue:602", "回复点赞失败", error);
      }
    };
    const deleteComment = (comment2) => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除这条评论吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              const result = await utils_request.request.post("/comment/delete", { commentId: comment2.id, contentType: "lost" });
              if (result.code === 0) {
                commentList.value = commentList.value.filter((c) => c.id !== comment2.id);
                commentCount.value--;
                common_vendor.index.showToast({ title: "已删除", icon: "success" });
              } else {
                common_vendor.index.showToast({ title: result.msg || "删除失败", icon: "none" });
              }
            } catch (e) {
              common_vendor.index.__f__("error", "at pages/lost/detail.vue:621", "删除评论失败", e);
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
              const result = await utils_request.request.post("/comment/delete", { commentId: reply.id, contentType: "lost" });
              if (result.code === 0) {
                parentComment.children = parentComment.children.filter((c) => c.id !== reply.id);
                commentCount.value--;
                common_vendor.index.showToast({ title: "已删除", icon: "success" });
              } else {
                common_vendor.index.showToast({ title: result.msg || "删除失败", icon: "none" });
              }
            } catch (e) {
              common_vendor.index.__f__("error", "at pages/lost/detail.vue:642", "删除回复失败", e);
            }
          }
        }
      });
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
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/lost/detail.vue:660", "加载回复失败", error);
      }
    };
    const previewImage = (index) => {
      common_vendor.index.previewImage({
        urls: lostDetail.value.images,
        current: index
      });
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
    const toggleLike = async () => {
      if (!common_vendor.index.getStorageSync("token")) {
        common_vendor.index.showModal({ title: "提示", content: "请先登录", success: (res) => {
          if (res.confirm)
            common_vendor.index.navigateTo({ url: "/pages/login/login" });
        } });
        return;
      }
      try {
        const liked = !lostDetail.value.isLiked;
        const res = await utils_request.request.post(liked ? "/like/add" : "/like/cancel", {
          contentId: lostId.value,
          contentType: "lost"
        });
        if (res.code === 0) {
          lostDetail.value.isLiked = liked;
          lostDetail.value.likeCount = liked ? (lostDetail.value.likeCount || 0) + 1 : Math.max(0, (lostDetail.value.likeCount || 1) - 1);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/lost/detail.vue:712", "点赞失败", error);
      }
    };
    const closeActionPopup = () => {
      actionPopup.value.close();
    };
    const shareHole = () => {
      closeActionPopup();
      common_vendor.index.showModal({
        title: "分享",
        content: "将树洞分享给好友",
        showCancel: false
      });
    };
    const reportHole = () => {
      closeActionPopup();
      common_vendor.index.showModal({
        title: "举报",
        content: "确定举报这条树洞吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showToast({
              title: "举报成功",
              icon: "success"
            });
          }
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: lostDetail.value.avatar || "/static/default-avatar.png",
        b: common_vendor.t(lostDetail.value.nickname),
        c: common_vendor.t(formatTime(lostDetail.value.createTime)),
        d: common_vendor.t(lostDetail.value.description),
        e: lostDetail.value.images && lostDetail.value.images.length > 0
      }, lostDetail.value.images && lostDetail.value.images.length > 0 ? {
        f: common_vendor.f(lostDetail.value.images, (img, index, i0) => {
          return {
            a: img,
            b: index,
            c: common_vendor.o(($event) => previewImage(index), index)
          };
        })
      } : {}, {
        g: lostDetail.value.tags && lostDetail.value.tags.length > 0
      }, lostDetail.value.tags && lostDetail.value.tags.length > 0 ? {
        h: common_vendor.f(lostDetail.value.tags, (tag, k0, i0) => {
          return {
            a: common_vendor.t(tag),
            b: tag
          };
        })
      } : {}, {
        i: common_vendor.p({
          type: lostDetail.value.isLiked ? "heart-filled" : "heart",
          color: lostDetail.value.isLiked ? "#ff6b6b" : "#999",
          size: "16"
        }),
        j: common_vendor.t(lostDetail.value.likeCount || 0),
        k: common_vendor.o(toggleLike, "9e"),
        l: common_vendor.p({
          type: isCollected.value ? "star-filled" : "star",
          color: isCollected.value ? "#ffc107" : "#999",
          size: "16"
        }),
        m: common_vendor.o(handleCollect, "25"),
        n: common_vendor.t(commentCount.value),
        o: common_vendor.f(commentList.value, (commentItem, k0, i0) => {
          return common_vendor.e({
            a: commentItem.avatar || "/static/default-avatar.png",
            b: common_vendor.t(commentItem.nickname || "匿名用户"),
            c: common_vendor.t(commentItem.content),
            d: common_vendor.t(formatTime(commentItem.createTime)),
            e: "95776fc4-2-" + i0,
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
            k: "95776fc4-3-" + i0,
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
                g: "95776fc4-4-" + i0 + "-" + i1,
                h: common_vendor.p({
                  type: reply.isLiked ? "heart-filled" : "heart",
                  color: reply.isLiked ? "#ff6b6b" : "#999",
                  size: "16"
                }),
                i: common_vendor.o(($event) => toggleReplyLike(commentItem, reply), reply.id),
                j: reply.isLiked ? 1 : "",
                k: common_vendor.t(reply.likeCount || 0),
                l: currentUserId.value && currentUserId.value === reply.createUser
              }, currentUserId.value && currentUserId.value === reply.createUser ? {
                m: "95776fc4-5-" + i0 + "-" + i1,
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
            q: commentItem.children && commentItem.children.length < commentItem.replyCount
          }, commentItem.children && commentItem.children.length < commentItem.replyCount ? {
            r: common_vendor.t(commentItem.replyCount),
            s: "95776fc4-6-" + i0,
            t: common_vendor.p({
              type: "arrowdown",
              size: "16",
              color: "#999"
            }),
            v: common_vendor.o(($event) => loadMoreReplies(commentItem), commentItem.id)
          } : {}) : {}, {
            w: commentItem.id
          });
        }),
        p: commentLoading.value
      }, commentLoading.value ? {
        q: common_vendor.p({
          status: "loading"
        })
      } : {}, {
        r: commentNoMore.value
      }, commentNoMore.value ? {} : {}, {
        s: commentList.value.length === 0 && !commentLoading.value
      }, commentList.value.length === 0 && !commentLoading.value ? {
        t: common_assets._imports_0$4
      } : {}, {
        v: common_vendor.t(replyTargetName.value),
        w: common_vendor.p({
          type: "close",
          size: "20",
          color: "#999"
        }),
        x: common_vendor.o(closeReplyPopup, "8f"),
        y: `回复 ${replyTargetName.value}：`,
        z: replyInput.value,
        A: common_vendor.o(($event) => replyInput.value = $event.detail.value, "4a"),
        B: common_vendor.o(submitReply, "92"),
        C: !replyInput.value.trim() ? 1 : "",
        D: common_vendor.sr(replyPopup, "95776fc4-8", {
          "k": "replyPopup"
        }),
        E: common_vendor.o(onReplyPopupChange, "d3"),
        F: common_vendor.p({
          type: "bottom",
          ["mask-click"]: false
        }),
        G: common_vendor.p({
          type: "close",
          size: "20",
          color: "#999"
        }),
        H: common_vendor.o(closeCommentPopup, "8f"),
        I: comment.content,
        J: common_vendor.o(($event) => comment.content = $event.detail.value, "6b"),
        K: common_vendor.o(submitComment, "70"),
        L: !comment.content.trim() ? 1 : "",
        M: common_vendor.sr(commentPopup, "95776fc4-10", {
          "k": "commentPopup"
        }),
        N: common_vendor.o(onCommentPopupChange, "17"),
        O: common_vendor.p({
          type: "bottom",
          ["mask-click"]: false
        }),
        P: !showInputPopup.value
      }, !showInputPopup.value ? {
        Q: common_vendor.p({
          type: "compose",
          size: "20",
          color: "#fff"
        }),
        R: common_vendor.o(showCommentPopup, "72")
      } : {}, {
        S: common_vendor.p({
          type: "share",
          size: "20",
          color: "#333"
        }),
        T: common_vendor.o(shareHole, "ed"),
        U: common_vendor.p({
          type: "flag",
          size: "20",
          color: "#333"
        }),
        V: common_vendor.o(reportHole, "52"),
        W: common_vendor.o(closeActionPopup, "25"),
        X: common_vendor.sr(actionPopup, "95776fc4-13", {
          "k": "actionPopup"
        }),
        Y: common_vendor.p({
          type: "bottom"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-95776fc4"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/lost/detail.js.map
