package com.study.hz.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.study.hz.dto.DynamicDto;
import com.study.hz.pojo.Dynamic;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface DynamicMapper extends BaseMapper<Dynamic> {
    List<DynamicDto> selectDynamicList(@Param("offset") Integer offset, @Param("size") Integer size);
    DynamicDto selectDynamicById(@Param("id") Long id);
}
