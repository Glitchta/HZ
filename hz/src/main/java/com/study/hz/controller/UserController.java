package com.study.hz.controller;

import com.study.hz.dto.LoginDto;
import com.study.hz.dto.WxLoginDto;
import com.study.hz.pojo.Result;
import com.study.hz.pojo.User;
import com.study.hz.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public Result<User> register(@RequestBody LoginDto loginDto) {
        return userService.register(loginDto);
    }

    @PostMapping("/login")
    public Result<User> login(@RequestBody LoginDto loginDto) {
        return userService.login(loginDto);
    }

    @PostMapping("/wxLogin")
    public Result<User> wxLogin(@RequestBody WxLoginDto wxLoginDto) {
        return userService.wxLogin(wxLoginDto);
    }

    @GetMapping("/selectById")
    public Result<User> selectByID(@RequestParam("id") long id) {
    return  Result.success(userService.getById(id));
}

}
