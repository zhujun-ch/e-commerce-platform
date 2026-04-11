# Oracle Cloud Always Free 部署指南

## 1. 创建 Oracle Cloud 账号

1. 访问 https://www.oracle.com/cloud/free/
2. 点击 "Start for free"
3. 使用邮箱注册账号
4. 需要信用卡验证（不会扣费）
5. 选择 "Always Free" 套餐

## 2. 创建 Always Free VM

### 方式 A: ARM 实例 (推荐 - 永久免费)
```
- 4核 ARM Ampere CPU
- 24GB RAM
- 200GB Block Storage
```

### 方式 B: x86 实例
```
- 1核 CPU
- 1GB RAM
- 50GB Block Storage
```

### 创建步骤:
1. 登录 Oracle Cloud Console
2. 进入 "Compute" → "Instances"
3. 点击 "Create Instance"
4. 配置:
   - Name: `ecommerce-server`
   - Image: Ubuntu 22.04 LTS
   - Shape: 选择 Always Free eligible 的 shape
   - SSH Key: 上传你的公钥
5. 记下 Public IP Address

## 3. 配置防火墙

### Oracle Cloud 安全列表:
1. 进入 "Networking" → "Virtual Cloud Networks"
2. 选择你的 VCN
3. 点击 "Security Lists" → "Default Security List"
4. 添加规则:
   - Source: 0.0.0.0/0
   - Protocol: TCP
   - Destination Port: 22, 80, 443, 8000

### Ubuntu 防火墙:
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 4. 安装 Docker 环境

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 安装 Docker Compose
sudo apt install docker-compose -y

# 验证安装
docker --version
docker-compose --version
```

## 5. 上传代码到服务器

### 方式 A: Git 拉取 (推荐)
```bash
# 安装 git
sudo apt install git -y

# 克隆你的仓库
git clone https://your-repo-url/e-commerce-platform.git
cd e-commerce-platform
```

### 方式 B: SCP 上传
```bash
scp -r ./e-commerce-platform user@your-ip:/home/ubuntu/
```

## 6. 配置环境变量

```bash
# 创建 .env 文件
cat > .env << EOF
JWT_SECRET=your-super-secure-jwt-secret-key-min-32-chars
AUTH_DB_PASSWORD=secure_auth_password
PRODUCT_DB_PASSWORD=secure_product_password
CART_DB_PASSWORD=secure_cart_password
ORDER_DB_PASSWORD=secure_order_password
PAYMENT_DB_PASSWORD=secure_payment_password
STRIPE_API_KEY=sk_test_your_stripe_key
EOF
```

## 7. 构建前端

```bash
# 在 frontend 目录构建
cd e-commerce-frontend
npm install
npm run build
cd ..

# 移动构建产物到 platform 目录
mv e-commerce-frontend/dist ./frontend
```

## 8. 启动服务

```bash
# 使用单服务器版本的 docker-compose
docker-compose -f docker-compose-single.yml up -d --build

# 查看服务状态
docker-compose -f docker-compose-single.yml ps

# 查看日志
docker-compose -f docker-compose-single.yml logs -f
```

## 9. 验证部署

```bash
# 测试 API
curl http://localhost:8000/health
curl http://localhost:8001/api/auth/health
curl http://localhost:8002/api/products

# 外部访问
# http://your-public-ip/
```

## 10. 配置域名 (可选)

1. 在域名 DNS 添加 A 记录指向 Oracle Cloud IP
2. 使用 Let's Encrypt 配置 SSL:
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

## 故障排除

### 数据库连接失败
```bash
# 查看数据库日志
docker-compose logs auth-db

# 进入数据库容器
docker exec -it ecommerce-platform_auth-db-1 mysql -u root -p
```

### 查看所有容器日志
```bash
docker-compose -f docker-compose-single.yml logs --tail=100
```

### 重启所有服务
```bash
docker-compose -f docker-compose-single.yml restart
```

### 完全清理重建
```bash
docker-compose -f docker-compose-single.yml down -v
docker-compose -f docker-compose-single.yml up -d --build
```
