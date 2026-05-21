package com.study.hz.util;

/**
 * ThreadLocal 工具类
 * 用于存储和获取当前线程的用户ID
 */
public class ThreadLocalUtil {

    private ThreadLocalUtil() {
        // 私有构造，防止实例化
    }

    /**
     * ThreadLocal 容器
     */
    private static final ThreadLocal<Long> USER_ID_CONTEXT = new ThreadLocal<>();

    /**
     * 设置当前线程的用户ID
     *
     * @param userId 用户ID
     */
    public static void setUserId(Long userId) {
        USER_ID_CONTEXT.set(userId);
    }

    /**
     * 获取当前线程的用户ID
     *
     * @return 用户ID
     */
    public static Long getUserId() {
        return USER_ID_CONTEXT.get();
    }
}