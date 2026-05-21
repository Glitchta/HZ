package com.study.hz.filter;

import com.study.hz.util.ThreadLocalUtil;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class ThreadLocalCleanFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        try {
            chain.doFilter(request, response);
        } finally {
            // 在过滤器链执行完成后清理 ThreadLocal
            ThreadLocalUtil.setUserId(null);
        }
    }
}
