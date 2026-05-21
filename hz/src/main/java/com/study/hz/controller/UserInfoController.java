package com.study.hz.controller;

import com.study.hz.pojo.Result;
import com.study.hz.pojo.UserInfo;
import com.study.hz.service.UserInfoService;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/userInfo")
public class UserInfoController {
    @Autowired
    private UserInfoService userInfoService;

    @GetMapping("/getById")
    public Result getById(@RequestParam("id") Long id) {
        return userInfoService.getUserInfoById(id);
    }

    @GetMapping("/get")
    public Result getUserInfo() {
        return userInfoService.getUserInfo();
    }
    @PutMapping("/update")
    public Result updateUserInfo(@RequestBody UserInfo userInfo) {
        return  userInfoService.updateUserInfo(userInfo);
    }
}
