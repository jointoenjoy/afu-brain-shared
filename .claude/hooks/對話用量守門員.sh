#!/usr/bin/env bash
# 對話用量守門員（掛 UserPromptSubmit）
# 目的：手機/web 同一個對話拉太長時，每送一句都要重讀整包脈絡、很燒 token。
# 這隻 hook 在脈絡偏大時，提示阿福「主動、每次」把『養腦＋開新對話』的選項遞給大寶。
# 註：本環境會自動壓縮續跑、不會掉進度；但長對話仍較貴，換主題就該開新的。
# 門檻用 transcript 檔大小(bytes)粗估，太吵或太鬆都可調下面 yellow/red 兩個值。

input=$(cat)
tp=$(printf '%s' "$input" | python3 -c "import sys,json;print(json.load(sys.stdin).get('transcript_path',''))" 2>/dev/null)
[ -z "$tp" ] && exit 0
[ -f "$tp" ] || exit 0

bytes=$(wc -c < "$tp" 2>/dev/null | tr -d ' ')
[ -z "$bytes" ] && exit 0

yellow=1200000   # ~黃燈：對話開始偏大
red=3000000      # ~紅燈：脈絡很大、明顯燒 token

if [ "$bytes" -ge "$red" ]; then
  echo "🔴【對話用量守門員】這個對話脈絡已經很大、每句都在重讀整包、很燒 token。阿福請主動提醒大寶：先確認手上東西都 commit/push 上 main，然後『養腦後開一個新對話』——先用一行列出這次值得長期記住的 1–3 條給他勾選，他點頭後寫進大腦，再請他開新對話。"
elif [ "$bytes" -ge "$yellow" ]; then
  echo "🔸【對話用量守門員】對話有點長了。阿福請主動跟大寶說一聲：同一件事可繼續（系統會自動壓縮續跑），若要換主題建議養腦後開新對話；先確認該 commit/push 的都上了 main。"
fi
exit 0
