package com.study.hz.util;

import java.net.URL;
import java.net.MalformedURLException;

public class UrlFileNameExtractor {

    /**
     * 从URL中提取文件名（包括扩展名）。
     *
     * @param urlString 完整的URL字符串
     * @return 文件名，如果URL无效或没有文件名则返回null
     */
    public static String getFileNameFromUrl(String urlString) {
        // 检查输入是否为空
        if (urlString == null || urlString.trim().isEmpty()) {
            return null;
        }

        try {
            // 解析URL
            URL url = new URL(urlString);
            String path = url.getPath(); // 获取路径部分（不包括查询参数和片段）

            // 从路径中提取文件名：最后一个斜杠后的部分
            int lastSlashIndex = path.lastIndexOf('/');
            String fileName;
            if (lastSlashIndex != -1) {
                fileName = path.substring(lastSlashIndex + 1);
            } else {
                fileName = path; // 如果没有斜杠，整个路径作为文件名
            }

            // 检查文件名是否为空（例如，路径以斜杠结尾）
            if (fileName.isEmpty()) {
                return null;
            }
            return fileName;
        } catch (MalformedURLException e) {
            System.err.println("无效的URL: " + urlString);
            return null;
        }
    }

}