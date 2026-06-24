#!/usr/bin/env node
// 阿福成長儀表板產生器：讀大腦 repo + 名冊 + GitHub 全部 repo → 輸出 阿福-status.html
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = execSync("git rev-parse --show-toplevel").toString().trim();
const out = path.join(ROOT, "阿福-status.html");
const sh = (c) => { try { return execSync(c, { cwd: ROOT }).toString().trim(); } catch { return ""; } };
const fileDate = (rel) => sh(`git log -1 --format=%cd --date=short -- "${rel}"`) || "—";
const listDir = (rel) => { const p = path.join(ROOT, rel); return fs.existsSync(p) ? fs.readdirSync(p) : []; };
const isHidden = (n) => n.startsWith(".") || n === "README.md";
const readJson = (rel, def) => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8")); } catch { return def; } };

// ---- 知識分類 ----
const kbRoot = "品牌知識庫";
const kbCats = listDir(kbRoot).filter((n) => { try { return fs.statSync(path.join(ROOT, kbRoot, n)).isDirectory(); } catch { return false; } });
const knowledge = kbCats.map((cat) => {
  const files = listDir(path.join(kbRoot, cat)).filter((n) => !isHidden(n));
  return { cat, files: files.map((f) => ({ name: f, date: fileDate(path.join(kbRoot, cat, f)) })), date: fileDate(path.join(kbRoot, cat)) };
});
const kbCount = knowledge.reduce((a, c) => a + c.files.length, 0);
const core = ["CLAUDE.md", "養腦SOP.md", "你的思維.md", "教訓.md"].filter((f) => fs.existsSync(path.join(ROOT, f))).map((f) => ({ name: f, date: fileDate(f) }));

// ---- AI 軍團（名冊 vs 已做 skill）----
const roster = readJson("tools/dashboard/agents-roster.json", {});
const skillDate = (name) => { const p = path.join("skills", name, "SKILL.md"); return fs.existsSync(path.join(ROOT, p)) ? fileDate(p) : null; };
const fleet = Object.entries(roster).map(([g, items]) => ({ g, items: items.map((name) => ({ name, date: skillDate(name) })) }));
const totalA = fleet.reduce((a, g) => a + g.items.length, 0);
const doneA = fleet.reduce((a, g) => a + g.items.filter((i) => i.date).length, 0);

// ---- 專案統管（GitHub 全部 repo vs 已介入名冊）----
const engaged = readJson("tools/dashboard/projects.json", []);
const eMap = Object.fromEntries(engaged.map((p) => [p.name, p]));
let orgRepos = [];
try { orgRepos = JSON.parse(execSync("gh repo list jointoenjoy --limit 100 --json name,url,description,homepageUrl", { cwd: ROOT }).toString()); }
catch { orgRepos = engaged.map((p) => ({ name: p.name, url: p.github, description: p.desc })); }
const pagesUrl = (name) => { const u = sh(`gh api repos/jointoenjoy/${name}/pages --jq .html_url 2>/dev/null`); return u && u.startsWith("http") ? u : null; };
let projects = orgRepos.map((r) => {
  const e = eMap[r.name] || {};
  return { name: r.name, desc: e.desc || r.description || "", github: e.github || r.url, pages: e.pages || pagesUrl(r.name) || r.homepageUrl || null, test: e.test || null, prod: e.prod || null, engaged: !!eMap[r.name] };
});
projects.sort((a, b) => (b.engaged - a.engaged) || a.name.localeCompare(b.name));
const engagedCount = projects.filter((p) => p.engaged).length;

// ---- git 指標 ----
const commits = sh("git rev-list --count HEAD") || "0";
const born = sh("git log --reverse --format=%cd --date=short | head -1") || "—";
const lastUpdate = sh("git log -1 --format=%cd --date=short") || "—";

// ---- 固定結構 ----
const constitution = [["L0 北極星", "解放「工」、讓創意疊加、做讓身心變好的產品（不可動）"], ["L1 紅線治理", "① 使用者資料 ② 金流 ③ 改阿福自己的大腦 → 一律先問大寶"], ["L2 品牌核心價值", "溫暖 × 科學實證、像朋友、好懂、不機器人"], ["L3 工作心法", "唯一可累積、可被新心法精煉的一層（不得違背 L0–L2）"]];
const humans = [["Simon", "主理人・哲學文化・AI builder"], ["大寶", "營運企劃（阿福主要服務的人）"], ["立希 & 冠瑋", "Well 內容（心理師）"], ["Myling", "Chill 活動社群 PM"], ["珍妮", "行政大總管"], ["安妮", "AI 工程師・工程把關"]];

// ---- 阿福平時怎麼陪你做專案：五階段自動化工作流 ----
const workflow = [
  { n: "1", phase: "對齊", gate: ["唯一人類閘門", "gate"], desc: "確認目標、討論規格、給藍圖。等大寶說 OK 才往下。", sub: "查市場／競品／UX → 派洞察研究分身；藍圖統籌阿福自己做。" },
  { n: "2", phase: "製作", gate: ["放手", "ok"], desc: "照藍圖做最小可動版。", sub: "做頁面／開發／設計／文案／簡報 → 派產品行銷分身。" },
  { n: "3", phase: "驗證", gate: ["放手", "ok"], desc: "build ＋冒煙測試，沒過修到過；截圖自我 QA。", sub: "派營運治理分身（QA 程式審查）。" },
  { n: "4", phase: "資安自檢", gate: ["守紅線", "red"], desc: "漏洞自查、skill 體檢。碰個資（黃）、金流金鑰（紅）就停下找人。", sub: "派營運治理分身（資安分級）。" },
  { n: "5", phase: "收尾上架", gate: ["阿福自己扛", "ok"], desc: "上 sandbox 測試站，自動跳最相關那頁＋附網址。", sub: "分身只回結論、不 commit、不上架；收尾與紅線把關一律阿福做。" },
];
const principles = [
  ["開工 pull · 收工 push", "單一真相在 GitHub，每台裝置開工先 pull、收工再 push，永遠同步。"],
  ["搜尋預設輕量", "先 1–2 個 WebSearch、夠用就停；大寶說「深入」才升級成重型研究。"],
  ["自己做 vs 派分身", "輕的、要來回的自己做；要讀很多／做很多、只要結論 → 派三隻分身。"],
  ["省 token＝替大寶把關金流", "token 等於大寶的金流，預設求快求省、不浪費。"],
];

// ---- 阿福的工具箱：他實際在用的能力 ----
const toolbox = [
  ["查資料", "WebSearch／WebFetch 查市場、競品、AI 新知，讀網址自動摘要重點。"],
  ["寫程式 · 改檔", "讀寫專案檔案、跑指令、開發頁面與小工具。"],
  ["版本 · 同步", "git pull／commit／push，GitHub 當單一真相，多裝置永遠一致。"],
  ["上架 · 部署", "Cloudflare Pages 部署 sandbox 測試站、本機預覽，做完自動跳頁給你看。"],
  ["三隻分身", "洞察研究、產品行銷、營運治理 — 重活派出去、只回結論，不佔主桌。"],
  ["技能庫 skills", "十多個現成技能照場景調用，沒有就草擬新的、請你核可後新增。"],
  ["資安自檢", "SkillSpector 掃 skill 漏洞、風險分級把關三條紅線。"],
  ["記憶 · 成長", "情節記憶、教訓、你的思維、養腦 SOP，越用越聰明。"],
  ["溝通 · 收件", "Telegram 像朋友跟你對話、inbox 收你手機隨手丟的東西。"],
];

// ---- HTML ----
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const tag = (d) => `<span class="ds-tag">${esc(d)}</span>`;
const card = (h, p, extra = "") => `<div class="ds-card"><h4>${esc(h)}</h4><p>${esc(p)}</p>${extra}</div>`;
const lk = (u, label) => u ? `<a href="${esc(u)}" target="_blank">${esc(label)}</a>` : `<span class="no">—</span>`;

const knowledgeHtml = knowledge.map((k) => `
  <details class="ds-acc"><summary><b>${esc(k.cat)}</b> · ${k.files.length} 檔 ${tag(k.date)}</summary>
  ${k.files.length ? k.files.map((f) => `<div class="ds-item">${esc(f.name)} ${tag(f.date)}</div>`).join("") : '<div class="ds-item" style="color:var(--ds-text-3)">（尚無檔案，待倒入）</div>'}</details>`).join("");

const fleetHtml = fleet.map((g) => `<div class="ds-card"><h4>${esc(g.g)} <span class="ds-tag">${g.items.filter((i) => i.date).length}/${g.items.length}</span></h4>
  ${g.items.map((i) => `<div class="row"><span>${esc(i.name)}</span>${i.date ? `<span class="badge ok">已有 ${i.date}</span>` : `<span class="badge todo">待製作</span>`}</div>`).join("")}</div>`).join("");

const workflowHtml = workflow.map((w) => `<div class="ds-card">
  <h4><span class="stepnum">${esc(w.n)}</span>${esc(w.phase)} <span class="badge ${w.gate[1]}">${esc(w.gate[0])}</span></h4>
  <p>${esc(w.desc)}</p>
  <div class="wf-sub">${esc(w.sub)}</div></div>`).join("");

const projectsHtml = projects.map((p) => `<tr class="${p.engaged ? "" : "dim"}">
  <td><b>${esc(p.name)}</b><div class="sub">${esc(p.desc)}</div></td>
  <td>${lk(p.github, "GitHub")}</td>
  <td>${lk(p.pages, "公開頁")}</td>
  <td>${lk(p.test, "測試站")}</td>
  <td>${lk(p.prod, "正式站")}</td>
  <td>${p.engaged ? '<span class="badge ok">已介入</span>' : '<span class="badge todo">未介入</span>'}</td></tr>`).join("");

const html = `<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>阿福成長儀表板</title><style>
:root{--ds-bg:#f5f5f7;--ds-surface:#fff;--ds-border:#d2d2d7;--ds-text:#1d1d1f;--ds-text-2:#515154;--ds-text-3:#86868b;--ds-blue:#0071e3;--ds-blue-ink:#0058b9;--ds-blue-soft:#eef5fd;--ds-green:#1a7f37;--ds-green-soft:#e6f4ea;--ds-radius:16px;--ds-fh:-apple-system,"SF Pro Display","PingFang TC","Heiti TC",sans-serif;--ds-fb:ui-rounded,"SF Pro Rounded","-apple-system","PingFang TC",sans-serif;}
*{box-sizing:border-box;margin:0;padding:0;}body{font-family:var(--ds-fb);font-size:15px;line-height:1.6;color:var(--ds-text);background:var(--ds-bg);-webkit-font-smoothing:antialiased;}
.wrap{max-width:1040px;margin:0 auto;padding:40px 28px;}
h1,h2,h3,h4{font-family:var(--ds-fh);font-weight:800;letter-spacing:-.02em;line-height:1.2;}
h3.sec{font-size:13px;letter-spacing:1px;text-transform:uppercase;color:var(--ds-blue);margin:40px 0 14px;}
.hero{background:var(--ds-blue);color:#fff;border-radius:20px;padding:30px 28px;}
.hero .v{font-family:var(--ds-fh);font-size:24px;font-weight:800;}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px;margin-top:18px;}
.stat{background:rgba(255,255,255,.14);border-radius:12px;padding:12px 14px;}.stat b{font-size:22px;display:block;}.stat span{font-size:12px;opacity:.9;}
.ds-grid{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));}
.ds-card{background:var(--ds-surface);border:1px solid var(--ds-border);border-radius:var(--ds-radius);padding:18px 20px;}
.ds-card h4{color:var(--ds-text);margin-bottom:8px;font-size:15px;}.ds-card p{color:var(--ds-text-2);font-size:14px;}
.ds-tag{display:inline-block;font-size:11px;background:var(--ds-blue-soft);color:var(--ds-blue-ink);border-radius:7px;padding:2px 8px;margin-left:4px;}
.ds-item{background:var(--ds-bg);border-radius:9px;padding:8px 12px;font-size:14px;margin:6px 0;}
.ds-acc{background:var(--ds-surface);border:1px solid var(--ds-border);border-radius:var(--ds-radius);padding:6px 18px;margin-bottom:12px;}
.ds-acc summary{cursor:pointer;padding:12px 0;font-size:15px;list-style:none;}.ds-acc summary::-webkit-details-marker{display:none;}
.ds-acc summary::before{content:"▸ ";color:var(--ds-blue);}.ds-acc[open] summary::before{content:"▾ ";}
.row{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--ds-bg);font-size:14px;}
.badge{font-size:11px;border-radius:7px;padding:2px 9px;white-space:nowrap;}
.badge.ok{background:var(--ds-green-soft);color:var(--ds-green);}.badge.todo{background:var(--ds-bg);color:var(--ds-text-3);border:1px solid var(--ds-border);}
.badge.gate{background:var(--ds-blue-soft);color:var(--ds-blue-ink);}.badge.red{background:#fdecea;color:#b3261e;}
.stepnum{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:var(--ds-blue);color:#fff;font-size:12px;font-weight:800;margin-right:8px;vertical-align:middle;}
.wf-sub{background:var(--ds-bg);border-radius:9px;padding:7px 11px;font-size:12.5px;color:var(--ds-text-2);margin-top:10px;}
table{width:100%;border-collapse:collapse;background:var(--ds-surface);border:1px solid var(--ds-border);border-radius:var(--ds-radius);overflow:hidden;}
th,td{text-align:left;padding:12px 14px;border-bottom:1px solid var(--ds-bg);font-size:14px;vertical-align:top;}
th{background:var(--ds-bg);font-size:12px;color:var(--ds-text-2);font-weight:700;}
td .sub{color:var(--ds-text-3);font-size:12px;}tr.dim td{opacity:.55;}
a{color:var(--ds-blue);text-decoration:none;}.no{color:var(--ds-text-3);}
.flow{display:flex;flex-wrap:wrap;align-items:center;gap:8px;}.flow .n{background:var(--ds-surface);border:1px solid var(--ds-border);border-radius:12px;padding:10px 14px;font-size:14px;text-align:center;flex:1;min-width:120px;}.flow .a{color:var(--ds-blue);font-weight:700;}
.foot{color:var(--ds-text-3);font-size:13px;margin-top:36px;text-align:center;}
</style></head><body><div class="wrap">

<div class="hero">
  <div style="font-size:11px;letter-spacing:3px;opacity:.85">阿福成長儀表板 · 自動產生自 git</div>
  <div class="v">阿福現在管多大？</div>
  <div class="stats">
    <div class="stat"><b>${doneA}/${totalA}</b><span>AI 軍團（已做/總）</span></div>
    <div class="stat"><b>${engagedCount}/${projects.length}</b><span>已介入專案/全部</span></div>
    <div class="stat"><b>${kbCount}</b><span>知識檔</span></div>
    <div class="stat"><b>${commits}</b><span>git 提交</span></div>
    <div class="stat"><b>${lastUpdate}</b><span>最後更新</span></div>
  </div>
</div>

<h3 class="sec">AI 軍團 · 完成度 ${doneA}/${totalA}（綠＝已做，灰＝待製作）</h3>
<div class="ds-card" style="border-left:4px solid var(--ds-blue);margin-bottom:12px"><h4>阿福（總管 Orchestrator）</h4><p>人一給起頭就接手，調度下面三大類，把資料攤給人決策。</p></div>
<div class="ds-grid">${fleetHtml}</div>

<h3 class="sec">阿福的工具箱 · 他實際在用的能力</h3>
<div class="ds-grid">${toolbox.map(([h, p]) => card(h, p)).join("")}</div>

<h3 class="sec">阿福平時怎麼陪你做專案 · 五階段自動化工作流</h3>
<div class="ds-card" style="border-left:4px solid var(--ds-blue);margin-bottom:14px"><p>大寶丟一個專案，阿福預設這樣跑：<b>只在「藍圖」這關等你點頭</b>，點頭後自己跑到測試站、做完才回報；中途只有踩三條紅線（使用者資料、金流、改阿福的大腦）才再停下來問。每階段先去 <code>skills/</code> 找對的技能，重活派分身、輕的自己做。</p></div>
<div class="ds-grid">${workflowHtml}</div>
<div class="ds-grid" style="margin-top:14px">${principles.map(([h, p]) => card(h, p)).join("")}</div>

<h3 class="sec">阿福統管的專案（已介入 vs 還沒）</h3>
<table><thead><tr><th>專案</th><th>GitHub</th><th>公開頁</th><th>測試站</th><th>正式站</th><th>阿福</th></tr></thead><tbody>${projectsHtml}</tbody></table>

<h3 class="sec">阿福現在有的知識（點開看細節）</h3>
${knowledgeHtml || '<div class="ds-item">（尚無分類）</div>'}
<div class="ds-grid" style="margin-top:8px">${core.map((c) => card(c.name, "核心規則檔", tag(c.date))).join("")}</div>

<h3 class="sec">阿福的四層決策憲法（做任何事都先對齊）</h3>
<div class="ds-grid">${constitution.map(([h, p]) => card(h, p)).join("")}</div>

<h3 class="sec">與人類的關係</h3>
<div class="ds-card" style="margin-bottom:12px"><p>人出創意、給方向、做最終決策（尤其碰到三條紅線）；阿福負責調度 agent 把「工」做掉、並在關鍵點把決策權交回對的人。</p></div>
<div class="ds-grid">${humans.map(([h, p]) => card(h, p)).join("")}</div>

<div class="foot">阿福誕生於 ${born}　·　最後更新 ${lastUpdate}　·　共 ${commits} 次提交<br>此頁由 tools/dashboard/generate-status.mjs 自動產生。新增待辦 agent 改 agents-roster.json；阿福介入新專案改 projects.json。</div>
</div></body></html>`;

fs.writeFileSync(out, html);
console.log("已產生：" + out + ` ｜ 軍團 ${doneA}/${totalA}｜專案 ${engagedCount}/${projects.length}`);
