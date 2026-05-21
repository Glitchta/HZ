package com.study.hz.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.study.hz.pojo.UserInfo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserInfoMapper extends BaseMapper<UserInfo> {
    UserInfo selectById(@Param("id") Long id);
    int insert(@Param("userInfo")UserInfo userInfo);
    void updateUserInfo(@Param("userInfo") UserInfo userInfo);
}
