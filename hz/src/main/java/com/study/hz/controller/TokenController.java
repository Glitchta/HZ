package com.study.hz.controller;

import com.study.hz.dto.TokenDto;
import com.study.hz.pojo.Result;
import com.study.hz.service.TokenService;
import com.study.hz.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/token")
public class TokenController {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * 刷新访问令牌
     */
    @PostMapping("/refresh")
    public Result refreshToken(@RequestBody TokenDto request) {
        return tokenService.refreshToken(request);
    }

    /**
     * 登出接口
     */
    @PostMapping("/logout")
    public Result logout(@RequestHeader("Authorization") String authHeader) {
        return tokenService.logout(authHeader);
    }
}
