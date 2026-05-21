package com.study.hz.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.study.hz.dto.PageDto;
import com.study.hz.pojo.Hole;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface HoleMapper extends BaseMapper<Hole> {
    List<Hole> getHoleList(@Param("offset") Integer offset, @Param("size") Integer size);
}
