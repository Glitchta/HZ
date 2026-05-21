package com.study.hz.util;


import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Slf4j
@Component
public class FileUploadUtil {

    // 配置文件上传的根目录
    private static final String UPLOAD_DIR = "D:\\develop\\code\\HZ\\upload";

    // 允许的文件类型
    private static final String[] ALLOWED_EXTENSIONS = {
            "jpg", "jpeg", "png", "gif", "bmp", "webp"
    };

    // 最大文件大小 (5MB)
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    /**
     * 上传单个文件
     * @param file MultipartFile对象
     * @return 文件名
     * @throws IOException
     */
    public String uploadFile(MultipartFile file) throws IOException {
        // 验证文件
        validateFile(file);

        // 生成唯一文件名
        String originalFilename = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFilename);
        String newFileName = generateUniqueFileName(fileExtension);


        // 构建保存路径
        String saveDir = UPLOAD_DIR + File.separator;
        File directory = new File(saveDir);
        if (!directory.exists()) {
            boolean created = directory.mkdirs();
            if (!created) {
                throw new IOException("无法创建目录: " + saveDir);
            }
        }

        // 保存文件
        Path filePath = Paths.get(saveDir, newFileName);
        Files.copy(file.getInputStream(), filePath);


        log.info("文件上传成功: {}", newFileName);

        return newFileName;
    }

    /**
     * 批量上传文件
     * @param files MultipartFile数组
     * @return 文件访问路径列表
     * @throws IOException
     */
    public List<String> uploadFiles(MultipartFile[] files) throws IOException {
        List<String> filePaths = new ArrayList<>();
        for (MultipartFile file : files) {
            try {
                String filePath = uploadFile(file);
                filePaths.add(filePath);
            } catch (IOException e) {
                log.error("文件上传失败: {}", file.getOriginalFilename(), e);
                throw new IOException("文件" + file.getOriginalFilename() + "上传失败: " + e.getMessage());
            }
        }
        return filePaths;
    }

    /**
     * 删除文件
     * @param filePath 文件路径
     * @return 是否删除成功
     */
    public boolean deleteFile(String filePath) {
        try {
            String fileName = UrlFileNameExtractor.getFileNameFromUrl(filePath);
            filePath = "D:\\develop\\code\\HZ\\upload\\" + fileName;
            System.out.println(filePath);
            File file = new File(filePath);
            if (file.exists() && file.isFile()) {
                return file.delete();
            }
            return false;
        } catch (Exception e) {
            log.error("删除文件失败: {}", filePath, e);
            return false;
        }
    }

    /**
     * 验证文件
     * @param file MultipartFile对象
     */
    private void validateFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IOException("文件不能为空");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IOException("文件大小不能超过5MB");
        }

        String originalFilename = file.getOriginalFilename();
        if (!StringUtils.hasText(originalFilename)) {
            throw new IOException("文件名不能为空");
        }

        String extension = getFileExtension(originalFilename);
        if (!isAllowedExtension(extension)) {
            throw new IOException("不支持的文件格式: " + extension);
        }
    }

    /**
     * 获取文件扩展名
     */
    private String getFileExtension(String filename) {
        if (!StringUtils.hasText(filename)) {
            return "";
        }
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex > 0 && dotIndex < filename.length() - 1) {
            return filename.substring(dotIndex + 1).toLowerCase();
        }
        return "";
    }

    /**
     * 检查是否允许的文件扩展名
     */
    private boolean isAllowedExtension(String extension) {
        for (String allowedExt : ALLOWED_EXTENSIONS) {
            if (allowedExt.equalsIgnoreCase(extension)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 生成唯一文件名
     */
    private String generateUniqueFileName(String extension) {
        String uuid = UUID.randomUUID().toString().replace("-", "");
        String timestamp = String.valueOf(System.currentTimeMillis());
        return uuid + "_" + timestamp + "." + extension;
    }

    /**
     * 获取文件完整路径
     */
    public String getFullPath(String relativePath) {
        return UPLOAD_DIR + File.separator + relativePath;
    }

    /**
     * 获取文件大小限制
     */
    public long getMaxFileSize() {
        return MAX_FILE_SIZE;
    }

    /**
     * 获取允许的文件扩展名
     */
    public String[] getAllowedExtensions() {
        return ALLOWED_EXTENSIONS.clone();
    }
}