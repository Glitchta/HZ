package com.study.hz.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.study.hz.pojo.Collection;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CollectionMapper extends BaseMapper<Collection> {

    List<Collection> selectByUserIdAndType(@Param("userId") Long userId,
                                           @Param("contentType") String contentType,
                                           @Param("offset") int offset,
                                           @Param("size") int size);

    int countByUserIdAndType(@Param("userId") Long userId,
                             @Param("contentType") String contentType);

    Collection selectByUserAndContent(@Param("userId") Long userId,
                                      @Param("contentId") Long contentId,
                                      @Param("contentType") String contentType);
}
