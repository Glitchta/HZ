"use strict";
const common_vendor = require("../common/vendor.js");
const utils_websocket = require("./websocket.js");
class Request {
  constructor(config = {}) {
    this.baseURL = config.baseURL || "";
    this.timeout = config.timeout || 1e4;
    this.interceptors = {
      request: [],
      response: []
    };
    this.isRefreshing = false;
    this.retryQueue = [];
  }
  // 新增：重试队列中的请求
  retryAllRequests() {
    this.retryQueue.forEach(({ resolve, reject, config }) => {
      this.request(config).then(resolve).catch(reject);
    });
    this.retryQueue = [];
  }
  // 新增：添加到重试队列
  addToRetryQueue(config) {
    return new Promise((resolve, reject) => {
      this.retryQueue.push({ resolve, reject, config });
    });
  }
  request(config) {
    let url = config.url;
    if (config.params) {
      const buildQueryString = (params) => {
        const parts = [];
        Object.keys(params).forEach((key) => {
          const value = params[key];
          if (value === void 0 || value === null) {
            return;
          }
          if (Array.isArray(value)) {
            value.forEach((item) => {
              if (item !== void 0 && item !== null) {
                parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(item)}`);
              }
            });
          } else if (typeof value === "object") {
            parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`);
          } else {
            parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
          }
        });
        return parts.join("&");
      };
      const queryString = buildQueryString(config.params);
      if (queryString) {
        url = url + (url.includes("?") ? "&" : "?") + queryString;
      }
    }
    common_vendor.index.__f__("log", "at utils/request.js:74", `[Request] ${config.method || "GET"} ${url}`, config.data || {});
    let finalConfig = { ...config, url };
    try {
      for (const interceptor of this.interceptors.request) {
        finalConfig = interceptor(finalConfig) || finalConfig;
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at utils/request.js:83", "[Request] 请求拦截器错误:", error);
      return Promise.reject(error);
    }
    return new Promise((resolve, reject) => {
      const requestTask = common_vendor.index.request({
        url: this.baseURL + finalConfig.url,
        method: finalConfig.method || "GET",
        data: finalConfig.data || {},
        header: {
          "Content-Type": "application/json",
          ...finalConfig.headers
        },
        timeout: finalConfig.timeout || this.timeout,
        success: async (response) => {
          common_vendor.index.__f__("log", "at utils/request.js:98", `[Request] 响应 ${response.statusCode} ${finalConfig.url}`);
          let finalResponse = response;
          try {
            for (const interceptor of this.interceptors.response) {
              const result = interceptor(finalResponse, finalConfig);
              if (result) {
                finalResponse = result instanceof Promise ? await result : result;
              }
            }
            if (finalResponse && finalResponse.statusCode >= 200 && finalResponse.statusCode < 300) {
              resolve(finalResponse.data);
            } else if (finalResponse && finalResponse.code !== void 0) {
              resolve(finalResponse);
            } else {
              const error = new Error(`HTTP ${finalResponse ? finalResponse.statusCode : "unknown"}`);
              error.statusCode = finalResponse ? finalResponse.statusCode : 0;
              error.data = finalResponse ? finalResponse.data : null;
              reject(error);
            }
          } catch (error) {
            common_vendor.index.__f__("error", "at utils/request.js:123", "[Request] 响应拦截器错误或业务错误:", error);
            reject(error);
          }
        },
        fail: (error) => {
          common_vendor.index.__f__("error", "at utils/request.js:128", "[Request] 请求失败:", error);
          reject(error);
        }
      });
      if (finalConfig.cancelToken) {
        finalConfig.cancelToken.promise.then((reason) => {
          requestTask.abort();
          reject(reason);
        });
      }
    });
  }
  get(url, config = {}) {
    return this.request({ ...config, url, method: "GET" });
  }
  post(url, data, config = {}) {
    return this.request({ ...config, url, data, method: "POST" });
  }
  put(url, data, config = {}) {
    return this.request({ ...config, url, data, method: "PUT" });
  }
  delete(url, data, config = {}) {
    return this.request({ ...config, url, data, method: "DELETE" });
  }
  // 新增 upload 方法
  upload(url, filePath, name = "file", formData = {}, config = {}) {
    return new Promise((resolve, reject) => {
      const token = common_vendor.index.getStorageSync("token");
      const uploadConfig = {
        url: this.baseURL + url,
        filePath,
        name,
        formData,
        header: {
          "Authorization": token ? `Bearer ${token}` : "",
          ...config.headers
        },
        success: (uploadRes) => {
          common_vendor.index.__f__("log", "at utils/request.js:176", `[Upload] 响应 ${uploadRes.statusCode} ${url}`);
          const response = {
            statusCode: uploadRes.statusCode,
            data: typeof uploadRes.data === "string" ? JSON.parse(uploadRes.data) : uploadRes.data,
            header: uploadRes.header,
            cookies: uploadRes.cookies
          };
          this._handleUploadResponse(response, { url, ...config }, resolve, reject);
        },
        fail: (error) => {
          common_vendor.index.__f__("error", "at utils/request.js:192", "[Upload] 上传失败:", error);
          reject(error);
        }
      };
      common_vendor.index.uploadFile(uploadConfig);
    });
  }
  // 处理上传响应
  _handleUploadResponse(response, config, resolve, reject) {
    try {
      let finalResponse = response;
      for (const interceptor of this.interceptors.response) {
        try {
          const result = interceptor(finalResponse, config);
          if (result) {
            finalResponse = result;
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at utils/request.js:216", "[Upload] 响应拦截器错误:", error);
          reject(error);
          return;
        }
      }
      if (finalResponse.statusCode >= 200 && finalResponse.statusCode < 300) {
        resolve(finalResponse.data);
      } else {
        const error = new Error(`HTTP ${finalResponse.statusCode}`);
        error.statusCode = finalResponse.statusCode;
        error.data = finalResponse.data;
        reject(error);
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at utils/request.js:232", "[Upload] 处理响应错误:", error);
      reject(error);
    }
  }
  // 添加拦截器
  useRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor);
  }
  useResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor);
  }
}
const baseURL = "http://localhost:8080";
const request = new Request({
  baseURL,
  timeout: 15e3
});
request.baseURL = baseURL;
request.useRequestInterceptor((config) => {
  const token = common_vendor.index.getStorageSync("token");
  if (token) {
    config.headers = {
      ...config.headers,
      "Authorization": `Bearer ${token}`
    };
  }
  return config;
});
request.useResponseInterceptor((response, config) => {
  const { statusCode, data } = response;
  common_vendor.index.__f__("log", "at utils/request.js:270", "[拦截器] 处理响应:", { statusCode, data });
  if (statusCode === 403) {
    if (!config.url.includes("/token/refresh")) {
      if (request.isRefreshing) {
        common_vendor.index.__f__("log", "at utils/request.js:278", "[拦截器] 正在刷新token，将请求加入队列:", config.url);
        return request.addToRetryQueue(config);
      }
      request.isRefreshing = true;
      const tokenDto = {
        refreshToken: common_vendor.index.getStorageSync("refreshToken"),
        accessToken: common_vendor.index.getStorageSync("token")
      };
      common_vendor.index.__f__("log", "at utils/request.js:291", "[拦截器] 开始刷新token", tokenDto);
      return request.post("/token/refresh", tokenDto).then((refreshRes) => {
        common_vendor.index.__f__("log", "at utils/request.js:296", "[拦截器] 刷新token成功:", refreshRes);
        if (refreshRes.data && refreshRes.data.accessToken) {
          common_vendor.index.setStorageSync("token", refreshRes.data.accessToken);
          if (refreshRes.data.refreshToken) {
            common_vendor.index.setStorageSync("refreshToken", refreshRes.data.refreshToken);
          }
          request.isRefreshing = false;
          if (utils_websocket.websocketManager) {
            utils_websocket.websocketManager.refreshConnection();
          }
          common_vendor.index.__f__("log", "at utils/request.js:314", "[拦截器] 重试原请求:", config.url);
          if (config.method) {
            return request.request(config);
          } else {
            const newToken = refreshRes.data.accessToken;
            return new Promise((resolve, reject) => {
              common_vendor.index.uploadFile({
                url: request.baseURL + config.url,
                filePath: config.filePath,
                name: config.name || "file",
                formData: config.formData || {},
                header: {
                  "Authorization": `Bearer ${newToken}`,
                  ...config.headers
                },
                success: (uploadRes) => {
                  const responseData = typeof uploadRes.data === "string" ? JSON.parse(uploadRes.data) : uploadRes.data;
                  resolve(responseData);
                },
                fail: reject
              });
            });
          }
        } else {
          throw new Error("刷新token失败：无有效token返回");
        }
      }).catch((refreshError) => {
        common_vendor.index.__f__("error", "at utils/request.js:348", "[拦截器] 刷新token失败:", refreshError);
        request.isRefreshing = false;
        common_vendor.index.removeStorageSync("token");
        common_vendor.index.removeStorageSync("refreshToken");
        common_vendor.index.showToast({
          title: "登录已过期，请重新登录",
          icon: "none"
        });
        setTimeout(() => {
          common_vendor.index.reLaunch({ url: "/pages/login/login" });
        }, 1500);
        throw refreshError;
      });
    } else {
      common_vendor.index.removeStorageSync("token");
      common_vendor.index.removeStorageSync("refreshToken");
      common_vendor.index.showToast({
        title: "登录已过期，请重新登录",
        icon: "none"
      });
      setTimeout(() => {
        common_vendor.index.reLaunch({ url: "/pages/login/login" });
      }, 1500);
      const error = new Error("登录已过期");
      error.code = 403;
      error.data = data;
      throw error;
    }
  }
  if (statusCode === 401) {
    common_vendor.index.showToast({
      title: "权限不足",
      icon: "none"
    });
    const error = new Error("权限不足");
    error.code = 401;
    error.data = data;
    throw error;
  }
  if (statusCode === 200 && data && typeof data.code !== "undefined") {
    const successCodes = [0];
    if (!successCodes.includes(data.code)) {
      common_vendor.index.showToast({
        title: data.msg || "操作失败，请重试",
        icon: "none"
      });
      const error = new Error(data.msg || `业务错误[${data.code}]`);
      error.code = data.code;
      error.data = data;
      error.isBusinessError = true;
      throw error;
    } else {
      if (config.url.includes("/user/login") || config.url.includes("/user/wxLogin")) {
        if (data.data && data.data.accessToken) {
          common_vendor.index.setStorageSync("token", data.data.accessToken);
          if (data.data.refreshToken) {
            common_vendor.index.setStorageSync("refreshToken", data.data.refreshToken);
          }
          common_vendor.index.__f__("log", "at utils/request.js:423", "[拦截器] 已存储token:", data.data.accessToken);
        }
      }
    }
  }
  if (statusCode < 200 || statusCode >= 300) {
    const error = new Error(`HTTP错误: ${statusCode}`);
    error.statusCode = statusCode;
    error.data = data;
    throw error;
  }
  return response;
});
exports.request = request;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
