# 配置指南 / Configuration Guide

## 环境变量配置 / Environment Variables

### 必需配置 / Required Configuration

#### 1. Google OAuth 2.0

**获取步骤 / Steps to obtain:**

1. 访问 Google Cloud Console / Visit Google Cloud Console
   - https://console.cloud.google.com/

2. 创建新项目 / Create a new project
   - 点击顶部的项目选择器 / Click the project selector at the top
   - 点击 "新建项目" / Click "New Project"
   - 输入项目名称，如 "AI Echo Market" / Enter project name

3. 启用 API / Enable APIs
   - 在左侧菜单选择 "API和服务" > "库" / Select "APIs & Services" > "Library"
   - 搜索 "Google+ API" 或 "Google People API"
   - 点击 "启用" / Click "Enable"

4. 创建凭据 / Create credentials
   - 选择 "API和服务" > "凭据" / Select "APIs & Services" > "Credentials"
   - 点击 "创建凭据" > "OAuth 客户端 ID" / Click "Create Credentials" > "OAuth client ID"
   - 选择应用类型: "Web 应用" / Select application type: "Web application"
   
5. 配置 OAuth 同意屏幕 / Configure OAuth consent screen
   - 用户类型: 外部 / User Type: External
   - 填写应用名称: "AI Echo Market"
   - 填写用户支持电子邮件 / Fill in user support email
   - 添加授权域 (如果部署): localhost (开发环境不需要) / Add authorized domains

6. 添加重定向 URI / Add Redirect URIs
   - 授权的重定向 URI / Authorized redirect URIs:
     ```
     http://localhost:3001/auth/google/callback
     ```
   - 如果部署到生产环境，添加生产 URL / For production, add:
     ```
     https://yourdomain.com/auth/google/callback
     ```

7. 获取凭据 / Get credentials
   - 复制 "客户端 ID" / Copy "Client ID"
   - 复制 "客户端密钥" / Copy "Client Secret"

8. 更新 .env 文件 / Update .env file
   ```env
   GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret-here
   ```

#### 2. OpenAI API 密钥 / OpenAI API Key

**获取步骤 / Steps to obtain:**

1. 访问 OpenAI Platform / Visit OpenAI Platform
   - https://platform.openai.com/

2. 注册或登录 / Sign up or log in
   - 使用 Google、Microsoft 或 Email 注册 / Sign up with Google, Microsoft, or Email

3. 进入 API 密钥页面 / Navigate to API Keys
   - 点击右上角头像 / Click your profile icon
   - 选择 "View API keys" / Select "View API keys"
   - 或直接访问 / Or visit: https://platform.openai.com/api-keys

4. 创建新密钥 / Create new key
   - 点击 "Create new secret key" / Click "Create new secret key"
   - 给密钥命名，如 "AI Echo Market" / Name it, e.g., "AI Echo Market"
   - 复制密钥 / Copy the key (只显示一次! / shown only once!)

5. 更新 .env 文件 / Update .env file
   ```env
   OPENAI_API_KEY=sk-...your-key-here
   ```

**注意 / Note:**
- OpenAI API 需要付费使用 / OpenAI API requires payment
- 建议设置使用限额以控制成本 / Recommended to set usage limits
- 每日生成一条新闻成本约 $0.001-0.01 / Daily news generation costs ~$0.001-0.01

#### 3. 会话密钥 / Session Secret

生成强随机密钥 / Generate a strong random secret:

**方法 1: 使用 Node.js / Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**方法 2: 使用 OpenSSL / Using OpenSSL**
```bash
openssl rand -hex 32
```

**方法 3: 在线生成 / Online generator**
- https://randomkeygen.com/

更新 .env 文件 / Update .env file:
```env
SESSION_SECRET=your-generated-secret-here
```

### 完整 .env 配置示例 / Complete .env Example

```env
# Server Configuration
PORT=3001

# Session Secret (generate a random string)
SESSION_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

# Google OAuth 2.0
GOOGLE_CLIENT_ID=123456789-abcdefghijk.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnop
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

# Client URL
CLIENT_URL=http://localhost:3000

# OpenAI API
OPENAI_API_KEY=sk-proj-abcdefghijklmnopqrstuvwxyz123456
```

## 生产环境配置 / Production Configuration

### 环境变量更新 / Update Environment Variables

```env
PORT=3001
NODE_ENV=production

SESSION_SECRET=your-production-secret-here

GOOGLE_CLIENT_ID=your-production-client-id
GOOGLE_CLIENT_SECRET=your-production-client-secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/auth/google/callback

CLIENT_URL=https://yourdomain.com

OPENAI_API_KEY=your-openai-api-key
```

### Google OAuth 生产配置 / Google OAuth Production Setup

1. 在 Google Cloud Console 中添加生产域名 / Add production domain in Google Cloud Console
2. 更新授权重定向 URI / Update authorized redirect URIs
3. 更新授权的 JavaScript 源 / Update authorized JavaScript origins:
   ```
   https://yourdomain.com
   ```

### 安全建议 / Security Recommendations

1. **使用 HTTPS** / Use HTTPS
   - 生产环境必须使用 HTTPS / Production must use HTTPS
   - 可使用 Let's Encrypt 免费证书 / Use Let's Encrypt for free SSL

2. **环境变量管理** / Environment Variable Management
   - 不要将 .env 提交到代码仓库 / Never commit .env to repository
   - 使用服务器的环境变量或密钥管理服务 / Use server env vars or secrets management

3. **数据库** / Database
   - 生产环境建议使用 PostgreSQL 或 MySQL / Use PostgreSQL or MySQL in production
   - 定期备份数据库 / Regular database backups

4. **会话存储** / Session Storage
   - 使用 Redis 存储会话 / Use Redis for session storage
   - 设置适当的会话过期时间 / Set appropriate session expiration

5. **API 速率限制** / API Rate Limiting
   - 添加 express-rate-limit 中间件 / Add express-rate-limit middleware
   - 限制 API 调用频率 / Limit API call frequency

## 故障排除 / Troubleshooting

### 问题: Google OAuth 登录失败 / Google OAuth login fails

**解决方案 / Solutions:**
1. 检查 GOOGLE_CALLBACK_URL 是否正确 / Verify GOOGLE_CALLBACK_URL
2. 确认 Google Cloud Console 中的重定向 URI 匹配 / Ensure redirect URI matches in Google Cloud Console
3. 检查 Google+ API 是否已启用 / Check if Google+ API is enabled
4. 查看浏览器控制台错误 / Check browser console for errors

### 问题: OpenAI API 调用失败 / OpenAI API calls fail

**解决方案 / Solutions:**
1. 验证 API 密钥是否正确 / Verify API key is correct
2. 检查 OpenAI 账户余额 / Check OpenAI account balance
3. 查看 API 使用限额 / Check API usage limits
4. 查看服务器日志 / Check server logs

### 问题: WebSocket 连接失败 / WebSocket connection fails

**解决方案 / Solutions:**
1. 确认 WS_URL 设置正确 / Verify WS_URL is correct
2. 检查防火墙设置 / Check firewall settings
3. 生产环境使用 wss:// (加密) / Use wss:// in production (encrypted)

### 问题: 数据库错误 / Database errors

**解决方案 / Solutions:**
1. 确保有写入权限 / Ensure write permissions
2. 检查磁盘空间 / Check disk space
3. 删除 market.db 重新初始化 / Delete market.db and reinitialize

## 开发工具推荐 / Development Tools

- **Postman**: API 测试 / API testing
- **DB Browser for SQLite**: 数据库查看 / Database viewing
- **React Developer Tools**: React 调试 / React debugging
- **Redux DevTools**: 状态管理调试 / State management debugging (if needed)

## 更多帮助 / Further Help

如有问题，请在 GitHub 仓库提交 Issue:
For issues, please submit an issue on GitHub:
https://github.com/rakei076/AI-Echo-Market-/issues
