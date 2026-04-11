# LUXE E-Commerce Platform

精致奢华风格的微服务电商平台，采用前后端分离架构。

## 项目简介

这是一个使用微服务架构的全栈电商平台，支持用户认证、商品浏览、购物车、订单管理、支付等完整电商功能。

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

## 项目结构

```
e-commerce-platform/
├── frontend/                 # Vue 3 前端应用
│   ├── src/
│   │   ├── api/             # API 接口
│   │   ├── components/       # 公共组件
│   │   ├── stores/           # Pinia 状态管理
│   │   ├── views/           # 页面视图
│   │   ├── router/          # 路由配置
│   │   ├── App.vue          # 根组件
│   │   ├── main.js          # 入口文件
│   │   └── style.css        # 全局样式
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── auth-service/             # 用户认证服务
├── product-service/          # 商品服务
├── cart-service/             # 购物车服务
├── order-service/            # 订单服务
├── payment-service/          # 支付服务
├── nginx/                    # Nginx 配置
├── docker-compose.yml        # Docker 编排
└── package.json
```

## 快速开始

### 前置要求
- Node.js 18+
- Docker & Docker Compose
- MySQL 8.0（可选，使用Docker时不需要）

### 1. 克隆项目
```bash
git clone https://github.com/zhujun-ch/e-commerce-platform.git
cd e-commerce-platform
```

### 2. 启动后端（Docker）
```bash
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
cd frontend
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

## API 接口

### 认证服务 (Port 8001)
| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/register | 用户注册 |
| POST | /api/login | 用户登录 |
| GET | /api/profile | 获取用户信息 |

### 商品服务 (Port 8002)
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/products | 获取商品列表 |
| GET | /api/products/:id | 获取商品详情 |

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
| GET | /api/orders/:id | 订单详情 |

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

## 部署

### Docker 部署
```bash
docker-compose up -d
```

### 云平台部署
- Fly.io
- Deta
- Oracle Cloud

## License

MIT
