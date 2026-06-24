---
name: design-taste-frontend
description: Anti-slop frontend skill for landing pages, portfolios, and redesigns. The agent reads the brief, infers the right design direction, and ships interfaces that do not look templated. Real design systems when applicable, audit-first on redesigns, strict pre-flight check.
source: Leonxlnx/taste-skill · skills/taste-skill/SKILL.md (GitHub, 2026)
note: 這是英文原版，給「要查設計系統對照表 / GSAP 骨架 / Block Library / 附錄」時打開。日常規則看上一層 SKILL.md（繁中精煉版）即可。
---

# Design-Taste-Frontend Skill (原版全文)

## 0. BRIEF INFERENCE (Read the Room Before Anything Else)

Before touching code, **infer what the user actually wants**. LLM design output defaults to clichés instead of reading context.

### 0.A Read these signals first
1. **Page kind** - landing (SaaS / consumer / agency / event), portfolio (dev / designer / creative studio), redesign (preserve vs overhaul), editorial / blog.
2. **Vibe words** the user used - "minimalist", "calm", "Linear-style", "Awwwards", "brutalist", "premium consumer", "Apple-y", "playful", "serious B2B".
3. **Reference signals** - URLs linked, screenshots pasted, products named, brands competing.
4. **Audience** - B2B procurement vs. design-conscious consumer vs. recruiter. Audience picks the aesthetic.
5. **Brand assets that exist** - logo, color, type, photography. For redesigns, these are starting material.
6. **Quiet constraints** - accessibility-first, public-sector, regulated industries, trust-first commerce, kids' products. These OVERRIDE aesthetic preference.

### 0.B Output a one-line "Design Read" before generating
Before any code: **"Reading this as: <page kind> for <audience>, with a <vibe> language, leaning toward <design system or aesthetic family>."**

### 0.C If ambiguous, ask one clarifying question only
Ask exactly **one** question when the design read diverges. If confident, **declare the design read and proceed** without asking.

### 0.D Anti-Default Discipline
Do not default to: AI-purple gradients, centered hero over dark mesh, three equal feature cards, generic glassmorphism, infinite micro-animations, Inter + slate-900. Reach past them deliberately based on the design read.

---

## 1. THE THREE DIALS (Core Configuration)
After the design read, set three dials. Every layout, motion, and density decision follows.

* **`DESIGN_VARIANCE: 8`** - 1 = Perfect Symmetry, 10 = Artsy Chaos
* **`MOTION_INTENSITY: 6`** - 1 = Static, 10 = Cinematic / Physics
* **`VISUAL_DENSITY: 4`** - 1 = Art Gallery / Airy, 10 = Cockpit / Packed Data

**Baseline:** `8 / 6 / 4`. Override conversationally based on brief inference.

### 1.A Dial Inference (design read → dial values)
| Signal | VARIANCE | MOTION | DENSITY |
|---|---|---|---|
| "minimalist / clean / calm / editorial / Linear-style" | 5-6 | 3-4 | 2-3 |
| "premium consumer / Apple-y / luxury / brand" | 7-8 | 5-7 | 3-4 |
| "playful / wild / Dribbble / Awwwards / experimental / agency" | 9-10 | 8-10 | 3-4 |
| "landing page / portfolio / marketing site (default)" | 7-9 | 6-8 | 3-5 |
| "trust-first / public-sector / regulated / accessibility-critical" | 3-4 | 2-3 | 4-5 |
| "redesign - preserve" | match existing | +1 | match existing |
| "redesign - overhaul" | +2 | +2 | match existing |

### 1.B Use-Case Presets
| Use case | VARIANCE | MOTION | DENSITY |
|---|---|---|---|
| Landing (SaaS, mainstream) | 7 | 6 | 4 |
| Landing (Agency / creative) | 9 | 8 | 3 |
| Landing (Premium consumer) | 7 | 6 | 3 |
| Portfolio (Designer / studio) | 8 | 7 | 3 |
| Portfolio (Developer) | 6 | 5 | 4 |
| Editorial / Blog | 6 | 4 | 3 |
| Public-sector service | 3 | 2 | 5 |
| Redesign - preserve | match | match+1 | match |
| Redesign - overhaul | +2 | +2 | match |

---

## 2. BRIEF → DESIGN SYSTEM MAP
Pick the right foundation. Do not invent CSS for things with official packages. Do not treat aesthetic trends as official systems.

### 2.A When to reach for a real design system (use official packages)
| Brief reads as… | Reach for | Why |
|---|---|---|
| Microsoft / enterprise SaaS / dashboards | `@fluentui/react-components` or `@fluentui/web-components` | Official Fluent UI |
| Google-ish UI, Material-flavored product | `@material/web` + Material 3 tokens | Official, theme-able |
| IBM-style B2B / enterprise analytics | `@carbon/react` + `@carbon/styles` | Official Carbon |
| Shopify app surfaces | `polaris.js` web components / Polaris React | Required for Shopify admin |
| Atlassian / Jira-style product | `@atlaskit/*` + `@atlaskit/tokens` | Official Atlassian DS |
| GitHub-style devtool / community page | `@primer/css` or `@primer/react-brand` | Official Primer |
| Public-sector UK service | `govuk-frontend` | Legally expected |
| US public-sector / trust-first | `uswds` | Same |
| Fast local-business / agency MVP | Bootstrap 5.3 | Boring, fast, works |
| Modern accessible React foundation | `@radix-ui/themes` | Primitives + polished theme |
| Modern SaaS where you own the components | shadcn/ui (`npx shadcn@latest add ...`) | You own the code |
| Tailwind-based modern SaaS / AI marketing | Tailwind v4 utilities + `dark:` variant | Default for indie / small team |

**Honesty rule:** if the brief reads as one of the systems above, install and use the **official** package. Do not recreate CSS by hand. Do not import a system's tokens but then override 90% of them. **One system per project.**

### 2.B When the brief is an aesthetic, not a system
For these directions there is **no single official package**. Build with native CSS + Tailwind + a maintained component library.

| Aesthetic | Honest implementation |
|---|---|
| Glassmorphism / "frosted glass" | `backdrop-filter`, layered borders, highlight overlays. Solid fallback for `prefers-reduced-transparency`. |
| Bento (Apple-style tile grids) | CSS Grid with mixed cell sizes. |
| Brutalism | Native CSS, monospace, raw borders. |
| Editorial / magazine | Serif type, asymmetric grid, generous whitespace. |
| Dark tech / hacker | Mono + accent neon, terminal motifs. |
| Aurora / mesh gradients | SVG or layered radial gradients. |
| Kinetic typography | Native CSS animations, scroll-driven animations, GSAP for hijacks. |
| **Apple Liquid Glass** | Apple documents this for Apple platforms only. **There is no official `liquid-glass.css`.** Web = approximation using `backdrop-filter` + layered borders + highlights. Label as approximation. |

---

## 3. DEFAULT ARCHITECTURE & CONVENTIONS
Unless the design read picks a real design system, these are the defaults:

### 3.A Stack
* **Framework:** React or Next.js. Default to Server Components (RSC). Global state works ONLY in Client Components. Any component using Motion / scroll listeners / pointer physics MUST be an isolated leaf with `'use client'` at the top.
* **Styling:** **Tailwind v4** (default). For v4: do NOT use `tailwindcss` plugin in `postcss.config.js`; use `@tailwindcss/postcss` or the Vite plugin.
* **Animation:** **Motion** (formerly Framer Motion). Import from `motion/react`.
* **Fonts:** Always `next/font` or self-host with `@font-face` + `font-display: swap`. Never link Google Fonts via `<link>` in production.

### 3.B State
* Local `useState` / `useReducer` for isolated UI. Global state only to avoid deep prop-drilling (Zustand, Jotai, context).
* **NEVER** use `useState` to track continuous values (mouse position, scroll progress, pointer physics). Use Motion's `useMotionValue` / `useTransform` / `useScroll`.

### 3.C Icons
* **Allowed (priority):** `@phosphor-icons/react`, `hugeicons-react`, `@radix-ui/react-icons`, `@tabler/icons-react`.
* **Discouraged:** `lucide-react` (only if user asks or project already uses it).
* **NEVER hand-roll SVG icons.** One family per project. Standardize `strokeWidth` globally.

### 3.D Emoji Policy
Discouraged by default. Replace symbols with icon-library glyphs. Override: allow emojis only when the user explicitly asks for a playful / chat-style / social-native vibe.

### 3.E Responsiveness & Layout Mechanics
* Breakpoints `sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536`. Contain with `max-w-[1400px] mx-auto` or `max-w-7xl`.
* **Viewport Stability:** NEVER `h-screen` for full-height Hero. ALWAYS `min-h-[100dvh]`.
* **Grid over Flex-Math:** NEVER complex flexbox percentage math. ALWAYS CSS Grid.

### 3.F Dependency Verification (mandatory)
Before importing ANY 3rd-party library, check `package.json`. If missing, output the install command first. Never assume a library exists.

---

## 4. DESIGN ENGINEERING DIRECTIVES (Bias Correction)

### 4.1 Typography
* **Display / Headlines:** Default `text-4xl md:text-6xl tracking-tighter leading-none`.
* **Body:** Default `text-base text-gray-600 leading-relaxed max-w-[65ch]`.
* **Sans choice:** Discouraged default `Inter`. Pick `Geist`, `Outfit`, `Cabinet Grotesk`, `Satoshi`, or a brand-appropriate serif first. Inter OK for neutral / Linear-style / public-sector / a11y-first.
* **Pairings:** `Geist`+`Geist Mono`, `Satoshi`+`JetBrains Mono`, `Cabinet Grotesk`+`Inter Tight`, `GT America`+`IBM Plex Mono`.
* **SERIF DISCIPLINE (VERY DISCOURAGED AS DEFAULT):** "feels creative/premium/editorial" is NOT a reason. Serif only when the brand brief names a serif, OR the aesthetic is genuinely editorial / luxury / publication / manuscript / heritage / vintage AND you can articulate why. **Specifically BANNED as defaults:** `Fraunces` and `Instrument_Serif`. If justified, rotate from: PP Editorial New, GT Sectra Display, Reckless Neue, Tiempos Headline, Recoleta, Cormorant Garamond, Playfair Display, EB Garamond, Canela, Domaine Display, etc.
* **EMPHASIS RULE:** emphasize a word with italic/bold of the SAME font. Never inject a random serif word into a sans headline.
* **ITALIC DESCENDER CLEARANCE:** italic display words with `y g j p q` need `leading-[1.1]` min + `pb-1`/`mb-1` reserve, else descenders clip.

### 4.2 Color Calibration
* Max 1 accent color. Saturation < 80% by default.
* **THE LILA RULE:** the "AI Purple / Blue glow" aesthetic is discouraged. Neutral bases (Zinc / Slate / Stone) + high-contrast singular accents (Emerald, Electric Blue, Deep Rose, Burnt Orange). Override only if brand asks for purple.
* **COLOR CONSISTENCY LOCK:** once an accent is chosen, it is used on the WHOLE page. One palette per project.
* **PREMIUM-CONSUMER PALETTE BAN:** for premium-consumer briefs the LLM default beige/cream + brass/clay/oxblood/ochre + espresso/ink is BANNED as default reach. Banned hex families: bg `#f5f1ea #f7f5f1 #fbf8f1 #efeae0 #ece6db #faf7f1 #e8dfcb`; accents `#b08947 #b6553a #9a2436 #9c6e2a #bc7c3a #7d5621`; text `#1a1714 #1a1814 #1b1814`. Alternatives (rotate): Cold Luxury (silver-grey+chrome+smoke), Forest (deep green+bone+amber), Black and Tan, Cobalt+Cream, Terracotta+Slate, Olive+Brick+Paper, Pure monochrome + single saturated pop.

### 4.3 Layout Diversification
* **ANTI-CENTER BIAS:** centered Hero/H1 avoided when `DESIGN_VARIANCE > 4`. Force Split Screen, Left-content/right-asset, Asymmetric white-space, or scroll-pinned. Centered hero OK for editorial / manifesto / launch briefs.

### 4.4 Materiality, Shadows, Cards
* Cards ONLY when elevation communicates real hierarchy. Otherwise group with `border-t`, `divide-y`, or negative space.
* Tint shadows to background hue. No pure-black drop shadows on light backgrounds. For `VISUAL_DENSITY > 7`: generic card containers banned.
* **SHAPE CONSISTENCY LOCK:** pick ONE corner-radius scale (all-sharp / all-soft 12-16px / all-pill) and stick to it. Mixed only when documented and followed everywhere.

### 4.5 Interactive UI States
Always implement full cycles — not just the static success state.
* **Loading:** skeletal loaders matching final layout. Avoid generic spinners.
* **Empty / Error:** beautifully composed empty states; clear inline/contextual errors.
* **Tactile:** on `:active`, `-translate-y-[1px]` or `scale-[0.98]`.
* **BUTTON CONTRAST CHECK (a11y):** verify button text readable on button bg. WCAG AA 4.5:1 body, 3:1 large text 18px+.
* **CTA BUTTON WRAP BAN:** button text fits one line at desktop. 3 words max for primary CTAs (ideally 1-2).
* **NO DUPLICATE CTA INTENT:** two CTAs with the same intent ("Get in touch"+"Contact us"+"Let's talk") = Pre-Flight Fail. Pick ONE label.
* **FORM CONTRAST CHECK (a11y):** inputs, placeholders, focus rings, helper/error text all pass WCAG AA.

### 4.6 Data & Form Patterns
* Label ABOVE input. Helper text present in markup. Error text BELOW input. `gap-2` for input blocks. No placeholder-as-label, ever.

### 4.7 Layout Discipline (Hard Rules — failing any = shipping broken work)
* **Hero MUST fit initial viewport.** Headline ≤ 2 lines desktop, subtext ≤ 20 words AND ≤ 3-4 lines, CTAs visible without scroll.
* **Hero font-scale discipline.** Plan font + image size together. Default `text-4xl md:text-5xl lg:text-6xl`; `text-6xl md:text-7xl` only for 3-5 word headlines.
* **HERO TOP PADDING CAP:** max `pt-24` desktop.
* **HERO STACK DISCIPLINE (max 4 text elements):** eyebrow OR brand strip OR neither / headline (≤2 lines) / subtext (≤20 words, ≤4 lines) / CTAs (1 primary + max 1 secondary). BANNED in hero: tiny tagline below CTAs, trust micro-strip, pricing teaser, feature bullets, social-proof avatar row.
* **"Used by / Trusted by" logo wall belongs UNDER the hero, never inside it.**
* **Navigation on a single line desktop.** Height cap 80px (default 64-72px).
* **Bento grids MUST have rhythm.** EXACTLY as many cells as content (N items → N cells, no empty cells).
* **Section-Layout-Repetition Ban.** A layout family appears at most ONCE per page.
* **ZIGZAG ALTERNATION CAP.** Max 2 image+text split sections in a row; the 3rd consecutive = Fail.
* **EYEBROW RESTRAINT (#1 violated rule).** Max 1 eyebrow per 3 sections (Hero counts as 1). Mechanical check: count `uppercase tracking` instances; if > ceil(sectionCount/3), fails. Best move: drop the eyebrow, headline alone is enough.
* **SPLIT-HEADER BAN.** "left big headline + right small explainer paragraph" banned as default. Stack vertically, max-width 65ch.
* **Bento Background Diversity.** At least 2-3 cells need real visual variation (image, brand gradient (not AI-purple), pattern, tint).
* **Mobile collapse explicit per section.** Declare the `< 768px` fallback in the same component.

### 4.8 Image & Visual Asset Strategy
Landing pages and portfolios are **visual products**. Text-only pages with fake-screenshot divs are slop.
Priority: 1) **image-gen tool first** for section-specific assets; 2) **real web images** (`https://picsum.photos/seed/{seed}/{w}/{h}`, real stock/brand URLs, Unsplash/Pexels if allowed); 3) **last resort: tell the user**, leave labeled placeholder slots.
* **Even minimalist sites need real images** (≥ 2-3: hero, one product/lifestyle, one supporting).
* **Real company logos for social proof.** Source Simple Icons (`https://cdn.simpleicons.org/{slug}/ffffff`) or devicon. Invented brand → generate a simple SVG monogram. Render in both light/dark. Logo wall = logos only, no category labels.
* **Hand-rolled decorative SVGs strongly discouraged.** **Div-based fake screenshots BANNED.** Hero needs a real visual; text + gradient blob is not a hero.

### 4.9 Content Density
Cut ruthlessly. Default per section: short headline (≤8 words) + sub-paragraph (≤25 words) + one visual OR one CTA.
* **No data-dump sections.** Long lists (>5 items) need a different UI: 2-col split, card grid, tabs/accordion, scroll-snap pills, carousel, marquee. A 10-row spec sheet with a hairline under every row is the WORST default.
* **Spec sheets (Marrow pattern) banned.** Use 2-col card grid / scroll-snap pills / grouped chunks / featured-vs-rest disclosure.
* **COPY SELF-AUDIT (before ship):** re-read every visible string. Flag grammatically broken, unclear referents, AI-hallucination wordplay, fake-craftsman/mock-poetic labels. Rewrite to plain functional sentences.
* **Fake-precise numbers flagged.** `92% 4.1× 48k 5.8mm 13.4lb` only if real or labeled mock. Don't fake engineering precision.
* **One copy register per page.**

### 4.10 Quotes & Testimonials
* Max 3 lines of body. No em-dashes inside quote text. Attribution = name + role + (optionally) company; never name only. Real typographic quotes (" ") or none.

### 4.11 Page Theme Lock (Light / Dark consistency)
* The page has ONE theme. Sections do not invert. No light-warm-paper section between dark sections. Exception: deliberate "Color Block Story" / "Theme Switch on Scroll" once per page. Set theme ONCE at the page root.

---

## 5. CONTEXT-AWARE PROACTIVITY
Tools, not defaults. None fire automatically.
* **Glassmorphism:** premium consumer / Apple-adjacent / media-overlay. Add 1px inner border (`border-white/10`) + inner shadow. Solid fallback under `prefers-reduced-transparency`.
* **Magnetic Micro-physics:** `MOTION_INTENSITY > 5` AND premium/playful/agency. EXCLUSIVELY Motion's `useMotionValue` / `useTransform`. Never `useState`.
* **Perpetual Micro-Interactions:** `MOTION_INTENSITY > 5` AND section benefits. Spring physics (`type:"spring", stiffness:100, damping:20`), no linear easing.
* **"Motion claimed, motion shown."** If `MOTION_INTENSITY > 4`, the page must actually move.
* **MOTION MUST BE MOTIVATED.** Valid reasons: hierarchy, storytelling, feedback, state transition. Not "it looked cool".
* **MARQUEE MAX-ONE-PER-PAGE.**

### 5.A Sticky-Stack — Canonical Skeleton
```tsx
"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

export function StickyStack({ cards }: { cards: React.ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce || !ref.current) return;
    const ctx = gsap.context(() => {
      const cardEls = gsap.utils.toArray<HTMLElement>(".stack-card");
      cardEls.forEach((card, i) => {
        if (i === cardEls.length - 1) return;
        ScrollTrigger.create({
          trigger: card, start: "top top",
          endTrigger: cardEls[cardEls.length - 1], end: "top top",
          pin: true, pinSpacing: false,
        });
        gsap.to(card, {
          scale: 0.92, opacity: 0.55, ease: "none",
          scrollTrigger: { trigger: cardEls[i + 1], start: "top bottom", end: "top top", scrub: true },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, [reduce]);
  return (
    <div ref={ref} className="relative">
      {cards.map((card, i) => (
        <div key={i} className="stack-card sticky top-0 min-h-[100dvh] flex items-center justify-center">{card}</div>
      ))}
    </div>
  );
}
```
Critical: `start:"top top"`, `pin:true`, every card except last pinned, scale/opacity driven by NEXT card's trigger.

### 5.B Horizontal-Pan — Canonical Skeleton
```tsx
"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

export function HorizontalPan({ children }: { children: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce || !wrap.current || !track.current) return;
    const ctx = gsap.context(() => {
      const distance = track.current!.scrollWidth - window.innerWidth;
      gsap.to(track.current, {
        x: -distance, ease: "none",
        scrollTrigger: { trigger: wrap.current, start: "top top", end: () => `+=${distance}`, pin: true, scrub: 1, invalidateOnRefresh: true },
      });
    }, wrap);
    return () => ctx.revert();
  }, [reduce]);
  return (
    <section ref={wrap} className="relative overflow-hidden">
      <div ref={track} className="flex h-[100dvh] items-center">{children}</div>
    </section>
  );
}
```

### 5.C Scroll-Reveal Stagger (lighter alternative — prefer Motion `whileInView` over GSAP)
```tsx
"use client";
import { motion, useReducedMotion } from "motion/react";
export function RevealStagger({ items }: { items: string[] }) {
  const reduce = useReducedMotion();
  return (
    <ul className="grid gap-6">
      {items.map((item, i) => (
        <motion.li key={item}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}>
          {item}
        </motion.li>
      ))}
    </ul>
  );
}
```

### 5.D Forbidden Animation Patterns
* `window.addEventListener("scroll", ...)` BANNED. Use Motion `useScroll()`, GSAP ScrollTrigger, IntersectionObserver, or CSS scroll-driven animations.
* Custom scroll-progress via `window.scrollY` in React state — re-renders every frame.
* `requestAnimationFrame` loops touching React state — use motion values.
* Layout transitions: Motion `layout` / `layoutId`. Stagger: `staggerChildren` or CSS cascade.

---

## 6. PERFORMANCE & ACCESSIBILITY GUARDRAILS
* **6.A Hardware accel:** animate ONLY `transform` and `opacity`. Never `top/left/width/height`. `will-change` sparingly.
* **6.B Reduced Motion (mandatory):** anything `MOTION_INTENSITY > 3` MUST honor `prefers-reduced-motion`. Infinite loops, parallax, scroll-hijack, magnetic physics collapse to static.
* **6.C Dark Mode (mandatory for consumer-facing):** design both modes from start. Tailwind `dark:` OR CSS variables (one strategy). WCAG AA (AAA body). Respect `prefers-color-scheme`.
* **6.D Core Web Vitals:** LCP < 2.5s (hero image `next/image priority` / preload), INP < 200ms, CLS < 0.1. Run Lighthouse before done.
* **6.E DOM Cost:** grain/noise on fixed `pointer-events-none` pseudo-elements only, never on scrolling containers. Lazy-load below-the-fold heavy libs (Motion, Three.js).
* **6.F Z-Index Restraint:** no arbitrary `z-50`/`z-10` spam. Document a z-index scale.

---

## 7. DIAL DEFINITIONS (Technical Reference)
* **DESIGN_VARIANCE:** 1-3 symmetrical grid; 4-7 offsets/overlaps/varied ratios; 8-10 masonry/fractional/empty zones. Mobile override: 4-10 collapse to single column `< 768px`.
* **MOTION_INTENSITY:** 1-3 hover/active only; 4-7 fluid CSS transitions `cubic-bezier(0.16,1,0.3,1)`; 8-10 scroll-triggered/parallax via Motion hooks (never `addEventListener('scroll')`).
* **VISUAL_DENSITY:** 1-3 art-gallery `py-32`–`py-48`; 4-7 daily app `py-16`–`py-24`; 8-10 cockpit, tight, 1px lines, mandatory `font-mono` for numbers.

---

## 8. DARK MODE PROTOCOL
Dual-mode by default. Token strategy (pick one): Tailwind `dark:` variant, OR CSS variables (`--surface`, `--text-primary`, `--accent`) swapped under `[data-theme="dark"]`. Enforce contrast (WCAG AA min, AAA hero), hierarchy parity, brand fidelity. **No pure `#000` / `#fff`** — off-black (zinc-950) and off-white. Test in BOTH modes before finishing.

---

## 9. AI TELLS (Forbidden Patterns)

### 9.A Visual & CSS
NO neon/outer glows by default · NO pure black `#000000` · NO oversaturated accents · NO excessive gradient text · NO custom mouse cursors.

### 9.B Typography
AVOID Inter as default · NO oversized H1s that just scream (control with weight+color) · serif only editorial/luxury.

### 9.C Layout & Spacing
Mathematically perfect padding/margins · **NO 3-column equal feature cards** (use zig-zag, asymmetric, scroll-pinned, horizontal-scroll).

### 9.D Content & Data ("Jane Doe" Effect)
NO generic names (John Doe / Sarah Chan) → locale-appropriate realistic names · NO generic avatars · NO fake-perfect numbers (99.99% / 50%) → organic (47.2%) · NO startup-slop brand names (Acme/Nexus/SmartFlow) · NO filler verbs (Elevate/Seamless/Unleash/Next-Gen/Revolutionize).

### 9.E External Resources & Components
NO hand-rolled SVG icons · NO div-based fake screenshots · NO broken Unsplash links (use picsum seed) · shadcn never in default state (customize radii/colors/shadows/type).

### 9.F Production-Test Tells (banned outright)
* Hero: NO version labels (V0.6/BETA/INVITE-ONLY/EARLY ACCESS/ALPHA) unless a launch · NO "Brand · No. 01" sub-eyebrows.
* Section numbering: NO `00 / INDEX`, `001 · Capabilities` eyebrows · NO `01 / 4` pagination on images/tiles · NO `Scroll · 001` cues · NO "Index of Work, 2018-2026" range labels.
* Separators: middle-dot `·` rationed (max 1/line in metadata) · NO decorative colored status dots everywhere.
* Em-dashes: see 9.G · NO `<br>`-broken italic headlines as a move · NO vertical rotated text unless real Awwwards purpose · NO crosshair/hairline grid decoration.
* Fake previews: NO div-based fake product UI in hero (fake task list/terminal/dashboard) · NO fake version footers.
* Marketing copy: NO "Quietly in use at" / "Quietly trusted by" → use "Trusted by/Used at/Customers include" · NO "From the field / Field notes / On our desks" poetic labels → plain ("Testimonials/Latest writing/Now working on") · NO mock-humble industry references · NO weather/locale strips · NO micro-meta-sentences under eyebrows · NO generic step labels (Stage/Step 1·2·3).
* Pills/labels: NO pills overlaid on images · NO photo-credit captions as decoration · NO version footers on marketing pages · NO "Reservation 412 of 800" fake live counters.
* Decoration strips: NO `BRAND. MOTION. SPATIAL.` mono-caps strip at hero bottom · NO floating top-right sub-text in section headings.
* Lists/dividers: NO `border-t`+`border-b` on every row of a long list · NO scoring/progress bars with filled background tracks.
* Locale/time/scroll: locale/city/time/weather strips banned for 99% of briefs · scroll cues banned (`Scroll` / `↓ scroll`) · zero decorative status dots by default.

### 9.G EM-DASH BAN (the single most-violated Tell)
**Em-dash (`—`) is COMPLETELY banned. No "limited use".** Banned in headlines, eyebrows, labels, pills, button text, captions, nav, body, quotes, attribution. Restructure: period / comma / parentheses / colon / line break. En-dash `–` as separator also banned; date ranges use a hyphen. ONLY permitted dashes: regular hyphen `-` and math minus. A single visible `—` or `–` = Pre-Flight Fail. Non-negotiable.

---

## 10. REFERENCE VOCABULARY (pattern names to know)
* **Hero:** Asymmetric Split / Editorial Manifesto / Video-Media Mask / Kinetic-Type / Curtain-Reveal / Scroll-Pinned.
* **Nav:** Mac Dock Magnification / Magnetic Button / Gooey Menu / Dynamic Island / Radial Menu / Speed Dial / Mega Menu Reveal.
* **Layout:** Bento Grid / Masonry / Chroma Grid / Split-Screen Scroll / Sticky-Stack Sections.
* **Cards:** Parallax Tilt / Spotlight Border / Glassmorphism Panel / Holographic Foil / Tinder Swipe Stack / Morphing Modal.
* **Scroll:** Sticky Scroll Stack / Horizontal Scroll Hijack / Locomotive Sequence / Zoom Parallax / Scroll Progress Path / Liquid Swipe.
* **Galleries:** Dome Gallery / Coverflow / Drag-to-Pan Grid / Accordion Image Slider / Hover Image Trail / Glitch Image.
* **Type:** Kinetic Marquee / Text Mask Reveal / Text Scramble / Circular Text Path / Gradient Stroke / Kinetic Type Grid.
* **Micro:** Particle Explosion Button / Liquid Pull-to-Refresh / Skeleton Shimmer / Directional Hover Button / Ripple Click / SVG Line Drawing / Mesh Gradient BG / Lens Blur Depth.
* **Library choice:** Motion (`motion/react`) for UI/state motion · GSAP+ScrollTrigger for full-page scrolltelling · Three.js/WebGL for canvas/3D. **NEVER mix GSAP/Three.js with Motion in the same component tree.**

---

## 11. REDESIGN PROTOCOL
* **11.A Detect mode:** Greenfield / Redesign-Preserve / Redesign-Overhaul. If ambiguous ask once: "preserve the existing brand, or start visually from scratch?"
* **11.B Audit before touching:** brand tokens, IA, content blocks, patterns to preserve/retire, dial reading of existing site, SEO baseline (SEO migration is the #1 redesign risk).
* **11.C Preservation rules:** don't change IA unless asked; extract brand colors before 4.2 (purple brand stays purple); preserve copy voice; honor a11y wins; respect analytics events (don't rename buttons/fields/IDs).
* **11.D Modernisation levers (priority):** 1 typography refresh, 2 spacing/rhythm, 3 color recalibration, 4 motion layer, 5 hero/key-section recomposition, 6 full block replacement (last).
* **11.E Targeted evolution vs full redesign:** IA+content+SEO sound → targeted evolution (levers 1-4, ~70% value at ~40% risk). Structural visual debt → full redesign with content preservation. Brand changing → greenfield.
* **11.F Never change silently:** URL/slugs, primary nav labels, form field names/order, brand logo/wordmark, legal/consent/cookie copy.

---

## 12. THE BLOCK LIBRARY (schema)
Location `skills/taste-skill/blocks/<category>/<name>.md` (hero / feature / social-proof / pricing / cta / footer / navigation / portfolio / transition). Frontmatter: name, category, dial_compatibility (variance/motion/density ranges), when_to_use, not_for, stack. Body: visual sketch, props API, code sketch, mobile fallback, motion variants per band, dark-mode notes, anti-patterns, references. One block per file; each works standalone; each passes the Pre-Flight Check.

---

## 13. OUT OF SCOPE
NOT for: dashboards / dense product UI / admin (use Fluent/Carbon/Atlassian/Polaris) · data tables (TanStack/AG Grid) · multi-step wizards · code editors (Monaco/CodeMirror) · native mobile (Apple HIG / Material) · realtime collab. If the brief is one of these, say so, point to the right tool, apply only the marketing/landing parts.

---

## 14. FINAL PRE-FLIGHT CHECK (run every box; any fail = not done)
Brief inference declared · dial values reasoned · design system chosen or aesthetic labeled honestly · redesign mode detected · **ZERO em-dashes anywhere** · Page Theme Lock · Color Consistency Lock · Shape Consistency Lock · Button Contrast (AA 4.5:1) · CTA no 2-line wrap · Form Contrast · serif not Fraunces/Instrument_Serif · premium-consumer palette not beige+brass · italic descender clearance · hero fits viewport · hero `pt-24` max · hero ≤4 text elements · eyebrow count ≤ ceil(sections/3) · no split-header · zigzag ≤2 · no duplicate CTA intent · logo wall = logos only, under hero, real SVG · copy self-audit · motion motivated · marquee ≤1 · nav one line ≤80px · no section-layout repetition · bento exact cell count + rhythm · long lists use right component · real images · no pills on images · no photo-credit decoration · no version footers · no micro-meta-sentences · no hero-bottom decoration strip · no floating top-right sub-text · no filled-track progress bars · no locale/time/weather strips · no scroll cues · no hero version labels · no section-number eyebrows · no decorative dots · no `border-t`+`border-b` every row · sane content density · quotes ≤3 lines · motion claimed=shown · GSAP per 5.A/5.B · no `addEventListener('scroll')` · reduced motion for `>3` · dark mode tested both · mobile collapse explicit · `min-h-[100dvh]` not `h-screen` · useEffect cleanup · empty/loading/error states · cards omitted where possible · icons from allowed library · motion in client leaves · no Section 9 tells · Core Web Vitals plausibly hit · one design system per project.

---

## Appendix A — Install Commands per Design System
```bash
npm install @material/web                              # Material 3
npm install @fluentui/react-components                 # Fluent UI React v9
npm install @fluentui/web-components @fluentui/tokens   # Fluent framework-free
npm install @carbon/react @carbon/styles               # IBM Carbon
npm install @radix-ui/themes                            # Radix Themes
npx shadcn@latest init && npx shadcn@latest add button card badge separator input
npm install --save @primer/css                         # GitHub product UI
npm install @primer/react-brand                        # GitHub marketing UI
npm install govuk-frontend                             # GOV.UK
npm install uswds                                       # USWDS
yarn add @atlaskit/css-reset @atlaskit/tokens @atlaskit/button
npm install bootstrap                                   # Bootstrap 5.3
```

## Appendix B — Canonical Sources
Material https://material-web.dev/theming/material-theming/ · Fluent https://fluent2.microsoft.design/get-started/develop · Carbon https://carbondesignsystem.com/ · Polaris https://shopify.dev/docs/api/app-home/web-components · Atlassian https://atlassian.design/get-started/develop · Primer https://primer.style/ · GOV.UK https://design-system.service.gov.uk/ · USWDS https://designsystem.digital.gov/ · Tailwind https://tailwindcss.com/docs/dark-mode · Radix https://www.radix-ui.com/themes/docs · shadcn https://ui.shadcn.com/docs

## Appendix C — Apple Liquid Glass: Honest Web Approximation
There is **no official `liquid-glass.css`** from Apple for websites. A web version is glassmorphism/frosted-glass approximation. Label it as such.
```css
.liquid-glass-web-approx {
  position: relative; isolation: isolate; overflow: hidden; border-radius: 999px;
  border: 1px solid rgb(255 255 255 / .32);
  background: linear-gradient(135deg, rgb(255 255 255 / .30), rgb(255 255 255 / .08)), rgb(255 255 255 / .12);
  backdrop-filter: blur(24px) saturate(180%) contrast(1.05);
  -webkit-backdrop-filter: blur(24px) saturate(180%) contrast(1.05);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / .48), inset 0 -1px 0 rgb(255 255 255 / .12), 0 18px 60px rgb(0 0 0 / .18);
}
@media (prefers-reduced-transparency: reduce) {
  .liquid-glass-web-approx { background: rgb(255 255 255 / .96); backdrop-filter: none; -webkit-backdrop-filter: none; }
}
```

---
**End of skill document (原版).**
