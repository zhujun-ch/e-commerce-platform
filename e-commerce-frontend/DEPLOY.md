# Vercel 部署指南

## 前置要求

1. Node.js 18+ 已安装
2. Vercel 账号 (vercel.com)
3. 后端已部署到 Oracle Cloud

## 部署步骤

### 1. 安装 Vercel CLI (可选)

```bash
npm i -g vercel
```

### 2. 登录 Vercel

```bash
vercel login
```

### 3. 配置环境变量

在 Vercel 项目设置中添加环境变量：

- `VITE_API_BASE_URL` = 你的后端 API 地址 (例如: `https://your-backend-ip:8000`)

### 4. 部署

**方式 A: CLI 部署**
```bash
cd e-commerce-frontend
vercel
```

**方式 B: Git 集成部署**
1. 将代码推送到 GitHub/GitLab
2. 在 vercel.com 导入项目
3. 配置环境变量
4. 点击 Deploy

### 5. 验证部署

1. 访问 Vercel 分配的 URL
2. 打开浏览器开发者工具检查 Network
3. 确认 API 请求是否成功到达后端

## 故障排除

### CORS 错误
确保后端已配置允许 Vercel 域名访问：
```javascript
// 后端 CORS 配置示例
app.use(cors({
  origin: ['https://your-frontend.vercel.app']
}))
```

### API 请求失败
1. 检查浏览器控制台错误信息
2. 确认后端服务是否正常运行
3. 验证 `VITE_API_BASE_URL` 环境变量配置正确
4. 检查 Oracle Cloud 防火墙是否开放 8000 端口

### 构建失败
```bash
# 本地测试构建
npm install
npm run build
```
