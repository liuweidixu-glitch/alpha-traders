# TRADING WAR ROOM — Code Wiki

> **TRADING WAR ROOM CORP** — Personal AI Trading Company  
> **Version**: v25.7  
> **Description**: 一个基于多智能体系统的AI交易平台，集成像素风格办公室可视化、回测引擎、知识库自适应学习和MT5 EA桥接

---

## 目录

1. [项目概述](#1-项目概述)
2. [整体架构](#2-整体架构)
3. [目录结构](#3-目录结构)
4. [核心模块详解](#4-核心模块详解)
5. [关键类与函数](#5-关键类与函数)
6. [依赖关系](#6-依赖关系)
7. [数据流程](#7-数据流程)
8. [项目运行方式](#8-项目运行方式)
9. [部署指南](#9-部署指南)
10. [配置说明](#10-配置说明)

---

## 1. 项目概述

### 1.1 项目简介

TRADING WAR ROOM 是一个**个人AI交易公司**系统，采用"公司化"隐喻，将各种交易策略和分析工具封装为不同角色的"员工"智能体。系统通过14种不同的分析技术（Agent）对金融市场进行多维度分析，通过共识机制生成交易信号，并支持MT5自动交易。

### 1.2 核心特性

- **🧠 多智能体系统**: 14种分析Agent（SMC、Elliott Wave、Fibonacci、RSI、MACD、Bollinger等）
- **🏢 像素办公室可视化**: Agent HQ实时展示员工工作状态的像素风格场景
- **📚 自适应知识库**: KB (KnowledgeBase) 根据历史交易数据动态调整Agent权重
- **🔬 回测引擎**: 支持历史数据回测和策略优化
- **🤖 MT5 EA桥接**: 通过Google Apps Script连接MT5 Expert Advisor实现自动交易
- **🌐 Gemini AI集成**: 通过AIBridge连接Google Gemini/Groq进行策略优化
- **📱 响应式设计**: 支持桌面端和移动端
- **🇹🇭 多语言**: 泰语/英语双语支持

### 1.3 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | 原生JavaScript + HTML5 Canvas + CSS3 |
| 桥接层 | Google Apps Script |
| 交易执行 | MQL5 (MT5 Expert Advisor) |
| AI | Google Gemini / Groq (通过Apps Script代理) |
| 数据存储 | localStorage / sessionStorage / ScriptProperties |
| 部署 | GitHub Pages / Cloudflare Pages / Vercel / Apps Script |

---

## 2. 整体架构

### 2.1 三层架构模型

系统采用经典的三层架构设计：

```
┌──────────────────────────────────────────────────────────────┐
│  LAYER 1 — BRAIN (Web · GitHub Pages)                         │
│  https://armza332.github.io/trade-ai-agent/                   │
│                                                                │
│  • 14 Analyst Agents (per symbol) → Team → Commander          │
│  • KnowledgeBase (KB) — adaptive weights, regime-aware         │
│  • Company View · Office HQ · Secretary chat · Auto Pilot      │
│  • Backtest Lab + Auto-Optimize (trains KB)                   │
└───────────────────────────┬──────────────────────────────────┘
                            │ Apps Script bridge (HTTPS)
                            ▼
┌──────────────────────────────────────────────────────────────┐
│  LAYER 2 — NERVOUS SYSTEM (Google Apps Script)                │
│  mt5/BridgeCode.gs  → /exec                                   │
│                                                                │
│  • Stores: LATEST_STATUS · LATEST_PRICES · HISTORY ·          │
│    LIVE_TRADES (dedup by posId) · command queue               │
│  • EA POSTs status/prices/trades · Web GETs them              │
│  • Web POSTs commands · EA polls them                         │
└───────────────────────────┬──────────────────────────────────┘
                            │ WebRequest (HTTPS)
                            ▼
┌──────────────────────────────────────────────────────────────┐
│  LAYER 3 — MUSCLE (MT5 Expert Advisor)                        │
│  mt5/TradingWarRoom_EA.mq5  · magic 992511                    │
│                                                                │
│  • Strategy: RSI + Bollinger + Fibonacci confluence           │
│  • Modes: 🌊 Swing (H1) · ⚡ Scalp (M1/M5/M15)               │
│  • Risk Manager: Breakeven · Trailing SL · Portfolio guard    │
│  • BOSS dashboard on-chart + clickable STOP/RESUME/CLOSE      │
│  • Executes own signals + accepts Web AI signals              │
│  • Records every closed trade → Web KB                        │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 公司组织隐喻

系统使用"公司"组织架构来隐喻交易系统的各个组件：

| 角色 | 对应模块 | 职责 |
|------|----------|------|
| 👔 **CEO** | 用户 | Human-in-the-loop，最终决策者 |
| 📋 **Secretary (Janie)** | Chat界面 | Q&A对话 + 命令路由 |
| 📈 **Trade Desk** | 3个Trader (XAU/AUD/EUR) | 每个交易员 = 14种技术分析 |
| 🧠 **Strategy Officer** | KB学习模块 | 盈亏报告 + 自动调整策略 |
| 📊 **Accountant** | Company视图 | P&L计算、目标进度、交易原因 |
| 💻 **Dev Monitor** | 健康检查 | EA/桥接/数据feed健康监控 |
| 🛡 **Risk Officer** | EA风险管理 | 盈亏平衡、追踪止损、投资组合保护 |
| 🤖 **Claude/Gemini Advisor** | AI模块 | 基于规则的建议 + AI对话 |

### 2.3 14个分析Agent

| # | Agent名称 | 类型 | 风格 |
|---|----------|------|------|
| 1 | SMC | structure | OB/FVG/BOS |
| 2 | Elliott | structure | 波浪计数 |
| 3 | Fibonacci | structure | 回撤位 |
| 4 | RSI/Value | momentum | 超买/超卖 |
| 5 | MACD | trend | 动量交叉 |
| 6 | Bollinger | volatility | 均值回归 |
| 7 | Pivot | structure | S/R水平位 |
| 8 | Pattern | pattern | 蜡烛图形态 |
| 9 | Divergence | reversal | RSI/MACD vs价格 |
| 10 | Multi-TF | confluence | 1h+4h+D对齐 |
| 11 | Ichimoku | trend | 云系统 |
| 12 | DXY | macro | 美元强度 |
| 13 | UT-Bot | trend | ATR追踪止损 |
| 14 | News | sentiment | 事件日历 |

**决策流程**: 每个Agent投票 → `HeadAgent.aggregate()` (KB加权 + 共识/冲突) → `Commander.decide()` (共识≥55%, ADX门控, 自上而下MTF, 汇合) → 评级 S+/A/B/C/D

---

## 3. 目录结构

```
/workspace/
├── index.html                  # 主入口页面 — 交易控制室
├── agent-hq.html               # Agent HQ像素办公室页面
├── mobile.html                 # 移动端优化页面
├── ARCHITECTURE.md             # 架构文档
├── DEPLOY.md                   # 部署指南
├── build-appscript.ps1         # Apps Script构建脚本
├── build-appscript-multi.ps1   # 多文件Apps Script构建脚本
├── serve.ps1                   # 本地服务启动脚本
│
├── css/                        # 样式文件
│   ├── style.css               # 主样式
│   └── pixel-office.css        # 像素办公室样式
│
├── js/                         # JavaScript核心模块
│   ├── app.js                  # 主应用控制器
│   ├── market.js               # 市场引擎 + 技术分析
│   ├── agents.js               # 所有Agent、团队、指挥官
│   ├── ui.js                   # UI渲染引擎
│   ├── extras.js               # 信号评级 + Telegram + 设置 + 帮助
│   ├── i18n.js                 # 国际化 (泰/英)
│   ├── backtest.js             # 回测引擎
│   ├── portfolio.js            # 投资组合选择器
│   ├── ai-bridge.js            # AI桥接 (Gemini/Groq)
│   ├── gemini.js               # Gemini策略教练
│   ├── sprite-slicer.js        # 精灵切片工具
│   │
│   ├── agenthq-data.js         # Agent HQ数据定义
│   ├── agenthq-sprites.js      # Agent HQ精灵图
│   ├── agenthq-room.js         # Agent HQ房间渲染
│   └── agenthq-engine.js       # Agent HQ场景引擎
│
├── appscript/                  # Google Apps Script版本
│   ├── Code.gs                 # 主服务端代码
│   ├── Index.html              # 索引页
│   ├── Styles.html             # 样式
│   ├── Market.html             # 市场模块
│   ├── Agents.html             # Agent模块
│   ├── Ui.html                 # UI模块
│   ├── Extras.html             # 附加模块
│   ├── App.html                # 应用主逻辑
│   └── README.md               # Apps Script部署说明
│
├── mt5/                        # MT5 Expert Advisor
│   ├── TradingWarRoom_EA.mq5   # EA主程序 (MQL5)
│   ├── BridgeCode.gs           # 桥接Apps Script代码
│   └── README.md               # EA设置指南
│
├── assets/                     # 静态资源
│   ├── room-bg.png             # 房间背景
│   └── team-cards.png          # 团队卡片
│
├── design/                     # 设计/原型文件
│   ├── agent-office.html       # 设计原型
│   ├── agent-data.js           # 设计数据
│   ├── data.js                 # 设计数据
│   ├── engine.js               # 设计引擎
│   ├── room.js                 # 设计房间
│   ├── sprites.js              # 设计精灵
│   ├── tweaks-panel.jsx        # 调整面板 (JSX)
│   ├── screenshots/            # 设计截图
│   └── uploads/                # 上传文件
│
└── kb-backups/                 # 知识库备份
    ├── README.md
    └── kb-backup-1321trades.json
```

---

## 4. 核心模块详解

### 4.1 主应用控制器 — [app.js](file:///workspace/js/app.js)

**模块标识**: `TradingWarRoom` (全局单例对象)

**职责**:
- 初始化整个应用
- 协调市场引擎、分析团队、指挥官
- 管理更新周期（价格tick、完整分析、时钟）
- 处理真实价格feed循环
- 管理Keep-Alive、每日新闻、MT5桥接等附加功能

**核心属性**:
| 属性 | 类型 | 说明 |
|------|------|------|
| `market` | MarketEngine | 市场引擎实例 |
| `goldTeam` | GoldTeam | 黄金团队 (XAUUSD) |
| `fxTeam` | CurrencyTeam | 外汇团队 (AUDUSD + EURUSD) |
| `commander` | Commander | 指挥官实例 |
| `tickMs` | Number | 价格更新间隔 (800ms) |
| `updateMs` | Number | 完整分析更新间隔 (4000ms) |

**核心方法**:
| 方法 | 说明 |
|------|------|
| `init()` | 初始化所有模块，启动定时任务 |
| `priceTick()` | 价格tick — 更新价格显示、ticker、API速率指示器 |
| `fullUpdate()` | 完整分析更新 — 运行所有团队、指挥官、评级、汇合分析 |
| `_realPriceLoop()` | 真实价格feed循环 (独立节奏以遵守API速率限制) |
| `_loadRealHistory()` | 加载真实K线历史数据 (启动时 + 每4小时) |
| `_dailyNewsCheck()` | 每日新闻摘要检查 |
| `_upcomingNewsCheck()` | 即将到来的新闻预警 (每30分钟) |

---

### 4.2 市场引擎 — [market.js](file:///workspace/js/market.js)

**核心类**: `MarketEngine`

**职责**:
- 价格模拟/真实价格获取
- K线历史数据生成和管理
- 技术分析指标计算 (TA命名空间)
- 速率限制管理
- 历史数据缓存

**子模块**:

#### 4.2.1 RateLimiter
API速率限制器，防止超出免费API配额。
- 每分钟限制: 5次 (安全裕度)
- 每日限制: 800次 (Twelve Data免费计划)
- 自动暂停: 使用90%时自动暂停
- 持久化: localStorage存储调用记录

#### 4.2.2 HistoryCache
历史数据缓存，避免重复请求。
- 缓存时间: 5分钟
- 存储: sessionStorage
- Key格式: `twr_hist_{symbol}_{interval}_{size}`

#### 4.2.3 MarketEngine 核心属性
| 属性 | 类型 | 说明 |
|------|------|------|
| `symbols` | Object | 交易品种配置 (基础价格、pip、位数、ATR、趋势) |
| `candles` | Object | 各品种K线数据 |
| `prices` | Object | 当前价格 |
| `dxyPrice` | Number | 美元指数价格 |
| `dxyTrend` | Number | 美元趋势 |

**支持的交易品种**:
- `XAUUSD` — 黄金/美元
- `AUDUSD` — 澳元/美元
- `EURUSD` — 欧元/美元
- `BTCUSD` — 比特币/美元 (24/7加密货币)

#### 4.2.4 TA (Technical Analysis) 命名空间
包含所有技术分析指标计算函数:
- `atr()` — 平均真实波幅
- `rsi()` — 相对强弱指标
- `macd()` — 移动平均收敛发散
- `bollinger()` — 布林带
- `fibonacci()` — 斐波那契回撤
- `elliottWave()` — 艾略特波浪
- `smc()` / `bos()` / `fvg()` / `orderBlocks()` — SMC相关
- `ichimoku()` — 一目均衡表
- `adx()` — 平均趋向指数
- `pivotPoints()` — 枢轴点
- `candlestickPatterns()` — 蜡烛图形态
- `divergence()` — 背离检测
- `volumeProfile()` — 成交量分布

---

### 4.3 智能体系统 — [agents.js](file:///workspace/js/agents.js)

#### 4.3.1 基类 — `BaseAgent`

所有分析Agent的父类，定义通用属性和方法。

**属性**:
| 属性 | 类型 | 说明 |
|------|------|------|
| `name` | String | Agent名称 |
| `role` | String | 角色描述 |
| `icon` | String | emoji图标 |
| `team` | String | 所属团队 |
| `signal` | String | 信号: 'buy' / 'sell' / 'watch' / 'wait' |
| `conf` | Number | 置信度 (20-95) |
| `report` | Object | 详细分析报告 |
| `lastLog` | String | 最后日志 |

**方法**:
| 方法 | 说明 |
|------|------|
| `_randFluke(prob)` | 随机波动 (模拟真实市场不确定性) |
| `_conf(base)` | 计算带波动的置信度 |

#### 4.3.2 SMC相关Agent (Phase 19拆分)

| Agent类 | 图标 | 职责 |
|---------|------|------|
| `SMCAgent` | ⚡ | 综合SMC分析 (结构 + OB + FVG + BOS) |
| `OrderBlockAgent` | 🧱 | 机构供需区域 (Order Block) |
| `SweepAgent` | 💧 | 流动性清扫 + 反转 |
| `BreakoutAgent` | 🚀 | BOS突破 + 溢价/折扣区域 |
| `FVGAgent` | 🟦 | 公允价值缺口 (Fair Value Gap) |

#### 4.3.3 其他主要Agent

| Agent类 | 图标 | 类型 | 说明 |
|---------|------|------|------|
| `ElliottWaveAgent` | 🌊 | structure | 艾略特波浪计数 |
| `FibonacciAgent` | 📐 | structure | 斐波那契回撤/扩展 |
| `RSIValueAgent` | 📊 | momentum | RSI + ADX + 背离 + 成交量分布 |
| `MACDAgent` | 📈 | trend | MACD动量交叉 |
| `BollingerAgent` | 📊 | volatility | 布林带均值回归 |
| `PivotAgent` | 🎯 | structure | 枢轴点支撑阻力 |
| `PatternAgent` | 🕯 | pattern | 蜡烛图形态识别 |
| `DivergenceAgent` | ↔️ | reversal | RSI/MACD与价格背离 |
| `MultiTFAgent` | 🔭 | confluence | 多时间框架对齐 |
| `IchimokuAgent` | ☁️ | trend | 一目均衡表云系统 |
| `DXYAgent` | 💵 | macro | 美元指数强度 |
| `UTBotAgent` | 🤖 | trend | ATR追踪止损 |
| `NewsAgent` | 📰 | sentiment | 新闻事件日历 |

#### 4.3.4 HeadAgent (团队主管)

**职责**: 聚合团队内所有Agent的信号，应用KB加权、共识过滤、冲突检测。

**关键方法**:
- `aggregate(agents, market)` — 聚合所有Agent信号
- 应用KB权重调整
- 计算共识度和冲突度
- 生成团队级别的信号和置信度

#### 4.3.5 团队类

| 团队类 | 包含品种 | 说明 |
|--------|----------|------|
| `GoldTeam` | XAUUSD | 黄金团队 |
| `CurrencyTeam` | AUDUSD + EURUSD | 外汇团队 |
| `BtcTeam` | BTCUSD | 比特币团队 (24/7) |

每个团队包含:
- `head` — HeadAgent (团队主管)
- 所有14个分析Agent
- `news` — NewsAgent (新闻Agent)

#### 4.3.6 Commander (指挥官)

**职责**:
- 接收所有团队的分析结果
- 做出最终交易决策
- 选择最佳交易品种
- 计算入场价、止损、止盈
- 应用风险管理层

**关键方法**:
- `decide(goldR, fxR, btcR)` — 综合所有团队，做出最终决策
- 返回包含信号、品种、入场价、SL、TP、R:R比率的完整交易计划

---

### 4.4 UI渲染引擎 — [ui.js](file:///workspace/js/ui.js)

**模块标识**: `UI` (全局对象)

**职责**:
- 所有UI组件的渲染
- 像素头像生成
- 信号显示辅助函数
- 模态框管理
- 日志系统
- Telegram通知

#### 4.4.1 核心渲染函数

| 函数 | 说明 |
|------|------|
| `sigClass(s)` | 获取信号CSS类名 |
| `sigText(s)` | 获取信号显示文本 |
| `sigColor(s)` | 获取信号颜色类 |
| `fmtPrice(p, digits)` | 格式化价格 |
| `confBar(pct, color)` | 生成置信度进度条HTML |
| `voteChip(label, signal)` | 生成投票芯片HTML |
| `pixelFace(spec, size)` | 生成像素风格头像SVG |

#### 4.4.2 像素头像生成系统

`UI.pixelFace(spec, size)` — 程序化生成12×12像素头像。

**支持的属性**:
- `skin` — 肤色
- `hair` — 发色
- `eye` — 眼睛颜色
- `style` — 发型 (short/long/bun/spiky/bald/flat)
- `acc` — 配饰 (glasses/visor/headband/tie/crown/robot/headset)
- `accColor` — 配饰颜色
- `mouth` — 嘴型 (smile/flat/open)

#### 4.4.3 Modal (模态框系统)

管理所有弹出窗口:
- `settings` — 设置
- `backtest` — 回测
- `journal` — 交易日志
- `help` — 帮助
- `office` — 办公室
- `company` — 公司视图
- `botstatus` — BOT状态
- `control` — 主控室
- `gemini` — Gemini教练

---

### 4.5 附加功能模块 — [extras.js](file:///workspace/js/extras.js)

#### 4.5.1 Confluence (汇合分析)

**职责**: 分析不同类别的技术是否对信号达成一致。

**5大类别**:
- `TREND` — 趋势类 (MTF, Elliott)
- `MOMENTUM` — 动量类 (MACD, RSI)
- `STRUCTURE` — 结构类 (SMC, Fib, Pivot, Bollinger)
- `PATTERN` — 形态类 (Pattern)
- `SENTIMENT` — 情绪类 (News)

**方法**:
- `analyze(agents, signal)` — 分析汇合度
- `adjustGrade(grade, score)` — 根据汇合度调整评级

#### 4.5.2 SignalGrade (信号评级)

**职责**: 对交易信号进行评级 (S+/A/B/C/D)。

**评级标准**:
| 等级 | 分数范围 | 说明 |
|------|----------|------|
| S+ | 88-100 | 最佳信号，所有团队一致 + 高置信度 |
| A | 80-87 | 强信号，准备入场 |
| B | 65-79 | 良好，但等待更多确认 |
| C | 50-64 | 中等，不推荐 |
| D | <50 | 不要交易 |

#### 4.5.3 Settings (设置管理)

**职责**: 管理用户设置的持久化 (localStorage)。

**方法**:
- `get(key, defaultVal)` — 获取设置
- `set(key, val)` — 保存设置
- `getAll()` — 获取所有设置
- `reset()` — 重置所有设置

#### 4.5.4 Telegram (电报通知)

**职责**: 通过Telegram Bot发送交易信号和通知。

**功能**:
- 发送信号警报
- 每日新闻摘要
- 测试通知
- 可配置最低发送等级
- 冷却时间控制

#### 4.5.5 KeepAlive (保活机制)

**职责**: 防止浏览器标签页进入睡眠状态。

**功能**:
- Wake Lock API (如果可用)
- 浏览器通知权限
- 可见性变化检测

#### 4.5.6 TopDownAnalyzer (自上而下分析)

**职责**: 模拟真实交易者的多时间框架分析方法。

**分析流程**:
1. 大时间框架 (D1/4H) — 确定主趋势
2. 中时间框架 (H1) — 寻找交易机会
3. 小时间框架 (M15/M5) — 精确入场
4. 生成入场建议 (STRONG GO / GO / WAIT / SKIP)

#### 4.5.7 AdaptiveStrategy (自适应策略)

**职责**: 根据市场状况动态调整策略参数。

**功能**:
- 交易时段过滤 (London/NY/Asia)
- 波动率调整
- 品种特异性检查
- 质量过滤

---

### 4.6 Agent HQ像素办公室 — agenthq-*.js

Agent HQ是一个独立的像素风格办公室可视化系统，通过iframe嵌入主应用。

#### 4.6.1 模块组成

| 文件 | 职责 |
|------|------|
| [agenthq-data.js](file:///workspace/js/agenthq-data.js) | Agent数据定义、角色、状态 |
| [agenthq-sprites.js](file:///workspace/js/agenthq-sprites.js) | 像素精灵图定义 |
| [agenthq-room.js](file:///workspace/js/agenthq-room.js) | 房间背景渲染 |
| [agenthq-engine.js](file:///workspace/js/agenthq-engine.js) | 场景引擎、动画、交互 |

#### 4.6.2 核心概念

**Agent状态**:
- `working` — 工作中 (坐在办公桌前)
- `idle` — 空闲 (坐在沙发上)
- `waiting` — 等待中 (站在等待区)
- `error` — 错误 (在办公桌前但状态异常)

**场景元素**:
- 办公桌 (DESKS) — 工作状态的Agent
- 沙发 (SOFAS) — 空闲状态的Agent
- 等待区 (WAITS) — 等待状态的Agent
- 服务器机架 — LED指示灯动画
- 灰尘粒子 — 环境氛围效果

#### 4.6.3 交互功能

- 点击Agent查看详细信息 (popup)
- 名册面板 (roster) — 快速导航
- 实时状态同步 (与主应用通信)
- 模拟模式 — 随机状态变化用于演示
- 速度调节、名称显示、主题色切换

#### 4.6.4 配置项 (window.CFG)

| 配置 | 默认值 | 说明 |
|------|--------|------|
| `speed` | 1.0 | 角色移动速度倍率 |
| `showLabels` | true | 显示Agent名称标签 |
| `simulate` | false | 模拟模式 (随机状态变化) |
| `fxDust` | true | 灰尘粒子效果 |

---

### 4.7 回测引擎 — [backtest.js](file:///workspace/js/backtest.js)

**模块标识**: `Backtest` (全局对象)

**职责**: 在历史K线数据上运行策略，评估绩效。

#### 4.7.1 核心功能

- 历史数据回测
- 盈亏计算
- 胜率分析
- 最大回撤计算
- 权益曲线生成
- 实际成本模型 (点差 + 滑点 + 佣金)
- EA风格的持仓管理 (盈亏平衡 + 部分止盈 + 追踪止损)

#### 4.7.2 交易模式与时间框架

| 模式 | 默认时间框架 | TP倍数 | SL倍数 |
|------|-------------|--------|--------|
| `scalp` | 5min | 0.6 | 0.5 |
| `swing` | 1h | 1.5 | 1.5 |
| `position` | 4h | 2.5 | 2.5 |

#### 4.7.3 关键方法

| 方法 | 说明 |
|------|------|
| `run(symbol, opts)` | 运行回测 |
| `generateReport(results)` | 生成回测报告 |
| `renderResults(results)` | 渲染回测结果UI |

---

### 4.8 投资组合选择器 — [portfolio.js](file:///workspace/js/portfolio.js)

**模块标识**: `TWRPortfolio` (全局对象)

**职责**: 管理用户选择交易的品种组合。

**支持的品种**:
- 🥇 GOLD (XAUUSD)
- 🇦🇺 AUSSIE (AUDUSD)
- 🇪🇺 EURO (EURUSD)
- ₿ BITCOIN (BTCUSD · 24/7)

**功能**:
- 一键开/关各品种
- 实时价格显示
- 与设置系统同步
- 立即生效 (影响分析、交易、警报)

---

### 4.9 AI桥接 — [ai-bridge.js](file:///workspace/js/ai-bridge.js)

**模块标识**: `AIBridge` (全局对象)

**职责**: 通过Apps Script桥接与AI服务通信，API密钥永不暴露在浏览器中。

#### 4.9.1 支持的提供商

| 提供商 | 模型选项 |
|--------|----------|
| `groq` | llama-3.3-70b-versatile, llama-3.1-8b-instant, openai/gpt-oss-20b |
| `gemini` | gemini-2.0-flash-lite, gemini-2.5-flash, gemini-2.0-flash |

#### 4.9.2 核心方法

| 方法 | 说明 |
|------|------|
| `status()` | 检查服务器端AI密钥状态 (永不返回密钥本身) |
| `saveKey(key, model, provider)` | 保存API密钥到服务器端 (no-cors POST) |
| `clearKey()` | 清除服务器端密钥 |
| `ask(prompt, system)` | 向AI提问 |

#### 4.9.3 安全设计

- API密钥仅存储在Apps Script的ScriptProperties中
- 浏览器端从不保存或缓存密钥
- 使用 `no-cors` POST保存密钥，防止JavaScript读取响应
- 状态查询仅返回 `{ hasKey, model, provider }`

---

### 4.10 Gemini策略教练 — [gemini.js](file:///workspace/js/gemini.js)

**模块标识**: `Gemini` (全局对象)

**职责**: 作为"总教练"，定期审视知识库并优化团队配置。

#### 4.10.1 核心功能

1. **组合重新分配** — 根据当前市场状态为每个员工分配最佳技术组合
2. **置信度权重调整** — 为每个员工设置教练偏置权重
3. **人设提示词优化** — 重新编写每个员工的"系统提示词"
4. **公司层面守卫调整** — 根据周胜率调整最低等级/风险参数

#### 4.10.2 运行触发

- 每50笔新的平仓交易自动运行
- 可手动触发
- 最小真实交易数保护 (20笔) — 防止基于模拟数据过度拟合
- 切换滞后 (15%) — 防止频繁切换组合

#### 4.10.3 市场状态识别

基于当前价格数据识别市场状态:
- `trending` — 趋势市
- `ranging` — 震荡市
- `transitional` — 过渡期
- `volatile_trending` — 波动趋势市
- `volatile_ranging` — 波动震荡市

---

### 4.11 国际化 — [i18n.js](file:///workspace/js/i18n.js)

**模块标识**: `I18n` (全局对象)

**职责**: 泰语/英语双语切换。

**功能**:
- `data-i18n` 属性 — 静态文本翻译
- `t(key, fallback)` — 动态文本翻译
- `data-i18n-title` — 工具提示翻译
- localStorage持久化语言偏好
- 切换时重新渲染动态UI

---

### 4.12 MT5 Expert Advisor — [TradingWarRoom_EA.mq5](file:///workspace/mt5/TradingWarRoom_EA.mq5)

**语言**: MQL5  
**版本**: v1.55 · Phase D.21  
**Magic Number**: 992511

#### 4.12.1 EA策略

**核心策略**: RSI + Bollinger Bands + Fibonacci Confluence  
**内置技术组合**: 18-agent KB combo per pair

#### 4.12.2 主要输入参数

**品种设置**:
- `Symbol1/2/3/4` — 交易品种 (AUDUSDm, EURUSDm, XAUUSDm, BTCUSDm)
- `EnableSymbol2/3/4` — 是否启用各品种

**策略设置**:
- `Timeframe` — 分析时间框架 (默认 PERIOD_H1)
- `RSIPeriod` / `RSIOversold` / `RSIOverbought` — RSI参数
- `BBPeriod` / `BBDeviation` — 布林带参数
- `FibLookback` — 斐波那契回溯周期
- `ATRPeriod` — ATR周期

**剥头皮模式 (Scalp Mode)**:
- `ScalpMode` — 启用M1快速剥头皮模式
- `ScalpTF` — 剥头皮时间框架 (默认 PERIOD_M1)
- `ScalpRSIOversold` / `ScalpRSIOverbought` — 更严格的RSI
- `ScalpSLMult` / `ScalpRR` — 更紧的止损和R:R
- `ScalpCooldownMin` — 更短的冷却时间
- `ScalpRiskPercent` — 剥头皮模式风险百分比

**风险管理**:
- `RiskPercent` — 每笔交易风险百分比
- `SLAtrMult` — SL = ATR × 此倍数
- `RewardRiskRatio` — TP/SL比率
- `MinLot` / `MaxLot` — 最小/最大手数
- `AutoScaleMaxLot` — 根据账户规模自动调整最大手数

**过滤器**:
- `OnlyLondonNY` — 仅伦敦/纽约时段交易
- `SignalCooldownMin` — 信号冷却时间
- `MaxOpenPositions` — 每品种最大持仓数
- `MinADX` — 最小ADX (趋势市场门控)
- `StrongADX` — 强趋势阈值
- `RsiBuyMax` / `RsiSellMin` — RSI极端值门控

**风险管理员 (Phase 15)**:
- `UseBreakeven` — 启用盈亏平衡移动
- `BreakevenAtR` — 达到+N×R时移动到BE
- `BreakevenLockR` — BE时锁定+0.1R利润
- `UseTrailing` — 启用追踪止损
- `TrailStartR` / `TrailStepR` — 追踪起始点和步长
- `TrailFromBE` — 从盈亏平衡开始追踪
- `UsePartialTP` — 部分止盈
- `PartialAtR` / `PartialPct` — 部分止盈触发点和百分比
- `MaxPortfolioRiskPct` — 最大投资组合风险百分比
- `MaxPerTradeRiskPct` — 每笔交易最大风险
- `CryptoMinSLPct` / `XauMinSLPct` — 品种特定最小SL

**安全守卫 (Phase D)**:
- `MaxDailyLossPct` — 日最大亏损限制
- `MaxConsecLosses` — 连续亏损限制
- `ResumeNextDay` — 次日自动恢复
- `MaxSpreadAtrPct` / `MaxSpreadPts` — 点差保护
- `BrokerGmtOffset` — 经纪商GMT偏移

#### 4.12.3 EA核心功能

1. **多品种交易** — 同时监控最多4个品种
2. **双模式运行** — Swing (H1) + Scalp (M1/M5/M15)
3. **智能持仓管理** — 盈亏平衡 → 部分止盈 → 追踪止损
4. **多层风险控制** — 单笔风险 + 组合风险 + 日亏损限制 + 连续亏损限制
5. **Web信号集成** — 接受Web端AI信号 (Grade A+)
6. **交易记录同步** — 每笔平仓交易同步到Web KB
7. **图表仪表盘** — 图表上显示BOSS仪表盘 + 可点击按钮
8. **新闻风险规避** — 高影响新闻前后暂停交易

---

### 4.13 Apps Script桥接 — [BridgeCode.gs](file:///workspace/mt5/BridgeCode.gs)

**职责**: 作为Web端和MT5 EA之间的中间层，处理双向通信。

#### 4.13.1 API端点

| 方法 | 端点 | 说明 |
|------|------|------|
| POST | `/` | EA推送状态/价格/交易 |
| GET | `/?action=status` | 获取最新状态JSON |
| GET | `/?action=prices` | 获取最新价格 |
| GET | `/?action=command&since=N` | 获取待执行命令 (供EA轮询) |
| GET | `/?action=news[&win=30]` | 获取当前新闻风险等级 |
| GET | `/?action=history` | 获取最近100条状态快照 |
| GET | `/?action=clear` | 清除存储数据 |
| GET | `/?action=ai_status` | 检查AI密钥状态 |
| GET | `/?action=ai` | AI对话 (通过GET参数传递prompt) |

#### 4.13.2 存储数据 (ScriptProperties)

- `LATEST_STATUS` — 最新EA状态
- `LATEST_PRICES` — 最新价格
- `HISTORY` — 状态历史 (最多100条)
- `LIVE_TRADES` — 实时交易记录 (按posId去重)
- `COMMAND_QUEUE` — 命令队列
- `AI_KEY` / `AI_MODEL` / `AI_PROVIDER` — AI配置 (加密存储)

#### 4.13.3 新闻风险系统 (服务器端)

内置经济事件日历，返回新闻风险等级:
- `risk` — LOW / MED / HIGH
- `block` — 是否应该暂停交易
- `near` — 距离最近高影响事件的分钟数
- `cur` — 相关货币

---

## 5. 关键类与函数

### 5.1 主应用流程

```
页面加载
  ↓
DOMContentLoaded
  ↓
TradingWarRoom.init()
  ├─ 创建 MarketEngine
  ├─ 创建 GoldTeam / CurrencyTeam / BtcTeam
  ├─ 创建 Commander
  ├─ 首次完整渲染
  ├─ 启动定时任务:
  │   ├─ priceTick() 每800ms
  │   ├─ fullUpdate() 每4000ms
  │   ├─ 时钟更新 每秒
  │   ├─ 真实价格循环
  │   ├─ 历史数据加载 (启动+每4小时)
  │   ├─ 每日新闻检查 每小时
  │   ├─ 即将新闻检查 每30分钟
  │   └─ MT5桥接轮询 (如已配置)
  └─ 标记 LIVE 状态
```

### 5.2 完整分析流程 (fullUpdate)

```javascript
TradingWarRoom.fullUpdate()
  ↓
1. 获取市场数据 (goldData, audData, eurData)
  ↓
2. 运行团队分析
  ├─ goldTeam.analyze(goldData, market)
  └─ fxTeam.analyze(audData, eurData, market)
      └─ 每个Agent.analyze(data) → HeadAgent.aggregate()
  ↓
3. Commander.decide(goldR, fxR) → 最终决策
  ↓
4. SignalGrade.grade() → S+/A/B/C/D 评级
  ↓
5. Confluence.analyze() → 类别汇合度
  ↓
6. TopDownAnalyzer.analyze() → 自上而下MTF分析 (调整评级)
  ↓
7. AdaptiveStrategy.qualityCheck() → 自适应策略检查
  ↓
8. UI渲染更新
  ├─ 黄金团队面板
  ├─ 外汇团队面板
  ├─ 指挥官面板
  ├─ 警报横幅 (如符合条件)
  ├─ Telegram通知 (如符合条件)
  └─ 活动日志
```

### 5.3 关键函数速查表

#### 应用核心
| 函数/类 | 位置 | 说明 |
|---------|------|------|
| `TradingWarRoom.init()` | app.js | 初始化整个应用 |
| `TradingWarRoom.fullUpdate()` | app.js | 执行完整分析周期 |
| `TradingWarRoom.priceTick()` | app.js | 价格更新tick |

#### 市场引擎
| 函数/类 | 位置 | 说明 |
|---------|------|------|
| `new MarketEngine()` | market.js | 创建市场引擎实例 |
| `MarketEngine.tick()` | market.js | 执行一次价格tick |
| `MarketEngine.getData(sym)` | market.js | 获取品种分析数据 |
| `MarketEngine.fetchHistory()` | market.js | 获取真实历史数据 |
| `RateLimiter.wait()` | market.js | 等待API速率限制 |

#### Agent系统
| 函数/类 | 位置 | 说明 |
|---------|------|------|
| `BaseAgent.analyze(data)` | agents.js | Agent分析基类方法 |
| `HeadAgent.aggregate()` | agents.js | 聚合同团队所有Agent信号 |
| `Commander.decide()` | agents.js | 做出最终交易决策 |
| `GoldTeam.analyze()` | agents.js | 黄金团队分析 |
| `CurrencyTeam.analyze()` | agents.js | 外汇团队分析 |

#### UI系统
| 函数/类 | 位置 | 说明 |
|---------|------|------|
| `UI.pixelFace(spec, size)` | ui.js | 生成像素头像SVG |
| `UI.addLog(team, agent, msg)` | ui.js | 添加活动日志 |
| `Modal.open(name)` | ui.js | 打开模态框 |
| `Modal.close()` | ui.js | 关闭模态框 |

#### 信号评级
| 函数/类 | 位置 | 说明 |
|---------|------|------|
| `SignalGrade.grade(cmd, gold, fx)` | extras.js | 对信号进行评级 |
| `Confluence.analyze(agents, signal)` | extras.js | 分析汇合度 |
| `TopDownAnalyzer.analyze()` | extras.js | 自上而下多时间框架分析 |

#### 回测
| 函数/类 | 位置 | 说明 |
|---------|------|------|
| `Backtest.run(symbol, opts)` | backtest.js | 运行回测 |

#### AI系统
| 函数/类 | 位置 | 说明 |
|---------|------|------|
| `AIBridge.ask(prompt, system)` | ai-bridge.js | 向AI提问 |
| `Gemini.review()` | gemini.js | 执行每周策略审视 |
| `Gemini.confWeightFor(empId)` | gemini.js | 获取员工置信度权重 |

#### Agent HQ
| 函数/类 | 位置 | 说明 |
|---------|------|------|
| `window.CFG` | agenthq-engine.js | Agent HQ配置对象 |
| `window.AGENTS` | agenthq-data.js | Agent数据定义 |
| `window.ROOM` | agenthq-room.js | 房间布局定义 |
| `window.renderRoom(ctx)` | agenthq-room.js | 渲染房间背景 |

---

## 6. 依赖关系

### 6.1 模块依赖图

```
index.html
  ├─ css/style.css
  │
  └─ <script> 加载顺序 (重要!):
      1. i18n.js           ← 无依赖
      2. market.js         ← 依赖: 无 (定义TA, RateLimiter, MarketEngine)
      3. agents.js         ← 依赖: market.js (使用TA函数)
      4. ui.js             ← 依赖: agents.js (使用Agent类型) + market.js
      5. extras.js         ← 依赖: ui.js + agents.js + market.js
      6. ai-bridge.js      ← 依赖: 无 (独立)
      7. gemini.js         ← 依赖: extras.js (AgentScores) + agents.js
      8. portfolio.js      ← 依赖: extras.js (Settings)
      9. sprite-slicer.js  ← 依赖: 无 (工具)
      10. backtest.js      ← 依赖: agents.js + market.js + extras.js
      11. app.js           ← 依赖: 所有上面的模块
```

### 6.2 关键依赖说明

| 模块 | 依赖 | 原因 |
|------|------|------|
| `agents.js` | `market.js` | 使用TA命名空间下的技术指标函数 |
| `ui.js` | `agents.js` | 渲染Agent状态、头像、报告 |
| `extras.js` | `ui.js`, `agents.js`, `market.js` | 信号评级需要Agent数据，设置管理独立 |
| `backtest.js` | `agents.js`, `market.js` | 回测需要运行Agent分析和市场数据 |
| `gemini.js` | `extras.js`, `market.js` | 需要访问AgentScores (KB) 和市场状态 |
| `app.js` | 所有模块 | 主控制器协调所有模块 |

### 6.3 Agent HQ依赖 (独立页面)

```
agent-hq.html
  └─ <script> 加载顺序:
      1. agenthq-data.js     ← 无依赖 (数据定义)
      2. agenthq-sprites.js  ← 无依赖 (精灵图)
      3. agenthq-room.js     ← 依赖: agenthq-sprites.js
      4. agenthq-engine.js   ← 依赖: 所有上面的 + window.ROOM + window.AGENTS
```

### 6.4 外部依赖

| 依赖 | 用途 | 来源 |
|------|------|------|
| Google Fonts: Press Start 2P | 像素字体 | fonts.googleapis.com |
| Google Fonts: Pixelify Sans | Agent HQ像素字体 | fonts.googleapis.com |
| Google Fonts: JetBrains Mono | 等宽字体 | fonts.googleapis.com |
| Telegram Bot API | 通知推送 | api.telegram.org |
| Twelve Data API | 真实价格数据 (可选) | twelvedata.com |
| OANDA Demo API | 真实价格数据 (可选) | oanda.com |
| Google Gemini API | AI分析 (可选) | 通过Apps Script |
| Groq API | AI分析 (可选) | 通过Apps Script |
| MQL5 Standard Library | EA标准库 | MT5内置 |

---

## 7. 数据流程

### 7.1 价格数据流 (模拟模式)

```
MarketEngine._genHistory()
  ↓ (生成600根K线历史)
MarketEngine.tick()
  ├─ 更新最新K线
  ├─ 随机游走 + 动量 + 波动聚类
  └─ 更新this.prices[sym]
  ↓
TradingWarRoom.priceTick()
  ├─ UI.updateTicker()
  ├─ UI.updatePriceTags()
  └─ 更新header价格显示
```

### 7.2 分析信号流

```
MarketEngine.getData(sym)
  ↓ (返回 { candles, cfg, atr, ... })
Team.analyze(data, market)
  ├─ 每个Agent.analyze(data) → { signal, conf, report }
  └─ HeadAgent.aggregate(agents, market)
      ├─ KB权重应用
      ├─ 共识度计算
      └─ 团队信号生成
  ↓
Commander.decide(goldR, fxR, btcR)
  ├─ 选择最佳品种
  ├─ 计算入场/SL/TP
  ├─ R:R计算
  └─ 仓位大小建议
  ↓
SignalGrade.grade() → S+/A/B/C/D
  ↓
Confluence.analyze() → 汇合度
  ↓
TopDownAnalyzer → 调整评级
  ↓
UI渲染 + 警报 + Telegram
```

### 7.3 MT5 EA ↔ Web通信流

```
EA (MT5)                    Apps Script                   Web (Browser)
   │                            │                             │
   │ POST /status               │                             │
   │ (prices + positions)       │                             │
   │───────────────────────────▶│                             │
   │                            │ 存储到 ScriptProperties     │
   │                            │                             │
   │                            │ GET /?action=status         │
   │                            │◀────────────────────────────│
   │                            │                             │
   │ GET /?action=command       │                             │
   │ (poll every 60s)           │                             │
   │◀───────────────────────────│                             │
   │                            │                             │
   │ POST /trade (closed)       │                             │
   │───────────────────────────▶│                             │
   │                            │ 添加到 LIVE_TRADES          │
   │                            │ 同步到 KB                   │
```

### 7.4 KB学习循环

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Backtest (historical) ──┐                      │
│                          ├──► KnowledgeBase ────┤
│  Live trades (EA) ───────┘         │            │
│                                    ▼            │
│                          Smart Apply /          │
│                          Recommended            │
│                                    │            │
│                                    ▼            │
│  Better signals ← better trades ← more data    │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 8. 项目运行方式

### 8.1 本地运行

#### 方式1: 使用PowerShell脚本

```powershell
# Windows PowerShell
.\serve.ps1
```

#### 方式2: 使用Python HTTP服务器

```bash
cd /workspace
python3 -m http.server 8000
```

#### 方式3: 使用Node.js http-server

```bash
cd /workspace
npx http-server -p 8000
```

然后在浏览器中打开: `http://localhost:8000`

### 8.2 访问入口

| 页面 | URL | 说明 |
|------|-----|------|
| 主应用 | `/index.html` | 交易控制室 (主界面) |
| Agent HQ | `/agent-hq.html` | 像素办公室 (独立页面) |
| 移动端 | `/mobile.html` | 移动端优化版本 |

### 8.3 首次运行设置

1. 打开应用 → 点击右上角 **⚙ SETTINGS**
2. 配置Telegram (可选):
   - Bot Token (来自@BotFather)
   - Chat ID (来自@userinfobot)
   - 勾选"เปิด Telegram notifications"
   - 点击"🧪 ทดสอบส่ง"测试
3. 配置真实价格 (可选):
   - 选择API Provider (Twelve Data / OANDA / Frankfurter等)
   - 输入API Key
   - 勾选"เปิดดึงราคาจริง"
4. 配置MT5桥接 (可选):
   - 部署Apps Script BridgeCode.gs
   - 输入Bot Bridge URL
   - 在MT5中安装EA
5. 开始使用 → 等待信号生成

### 8.4 日常操作流程

1. **早晨**: 打开Office HQ → 检查士气 + OPEN状态 + 今日P/L
2. **询问秘书**: "สถานะ", "กำไร", "ทำไมไม่เทรด"
3. **每周**: 查看Journal → Performance Analytics
4. **亏损时**: Strategy Officer自动降低风险
5. **优化**: 导出KB → 分析 → 更新策略

---

## 9. 部署指南

### 9.1 部署方式对比

| 方式 | 免费 | 难度 | URL | 推荐度 |
|------|------|------|-----|--------|
| **GitHub Pages** | ✅ | ⭐ 简单 | `username.github.io/trade` | ⭐⭐⭐⭐⭐ |
| **Cloudflare Pages** | ✅ | ⭐⭐ | `trade.pages.dev` | ⭐⭐⭐⭐ |
| **Vercel** | ✅ | ⭐⭐ | `trade.vercel.app` | ⭐⭐⭐⭐ |
| **Netlify** | ✅ | ⭐⭐ | `trade.netlify.app` | ⭐⭐⭐ |
| **Google Apps Script** | ✅ | ⭐⭐⭐ | `script.google.com/.../exec` | ⭐⭐ |

### 9.2 GitHub Pages 部署 (推荐)

```bash
# 1. 在GitHub创建仓库 (如 "trade")

# 2. 初始化git
cd /workspace
git init
git add .
git commit -m "Initial Trading War Room"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/trade.git
git push -u origin main

# 3. 在GitHub仓库 → Settings → Pages
#    Source: Deploy from a branch → main → / (root) → Save

# 4. 等待1-2分钟 → 访问: https://YOUR_USERNAME.github.io/trade/
```

### 9.3 MT5 EA部署

1. 打开MT5 → File → Open Data Folder
2. 复制 `TradingWarRoom_EA.mq5` 到 `MQL5/Experts/`
3. 在MT5 Navigator中刷新 → 编译EA
4. 启用Algo Trading
5. 将EA拖拽到图表上 → 配置参数 → OK

### 9.4 Apps Script桥接部署

1. 访问 https://script.google.com → New project
2. 粘贴 `mt5/BridgeCode.gs` 内容
3. Deploy → New deployment → Web app
   - Execute as: Me
   - Who has access: Anyone
4. 复制 `/exec` URL
5. 在EA Inputs和Web Settings中填入该URL

详细说明见:
- [mt5/README.md](file:///workspace/mt5/README.md) — EA设置指南
- [appscript/README.md](file:///workspace/appscript/README.md) — Apps Script部署
- [DEPLOY.md](file:///workspace/DEPLOY.md) — 完整部署指南

---

## 10. 配置说明

### 10.1 主要设置项

| 设置键 | 默认值 | 说明 |
|--------|--------|------|
| `keepAlive` | true | 保活机制 (防止tab睡眠) |
| `telegramToken` | '' | Telegram Bot Token |
| `telegramChatId` | '' | Telegram Chat ID |
| `telegramOn` | false | 启用Telegram通知 |
| `minGrade` | 'A' | 最低发送等级 |
| `cooldownMin` | 5 | 通知冷却时间 (分钟) |
| `soundOn` | true | 启用声音警报 |
| `tradeMode` | 'swing' | 交易模式 (scalp/swing/position) |
| `accountSize` | 30 | 账户大小 (USD) |
| `riskPercent` | 2 | 每笔交易风险 (%) |
| `enableXAU` | true | 启用XAUUSD |
| `enableAUD` | true | 启用AUDUSD |
| `enableEUR` | true | 启用EURUSD |
| `enableBTC` | false | 启用BTCUSD |
| `priceProvider` | 'ea_bridge' | 价格API提供商 |
| `priceApiKey` | '' | Twelve Data API Key |
| `priceFeedOn` | false | 启用真实价格 |
| `priceRefreshSec` | 120 | 价格刷新间隔 (秒) |
| `botBridgeURL` | '' | MT5桥接URL |
| `webAiSignals` | false | Web AI信号发送给EA |
| `aiProvider` | 'groq' | AI提供商 |
| `aiModel` | 'llama-3.3-70b-versatile' | AI模型 |
| `adxGate` | 20 | ADX门控阈值 |
| `minWeight` | 0.5 | 最小Agent权重 |
| `recencyLearning` | false | 近期学习 (近期交易更重要) |
| `autoApply` | false | 自动应用策略 |
| `tradeWithoutKB` | false | 无KB时也交易 |
| `lang` | 'th' | 语言 (th/en) |

### 10.2 localStorage存储键

| 键 | 用途 |
|----|------|
| `twr_settings` | 用户设置 |
| `twr_rate_calls` | API速率限制记录 |
| `twr_daily_calls` | API每日使用量 |
| `twr_lang` | 语言偏好 |
| `twr_kb_v2` | 知识库 (AgentScores) |
| `twr_gemini_coach_v1` | Gemini教练状态 |
| `twr_hub_left` / `twr_hub_right` | Hub面板折叠状态 |
| `twr_last_news_date` | 上次新闻日期 |

### 10.3 sessionStorage存储键

| 键 | 用途 |
|----|------|
| `twr_hist_{sym}_{interval}_{size}` | 历史K线数据缓存 |

---

## 附录

### A. 版本历史 (高层)

| 版本 | 主要特性 |
|------|----------|
| v12 | MT5 EA核心 (RSI+BB+Fib) |
| v12.2–12.9 | Web桥接、价格、远程控制、扫描、3品种 |
| v13 | Web AI → EA信号管道 |
| v14 | Ichimoku + DXY agents、共识过滤、像素徽章 |
| v15 | 风险管理员、公司视图、秘书聊天、Auto Pilot、UT-Bot |
| v16 | 绩效分析 + 策略自动调整 |
| v17 | 像素办公室HQ |
| v18 | Office-as-home、交易去重、整合 |
| v25.7 | 当前版本 |

### B. 免责声明

- 仅用于教育和研究目的，不构成财务建议
- Demo账户验证期间使用
- 新闻为典型时间表 (UTC)，非实时
- Web "Claude Advisor" 为基于规则的系统 (免费)，非实时LLM API调用
- 均值回归Agent (RSI/BB) 在下跌趋势中可能发出买入信号 — 趋势Agent (UT-Bot/Ichimoku/MTF) + 共识过滤器用于否决
- 过往表现不代表未来结果

### C. 相关文档

- [ARCHITECTURE.md](file:///workspace/ARCHITECTURE.md) — 系统架构文档
- [DEPLOY.md](file:///workspace/DEPLOY.md) — 部署指南
- [mt5/README.md](file:///workspace/mt5/README.md) — EA设置指南
- [appscript/README.md](file:///workspace/appscript/README.md) — Apps Script部署指南
- [kb-backups/README.md](file:///workspace/kb-backups/README.md) — KB备份说明

---

**文档生成时间**: 2026-06-30  
**基于代码版本**: v25.7
