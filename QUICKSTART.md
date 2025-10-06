# 快速开始指南 / Quick Start Guide

## 最快速启动（5分钟）

### 步骤 1: 克隆并安装
```bash
git clone https://github.com/rakei076/AI-Echo-Market-.git
cd AI-Echo-Market-
chmod +x setup.sh
./setup.sh
```

### 步骤 2: 配置 API 密钥
编辑 `.env` 文件，添加你的密钥：
```bash
nano .env  # 或使用你喜欢的编辑器
```

必需的配置（详细步骤见 CONFIGURATION.md）：
- Google OAuth Client ID 和 Secret
- OpenAI API Key
- Session Secret（随机字符串）

### 步骤 3: 启动应用
```bash
npm run dev
```

### 步骤 4: 访问
打开浏览器访问 `http://localhost:3000`

## 测试模式（无需真实 API 密钥）

如果你只想测试应用但没有 API 密钥，可以使用模拟模式：

### 修改 newsGenerator.js
注释掉 OpenAI API 调用部分，系统将自动使用预设的新闻。

### 修改 passport.js  
暂时可以跳过 Google OAuth 进行本地测试（需要修改代码）。

## 应用功能演示

### 1. 登录界面
- 显示 Google 登录按钮
- 介绍应用功能

### 2. 主界面（登录后）
```
┌─────────────────────────────────────────────────────────┐
│  Header: AI Echo Market              欢迎, [用户名] 登出 │
├─────────────────────────────────────────────────────────┤
│  Echo Corp (ECHO)                                        │
│  $100.25  +0.50 (+0.50%)                                │
├─────────────────────────────────────────────────────────┤
│  [日] [周] [月] [年]                                      │
│  ┌─────────────────────────────────────────────────┐    │
│  │         股价图表                                  │    │
│  │         📈                                       │    │
│  └─────────────────────────────────────────────────┘    │
├──────────────────────────┬──────────────────────────────┤
│  📰 最新消息              │  💼 持仓情况                  │
│  ┌──────────────────┐   │  可用资金: $9,500.00        │
│  │ 新闻标题          │   │  持有股数: 5                 │
│  │ 新闻内容...       │   │  持仓市值: $501.25          │
│  │ 日期 • 利好       │   │  总资产: $10,001.25         │
│  └──────────────────┘   │                              │
│                          │  💰 交易                      │
│                          │  股数: [___]                 │
│                          │  总价: $500.00               │
│                          │  [买入] [卖出]               │
└──────────────────────────┴──────────────────────────────┘
```

## 核心工作流程

### 价格更新流程
```
每 10 秒:
1. 读取今日新闻的涨跌设定
2. 随机决定本次涨或跌
3. 更新数据库
4. 通过 WebSocket 推送到前端
5. 前端实时更新图表和价格显示
```

### 新闻生成流程
```
每天午夜:
1. 调用 OpenAI API
2. 生成新闻标题和内容
3. 分析情绪（正面/负面）
4. 计算影响值（-50 到 +50）
5. 设定明日涨跌次数
6. 保存到数据库
```

### 交易流程
```
用户点击买入:
1. 验证用户登录状态
2. 检查资金是否充足
3. 开始数据库事务
4. 扣除资金
5. 增加持股
6. 记录交易
7. 提交事务
8. 返回成功消息
```

## 常用命令

### 开发
```bash
# 同时启动前后端
npm run dev

# 只启动后端
npm run server

# 只启动前端
npm run client
```

### 数据库管理
```bash
# 查看数据库
sqlite3 server/market.db

# 重置数据库（删除所有数据）
rm server/market.db
# 重启服务器会自动创建新数据库
```

### 生产部署
```bash
# 构建前端
cd client
npm run build
cd ..

# 启动生产服务器
NODE_ENV=production npm start
```

## 技术架构

### 后端技术栈
- **Express**: REST API 服务器
- **SQLite**: 轻量级数据库
- **Passport**: 认证中间件
- **WebSocket**: 实时通信
- **OpenAI**: AI 内容生成

### 前端技术栈
- **React**: UI 框架
- **Recharts**: 图表库
- **Axios**: HTTP 客户端
- **WebSocket**: 实时数据接收

### 数据流
```
客户端 ←→ WebSocket ←→ 服务器
   ↓                      ↓
 Recharts              SQLite
 (图表)               (数据库)
   ↓                      ↑
用户交互 → HTTP API → 业务逻辑
                          ↑
                      OpenAI API
                     (新闻生成)
```

## API 端点速查

| 端点 | 方法 | 说明 | 认证 |
|------|------|------|------|
| `/auth/google` | GET | 启动 Google 登录 | ❌ |
| `/auth/user` | GET | 获取当前用户 | ✅ |
| `/auth/logout` | GET | 登出 | ✅ |
| `/api/stock/price` | GET | 获取当前价格 | ❌ |
| `/api/stock/history` | GET | 获取历史价格 | ❌ |
| `/api/news/latest` | GET | 获取最新新闻 | ❌ |
| `/api/user/portfolio` | GET | 获取用户持仓 | ✅ |
| `/api/user/buy` | POST | 买入股票 | ✅ |
| `/api/user/sell` | POST | 卖出股票 | ✅ |

## 下一步

1. 阅读 [CONFIGURATION.md](CONFIGURATION.md) 了解详细配置
2. 查看 [README.md](README.md) 了解完整功能
3. 开始开发或部署应用！

## 常见问题

**Q: 我可以修改初始资金吗？**
A: 可以，在 `server/database.js` 中修改 `balance REAL DEFAULT 10000.0`

**Q: 价格更新频率可以调整吗？**
A: 可以，在 `server/services/priceSimulator.js` 中修改 `setInterval(simulatePriceMove, 10000)` 的时间

**Q: 可以添加多支股票吗？**
A: 当前架构支持单股票，但可以扩展数据库和 API 支持多股票

**Q: 如何备份用户数据？**
A: 复制 `server/market.db` 文件即可

## 获取帮助

- 📖 查看文档: README.md, CONFIGURATION.md
- 🐛 报告问题: GitHub Issues
- 💬 讨论: GitHub Discussions
