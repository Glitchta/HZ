package com.study.hz.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.study.hz.pojo.Result;
import com.study.hz.pojo.UserInfo;


public interface UserInfoService extends IService<UserInfo> {
    Result getUserInfoById(Long id);

    Result getUserInfo();

    Result updateUserInfo(UserInfo userInfo);

    Result<UserInfo> updateNickname(UserInfo userInfo);

    Result<UserInfo> updateAvatar(UserInfo userInfo);

    Result<UserInfo> updateSign(UserInfo userInfo);
}
