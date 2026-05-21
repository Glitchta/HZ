package com.study.hz.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.study.hz.pojo.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserMapper extends BaseMapper<User> {
    void updateNicknameById(User user);
    User selectByUsername(String username);
    User selectByOpenid(String openid);
    List<com.study.hz.admin.dto.AdminUserVo> selectUserList(@Param("keyword") String keyword, @Param("offset") int offset, @Param("size") int size);
}
