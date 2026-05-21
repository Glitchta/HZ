package com.study.hz.service.impl;

import com.study.hz.dto.TokenDto;
import com.study.hz.pojo.Result;
import com.study.hz.service.TokenService;
import com.study.hz.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;


@Service
public class TokenServiceImpl implements TokenService {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public Result refreshToken(@RequestBody TokenDto request) {
        String refreshToken = request.getRefreshToken();

        if (refreshToken == null || refreshToken.isEmpty()) {
            return Result.error("刷新令牌不能为空");
        }

        try {
            // 生成新的访问令牌
            String newAccessToken = this.refreshAccessToken(refreshToken);

            // 生成新的刷新令牌（令牌轮换，更安全）
            String newRefreshToken = this.rotateRefreshToken(refreshToken);
            TokenDto tokenDto = new TokenDto();
            tokenDto.setAccessToken(newAccessToken);
            tokenDto.setRefreshToken(newRefreshToken);

            return Result.success(tokenDto);

        } catch (Exception e) {
            return Result.error("令牌刷新失败: " + e.getMessage());
        }
    }

    public Result logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            Long userId = jwtUtil.extractUserId(token);

            if (userId != null) {
                // 撤销刷新令牌,从redis中删除刷新令牌
                jwtUtil.revokeRefreshToken(userId);
            }
        }

        return Result.success("登出成功");
    }

    /**
     * 刷新访问令牌
     */
    public String refreshAccessToken(String refreshToken) {
        if (!jwtUtil.validateRefreshToken(refreshToken)) {
            throw new RuntimeException("无效的刷新令牌");
        }

        Long userId = jwtUtil.extractUserId(refreshToken);
        if (userId == null) {
            throw new RuntimeException("令牌解析失败");
        }

        // 生成新的访问令牌
        return jwtUtil.generateAccessToken(userId);
    }

    /**
     * 旋转刷新令牌（生成新的刷新令牌，使旧的失效）
     */
    public String rotateRefreshToken(String oldRefreshToken) {
        if (!jwtUtil.validateRefreshToken(oldRefreshToken)) {
            throw new RuntimeException("无效的刷新令牌");
        }

        Long userId = jwtUtil.extractUserId(oldRefreshToken);
        if (userId == null) {
            throw new RuntimeException("令牌解析失败");
        }

        // 生成新的刷新令牌（会自动更新Redis）
        return jwtUtil.generateRefreshToken(userId);
    }

    /**
     * 检查刷新令牌是否存在
     */
    public boolean existsRefreshToken(Long userId) {
        String redisKey = "refresh_token:" + userId;
        return redisTemplate.hasKey(redisKey);
    }
}