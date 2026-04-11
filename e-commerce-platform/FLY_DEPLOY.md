# Fly.io 免费部署指南

## Fly.io 优势
- ✅ **无需信用卡**
- ✅ 永久免费 (3个共享CPU)
- ✅ Docker 原生支持
- ✅ 自动 SSL
- ✅ 全球 CDN

## 架构

```
                    ┌─────────────────┐
                    │  Fly.io CDN     │
                    │   (全球节点)    │
                    └────────┬────────┘
                             │
                    ┌────────┴────────┐
                    │   Nginx :80     │  (API Gateway + 前端静态文件)
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
    ┌──────────┐      ┌──────────┐      ┌──────────┐
    │   Auth   │      │ Product  │      │   Cart   │
    │  :8001   │      │  :8002   │      │  :8003   │
    └──────────┘      └──────────┘      └──────────┘
          │                  │                  │
    ┌──────────┐      ┌──────────┐      ┌──────────┐
    │  SQLite  │      │  SQLite  │      │  SQLite  │
    └──────────┘      └──────────┘      └──────────┘
          │                  │                  │
          ▼                  ▼                  ▼
    ┌──────────┐      ┌──────────┐      ┌──────────┐
    │  Order   │      │ Payment  │      │  (备选)  │
    │  :8004   │      │  :8005   │      │          │
    └──────────┘      └──────────┘      └──────────┘
```

## 第一步: 安装 Fly CLI

```bash
# Windows (PowerShell)
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"

# 或使用 winget
winget install flyctl

# macOS
brew install flyctl

# Linux
curl -L https://fly.io/install.sh | sh
```

安装完成后登录:
```bash
fly auth login
```

## 第二步: 准备代码

```bash
cd e-commerce-platform

# 构建前端
cd ../e-commerce-frontend
npm install
npm run build
cd ../e-commerce-platform

# 移动前端到正确位置
mkdir -p frontend
mv ../e-commerce-frontend/dist ./frontend/
```

## 第三步: 部署

### 方式 A: Docker 部署 (推荐)

```bash
cd e-commerce-platform

# 初始化 Fly 应用
fly launch --no-deploy

# 启动所有服务
fly deploy

# 查看状态
fly status

# 查看日志
fly logs
```

### 方式 B: 手动配置每个服务

```bash
# 为每个服务创建应用
for service in nginx auth product cart order payment; do
  fly launch --image nginx:alpine --name ecommerce-$service --no-deploy
done
```

## 第四步: 配置环境变量

```bash
# 设置 JWT Secret
fly secrets set JWT_SECRET=your-super-secure-jwt-secret-key

# 数据库密码
fly secrets set AUTH_DB_PASSWORD=secure_auth_password
fly secrets set PRODUCT_DB_PASSWORD=secure_product_password
fly secrets set CART_DB_PASSWORD=secure_cart_password
fly secrets set ORDER_DB_PASSWORD=secure_order_password
fly secrets set PAYMENT_DB_PASSWORD=secure_payment_password

# Stripe API Key (如果有)
fly secrets set STRIPE_API_KEY=sk_test_your_key
```

## 第五步: 配置 SSL 和域名

```bash
# 自动配置 SSL
fly certs add your-domain.com
fly certs show your-domain.com

# 或使用 Fly.io 提供的免费子域名
# 部署后会获得 your-app.fly.dev
```

## 验证部署

```bash
# 测试 API
curl https://your-app.fly.dev/health
curl https://your-app.fly.dev/api/auth/health
curl https://your-app.fly.dev/api/products
```

## 前端 Vercel 部署

```bash
cd e-commerce-frontend

# 设置后端地址
vercel env add VITE_API_BASE_URL
# 输入: https://ecommerce-platform.fly.dev

# 部署
vercel --prod
```

## 常用命令

```bash
# SSH 进入容器
fly ssh console

# 重启服务
fly restart

# 扩展实例
fly scale count 1

# 查看资源使用
fly stats

# 监控
fly logs -f

# 销毁应用
fly destroy ecommerce-platform
```

## 成本

| 资源 | 用量 | 费用 |
|------|------|------|
| CPU (3共享) | 3台 | **免费** |
| 流量 | - | **免费** (每月10TB) |
| SSL证书 | - | **免费** |
| 数据库 | SQLite (本地) | **免费** |

**总成本: $0/月**

## 故障排除

### 服务无法启动
```bash
# 查看详细日志
fly logs --detached

# 检查健康状态
fly healthcheck show
```

### 数据库连接失败
```bash
# SQLite 数据库存储在持久卷中
# 检查卷是否正确挂载
fly volumes show
```

### 内存不足
```bash
# 监控内存使用
fly metrics
```
