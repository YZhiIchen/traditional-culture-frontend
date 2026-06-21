
---

## 一、前端 `..\traditional-culture-frontend`

```text
traditional-culture-frontend/
├── public/                          # 静态资源
├── src/                             # 源码主目录
│   ├── api/                         # 接口请求层
│   │   ├── auth.ts
│   │   ├── index.ts
│   │   ├── recognition.ts
│   │   ├── search.ts
│   │   └── upload.ts
│   ├── assets/
│   │   └── styles/
│   │       ├── main.scss
│   │       └── theme.scss
│   ├── components/                  # 公共组件
│   │   ├── Layout/
│   │   │   ├── Navbar.vue
│   │   │   ├── Sidebar.vue
│   │   │   └── index.vue
│   │   ├── AIChat.vue
│   │   ├── ErrorTip.vue
│   │   └── Loading.vue
│   ├── router/
│   │   └── index.ts
│   ├── stores/                      # Pinia 状态管理
│   │   ├── app.ts
│   │   └── user.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── request.ts
│   │   └── validate.ts
│   ├── views/                       # 页面视图
│   │   ├── Admin/index.vue
│   │   ├── Explore/index.vue
│   │   ├── Favorites/index.vue
│   │   ├── History/index.vue
│   │   ├── Home/index.vue
│   │   ├── Login/index.vue
│   │   ├── Profile/index.vue
│   │   ├── RecognitionResult/index.vue
│   │   ├── Register/index.vue
│   │   ├── Search/index.vue
│   │   └── Upload/index.vue
│   ├── App.vue
│   └── main.ts
├── .editorconfig
├── .env.development                 # 开发环境变量
├── .gitattributes
├── .gitignore
├── .oxlintrc.json
├── .prettierrc.json
├── deploy.sh                        # 部署脚本
├── detiles.md
├── env.d.ts
├── eslint.config.ts
├── index.html
├── monitor.js
├── package.json
├── package-lock.json
├── README.md                       # 项目专属文档
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vercel.json
└── vite.config.ts
```

---

## 二、后端 `..\traditional-culture-backend`

```text
traditional-culture-backend/
├── app/                             # 应用主包
│   ├── middleware/                  # 安全中间件
│   │   ├── __init__.py
│   │   └── security.py             # 安全响应头 + 输入清洗 + 启动校验
│   ├── models/                      # ORM 模型
│   │   ├── __init__.py
│   │   ├── author.py
│   │   ├── dynasty.py
│   │   ├── favorite.py
│   │   ├── resource.py
│   │   └── user.py
│   ├── routers/                     # 路由层
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── chat.py
│   │   ├── dashboard.py
│   │   ├── explore.py
│   │   ├── favorite.py
│   │   ├── knowledge.py
│   │   ├── recognition.py
│   │   ├── search.py
│   │   └── upload.py
│   ├── schemas/                     # Pydantic 校验模型
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── search.py
│   │   └── upload.py
│   ├── services/                    # 业务逻辑层
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── recognition_service.py
│   │   ├── review_service.py
│   │   └── scheduler_service.py
│   ├── utils/                       # 工具层
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   └── response.py
│   ├── __init__.py
│   ├── config.py                    # 配置加载
│   ├── database.py                  # 数据库引擎 + Session
│   └── main.py                      # FastAPI 应用入口
├── .env                             # 环境变量（实际使用）
├── .env.example                     # 环境变量示例
├── .gitignore
├── README.md                        # 后端项目文档
├── requirements.txt                 # 依赖清单
└── run.py                           # 启动入口
```

---