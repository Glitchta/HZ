package com.study.hz.vo;

import lombok.Data;

@Data
public class FileUploadResult {
    private String fileName;
    private String filePath;
    private String url;
    private long size;
    private String contentType;
}
