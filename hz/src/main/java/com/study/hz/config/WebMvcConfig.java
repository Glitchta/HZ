package com.study.hz.config;


import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Slf4j
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${app.upload-dir:uploads}")
    private String uploadDir;

    /**
     * 配置静态资源映射
     * 这样可以通过 /uploads/** 访问上传的文件
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 将 /uploads/** 映射到文件系统的 uploads 目录
        registry.addResourceHandler("/upload/**")
                .addResourceLocations("file:" + uploadDir + "/")
                .setCachePeriod(3600); // 缓存1小时

        log.info("配置静态资源映射: /upload/** -> file:{}", uploadDir);
    }
}
