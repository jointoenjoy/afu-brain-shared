# Telegram → inbox（MVP 設定）

讓你用 Telegram 傳訊息給 bot，自動寫進 `inbox/`。約 15 分鐘。

## 一、申請 bot
1. Telegram 找 `@BotFather`，傳 `/newbot`，照指示命名。
2. 記下它給的 **bot token**。
3. 傳一句話給你的新 bot，然後開 `https://api.telegram.org/bot<TOKEN>/getUpdates`，找到 `chat.id`（你的 chat id）。

## 二、準備 GitHub token
1. GitHub → Settings → Developer settings → Fine-grained token。
2. 只授權 `jointoenjoy/afu-brain` 的 Contents 讀寫。
3. 記下 token。

## 三、部署 Worker（需要 Cloudflare，你已經有）
```bash
npm i -g wrangler
cd tools/telegram-inbox
wrangler login
wrangler secret put TELEGRAM_BOT_TOKEN   # 貼上 bot token
wrangler secret put TELEGRAM_SECRET      # 自訂一段密碼，記起來
wrangler secret put GITHUB_TOKEN         # 貼上 GitHub token
# 編輯 wrangler.toml，把 ALLOWED_CHAT_ID 設成你的 chat id
wrangler deploy
```
部署後會得到一個網址，例如 `https://afu-telegram-inbox.<你的子網域>.workers.dev`。

## 四、設定 webhook（把 bot 接到 Worker）
```bash
curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=<WORKER_URL>&secret_token=<你的_TELEGRAM_SECRET>"
```

## 完成
傳訊息給 bot → 幾秒後 `inbox/` 就多一個 .md 檔，回電腦時阿福會歸檔。

> 之後要加 **LINE**：邏輯一樣（LINE Messaging API webhook → 同一個寫進 inbox 的流程），只是換成 LINE 官方帳號與 channel token。
