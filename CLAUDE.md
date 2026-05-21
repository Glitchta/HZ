# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在本仓库中工作时提供指导。

## 项目概述

校园互助小程序 — uni-app Vue 3 前端 + Spring Boot 3.5.11 后端。目标平台为微信小程序。功能包括：校园互助（求助/提供帮助）、匿名树洞、失物招领、校友圈动态、实时聊天（WebSocket）、用户中心、点赞、收藏、全文搜索。

## 仓库结构

```
hz/         — Spring Boot 后端（Maven，Java 8 编译目标，基础包 `com.study.hz`）
hz-ui/      — uni-app 前端（Vue 3，微信小程序）
upload/     — 文件上传存储目录
```

## 后端（`hz/`）

### 构建与运行

```bash
cd hz && mvn compile      # 仅编译
mvn spring-boot:run       # 运行（需要 MySQL + Redis）
```

### 技术栈

- **Spring Boot 3.5.11** + Spring Security + Spring WebSocket
- **MyBatis Plus 3.5.11** — BaseMapper + `src/main/resources/mapper/` 中的自定义 XML mapper
- **MySQL** — 数据库 `hz`，`localhost:3306`，用户 `root` / `123456`
- **Redis** — `localhost:6379`，用于 refresh token 存储和 Redisson
- **JWT** — jjwt 0.12.3，access token 30 分钟，refresh token 7 天（存储在 Redis）。密钥在 `application.yml` 中
- **密码加密** — 通过 BouncyCastle 使用 Argon2

### 关键架构决策

- **认证流程**：JWT 过滤器（`JwtAuthenticationFilter`）从 `Authorization: Bearer <token>` 中提取 token，验证，加载用户，设置 Spring Security 上下文和 `ThreadLocalUtil` 用户 ID。`ThreadLocalCleanFilter` 在每次请求后清理。
- **公开端点**（无需认证）：`/user/login`、`/user/register`、`/token/refresh`、`/upload/**`、`/ws/chat`。其他所有请求均需认证。
- **API 响应格式**：`Result<T>` 包装器 — 成功时 `{code: 0, msg: "操作成功", data: ...}`，错误时 `code: -1`。Controller 方法使用原始 `Result` 类型（非 `Result<T>`）。前端判断 `res.code === 0`，**不是** `res.code === 200`。
- **Service 层**：接口在 `service/`，实现在 `service/impl/`。Service 继承 `ServiceImpl<Mapper, Entity>` 以使用 MyBatis Plus CRUD。
- **DTO**：与实体分离。Mapper 有返回 DTO 的自定义方法（例如 `HelpMapper.selectById` 返回 `HelpDto`，而非 `Help`）。
- **跨表查询**：在 Mapper XML 中使用 `<foreach collection="typeList" item="t" separator=" UNION ALL ">` 跨内容表聚合查询（MyPostMapper、SearchMapper、LikeMapper、CollectionMapper 均使用此模式）。
- **Mapper XML**：位于 `src/main/resources/mapper/`。模式：mapper 继承 `BaseMapper<Entity>`，并在 XML 中用 `<select>` 标签声明额外的自定义查询方法。
- **ThreadLocalUtil.getUserId()** — 在 service 层任意位置使用此方法获取当前认证用户 ID。不要从 controller 向 service 传递用户 ID。
- **无全局异常处理器**：项目没有 `@ControllerAdvice` 全局异常处理。错误在各处通过 `try-catch` 捕获，手动返回 `Result` 错误响应，或直接抛出 `RuntimeException`。
- **WebSocket**：`WebSocketHandler` 继承 `TextWebSocketHandler`，使用 `ConcurrentHashMap<String, WebSocketSession>` 管理用户会话。支持的消息类型：`auth`、`chat_message`、`typing`、`read_receipt`。端点 `/ws/chat` 在 SecurityConfig 中为公开路径。
- **图片存储**：实体（Dynamic、Help、Lost 等）中 `images` 字段为 JSON 数组字符串（如 `["url1","url2"]`）。`ImagesDeserializer` 工具类处理 JSON 反序列化。实体使用 `@TableName(autoResultMap = true)` 配合 XML mapper 中的 `<resultMap>` 进行映射。

### Java 8 兼容性

项目以 Java 8 target 编译。**不要使用** `List.of()`、`Map.of()`、`var` 或其他 Java 9+ API。用 `Arrays.asList()` 代替 `List.of()`。

### 数据库

- 表：`user`、`user_info`、`help`、`hole`、`lost`、`dynamic`、`comment`、`message`、`collection`、`likes`
- `comment` 表有外键 `content_id` 关联全部 4 张内容表（help、hole、lost、dynamic）。如果 `content_id` 在被引用表中不存在，INSERT 会失败 — 不允许跨表评论引用。
- 实体 ID 使用 `ASSIGN_ID` 策略（雪花算法）

### 点赞系统

与收藏系统并行设计。实体：`Like`（id、userId、contentId、contentType、createTime）。表：`likes`。

端点（前缀 `/like`）：
- `POST /like/add` — 参数 `{contentId, contentType: 'help'|'lost'|'hole'|'alumni'}` — 增加内容表的 likeCount
- `POST /like/cancel` — 相同参数 — 减少 likeCount
- `POST /like/check` — 相同参数 — 返回 `{liked: true/false}`
- `POST /like/list` — 参数 `{current, size, contentType}` — 返回分页点赞列表

前端：所有 4 个详情页统一使用 `/like/add` 和 `/like/cancel`（不使用各实体专用端点）。

### 评论系统

二级嵌套评论（父评论 + 回复）。表：`comment`，含 `parent_id` 字段（顶级评论为 NULL）。

后端端点：
- `POST /comment/insert` — 添加顶级评论，参数 `{contentId, contentType, content}`
- `POST /comment/replies` — 获取某条父评论的回复，参数 `{parentId, current, size}`
- `POST /comment/like` — 切换点赞，参数 `{commentId}` — 增加/减少 Comment 实体的 `likeCount`
- `PUT /help/comment` — 增加 help 表的 `comment_count`（help 表无自动增加触发器）
- `PUT /lost/comment` — 增加 lost 表的 comment_count
- `PUT /dynamic/comment` — 增加 dynamic 表的 comment_count
- 树洞使用自己的 `/hole/comment` 端点添加评论（comment count 由 hole service 处理）

CommentDTO 包含 `nickname` 和 `avatar` 字段，通过 LEFT JOIN `user_info` 填充。仅树洞（`hole` 类型）显示匿名名称；其他所有页面显示真实昵称。

所有 4 个详情页的前端评论模式：
- `fetchComments()` 分页加载顶级评论
- `loadMoreReplies(item)` 通过 POST /comment/replies 加载某条评论的子回复
- `toggleCommentLike(comment)` / `toggleReplyLike(reply)` 点赞评论/回复
- 评论输入使用 `uni-popup` 底部弹出，非内嵌输入框
- 回复输入使用独立的 `uni-popup`，显示 replyTargetName
- 头像通过 `<image>` 显示，使用 `comment.avatar` 并提供默认回退

### 搜索

端点：`POST /search`，参数 `{keyword, type, current, size}`。type 为空时默认搜索全部 4 种内容类型。后端使用 `SearchMapper.xml` 的 foreach UNION ALL 跨表查询。每个子查询有 `WHERE 1=1`，当 keyword 非空时条件添加 LIKE。

前端：搜索页有搜索栏 + 类型标签。挂载时显示浏览内容（空 keyword 加载）。用户确认输入后切换到搜索结果。

## 前端（`hz-ui/`）

### 构建与运行

无 `package.json` — 这是一个 uni-app 项目，需在 HBuilderX 或 uni-app CLI 中打开。依赖在 `uni_modules/` 中。微信开发者工具可直接打开此项目。

### 技术栈

- **uni-app**（Vue 3 `<script setup>` 组合式 API）
- **Vue 3 模式** — `manifest.json` 中 `"vueVersion": "3"`
- **微信小程序** — `project.config.json` 中 `"compileType": "miniprogram"`，AppID `wxec5b8bec87585416`

### 关键架构决策

- **页面**：在 `pages.json` 中注册（路由 + 样式 + tab bar）。4 个 tab：首页、校友圈、消息、我的。
- **请求工具**（`utils/request.js`）：封装 `uni.request` 的自定义 HTTP 客户端。全局配置：`baseURL = http://localhost:8080`。拦截器：请求拦截器添加 `Authorization: Bearer <token>` 请求头；响应拦截器通过自动刷新 token（POST `/token/refresh`）处理 403，重试原始请求，并排队处理并发 403。业务错误（code !== 0）显示 toast。**重要**：success 回调必须是 `async` 并使用 `await` 处理返回 Promise 的拦截器，否则 statusCode 检查会在 Promise 上运行而非响应对象。
- **WebSocket**（`utils/websocket.js`）：连接 `ws://localhost:8080/ws/chat` 的单例。处理 auth、chat_message、typing、read_receipt。指数退避重连（最多 5 次）。
- **页面使用 `uni-icons`**、`uni-swipe-action`（滑动删除）、`uni-popup`（底部弹出）、`uni-load-more` 等 uni_modules 组件。
- **导航**：子页面使用 `uni.navigateTo`，tab 页使用 `uni.switchTab`，登录重定向使用 `uni.reLaunch`。
- **图片预览**：使用 `uni.previewImage({ urls, current })`。
- **时间格式化**：每个页面内有本地的相对时间函数（无共享日期工具）。

### 个人中心页面结构

个人中心页面（`pages/profile/profile.vue`）菜单项：
- 我的发布 → `/pages/alumni/my-posts`
- 我的点赞 → `/pages/profile/likes`
- 我的收藏 → `/pages/profile/collection`

点赞和收藏是独立页面，各有自己的类型标签和滑动取消操作。

### 详情页模式

全部 4 个详情页（help、lost、hole、alumni）遵循相同模式：
- 通过路由参数中的 ID 获取内容详情
- 加载时调用 `checkCollectionStatus()` 和 `checkLikeStatus()`
- `toggleLike()` 使用统一的 `/like/add` 和 `/like/cancel`
- `toggleCollect()` 使用 `/collection/add` 和 `/collection/cancel`
- 二级嵌套评论，含 `fetchComments()` 和 `loadMoreReplies()`
- 评论点赞通过 `POST /comment/like`
- 回复输入通过 `uni-popup` 底部弹出
- 所有评论均显示头像图片

### scroll-view 内边距问题

在微信小程序上，`<scroll-view>` 的 `padding-right` 不能正确渲染 — 右侧内容会被裁剪。始终将 scroll-view 的内容包裹在内部 `<view class="xxx-list">` 中，把内边距放在该包装元素上。scroll-view 本身只需 `flex: 1`。

### 编辑 `pages.json`

此文件混用 tab 和空格缩进。Edit 工具可能因缩进不匹配而失败 — 如遇此情况，使用 `Write` 重写整个文件。

### 收藏功能（参考）

所有 4 个详情页（help、lost、hole、alumni）均有收藏按钮。各页面调用：
- `POST /collection/add`，参数 `{contentId, contentType: 'help'|'lost'|'hole'|'alumni'}`
- `POST /collection/cancel`，相同参数
- `POST /collection/check` 检查初始状态
- `POST /collection/list`，参数 `{current, size, contentType}`，用于收藏列表页

后端 Controller 支持 `helpId` 作为 `contentId` 的别名（来自 help/detail.vue 的历史遗留）。
