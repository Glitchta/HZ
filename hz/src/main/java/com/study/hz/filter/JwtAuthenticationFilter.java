package com.study.hz.filter;

import com.study.hz.service.UserService;
import com.study.hz.util.JwtUtil;
import com.study.hz.util.ThreadLocalUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserService userService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserService userService) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // 从请求头获取Authorization
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final Long userId;

        // 如果没有Bearer token，直接放行到下一个过滤器
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        //预检请求
        if (HttpMethod.OPTIONS.name().equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        // 提取JWT令牌
        jwt = authHeader.substring(7);
        userId = jwtUtil.extractUserId(jwt);
        //设置ThreadLocal
        ThreadLocalUtil.setUserId(userId);

        // 如果用户名不为空且当前SecurityContext中没有认证信息
        if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // 加载用户详情
            com.study.hz.pojo.User user = userService.selectById(userId);
            UserDetails userDetails = User.builder()
                    .username(user.getUsername())
                    .password(user.getPassword())
                    .authorities("ROLE_USER")
                    .build();
            // 验证令牌
            if (jwtUtil.validateToken(jwt)) {
                // 创建认证令牌并设置到SecurityContext中
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}
