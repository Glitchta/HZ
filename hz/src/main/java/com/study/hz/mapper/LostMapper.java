package com.study.hz.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.study.hz.dto.LostDto;
import com.study.hz.pojo.Lost;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface LostMapper extends BaseMapper<Lost> {
    List<LostDto> selectLostList (@Param("offset") Integer offset, @Param("size") Integer size);
    LostDto selectLostById (@Param("id") Long id);
}
