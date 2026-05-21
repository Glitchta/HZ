package com.study.hz.controller;

import com.study.hz.pojo.Result;
import com.study.hz.util.FileUploadUtil;
import com.study.hz.vo.FileUploadResult;
import com.study.hz.vo.MultiFileUploadResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Slf4j
@RestController
@RequestMapping("/upload")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class FileUploadController {

    private final FileUploadUtil fileUploadUtil;

    @Value("${server.port:8080}")
    private String serverPort;

    @Value("${server.address:localhost}")
    private String serverAddress;

    @Value("${app.file-access-url-prefix:/upload/}")
    private String fileAccessUrlPrefix;

    /**
     * 上传单个文件
     */
    @PostMapping("/image")
    public Result<FileUploadResult> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // 上传文件
            String filePath = fileUploadUtil.uploadFile(file);

            // 构建返回结果
            FileUploadResult result = new FileUploadResult();
            result.setFileName(file.getOriginalFilename());
            result.setFilePath(filePath);
            result.setUrl(buildFileUrl(filePath));
            result.setSize(file.getSize());
            result.setContentType(file.getContentType());

            log.info("单文件上传成功: {}, URL: {}", result.getFileName(), result.getUrl());
            return Result.success(0, "文件上传成功", result);

        } catch (IOException e) {
            log.error("文件上传失败", e);
            return Result.error("上传失败: " + e.getMessage());
        } catch (Exception e) {
            log.error("文件上传异常", e);
            return Result.error("上传失败: " + e.getMessage());
        }
    }

    /**
     * 上传多个文件
     */
    @PostMapping("/images")
    public Result<MultiFileUploadResult> uploadImages(@RequestParam("files") MultipartFile[] files) {
        List<FileUploadResult> successFiles = new ArrayList<>();
        List<String> errorMessages = new ArrayList<>();

        for (MultipartFile file : files) {
            try {
                String filePath = fileUploadUtil.uploadFile(file);

                FileUploadResult result = new FileUploadResult();
                result.setFileName(file.getOriginalFilename());
                result.setFilePath(filePath);
                result.setUrl(buildFileUrl(filePath));
                result.setSize(file.getSize());
                result.setContentType(file.getContentType());

                successFiles.add(result);
                log.info("多文件上传成功: {}, URL: {}", result.getFileName(), result.getUrl());

            } catch (IOException e) {
                log.error("文件上传失败: {}", file.getOriginalFilename(), e);
                errorMessages.add(file.getOriginalFilename() + ": " + e.getMessage());
            }
        }

        if (successFiles.isEmpty()) {
            return Result.error("所有文件上传失败: " + String.join(", ", errorMessages));
        }

        MultiFileUploadResult uploadResult = new MultiFileUploadResult();
        uploadResult.setFiles(successFiles);
        uploadResult.setSuccessCount(successFiles.size());
        uploadResult.setTotalCount(files.length);

        if (!errorMessages.isEmpty()) {
            return Result.success(-1, "部分文件上传成功: " + String.join(", ", errorMessages), uploadResult);
        }

        return Result.success(0, "文件上传成功", uploadResult);
    }

    /**
     * 删除文件
     */
    @PostMapping("/delete")
    public Result<?> deleteImage(@RequestParam("filePath") String filePath) {
        try {
            boolean deleted = fileUploadUtil.deleteFile(filePath);
            if (deleted) {
                log.info("文件删除成功: {}", filePath);
                return Result.success(0, "文件删除成功", null);
            } else {
                return Result.error("文件不存在或删除失败");
            }
        } catch (Exception e) {
            log.error("文件删除失败: {}", filePath, e);
            return Result.error("文件删除失败: " + e.getMessage());
        }
    }

    /**
     * 获取上传配置
     */
    @GetMapping("/config")
    public Result<Object> getUploadConfig() {
        Map<String, Object> config = new HashMap<>();
        config.put("maxFileSize", fileUploadUtil.getMaxFileSize());
        config.put("allowedExtensions", fileUploadUtil.getAllowedExtensions());
        config.put("fileAccessUrlPrefix", fileAccessUrlPrefix);

        return Result.success(0, "success", config);
    }

    /**
     * 构建文件访问URL
     */
    private String buildFileUrl(String filePath) {
        // 处理路径分隔符
        String normalizedPath = filePath.replace("\\", "/");

        // 如果已经有前缀，直接返回
        if (fileAccessUrlPrefix != null && !fileAccessUrlPrefix.isEmpty()) {
            if (fileAccessUrlPrefix.endsWith("/") && normalizedPath.startsWith("/")) {
                return fileAccessUrlPrefix + normalizedPath.substring(1);
            } else if (!fileAccessUrlPrefix.endsWith("/") && !normalizedPath.startsWith("/")) {
                return fileAccessUrlPrefix + "/" + normalizedPath;
            } else {
                return fileAccessUrlPrefix + normalizedPath;
            }
        }

        // 默认URL格式
        return "http://" + serverAddress + ":" + serverPort + "/upload/" + normalizedPath;
    }
}
