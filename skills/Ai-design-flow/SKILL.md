---
name: Ai-design-flow
category: 產品行銷
status: 草稿
owner: 阿福（調度）＋ 人類設計師（品味閘門）
---

# Ai-design-flow · AI 設計產線技能

> 金句:**人定調 · AI 生成 · 人精修 · AI 上線。**
> 品味歸人,產線歸 AI。一條繞著 Figma 的人機接力設計流。
> 目標:AI 把內頁量產出來,人類設計師再進 Figma 收尾、磨掉「AI 味」。

## 什麼時候用這個技能
要把一個產品/網站的內頁**大量做出來、又要保有人類設計品味**時。典型場景:mind-energy 線上課程內頁量產。單純做一張視覺圖用 `視覺設計`;這個技能管的是「**整條產線怎麼跑、人和 AI 怎麼接力**」。

## 核心心法
1. **真相只放一邊,兩邊別同時改**(像 git,同檔同改會打架)。講好誰擁有什麼:
   - **人類設計師擁有「零件」**:設計系統 + 元件(顏色、字體、間距、按鈕/卡片長相、整體美感)。
   - **AI 擁有「組裝」**:頁面組裝(這頁放哪些區塊、怎麼排、量產到上線)。
2. **雙向同步是「橋」不是「鏡子」**:不是按一鍵自動來回,是兩座要手動走的橋(程式→Figma 推回去、Figma→程式 拉回來),每次過橋阿福觸發一次。
3. **人類只在兩關出手**:階段 0(做首頁定調)、階段 5(在 Figma 微調);其餘 AI 放手跑,只在三紅線(個資/金流/改阿福大腦)停。

## 八步流程(完整版見 reference/工作流.md)
0. 〔人〕設計師在 Figma 做首頁、定調(照《Figma 交付給 AI 清單》做成 AI 讀得懂的系統)
1. 〔AI〕阿福抽出設計系統 → 寫成《設計規格母版》
2. 〔AI〕列內頁地圖、排優先序
3. 〔AI〕逐頁量產(每頁先給版面方案 → 對齊 → 寫 code,套母版 + `前端品味` 把關)
4. 〔AI〕把內頁**推回 Figma**(脫離 AI 味的關鍵橋)
5. 〔人〕設計師在 Figma 微調收尾、磨掉機器感
6. 〔AI〕重讀 Figma → 套回程式碼 → 上 sandbox → 上線
7. 〔AI〕沉澱成範本,下次更快

## 工具:Figma MCP(實際過橋的手)
本 session 已接上官方 Figma MCP,真正能讀寫 Figma。常用:
- 讀 Figma → 程式:`get_design_context`、`get_screenshot`、`get_metadata`、`get_variable_defs`(抽 tokens)
- 程式 → Figma:`use_figma`(用前先讀 `/figma-use` skill)、`generate_figma_design`、`create_new_file`
- 對映一致性:`get_code_connect_map`、`add_code_connect_map`(需元件化程式碼)
- 抽設計系統時搭 `get_libraries`、`search_design_system`

## 搭配技能
- `視覺設計`:決定用哪套視覺系統(正式品牌系統 vs 藍圖原型風)。
- `前端品味`:寫 code 時的鐵則與出貨前檢查(破折號鐵律、禁三等寬卡、零 AI tell);重動態頁讀其 `reference/設計參考庫與GSAP工作流.md`。

## 限制提醒
- 完整 Code Connect 雙向綁定需要**元件化的程式碼(React 那類)**。單檔 HTML 只能走輕量版(推快照 → 設計師調 → 重讀套回)。要不要升級框架,等首頁定稿再評估。

## 參考檔
- `reference/工作流.md`:八步完整白話版(麻瓜看得懂)。
- `reference/Figma交付給AI清單.md`:階段 0 設計師交付給 AI 的規格。
- `reference/藍圖.html`:給人看的視覺藍圖(套品牌系統、零 AI tell、可部署)。
