..\traditional-culture-backend\API.md

# 传统文化数字化平台 — 接口文档

> 基于 NLP 与图像识别的传统文化数字化保护与传承研究项目后端 API。
> 技术栈：FastAPI + SQLAlchemy 2.0 + JWT + 阿里通义千问（DashScope）

## 基础信息

| 项目 | 说明 |
| --- | --- |
| Base URL | `/api` |
| 协议 | HTTP |
| 数据格式 | JSON |
| 鉴权方式 | JWT Bearer Token |
| Swagger 文档 | `GET /api/docs` |
| ReDoc 文档 | `GET /api/redoc` |

## 统一响应格式

所有接口统一返回如下结构（匹配前端 `request.ts` 期望）：

```json
{
  "code": 200,
  "message": "ok",
  "data": {}
}
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| code | int | 业务状态码，200 成功，其他为失败 |
| message | string | 提示信息 |
| data | any | 业务数据，失败时可能为 null |

## 鉴权说明

- 除登录、注册、刷新 Token、健康检查外，所有接口均需在请求头携带：`Authorization: Bearer <access_token>`
- access_token 默认有效期 1 小时，refresh_token 有效期 7 天
- 刷新 Token 接口需在请求头携带：`X-Refresh-Token: <refresh_token>`

## 速率限制

| 接口 | 限制 |
| --- | --- |
| 登录 | 5 次/分钟 |
| 注册 | 3 次/分钟 |
| 全局默认 | 60 次/分钟 |

---

## 一、健康检查

### `GET /api/health`

健康检查（无需鉴权）。

**响应示例**

```json
{
  "status": "ok",
  "service": "traditional-culture-backend"
}
```

---

## 二、认证模块 `/auth`

### 1. 用户登录

`POST /api/auth/login` ｜ 限流：5/分钟 ｜ 无需鉴权

**请求体**

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| username | string | 是 | 3-20 字符 |
| password | string | 是 | 6-20 字符 |

**响应 data**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| token | string | access_token |
| refreshToken | string | 刷新 token |
| userInfo | object | 用户信息（见用户对象） |
| deleted | boolean | 仅账号已注销时返回 true |

> 若账号已注销，返回 `deleted: true` 并提示是否恢复。

### 2. 用户注册

`POST /api/auth/register` ｜ 限流：3/分钟 ｜ 无需鉴权

**请求体**

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| username | string | 是 | 3-20 字符 |
| password | string | 是 | 6-20 字符 |
| nickname | string | 是 | 2-20 字符（会做 HTML 清洗） |

**响应 data**：包含 `token`、`refreshToken`、`userInfo`。

### 3. 刷新 Token

`POST /api/auth/refresh` ｜ 无需 Bearer 鉴权

**请求头**：`X-Refresh-Token: <refresh_token>`

**响应 data**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| token | string | 新的 access_token |

### 4. 退出登录

`POST /api/auth/logout` ｜ 需鉴权

JWT 无状态，前端清除 token 即可。返回 `success`。

---

## 三、用户模块 `/user`

### 1. 获取当前用户信息

`GET /api/user/info` ｜ 需鉴权

**响应 data**：用户对象。

### 2. 更新个人信息

`PUT /api/user/profile` ｜ 需鉴权

**请求体**

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| nickname | string | 否 | 2-20 字符 |
| email | string | 否 | 邮箱 |
| bio | string | 否 | 个人简介，最长 500 字符 |

> 提交后会经过内容审核（`review_profile`），未通过返回 400。

### 3. 注销账号

`DELETE /api/user/account` ｜ 需鉴权

软删除，保留 30 天后由定时任务物理清除。会删除用户头像物理文件。

### 4. 恢复已注销账号

`POST /api/user/reactivate` ｜ 无需 Bearer 鉴权

**请求体**：同登录（`username` / `password`）。

### 5. 修改密码

`PUT /api/user/password` ｜ 需鉴权

**请求体**

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| current | string | 是 | 当前密码，6-20 字符 |
| newPwd | string | 是 | 新密码，6-20 字符 |

### 6. 上传头像

`POST /api/user/avatar` ｜ 需鉴权 ｜ `multipart/form-data`

**请求参数**：`file`（UploadFile）

**响应 data**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| avatar | string | 头像访问 URL，如 `/uploads/headportrait/avatar_1.png` |

### 7. 获取用户列表

`GET /api/user/list` ｜ 需鉴权 ｜ 仅 admin

**响应 data**：用户对象数组。

---

## 四、上传模块 `/upload`

### 1. 图片上传识别

`POST /api/upload` ｜ 需鉴权 ｜ `multipart/form-data`

**请求参数**：`file`（UploadFile）

**限制**

- 类型：仅支持 `image/jpeg`、`image/png`、`image/webp`
- 大小：≤ 10MB
- 校验文件魔数，防止伪造扩展名

**响应 data**：资源对象（见资源对象）。

> 若 AI 判定为「非文物」，返回 500 且 message 含「非文物」。

### 2. 文本上传识别

`POST /api/upload/text` ｜ 需鉴权

**请求体**

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| content | string | 是 | 文本内容，1-10000 字符（≤1MB） |
| title | string | 是 | 标题，1-200 字符 |

**响应 data**：资源对象。

---

## 五、识别结果模块 `/recognition`

### 1. 获取识别结果详情

`GET /api/recognition/result/{file_id}` ｜ 需鉴权

**路径参数**：`file_id`（资源字符串 ID）

**响应 data**：资源对象。

### 2. 获取识别历史（分页）

`GET /api/recognition/history` ｜ 需鉴权

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| page | int | 否 | 页码，默认 1，≥1 |
| pageSize | int | 否 | 每页条数，默认 10，1-100 |
| keyword | string | 否 | 关键词（匹配 title/dynasty/author/tags） |
| type | string | 否 | `image` / `text` |

**响应 data**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| list | array | 资源对象数组 |
| total | int | 总条数 |

### 3. 删除识别记录

`DELETE /api/recognition/{file_id}` ｜ 需鉴权

删除记录及对应物理文件（仅限本人资源）。

---

## 六、检索模块

### 1. 全局资源检索

`GET /api/search` ｜ 需鉴权

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| keyword | string | 否 | 关键词，默认空 |
| type | string | 否 | `image` / `text` |
| dynasty | string | 否 | 朝代 |
| page | int | 否 | 默认 1，≥1 |
| pageSize | int | 否 | 默认 20，1-100 |

**响应 data**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| list | array | 检索结果列表 |
| list[].id | string | file_id |
| list[].title | string | 标题 |
| list[].type | string | image / text |
| list[].dynasty | string | 朝代 |
| list[].summary | string | 描述 |
| list[].tags | array | 标签数组 |
| list[].createTime | string | 创建时间 ISO |
| total | int | 总条数 |

### 2. 获取资源详情

`GET /api/detail/{file_id}` ｜ 需鉴权

**响应 data**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | string | file_id |
| title | string | 标题 |
| type | string | image / text |
| dynasty | string | 朝代 |
| summary | string | 描述 |
| tags | array | 标签数组 |
| createTime | string | 创建时间 ISO |

---

## 七、知识发现模块 `/explore`

### 1. 获取精选推荐

`GET /api/explore/recommend` ｜ 需鉴权

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| dynasty | string | 否 | 朝代筛选 |
| category | string | 否 | 分类筛选 |

**响应 data**：推荐项数组（最多 6 条）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | string | file_id |
| title | string | 标题 |
| desc | string | 描述 |
| dynasty | string | 朝代 |
| author | string | 作者 |
| category | string | 分类 |
| tags | array | 标签数组 |
| confidence | float | 置信度 |

### 2. 获取知识图谱

`GET /api/explore/graph` ｜ 需鉴权

**响应 data**：关联边数组（最多 7 条）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| from | string | 起点节点 |
| relation | string | 关系（开创/影响/传承/融合/交汇等） |
| to | string | 终点节点 |

---

## 八、收藏模块 `/favorite`

### 1. 添加收藏

`POST /api/favorite/{file_id}` ｜ 需鉴权

### 2. 取消收藏

`DELETE /api/favorite/{file_id}` ｜ 需鉴权

### 3. 获取收藏列表

`GET /api/favorite/list` ｜ 需鉴权

**响应 data**：资源对象数组。

### 4. 检查是否已收藏

`GET /api/favorite/check/{file_id}` ｜ 需鉴权

**响应 data**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| favorited | boolean | 是否已收藏 |

---

## 九、知识库模块 `/knowledge`

### 1. 获取所有朝代

`GET /api/knowledge/dynasties` ｜ 需鉴权

**响应 data**：朝代对象数组（自动收录，按 id 排序）。

### 2. 获取所有作者

`GET /api/knowledge/authors` ｜ 需鉴权

**响应 data**：作者对象数组（自动收录，按 id 排序）。

---

## 十、AI 问答模块 `/chat`

### 1. 智能问答

`POST /api/chat` ｜ 需鉴权

**请求体**

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| message | string | 是 | 当前问题 |
| history | array | 否 | 历史对话，支持上下文记忆 |
| history[].role | string | 是 | `user` / `assistant` |
| history[].content | string | 是 | 消息内容 |

**响应 data**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| reply | string | AI 回答内容 |

> 模型：`qwen-plus`，temperature=0.7，max_tokens=1500。

---

## 十一、仪表盘模块 `/dashboard`

### 1. 获取统计数据

`GET /api/dashboard/stats` ｜ 需鉴权

统计当前用户（非全局）数据。

**响应 data**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| totalResources | int | 资源总数 |
| totalRecognized | int | 已识别数 |
| weekNew | int | 近一周新增 |
| avgConfidence | string | 平均置信度（百分比字符串） |
| todayUpload | int | 今日上传数 |
| todayRecognized | int | 今日识别数 |
| todaySearch | int | 今日搜索数（固定 0） |

### 2. 获取热门标签

`GET /api/dashboard/tags` ｜ 需鉴权

**响应 data**：标签数组（最多 20 条）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| name | string | 标签名 |
| count | int | 出现次数 |

### 3. 获取朝代分布

`GET /api/dashboard/dynasties` ｜ 需鉴权

**响应 data**：朝代分布数组

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| name | string | 朝代名 |
| count | int | 数量 |
| pct | float | 占比百分比 |

---

## 数据对象说明

### 用户对象 `userInfo`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | int | 用户 ID |
| username | string | 用户名 |
| nickname | string | 昵称 |
| email | string\|null | 邮箱 |
| bio | string\|null | 个人简介 |
| role | string | 角色：user / researcher / admin |
| avatar | string\|null | 头像 URL |
| deleted | boolean | 是否已注销 |

### 资源对象 `resource`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | string | file_id（字符串） |
| fileId | string | file_id |
| fileName | string | 文件名 |
| fileType | string | image / text |
| fileUrl | string\|null | 文件访问 URL |
| status | string | processing / completed / failed |
| recognitionTime | string\|null | 识别时间 ISO |
| result | object | 识别结构化结果 |
| result.title | string\|null | 标题 |
| result.author | string\|null | 作者 |
| result.dynasty | string\|null | 朝代 |
| result.description | string\|null | 描述 |
| result.tags | array | 标签数组 |
| result.content | string\|null | 内容 |
| result.confidence | float\|null | 置信度 |
| rawData | object\|null | 原始识别数据 |

---

## 错误码

| code | 含义 | 触发场景 |
| --- | --- | --- |
| 200 | 成功 | 正常请求 |
| 400 | 请求参数错误 | 校验失败、重复操作、审核未通过 |
| 401 | 未授权 | 未登录、token 失效、refresh_token 过期 |
| 403 | 无权限 | 非 admin 访问管理接口 |
| 404 | 资源不存在 | file_id 无效 |
| 500 | 服务器错误 | AI 识别失败、服务未配置 |

## 静态资源

- 上传文件：`/uploads/<文件名>`
- 头像文件：`/uploads/headportrait/<文件名>`
