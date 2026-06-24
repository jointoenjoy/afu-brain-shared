# 開工提醒 hook（SessionStart）

讓阿福「一開工就主動提醒待辦」的設定。原理：Claude Code 的 **SessionStart hook** 在每次開 session 時跑一段指令，stdout 會被塞進阿福的 context，他就會在開口第一句提醒大寶。

## 已經生效的部分（開 afu-brain 就會提醒）
`afu-brain/.claude/settings.json` 已設好 SessionStart hook → 跑 `.claude/hooks/開工提醒.sh`，
唸出 `待辦.md` 的未完成項目 + `inbox/`。**你 pull 下來、在本機開 afu-brain 時，Claude Code 會先問你是否信任本專案的 hook，按信任一次即可。**

## 要「開任意專案都提醒」（使用者層級，需在本機裝一次）
中央待辦放在 afu-brain，但你希望開「任何」專案都被提醒。把 hook 裝到使用者層級 `~/.claude/settings.json`，並用 afu-brain 的**絕對路徑**。本機阿福照做：

1. 確認 afu-brain 在本機的絕對路徑（例如 `~/afu-repos/afu-brain` 或實際 clone 位置），記為 `<AFU>`。
2. 在 `~/.claude/settings.json` 合併（已有內容就併進去，別整檔覆蓋）：

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          { "type": "command", "command": "grep -nE '^- \\[ \\]' <AFU>/待辦.md 2>/dev/null || true" }
        ]
      }
    ]
  }
}
```

3. 把 `<AFU>` 換成真實絕對路徑。存檔後，開任何專案的 Claude Code 都會先唸 afu-brain 的待辦。

> 注意：使用者層級設定在你電腦上、不在 repo 裡，雲端阿福改不到，所以這步一定在本機做。
