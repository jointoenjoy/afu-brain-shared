#!/usr/bin/env bash
# 外來專案掃描器 — 開「網路上拿到的 repo」進編輯器前先跑一遍。
# 針對 Miasma 這類「開資料夾就中毒」的供應鏈蠕蟲：偵測 AI/編輯器設定檔裡
# 會自動執行、又偷金鑰的可疑指令。只看不改，零風險。
#
# 用法：  bash scan.sh [專案資料夾]   （省略＝當前目錄）
set -u
DIR="${1:-.}"
RED='\033[0;31m'; YEL='\033[0;33m'; GRN='\033[0;32m'; NC='\033[0m'
hits=0

echo "🔍 掃描：$DIR"
echo "─────────────────────────────────────────"

# 1) 自動執行的設定檔本身存在嗎？（存在不等於有毒，但要逐個看過）
AUTO_FILES=(
  ".vscode/tasks.json"        # VS Code：runOn folderOpen 會開資料夾就跑
  ".claude/settings.json"     # Claude Code：SessionStart/PreToolUse hooks
  ".claude/settings.local.json"
  ".cursor/environment.json"  # Cursor 自動設定
  ".gemini/settings.json"     # Gemini CLI
  ".windsurf/"                # Windsurf
  ".envrc"                    # direnv：進資料夾自動載入
)
echo "📁 自動執行類設定檔："
for f in "${AUTO_FILES[@]}"; do
  if [ -e "$DIR/$f" ]; then
    printf "   ${YEL}● 有 %s${NC}（請人工看過內容再信任）\n" "$f"
    hits=$((hits+1))
  fi
done
[ -d "$DIR/.claude/hooks" ] && { printf "   ${YEL}● 有 .claude/hooks/（hook 腳本，務必看過）${NC}\n"; hits=$((hits+1)); }
echo

# 2) folderOpen / 自動觸發關鍵字
echo "⚙️  自動觸發設定（最危險）："
if grep -rIl --include="*.json" -e "folderOpen" -e "\"runOn\"" "$DIR/.vscode" 2>/dev/null | grep -q .; then
  printf "   ${RED}✗ tasks.json 內含 runOn/folderOpen — 開資料夾就會自動執行！${NC}\n"; hits=$((hits+1))
else
  echo "   ✓ 未發現 folderOpen 自動任務"
fi
if grep -rIl -e "SessionStart" -e "PreToolUse" "$DIR/.claude" 2>/dev/null | grep -q .; then
  printf "   ${YEL}● .claude 內含 SessionStart/PreToolUse hook — 開 session 就會跑，看過再信${NC}\n"; hits=$((hits+1))
fi
echo

# 3) 在「自動執行類設定／腳本」裡找偷金鑰、連外的可疑指令
echo "🕵️  可疑指令（連外 / 偷憑證 / 編碼混淆）："
SCAN_PATHS=()
for p in .vscode .claude .cursor .gemini .windsurf .envrc; do
  [ -e "$DIR/$p" ] && SCAN_PATHS+=("$DIR/$p")
done
if [ ${#SCAN_PATHS[@]} -gt 0 ]; then
  PATTERN='curl |wget |Invoke-WebRequest|nc |ncat|/dev/tcp|base64 -d|base64 --decode|atob\(|eval |child_process|os\.system|subprocess|GITHUB_TOKEN|GH_TOKEN|id_rsa|\.ssh/|AWS_SECRET|\.env|npmrc|\.netrc|exfil|webhook\.site|requestbin'
  if grep -rInE "$PATTERN" "${SCAN_PATHS[@]}" 2>/dev/null; then
    printf "   ${RED}✗ 上面這些行有連外或讀憑證的味道 — 不要信任此資料夾，先逐行查清楚！${NC}\n"; hits=$((hits+1))
  else
    echo "   ✓ 設定檔裡沒有明顯的連外/偷金鑰指令"
  fi
else
  echo "   ✓ 沒有需要細看的 AI/編輯器設定檔"
fi
echo

# 4) clone 來的 repo 自帶 git hooks？（git pull/commit 時會被觸發）
if [ -d "$DIR/.git/hooks" ] && ls "$DIR/.git/hooks"/* 2>/dev/null | grep -vq '\.sample$'; then
  printf "${YEL}● .git/hooks 有非範例的 hook，留意是否被植入${NC}\n\n"; hits=$((hits+1))
fi

echo "─────────────────────────────────────────"
if [ "$hits" -eq 0 ]; then
  printf "${GRN}✅ 沒掃到可疑點。仍建議第一次用「限制模式 / 不要立刻按信任作者」開啟。${NC}\n"
else
  printf "${YEL}⚠️  有 %s 個地方要你人工確認。看清楚前：用限制模式開、別按「信任作者」、別讓 AI 工具自動跑設定。${NC}\n" "$hits"
fi
exit 0
