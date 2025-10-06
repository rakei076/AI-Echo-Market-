# 故障排除指南 / Troubleshooting Guide

## 常见问题及解决方案

### 安装问题 / Installation Issues

#### 问题: npm install 失败
```
Error: Cannot find module 'xxx'
```

**解决方案:**
```bash
# 清除 npm 缓存
npm cache clean --force

# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json
rm -rf client/node_modules client/package-lock.json

# 重新安装
npm install
cd client && npm install
```

#### 问题: Python 相关错误（node-gyp）
```
gyp ERR! find Python
```

**解决方案:**
```bash
# macOS/Linux
sudo apt-get install python3  # Linux
brew install python3          # macOS

# Windows
# 下载并安装 Python 3.x
# 或运行: npm install --global windows-build-tools
```

### 运行时问题 / Runtime Issues

#### 问题: 服务器启动失败
```
Error: listen EADDRINUSE: address already in use :::3001
```

**解决方案:**
```bash
# 查找占用端口的进程
lsof -i :3001  # macOS/Linux
netstat -ano | findstr :3001  # Windows

# 终止进程
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# 或更改端口
# 编辑 .env 文件
PORT=3002
```

#### 问题: 数据库错误
```
Error: SQLITE_CANTOPEN: unable to open database file
```

**解决方案:**
```bash
# 检查权限
chmod 755 server
chmod 644 server/market.db  # 如果文件存在

# 或删除并重新创建
rm server/market.db
# 重启服务器会自动创建
```

#### 问题: WebSocket 连接失败
```
WebSocket connection failed
```

**解决方案:**
1. 确认服务器正在运行
2. 检查浏览器控制台的具体错误
3. 验证 WS_URL 配置正确
   ```javascript
   // client/src/App.js
   const WS_URL = 'ws://localhost:3001';
   ```
4. 检查防火墙设置

### 认证问题 / Authentication Issues

#### 问题: Google OAuth 重定向失败
```
Error: redirect_uri_mismatch
```

**解决方案:**
1. 检查 Google Cloud Console 中的重定向 URI
2. 确保 .env 中的 GOOGLE_CALLBACK_URL 匹配
3. 常见错误：
   ```
   错误: http://localhost:3001/auth/google/callback/
   正确: http://localhost:3001/auth/google/callback
   注意末尾的斜杠！
   ```

#### 问题: Session 不持久
```
User keeps getting logged out
```

**解决方案:**
```javascript
// server/index.js
// 确保 cookie 配置正确
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,  // 开发环境设为 false
    maxAge: 24 * 60 * 60 * 1000
  }
}));
```

### API 问题 / API Issues

#### 问题: OpenAI API 调用失败
```
Error: Invalid API key
```

**解决方案:**
1. 验证 API 密钥格式正确（以 sk- 开头）
2. 检查 OpenAI 账户状态和余额
3. 确认 .env 文件中没有多余空格
   ```env
   # 错误
   OPENAI_API_KEY= sk-xxx
   
   # 正确
   OPENAI_API_KEY=sk-xxx
   ```

#### 问题: Rate limit exceeded
```
Error: Rate limit reached
```

**解决方案:**
1. 等待一段时间后重试
2. 检查 OpenAI 使用限额
3. 减少 API 调用频率
4. 使用预设新闻作为后备

### 前端问题 / Frontend Issues

#### 问题: 图表不显示
```
Chart component renders but shows nothing
```

**解决方案:**
1. 检查浏览器控制台错误
2. 验证数据格式
3. 确认 Recharts 正确安装
   ```bash
   cd client
   npm install recharts --save
   ```

#### 问题: CORS 错误
```
Access to XMLHttpRequest blocked by CORS policy
```

**解决方案:**
```javascript
// server/index.js
app.use(cors({
  origin: 'http://localhost:3000',  // 确保匹配客户端 URL
  credentials: true
}));
```

#### 问题: 代理不工作
```
Proxy error: Could not proxy request
```

**解决方案:**
```json
// client/package.json
{
  "proxy": "http://localhost:3001"
}
```
确保服务器在 3001 端口运行。

### 数据问题 / Data Issues

#### 问题: 价格不更新
```
Stock price frozen
```

**解决方案:**
1. 检查服务器日志
2. 验证价格模拟器正在运行
3. 检查 WebSocket 连接状态
4. 重启服务器

#### 问题: 新闻不生成
```
No news available
```

**解决方案:**
1. 手动触发新闻生成：
   ```javascript
   // 在服务器运行时调用
   const { generateDailyNews } = require('./server/services/newsGenerator');
   generateDailyNews();
   ```
2. 检查 OpenAI API 状态
3. 查看服务器日志中的错误

### 性能问题 / Performance Issues

#### 问题: 应用运行缓慢
```
Application feels sluggish
```

**解决方案:**
1. 清理数据库（删除旧数据）
   ```sql
   DELETE FROM stock_prices WHERE timestamp < datetime('now', '-7 days');
   ```
2. 优化图表数据量
3. 检查内存使用
4. 关闭不必要的浏览器扩展

#### 问题: 内存泄漏
```
Memory usage keeps increasing
```

**解决方案:**
1. 检查 WebSocket 连接是否正确关闭
2. 清理定时器
3. 重启应用

### 部署问题 / Deployment Issues

#### 问题: 生产环境无法访问
```
Cannot access deployed application
```

**解决方案:**
1. 检查防火墙规则
2. 验证端口开放
3. 检查 HTTPS 配置
4. 查看服务器日志

#### 问题: 环境变量未加载
```
Environment variables not working in production
```

**解决方案:**
1. 不要依赖 .env 文件
2. 使用平台的环境变量设置
3. 验证变量已设置：
   ```bash
   echo $GOOGLE_CLIENT_ID
   ```

## 调试技巧

### 启用详细日志
```javascript
// server/index.js
// 添加请求日志
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

### 检查数据库内容
```bash
sqlite3 server/market.db

# 查看用户
SELECT * FROM users;

# 查看最新价格
SELECT * FROM stock_prices ORDER BY timestamp DESC LIMIT 10;

# 查看新闻
SELECT * FROM news ORDER BY created_at DESC LIMIT 5;
```

### 测试 API 端点
```bash
# 获取当前价格
curl http://localhost:3001/api/stock/price

# 获取新闻
curl http://localhost:3001/api/news/latest

# 测试健康检查（如果添加）
curl http://localhost:3001/health
```

### 浏览器开发者工具
1. Network 标签：查看 API 请求
2. Console 标签：查看 JavaScript 错误
3. Application 标签：查看 cookies 和 localStorage
4. WebSocket 标签：查看实时连接

## 获取帮助

如果以上方案都无法解决你的问题：

1. **查看日志**
   - 服务器日志
   - 浏览器控制台
   - 网络请求

2. **搜索现有 Issues**
   - https://github.com/rakei076/AI-Echo-Market-/issues

3. **创建新 Issue**
   - 提供详细错误信息
   - 包含复现步骤
   - 附上环境信息

4. **社区讨论**
   - GitHub Discussions
   - Stack Overflow (使用标签 `ai-echo-market`)

## 系统要求

确保你的系统满足以下要求：

- Node.js 14.x 或更高
- npm 6.x 或更高
- 2GB+ 可用内存
- 1GB+ 可用磁盘空间
- 现代浏览器（Chrome 90+, Firefox 88+, Safari 14+）

## 重置应用

如果一切都失败了，可以完全重置：

```bash
# 停止所有服务
# Ctrl+C

# 删除所有数据
rm -rf node_modules client/node_modules
rm server/market.db
rm package-lock.json client/package-lock.json

# 重新安装
./setup.sh

# 重新配置 .env
nano .env

# 重启
npm run dev
```

---

*如果你发现了新的问题和解决方案，欢迎提交 PR 更新此文档！*
