package com.study.hz.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.study.hz.dto.HelpDto;
import com.study.hz.pojo.Help;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;


@Mapper
public interface HelpMapper extends BaseMapper<Help> {
    List<HelpDto> selectHelpList (@Param("offset") Integer offset,@Param("size") Integer size);
    HelpDto selectDetailById(@Param("id") Long id);
    int countByUserIdAndType(@Param("userId") Long userId, @Param("type") String type);
    int incrementCommentCount(@Param("id") Long id);
    int updateStatus(@Param("id") Long id, @Param("status") String status);
}
