/**
 * Telegram → inbox 中轉（Cloudflare Worker）
 * 收到你傳給 bot 的訊息，就在 afu-brain 的 inbox/ 新增一個 .md 檔。
 *
 * 需要的環境變數（在 Cloudflare 後台或 wrangler secret 設定）：
 *   TELEGRAM_BOT_TOKEN  － 跟 @BotFather 申請的 bot token
 *   TELEGRAM_SECRET     － 自訂一段密碼，設 webhook 時帶上，擋掉亂打的請求
 *   ALLOWED_CHAT_ID     － 只接受你自己的 chat id（避免別人亂丟）
 *   GITHUB_TOKEN        － 有 afu-brain repo 寫入權限的 token
 *   GITHUB_REPO         － 例如 jointoenjoy/afu-brain
 */
export default {
  async fetch(request, env) {
    if (request.method !== "POST") return new Response("ok");

    // 驗證來源
    const secret = request.headers.get("x-telegram-bot-api-secret-token");
    if (env.TELEGRAM_SECRET && secret !== env.TELEGRAM_SECRET) {
      return new Response("forbidden", { status: 403 });
    }

    const update = await request.json().catch(() => ({}));
    const msg = update.message || update.channel_post;
    if (!msg || !msg.text) return new Response("no text");

    const chatId = String(msg.chat && msg.chat.id);
    if (env.ALLOWED_CHAT_ID && chatId !== String(env.ALLOWED_CHAT_ID)) {
      return new Response("not allowed");
    }

    const text = msg.text.trim();
    const now = new Date(msg.date ? msg.date * 1000 : Date.now());
    const stamp = now.toISOString().replace(/[:.]/g, "-");
    const path = `inbox/${stamp}.md`;
    const body =
      `類型：(待阿福判斷)\n時間：${now.toISOString()}\n來源：Telegram\n\n${text}\n`;

    // 寫進 GitHub
    const [owner, repo] = (env.GITHUB_REPO || "").split("/");
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        "User-Agent": "afu-telegram-inbox",
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({
        message: `inbox: ${text.slice(0, 50)}`,
        content: btoa(unescape(encodeURIComponent(body))),
      }),
    });

    // 回覆 Telegram
    const reply = res.ok ? "收到，已放進阿福的 inbox。" : "寫入失敗，請稍後再試。";
    if (env.TELEGRAM_BOT_TOKEN) {
      await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: reply }),
      });
    }
    return new Response(res.ok ? "ok" : "error", { status: res.ok ? 200 : 500 });
  },
};
