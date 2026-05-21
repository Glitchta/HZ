package com.study.hz.config;

import com.study.hz.filter.JwtAuthenticationFilter;
import com.study.hz.filter.ThreadLocalCleanFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.CorsFilter;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationTokenFilter;
    private final ThreadLocalCleanFilter threadLocalCleanFilter;

    @Autowired
    private CorsFilter corsFilter; // 注入全局CorsFilter

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationTokenFilter, ThreadLocalCleanFilter threadLocalCleanFilter) {
        this.jwtAuthenticationTokenFilter = jwtAuthenticationTokenFilter;
        this.threadLocalCleanFilter = threadLocalCleanFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. 在认证过滤器前添加 CORS 过滤器
                .addFilterBefore(corsFilter, UsernamePasswordAuthenticationFilter.class)
                // 2. 关闭 CSRF（因为使用 JWT 无状态，且前后端分离）
                .csrf(AbstractHttpConfigurer::disable)
                // 3. 基于Token，不需要Session
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 公开接口（登录、注册等）不需要认证
                        .requestMatchers("/user/login", "/user/register", "/user/wxLogin", "/token/refresh").permitAll()
                        .requestMatchers("/upload/**").permitAll()
                        // WebSocket路径不需要认证
                        .requestMatchers("/ws/chat").permitAll()
                        // 管理端静态资源公开，API 需要 ADMIN 角色
                        .requestMatchers("/admin/api/**").hasRole("ADMIN")
                        .requestMatchers("/admin/**").permitAll()
                        // 其他所有接口都需要认证
                        .anyRequest().authenticated()
                )
                // 4. 添加JWT认证过滤器
                .addFilterBefore(jwtAuthenticationTokenFilter, UsernamePasswordAuthenticationFilter.class)
                // 5. 添加threadLocal过滤器
                .addFilterAfter(threadLocalCleanFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

}