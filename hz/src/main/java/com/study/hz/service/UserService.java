package com.study.hz.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.study.hz.dto.LoginDto;
import com.study.hz.pojo.Result;
import com.study.hz.pojo.User;

import com.study.hz.dto.WxLoginDto;

public interface UserService extends IService<User> {
    User selectByUsername(String username);

    Result<User> register(LoginDto loginDto);

    Result<User> login(LoginDto loginDto);

    Result<User> wxLogin(WxLoginDto wxLoginDto);

    User selectById(Long userId);
}
