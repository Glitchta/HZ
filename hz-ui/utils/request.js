// 导入WebSocket管理器
import websocketManager from './websocket'

class Request {
  constructor(config = {}) {
    this.baseURL = config.baseURL || ''
    this.timeout = config.timeout || 10000
    this.interceptors = {
      request: [],
      response: []
    }
    
    // 新增：刷新令牌相关状态
    this.isRefreshing = false
    this.retryQueue = [] // 存储待重试的请求
  }

  // 新增：重试队列中的请求
  retryAllRequests() {
    this.retryQueue.forEach(({ resolve, reject, config }) => {
      this.request(config)
        .then(resolve)
        .catch(reject)
    })
    this.retryQueue = []
  }

  // 新增：添加到重试队列
  addToRetryQueue(config) {
    return new Promise((resolve, reject) => {
      this.retryQueue.push({ resolve, reject, config })
    })
  }

  request(config) {
    // 处理 params
    let url = config.url
    if (config.params) {
      const buildQueryString = (params) => {
        const parts = []
        
        Object.keys(params).forEach(key => {
          const value = params[key]
          if (value === undefined || value === null) {
            return
          }
          
          if (Array.isArray(value)) {
            // 数组处理
            value.forEach(item => {
              if (item !== undefined && item !== null) {
                parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(item)}`)
              }
            })
          } else if (typeof value === 'object') {
            // 对象处理
            parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`)
          } else {
            // 普通值
            parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          }
        })
        
        return parts.join('&')
      }
      
      const queryString = buildQueryString(config.params)
      if (queryString) {
        url = url + (url.includes('?') ? '&' : '?') + queryString
      }
    }
    
    // 添加请求日志
    console.log(`[Request] ${config.method || 'GET'} ${url}`, config.data || {})
    
    // 请求拦截
    let finalConfig = { ...config, url }  
    try {
      for (const interceptor of this.interceptors.request) {
        finalConfig = interceptor(finalConfig) || finalConfig
      }
    } catch (error) {
      console.error('[Request] 请求拦截器错误:', error)
      return Promise.reject(error)
    }

    return new Promise((resolve, reject) => {
      const requestTask = uni.request({
        url: this.baseURL + finalConfig.url,
        method: finalConfig.method || 'GET',
        data: finalConfig.data || {},
        header: {
          'Content-Type': 'application/json',
          ...finalConfig.headers
        },
        timeout: finalConfig.timeout || this.timeout,
        success: async (response) => {
          console.log(`[Request] 响应 ${response.statusCode} ${finalConfig.url}`)

          let finalResponse = response
          try {
            // 依次执行响应拦截器（支持异步拦截器）
            for (const interceptor of this.interceptors.response) {
              const result = interceptor(finalResponse, finalConfig)
              if (result) {
                finalResponse = result instanceof Promise ? await result : result
              }
            }

            // 如果拦截器返回了最终数据（如 token 刷新后重试成功），直接 resolve
            if (finalResponse && finalResponse.statusCode >= 200 && finalResponse.statusCode < 300) {
              resolve(finalResponse.data)
            } else if (finalResponse && finalResponse.code !== undefined) {
              // 拦截器可能直接返回了业务数据
              resolve(finalResponse)
            } else {
              const error = new Error(`HTTP ${finalResponse ? finalResponse.statusCode : 'unknown'}`)
              error.statusCode = finalResponse ? finalResponse.statusCode : 0
              error.data = finalResponse ? finalResponse.data : null
              reject(error)
            }
          } catch (error) {
            console.error('[Request] 响应拦截器错误或业务错误:', error)
            reject(error)
          }
        },
        fail: (error) => {
          console.error('[Request] 请求失败:', error)
          reject(error)
        }
      })

      // 如果需要取消请求
      if (finalConfig.cancelToken) {
        finalConfig.cancelToken.promise.then(reason => {
          requestTask.abort()
          reject(reason)
        })
      }
    })
  }

  get(url, config = {}) {
    return this.request({ ...config, url, method: 'GET' })
  }

  post(url, data, config = {}) {
    return this.request({ ...config, url, data, method: 'POST' })
  }

  put(url, data, config = {}) {
    return this.request({ ...config, url, data, method: 'PUT' })
  }

  delete(url,data, config = {}) {
    return this.request({ ...config, url, data,method: 'DELETE' })
  }
  
  // 新增 upload 方法
  upload(url, filePath, name = 'file', formData = {}, config = {}) {
    return new Promise((resolve, reject) => {
      // 获取当前 token
      const token = uni.getStorageSync('token')
      
      // 构造上传配置
      const uploadConfig = {
        url: this.baseURL + url,
        filePath: filePath,
        name: name,
        formData: formData,
        header: {
          'Authorization': token ? `Bearer ${token}` : '',
          ...config.headers
        },
        success: (uploadRes) => {
          console.log(`[Upload] 响应 ${uploadRes.statusCode} ${url}`)
          
          // 将 uni.uploadFile 的响应格式转换为与 request 一致的格式
          const response = {
            statusCode: uploadRes.statusCode,
            data: typeof uploadRes.data === 'string' ? 
                  JSON.parse(uploadRes.data) : 
                  uploadRes.data,
            header: uploadRes.header,
            cookies: uploadRes.cookies
          }
          
          // 处理响应（复用现有的响应拦截器逻辑）
          this._handleUploadResponse(response, { url, ...config }, resolve, reject)
        },
        fail: (error) => {
          console.error('[Upload] 上传失败:', error)
          reject(error)
        }
      }
      
      // 执行上传
      uni.uploadFile(uploadConfig)
    })
  }
  
  // 处理上传响应
  _handleUploadResponse(response, config, resolve, reject) {
    try {
      // 模拟 request 方法的响应处理流程
      let finalResponse = response
      
      // 执行响应拦截器
      for (const interceptor of this.interceptors.response) {
        try {
          const result = interceptor(finalResponse, config)
          if (result) {
            finalResponse = result
          }
        } catch (error) {
          console.error('[Upload] 响应拦截器错误:', error)
          reject(error)
          return
        }
      }
      
      // 检查状态码
      if (finalResponse.statusCode >= 200 && finalResponse.statusCode < 300) {
        resolve(finalResponse.data)
      } else {
        const error = new Error(`HTTP ${finalResponse.statusCode}`)
        error.statusCode = finalResponse.statusCode
        error.data = finalResponse.data
        reject(error)
      }
    } catch (error) {
      console.error('[Upload] 处理响应错误:', error)
      reject(error)
    }
  }

  // 添加拦截器
  useRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor)
  }

  useResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor)
  }
}
const baseURL= 'http://localhost:8080'

// 创建实例并配置
const request = new Request({
  baseURL,
  timeout: 15000
})
request.baseURL = baseURL
// 添加请求拦截器（如添加token）
request.useRequestInterceptor((config) => {
  const token = uni.getStorageSync('token')
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`
    }
  }
  return config
})

// 响应拦截器
request.useResponseInterceptor((response, config) => {
  const { statusCode, data } = response
  
  console.log('[拦截器] 处理响应:', { statusCode, data })
  
    // 处理HTTP层面的错误
    if (statusCode === 403) {
      // 不是刷新token接口，说明accessToken过期
      if (!config.url.includes('/token/refresh')) {
        // 如果正在刷新token，将当前请求加入重试队列
        if (request.isRefreshing) {
          console.log('[拦截器] 正在刷新token，将请求加入队列:', config.url)
          return request.addToRetryQueue(config)
        }
        
        // 标记开始刷新
        request.isRefreshing = true
        
        // 准备刷新token
        const tokenDto = {
          refreshToken: uni.getStorageSync('refreshToken'),
          accessToken: uni.getStorageSync('token')
        }
        
        console.log('[拦截器] 开始刷新token', tokenDto)
        
        // 刷新token请求
        return request.post('/token/refresh', tokenDto)
          .then(refreshRes => {
            console.log('[拦截器] 刷新token成功:', refreshRes)
            
            if (refreshRes.data && refreshRes.data.accessToken) {
              // 存储新的token
              uni.setStorageSync('token', refreshRes.data.accessToken)
              if (refreshRes.data.refreshToken) {
                uni.setStorageSync('refreshToken', refreshRes.data.refreshToken)
              }
              
              // 重置刷新状态
              request.isRefreshing = false
              
              // 重新连接WebSocket，确保WebSocket使用新的token
              if (websocketManager) {
                websocketManager.refreshConnection()
              }
              
              // 重试原请求
              console.log('[拦截器] 重试原请求:', config.url)
              
              // 判断是普通请求还是上传请求
              if (config.method) {
                // 普通请求
                return request.request(config)
              } else {
                // 上传请求，重新上传
                const newToken = refreshRes.data.accessToken
                return new Promise((resolve, reject) => {
                  uni.uploadFile({
                    url: request.baseURL + config.url,
                    filePath: config.filePath,
                    name: config.name || 'file',
                    formData: config.formData || {},
                    header: {
                      'Authorization': `Bearer ${newToken}`,
                      ...config.headers
                    },
                    success: (uploadRes) => {
                      const responseData = typeof uploadRes.data === 'string' ? 
                                         JSON.parse(uploadRes.data) : 
                                         uploadRes.data
                      resolve(responseData)
                    },
                    fail: reject
                  })
                })
              }
            } else {
              throw new Error('刷新token失败：无有效token返回')
            }
          })
          .catch(refreshError => {
            console.error('[拦截器] 刷新token失败:', refreshError)
            request.isRefreshing = false
            
            // 清空所有存储的token
            uni.removeStorageSync('token')
            uni.removeStorageSync('refreshToken')
            
            // 跳转到登录页
            uni.showToast({
              title: '登录已过期，请重新登录',
              icon: 'none'
            })
            setTimeout(() => {
              uni.reLaunch({ url: '/pages/login/login' })
            }, 1500)
            
            throw refreshError
          })
      } else {
        // 刷新token接口返回403，说明refreshToken也过期了
        uni.removeStorageSync('token')
        uni.removeStorageSync('refreshToken')
        uni.showToast({
          title: '登录已过期，请重新登录',
          icon: 'none'
        })
        setTimeout(() => {
          uni.reLaunch({ url: '/pages/login/login' })
        }, 1500)
        
        const error = new Error('登录已过期')
        error.code = 403
        error.data = data
        throw error
      }
    }
  
  if (statusCode === 401) {
    uni.showToast({
      title: '权限不足',
      icon: 'none'
    })
    const error = new Error('权限不足')
    error.code = 401
    error.data = data
    throw error
  }
  
  // HTTP成功但业务失败的场景
  if (statusCode === 200 && data && typeof data.code !== 'undefined') {
    const successCodes = [0] // 成功码为0
    
    if (!successCodes.includes(data.code)) {
      // 显示错误提示
      uni.showToast({
        title: data.msg || '操作失败，请重试',
        icon: 'none'
      })
      
      // 抛出业务错误
      const error = new Error(data.msg || `业务错误[${data.code}]`)
      error.code = data.code
      error.data = data
      error.isBusinessError = true
      throw error
    } else {
      // 业务成功，检查是否是登录接口，存储token
      if (config.url.includes('/user/login') || config.url.includes('/user/wxLogin')) {
        if (data.data && data.data.accessToken) {
          // 存储accessToken
          uni.setStorageSync('token', data.data.accessToken)
          // 如果有refreshToken也存储
          if (data.data.refreshToken) {
            uni.setStorageSync('refreshToken', data.data.refreshToken)
          }
          console.log('[拦截器] 已存储token:', data.data.accessToken)
        }
      }
    }
  }
  
  // 如果HTTP状态码不在200-299之间
  if (statusCode < 200 || statusCode >= 300) {
    const error = new Error(`HTTP错误: ${statusCode}`)
    error.statusCode = statusCode
    error.data = data
    throw error
  }
  
  return response
})

export default request