# Design Spec — shawxiaodahua.github.io

- **Date:** 2026-09-27
- **Status:** Awaiting user review
- **Working directory:** `D:\Workspace\cv_githubi` (local staging only; not yet a git repo, not yet pushed)

## 1. Purpose

A personal site at `shawxiaodahua.github.io` that works as a job-hunting surface first and a
technical portfolio second. The primary audience is a recruiter or hiring manager screening for
**multimodal LLM / VLA / embodied intelligence** roles; the secondary audience is a fellow engineer
who wants the technical detail behind the headline metrics.

Source material: `C:\Users\18650\Desktop\简历\算法开发工程师_彭肖肖.pdf` (3 pages, Chinese).
Visual reference: `https://qihao-huang.github.io/`.

Success criteria: a recruiter can establish, in under 30 seconds without clicking anything, that this
candidate has shipped production multimodal systems with measured gains, and can reach the full
technical detail in one more click.

## 2. Constraints

| Constraint | Decision |
|---|---|
| Language | Site is **100% English**. All Chinese source material is translated. |
| Chinese résumé PDF | **Not published.** No `resume.pdf` on the site. `work.html` is the substitute. |
| Build tooling | **None.** No framework, no bundler, no package.json. Push-to-deploy. |
| Hosting | GitHub Pages. Requires a repo named `shawxiaodahua.github.io` (user site, not project site). |
| Dependencies | `marked.js` from CDN only, with a documented degrade path. |
| Photo | Not supplied. Monogram avatar; `pics/avatar.jpg` is the documented swap-in point. |
| Secrets | No credentials in any committed file. Contact details are intentional public data. |

## 3. Information Architecture

```
cv_githubi/
├── index.html            # Home: persistent left rail + scrolling right column
├── work.html             # Full technical detail, 5 projects
├── writing.html          # Article index + in-place Markdown reader
├── style.css             # Single style source: vars, layout, components, responsive
├── main.js               # Rail nav highlighting, Markdown renderer, WeChat copy
├── content/
│   ├── posts/            # Article .md files, fetched and rendered by marked.js
│   └── projects/         # Reserved: per-project .md (work.html reuses the same reader)
├── pics/
│   ├── avatar.*          # Monogram placeholder; swap in a real photo, keep the filename
│   └── logos/            # Ant / Smart / Dahua / HQU / Nanchang, monochrome SVG
├── favicon.ico
└── docs/superpowers/specs/   # This document
```

### 3.1 Page responsibilities

**`index.html` — the hiring surface.** Carries no long-form text, by explicit decision.
The left rail is `position: sticky` and holds: photo, name, one-line positioning,
contact links, and a "Full Technical Detail" link to `work.html`. There is deliberately no
résumé PDF link anywhere on the site — see §2. The right column scrolls through four blocks:

1. **Selected Work** — four cards, see §4.1
2. **Experience** — one line per role, four entries, see §4.2
3. **Honors** — three `<details>` disclosures, see §4.3
4. **Contact** — email, WeChat (click-to-copy), Zhihu, GitHub. Intentional duplication of the
   rail's contact links: the rail is persistent navigation, this block is the closing call to
   action at the end of the scroll.

**`work.html` — the depth layer.** Five full write-ups. The house template is
*Sensors · Platform · Approach · Challenges · Outcome*, applied per project as follows: the Ant
project has no sensors or deployment platform, so it uses *Problem · Approach · Outcome* instead;
the two Dahua projects document sensors and platforms but recorded no distinct challenges, so they
use *Setup · Approach · Outcome*. SmartMapNet and Parking_OneNet follow the full five-part template.
This is where Orin-N deployment, PTQ quantization, and the 95% parking success rate live.

**`writing.html` — long-form.** Article index; clicking an entry renders
`content/posts/*.md` in place. Same mechanism as the reference site.

### 3.2 Layout

Left rail + scrolling right column (chosen over the reference site's mutually-exclusive
tab panels). Rationale: the reference site hides its strongest content behind tabs that a
recruiter will never click; a single scrolling column cannot be skimmed past.

## 4. Content Mapping

All translations below are authored, not machine output. Chinese source phrasing is preserved
in technical meaning; idiomatic Chinese marketing phrasing is dropped.

### 4.1 Selected Work (4 cards on `index.html`)

| # | Title | Employer | Headline metrics |
|---|---|---|---|
| 1 | Rubric Data Pipeline & AI-Assisted Annotation | Ant Group | annotation accuracy +40%, throughput +50%, data acceptance accuracy +50%, SFT +2.24 pt, RL +5.63 pt, online thumbs-up/down ratio +6.5% → +13%, shipped to full rollout |
| 2 | SmartMapNet — Online Vectorized HD Map | Smart Auto | 7V + LiDAR, Orin-X, PTQ, shipped on AVP / LP |
| 3 | Parking_OneNet — IPM Parking Perception | Smart Auto | 4× fisheye, Orin-N, >95% parking success in open scenes (APA / RPA / RSPA) |
| 4 | VLA-Handbook | Independent | Open-source; not in the résumé, included deliberately as evidence of current self-initiated work |

Card anatomy: one line of framing, one line of substance, 2–3 metric chips.

VLA-Handbook gets an index card only — its link points at the project repository, not at a
placeholder. The repository is `https://github.com/shawxiaodahua/VLA-Handbook`, a Chinese-language
practical handbook for engineers entering the VLA field. Verified live (HTTP 200, real repository
content, not a 404 page). Note the résumé lists `https://shawxiaodahua.github.io/` as 个人主页; that is
the personal homepage this site *is*, so it is not the handbook link. There is no `work.html`
write-up: it is not one of the five employment projects in §4.4, and no
`content/projects/vla-handbook.md` is created.

### 4.2 Experience

| Period | Organization | Role line |
|---|---|---|
| 2025.07 – 2026.01 | Ant Group (Alipay, Hangzhou) | Medical-data AI: LLM-assisted annotation, three-tier QC pipeline, Rubric data paradigm |
| 2022.09 – 2025.07 | Smart Auto | Parking perception and online vectorized mapping, L2+ production programs |
| 2021.06 – 2022.09 | Dahua Technology | Edge vision: smart parking, airport event detection, video poles |
| 2020.04 – 2020.06 | CASIA Shenzhen (intern) | Crowd counting, model pruning and quantization |

### 4.3 Honors

**Competitions** — six featured: Intel AI Innovation Application Challenge top-2 (2024.12);
Wuxi International AI Contest, illegal-parking detection, 4th (2023.11, team lead);
Yangtze Delta (Wuhu) Algorithm Contest, multi-camera sign detection, runner-up (2023.11, team lead);
ECV2022 crowd counting, 1st place, HP-sponsored diamond track (2022.07) — résumé credits this one
as a team **member**, not lead, so no role is claimed;
iFLYTEK 1024 Developer Contest, citrus disease detection, 1st (2021.10, team lead);
Huawei Cloud Cup, waste classification, 2nd (2020.07, team lead).
The résumé lists 16 competition entries in total, so ten remain after the six featured above. The page
deliberately does **not** assert that total: it reads "6 featured" in the summary and "Further
placements include IEEE BigData 2022 (1st), TIANCHI IEEE UV 2022 (3rd)" in the body. An earlier draft
said "9 further placements", which did not reconcile with the résumé; naming two examples is more
honest than publishing a count that is hard to defend.

**Publications** — 4, reverse chronological:
1. HSGM: A Hierarchical Similarity Graph Module for Object Re-Identification — ICME 2022, **oral**, CCF-B
2. PON: Proposal Optimization Network for Temporal Action Proposal Generation — ICIC 2020, oral, EI
3. Periodic Action Temporal Localization Based on Two-Path Architecture for Product Counting in Sewing Video — ICIC 2019, oral, EI
4. Model Fusion Solution for IEEE UV 2022 "Vision Meets Algae" Object Detection Challenge — IEEE UV 2022 workshop, EI

**Patents** — 13 filed: 4 granted, 9 under examination. The 4 granted get translated titles:
- A video temporal action detection method, apparatus, device and storage medium
- A license-plate recognition method, apparatus, terminal and computer-readable storage medium
- A lip-reading recognition method, apparatus and device
- A vehicle detection method, apparatus and computer storage device

The résumé supplies patent **titles and grant status only, never patent numbers**, so the titles are
rendered as plain text with no link. Any CN number used for an `href` would have to be looked up
against Google Patents by title before shipping, because an unverified number is worse than no
link — it resolves to the wrong document without looking broken. The original placeholders were
checked and all four pointed at unrelated patents filed by other companies, so they were removed
rather than corrected. See plan Task 4.

### 4.4 `work.html` project set (5)

1. Rubric Data Paradigm & LLM-Assisted Annotation — Ant Group
2. SmartMapNet: Online Vectorized HD Map Perception — Smart Auto
3. Parking_OneNet: IPM Parking Static Obstacle / Sign Detection — Smart Auto
4. Smart Parking Lot & Edge Deployment — Dahua
5. Airport Turnaround Node Event Detection — Dahua

### 4.5 Technical glossary (fixed English renderings)

| Chinese | English |
|---|---|
| 环视鸟瞰图 / IPM 逆透视变换 | surround-view bird's-eye view / inverse perspective mapping (IPM) |
| 轮挡 / 地锁 | wheel stop / ground lock |
| 墙柱接地点 | wall-and-column ground contact point |
| 在线矢量化高精地图 | online vectorized high-definition map |
| 静态低矮障碍物 | low-lying static obstacle |
| 差异化多尺度特征融合 | differential multi-scale feature fusion |
| 卡尔曼滤波 | Kalman filtering |
| 三级医疗数据智能质检 | three-tier medical-data quality inspection |
| 人机协同数据生产 | human-in-the-loop data production |
| 赞踩比 | thumbs-up / thumbs-down ratio |
| 数据闭环 | data closed loop |
| 剪枝、量化 | pruning, quantization |

## 5. Visual Direction

**Reference Blue** (approved). Blue-violet gradient page background, white rounded content cards
with soft shadows, `#2563eb` primary / `#3b82f6` secondary / `#60a5fa` accent accent scale,
`#1e293b` body text, `#64748b` secondary text. System font stack. Card radius 20px on desktop,
15px below 480px.

Rationale: keeps the reference site's proven visual language while the left-rail layout removes
its tab-navigation weakness. Prints acceptably, and blue-on-white is the lowest-risk read for a
recruiter scanning many candidates. Rejected: Ink & Slate (dark themes print badly, read less
hireable) and Warm Paper (serif + warm palette risks reading soft for a robotics/ML engineer).

Logo bar in the page footer: Ant Group, Smart Auto, Dahua, Huaqiao University, Nanchang
University of Aeronautics and Astronautics — monochrome SVG, `filter: brightness(0) invert(1)`.

## 6. Runtime Behaviour

There is no data layer, no build, and no client state beyond the active-section marker.
The only runtime I/O is `writing.html` fetching `content/posts/*.md` and passing the text to
`marked.parse()`.

`main.js` responsibilities, each a single function:
`initBrandMark()` · `initRailNav()` · `initSectionSpy()` · `initWeChatCopy()` · `initMarkdownReader()`

### 6.1 Edge cases

| Case | Required behaviour |
|---|---|
| Page opened over `file://` | Detected explicitly in `initMarkdownReader()`. Show "run `python3 -m http.server` to preview" instead of a CORS error. |
| marked.js CDN blocked (likely on CN networks) | `typeof marked === 'undefined'` → render `<pre>` with the raw Markdown, plus a link to view the file on GitHub. |
| A `.md` returns HTTP 404 | Distinct message: "this post has not been pushed to GitHub yet." The reference site conflates this with generic failure; we do not. |
| Viewport below 900px | Rail collapses to a top bar; section nav becomes a horizontal scroll strip. |
| Viewport below 480px | Single column, card radius 15px, hero type scale drops. |
| Photo absent | Monogram avatar renders from CSS; `pics/avatar.jpg` is the documented swap-in point. |

## 7. Out of Scope

Explicitly excluded from this spec:

- Publishing the Chinese résumé PDF, or any translated PDF
- Analytics / tracking (the reference site carries an obsolete UA- tag; we ship none)
- A build pipeline, CI, or any npm dependency
- A CMS, comments, or search
- Dark-mode toggle (Reference Blue is light-only)
- Deploying or pushing to GitHub — this spec covers local staging only

## 8. Verification

Run before the work is called done. Each item must produce observed output, not assertion.

| # | Check | Pass condition |
|---|---|---|
| 1 | `python3 -m http.server` in `cv_githubi/`, request `/`, `/work.html`, `/writing.html` | HTTP 200 for all three |
| 2 | Browser console on all three pages | Zero errors, zero 404s |
| 3 | `writing.html` → open a real post | Markdown renders as HTML, not as the `<pre>` fallback |
| 4 | Rename a `.md` to force a 404 | The specific "not pushed yet" message appears |
| 5 | Block the marked.js CDN | `<pre>` fallback renders, page still usable |
| 6 | Viewports 375 / 768 / 1440 px | No horizontal overflow; rail collapses below 900px |
| 7 | Outbound links: Zhihu, GitHub, `mailto:` | All resolve; no `href="#"` or empty hrefs. No patent links — the granted patents are plain text by design. |
| 8 | `grep -rP '[\x{4e00}-\x{9fff}]' index.html work.html writing.html style.css main.js content/` | No matches. `docs/` is excluded — the §4.5 glossary holds the Chinese source terms by design. |
| 10 | Keyboard-only pass on `/` | First Tab reveals the skip link; it jumps to `#main`. Activating a rail item scrolls, moves the URL hash, and marks exactly one `aria-current`. |
| 11 | Screen-reader pass on the WeChat copy button | Accessible name stays "WeChat"; the "Copied" / "Copy failed" state is announced via a live region, not only a visual label swap. |
| 12 | `node tools/check-site.mjs` copy-button contract | Every `[data-copy-text]` button has a `data-copy-status` live region with `aria-live`, plus an `aria-describedby` hint. `#reader-status` carries `aria-live`. Enforced in CI, not by eye. |
| 9 | Print preview of `index.html` | Content legible, no clipped cards |

## 9. Open Risks

- **CDN dependency in CN networks.** mitigated by the §6.1 fallback, but it is a real failure mode
  for the exact audience. Revisit if complaints appear; self-hosting marked.js is the fix.
- **English translation quality.** Technical terms are settled by the §4.5 glossary, but the résumé
  is dense; a fluent-native pass over `work.html` before applying to real roles is worth it.
- **Patent numbers.** The résumé never supplied any, and the placeholders that stood in for them all
  resolved to other companies' patents, so the section ships as plain titles. A reviewer who wants
  clickable patent evidence needs real numbers from the candidate.
