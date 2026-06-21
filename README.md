# 传统文化数字化平台 — 前端

> 基于 NLP 与图像识别的传统文化数字化保护与传承研究项目的前端应用。

基于 **Vue 3 + TypeScript + Vite** 构建，集成 Element Plus 组件库、Pinia 状态管理、Vue Router 路由、ECharts 数据可视化与 Axios 请求封装，提供传统文化藏品的上传、AI 识别、检索、探索、收藏与 AI 问答等完整交互体验。

## 技术栈

| 分类 | 技术 |
| --- | --- |
| 框架 | Vue 3.5（`<script setup>`） |
| 语言 | TypeScript |
| 构建工具 | Vite 8 |
| UI 组件库 | Element Plus |
| 状态管理 | Pinia |
| 路由 | Vue Router 4 |
| HTTP 请求 | Axios |
| 图表 | ECharts 6 |
| 样式 | Sass |
| 代码规范 | ESLint + OxLint + Prettier |

## 功能模块

- **首页（Home）**：平台概览与入口导航
- **登录 / 注册（Login / Register）**：用户认证
- **上传（Upload）**：上传文物图片或文本进行 AI 识别
- **识别结果（RecognitionResult）**：展示 AI 识别的结构化结果
- **搜索（Search）**：按关键词、朝代、作者等检索资源
- **探索（Explore）**：浏览全部传统文化资源
- **收藏（Favorites）**：管理个人收藏
- **历史记录（History）**：查看个人识别历史
- **个人中心（Profile）**：资料、头像、密码管理
- **管理后台（Admin）**：数据看板与资源管理
- **AI 问答（AIChat）**：传统文化知识智能问答

## 目录结构

```text
src/
├── api/            # 接口请求层（auth / recognition / search / upload）
├── assets/styles/  # 全局样式与主题
├── components/      # 公共组件（Layout / AIChat / Loading / ErrorTip）
├── router/          # 路由配置
├── stores/          # Pinia 状态（app / user）
├── types/           # TypeScript 类型定义
├── utils/           # 工具（request 请求封装 / validate 校验）
├── views/           # 页面视图（按模块组织）
├── App.vue
└── main.ts
```

## 环境配置

项目通过 `.env.development` 配置开发环境变量：

```text
VITE_API_BASE_URL=/api
VITE_API_TARGET=http://localhost:8080
```

- `VITE_API_BASE_URL`：请求基础路径
- `VITE_API_TARGET`：开发环境后端代理目标地址

## 环境要求

- Node.js `^20.19.0` 或 `>=22.12.0`
- 推荐使用 [VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 插件

## 快速开始

```sh
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run dev
```

## 脚本说明

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动开发服务器（热更新） |
| `npm run build` | 类型检查 + 生产构建 |
| `npm run preview` | 预览生产构建产物 |
| `npm run type-check` | TypeScript 类型检查 |
| `npm run lint` | OxLint + ESLint 代码检查并自动修复 |
| `npm run format` | Prettier 格式化 `src/` |

## 与后端联调

前端开发服务器默认将 `/api` 请求代理到后端 `http://localhost:8080`（见 `vite.config.ts`）。请先启动后端服务：

```sh
cd ../traditional-culture-backend
python run.py
```

## 部署

- 项目内置 `vercel.json`，支持一键部署到 Vercel
- `deploy.sh` 提供自定义部署脚本
- 生产构建产物位于 `dist/`

## 相关文档

- [Vite 配置参考](https://vite.dev/config/)
- [Vue 3 文档](https://vuejs.org/)
- [Element Plus 文档](https://element-plus.org/)