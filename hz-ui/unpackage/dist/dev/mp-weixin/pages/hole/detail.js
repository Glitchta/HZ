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
    const holeDetail = common_vendor.ref({});
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
    const holeId = common_vendor.ref("");
    const showInputPopup = common_vendor.ref(false);
    const anonymousNameMap = common_vendor.ref({});
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
      holeId.value = options.id;
      if (holeId.value) {
        fetchHoleDetail();
        fetchComments(true);
        checkCollectionStatus();
        checkLikeStatus();
      }
    });
    const checkCollectionStatus = async () => {
      try {
        const res = await utils_request.request.post("/collection/check", { contentId: String(holeId.value), contentType: "hole" });
        isCollected.value = res.data === true;
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/hole/detail.vue:338", "检查收藏失败", e);
      }
    };
    const checkLikeStatus = async () => {
      try {
        const res = await utils_request.request.post("/like/check", { contentId: String(holeId.value), contentType: "hole" });
        holeDetail.value.isLiked = res.data === true;
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/hole/detail.vue:345", "检查点赞失败", e);
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
          await utils_request.request.post("/collection/cancel", { contentId: holeId.value, contentType: "hole" });
          isCollected.value = false;
          common_vendor.index.showToast({ title: "已取消收藏" });
        } else {
          await utils_request.request.post("/collection/add", { contentId: holeId.value, contentType: "hole" });
          isCollected.value = true;
          common_vendor.index.showToast({ title: "收藏成功" });
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/hole/detail.vue:363", "收藏操作失败", e);
      }
    };
    const getAnonymousName = (comment2) => {
      if (!comment2.createUser)
        return "匿名用户";
      if (!anonymousNameMap.value[comment2.createUser]) {
        const randomNum = Math.floor(Math.random() * 9e4) + 1e4;
        anonymousNameMap.value[comment2.createUser] = `匿名用户${randomNum}`;
      }
      return anonymousNameMap.value[comment2.createUser];
    };
    const fetchHoleDetail = async () => {
      try {
        const res = await utils_request.request.get("/hole/getById", {
          params: { id: holeId.value }
        });
        if (res.code === 0) {
          holeDetail.value = res.data;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/hole/detail.vue:390", "获取详情失败", error);
      }
    };
    const fetchComments = async (refresh = false) => {
      if (commentLoading.value)
        return;
      commentLoading.value = true;
      try {
        page.value.id = holeId.value;
        const res = await utils_request.request.post("/comment/list", page.value);
        if (res.code === 0) {
          const comments = res.data || [];
          comments.forEach((item) => {
            item.nickname = getAnonymousName(item);
            if (item.children && item.children.length > 0) {
              item.children.forEach((child) => {
                child.nickname = getAnonymousName(child);
                if (child.replyId) {
                  const targetComment = comments.find((c) => c.id === child.replyId);
                  if (targetComment) {
                    child.replyIdNickname = targetComment.nickname || getAnonymousName(targetComment);
                  } else {
                    for (const parent of comments) {
                      if (parent.children) {
                        const targetReply = parent.children.find((r) => r.id === child.replyId);
                        if (targetReply) {
                          child.replyIdNickname = targetReply.nickname || getAnonymousName(targetReply);
                          break;
                        }
                      }
                    }
                  }
                }
              });
            }
          });
          const commentMap = {};
          const rootComments = [];
          comments.forEach((item) => {
            if (!item.parentId) {
              commentMap[item.id] = {
                ...item,
                children: item.children || []
              };
              rootComments.push(commentMap[item.id]);
            }
          });
          comments.forEach((item) => {
            if (item.parentId && commentMap[item.parentId]) {
              commentMap[item.parentId].children.push(item);
            }
          });
          if (refresh) {
            commentList.value = rootComments;
          } else {
            commentList.value = [...commentList.value, ...rootComments];
          }
          if (comments.length < page.value.size) {
            commentNoMore.value = true;
          } else {
            page.value.current++;
          }
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/hole/detail.vue:473", "获取评论失败", error);
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
        replyTargetName.value = comment2.nickname || getAnonymousName(comment2);
        replyData.parentId = comment2.id;
        replyData.replyId = comment2.id;
      } else if (type === "reply") {
        replyTargetName.value = reply.nickname || getAnonymousName(reply);
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
          contentId: holeId.value,
          parentId: replyData.parentId,
          content: replyInput.value,
          replyId: replyData.replyId
        };
        const res = await utils_request.request.post("/comment/insert", data);
        await utils_request.request.put("/hole/comment", null, { params: { id: holeId.value } });
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
        common_vendor.index.__f__("error", "at pages/hole/detail.vue:575", "回复失败", error);
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
          contentId: holeId.value,
          parentId: "",
          content: comment.content,
          replyId: ""
        };
        const res = await utils_request.request.post("/comment/insert", data);
        await utils_request.request.put("/hole/comment", null, { params: { id: holeId.value } });
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
        common_vendor.index.__f__("error", "at pages/hole/detail.vue:622", "评论失败", error);
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
        common_vendor.index.__f__("error", "at pages/hole/detail.vue:645", "评论点赞失败", error);
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
        common_vendor.index.__f__("error", "at pages/hole/detail.vue:664", "回复点赞失败", error);
      }
    };
    const deleteComment = (comment2) => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除这条评论吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              const result = await utils_request.request.post("/comment/delete", { commentId: comment2.id, contentType: "hole" });
              if (result.code === 0) {
                commentList.value = commentList.value.filter((c) => c.id !== comment2.id);
                commentCount.value--;
                common_vendor.index.showToast({ title: "已删除", icon: "success" });
              } else {
                common_vendor.index.showToast({ title: result.msg || "删除失败", icon: "none" });
              }
            } catch (e) {
              common_vendor.index.__f__("error", "at pages/hole/detail.vue:683", "删除评论失败", e);
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
              const result = await utils_request.request.post("/comment/delete", { commentId: reply.id, contentType: "hole" });
              if (result.code === 0) {
                parentComment.children = parentComment.children.filter((c) => c.id !== reply.id);
                commentCount.value--;
                common_vendor.index.showToast({ title: "已删除", icon: "success" });
              } else {
                common_vendor.index.showToast({ title: result.msg || "删除失败", icon: "none" });
              }
            } catch (e) {
              common_vendor.index.__f__("error", "at pages/hole/detail.vue:704", "删除回复失败", e);
            }
          }
        }
      });
    };
    const loadMoreReplies = async (comment2) => {
      try {
        const res = await utils_request.request.get("/comment/replies", {
          params: {
            parentId: comment2.id,
            page: 1,
            size: 20
          }
        });
        if (res.code === 0) {
          const replies = res.data || [];
          replies.forEach((reply) => {
            reply.nickname = getAnonymousName(reply);
          });
          comment2.children = replies;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/hole/detail.vue:730", "加载回复失败", error);
      }
    };
    const previewImage = (index) => {
      common_vendor.index.previewImage({
        urls: holeDetail.value.images,
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
        const liked = !holeDetail.value.isLiked;
        const res = await utils_request.request.post(liked ? "/like/add" : "/like/cancel", {
          contentId: holeId.value,
          contentType: "hole"
        });
        if (res.code === 0) {
          holeDetail.value.isLiked = liked;
          holeDetail.value.likeCount = liked ? (holeDetail.value.likeCount || 0) + 1 : Math.max(0, (holeDetail.value.likeCount || 1) - 1);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/hole/detail.vue:782", "点赞失败", error);
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
        a: common_vendor.t(holeDetail.value.content),
        b: holeDetail.value.images && holeDetail.value.images.length > 0
      }, holeDetail.value.images && holeDetail.value.images.length > 0 ? {
        c: common_vendor.f(holeDetail.value.images, (img, index, i0) => {
          return {
            a: img,
            b: index,
            c: common_vendor.o(($event) => previewImage(index), index)
          };
        })
      } : {}, {
        d: holeDetail.value.tags && holeDetail.value.tags.length > 0
      }, holeDetail.value.tags && holeDetail.value.tags.length > 0 ? {
        e: common_vendor.f(holeDetail.value.tags, (tag, k0, i0) => {
          return {
            a: common_vendor.t(tag),
            b: tag
          };
        })
      } : {}, {
        f: common_vendor.t(formatTime(holeDetail.value.createTime)),
        g: common_vendor.p({
          type: holeDetail.value.isLiked ? "heart-filled" : "heart",
          color: holeDetail.value.isLiked ? "#ff6b6b" : "#999",
          size: "16"
        }),
        h: common_vendor.t(holeDetail.value.likeCount || 0),
        i: common_vendor.o(toggleLike, "fd"),
        j: common_vendor.p({
          type: isCollected.value ? "star-filled" : "star",
          color: isCollected.value ? "#ffc107" : "#999",
          size: "16"
        }),
        k: common_vendor.o(handleCollect, "d9"),
        l: common_vendor.t(commentCount.value),
        m: common_vendor.f(commentList.value, (commentItem, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(commentItem.nickname || getAnonymousName(commentItem)),
            b: common_vendor.t(commentItem.content),
            c: common_vendor.t(formatTime(commentItem.createTime)),
            d: "137f6e57-2-" + i0,
            e: common_vendor.p({
              type: commentItem.isLiked ? "heart-filled" : "heart",
              color: commentItem.isLiked ? "#ff6b6b" : "#999",
              size: "16"
            }),
            f: common_vendor.t(commentItem.likeCount || 0),
            g: common_vendor.o(($event) => toggleCommentLike(commentItem), commentItem.id),
            h: commentItem.isLiked ? 1 : "",
            i: currentUserId.value && currentUserId.value === commentItem.createUser
          }, currentUserId.value && currentUserId.value === commentItem.createUser ? {
            j: "137f6e57-3-" + i0,
            k: common_vendor.p({
              type: "trash",
              size: "14",
              color: "#ccc"
            }),
            l: common_vendor.o(($event) => deleteComment(commentItem), commentItem.id)
          } : {}, {
            m: common_vendor.o(($event) => showReplyInput(commentItem, "comment"), commentItem.id),
            n: commentItem.children && commentItem.children.length > 0
          }, commentItem.children && commentItem.children.length > 0 ? common_vendor.e({
            o: common_vendor.f(commentItem.children, (reply, k1, i1) => {
              return common_vendor.e({
                a: common_vendor.t(reply.nickname || getAnonymousName(reply)),
                b: reply.replyId && reply.replyId !== commentItem.id && reply.replyIdNickname
              }, reply.replyId && reply.replyId !== commentItem.id && reply.replyIdNickname ? {
                c: common_vendor.t(reply.replyIdNickname)
              } : {}, {
                d: common_vendor.t(reply.content),
                e: common_vendor.t(formatTime(reply.createTime)),
                f: "137f6e57-4-" + i0 + "-" + i1,
                g: common_vendor.p({
                  type: reply.isLiked ? "heart-filled" : "heart",
                  color: reply.isLiked ? "#ff6b6b" : "#999",
                  size: "16"
                }),
                h: common_vendor.t(reply.likeCount || 0),
                i: common_vendor.o(($event) => toggleReplyLike(commentItem, reply), reply.id),
                j: reply.isLiked ? 1 : "",
                k: currentUserId.value && currentUserId.value === reply.createUser
              }, currentUserId.value && currentUserId.value === reply.createUser ? {
                l: "137f6e57-5-" + i0 + "-" + i1,
                m: common_vendor.p({
                  type: "trash",
                  size: "14",
                  color: "#ccc"
                }),
                n: common_vendor.o(($event) => deleteReply(commentItem, reply), reply.id)
              } : {}, {
                o: common_vendor.o(($event) => showReplyInput(commentItem, "reply", reply), reply.id),
                p: reply.id
              });
            }),
            p: commentItem.children && commentItem.children.length < commentItem.replyCount
          }, commentItem.children && commentItem.children.length < commentItem.replyCount ? {
            q: common_vendor.t(commentItem.replyCount),
            r: "137f6e57-6-" + i0,
            s: common_vendor.p({
              type: "arrowdown",
              size: "16",
              color: "#999"
            }),
            t: common_vendor.o(($event) => loadMoreReplies(commentItem), commentItem.id)
          } : {}) : {}, {
            v: commentItem.id
          });
        }),
        n: commentLoading.value
      }, commentLoading.value ? {
        o: common_vendor.p({
          status: "loading"
        })
      } : {}, {
        p: commentNoMore.value
      }, commentNoMore.value ? {} : {}, {
        q: commentList.value.length === 0 && !commentLoading.value
      }, commentList.value.length === 0 && !commentLoading.value ? {
        r: common_assets._imports_0$4
      } : {}, {
        s: common_vendor.t(replyTargetName.value),
        t: common_vendor.p({
          type: "close",
          size: "20",
          color: "#999"
        }),
        v: common_vendor.o(closeReplyPopup, "91"),
        w: `回复 ${replyTargetName.value}：`,
        x: replyInput.value,
        y: common_vendor.o(($event) => replyInput.value = $event.detail.value, "b9"),
        z: common_vendor.o(submitReply, "67"),
        A: !replyInput.value.trim() ? 1 : "",
        B: common_vendor.sr(replyPopup, "137f6e57-8", {
          "k": "replyPopup"
        }),
        C: common_vendor.o(onReplyPopupChange, "6f"),
        D: common_vendor.p({
          type: "bottom",
          ["mask-click"]: false
        }),
        E: common_vendor.p({
          type: "close",
          size: "20",
          color: "#999"
        }),
        F: common_vendor.o(closeCommentPopup, "16"),
        G: comment.content,
        H: common_vendor.o(($event) => comment.content = $event.detail.value, "88"),
        I: common_vendor.o(submitComment, "3e"),
        J: !comment.content.trim() ? 1 : "",
        K: common_vendor.sr(commentPopup, "137f6e57-10", {
          "k": "commentPopup"
        }),
        L: common_vendor.o(onCommentPopupChange, "fd"),
        M: common_vendor.p({
          type: "bottom",
          ["mask-click"]: false
        }),
        N: !showInputPopup.value
      }, !showInputPopup.value ? {
        O: common_vendor.p({
          type: "compose",
          size: "20",
          color: "#fff"
        }),
        P: common_vendor.o(showCommentPopup, "ef")
      } : {}, {
        Q: common_vendor.p({
          type: "share",
          size: "20",
          color: "#333"
        }),
        R: common_vendor.o(shareHole, "82"),
        S: common_vendor.p({
          type: "flag",
          size: "20",
          color: "#333"
        }),
        T: common_vendor.o(reportHole, "b9"),
        U: common_vendor.o(closeActionPopup, "7a"),
        V: common_vendor.sr(actionPopup, "137f6e57-13", {
          "k": "actionPopup"
        }),
        W: common_vendor.p({
          type: "bottom"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-137f6e57"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/hole/detail.js.map
