package com.study.hz.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.study.hz.dto.CommentDto;
import com.study.hz.dto.PageDto;
import com.study.hz.pojo.Comment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CommentMapper extends BaseMapper<Comment> {
    List<CommentDto> selectCommentList(@Param("pageDto") PageDto pageDto);
    List<CommentDto> selectReplies(@Param("parentId") Long parentId, @Param("offset") int offset, @Param("size") int size);
    int deleteByParentId(@Param("parentId") Long parentId);
}
