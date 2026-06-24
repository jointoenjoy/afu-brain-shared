#!/usr/bin/env bash
# 開工提醒：SessionStart hook 觸發，把待辦與 inbox 唸進阿福的脈絡，
# 讓他開口第一句就提醒大寶。stdout 會被加進 Claude 的 context。
set -e
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

echo "【開工提醒｜阿福請主動把以下整理成一兩句話提醒大寶，並記得先 git pull origin main】"

echo "── 待辦.md ──"
if [ -f "$ROOT/待辦.md" ]; then
  # 只列尚未完成的項目（未勾選）
  grep -nE '^\- \[ \]' "$ROOT/待辦.md" || echo "(沒有未完成項目)"
else
  echo "(沒有待辦.md)"
fi

echo "── inbox/（手機隨手丟的，待歸檔）──"
if [ -d "$ROOT/inbox" ] && [ -n "$(ls -A "$ROOT/inbox" 2>/dev/null)" ]; then
  ls -1 "$ROOT/inbox"
else
  echo "(空)"
fi

echo "── 技能↔名冊同步檢查（漏列＝aiflow 儀表板看不到）──"
if [ -f "$ROOT/tools/dashboard/agents-roster.json" ] && command -v node >/dev/null 2>&1; then
  node -e '
    const fs=require("fs"),path=require("path");
    const root=process.argv[1];
    const roster=JSON.parse(fs.readFileSync(path.join(root,"tools/dashboard/agents-roster.json"),"utf8"));
    const listed=new Set(Object.values(roster).flat());
    const dir=path.join(root,"skills");
    const folders=fs.existsSync(dir)?fs.readdirSync(dir).filter(f=>fs.existsSync(path.join(dir,f,"SKILL.md"))):[];
    const missing=folders.filter(f=>!listed.has(f));
    if(missing.length) console.log("⚠️ 這些技能沒列進 agents-roster.json，儀表板看不到，請補進對應類別："+missing.join("、"));
    else console.log("✓ 技能與名冊一致");
  ' "$ROOT" 2>/dev/null || echo "(同步檢查略過)"
else
  echo "(略過：缺 node 或 roster)"
fi
