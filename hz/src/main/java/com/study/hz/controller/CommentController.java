package com.study.hz.controller;

import com.study.hz.dto.PageDto;
import com.study.hz.pojo.Comment;
import com.study.hz.pojo.Result;
import com.study.hz.service.CommentService;
import com.study.hz.util.ThreadLocalUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/comment")
public class CommentController {
    @Autowired
    private CommentService commentService;

    @PostMapping("/list")
    public Result selectCommentList (@RequestBody PageDto pageDto){
        return commentService.selectCommentList(pageDto);
    }

    @PostMapping("/insert")
    public Result insertComment (@RequestBody Comment comment){
        return commentService.insertComment(comment);
    }

    @PostMapping("/replies")
    public Result getReplies (@RequestBody Map<String, Object> params){
        Long parentId = Long.valueOf(params.get("parentId").toString());
        int offset = params.get("offset") != null ? (int) params.get("offset") : 0;
        int size = params.get("size") != null ? (int) params.get("size") : 10;
        return commentService.getReplies(parentId, offset, size);
    }

    @PostMapping("/like")
    public Result toggleLike (@RequestBody Map<String, Object> params){
        Long commentId = Long.valueOf(params.get("commentId").toString());
        Boolean isLike = (Boolean) params.get("isLike");
        return commentService.toggleLike(commentId, isLike);
    }

    @PostMapping("/delete")
    public Result deleteComment (@RequestBody Map<String, Object> params){
        Long commentId = Long.valueOf(params.get("commentId").toString());
        String contentType = params.get("contentType") != null ? params.get("contentType").toString() : "";
        Long userId = ThreadLocalUtil.getUserId();
        return commentService.deleteComment(commentId, contentType, userId);
    }
}
