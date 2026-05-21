package com.study.hz.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import java.util.Collections;

@Configuration
public class GlobalCorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        // 1. 创建 CORS 配置对象
        CorsConfiguration config = new CorsConfiguration();
        // 允许的域，不要写 *，否则携带凭证(cookie, token)时会失败。请替换为你的uniapp前端实际地址
        config.setAllowedOriginPatterns(Collections.singletonList("*")); // 或明确指定，如 "http://localhost:8080", "http://192.168.x.x:8080"
        // 允许发送凭证（如 Cookie, JWT Token）。如果前端需要传Token，此项必须为true
        config.setAllowCredentials(true);
        // 允许的请求方法
        config.addAllowedMethod("*"); // 或明确指定：GET, POST, PUT, DELETE, OPTIONS
        // 允许的请求头
        config.addAllowedHeader("*");
        // 暴露的响应头（让前端能获取到的头）
        config.addExposedHeader("Authorization"); // 如果JWT放在响应头中返回，可能需要暴露
        config.addExposedHeader("Content-Disposition"); // 示例：暴露文件下载相关的头
        // 预检请求的有效期，单位秒。在此期间，不用再次发送预检请求。
        config.setMaxAge(3600L);

        // 2. 为所有接口路径添加此配置
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        // 3. 返回 CorsFilter
        return new CorsFilter(source);
    }
}