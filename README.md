# 🛒 LUXE E-Commerce Platform

<div align="center">

![Vue](https://img.shields.io/badge/Vue-3-42b883?style=flat-square&logo=vuedotjs)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?style=flat-square&logo=docker)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479a1?style=flat-square&logo=mysql)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**精致奢华风格的微服务电商平台**

[在线演示](http://localhost:5173) · [项目文档](#项目简介) · [快速开始](#快速开始)

</div>

---

## ✨ 项目简介

LUXE 是一个采用**微服务架构**的全栈电商平台，前端使用 Vue 3 + Vite 构建，后端采用 Node.js 微服务设计。平台支持用户认证、商品浏览、购物车、订单管理、支付等完整电商功能。

### 🎯 设计理念

- **精致奢华**：深色主题配金色点缀，优雅衬线字体
- **流畅体验**：精心设计的微交互与过渡动画
- **模块化架构**：微服务独立部署，弹性扩展

## 🏗️ 技术架构

### 系统架构图

```
                           ┌─────────────────┐
                           │     Client      │
                           │   (Vue 3 + Vite)│
                           └────────┬────────┘
                                    │ HTTP
                           ┌────────▼────────┐
                           │   Nginx Gateway  │  :8000
                           └────────┬────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
   ┌────▼────┐              ┌─────▼─────┐              ┌──────▼──────┐
   │  Auth   │              │  Product   │              │    Cart     │
   │ Service │              │  Service   │              │   Service   │
   │  :8001  │              │   :8002    │              │    :8003    │
   └────┬────┘              └─────┬──────┘              └──────┬──────┘
        │                          │                            │
        └──────────────────────────┼────────────────────────────┘
                                   │
                           ┌───────▼───────┐
                           │    Order      │
                           │   Service     │
                           │    :8004      │
                           └───────┬───────┘
                                   │
                           ┌───────▼───────┐
                           │   Payment     │
                           │   Service     │
                           │    :8005      │
                           └───────────────┘
```

### 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端 | Vue 3 + Vite | 渐进式JavaScript框架 |
| 状态管理 | Pinia | Vue状态管理库 |
| UI组件 | Element Plus | Vue 3 UI组件库 |
| 后端 | Node.js + Express | JavaScript运行时 |
| 数据库 | MySQL 8.0 | 关系型数据库 |
| 网关 | Nginx | 反向代理与负载均衡 |
| 容器化 | Docker Compose | 容器编排 |

## 📁 项目结构

```
e-commerce-platform/
│
├── e-commerce-frontend/              # 🎨 Vue 3 前端应用
│   ├── src/
│   │   ├── api/                     # API 接口封装
│   │   ├── components/             # 公共组件
│   │   │   ├── Navbar.vue          # 导航栏
│   │   │   └── ProductCard.vue    # 商品卡片
│   │   ├── stores/                 # Pinia 状态管理
│   │   │   ├── auth.js            # 认证状态
│   │   │   └── cart.js            # 购物车状态
│   │   ├── views/                  # 页面视图
│   │   │   ├── HomeView.vue       # 首页
│   │   │   ├── ProductView.vue    # 商品详情
│   │   │   ├── CartView.vue       # 购物车
│   │   │   ├── LoginView.vue      # 登录
│   │   │   └── RegisterView.vue   # 注册
│   │   ├── router/                # 路由配置
│   │   ├── App.vue                 # 根组件
│   │   ├── main.js                 # 入口文件
│   │   └── style.css              # 全局样式
│   ├── package.json
│   └── vite.config.js
│
└── e-commerce-platform/              # ⚙️ 微服务后端
    ├── auth-service/                # 🔐 用户认证服务
    │   └── src/
    │       ├── controllers/
    │       ├── middleware/
    │       └── index.js
    │
    ├── product-service/             # 📦 商品服务
    │   └── src/
    │       ├── controllers/
    │       ├── routes/
    │       └── index.js
    │
    ├── cart-service/                # 🛒 购物车服务
    │   └── src/
    │       ├── controllers/
    │       ├── middleware/
    │       └── index.js
    │
    ├── order-service/               # 📋 订单服务
    │   └── src/
    │       ├── controllers/
    │       ├── middleware/
    │       └── index.js
    │
    ├── payment-service/              # 💳 支付服务
    │   └── src/
    │       ├── controllers/
    │       ├── middleware/
    │       └── index.js
    │
    ├── nginx/                       # 🌐 Nginx 配置
    │   └── nginx.conf
    │
    ├── docker-compose.yml           # 📦 Docker 编排
    └── package.json
```

## 🚀 快速开始

### 环境要求

- Node.js 18+
- Docker & Docker Compose
- MySQL 8.0 (可选，使用Docker时不需要)

### 方式一：Docker 部署（推荐）

```bash
# 克隆项目
git clone https://github.com/zhujun-ch/e-commerce-platform.git
cd e-commerce-platform

# 启动后端服务
cd e-commerce-platform
docker-compose up -d

# 启动前端
cd ../e-commerce-frontend
npm install
npm run dev
```

### 方式二：本地开发

```bash
# 1. 启动 MySQL
docker run -d -p 3306:3306 --name mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  mysql:8.0

# 2. 配置后端服务
cd e-commerce-platform/{service}
npm install
npm run dev

# 3. 启动前端
cd e-commerce-frontend
npm install
npm run dev
```

### 服务端口

| 服务 | 端口 | 地址 |
|------|------|------|
| API Gateway | 8000 | http://localhost:8000 |
| Auth Service | 8001 | http://localhost:8001 |
| Product Service | 8002 | http://localhost:8002 |
| Cart Service | 8003 | http://localhost:8003 |
| Order Service | 8004 | http://localhost:8004 |
| Payment Service | 8005 | http://localhost:8005 |
| Frontend | 5173 | http://localhost:5173 |

## 📦 功能特性

### 用户端功能

- [x] **商品浏览** - 分类筛选、关键词搜索
- [x] **用户认证** - 注册、登录、JWT Token
- [x] **购物车** - 添加、删除、数量修改
- [x] **订单管理** - 创建订单、查看订单
- [x] **个人中心** - 修改个人信息

### 后端服务

- [x] **认证服务** - JWT签发与验证
- [x] **商品服务** - 商品CRUD、分类查询
- [x] **购物车服务** - 购物车持久化
- [x] **订单服务** - 订单创建与状态管理
- [x] **支付服务** - 支付流程处理

## 🎨 设计风格

LUXE 采用**精致奢华**设计语言：

```css
/* 主题色 */
--color-bg-primary: #0f0f0f;      /* 炭黑底色 */
--color-bg-secondary: #1a1a1a;    /* 深灰 */
--color-accent-gold: #c9a962;      /* 金色强调 */

/* 字体 */
--font-display: 'Cormorant Garamond', serif;
--font-body: 'Outfit', sans-serif;
```

### 设计特点

- 🌙 **深色主题** - 舒适的夜间浏览体验
- ✨ **金色点缀** - 精致的视觉焦点
- 📜 **优雅字体** - 衬线标题 + 无衬线正文
- 🎬 **流畅动效** - 悬浮、渐变、过渡动画

## 📚 API 文档

### 认证接口

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/auth/register | 用户注册 |
| POST | /api/auth/login | 用户登录 |
| GET | /api/auth/profile | 获取用户信息 |

### 商品接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/products | 获取商品列表 |
| GET | /api/products/:id | 获取商品详情 |

### 购物车接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/cart | 获取购物车 |
| POST | /api/cart | 添加商品 |
| PUT | /api/cart/:id | 更新数量 |
| DELETE | /api/cart/:id | 删除商品 |

## 🔧 环境变量

### 后端 (.env)

```env
JWT_SECRET=your-secret-key
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

## 📄 License

MIT License - 详见 [LICENSE](LICENSE) 文件

---

<div align="center">

**Built with ❤️ by [zhujun-ch](https://github.com/zhujun-ch)**

</div>
