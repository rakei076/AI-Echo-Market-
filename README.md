# AI Echo Market - AI 股市模拟器

一个名为"AI 股市模拟器"的网页应用。该应用模拟一家虚拟公司（Echo Corp）的股票交易。其核心特点是，股票的每日价格波动完全由一个内部的 AI 系统根据其生成的"新闻"来决定，用户可以通过买卖该虚拟股票来体验交易。

## 核心功能

### 1. AI 驱动的新闻生成
- 每日自动生成关于 Echo Corp 的新闻
- 新闻由 OpenAI GPT 生成，包含标题、内容和情绪分析
- 根据新闻情绪（利好/利空）预设当日股价涨跌趋势

### 2. 智能股价模拟
- 股价波动完全基于 AI 生成的新闻
- 系统预设每日总体涨跌目标和日内波动次数
- 使用随机算法分配涨跌，创造真实的价格曲线
- 实时价格更新（每10秒）

### 3. 交互式股价图表
- 支持多时间范围查看（日/周/月/年）
- 实时更新的折线图
- 显示当前价格和价格变化

### 4. Google 账号登录
- 使用 Google OAuth 2.0 进行身份验证
- 新用户自动获得 $10,000 虚拟初始资金
- 安全的会话管理

### 5. 完整的交易系统
- 买入/卖出功能
- 实时持仓显示
- 资金余额管理
- 交易历史记录

## 技术栈

### 后端
- **Node.js + Express**: 服务器框架
- **SQLite**: 数据库
- **Passport.js**: Google OAuth 认证
- **WebSocket (ws)**: 实时价格推送
- **OpenAI API**: AI 新闻生成

### 前端
- **React**: UI 框架
- **Recharts**: 图表库
- **Axios**: HTTP 客户端

## 安装和运行

### 前置要求
- Node.js 14+
- npm 或 yarn
- Google OAuth 客户端凭证
- OpenAI API 密钥

### 1. 克隆仓库
```bash
git clone https://github.com/rakei076/AI-Echo-Market-.git
cd AI-Echo-Market-
```

### 2. 安装依赖
```bash
# 安装服务端依赖
npm install

# 安装客户端依赖
cd client
npm install
cd ..
```

### 3. 配置环境变量
复制 `.env.example` 到 `.env` 并填入你的配置：

```env
PORT=3001
SESSION_SECRET=your-random-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
CLIENT_URL=http://localhost:3000
OPENAI_API_KEY=your-openai-api-key
```

### 4. 获取 Google OAuth 凭证
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google+ API
4. 创建 OAuth 2.0 客户端 ID
5. 添加授权重定向 URI: `http://localhost:3001/auth/google/callback`
6. 复制客户端 ID 和密钥到 `.env` 文件

### 5. 获取 OpenAI API 密钥
1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 创建账户并获取 API 密钥
3. 将密钥添加到 `.env` 文件

### 6. 运行应用

#### 开发模式（推荐）
```bash
# 在项目根目录
npm run dev
```
这将同时启动服务端（端口 3001）和客户端（端口 3000）

#### 分别运行
```bash
# 终端 1 - 运行服务端
npm run server

# 终端 2 - 运行客户端
npm run client
```

### 7. 访问应用
打开浏览器访问 `http://localhost:3000`

## 项目结构

```
AI-Echo-Market-/
├── server/
│   ├── config/
│   │   └── passport.js          # Passport Google OAuth 配置
│   ├── routes/
│   │   ├── auth.js              # 认证路由
│   │   ├── stock.js             # 股票数据路由
│   │   ├── user.js              # 用户操作路由
│   │   └── news.js              # 新闻路由
│   ├── services/
│   │   ├── newsGenerator.js     # AI 新闻生成服务
│   │   └── priceSimulator.js    # 股价模拟服务
│   ├── database.js              # 数据库操作
│   └── index.js                 # 服务器入口
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── StockChart.js    # 股价图表组件
│   │   │   ├── NewsFeed.js      # 新闻列表组件
│   │   │   ├── Portfolio.js     # 持仓组件
│   │   │   └── TradingPanel.js  # 交易面板组件
│   │   ├── App.js               # 主应用组件
│   │   └── App.css              # 样式文件
│   └── package.json
├── package.json
├── .env.example
└── README.md
```

## 数据库结构

### users 表
- 用户信息
- Google ID
- 初始资金余额 ($10,000)

### stock_prices 表
- 历史股价记录
- 时间戳

### news 表
- AI 生成的新闻
- 情绪分析
- 预设涨跌参数

### transactions 表
- 买卖交易记录
- 交易价格和股数

### holdings 表
- 用户持股数量

## 核心算法

### 新闻生成
1. 每日午夜自动触发
2. 调用 OpenAI API 生成新闻
3. 提取情绪和影响值
4. 计算预设涨跌次数（ups/downs）
5. 存储到数据库

### 价格模拟
1. 读取当日新闻预设的涨跌参数
2. 每10秒执行一次价格更新
3. 根据剩余涨跌次数随机决定本次走向
4. 计算价格变动幅度（0.1-2.0点）
5. 更新数据库并通过 WebSocket 广播

## API 端点

### 认证
- `GET /auth/google` - 启动 Google OAuth 流程
- `GET /auth/google/callback` - OAuth 回调
- `GET /auth/user` - 获取当前用户
- `GET /auth/logout` - 登出

### 股票
- `GET /api/stock/price` - 获取当前股价
- `GET /api/stock/history?range=day` - 获取历史数据

### 用户
- `GET /api/user/portfolio` - 获取用户持仓
- `GET /api/user/transactions` - 获取交易历史
- `POST /api/user/buy` - 买入股票
- `POST /api/user/sell` - 卖出股票

### 新闻
- `GET /api/news/latest?limit=10` - 获取最新新闻
- `GET /api/news/today` - 获取今日新闻

## 部署

### 生产环境构建
```bash
# 构建客户端
cd client
npm run build
cd ..

# 设置生产环境变量
export NODE_ENV=production

# 启动服务器
npm start
```

### 环境变量配置
确保在生产环境中设置所有必要的环境变量，特别是：
- `SESSION_SECRET`: 使用强随机密钥
- `GOOGLE_CALLBACK_URL`: 更新为生产域名
- `CLIENT_URL`: 更新为生产域名

## 注意事项

1. **API 密钥安全**: 不要将 `.env` 文件提交到版本控制
2. **OpenAI 限额**: 注意 OpenAI API 的使用限额和费用
3. **数据库**: SQLite 适合开发，生产环境建议使用 PostgreSQL 或 MySQL
4. **会话管理**: 生产环境建议使用 Redis 存储会话

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
