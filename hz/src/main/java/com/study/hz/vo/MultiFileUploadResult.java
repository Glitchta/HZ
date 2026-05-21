package com.study.hz.vo;

import lombok.Data;

import java.util.List;

@Data
public class MultiFileUploadResult {
    private List<FileUploadResult> files;
    private int successCount;
    private int totalCount;
}