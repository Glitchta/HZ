package com.study.hz.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.study.hz.dto.PageDto;
import com.study.hz.pojo.Comment;
import com.study.hz.pojo.Result;

public interface CommentService extends IService<Comment> {
    Result selectCommentList(PageDto pageDto);
    Result insertComment(Comment comment);
    Result getReplies(Long parentId, int offset, int size);
    Result toggleLike(Long commentId, Boolean isLike);
    Result deleteComment(Long commentId, String contentType, Long userId);
}
