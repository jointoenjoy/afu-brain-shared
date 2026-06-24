#!/usr/bin/env bash
# 阿福 watcher：手機(Telegram → inbox)→ headless Claude Code(Max)→ 回報你手機
# 寫 code 全程走 Claude Code 的 Max 訂閱，不燒 API。
set -uo pipefail

CONFIG="${AFU_ENV:-$HOME/.afu-watcher.env}"
# shellcheck disable=SC1090
[ -f "$CONFIG" ] && source "$CONFIG"

: "${TELEGRAM_BOT_TOKEN:?請在 $CONFIG 設定 TELEGRAM_BOT_TOKEN}"
: "${ALLOWED_CHAT_ID:?請在 $CONFIG 設定 ALLOWED_CHAT_ID}"
BRAIN_DIR="${BRAIN_DIR:-$HOME/afu-repos/afu-brain}"   # afu-brain 的本機 clone（inbox 在這）
WORKSPACE="${WORKSPACE:-$BRAIN_DIR}"                                   # 阿福實際動手的 repo（要遙控網站就指到那個 repo）
POLL="${POLL:-20}"
# 允許：檔案編輯、查資料、git/gh（接任何 repo、commit/push）、WebFetch（讀網路新知）。
# 不給刪除性與寫 secrets 的工具；資料庫/金流紅線靠 CLAUDE.md 規則讓阿福自己停下來。
ALLOWED='Edit Write Read Glob Grep WebFetch WebSearch Bash(git:*) Bash(gh:*) Bash(ls:*) Bash(cat:*) Bash(head:*) Bash(tail:*) Bash(mkdir:*) Bash(cd:*) Bash(pwd) Bash(grep:*) Bash(find:*) Bash(npm:*) Bash(node:*)'
MODELFLAG=""
[ -n "${AFU_MODEL:-}" ] && MODELFLAG="--model ${AFU_MODEL}"

# 單一實例鎖：避免同時多開造成重複回覆
LOCK="/tmp/afu-watcher.lock"
if ! mkdir "$LOCK" 2>/dev/null; then
  echo "已有一支 watcher 在跑（$LOCK）。先停掉它再啟動。" >&2
  exit 0
fi
trap 'rmdir "$LOCK" 2>/dev/null' EXIT

send(){ curl -s "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  --data-urlencode "chat_id=${ALLOWED_CHAT_ID}" --data-urlencode "text=$1" >/dev/null || true; }

process_one(){
  local f="$1" cmd out
  cmd="$(cat "$f")"
  out="$(cd "$WORKSPACE" && claude -p "以下是大寶從手機傳來的一則訊息。請依你的系統規則（人格、handbook SOP、兩條紅線）處理。
工作區是目前目錄（~/afu-repos）。大腦/知識庫在：${BRAIN_DIR}（可寫，用來累積知識）。handbook 在 ~/afu-repos/handbook。
- 若是要做某專案：確認該 repo 已 clone/最新，先讀 handbook，做下一步，再自己 git commit/push。
- 若是網路新知或想法：讀取/摘要後歸檔進 ${BRAIN_DIR} 的知識庫，再 commit/push。
- 碰到使用者資料或金流紅線：停下來，在回報裡說要大寶確認，不要執行。
做完像朋友一樣回他一兩句就好（做了什麼、有沒有要他確認的），輕鬆口語、別太正式、別像機器人。

訊息內容：
${cmd}" $MODELFLAG --append-system-prompt-file "${BRAIN_DIR}/CLAUDE.md" --add-dir "${BRAIN_DIR}" --allowedTools $ALLOWED --permission-mode default 2>&1 | tail -c 3500)"
  send "阿福回報：
${out}"
}

run_inbox(){
  cd "$BRAIN_DIR" || exit 1
  git pull -q --no-rebase origin main >/dev/null 2>&1 || true
  shopt -s nullglob
  for f in inbox/*.md; do
    [ "$(basename "$f")" = "README.md" ] && continue
    process_one "$f"
    git rm -q "$f" >/dev/null 2>&1 || rm -f "$f"
    git commit -q -m "watcher: 已處理指令" >/dev/null 2>&1 || true
    git push -q >/dev/null 2>&1 || true
  done
}

if [ "${1:-}" = "--once" ]; then run_inbox; exit 0; fi
echo "阿福 watcher 啟動，每 ${POLL}s 檢查 inbox 一次。Ctrl+C 停止。"
while true; do run_inbox; sleep "$POLL"; done
