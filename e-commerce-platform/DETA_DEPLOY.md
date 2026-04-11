# Deta Space 免费部署指南

## Deta Space 优势

| 特性 | 说明 |
|------|------|
| 免费额度 | 无限应用，Node.js/Python 免费运行 |
| 信用卡 | **不需要** |
| 数据库 | Deta Base (免费 key-value 数据库) |
| SSL | 自动配置 |
| 中国访问 | 支持 |

## 架构调整

由于 Deta Space 每个应用是独立容器，我们把 5 个微服务合并为 1 个单体应用：

```
                    ┌─────────────────┐
                    │  Deta Space      │
                    │   Node.js App    │
                    │  All-in-One      │
                    └────────┬────────┘
                             │
                    ┌────────┴────────┐
                    │   Deta Base      │
                    │  (Key-Value DB)  │
                    └─────────────────┘
```

## 第一步: 安装 Deta CLI

```bash
# Windows (PowerShell)
powershell -Command "iwr https://get.deta.workers.dev -useb | iex"

# 或下载二进制文件
# https://github.com/deta/deta/releases
```

## 第二步: 登录

```bash
deta login
```

## 第三步: 创建项目

```bash
cd e-commerce-platform

# 创建新应用
deta new --name ecommerce-platform

# 部署
deta deploy
```

## 第四步: 配置数据库

Deta Base SDK 会自动创建数据库，无需手动配置。

## 第五步: 访问应用

```bash
# 获取应用 URL
deta details

# 测试
curl https://your-app.deta.dev/health
```

## 前端部署

```bash
cd e-commerce-frontend

# 设置环境变量
vercel env add VITE_API_BASE_URL
# 输入: https://ecommerce-platform.deta.dev

vercel --prod
```

---

## 常用命令

```bash
# 查看应用状态
deta details

# 查看日志
deta logs

# 更新部署
deta deploy

# 调试
deta exec
```

---

## 成本

| 资源 | 用量 | 费用 |
|------|------|------|
| 应用运行 | 无限 | **免费** |
| Deta Base | 100万次读写/月 | **免费** |
| 流量 | - | **免费** |
| SSL | 自动 | **免费** |

**总成本: $0/月**
