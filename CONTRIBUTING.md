# 贡献指南 / Contributing Guide

感谢你对 AI Echo Market 项目的兴趣！我们欢迎各种形式的贡献。

## 如何贡献

### 报告问题 / Reporting Issues

如果你发现了 bug 或有功能建议：

1. 在 [GitHub Issues](https://github.com/rakei076/AI-Echo-Market-/issues) 中搜索，确保问题未被报告
2. 创建新 Issue，提供以下信息：
   - 清晰的标题
   - 详细的描述
   - 复现步骤（如果是 bug）
   - 期望的行为
   - 实际的行为
   - 屏幕截图（如果适用）
   - 环境信息（操作系统、Node.js 版本等）

### 提交代码 / Submitting Code

1. **Fork 仓库**
   ```bash
   # 在 GitHub 上点击 Fork 按钮
   git clone https://github.com/YOUR_USERNAME/AI-Echo-Market-.git
   cd AI-Echo-Market-
   ```

2. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

3. **进行更改**
   - 遵循现有代码风格
   - 添加必要的注释
   - 更新文档（如果需要）

4. **测试更改**
   ```bash
   npm run dev
   # 确保应用正常运行
   ```

5. **提交更改**
   ```bash
   git add .
   git commit -m "描述你的更改"
   ```

   提交信息格式：
   - `feat: 添加新功能`
   - `fix: 修复 bug`
   - `docs: 更新文档`
   - `style: 代码格式调整`
   - `refactor: 代码重构`
   - `test: 添加测试`

6. **推送到 GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **创建 Pull Request**
   - 在 GitHub 上打开 Pull Request
   - 描述你的更改
   - 链接相关的 Issues

## 代码风格

### JavaScript
- 使用 ES6+ 语法
- 使用 2 空格缩进
- 使用分号
- 使用有意义的变量名
- 添加适当的注释

### React
- 使用函数组件和 Hooks
- 遵循 React 最佳实践
- 保持组件小而专注

### 后端
- 使用 async/await 而非回调
- 适当的错误处理
- 使用有意义的 API 端点名称

## 项目结构约定

```
server/
├── config/        # 配置文件
├── routes/        # API 路由
├── services/      # 业务逻辑
└── database.js    # 数据库操作

client/src/
├── components/    # React 组件
├── App.js         # 主应用
└── App.css        # 样式
```

## 功能建议

以下是一些可以贡献的功能想法：

### 后端改进
- [ ] 添加多股票支持
- [ ] 实现交易手续费
- [ ] 添加限价单功能
- [ ] 实现止损/止盈订单
- [ ] 添加用户排行榜
- [ ] 实现股票分红系统
- [ ] 添加市场指数计算
- [ ] 实现更复杂的 AI 新闻生成

### 前端改进
- [ ] 添加深色/浅色主题切换
- [ ] 实现更多图表类型（K线图、蜡烛图）
- [ ] 添加技术指标（MA, MACD, RSI）
- [ ] 改进移动端响应式设计
- [ ] 添加交易通知系统
- [ ] 实现持仓分析图表
- [ ] 添加交易历史可视化
- [ ] 实现实时价格警报

### 数据和算法
- [ ] 更真实的价格模拟算法
- [ ] 添加市场深度数据
- [ ] 实现成交量模拟
- [ ] 添加市场情绪分析
- [ ] 实现多日新闻影响

### 测试
- [ ] 添加单元测试
- [ ] 添加集成测试
- [ ] 添加端到端测试
- [ ] 设置 CI/CD 流程

### 文档
- [ ] 添加 API 文档
- [ ] 创建视频教程
- [ ] 翻译到其他语言
- [ ] 添加更多示例

## 开发环境设置

1. **安装依赖**
   ```bash
   ./setup.sh
   ```

2. **配置环境**
   ```bash
   cp .env.example .env
   # 编辑 .env 添加你的 API 密钥
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

## 测试

目前项目还没有自动化测试。如果你想贡献测试：

1. 添加测试框架（如 Jest）
2. 编写单元测试
3. 编写集成测试
4. 更新此文档

## 代码审查流程

所有 Pull Request 都需要经过审查：

1. 自动化检查（当设置后）
2. 代码审查
3. 功能测试
4. 批准并合并

## 社区准则

- 尊重所有贡献者
- 提供建设性的反馈
- 欢迎新手贡献
- 保持友好和专业

## 获取帮助

如果你需要帮助：

- 💬 在 Issue 中提问
- 📧 发送邮件给维护者
- 📖 查看现有文档

## 许可证

通过贡献代码，你同意你的贡献将在 MIT 许可证下发布。

## 致谢

感谢所有为这个项目做出贡献的人！

---

再次感谢你的贡献！🎉
