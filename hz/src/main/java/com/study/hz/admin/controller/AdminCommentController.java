package com.study.hz.admin.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.study.hz.pojo.Comment;
import com.study.hz.pojo.Result;
import com.study.hz.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/api")
public class AdminCommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/comment/list")
    public Result getCommentList(@RequestParam(name = "current", defaultValue = "1") int current,
                                  @RequestParam(name = "size", defaultValue = "10") int size,
                                  @RequestParam(name = "keyword", required = false) String keyword) {
        QueryWrapper<Comment> wrapper = new QueryWrapper<>();
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like("content", keyword);
        }
        wrapper.orderByDesc("create_time");
        Page<Comment> page = new Page<>(current, size);
        IPage<Comment> result = commentService.page(page, wrapper);
        return Result.success(result);
    }

    @DeleteMapping("/comment/{id}")
    public Result deleteComment(@PathVariable Long id) {
        // 1. 删除子回复
        QueryWrapper<Comment> childWrapper = new QueryWrapper<>();
        childWrapper.eq("parent_id", id);
        commentService.remove(childWrapper);

        // 2. 删除该评论
        boolean removed = commentService.removeById(id);
        return removed ? Result.success() : Result.error("删除失败");
    }
}
