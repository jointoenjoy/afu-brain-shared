---
name: 設計參考庫與GSAP工作流
category: 產品行銷
status: 啟用
source: 大寶分享「GSAP AI Skills + 設計參考」實戰文（AIPost 官網 Demo，2026-06-19）
note: 「前端品味」的品味＋技術放大器。規則層看上一層 SKILL.md；本檔補「給 AI 什麼參考、用什麼工作流、裝什麼技術」。
---

# 設計參考庫 與 GSAP 工作流

> 一句話心法（大寶 2026-06 實測）：**AI 很會寫程式，缺的是明確的美學方向、好的設計參考、和你對「什麼叫高質感」的判斷。**
> GSAP Skills 補技術、設計參考補品味，兩個加在一起，網站才不會「一臉 AI 味」。
> 「前端品味」的鐵則（破折號、禁三等寬卡、Hero 規範…）負責「不出錯」；本檔負責「往上抬到作品級」。

---

## 一、技術層：裝 GSAP 官方 Skills（讓動畫寫得對）

GreenSock 官方出的 AI Skills，解決「GSAP 程式寫得對不對」。做**滾動敘事、Hero 進場、ScrollTrigger pin、頁面轉場**這類重動態頁前先裝：

- 一般專案：`npx skills add https://github.com/greensock/gsap-skills`
- Claude Code：`/plugin marketplace add greensock/gsap-skills`

裝了它只解決「技術正確」。**質感還是要靠下面的參考＋工作流。** 本技能 `reference/taste-skill-原版.md` 第 5 節已有手寫 GSAP 骨架（stack-cards、horizontal-pin、scroll-reveal），官方 Skills 是更完整的補充，不衝突。
鐵律不變：`window.addEventListener('scroll')` 禁用、同一元件樹**不要混** GSAP 與 Motion、`動態強度 > 3` 一律包 `prefers-reduced-motion`。

---

## 二、品味層：給 AI 好的設計參考（最關鍵的一步）

### 工作流（六步，照這個跑，別讓 AI 走回模板路）
1. **裝好 GSAP Skills**（重動態頁才需要）。
2. **丟 2~4 個高質感參考**給 AI（連結或截圖），明說「往這個方向、這種質感」。
3. **明確限制它「不要做什麼」**（見下方禁區清單，比「做個好看的」有效十倍）。
4. **先請它產出設計方案／視覺方向，不要急著寫 code**——對齊配色、字體、版面節奏、動畫意圖。
5. **確認視覺方向後**才開始實作。
6. **針對 Hero、ScrollTrigger、Dashboard／關鍵段動畫反覆微調**，一次一塊。

> 對應 CLAUDE.md 五階段：第 4 步＝階段一對齊（大寶點頭的閘門），第 5~6 步＝階段二製作。**先給方向、再寫 code** 就是這裡的精神。

### Prompt 鐵則：先講「不要」，再講「要」
不要只說「幫我做一個好看的網站」。先**封死最安全、最模板的那條路**：

**不要（通用 AI tell，貼進 prompt 直接禁）**
- 不要紫藍漸層球 / mesh 背景
- 不要玻璃擬態（毛玻璃）卡片
- 不要普通的整頁 fade in
- 不要制式 landing page、不要做成一般 AI SaaS 官網
- 不要三張一模一樣的功能卡、不要 `Inter + slate-900`
- 不要全形破折號 `—`（本技能零容忍）

**要（給方向，挑 1~2 個當主軸）**
- 滾動式敘事（scroll-driven narrative）、有節奏的動畫轉場
- digital magazine / 編輯風排版（適合練息場：溫暖、有呼吸）
- 高質感產品網站（精品級留白與細節）
- creative developer portfolio（要實驗感時才用，練息場慎用）
- AI intelligence dashboard（資料感，僅適合報告／後台類頁）

---

## 三、練息場專屬參考庫（挑對方向，別亂抄）

練息場＝**療癒身心品牌，溫暖 × 科學實證**。轉盤預設偏低（VARIANCE 6 / MOTION 4 / DENSITY 3），動態與顏色都要克制。**先選對「美學家族」，再去畫廊找活範例。**

### 適合練息場的美學家族（往這裡靠）
| 方向 | 為什麼適合 | 動態調性 |
| --- | --- | --- |
| 編輯／雜誌風（editorial） | 溫暖、有呼吸、適合放科學內容與故事 | 克制的 scroll-reveal、慢淡入 |
| 平靜滾動敘事（calm scroll-telling） | 帶人「沉下來」，呼應正念冥想 | ScrollTrigger 慢 scrub、段落 pin |
| 精品產品頁（premium product） | 撐起「科學實證、值得信賴」的質感 | Hero 進場、hover 微回饋 |
| 柔和資料視覺（soft data-viz） | Strength Well 心理報告／企業報告適用 | 數字 count-up、圖表漸進顯現 |

### 不適合練息場（避開）
- 高速 kinetic creative-dev 炫技（太吵，傷療癒調性）
- 暗黑 AI SaaS（紫光、mesh、毛玻璃，正是要避的 AI tell）
- 密集 dashboard 當對外行銷頁（資料感留給後台／報告）

### 配色（一律以 [[品牌視覺規範]] Figma 為準，這裡給「怎麼用」）
- **主軸**：白／淺底為主、主藍 `#004D89` 為主色、鮮彩（綠 `#42C01E`／青綠 `#23CDA0`／橘 `#FF9925`／蜜桃 `#F9B497`／紫 `#A29CF1`）只當**點綴與圖形**，一頁鎖一個強調色。
- **柔調背景**：`#E5EDF3`、`#D3F5EC`、`#FFFBEA`、`#FEF0EA` 這類，撐留白與療癒感。
- **絕不**用 AI 預設紫藍漸層（練息場的紫 `#A29CF1` 是品牌點綴色，不是漸層球）。
- 字體：標題金萱 `jf-jinxuan`，內文無襯線黑體（Helvetica／Noto Sans TC）。**不要 serif tell（Fraunces／Instrument_Serif）。**

### 找活參考的畫廊（要新鮮範例時開，不是抄整站）
- Awwwards、Godly、Land-book、Httpster：找滾動敘事／editorial／精品頁的當代做法。
- Mobbin：找互動與流程模式（Login → Dashboard 轉場這類）。
- 用法：挑**符合上面美學家族**的 2~4 個，丟給 AI 當方向，**不是整站照搬**——抄的是節奏與質感，不是版型。

---

## 四、出貨前加問三句（接 SKILL.md 的 Pre-Flight）
1. 我有先**給方向＋給參考**，還是只說「做個好看的」？
2. 我有先**封死「不要做什麼」**（紫藍漸層／毛玻璃／普通 fade／三等寬卡／破折號）？
3. Hero、關鍵滾動段、轉場——每個動畫**講得出目的**嗎（層級／敘事／回饋）？還是只是「看起來酷」？

相關：[[品牌視覺規範]]、[[AI開發與設計工作流]]、`reference/taste-skill-原版.md`
