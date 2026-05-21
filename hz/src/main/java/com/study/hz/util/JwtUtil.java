package com.study.hz.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.concurrent.TimeUnit;

@Component
public class JwtUtil {

    @Value("${jwt.secret:mySecretKey}")
    private String secret;

    @Value("${jwt.access-token-expiration:1800000}")  // 30分钟，单位：毫秒
    private Long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration:604800000}")  // 7天，单位：毫秒
    private Long refreshTokenExpiration;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    // 生成访问令牌
    public String generateAccessToken(Long userId) {
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("type", "ACCESS")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
                .signWith(getSigningKey())
                .compact();
    }

    // 生成刷新令牌
    public String generateRefreshToken(Long userId) {
        String refreshToken = Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("type", "REFRESH")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
                .signWith(getSigningKey())
                .compact();

        // 存储到 Redis，key 格式：refresh_token:{userId}
        String redisKey = "refresh_token:" + userId;
        redisTemplate.opsForValue().set(
                redisKey,
                refreshToken,
                refreshTokenExpiration,
                TimeUnit.MILLISECONDS
        );

        return refreshToken;
    }

    // 从令牌中提取用户id
    public Long extractUserId(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return Long.parseLong(claims.getSubject());
        } catch (Exception e) {
            return null;
        }
    }

    // 验证令牌（检查签名和过期时间）
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // 验证刷新令牌（同时检查Redis中是否存在）
    public boolean validateRefreshToken(String refreshToken) {
        try {
            // 1. 验证JWT签名和过期
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(refreshToken)
                    .getPayload();

            // 2. 检查令牌类型
            String tokenType = claims.get("type", String.class);
            if (!"REFRESH".equals(tokenType)) {
                return false;
            }

            // 3. 检查Redis中是否存在
            Long userId = Long.parseLong(claims.getSubject());
            String redisKey = "refresh_token:" + userId;
            String storedToken = (String) redisTemplate.opsForValue().get(redisKey);

            return refreshToken.equals(storedToken);

        } catch (Exception e) {
            return false;
        }
    }

    // 撤销刷新令牌（用户登出时调用）
    public void revokeRefreshToken(Long userId) {
        String redisKey = "refresh_token:" + userId;
        redisTemplate.delete(redisKey);
    }

    // 获取令牌类型
    public String getTokenType(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return claims.get("type", String.class);
        } catch (Exception e) {
            return null;
        }
    }

    // 获取签名密钥
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
}