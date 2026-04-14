# LUXE E-Commerce Platform

精致奢华风格的微服务电商平台，采用前后端分离架构。

## 项目简介

这是一个使用微服务架构的全栈电商平台，支持用户认证、商品浏览、购物车、订单管理、支付等完整电商功能。

## 项目结构

```
workshop/
├── e-commerce-frontend/     # Vue 3 前端应用
│   ├── src/
│   │   ├── api/             # API 接口
│   │   ├── components/       # 公共组件
│   │   ├── stores/           # Pinia 状态管理
│   │   ├── views/            # 页面视图
│   │   ├── views/admin/     # 管理后台视图
│   │   ├── router/           # 路由配置
│   │   ├── utils/            # 工具函数
│   │   └── style.css         # 全局样式
│   ├── package.json
│   └── vite.config.js
│
└── e-commerce-platform/      # 后端微服务
    ├── shared/               # 共享模块
    │   ├── config/           # 服务配置
    │   ├── middleware/        # 中间件（AuthMiddleware, errorHandler）
    │   └── utils/            # 工具函数
    ├── auth-service/         # 用户认证服务
    ├── product-service/      # 商品服务
    ├── cart-service/         # 购物车服务
    ├── order-service/        # 订单服务
    ├── payment-service/      # 支付服务
    ├── nginx/                # Nginx 配置
    ├── docker-compose.yml    # Docker 编排
    └── package.json
```

## 技术栈

### 前端
- **框架**: Vue 3 + Vite
- **状态管理**: Pinia
- **UI框架**: Element Plus
- **样式**: 自定义CSS设计系统（深色主题 + 金色点缀）

### 后端（微服务）
- **运行时**: Node.js + Express
- **数据库**: MySQL 8.0
- **网关**: Nginx
- **容器化**: Docker Compose

## 快速开始

### 前置要求
- Node.js 18+
- Docker & Docker Compose

### 1. 克隆项目
```bash
git clone https://github.com/zhujun-ch/e-commerce-platform.git
cd workshop
```

### 2. 启动后端（Docker）
```bash
cd e-commerce-platform
docker-compose up -d
```

服务端口：
- API Gateway: http://localhost:8000
- Auth Service: http://localhost:8001
- Product Service: http://localhost:8002
- Cart Service: http://localhost:8003
- Order Service: http://localhost:8004
- Payment Service: http://localhost:8005

### 3. 启动前端
```bash
cd ../e-commerce-frontend
npm install
npm run dev
```

访问 http://localhost:5173

## 服务架构

```
┌─────────────┐
│   Nginx    │  :8000
│  (Gateway) │
└──────┬──────┘
       │
   ┌───┴───┬───────┬────────┐
   ▼       ▼       ▼        ▼
┌────┐ ┌────┐ ┌─────┐ ┌────────┐
│Auth│ │Prod│ │Cart │ │Payment │
│ :1 │ │ :2 │ │  :3 │ │  :5   │
└────┘ └────┘ └─────┘ └────────┘
         │              ▲
         └──────────────┤
                   ┌────┴────┐
                   │ Order   │
                   │  :4     │
                   └─────────┘
```

## 功能特性

### 用户端
- [x] 商品浏览与搜索
- [x] 分类筛选
- [x] 用户注册/登录
- [x] 购物车管理
- [x] 下单结算
- [x] 订单查看
- [x] 个人中心

### 管理端
- [x] 管理后台仪表盘（销售统计、订单统计、趋势图表）
- [x] 商品管理（增删改查）
- [x] 订单管理（状态更新、详情查看）
- [x] 用户管理（角色设置、删除用户）
- [x] 销售趋势图表

管理后台地址: `/admin`（需要管理员权限）

## API 接口

### 认证服务 (Port 8001)
| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/auth/register | 用户注册 |
| POST | /api/auth/login | 用户登录 |
| GET | /api/auth/profile | 获取用户信息 |
| PUT | /api/auth/profile | 更新用户信息 |
| GET | /api/auth/admin/users | 获取所有用户（管理员） |
| PUT | /api/auth/admin/users/:id/role | 更新用户角色（管理员） |
| DELETE | /api/auth/admin/users/:id | 删除用户（管理员） |

### 商品服务 (Port 8002)
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/products | 获取商品列表 |
| GET | /api/products/:id | 获取商品详情 |
| POST | /api/products | 创建商品（管理员） |
| PUT | /api/products/:id | 更新商品（管理员） |
| DELETE | /api/products/:id | 删除商品（管理员） |

### 购物车服务 (Port 8003)
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/cart | 获取购物车 |
| POST | /api/cart | 添加商品 |
| PUT | /api/cart/:id | 更新数量 |
| DELETE | /api/cart/:id | 删除商品 |

### 订单服务 (Port 8004)
| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/orders | 创建订单 |
| GET | /api/orders | 获取订单列表 |
| GET | /api/orders/admin/all | 获取全部订单（管理员） |
| GET | /api/orders/:id | 订单详情 |
| PUT | /api/orders/:id/status | 更新订单状态（管理员） |

### 支付服务 (Port 8005)
| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/pay | 创建支付 |

## 设计风格

LUXE 采用**精致奢华**设计语言：
- 深色主题：#0f0f0f 炭黑底色
- 金色点缀：#c9a962 强调色
- 优雅字体：Cormorant Garamond + Outfit
- 精致动效：悬浮、渐变、过渡动画

## 环境变量

### 后端 (.env)
```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
AUTH_DB_PASSWORD=auth123
PRODUCT_DB_PASSWORD=product123
CART_DB_PASSWORD=cart123
ORDER_DB_PASSWORD=order123
PAYMENT_DB_PASSWORD=payment123
```

### 前端 (.env)
```env
VITE_API_BASE_URL=http://localhost:8000
```

## 默认管理员账号

| 邮箱 | 密码 |
|------|------|
| superadmin@test.com | admin123 |

## 更新日志

### 2026-04-15 - 共享模块提取与优化

**后端优化：**
- 新增 `shared/express-common.js` - 提取5个服务共享的Express boilerplate（请求日志、限流、CORS、graceful shutdown）
- 新增 `shared/database.js` - 统一数据库连接池工厂
- 新增 `shared/middleware/errorHandler.js` - 统一错误处理中间件
- 新增 `shared/utils/response.js` - 统一响应助手函数
- 新增 `shared/config/services.js` - 服务URL集中管理
- 统一 JWT_SECRET 在 `shared/middleware/AuthMiddleware.js`
- 修复 product-service JWT_SECRET 环境变量传递问题
- 修复 payment-service webhook 中间件顺序（express.raw 必须在 rate limiter 之前）
- 修复 order-service 多数据库池配置问题
- 删除各服务冗余的 AuthMiddleware.js，统一使用 shared 模块

**前端优化：**
- 修复管理员路由守卫（检查 `role !== 'admin'`）
- 新增 `frontend/src/utils/categories.js` - 统一分类映射
- 新增 `frontend/src/utils/formatters.js` - 共享工具函数（状态标签、时间格式化）
- 修复 admin 产品管理分类筛选
- 修复 order API params 传递
- 修复 cart 请求竞态条件
- 修复管理员操作商品时登出问题

### 2026-04-12 - 前后端分离与JWT统一
- 实现前后端完全分离架构
- 统一 JWT_SECRET 解决跨服务token验证问题

## 部署

### Docker 部署
```bash
cd e-commerce-platform
docker-compose up -d
```

### 云平台部署
- Fly.io
- Deta
- Oracle Cloud

## License

MIT
