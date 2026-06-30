/* ═══════════════════════════════════════════════════════
   I18N — 中文 / English 切换
     - 使用 data-i18n attribute 用于 static text
     - t(key) 函数用于 dynamic text 中的 JS
     - 保存 preference 在 localStorage
   ═══════════════════════════════════════════════════════ */
const I18n = {
  KEY: 'twr_lang',
  current: 'zh',

  init() {
    this.current = localStorage.getItem(this.KEY) || 'zh';
    this.applyToDOM();
  },

  set(lang) {
    if (lang !== 'zh' && lang !== 'en') return;
    this.current = lang;
    localStorage.setItem(this.KEY, lang);
    this.applyToDOM();
    // Re-render dynamic UI
    if (typeof TradingWarRoom !== 'undefined' && TradingWarRoom.fullUpdate) {
      TradingWarRoom.fullUpdate();
    }
  },

  toggle() {
    this.set(this.current === 'zh' ? 'en' : 'zh');
  },

  t(key, fallback) {
    return this.dict[this.current]?.[key] ?? this.dict.zh[key] ?? (fallback ?? key);
  },

  applyToDOM() {
    // Update [data-i18n] elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const translated = this.t(key);
      if (translated) el.textContent = translated;
    });
    // Update [data-i18n-title] for tooltips
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.dataset.i18nTitle;
      const translated = this.t(key);
      if (translated) el.title = translated;
    });
    // Update lang button label
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = this.current === 'zh' ? '🇨🇳 中文' : '🇺🇸 EN';
    document.documentElement.lang = this.current;
  },

  dict: {
    zh: {
      // Header
      'btn.help':       '❓ 帮助',
      'btn.settings':   '⚙ 设置',
      'btn.journal':    '📓 交易日志',
      'btn.backtest':   '🔬 回测',

      // Status
      'status.live':    'LIVE',
      'status.init':    'INIT',
      'status.loading': '加载中...',

      // Team panels
      'team.gold':           '🥇 黄金团队',
      'team.currency':       '💱 外汇团队',
      'team.gold.desc':      'XAU/USD — 贵金属交易台',
      'team.currency.desc':  'AUD/USD + EUR/USD — 外汇交易台',
      'team.commander':      '👑 指挥官 — 中央控制',
      'team.commander.desc': '汇总所有团队信号 → 最终指令',
      'team.log':            '📡 AGENT 通讯',
      'team.log.desc':       'agent 实时活动',

      // Settings labels
      'set.title':       '⚙ 设置 — Telegram & 提醒',
      'set.botToken':    '🤖 Bot Token',
      'set.botHint':     '(来自 @BotFather)',
      'set.chatId':      '💬 Chat ID',
      'set.minGrade':    '⭐ 仅发送最低等级',
      'set.cooldown':    '⏱ 冷却时间 (分钟)',
      'set.tgOn':        '开启 Telegram 通知',
      'set.sound':       '开启提醒声音',
      'set.tradeMode':   '🎯 交易模式',
      'set.tradeHint':   '(根据风格调整 TP/SL)',
      'set.symFilter':   '🎯 品种筛选',
      'set.adxGate':     '📈 ADX 门控',
      'set.adxHint':     '(0=关闭, 推荐 20 — 仅趋势市场)',
      'set.analysts':    '👥 活跃分析师',
      'set.priceFeed':   '💹 行情源 (实时价格)',
      'set.apiKey':      '🔑 Twelve Data API Key',
      'set.feedOn':      '开启实时价格',
      'set.refresh':     '⏱ 刷新间隔 (秒, ≥60)',
      'set.keepAlive':   '🔋 保持唤醒（防止标签页休眠）',

      // Buttons
      'btn.test':         '🧪 测试发送',
      'btn.testPrice':    '🧪 测试获取价格',
      'btn.sendNews':     '📰 发送今日新闻',
      'btn.save':         '💾 保存',
      'btn.run':          '▶ Run',
      'btn.autoOpt':      '🚀 Start Auto-Opt',
      'btn.stop':         '⏹ Stop',
      'btn.export':       '📤 Export JSON',
      'btn.import':       '📥 Import & Merge',
      'btn.reset':        '🔄 Reset',
      'btn.exportCSV':    '📥 Export CSV',
      'btn.clearAll':     '🗑 Clear All',
      'btn.requestNotif': '🔔 请求通知权限',

      // Backtest
      'bt.title':       '🔬 回测 — 在历史数据上测试策略',
      'bt.config':      '🔬 回测配置',
      'bt.symbol':      'Symbol',
      'bt.mode':        'Mode',
      'bt.tf':          'Timeframe',
      'bt.minConf':     'Min Conf',
      'bt.autoOptDesc': '🤖 自动优化 — 测试多种组合 + 自我进化',

      // Journal
      'jrn.title':     '📓 交易日志 — 信号历史 + 交易结果',
      'jrn.total':     'Total Signals',
      'jrn.wins':      'Wins',
      'jrn.losses':    'Losses',
      'jrn.breakeven': 'Breakeven',
      'jrn.winrate':   'Win Rate',
      'jrn.pnl':       'Total P/L',
    },

    en: {
      // Header
      'btn.help':       '❓ HELP',
      'btn.settings':   '⚙ SETTINGS',
      'btn.journal':    '📓 JOURNAL',
      'btn.backtest':   '🔬 BACKTEST',

      // Status
      'status.live':    'LIVE',
      'status.init':    'INIT',
      'status.loading': 'Loading...',

      // Team panels
      'team.gold':           '🥇 GOLD TEAM',
      'team.currency':       '💱 CURRENCY TEAM',
      'team.gold.desc':      'XAU/USD — Precious Metals Desk',
      'team.currency.desc':  'AUD/USD + EUR/USD — FX Desk',
      'team.commander':      '👑 COMMANDER — Central Control',
      'team.commander.desc': 'Aggregates team signals → Final order',
      'team.log':            '📡 AGENT COMMS',
      'team.log.desc':       'Real-time agent activity feed',

      // Settings labels
      'set.title':       '⚙ SETTINGS — Telegram & Alerts',
      'set.botToken':    '🤖 Bot Token',
      'set.botHint':     '(from @BotFather)',
      'set.chatId':      '💬 Chat ID',
      'set.minGrade':    '⭐ Send signals at Grade',
      'set.cooldown':    '⏱ Cooldown (minutes)',
      'set.tgOn':        'Enable Telegram notifications',
      'set.sound':       'Enable alert sound',
      'set.tradeMode':   '🎯 Trade Mode',
      'set.tradeHint':   '(adjusts TP/SL per style)',
      'set.symFilter':   '🎯 Symbol Filter',
      'set.adxGate':     '📈 ADX Gate',
      'set.adxHint':     '(0=off, 20=recommended — trending only)',
      'set.analysts':    '👥 Active Analysts',
      'set.priceFeed':   '💹 PRICE FEED (live market)',
      'set.apiKey':      '🔑 Twelve Data API Key',
      'set.feedOn':      'Enable live prices',
      'set.refresh':     '⏱ Refresh (sec, ≥60)',
      'set.keepAlive':   '🔋 Keep-Alive (prevent tab sleep)',

      // Buttons
      'btn.test':         '🧪 Test Send',
      'btn.testPrice':    '🧪 Test Fetch Price',
      'btn.sendNews':     '📰 Send Today News',
      'btn.save':         '💾 Save',
      'btn.run':          '▶ Run',
      'btn.autoOpt':      '🚀 Start Auto-Opt',
      'btn.stop':         '⏹ Stop',
      'btn.export':       '📤 Export JSON',
      'btn.import':       '📥 Import & Merge',
      'btn.reset':        '🔄 Reset',
      'btn.exportCSV':    '📥 Export CSV',
      'btn.clearAll':     '🗑 Clear All',
      'btn.requestNotif': '🔔 Request Notif Permission',

      // Backtest
      'bt.title':       '🔬 BACKTEST — Strategy on History',
      'bt.config':      '🔬 BACKTEST CONFIG',
      'bt.symbol':      'Symbol',
      'bt.mode':        'Mode',
      'bt.tf':          'Timeframe',
      'bt.minConf':     'Min Conf',
      'bt.autoOptDesc': '🤖 AUTO-OPTIMIZE — Test many combinations + self-improve',

      // Journal
      'jrn.title':     '📓 TRADE JOURNAL — Signal History + Outcomes',
      'jrn.total':     'Total Signals',
      'jrn.wins':      'Wins',
      'jrn.losses':    'Losses',
      'jrn.breakeven': 'Breakeven',
      'jrn.winrate':   'Win Rate',
      'jrn.pnl':       'Total P/L',
    },
  },
};

window.I18n = I18n;
window.t = (key, fb) => I18n.t(key, fb);
