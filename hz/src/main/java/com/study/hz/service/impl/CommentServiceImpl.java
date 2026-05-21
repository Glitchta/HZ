package com.study.hz.service.impl;

import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.study.hz.dto.CommentDto;
import com.study.hz.dto.PageDto;
import com.study.hz.mapper.*;
import com.study.hz.pojo.Comment;
import com.study.hz.pojo.Dynamic;
import com.study.hz.pojo.Help;
import com.study.hz.pojo.Hole;
import com.study.hz.pojo.Lost;
import com.study.hz.pojo.Result;
import com.study.hz.service.CommentService;
import com.study.hz.util.ThreadLocalUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentServiceImpl extends ServiceImpl<CommentMapper, Comment> implements CommentService {
    @Autowired
    private CommentMapper commentMapper;
    @Autowired
    private HelpMapper helpMapper;
    @Autowired
    private LostMapper lostMapper;
    @Autowired
    private HoleMapper holeMapper;
    @Autowired
    private DynamicMapper dynamicMapper;

    @Override
    public Result selectCommentList(PageDto pageDto) {
        List<CommentDto> comments = commentMapper.selectCommentList(pageDto);
        comments.forEach(comment -> {
            comment.setChildren(commentMapper.selectReplies(comment.getId(), 0, 999));
        });
        return Result.success(comments);
    }

    @Override
    public Result insertComment(Comment comment) {
        comment.setCreateUser(ThreadLocalUtil.getUserId());
        comment.setCreateTime(LocalDateTime.now());
        comment.setCommentCount(0);
        comment.setLikeCount(0);

        commentMapper.insert(comment);
        return Result.success();
    }

    @Override
    public Result getReplies(Long parentId, int offset, int size) {
        List<CommentDto> replies = commentMapper.selectReplies(parentId, offset, size);
        return Result.success(replies);
    }

    @Override
    public Result toggleLike(Long commentId, Boolean isLike) {
        Comment comment = commentMapper.selectById(commentId);
        if (comment == null) return Result.error("评论不存在");
        if (isLike) {
            comment.setLikeCount(comment.getLikeCount() + 1);
        } else {
            comment.setLikeCount(Math.max(0, comment.getLikeCount() - 1));
        }
        commentMapper.updateById(comment);
        return Result.success();
    }

    @Override
    public Result deleteComment(Long commentId, String contentType, Long userId) {
        Comment comment = commentMapper.selectById(commentId);
        if (comment == null) return Result.error("评论不存在");
        if (!comment.getCreateUser().equals(userId)) return Result.error("无权删除他人的评论");

        // 级联删除子回复
        commentMapper.deleteByParentId(commentId);
        // 删除评论本身
        commentMapper.deleteById(commentId);

        // 如果是顶级评论，减少内容表的评论数
        if (comment.getParentId() == null) {
            decrementCommentCount(comment.getContentId(), contentType);
        }

        return Result.success();
    }

    private void decrementCommentCount(Long contentId, String contentType) {
        String setSql = "comment_count = GREATEST(IFNULL(comment_count, 0) - 1, 0)";
        switch (contentType != null ? contentType : "") {
            case "help":
                helpMapper.update(new Help(), new UpdateWrapper<Help>().eq("id", contentId).setSql(setSql));
                break;
            case "lost":
                lostMapper.update(new Lost(), new UpdateWrapper<Lost>().eq("id", contentId).setSql(setSql));
                break;
            case "hole":
                holeMapper.update(new Hole(), new UpdateWrapper<Hole>().eq("id", contentId).setSql(setSql));
                break;
            case "alumni":
                dynamicMapper.update(new Dynamic(), new UpdateWrapper<Dynamic>().eq("id", contentId).setSql(setSql));
                break;
        }
    }
}
