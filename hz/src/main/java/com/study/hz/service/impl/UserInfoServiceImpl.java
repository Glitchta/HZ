package com.study.hz.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.study.hz.mapper.UserInfoMapper;
import com.study.hz.pojo.Result;
import com.study.hz.pojo.UserInfo;
import com.study.hz.service.UserInfoService;
import com.study.hz.util.ThreadLocalUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserInfoServiceImpl extends ServiceImpl<UserInfoMapper,UserInfo> implements UserInfoService {

    @Autowired
    UserInfoMapper userInfoMapper;

    @Override
    public Result getUserInfoById(Long id) {
        QueryWrapper<UserInfo> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", id);
        UserInfo userInfo = userInfoMapper.selectOne(queryWrapper);
        return Result.success(userInfo);
    }

    @Override
    public Result getUserInfo() {
        Long id = ThreadLocalUtil.getUserId();
        return Result.success(userInfoMapper.selectById(id));
    }

    @Override
    public Result updateUserInfo(UserInfo userInfo) {
        userInfo.setUserId(ThreadLocalUtil.getUserId());
        QueryWrapper<UserInfo> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userInfo.getUserId());
        userInfoMapper.update(userInfo,queryWrapper);
        return Result.success();
    }

    @Override
    public Result<UserInfo> updateNickname(UserInfo userInfoDto) {
        return null;
    }

    @Override
    public Result<UserInfo> updateAvatar(UserInfo userInfoDto) {
        return null;
    }

    @Override
    public Result<UserInfo> updateSign(UserInfo userInfoDto) {
        return null;
    }
}
