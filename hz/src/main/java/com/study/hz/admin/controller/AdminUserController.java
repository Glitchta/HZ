package com.study.hz.admin.controller;

import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.study.hz.mapper.UserMapper;
import com.study.hz.pojo.Result;
import com.study.hz.pojo.User;
import com.study.hz.service.UserInfoService;
import com.study.hz.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/api")
public class AdminUserController {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private UserService userService;

    @Autowired
    private UserInfoService userInfoService;

    @GetMapping("/user/list")
    public Result getUserList(@RequestParam(name = "current", defaultValue = "1") int current,
                               @RequestParam(name = "size", defaultValue = "10") int size,
                               @RequestParam(name = "keyword", required = false) String keyword) {
        int offset = (current - 1) * size;
        return Result.success(userMapper.selectUserList(keyword, offset, size));
    }

    @GetMapping("/user/{id}")
    public Result getUserDetail(@PathVariable Long id) {
        User user = userService.selectById(id);
        if (user == null) {
            return Result.error("用户不存在");
        }
        return Result.success(userInfoService.getUserInfoById(id).getData());
    }

    @PutMapping("/user/{id}/status")
    public Result updateUserStatus(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        Integer status = body.get("status");
        if (status == null || (status != 0 && status != 1)) {
            return Result.error("status 必须为 0 或 1");
        }
        UpdateWrapper<User> wrapper = new UpdateWrapper<>();
        wrapper.eq("id", id).set("status", status);
        boolean updated = userService.update(wrapper);
        return updated ? Result.success() : Result.error("更新失败");
    }
}
