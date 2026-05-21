package com.study.hz.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.study.hz.pojo.Like;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface LikeMapper extends BaseMapper<Like> {

    List<Like> selectByUserIdAndType(@Param("userId") Long userId,
                                     @Param("contentType") String contentType,
                                     @Param("offset") int offset,
                                     @Param("size") int size);

    int countByUserIdAndType(@Param("userId") Long userId,
                             @Param("contentType") String contentType);

    Like selectByUserAndContent(@Param("userId") Long userId,
                                @Param("contentId") Long contentId,
                                @Param("contentType") String contentType);
}
