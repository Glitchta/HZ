package com.study.hz.mapper;

import com.study.hz.dto.MyPostDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MyPostMapper {

    List<MyPostDto> selectAllByUserId(@Param("userId") Long userId,
                                      @Param("offset") int offset,
                                      @Param("size") int size);

    List<MyPostDto> selectHelpByUserId(@Param("userId") Long userId,
                                       @Param("offset") int offset,
                                       @Param("size") int size);

    List<MyPostDto> selectHelpedByUserId(@Param("userId") Long userId,
                                         @Param("offset") int offset,
                                         @Param("size") int size);

    List<MyPostDto> selectLostByUserId(@Param("userId") Long userId,
                                       @Param("offset") int offset,
                                       @Param("size") int size);

    List<MyPostDto> selectHoleByUserId(@Param("userId") Long userId,
                                       @Param("offset") int offset,
                                       @Param("size") int size);

    List<MyPostDto> selectAlumniByUserId(@Param("userId") Long userId,
                                         @Param("offset") int offset,
                                         @Param("size") int size);
}
