package com.study.hz.mapper;

import com.study.hz.dto.MyPostDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SearchMapper {
    List<MyPostDto> search(@Param("keyword") String keyword,
                           @Param("typeList") List<String> typeList,
                           @Param("offset") int offset,
                           @Param("size") int size);
}
