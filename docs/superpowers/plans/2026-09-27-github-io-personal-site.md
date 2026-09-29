# shawxiaodahua.github.io Implementation Plan

> **For AI agents working on this plan:** Required sub-skill: use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax to track progress.

**Goal:** Build a three-page static personal site at `D:\Workspace\cv_githubi` — a sticky-left-rail hiring surface, a five-project deep-dive page, and a Markdown-backed writing page — with an automated structural check that runs on every change.

**Architecture:** No framework, no build step, no package.json. Three hand-written HTML pages share one `style.css` and one `main.js`. `writing.html` is the only page with runtime I/O: it fetches `content/posts/*.md` and hands the text to `marked.js` from CDN, degrading to a `<pre>` fallback if the CDN is blocked. Design tokens live in one `:root` block in `style.css` and nowhere else.

**Tech stack:** HTML5, CSS custom properties, vanilla ES5-compatible JavaScript, `marked@12.0.2` (CDN, pinned), Node 22 built-in test runner for the checker, Python 3 `http.server` for local preview.

**Spec:** `docs/superpowers/specs/2026-09-27-github-io-personal-site-design.md`

**Standing rules for every task in this plan:**
- The site ships **100% English**. No Chinese characters in any file listed in §3 of the spec. `docs/` is exempt.
- No Chinese résumé PDF is published anywhere.
- Every task ends with a commit. Conventional Commits, lowercase after the type.
- Never introduce a runtime dependency other than the pinned `marked@12.0.2` CDN tag.
- `pics/logos/*.svg` files are created in Task 1 and referenced but not restyled per-page.

---

## File Structure

| File | Responsibility | Task |
|---|---|---|
| `pics/logos/ant.svg` | Ant Group logotype, monochrome, `#2b6cb0` | 1 |
| `pics/logos/smart.svg` | Smart Auto logotype, monochrome, `#2b6cb0` | 1 |
| `pics/logos/dahua.svg` | Dahua Technology logotype, monochrome, `#2b6cb0` | 1 |
| `pics/logos/hqu.svg` | Huaqiao University logotype, monochrome, `#2b6cb0` | 1 |
| `pics/logos/ncau.svg` | Nanchang University of Aeronautics and Astronautics logotype, monochrome, `#2b6cb0` | 1 |
| `tools/check-site.mjs` | Structural validator: HTTP reachability, anchors, links, placeholders, CJK leakage, token discipline | 2 |
| `test/check-site.test.mjs` | Test suite for the validator, 11 cases | 2 |
| `style.css` | The only style source: design tokens, rail layout, components, footer, responsive rules | 3 |
| `main.js` | Four init functions: `initBrandMark`, `initRailNav`, `initSectionSpy`, `initMarkdownReader` | 3 |
| `index.html` | Hiring surface: rail + four scrolling blocks | 4 |
| `work.html` | Five full project write-ups | 5, 6 |
| `writing.html` | Article index + in-place Markdown reader | 7 |
| `content/posts/perception-is-the-interface.md` | Article 1 | 7 |
| `content/posts/why-rubrics-as-rl-reward.md` | Article 2 | 7 |
| `content/posts/vla-control-stack-notes.md` | Article 3 | 7 |
| `content/projects/smartmapnet.md` | Reserved for a future per-project Markdown write-up. Not referenced by any page in this plan. | 8 |

**Content constants used by more than one file.** These exact strings appear in both `index.html` and `work.html`. Change them in both places or neither.

- Project 1 title: `Rubric Data Pipeline & AI-Assisted Annotation`
- Project 2 title: `SmartMapNet`
- Project 3 title: `Parking_OneNet`
- Project 4 title: `VLA-Handbook`
- Page title suffix: `XiaoXiao Peng`
- Positioning line: `Multimodal LLM · VLA · Embodied AI`
- Rail contact labels: `Email`, `WeChat`, `Zhihu`, `GitHub`

---

## Task 1: Logo Assets

**Files:**
- Create: `pics/logos/ant.svg`
- Create: `pics/logos/smart.svg`
- Create: `pics/logos/dahua.svg`
- Create: `pics/logos/hqu.svg`
- Create: `pics/logos/ncau.svg`

Monochrome logotypes as inline-SVG text. They are placeholders standing in for official brand artwork — simple, legible, and honest about being placeholders rather than fake renditions of trademarked logos.

- [ ] **Step 1: Create `pics/logos/ant.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="24" viewBox="0 0 120 24" role="img" aria-label="Ant Group">
  <text x="0" y="17" font-family="Helvetica, Arial, sans-serif" font-size="15" font-weight="600" fill="#2b6cb0">Ant Group</text>
</svg>
```

- [ ] **Step 2: Create `pics/logos/smart.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="24" viewBox="0 0 120 24" role="img" aria-label="Smart Auto">
  <text x="0" y="17" font-family="Helvetica, Arial, sans-serif" font-size="15" font-weight="600" fill="#2b6cb0">Smart Auto</text>
</svg>
```

- [ ] **Step 3: Create `pics/logos/dahua.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="24" viewBox="0 0 120 24" role="img" aria-label="Dahua Technology">
  <text x="0" y="17" font-family="Helvetica, Arial, sans-serif" font-size="15" font-weight="600" fill="#2b6cb0">Dahua</text>
</svg>
```

- [ ] **Step 4: Create `pics/logos/hqu.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="24" viewBox="0 0 120 24" role="img" aria-label="Huaqiao University">
  <text x="0" y="17" font-family="Georgia, 'Times New Roman', serif" font-size="15" font-weight="700" letter-spacing="1" fill="#2b6cb0">Huaqiao</text>
</svg>
```

- [ ] **Step 5: Create `pics/logos/ncau.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="24" viewBox="0 0 120 24" role="img" aria-label="Nanchang University of Aeronautics and Astronautics">
  <text x="0" y="17" font-family="Georgia, 'Times New Roman', serif" font-size="15" font-weight="700" letter-spacing="1" fill="#2b6cb0">Nanchang</text>
</svg>
```

- [ ] **Step 6: Confirm all five files are well-formed XML**

Run:

```bash
cd /mnt/d/Workspace/cv_githubi && for f in pics/logos/*.svg; do python3 -c "import xml.dom.minidom,sys; xml.dom.minidom.parse(sys.argv[1]); print('OK', sys.argv[1])" "$f"; done
```

Expected: five lines, each `OK pics/logos/<name>.svg`. Any `ParseError` means fix the malformed file before continuing.

- [ ] **Step 7: Commit**

```bash
git add pics/logos
git commit -m "feat: add monochrome logo placeholders for footer bar"
```

---

## Task 2: Structural Checker

The validator is the test harness for a site with no runtime to unit-test. It is the only piece of code in this project with a real test suite, so the suite comes first.

**Files:**
- Create: `tools/check-site.mjs`
- Create: `test/check-site.test.mjs`

- [ ] **Step 1: Write the failing tests**

Create `test/check-site.test.mjs`:

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, mkdtempSync, mkdirSync, writeFileSync, copyFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function fixture(files) {
  const dir = mkdtempSync(join(tmpdir(), 'check-site-'));
  mkdirSync(join(dir, 'tools'), { recursive: true });
  copyFileSync(join(ROOT, 'tools/check-site.mjs'), join(dir, 'tools/check-site.mjs'));
  for (const [name, body] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, name)), { recursive: true });
    writeFileSync(join(dir, name), body);
  }
  return dir;
}

function checkerIn(dir) {
  return import(pathToFileURL(join(dir, 'tools/check-site.mjs')).href);
}

const CASES = [
  {
    name: 'accepts a page whose in-page anchors all resolve',
    html: '<a href="#work">Work</a><h2 id="work">Work</h2>',
    expect: []
  },
  {
    name: 'rejects an in-page anchor with no matching id',
    html: '<a href="#work">Work</a><h2 id="about">About</h2>',
    expect: ['broken-anchor: #work has no matching id']
  },
  {
    name: 'rejects a cross-page anchor whose target page does not exist',
    html: '<a href="missing.html#ant-rubric">Ant</a>',
    expect: ['broken-anchor: missing.html#ant-rubric cannot be read']
  },
  {
    name: 'rejects an empty href',
    html: '<a href="">Home</a>',
    expect: ['empty-href: <a href="">Home</a>']
  },
  {
    name: 'rejects a placeholder-only href',
    html: '<a href="#">Home</a>',
    expect: ['empty-href: <a href="#">Home</a>']
  },
  {
    name: 'rejects a CJK character',
    html: '<p>多模态大模型</p>',
    expect: ['cjk-leak: <p>多模态大模型</p>']
  },
  {
    name: 'accepts an empty hrefList',
    html: '<p>Nothing to check</p>',
    expect: []
  },
  {
    name: 'reports both problems when both are present',
    html: '<a href="#nope">x</a><p>中文</p>',
    expect: ['broken-anchor: #nope has no matching id', 'cjk-leak: <a href="#nope">x</a><p>中文</p>']
  },
  {
    name: 'rejects a CJK character inside a multi-line element',
    html: '<p>\n  多模态大模型\n</p>',
    expect: ['cjk-leak: <p>\n  多模态大模型\n</p>']
  }
];

test('checkPage', async (t) => {
  const { checkPage } = await import('../tools/check-site.mjs');
  for (const c of CASES) {
    await t.test(c.name, () => {
      assert.deepEqual(checkPage(c.html, new Set(), ''), c.expect);
    });
  }
});

const CJK_CASES = [
  {
    name: 'flags CJK in markdown prose that has no tags at all',
    html: '# SmartMapNet\n\n## Overview\n\n本项目使用多模态大模型，是当前的主流方向。\n',
    expect: ['cjk-leak: 本项目使用多模态大模型，是当前的主流方向。']
  },
  {
    name: 'flags CJK inside a single-line element',
    html: '<p>多模态大模型</p>',
    expect: ['cjk-leak: <p>多模态大模型</p>']
  },
  {
    name: 'flags CJK inside a multi-line element',
    html: '<p>\n  多模态大模型\n</p>',
    expect: ['cjk-leak: <p>\n  多模态大模型\n</p>']
  },
  {
    name: 'stays silent on a clean English page',
    html: '<!doctype html>\n<html>\n<body>\n  <p>All English here.</p>\n</body>\n</html>\n',
    expect: []
  },
  {
    name: 'flags CJK sitting next to a void element',
    html: '<p>Hello<br>你好世界</p>',
    expect: ['cjk-leak: <p>Hello<br>你好世界</p>']
  },
  {
    name: 'flags CJK that has no closing tag anywhere after it',
    html: '<p>Done</p>\n中文说明',
    expect: ['cjk-leak: 中文说明']
  },
  {
    name: 'flags CJK in a markdown table row',
    html: '# Table\n\n| 项目 | 说明 |\n| --- | --- |\n',
    expect: ['cjk-leak: | 项目 | 说明 |']
  }
];

test('every CJK shape yields at least one cjk-leak', async (t) => {
  const { checkPage } = await import('../tools/check-site.mjs');
  for (const c of CJK_CASES) {
    await t.test(c.name, () => {
      assert.deepEqual(checkPage(c.html, new Set(), 'probe.md'), c.expect);
    });
  }
});

test('cross-page anchors resolve against a real target page', async (t) => {
  const dir = fixture({ 'work.html': '<section class="section" id="ant-rubric"></section>\n' });
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const { checkPage } = await checkerIn(dir);
  await t.test('accepts an anchor the target page does define', () => {
    assert.deepEqual(checkPage('<a href="work.html#ant-rubric">Ant</a>', new Set(), 'index.html'), []);
  });
  await t.test('rejects an anchor the target page does not define', () => {
    assert.deepEqual(
      checkPage('<a href="work.html#smartmapnet">Ant</a>', new Set(), 'index.html'),
      ['broken-anchor: work.html#smartmapnet has no matching id in work.html']
    );
  });
});

test('an existing non-page asset is not reported as unreadable', async (t) => {
  const dir = fixture({ 'pics/logos/ant.svg': '<svg id="logo"></svg>\n' });
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const { checkPage } = await checkerIn(dir);
  assert.deepEqual(
    checkPage('<a href="pics/logos/ant.svg#x">Logo</a>', new Set(), 'index.html'),
    ['broken-anchor: pics/logos/ant.svg#x is not an internal page']
  );
});

const CSS_CASES = [
  {
    name: 'accepts a stylesheet whose only hexes are :root tokens',
    css: ':root {\n  --bg: #0b0d10;\n  --fg: #f2f4f7;\n}\nbody { background: var(--bg); color: var(--fg); }\n',
    expect: []
  },
  {
    name: 'rejects a hex outside the :root block',
    css: ':root {\n  --bg: #0b0d10;\n}\na { color: #333; }\n',
    expect: ['stray-hex: #333 is not a :root token']
  },
  {
    name: 'rejects a stylesheet with no :root block',
    css: 'body { color: #222; }\n',
    expect: ['no :root token block found']
  },
  {
    name: 'reports an id selector as a colour (known false positive)',
    css: ':root {\n  --bg: #0b0d10;\n}\n#face { color: var(--bg); }\n',
    expect: ['stray-hex: #face is not a :root token']
  }
];

test('checkTokenDiscipline on the real stylesheet', async (t) => {
  const { checkTokenDiscipline } = await import('../tools/check-site.mjs');
  const path = join(ROOT, 'style.css');
  assert.ok(existsSync(path), 'style.css must exist before token discipline can be checked');
  assert.deepEqual(checkTokenDiscipline(readFileSync(path, 'utf8')), []);
});

test('checkTokenDiscipline', async (t) => {
  const { checkTokenDiscipline } = await import('../tools/check-site.mjs');
  for (const c of CSS_CASES) {
    await t.test(c.name, () => {
      assert.deepEqual(checkTokenDiscipline(c.css), c.expect);
    });
  }
});

test('checkPlaceholders on finished pages', async (t) => {
  const dir = fixture({
    'index.html': '<!doctype html>\n<title>Home</title>\n',
    'content/writing/first.md': '# First\n\nAll English.\n'
  });
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const { checkPlaceholders } = await checkerIn(dir);
  assert.deepEqual(checkPlaceholders(dir), []);
});

test('checkPlaceholders flags a page that still holds a module import', async (t) => {
  const dir = fixture({
    'index.html': '<!doctype html>\nimport styles from "./style.css";\n',
    'content/writing/first.md': '# First\n\nexport const title = "First";\n'
  });
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const { checkPlaceholders } = await checkerIn(dir);
  assert.deepEqual(checkPlaceholders(dir), [
    'not-pure-html: index.html looks like a template, not a finished page',
    'not-pure-html: content/writing/first.md looks like a template, not a finished page'
  ]);
});

const CONTRACT_CASES = [
  {
    name: 'accepts a writing page that satisfies every reader hook',
    file: 'writing.html',
    html: [
      '<section id="writing">',
      '  <div id="post-list">',
      '    <a class="post-link" href="content/writing/a.md" data-md="content/writing/a.md">A</a>',
      '  </div>',
      '  <div id="post-reader">',
      '    <button class="reader-back">Back</button>',
      '    <div id="reader-body" aria-live="polite"></div>',
      '  </div>',
      '</section>',
      '<span data-brand-mark="XiaoXiao Peng"></span>',
      '<span id="wechat-hint">Copies the WeChat ID.</span>',
      '<button data-copy-text="pengxiao" aria-describedby="wechat-hint"><span class="label">WeChat</span><span data-copy-status aria-live="polite"></span></button>',
      '<div id="reader-status" aria-live="polite"></div>'
    ].join('\n'),
    expect: []
  },
  {
    name: 'rejects a copy button with no live region',
    file: 'index.html',
    html: '<span id="wechat-hint">x</span><button data-copy-text="18650113070" aria-describedby="wechat-hint"><span class="label">WeChat</span></button>',
    expect: ['missing-hook: index.html has a copy button with no data-copy-status live region']
  },
  {
    name: 'rejects a copy live region with no aria-live',
    file: 'index.html',
    html: '<span id="wechat-hint">x</span><button data-copy-text="18650113070" aria-describedby="wechat-hint"><span data-copy-status></span></button>',
    expect: ['missing-hook: index.html has a copy button whose live region has no aria-live']
  },
  {
    name: 'rejects a copy button with no aria-describedby hint',
    file: 'index.html',
    html: '<button data-copy-text="18650113070"><span data-copy-status aria-live="polite"></span></button>',
    expect: ['missing-hook: index.html has a copy button with no aria-describedby hint']
  },
  {
    name: 'rejects a #reader-status that cannot announce',
    file: 'index.html',
    html: '<div id="reader-status"></div>',
    expect: ['missing-hook: index.html #reader-status needs an aria-live region']
  },
  {
    name: 'accepts a #reader-status that is a live region',
    file: 'index.html',
    html: '<div id="reader-status" aria-live="polite"></div>',
    expect: []
  },
  {
    name: 'rejects a writing page with no #post-list',
    file: 'writing.html',
    html: '<section id="writing"><div id="post-reader"><button class="reader-back"></button><div id="reader-body"></div></div></section>',
    expect: ['missing-hook: writing.html needs #post-list for the markdown reader']
  },
  {
    name: 'rejects a writing page with no #writing',
    file: 'writing.html',
    html: '<section id="notes"><div id="post-list"></div><div id="post-reader"><button class="reader-back"></button><div id="reader-body"></div></div></section>',
    expect: ['missing-hook: writing.html needs #writing for the markdown reader']
  },
  {
    name: 'rejects a .post-link whose data-md is empty',
    file: 'index.html',
    html: '<a class="post-link" href="a.md" data-md="">A</a>',
    expect: ['missing-hook: index.html has a .post-link with no non-empty data-md']
  },
  {
    name: 'rejects a one-word data-brand-mark',
    file: 'index.html',
    html: '<span data-brand-mark="XP"></span>',
    expect: ['missing-hook: index.html has data-brand-mark="XP" with fewer than two words']
  },
  {
    name: 'accepts a two-word data-brand-mark',
    file: 'index.html',
    html: '<span data-brand-mark="XiaoXiao Peng"></span>',
    expect: []
  },
  {
    name: 'rejects an empty data-copy-text',
    file: 'index.html',
    html: '<span id="wechat-hint">x</span><button data-copy-text="" aria-describedby="wechat-hint"><span data-copy-status aria-live="polite"></span></button>',
    expect: ['missing-hook: index.html has an empty data-copy-text']
  },
  {
    name: 'accepts a plain page that carries none of the reader hooks',
    file: 'index.html',
    html: '<main><h1>XiaoXiao Peng</h1><p>Ant Rubric, SMART MAP, FlexMoE.</p></main>',
    expect: []
  }
];

test('checkDomContract', async (t) => {
  const { checkDomContract } = await import('../tools/check-site.mjs');
  for (const c of CONTRACT_CASES) {
    await t.test(c.name, () => {
      assert.deepEqual(checkDomContract(c.html, c.file), c.expect);
    });
  }
});

test('reachablePages are all present in the repo', async (t) => {
  const { reachablePages } = await import('../tools/check-site.mjs');
  for (const p of reachablePages()) {
    await t.test(p, () => {
      const path = join(ROOT, p);
      assert.ok(existsSync(path), `${p} does not exist yet`);
      assert.ok(readFileSync(path, 'utf8').length > 0, `${p} is empty`);
    });
  }
});
```

The two `existsSync` guards matter: without them these tests crash with an opaque `ENOENT`
before Tasks 3, 4, 5, and 7 create those files. With the guards they fail with a sentence naming
the missing file, which is the difference between a diagnosable and an opaque failure.

- [ ] **Step 2: Run the tests and confirm they fail**

Run:

```bash
cd /mnt/d/Workspace/cv_githubi && node --test "test/*.test.mjs" 2>&1 | tail -20
```

Expected: FAIL with `Cannot find module '../tools/check-site.mjs'`. The two `checkTokenDiscipline` and `reachablePages` tests additionally fail because `style.css` and `index.html` do not exist yet — that is expected at this stage and resolves in Task 3.

> **Use the glob form `node --test "test/*.test.mjs"`, never `node --test test/`.** On this
> machine (Node v22.22.1) a bare directory argument is resolved as a module path, not a directory
> to scan, and the run dies with `Cannot find module '.../test'` and reports `pass 0, fail 1`.
> That failure mode is indistinguishable from a genuinely broken test suite, so the glob form is
> used throughout this plan. Bare `node --test` also works but scans the whole tree.

- [ ] **Step 3: Implement the validator**

Create `tools/check-site.mjs`:

```javascript
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CJK = /[\u4e00-\u9fff]/;
const ELEMENT = /<[^>]*>[\s\S]*<\/[^>]+>/g;

const INTERNAL = new Set(['index.html', 'work.html', 'writing.html']);

export function reachablePages() {
  return [
    'index.html',
    'work.html',
    'writing.html',
    ...listFiles('content').filter((f) => f.endsWith('.md')),
    ...listFiles('pics')
  ];
}

export function checkPage(html, knownIds, fromPage) {
  const errors = [];
  const ids = new Set([
    ...(knownIds || []),
    ...[...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1])
  ]);

  for (const m of html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)) {
    const tag = m[0];
    const href = (tag.match(/href="([^"]*)"/) || [])[1];
    if (href === undefined) continue;
    if (href === '' || href === '#') {
      errors.push(`empty-href: ${tag}`);
      continue;
    }
    if (href.startsWith('#')) {
      if (!ids.has(href.slice(1))) {
        errors.push(`broken-anchor: ${href} has no matching id`);
      }
      continue;
    }
    if (/^(https?:|mailto:|tel:)/i.test(href)) continue;
    const [file, hash] = href.split('#');
    if (hash) {
      if (!existsSync(join(ROOT, file))) {
        errors.push(`broken-anchor: ${file}#${hash} cannot be read`);
        continue;
      }
      if (!INTERNAL.has(file)) {
        errors.push(`broken-anchor: ${file}#${hash} is not an internal page`);
        continue;
      }
      const target = readFileSync(join(ROOT, file), 'utf8');
      const targetIds = new Set([...target.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
      if (!targetIds.has(hash)) {
        errors.push(`broken-anchor: ${file}#${hash} has no matching id in ${file}`);
      }
      continue;
    }
    if (!existsSync(join(ROOT, file))) {
      errors.push(`broken-link: ${fromPage} -> ${file} does not exist`);
    }
  }

  for (const m of html.matchAll(ELEMENT)) {
    if (CJK.test(m[0])) errors.push(`cjk-leak: ${m[0]}`);
  }
  const residue = html.replace(ELEMENT, (s) => ' '.repeat(s.length));
  const rest = residue.match(/[^\n]*[\u4e00-\u9fff][^\n]*/);
  if (rest) errors.push(`cjk-leak: ${rest[0].trim()}`);

  return errors;
}

export function checkTokenDiscipline(css) {
  const start = css.indexOf(':root');
  if (start === -1) return ['no :root token block found'];
  const end = css.indexOf('}', start);
  const rootBlock = css.slice(start, end + 1);
  const offenders = [...new Set(
    [...css.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map((m) => m[0]).filter((h) => !rootBlock.includes(h))
  )];
  return offenders.map((h) => `stray-hex: ${h} is not a :root token`);
}

export function checkPlaceholders(root) {
  const errors = [];
  const banner = /^.{0,4}(import|export)\b/m;
  for (const file of reachablePages()) {
    if (existsSync(join(root, file)) && banner.test(readFileSync(join(root, file), 'utf8'))) {
      errors.push(`not-pure-html: ${file} looks like a template, not a finished page`);
    }
  }
  return errors;
}

const READER_IDS = ['writing', 'post-list', 'post-reader', 'reader-body'];

export function checkDomContract(html, file) {
  if (!/\.html$/.test(file || '')) return [];
  const errors = [];

  if (file === 'writing.html') {
    for (const id of READER_IDS) {
      if (!new RegExp(`\\sid="${id}"`).test(html)) {
        errors.push(`missing-hook: ${file} needs #${id} for the markdown reader`);
      }
    }
    if (!/\bclass="[^"]*\breader-back\b[^"]*"/.test(html) && !/\sid="reader-back"/.test(html)) {
      errors.push(`missing-hook: ${file} needs .reader-back or #reader-back so a post can be closed`);
    }
  }

  for (const m of html.matchAll(/<[a-zA-Z][^>]*\bclass="[^"]*\bpost-link\b[^"]*"[^>]*>/g)) {
    const md = (m[0].match(/\bdata-md="([^"]*)"/) || [])[1];
    if (md === undefined || md.trim() === '') {
      errors.push(`missing-hook: ${file} has a .post-link with no non-empty data-md`);
    }
  }

  for (const m of html.matchAll(/\bdata-brand-mark="([^"]*)"/g)) {
    if (m[1].trim().split(/\s+/).filter(Boolean).length < 2) {
      errors.push(`missing-hook: ${file} has data-brand-mark="${m[1]}" with fewer than two words`);
    }
  }

  for (const m of html.matchAll(/\bdata-copy-text="([^"]*)"/g)) {
    if (m[1].trim() === '') {
      errors.push(`missing-hook: ${file} has an empty data-copy-text`);
    }
  }

  // A copy button whose only feedback is a label swap announces nothing.
  // The live region normally sits on a child span, so match the whole element.
  for (const m of html.matchAll(/<button\b[^>]*\bdata-copy-text="[^"]*"[^>]*>[\s\S]*?<\/button>/g)) {
    const el = m[0];
    const open = el.slice(0, el.indexOf('>') + 1);
    const hasRegion = /\bdata-copy-status\b/.test(el);
    if (!hasRegion) {
      errors.push(`missing-hook: ${file} has a copy button with no data-copy-status live region`);
    } else if (!/\baria-live="/.test(el)) {
      errors.push(`missing-hook: ${file} has a copy button whose live region has no aria-live`);
    }
    if (!/\baria-describedby="/.test(open)) {
      errors.push(`missing-hook: ${file} has a copy button with no aria-describedby hint`);
    }
  }

  // The reader writes status text into this element, so it must announce.
  if (/\sid="reader-status"/.test(html) && !/\sid="reader-status"[^>]*\baria-live="/.test(html)) {
    errors.push(`missing-hook: ${file} #reader-status needs an aria-live region`);
  }

  return errors;
}

function listFiles(dir) {
  const full = join(ROOT, dir);
  if (!existsSync(full)) return [];
  return readDirRecursive(full).map((f) => join(dir, f).split('\\').join('/'));
}

function readDirRecursive(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...readDirRecursive(full).map((f) => join(entry.name, f)));
    else out.push(entry.name);
  }
  return out;
}

const isMain = process.argv[1] && process.argv[1].endsWith('check-site.mjs');
if (isMain) {
  const errors = [];
  const present = reachablePages().filter((file) => existsSync(join(ROOT, file)));
  for (const file of present) {
    const full = join(ROOT, file);
    if (!/\.(html|md|svg)$/.test(file)) {
      if (readFileSync(full, 'utf8').trim() === '') {
        errors.push(`empty-asset: ${file} is empty`);
      }
      continue;
    }
    errors.push(...checkPage(readFileSync(full, 'utf8'), new Set(), file).map((e) => `${file}: ${e}`));
    if (/\.html$/.test(file)) {
      errors.push(...checkDomContract(readFileSync(full, 'utf8'), file));
    }
  }
  for (const css of ['style.css']) {
    if (existsSync(join(ROOT, css))) {
      errors.push(...checkTokenDiscipline(readFileSync(join(ROOT, css), 'utf8')).map((e) => `${css}: ${e}`));
    }
  }
  errors.push(...checkPlaceholders(ROOT));

  if (errors.length) {
    console.error(`check-site: ${errors.length} problem(s)`);
    for (const e of errors) console.error('  - ' + e);
    process.exit(1);
  }
  console.log(`check-site: OK (${present.length} files checked)`);
}
```

The first import line must be `import { readFileSync, existsSync, readdirSync } from 'node:fs';` —
all three names are used. `readdirSync` is an ES module import, never `require`, which does not
exist in ESM and would throw `ReferenceError: require is not defined` at runtime.

Three details in the code above are load-bearing and were corrected after the first draft:

- The `<a>` regex matches the **whole anchor element**, not just the opening tag, because the
  `empty-href` message is contractually the full `<a href="">Home</a>`. Matching only the opening
  tag would break two of the nine test cases.
- The CJK regex spans from an opening tag to a closing tag so it covers **element content**, not
  just tags. A tag-only regex cannot detect CJK sitting in text between `<p>` and `</p>`. The
  quantifier is `[\s\S]*`, never `.*`: in JavaScript `.` does **not** match a line terminator, so
  `.*` silently misses any CJK whose opening tag, text, and closing tag sit on different lines —
  which is the normal shape of the hand-written indented HTML in Tasks 4, 5, and 7. The ninth
  case, `rejects a CJK character inside a multi-line element`, exists solely to pin that
  behaviour; do not "simplify" it back to `.*`.
- The element pattern alone is a **no-op on Markdown**, because prose has neither an opening nor a
  closing tag. That silently exempts every `.md` file — including the four hand-written articles
  of Tasks 6 and 7, which are the only place the 100% English rule is enforced against free
  prose. The fix is a second pass over the **residue**: the matched elements are blanked with
  `' '.repeat(s.length)` rather than deleted, so character offsets stay stable, and whatever
  text is left is scanned line by line. Padding rather than deletion matters — splicing the
  matched text out would shift every later offset and make the match order depend on what came
  before. The `every CJK shape yields at least one cjk-leak` group pins all seven shapes,
  including a clean English page that must stay silent.
- The cross-page anchor branch checks `existsSync` **before** `INTERNAL`, and the order is pinned
  by a test. A missing page (`missing.html#ant-rubric`) must report `cannot be read`, while an
  asset that exists but is not an internal page (`pics/logos/ant.svg#x`) must report
  `is not an internal page`. Testing `INTERNAL` first would route the missing page to the wrong
  message. Do not reorder these two branches.
- `has no matching id in <file>` can only be exercised once the target page exists on disk, which
  does not happen until Task 5. The test suite therefore builds a throwaway site under `os.tmpdir()`
  (`fixture()` copies the checker into it, `checkerIn()` re-imports it so `ROOT` points at the
  copy) and writes the target `work.html` there. Once the real pages land, that fixture coverage
  and the on-repo run overlap, but the fixture is kept: it is the only check of the message text
  that does not depend on the rest of the site being built.
- `checkPlaceholders` and the CLI both guard with `existsSync`, because `index.html` and the other
  pages do not exist yet at this stage in the build. Without the guard the CLI crashes here rather
  than reporting the five logo SVGs it can actually see.

**Known limitations.** Four defects were found in review and are deliberately left unfixed,
because the pages this plan produces do not trigger them. They are recorded here so a later change
to the HTML or the CSS does not rediscover them as a mysterious checker failure.

1. **`checkTokenDiscipline` reads CSS id selectors as colours.** The stray-hex regex
   `/#[0-9a-fA-F]{3,8}\b/g` matches any `#` followed by 3–8 hex characters, so a legal id selector
   such as `#face`, `#dead`, or `#abc` is reported as `stray-hex`. The planned `style.css` uses
   only class selectors, so it does not trigger — but adding an `id` to any element with a
   word-like name will.
2. **An unclosed `<a>` swallows every anchor after it.** `/<a\b[^>]*>[\s\S]*?<\/a>/g` runs from an
   unclosed `<a>` all the way to the next `</a>`, and the anchors in between are never checked
   individually. An unclosed `<a href="#ghost">` followed by a well-formed
   `<a href="#ghost2">two</a>` reports only `broken-anchor: #ghost has no matching id`; `#ghost2` is
   never seen. All planned HTML is hand-written and well-formed, so it does not trigger.
3. **Directory links are judged by `existsSync` alone, with a misleading diagnostic.** The
   `broken-link` rule has no notion of a directory: it just calls `existsSync(join(ROOT, file))`.
   A directory that exists passes — `existsSync` follows a trailing slash and returns `true` for
   both `content/` and `content` — so a link to a directory is not a false positive once the
   directory is on disk. The real fragility is the message: a *missing* directory and a *missing
   file* produce the identical, wrong-sounding `broken-link: ... does not exist`, and no test pins
   this behaviour, so the diagnosis is ambiguous if a bare-directory link is ever added before its
   directory is created. No planned page links to a bare directory; every `content/` link points
   at a specific `.md` file.
4. **The CJK element regex is greedy, so one leak can mask the rest of a page.** The element
   pattern `/<[^>]*>[\s\S]*<\/[^>]+>/g` uses a greedy `*`, so on a real page a single match runs
   from the first `<` all the way to the last closing tag. The consequence is twofold: a single
   CJK character produces one `cjk-leak` message whose text is the entire page rather than the
   offending line, and because the whole span is consumed, additional CJK in the same page is not
   reported separately — one page with three leaks still yields one `cjk-leak`. Fixing this
   would change the exact message text and the message count, both of which are pinned by the
   test cases (in particular the multi-line and void-element cases), so it is deliberately left
   unfixed here. If the checker is ever loosened to report one leak per line, those expectations
   must be updated in the same commit.

- [ ] **Step 4: Run the tests and confirm the validator tests pass**

Run:

```bash
cd /mnt/d/Workspace/cv_githubi && node --test "test/*.test.mjs" 2>&1 | tail -30
```

Expected: the 9 `checkPage` cases PASS. `checkTokenDiscipline` and `reachablePages` still FAIL, because `style.css`, `index.html`, `work.html`, and `writing.html` do not exist yet. That is the correct state — those two tests come green in Task 3 and Task 4.

- [ ] **Step 5: Confirm the CLI entry point runs and finds nothing to do yet**

Run:

```bash
cd /mnt/d/Workspace/cv_githubi && node tools/check-site.mjs; echo "exit=$?"
```

Expected: `check-site: OK (5 files checked)` and `exit=0`. Five files = the five logo SVGs under `pics/logos/`, which are the only files `reachablePages()` returns at this point. If it reports `empty-asset`, a logo SVG from Task 1 was written empty.

Note for the implementer: `checkTokenDiscipline` is only ever called with `style.css`, so the `fill="#2b6cb0"` inside the SVGs does **not** trip the stray-hex rule. Likewise `checkPage` runs over each SVG but finds no `<a href>`, no `id`, and no CJK, so each yields zero errors.

- [ ] **Step 6: Commit**

```bash
git add tools test
git commit -m "test: add structural checker and its test suite"
```

---

## Task 3: Design System and Shared Behaviour

**Files:**
- Create: `style.css`
- Create: `main.js`

- [ ] **Step 1: Write `style.css`**

All colour literals live in `:root` and nowhere else. The `checkTokenDiscipline` test enforces this.

```css
/* ==========================================================================
   shawxiaodahua.github.io — single style source
   Every colour literal in this file lives in :root. The structural checker
   fails the build if a hex value appears outside that block.
   ========================================================================== */

:root {
  --primary: #2563eb;
  --accent: #60a5fa;
  --text-dark: #1e293b;
  --text-body: #334155;
  --text-light: #64748b;
  --text-faint: #7d8da3;
  --bg-light: #f8fafc;
  --bg-white: #ffffff;
  --border: #e2e8f0;
  --border-strong: #cbd5e1;
  --chip-bg: #eff6ff;
  --chip-text: #1d4ed8;
  --danger: #b91c1c;
  --danger-bg: #fef2f2;
  --grad-page: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --grad-accent: linear-gradient(135deg, #2563eb, #3b82f6);
  --shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -1px rgba(15, 23, 42, 0.06);
  --shadow-lg: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 10px 10px -5px rgba(15, 23, 42, 0.04);
  --radius: 20px;
  --radius-sm: 12px;
  --rail-w: 300px;
  --shell-w: 1180px;
  --font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html { scroll-behavior: smooth; scroll-padding-top: 1.5rem; }

body {
  font-family: var(--font);
  color: var(--text-dark);
  background: var(--grad-page);
  background-attachment: fixed;
  line-height: 1.6;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

a { color: var(--primary); text-decoration: none; }
a:hover { text-decoration: underline; }

.shell {
  max-width: var(--shell-w);
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
  display: grid;
  grid-template-columns: var(--rail-w) minmax(0, 1fr);
  gap: 1.5rem;
  align-items: start;
}

/* ---------- Left rail ---------- */

.rail { position: sticky; top: 2rem; }

.rail-card {
  background: var(--bg-white);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  padding: 1.75rem 1.5rem;
  text-align: center;
}

.avatar {
  width: 128px; height: 128px;
  border-radius: 50%;
  margin: 0 auto 1rem;
  object-fit: cover;
  background: var(--grad-accent);
  color: var(--bg-white);
  display: flex; align-items: center; justify-content: center;
  font-size: 2.75rem; font-weight: 700; letter-spacing: 0.02em;
  box-shadow: var(--shadow);
}

.rail-name { font-size: 1.4rem; font-weight: 700; letter-spacing: -0.01em; }
.rail-name span { display: block; font-size: 0.95rem; font-weight: 400; color: var(--text-light); }
.rail-positioning { color: var(--text-light); font-size: 0.92rem; margin-top: 0.35rem; }
.rail-meta { color: var(--text-light); font-size: 0.82rem; margin-top: 0.5rem; }

.rail-nav { margin-top: 1.25rem; border-top: 1px solid var(--border); padding-top: 0.85rem; }
.rail-nav a {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.55rem 0.7rem; border-radius: 8px;
  color: var(--text-light); font-size: 0.92rem; font-weight: 500;
  transition: background 0.2s ease, color 0.2s ease;
}
.rail-nav a:hover { background: var(--bg-light); color: var(--primary); text-decoration: none; }
.rail-nav a.is-active { background: var(--bg-light); color: var(--primary); font-weight: 600; }
.rail-nav a::after { content: '\203A'; color: var(--text-light); }

.rail-contact { margin-top: 0.85rem; border-top: 1px solid var(--border); padding-top: 0.85rem; }
.rail-contact a, .rail-contact button {
  display: flex; align-items: center; justify-content: space-between;
  width: 100%; padding: 0.5rem 0.7rem; margin-bottom: 0.25rem;
  background: none; border: 0; border-radius: 8px;
  font: inherit; font-size: 0.88rem; color: var(--text-light);
  cursor: pointer; text-align: left;
  transition: background 0.2s ease, color 0.2s ease;
}
.rail-contact a:hover, .rail-contact button:hover { background: var(--bg-light); color: var(--primary); text-decoration: none; }
.rail-contact .is-copied { background: var(--chip-bg); color: var(--chip-text); font-weight: 600; }
.rail-contact .is-failed { background: var(--danger-bg); color: var(--danger); font-weight: 600; }

/* ---------- Right column ---------- */

.main-col { min-width: 0; display: flex; flex-direction: column; gap: 1.5rem; }

.section {
  background: var(--bg-white);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  padding: 2rem 2.25rem;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }

.section h2 {
  font-size: 1.6rem; margin-bottom: 1.25rem;
  border-left: 4px solid var(--primary); padding-left: 0.85rem;
}
.section h3 { font-size: 1.05rem; font-weight: 600; margin: 1.5rem 0 0.5rem; }
.section p { color: var(--text-body); margin-bottom: 0.85rem; }
.section ul { margin: 0 0 0.85rem 1.15rem; }
.section li { margin-bottom: 0.35rem; color: var(--text-body); }
.section a { color: var(--primary); }

.eyebrow { color: var(--text-light); font-size: 0.88rem; margin-bottom: 0.15rem; }

/* ---------- Work card ---------- */

.work-card {
  background: var(--bg-light);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--border-strong);
  padding: 1.1rem 1.25rem;
  margin-bottom: 1rem;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}
.work-card:hover { transform: translateX(4px); box-shadow: var(--shadow); border-left-color: var(--primary); }
.work-card h3 { margin: 0 0 0.15rem; font-size: 1.05rem; }
.org { font-weight: 400; font-size: 0.85rem; color: var(--text-light); }
.work-card p { font-size: 0.93rem; margin-bottom: 0.5rem; }
.work-card p:last-of-type { margin-bottom: 0; }

.chips { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.7rem; }
.chip {
  background: var(--primary); color: var(--bg-white);
  font-size: 0.76rem; font-weight: 500;
  padding: 0.22rem 0.65rem; border-radius: 20px;
}
.chip.plain { background: var(--chip-bg); color: var(--chip-text); }

/* ---------- Experience timeline ---------- */

.timeline { list-style: none; margin: 0; }
.timeline li { position: relative; padding: 0 0 1.15rem 1.35rem; border-left: 2px solid var(--border); }
.timeline li:last-child { border-left-color: transparent; padding-bottom: 0; }
.timeline li::before {
  content: ''; position: absolute; left: -6px; top: 0.4rem;
  width: 10px; height: 10px; border-radius: 50%;
  background: var(--bg-white); border: 2px solid var(--primary);
}
.timeline .when { font-size: 0.82rem; color: var(--text-light); font-family: var(--mono); }
.timeline .who { font-weight: 600; }
.timeline .what { color: var(--text-body); font-size: 0.93rem; }

/* ---------- Honors disclosures ---------- */

details {
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  margin-bottom: 0.7rem;
  background: var(--bg-white);
}
summary {
  cursor: pointer; padding: 0.85rem 1.1rem;
  font-weight: 600; font-size: 0.98rem;
  list-style: none;
}
summary::-webkit-details-marker { display: none; }
summary::before { content: '\25B8'; color: var(--primary); margin-right: 0.5rem; }
details[open] summary::before { content: '\25BE'; }
details .details-body { padding: 0 1.1rem 1.1rem; font-size: 0.93rem; }
details .count { color: var(--text-light); font-weight: 400; font-size: 0.85rem; }

.pub { margin-bottom: 0.9rem; }
.pub:last-child { margin-bottom: 0; }
.pub .venue { color: var(--text-light); font-size: 0.85rem; }
.badge {
  display: inline-block; font-size: 0.7rem; font-weight: 700;
  background: var(--chip-bg); color: var(--chip-text);
  padding: 0.1rem 0.4rem; border-radius: 4px; margin-left: 0.35rem;
  vertical-align: 1px;
}

/* ---------- Utilities ---------- */

.visually-hidden {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; border: 0;
}

.skip-link {
  position: absolute; left: 0.75rem; top: -3rem; z-index: 10;
  padding: 0.6rem 1rem; border-radius: var(--radius-sm);
  background: var(--bg-white); color: var(--primary);
  font-weight: 600; box-shadow: var(--shadow);
  transition: top 0.2s ease;
}
.skip-link:focus { top: 0.75rem; text-decoration: none; }

/* ---------- Contact block ---------- */

.contact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; }
.contact-item {
  background: var(--bg-light); border-radius: var(--radius-sm);
  padding: 0.9rem 1rem; font-size: 0.9rem;
}
.contact-item .k { color: var(--text-light); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; }
.contact-item .v { font-weight: 600; word-break: break-word; }

.copy-id {
  display: inline-flex; align-items: baseline; gap: 0.45rem;
  font: inherit; font-weight: 600; color: var(--primary);
  background: none; border: 0; padding: 0; cursor: pointer; text-align: left;
}
.copy-id:hover { text-decoration: underline; }
.copy-id:focus-visible { outline: 2px solid var(--primary); outline-offset: 3px; border-radius: 3px; }
.copy-id .copy-cue {
  font-size: 0.72rem; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase;
  color: var(--text-light);
}
.copy-id.is-copied .copy-cue, .copy-id.is-copied .label { color: var(--chip-text); }
.copy-id.is-failed .copy-cue, .copy-id.is-failed .label { color: var(--danger); }

/* ---------- Logo bar ---------- */

.logo-bar {
  max-width: var(--shell-w);
  margin: 0 auto 2.5rem;
  padding: 0 1.5rem;
  display: flex; flex-wrap: wrap;
  align-items: center; justify-content: center;
  gap: 1.6rem;
}
.logo-bar a { display: inline-flex; align-items: center; opacity: 0.8; transition: opacity 0.25s ease; }
.logo-bar a:hover { opacity: 1; }
.logo-bar img { display: block; height: 22px; width: auto; filter: brightness(0) invert(1); }

/* ---------- Markdown reader ---------- */

.reader { display: none; }
.is-reading .reader { display: block; }
.is-reading .post-list { display: none; }

.reader-back {
  display: inline-flex; align-items: center; gap: 0.35rem;
  margin-bottom: 1.25rem; padding: 0.5rem 0.85rem;
  font: inherit; font-size: 0.9rem;
  color: var(--primary); background: var(--bg-light);
  border: 1px solid var(--border); border-radius: 8px; cursor: pointer;
}
.reader-back:hover { background: var(--chip-bg); }
.reader-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.4rem; }
.reader-meta { color: var(--text-light); font-size: 0.9rem; padding-bottom: 0.9rem; border-bottom: 1px solid var(--border); margin-bottom: 1.25rem; }
.reader-status { color: var(--text-light); font-size: 0.95rem; margin-bottom: 1rem; }
.reader-body { max-width: 42rem; }
.reader-body h2 { font-size: 1.2rem; margin: 1.75rem 0 0.6rem; border: 0; padding: 0; }
.reader-body h3 { font-size: 1.02rem; margin: 1.35rem 0 0.5rem; }
.reader-body pre { background: var(--bg-light); padding: 1rem; border-radius: var(--radius-sm); overflow-x: auto; margin-bottom: 1rem; }
.reader-body code { font-family: var(--mono); font-size: 0.9em; background: var(--bg-light); padding: 0.15em 0.4em; border-radius: 4px; }
.reader-body pre code { background: none; padding: 0; }
.reader-body blockquote { border-left: 3px solid var(--accent); padding-left: 1rem; color: var(--text-light); margin-bottom: 1rem; }

/* ---------- Responsive ---------- */

@media (max-width: 900px) {
  .shell { grid-template-columns: minmax(0, 1fr); padding: 1rem 1rem 2rem; }
  .rail { position: static; }
  .rail-card { padding: 1.5rem 1.25rem; }
  .avatar { width: 104px; height: 104px; font-size: 2.25rem; }
  .rail-nav, .rail-contact { display: flex; flex-wrap: wrap; gap: 0.4rem; border-top: 0; padding-top: 0.5rem; }
  .rail-nav a, .rail-contact a, .rail-contact button { width: auto; border: 1px solid var(--border); }
  .rail-nav a::after { content: none; }
  .section { padding: 1.5rem 1.25rem; }
  .section h2 { font-size: 1.3rem; }
}

@media (max-width: 480px) {
  :root { --radius: 15px; }
  .shell { padding: 0.75rem 0.75rem 1.5rem; }
  .section { padding: 1.15rem 1rem; }
  .section h2 { font-size: 1.15rem; }
  .work-card { padding: 0.9rem 1rem; }
  .logo-bar { gap: 0.9rem; padding: 0 1rem; }
  .logo-bar img { height: 17px; }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

@media print {
  body { background: none; }
  .rail-nav, .rail-contact, .reader-back, .logo-bar, .skip-link, .copy-cue { display: none; }
  .section { box-shadow: none; border: 1px solid var(--border); break-inside: avoid; }
  a[href^="http"]::after { content: " (" attr(href) ")"; font-size: 0.8em; word-break: break-all; }
}
```

- [ ] **Step 2: Write `main.js`**

Create `main.js`:

```javascript
/* shawxiaodahua.github.io — shared behaviour, no dependencies. */
(function () {
  'use strict';

  function initBrandMark() {
    var host = document.querySelector('[data-brand-mark]');
    if (!host) return;
    var name = (host.getAttribute('data-brand-mark') || '').trim();
    if (!name) return;
    var parts = name.split(/\s+/);
    host.textContent = ((parts[0] || '')[0] || '').toUpperCase() + ((parts[1] || '')[0] || '').toUpperCase();
  }

  function initRailNav() {
    // Fragment links are left to the browser. CSS already applies
    // scroll-behavior: smooth, and reduced motion is honoured in CSS too,
    // so overriding here would only cost us focus movement and a shareable
    // URL. The only job left is marking the clicked item current.
    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('.rail-nav a[href^="#"]') : null;
      if (!a) return;
      if (!document.querySelector(a.getAttribute('href'))) return;
      document.querySelectorAll('.rail-nav a[href^="#"]').forEach(function (other) {
        var on = other === a;
        other.classList.toggle('is-active', on);
        if (on) other.setAttribute('aria-current', 'true');
        else other.removeAttribute('aria-current');
      });
    });
  }

  function initSectionSpy() {
    var links = [].slice.call(document.querySelectorAll('.rail-nav a[href^="#"]'));
    if (!links.length || !('IntersectionObserver' in window)) return;
    var byId = {};
    var targets = links.map(function (a) {
      var id = a.getAttribute('href').slice(1);
      byId[id] = a;
      return document.getElementById(id);
    }).filter(Boolean);
    if (!targets.length) return;

    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });

      // Pick the first intersecting target in document order. Ranking by
      // intersectionRatio would compare a fraction of each element's own
      // area, so a tall section and a short one are not on the same scale.
      var best = null;
      for (var i = 0; i < targets.length; i++) {
        if (visible[targets[i].id]) { best = targets[i].id; break; }
      }
      // At the very bottom no target may intersect the band; keep the last
      // section marked rather than dropping the indicator entirely.
      if (!best && window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
        best = targets[targets.length - 1].id;
      }
      if (!best) return;
      links.forEach(function (a) {
        var on = byId[best] === a;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    }, { rootMargin: '-20% 0px -55% 0px', threshold: 0 });

    targets.forEach(function (t) { io.observe(t); });
  }

  function initWeChatCopy() {
    var btns = [].slice.call(document.querySelectorAll('[data-copy-text]'));
    if (!btns.length) return;

    function legacyCopy(text) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      try {
        ta.select();
        return document.execCommand('copy');
      } catch (e) {
        return false;
      } finally {
        if (ta.parentNode) ta.parentNode.removeChild(ta);
      }
    }

    btns.forEach(function (btn) {
      var label = btn.querySelector('.label');
      var status = btn.querySelector('[data-copy-status]');
      var original = label ? label.textContent : '';
      var timer;
      function flash(text) {
        if (label) label.textContent = text;
        // Mirror the change into a live region: the visible label swap is
        // invisible to a screen reader, which would otherwise announce nothing.
        if (status) status.textContent = text;
        var failed = text !== 'Copied';
        btn.classList.toggle('is-failed', failed);
        btn.classList.toggle('is-copied', !failed);
        clearTimeout(timer);
        timer = setTimeout(function () {
          if (label) label.textContent = original;
          if (status) status.textContent = '';
          btn.classList.remove('is-copied');
          btn.classList.remove('is-failed');
        }, 1600);
      }
      btn.addEventListener('click', function () {
        var text = btn.getAttribute('data-copy-text') || '';
        var done = (navigator.clipboard && window.isSecureContext)
          ? navigator.clipboard.writeText(text)
          : legacyCopy(text);
        Promise.resolve(done).then(
          function (v) { flash(v === false ? 'Copy failed' : 'Copied'); },
          function () { flash('Copy failed'); }
        );
      });
    });
  }

  function initMarkdownReader() {
    var section = document.getElementById('writing');
    if (!section) return;
    var list = document.getElementById('post-list');
    var reader = document.getElementById('post-reader');
    var titleEl = document.getElementById('reader-title');
    var metaEl = document.getElementById('reader-meta');
    var statusEl = document.getElementById('reader-status');
    var bodyEl = document.getElementById('reader-body');
    if (!list || !reader || !bodyEl) {
      var missing = [['#post-list', list], ['#post-reader', reader], ['#reader-body', bodyEl]]
        .filter(function (p) { return !p[1]; })
        .map(function (p) { return p[0]; });
      if (window.console) console.warn('main.js: markdown reader disabled, missing ' + missing.join(', '));
      return;
    }

    function setStatus(msg) {
      if (!statusEl) return;
      statusEl.textContent = msg || '';
      statusEl.style.display = msg ? 'block' : 'none';
    }

    function renderMarkdown(text) {
      if (typeof marked === 'undefined') {
        var pre = document.createElement('pre');
        pre.textContent = text;
        return pre;
      }
      marked.setOptions({ gfm: true, breaks: false });
      var host = document.createElement('div');
      host.innerHTML = marked.parse(text);
      return host;
    }

    var seq = 0;

    function openPost(src, meta, title) {
      var mine = ++seq;
      section.classList.add('is-reading');
      list.style.display = 'none';
      reader.style.display = 'block';
      bodyEl.innerHTML = '';
      if (titleEl) titleEl.textContent = title || '';
      if (metaEl) metaEl.textContent = meta || '';
      window.scrollTo(0, 0);
      setStatus('Loading...');

      if (location.protocol === 'file:') {
        setStatus('Cannot preview over file://. Run "python3 -m http.server" in the project root and open http://localhost:8000/writing.html. The Markdown parser is also blocked on file:// origins.');
        return;
      }

      var url = new URL(src, location.href).href;
      fetch(url, { cache: 'no-cache' })
        .then(function (r) {
          if (r.status === 404) throw Object.assign(new Error('404'), { notFound: true });
          if (!r.ok) throw new Error(String(r.status));
          return r.text();
        })
        .then(function (raw) {
          if (mine !== seq) return;
          bodyEl.innerHTML = '';
          bodyEl.appendChild(renderMarkdown(raw));
          setStatus('');
        })
        .catch(function (err) {
          if (mine !== seq) return;
          bodyEl.innerHTML = '';
          if (err && err.notFound) {
            setStatus('This post has not been pushed to GitHub yet. Expected at: ' + url);
          } else {
            setStatus('Could not load this post (HTTP ' + (err && err.message) + ').');
          }
        });
    }

    function closePost() {
      section.classList.remove('is-reading');
      list.style.display = '';
      reader.style.display = 'none';
      bodyEl.innerHTML = '';
      setStatus('');
    }

    document.querySelectorAll('.post-link').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        openPost(a.getAttribute('data-md'), a.getAttribute('data-meta') || '', a.getAttribute('data-title') || '');
      });
    });

    var backs = document.querySelectorAll('.reader-back, #reader-back');
    if (!backs.length && window.console) {
      console.warn('main.js: markdown reader has no way back, missing .reader-back or #reader-back');
    }
    [].slice.call(backs).forEach(function (b) { b.addEventListener('click', closePost); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePost(); });
  }

  function boot() {
    [['initBrandMark', initBrandMark],
     ['initRailNav', initRailNav],
     ['initSectionSpy', initSectionSpy],
     ['initWeChatCopy', initWeChatCopy],
     ['initMarkdownReader', initMarkdownReader]].forEach(function (p) {
      try { p[1](); } catch (e) { if (window.console) console.warn('main.js: ' + p[0] + ' failed', e); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
```

- [ ] **Step 3: Run the checker and confirm the token discipline test turns green**

Run:

```bash
cd /mnt/d/Workspace/cv_githubi && node --test "test/*.test.mjs" 2>&1 | tail -20 && node tools/check-site.mjs; echo "exit=$?"
```

Expected: `checkTokenDiscipline` now PASSES. The `reachablePages` test still fails, because `index.html`, `work.html`, and `writing.html` do not exist yet — that resolves in Tasks 4, 5, and 7. `check-site.mjs` exits 0.

- [ ] **Step 4: Verify the checker actually catches a stray hex outside `:root`**

Run:

```bash
cd /mnt/d/Workspace/cv_githubi && cp style.css /tmp/style.css.bak && printf '\n.probe { color: #ff0000; }\n' >> style.css && node tools/check-site.mjs; echo "exit=$?"; cp /tmp/style.css.bak style.css && node tools/check-site.mjs; echo "restored-exit=$?"
```

Expected: first run prints `stray-hex: #ff0000 is not a :root token` and `exit=1`. Second run prints `exit=0`. If the first run exits 0, the token discipline check is not wired up correctly — fix before continuing.

- [ ] **Step 5: Confirm no CJK leaked into either file**

Run:

```bash
cd /mnt/d/Workspace/cv_githubi && grep -c $'[\xe4-\xe9]' style.css main.js; echo "grep-exit=$? (1 = no CJK found)"
```

Expected: `grep-exit=1`, meaning no matches.

- [ ] **Step 6: Commit**

```bash
git add style.css main.js
git commit -m "feat: add design tokens, component styles, and shared behaviour"
```

---

## Task 3a: Surface Silent DOM Failures

`main.js` reaches into the DOM at nine convention-only points, and until now every one of them
guarded with `if (!x) return;`. A typo in a single id is therefore silent: renaming
`id="post-list"` to `id="post-list-TYPO"` kills the whole reader with **zero error output**, while
`check-site` still exits 0 and the whole suite still passes. These diagnostics are only worth
anything if they fire *while the markup is being written* in Tasks 4, 5, and 7 — retrofitting
them afterwards is just noise.

### Why there is no jsdom test here

Code review found all nine defects by driving `main.js` under jsdom, and the natural fix would be
to keep that harness as a regression test. It is not an option: this project is zero npm
dependencies, zero build, zero `package.json`, by design and non-negotiably. `jsdom`,
`linkedom`, `happy-dom`, and every test framework are equally disqualified. There is no
middle ground where the harness is worth more than the constraint.

### What replaces it

A static contract check, which fits the existing toolchain because it needs nothing but
`node:fs`. `checkDomContract(html, file)` reads the ids, classes, and data attributes that
`main.js` looks up straight out of the HTML source and reports any that are absent. It catches
the exact class of defect the review found — markup and script drifting apart — without
executing a single line of script:

- `writing.html` must carry `id="writing"`, `id="post-list"`, `id="post-reader"`, and
  `id="reader-body"`, plus at least one `.reader-back` or `#reader-back`. Miss any of them and
  `initMarkdownReader` returns early; miss the last one and an opened post cannot be closed.
- Every `.post-link` needs a non-empty `data-md`. An empty one resolves to `<base>/null`, 404s,
  and reports "This post has not been pushed to GitHub yet" — pointing the reader at a wrong
  conclusion when the real cause is a forgotten attribute.
- Every `data-brand-mark` needs at least two whitespace-separated words, since `initBrandMark`
  takes the initials of the first two. `data-brand-mark="XP"` renders a single `X`.
- Every `data-copy-text` must be non-empty.

The check applies only to `.html`, so `content/*.md` is untouched, and it stays silent on pages
that do not exist yet — which is what lets it sit here, before Tasks 4, 5, and 7 create
`index.html`, `work.html`, and `writing.html`.

`main.js` also gains runtime diagnostics for the cases a static check cannot see: a warning
naming the missing ids instead of a bare `return`, a `try/catch` around each `boot()` init so one
throwing visual init cannot silently disable the reader, and a `finally` around `legacyCopy` so a
failed copy always reports "Copy failed" and never leaves a hidden textarea behind.

Run:

```bash
cd /mnt/d/Workspace/cv_githubi && node --test "test/*.test.mjs" 2>&1 | tail -8 && node tools/check-site.mjs; echo "exit=$?"
```

Expected: `# fail 4` — the three pages that do not exist yet plus the `reachablePages` parent —
and `check-site.mjs` exits 0.

- [ ] **Step 1: Prove the contract check actually fires**

Do this in a sandbox under `/tmp`, never in the repo:

```bash
SB=$(mktemp -d) && mkdir -p "$SB/tools" && cp tools/check-site.mjs "$SB/tools/" \
  && printf '<section id="writing"><div id="post-list-TYPO"><a class="post-link" data-md="a.md">A</a></div><div id="post-reader"><div id="reader-body"></div></div></section>\n' > "$SB/writing.html" \
  && node "$SB/tools/check-site.mjs"; echo "exit=$? (expect 1)"; rm -rf "$SB"
```

Expected: prints `missing-hook: writing.html needs #post-list for the markdown reader` (along
with the missing `.reader-back` the fixture also omits) and `exit=1`. If it exits 0, the contract
check is not wired into the CLI — fix before continuing.

- [ ] **Step 2: Commit**

```bash
git add main.js tools test docs
git commit -m "fix: surface silent DOM failures and validate the markup contract"
```

---

## Task 4: Home Page

**Files:**
- Create: `index.html`

> **Resolved — the patent numbers are gone.** The four placeholder `patents.google.com/patent/CN…`
> `href` values were looked up on Google Patents and **every one resolved to an unrelated patent
> filed by a different company** (`CN114612510A` is a Tencent image-processing patent;
> `CN110648590A` is a Shanghai Julong rollable touch-screen/laser-display manufacturing patent).
> The other two are equally wrong. So the pre-authorised fallback was taken: **the links are dropped
> and the plain title text is kept.** The four titles themselves are genuine — the source résumé
> lists exactly these four as granted (A/B/E/F, dropping near-duplicate G) — so only the numbers
> were ever fabricated. Reinstating a link requires a CN number the user supplies or that has been
> confirmed to match the title; never re-derive a number by guesswork. Task 9 no longer re-checks
> patent links.

- [ ] **Step 1: Write `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>XiaoXiao Peng | Multimodal LLM &amp; VLA Engineer</title>
  <meta name="description" content="XiaoXiao Peng — multimodal LLM, VLA and embodied intelligence engineer. Built production medical-data AI at Ant Group and production BEV parking perception at Smart Auto.">
  <meta name="keywords" content="XiaoXiao Peng, Multimodal LLM, VLA, Embodied AI, BEV Perception, Computer Vision">
  <link rel="shortcut icon" href="favicon.ico">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <a class="skip-link" href="#main">Skip to main content</a>
  <div class="shell">

    <aside class="rail">
      <div class="rail-card">
        <div class="avatar" data-brand-mark="XiaoXiao Peng" aria-hidden="true">XP</div>
        <h1 class="rail-name">XiaoXiao Peng<span aria-hidden="true">Peng Xiaoxiao</span></h1>
        <p class="rail-positioning">Multimodal LLM · VLA · Embodied AI</p>
        <p class="rail-meta">Hangzhou, China · Open to opportunities</p>

        <nav class="rail-nav" aria-label="Sections">
          <a href="#work" class="is-active" aria-current="true">Selected Work</a>
          <a href="#experience">Experience</a>
          <a href="#honors">Honors</a>
          <a href="#contact">Contact</a>
          <a href="work.html">Full Technical Detail</a>
          <a href="writing.html">Writing</a>
        </nav>

        <div class="rail-contact">
          <a href="mailto:18650113070@163.com"><span>Email</span><span aria-hidden="true">&#9993;</span></a>
          <button type="button" data-copy-text="18650113070" aria-describedby="wechat-hint"><span class="label">WeChat</span><span class="visually-hidden" data-copy-status aria-live="polite"></span><span aria-hidden="true">&#128172;</span></button>
          <a href="https://www.zhihu.com/people/MR-Peng" target="_blank" rel="noopener noreferrer"><span>Zhihu</span><span aria-hidden="true">&#8599;</span></a>
          <a href="https://github.com/shawxiaodahua" target="_blank" rel="noopener noreferrer"><span>GitHub</span><span aria-hidden="true">&#8599;</span></a>
        </div>
        <p class="visually-hidden" id="wechat-hint">Copies the WeChat ID to your clipboard.</p>
      </div>
    </aside>

    <main class="main-col" id="main" tabindex="-1">

      <section class="section" id="work">
        <h2>Selected Work</h2>

        <article class="work-card">
          <h3>Rubric Data Pipeline &amp; AI-Assisted Annotation <span class="org">· Ant Group, 2025.07 – 2026.01</span></h3>
          <p>Built the human-in-the-loop data production and model-optimisation loop for empathetic medical dialogue: expert alignment, dynamic rubric generation, GPT-assisted query rewriting, and LLM-as-judge pairwise ranking, with rubrics reused as the reward signal for RL.</p>
          <p>Also led a LangChain/ReAct workflow that automates medical text annotation, and a three-tier automated QC pipeline whose SFT-tuned multimodal fact-checking raised data acceptance accuracy by 50%.</p>
          <div class="chips">
            <span class="chip">Annotation accuracy +40%</span>
            <span class="chip">Throughput +50%</span>
            <span class="chip">SFT +2.24 pt</span>
            <span class="chip">RL +5.63 pt</span>
            <span class="chip">Thumbs-up/down +6.5% to +13%</span>
            <span class="chip plain">Full rollout</span>
          </div>
        </article>

        <article class="work-card">
          <h3>SmartMapNet <span class="org">· Smart Auto, 2024.06 – 2025.06</span></h3>
          <p>Online vectorized HD-map perception covering lane lines, parking-space lines, low-lying static obstacles and traffic signs from 7 surround-view cameras plus LiDAR, on Nvidia Orin X.</p>
          <p>MapTR-based encoder/decoder with LSS view transformation, BEVSeg and PVSeg auxiliary supervision, VDDL loss for geometric distortion, a dedicated two-stage polygon matcher for low obstacles, and PTQ post-training quantization for deployment.</p>
          <div class="chips">
            <span class="chip">7V + LiDAR</span>
            <span class="chip">Orin X</span>
            <span class="chip">PTQ quantized</span>
            <span class="chip plain">Shipped on AVP / LP</span>
          </div>
        </article>

        <article class="work-card">
          <h3>Parking_OneNet <span class="org">· Smart Auto, 2022.09 – 2024.09</span></h3>
          <p>Single multi-task 2D network over four fisheye IPM bird's-eye views detecting in-space static obstacles — wheel stops, ground locks — and wall/column ground contact points, deployed on Orin N.</p>
          <p>Customised angle prediction with KLD loss and PSC encoding, RANSAC contact-point refinement, AB-point and depth-based pose correction, corner-rotation handling for tilted scenes, and Kalman fusion to stop box jitter at IPM seams.</p>
          <div class="chips">
            <span class="chip">4× fisheye IPM</span>
            <span class="chip">Orin N</span>
            <span class="chip">&gt;95% parking success</span>
            <span class="chip plain">APA / RPA / RSPA production</span>
          </div>
        </article>

        <article class="work-card">
          <h3>VLA-Handbook <span class="org">· Independent, ongoing</span></h3>
          <p>An open-source handbook and working notes on vision-language-action models: control stacks, data collection routes, evaluation, and scaling behaviour, kept as a running record of self-directed study.</p>
          <p><a href="https://github.com/shawxiaodahua/VLA-Handbook" target="_blank" rel="noopener noreferrer">github.com/shawxiaodahua/VLA-Handbook</a></p>
          <div class="chips">
            <span class="chip">Open source</span>
            <span class="chip plain">VLA · embodied intelligence</span>
          </div>
        </article>
      </section>

      <section class="section" id="experience">
        <h2>Experience</h2>
        <ul class="timeline">
          <li>
            <span class="when">2025.07 – 2026.01</span>
            <div class="who">Ant Group <span class="org">· Alipay, Hangzhou</span></div>
            <div class="what">Medical-data AI: LLM-assisted annotation, three-tier automated quality inspection, and the Rubric data paradigm for empathetic dialogue.</div>
          </li>
          <li>
            <span class="when">2022.09 – 2025.07</span>
            <div class="who">Smart Auto</div>
            <div class="what">Parking perception and online vectorized mapping for L2+ production programs, from algorithm design through vehicle-side deployment.</div>
          </li>
          <li>
            <span class="when">2021.06 – 2022.09</span>
            <div class="who">Dahua Technology</div>
            <div class="what">Edge vision for smart parking lots, airport turnaround event detection, and roadside video-pole occupancy enforcement.</div>
          </li>
          <li>
            <span class="when">2020.04 – 2020.06</span>
            <div class="who">CASIA Shenzhen <span class="org">· intern</span></div>
            <div class="what">Crowd counting for metro scenes, with pruning and quantization for edge deployment.</div>
          </li>
        </ul>
      </section>

      <section class="section" id="honors">
        <h2>Honors</h2>

        <details>
          <summary>Competitions <span class="count">— 6 featured</span></summary>
          <div class="details-body">
            <ul>
              <li><strong>Intel AI Innovation Application Challenge</strong> — top 2, 2024.12</li>
              <li><strong>Wuxi International AI Contest</strong>, illegal-parking detection — 4th, 2023.11 <span class="count">(team lead)</span></li>
              <li><strong>Yangtze Delta (Wuhu) Algorithm Contest</strong>, multi-camera sign detection — runner-up, 2023.11 <span class="count">(team lead)</span></li>
              <li><strong>ECV2022</strong> crowd counting, HP-sponsored diamond track — 1st, 2022.07</li>
              <li><strong>iFLYTEK 1024 Developer Contest</strong>, citrus disease detection — 1st, 2021.10 <span class="count">(team lead)</span></li>
              <li><strong>Huawei Cloud Cup</strong>, waste classification — 2nd, 2020.07 <span class="count">(team lead)</span></li>
            </ul>
            <p class="count">Further placements include IEEE BigData 2022 UDTIRI (1st) and TIANCHI IEEE UV 2022 "Vision Meets Algae" (3rd).</p>
          </div>
        </details>

        <details>
          <summary>Publications <span class="count">— 4</span></summary>
          <div class="details-body">
            <div class="pub">
              <div>HSGM: A Hierarchical Similarity Graph Module for Object Re-Identification</div>
              <div class="venue">ICME 2022 <span class="badge">ORAL</span><span class="badge">CCF-B</span></div>
            </div>
            <div class="pub">
              <div>PON: Proposal Optimization Network for Temporal Action Proposal Generation</div>
              <div class="venue">ICIC 2020 <span class="badge">ORAL</span> · EI</div>
            </div>
            <div class="pub">
              <div>Periodic Action Temporal Localization Based on Two-Path Architecture for Product Counting in Sewing Video</div>
              <div class="venue">ICIC 2019 <span class="badge">ORAL</span> · EI</div>
            </div>
            <div class="pub">
              <div>Model Fusion Solution for IEEE UV 2022 "Vision Meets Algae" Object Detection Challenge</div>
              <div class="venue">IEEE UV 2022 Workshop · EI</div>
            </div>
          </div>
        </details>

        <details>
          <summary>Patents <span class="count">— 13 filed: 4 granted, 9 under examination</span></summary>
          <div class="details-body">
            <ul>
              <li>A video temporal action detection method, apparatus, device and storage medium <span class="count">granted</span></li>
              <li>A lip-reading recognition method, apparatus and device <span class="count">granted</span></li>
              <li>A license-plate recognition method, apparatus, terminal and computer-readable storage medium <span class="count">granted</span></li>
              <li>A vehicle detection method, apparatus and computer storage device <span class="count">granted</span></li>
            </ul>
            <p class="count">9 further applications under substantive examination, covering parking-space and wheel-stop detection, wall-and-column detection, and Chinese typo correction in medical text.</p>
          </div>
        </details>
      </section>
      <section class="section" id="contact">
        <h2>Contact</h2>
        <div class="contact-grid">
          <div class="contact-item">
            <div class="k">Email</div>
            <div class="v"><a href="mailto:18650113070@163.com">18650113070@163.com</a></div>
          </div>
          <div class="contact-item">
            <div class="k">WeChat</div>
            <div class="v">
              <button type="button" class="copy-id" data-copy-text="18650113070" aria-describedby="wechat-hint"><span class="label">18650113070</span><span class="visually-hidden" data-copy-status aria-live="polite"></span><span class="copy-cue" aria-hidden="true">copy</span></button>
            </div>
          </div>
          <div class="contact-item">
            <div class="k">Zhihu</div>
            <div class="v"><a href="https://www.zhihu.com/people/MR-Peng" target="_blank" rel="noopener noreferrer">zhihu.com/people/MR-Peng</a></div>
          </div>
          <div class="contact-item">
            <div class="k">GitHub</div>
            <div class="v"><a href="https://github.com/shawxiaodahua" target="_blank" rel="noopener noreferrer">github.com/shawxiaodahua</a></div>
          </div>
        </div>
      </section>

    </main>
  </div>

  <footer class="logo-bar" aria-label="Affiliations">
    <a href="https://www.antgroup.com/" target="_blank" rel="noopener noreferrer"><img src="pics/logos/ant.svg" alt="Ant Group"></a>
    <a href="https://www.smart.com.cn/" target="_blank" rel="noopener noreferrer"><img src="pics/logos/smart.svg" alt="Smart Auto"></a>
    <a href="https://www.dahuatech.com/" target="_blank" rel="noopener noreferrer"><img src="pics/logos/dahua.svg" alt="Dahua Technology"></a>
    <a href="https://www.hqu.edu.cn/" target="_blank" rel="noopener noreferrer"><img src="pics/logos/hqu.svg" alt="Huaqiao University"></a>
    <a href="https://www.ncau.edu.cn/" target="_blank" rel="noopener noreferrer"><img src="pics/logos/ncau.svg" alt="Nanchang University of Aeronautics and Astronautics"></a>
  </footer>

  <script src="main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Run the checker**

Run:

```bash
cd /mnt/d/Workspace/cv_githubi && node tools/check-site.mjs; echo "exit=$?"
```

Expected: `exit=1`, with **exactly two** problems reported:

```
  - index.html: broken-link: index.html -> work.html does not exist
  - index.html: broken-link: index.html -> writing.html does not exist
```

This is the correct pre-Task-7 state, not a regression. `index.html` links to `work.html` and `writing.html` in its nav, but those files are only created in Tasks 5 and 7. The `broken-link` rule calls `existsSync` on the target, so a bare `work.html` link **is** checked for existence on disk regardless of whether it carries a `#fragment` — and the CLI exits `1` on any problem.

What matters at this step is that the checker reports **those two and nothing else**. In particular every `#work` / `#experience` / `#honors` / `#contact` in-page anchor must resolve against a real `id`, and no CJK may have leaked in. Re-run after Task 7, when all three pages exist, and confirm the checker reaches `exit=0`.

If it reports any problem *other* than those two, stop and fix `index.html` — that is a real defect in the page you just wrote.

- [ ] **Step 3: Serve the page and confirm it returns 200 with no console errors**

Run:

```bash
cd /mnt/d/Workspace/cv_githubi && (python3 -m http.server 8000 >/tmp/httpd.log 2>&1 &) && sleep 1.5 && for p in / /style.css /main.js /pics/logos/ant.svg; do printf "%s -> " "$p"; curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:8000$p"; done
```

Expected: `200` for all four. Then open `http://localhost:8000/` in a browser and confirm the browser console is empty and the rail nav highlights as you scroll.

Note: `index.html` deliberately does **not** load the `marked` CDN tag. `initMarkdownReader`
returns immediately on this page because `#writing` does not exist, so the script was a
render-blocking third-party request that provided no function — and on a CN network, where the
spec expects it to be blocked, its failure is a console error that fails the §8 row 2 check. The
tag belongs on `writing.html` alone, added in Task 7.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add home page with rail, selected work, experience, honors, contact"
```

---

## Task 5: Work Page — Ant Group and Smart Auto

**Files:**
- Create: `work.html`

- [ ] **Step 1: Write `work.html`**

The rail is identical to `index.html` except the nav omits section links (they would have no targets on this page) and the Active Work entry is marked. The three project ids in §4.4 are the anchor contract that `index.html` and the spec depend on.

**Subheading set per project.** The spec's house template is *Sensors · Platform · Approach ·
Challenges · Outcome*, but not every project has every part, so the template is applied as follows.
Do not force a heading onto a project that has no content for it.

| Section id | Subheadings used |
|---|---|
| `#ant-rubric` | Problem · AI-assisted annotation system · Three-tier quality inspection · Rubric data paradigm · Open source — no sensors or platform exist for a data-and-LLM role, and outcomes are carried in the bullet lists rather than a separate heading |
| `#smartmapnet` | Setup · Approach · Challenges · Outcome (full five-part template; Setup covers Sensors and Platform together) |
| `#parking-onenet` | Setup · Approach · Challenges · Outcome, with a distinct *Vehicle-side post-processing* heading under Approach |
| `#dahua-parking` | Setup · Approach · Outcome — no distinct challenges were recorded |
| `#dahua-airport` | Setup · Approach · Outcome — no distinct challenges were recorded |

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Work | XiaoXiao Peng</title>
  <meta name="description" content="Technical deep dive: Rubric data pipeline, SmartMapNet online vectorized mapping, Parking_OneNet IPM parking perception, and edge vision projects.">
  <link rel="shortcut icon" href="favicon.ico">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <a class="skip-link" href="#main">Skip to main content</a>
  <div class="shell">

    <aside class="rail">
      <div class="rail-card">
        <div class="avatar" data-brand-mark="XiaoXiao Peng" aria-hidden="true">XP</div>
        <h1 class="rail-name">XiaoXiao Peng<span aria-hidden="true">Peng Xiaoxiao</span></h1>
        <p class="rail-positioning">Multimodal LLM · VLA · Embodied AI</p>
        <p class="rail-meta">Hangzhou, China · Open to opportunities</p>

        <nav class="rail-nav" aria-label="Pages">
          <a href="index.html">Home</a>
          <a href="#ant-rubric" class="is-active" aria-current="true">Rubric Pipeline</a>
          <a href="#smartmapnet">SmartMapNet</a>
          <a href="#parking-onenet">Parking_OneNet</a>
          <a href="#dahua-parking">Smart Parking Lot</a>
          <a href="#dahua-airport">Airport Events</a>
          <a href="writing.html">Writing</a>
        </nav>

        <div class="rail-contact">
          <a href="mailto:18650113070@163.com"><span>Email</span><span aria-hidden="true">&#9993;</span></a>
          <button type="button" data-copy-text="18650113070" aria-describedby="wechat-hint"><span class="label">WeChat</span><span class="visually-hidden" data-copy-status aria-live="polite"></span><span aria-hidden="true">&#128172;</span></button>
          <a href="https://www.zhihu.com/people/MR-Peng" target="_blank" rel="noopener noreferrer"><span>Zhihu</span><span aria-hidden="true">&#8599;</span></a>
          <a href="https://github.com/shawxiaodahua" target="_blank" rel="noopener noreferrer"><span>GitHub</span><span aria-hidden="true">&#8599;</span></a>
        </div>
        <p class="visually-hidden" id="wechat-hint">Copies the WeChat ID to your clipboard.</p>
      </div>
    </aside>

    <main class="main-col" id="main" tabindex="-1">

      <section class="section" id="ant-rubric">
        <h2>Rubric Data Pipeline &amp; AI-Assisted Annotation</h2>
        <p class="eyebrow">Ant Group · Alipay, Hangzhou · 2025.07 – 2026.01</p>

        <h3>Problem</h3>
        <p>Medical dialogue data has no agreed standard for "empathetic", no way to score it consistently between annotators, and no path from a score back into training. Three projects ran in sequence to close that loop: an annotation-assistance system, a three-tier quality-inspection system, and a Rubric-based data paradigm that turns evaluation into a training signal.</p>

        <h3>AI-assisted annotation system</h3>
        <p>A LangChain/ReAct agent over a structured workflow automates medical text annotation, fusing medical RAG with the LLM so that guideline context is retrieved before a label is proposed.</p>
        <ul>
          <li>Annotation accuracy improved 40% against the manual baseline.</li>
          <li>Processing throughput improved 50%.</li>
        </ul>

        <h3>Three-tier quality inspection</h3>
        <p>A three-stage pipeline automates inspection end to end — collection, annotation, then acceptance — with an SFT-tuned model performing multimodal fact verification at the final tier.</p>
        <ul>
          <li>Data acceptance accuracy improved 50%.</li>
          <li>Closed the data loop for downstream business training and product launch.</li>
        </ul>

        <h3>Rubric data paradigm</h3>
        <p>An end-to-end system for human-in-the-loop data production and model optimisation targeting improved empathy in medical conversations, solving three problems at once: standards that were hard to unify, evaluation that was hard to quantify, and training that was hard to align. The pipeline runs expert alignment, dynamic rubric generation, GPT-assisted query rewriting for the human-in-the-loop loop, and LLM-as-judge pairwise ranking — producing rubrics automatically, iterating the evaluation model, automating SFT-corpus polishing, and selecting RL queries. The resulting rubrics are then reused directly as the reward signal for RL training.</p>
        <ul>
          <li>SFT model: +2.24 points on the offline empathy benchmark.</li>
          <li>RL model: +5.63 points on the same benchmark.</li>
          <li>Online A/B: thumbs-up/down ratio improved from 6.5% to 13%.</li>
          <li>Resulting model versions reached full rollout.</li>
        </ul>

        <h3>Open source</h3>
        <p><a href="https://github.com/inclusionAI/ABench" target="_blank" rel="noopener noreferrer">inclusionAI/ABench</a> — ABench, released as open source.</p>
      </section>

      <section class="section" id="smartmapnet">
        <h2>SmartMapNet — Online Vectorized HD Map Perception</h2>
        <p class="eyebrow">Smart Auto · 2024.06 – 2025.06</p>

        <h3>Setup</h3>
        <ul>
          <li><strong>Sensors:</strong> 7 surround-view cameras plus LiDAR.</li>
          <li><strong>Platform:</strong> Nvidia Orin X.</li>
        </ul>

        <h3>Approach</h3>
        <p>A multi-task static-perception framework producing an online vectorized HD map, covering lane lines, parking-space lines, low-lying static obstacles and traffic-sign detection. It is built on MapTR and splits into an encoder and a decoder.</p>
        <ul>
          <li><strong>Encoder:</strong> image feature extraction with ResNet50, plus BEV feature encoding via LSS.</li>
          <li><strong>Decoder:</strong> Transformer-based, built from stacked self-attention and cross-attention layers.</li>
          <li><strong>Supervision:</strong> BEVSeg and PVSeg auxiliary losses sharpen semantic understanding.</li>
          <li><strong>Low obstacles:</strong> a dedicated regression head using spatial polygons with a two-stage matcher, because low obstacles are poorly served by the default quad representation.</li>
          <li><strong>Geometry:</strong> dynamic task sampling balances data distribution across tasks; VDDL (vector direction difference loss) fixes the line twisting seen in curves and turns.</li>
          <li><strong>Deployment:</strong> PTQ post-training quantization limits the accuracy lost from FP32, and Kalman filtering fused with odometry stabilises tracking and pose estimation.</li>
        </ul>

        <h3>Challenges</h3>
        <p>Non-homologous training data; fisheye projection into LSS; spatial quadrilateral regression; and the long tail of vehicle corner cases.</p>

        <h3>Outcome</h3>
        <p>Closed-loop vehicle-side testing completed; shipped on the AVP and LP programs.</p>
      </section>

      <section class="section" id="parking-onenet">
        <h2>Parking_OneNet — IPM Parking Perception</h2>
        <p class="eyebrow">Smart Auto · 2022.09 – 2024.09</p>

        <h3>Setup</h3>
        <ul>
          <li><strong>Imaging:</strong> four fisheye cameras covering front, rear, left and right, combined by IPM inverse perspective mapping into a surround bird's-eye view.</li>
          <li><strong>Platform:</strong> Nvidia Orin N.</li>
        </ul>

        <h3>Approach</h3>
        <p>A single multi-task 2D network over the four fisheye bird's-eye views, trained with a differential multi-scale feature fusion framework. Two target families get different treatment:</p>
        <ul>
          <li><strong>In-space static obstacles</strong> (wheel stops, ground locks) use a rotated-box detector regressing both position and orientation. Angle prediction is improved with KLD loss and PSC encoding.</li>
          <li><strong>Walls and columns</strong> use a keypoint-polygon detector regressing the ground contact point, with RANSAC applied to the network's point-set output to recover a more accurate contact point.</li>
        </ul>

        <h3>Vehicle-side post-processing</h3>
        <ul>
          <li>Parking-space AB points correct wheel-stop orientation; parking-space depth corrects wheel-stop pose.</li>
          <li>A corner-rotation algorithm adapts wheel-stop orientation in tilted out-of-vehicle scenarios, handling the dual-wheel-stop case.</li>
          <li>History-frame weighted fusion removes box jitter at IPM seams.</li>
          <li>Kalman-filter motion modelling compensates for apparent wheel-stop motion caused by image stretching during parking.</li>
        </ul>

        <h3>Challenges</h3>
        <p>Wide real-world variation in wheel stops and ground locks; walls and columns easily confused with other scene elements; severe stretching in IPM output and the resulting ground-plane estimation error; and target jitter at IPM seams.</p>

        <h3>Outcome</h3>
        <p>APA, RPA and RSPA reached production with continued OTA iteration. Parking success exceeded 95% in open scenes, and AVP completed closed-loop vehicle integration.</p>
      </section>

      <section class="section" id="dahua-parking">
        <h2>Smart Parking Lot — Rotated Object Detection at the Edge</h2>
        <p class="eyebrow">Dahua Technology · 2021.07 – 2021.11</p>

        <h3>Setup</h3>
        <ul>
          <li><strong>Imaging:</strong> oblique cameras at 6 m, 12 m and 20 m covering indoor parking areas at airports, ports and expressway service stations.</li>
          <li><strong>Platforms:</strong> HiSilicon 3559A, Cambricon 220, Ascend, Atlas 310.</li>
        </ul>

        <h3>Approach</h3>
        <ul>
          <li>Mosaic augmentation for sample diversity, plus a sliding-window scheme that expands the count of each vehicle class on purpose.</li>
          <li>YOLOv5 with a ring-shaped smooth loss for angle prediction, and ShuffleNet swapped in as the backbone to fit the edge budget.</li>
          <li>Result: a rotated object detector that became part of the company's core algorithm library.</li>
        </ul>

        <h3>Outcome</h3>
        <p>Capture rate 95.56% and accuracy 95.80% — up 0.5 and 1.0 points over baseline.</p>
      </section>

      <section class="section" id="dahua-airport">
        <h2>Airport Turnaround Node Event Detection</h2>
        <p class="eyebrow">Dahua Technology · 2021.11 – 2022.09</p>

        <h3>Setup</h3>
        <ul>
          <li><strong>Imaging:</strong> 8 MP and 4 MP cameras at apron, side and jet-bridge interior positions.</li>
          <li><strong>Platforms:</strong> Tesla T4, Cambricon 220.</li>
        </ul>

        <h3>Approach</h3>
        <ul>
          <li>Cutout and Albumentations augmentation, plus offline sampling to raise the frequency of rare targets.</li>
          <li>An added small-object detection head on YOLOv5 improves small-target feature learning, and a second-stage recognition pass lifts recall on fuel-hose, wheel-chock and similar small objects.</li>
          <li>Detected aircraft, aircraft components, jet-bridge state and service vehicles feed a motion-state model based on IoU matching rules; events are then encoded as logic status codes and reported per turnaround node.</li>
        </ul>

        <h3>Outcome</h3>
        <p>Two airport projects won; algorithm competitive evaluations passed at several airports.</p>
      </section>

    </main>
  </div>

  <footer class="logo-bar" aria-label="Affiliations">
    <a href="https://www.antgroup.com/" target="_blank" rel="noopener noreferrer"><img src="pics/logos/ant.svg" alt="Ant Group"></a>
    <a href="https://www.smart.com.cn/" target="_blank" rel="noopener noreferrer"><img src="pics/logos/smart.svg" alt="Smart Auto"></a>
    <a href="https://www.dahuatech.com/" target="_blank" rel="noopener noreferrer"><img src="pics/logos/dahua.svg" alt="Dahua Technology"></a>
    <a href="https://www.hqu.edu.cn/" target="_blank" rel="noopener noreferrer"><img src="pics/logos/hqu.svg" alt="Huaqiao University"></a>
    <a href="https://www.ncau.edu.cn/" target="_blank" rel="noopener noreferrer"><img src="pics/logos/ncau.svg" alt="Nanchang University of Aeronautics and Astronautics"></a>
  </footer>

  <script src="main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Run the checker**

Run:

```bash
cd /mnt/d/Workspace/cv_githubi && node tools/check-site.mjs; echo "exit=$?"
```

Expected: `exit=1`, with **exactly one** problem reported:

```
  - index.html: broken-link: index.html -> writing.html does not exist
```

`index.html -> work.html` now resolves, and every `#ant-rubric` / `#smartmapnet` / `#parking-onenet` / `#dahua-parking` / `#dahua-airport` anchor in the rail is verified against the ids in this file — the cross-page anchor rule reads `work.html` and confirms the target ids exist. The one remaining problem is the nav link to `writing.html`, which is not created until Task 7. That resolves in Task 7, where the checker finally reaches `exit=0`.

If it reports any problem other than that single `writing.html` link, stop and fix `work.html`.

- [ ] **Step 3: Confirm the page serves and the anchors jump**

Run:

```bash
curl -s -o /dev/null -w "work.html -> %{http_code}\n" http://localhost:8000/work.html
```

Expected: `200`. Then in the browser, click each rail entry on `work.html` and confirm the page scrolls to the right section and the active marker moves.

- [ ] **Step 4: Commit**

```bash
git add work.html
git commit -m "feat: add work page with five project deep dives"
```

---

## Task 6: Work Page — Glossary and Cross-links

No new project content. This task adds the reader-facing terminology table and the cross-links between the two pages, both of which the spec requires and which are easiest to forget once the prose is written.

**This published glossary is not the spec's §4.5 table.** Spec §4.5 is a private
Chinese-to-English translation key that governs the prose written in Tasks 4 and 5. The section
added below is a reader-facing expansion for a public audience, covering acronyms a visitor will
meet in the work-page prose. When the two disagree, §4.5 wins for the prose.

**Files:**
- Modify: `work.html`

- [ ] **Step 1: Add a glossary section before the closing `</main>`**

Insert immediately after the `</section>` that closes `#dahua-airport` and before `</main>`:

```html
      <section class="section" id="glossary">
        <h2>Terminology</h2>
        <p>Chinese technical terms these projects use, and the English rendering used throughout this site.</p>
        <ul>
          <li><strong>IPM</strong> — inverse perspective mapping, the transform that lifts a surround-view fisheye image into a bird's-eye view</li>
          <li><strong>LSS</strong> — lift-splat-shoot, a learned view transformation from perspective images to BEV</li>
          <li><strong>MapTR</strong> — a vectorized map-perception framework using ordered point sets</li>
          <li><strong>PTQ</strong> — post-training quantization</li>
          <li><strong>VDDL</strong> — vector direction difference loss, used here to correct line twisting in curves</li>
          <li><strong>RANSAC</strong> — random sample consensus, used to refine wall-and-column contact points</li>
          <li><strong>PSC</strong> — periodic sine-cosine encoding, used for angle regression</li>
          <li><strong>ReAct</strong> — an LLM agent pattern interleaving reasoning and tool calls</li>
          <li><strong>Rubric</strong> — a weighted, per-criterion scoring guide; here reused as an RL reward signal</li>
          <li><strong>SFT / RL</strong> — supervised fine-tuning / reinforcement learning</li>
          <li><strong>Wheel stop / ground lock</strong> — the obstacles a parking-space network must find between the space lines</li>
          <li><strong>Low-lying static obstacle</strong> — curbs, cones and other short objects that standard map elements miss</li>
          <li><strong>Data closed loop</strong> — collection, annotation, inspection and acceptance feeding training, with acceptance results returning as new training signal</li>
        </ul>
        <p><a href="index.html">Back to the overview</a></p>
      </section>
```

- [ ] **Step 2: Add the glossary entry to the rail nav on `work.html`**

In the `<nav class="rail-nav">` of `work.html`, add one line after the `Airport Events` anchor:

```html
          <a href="#glossary">Terminology</a>
```

- [ ] **Step 3: Run the checker**

Run:

```bash
cd /mnt/d/Workspace/cv_githubi && node tools/check-site.mjs; echo "exit=$?"
```

Expected: `exit=0`. The new `#glossary` anchor and the new `<section id="glossary">` match, and the new `index.html` back-link resolves.

- [ ] **Step 4: Commit**

```bash
git add work.html
git commit -m "docs: add terminology glossary and cross-links to work page"
```

---

## Task 7: Writing Page and Markdown Reader

**Files:**
- Create: `writing.html`
- Create: `content/posts/perception-is-the-interface.md`
- Create: `content/posts/why-rubrics-as-rl-reward.md`
- Create: `content/posts/vla-control-stack-notes.md`

- [ ] **Step 1: Create the three Markdown posts**

`content/posts/perception-is-the-interface.md`:

```markdown
# Perception Is the Interface

How much of a robot's behaviour is decided by its perception stack, and how much by its policy? Most of the engineering effort sits in the seam between them.

## The seam is where shipping happens

A policy that works on logged data and a policy that works in a vehicle are separated by everything the perception stack gets wrong: dropped frames, stale poses, misaligned extrinsics. None of these are policy bugs, and all of them look like policy bugs.

## Three things that actually mattered

**Timestamp discipline.** Every frame carries a capture time, not a read time. Smoothing over this produces trajectories that look smooth and are wrong.

**Pose stability over pose accuracy.** A pose that is consistently late is easier to correct downstream than one that jitters. Kalman fusion with odometry was worth more than a better intrinsic calibration.

**Degenerate cases get a metric.** Corner cases do not average out. If a case is not measured, it is not fixed.

## What I would do differently

I would build the corner-case set before the network. Every project here had the same shape: train, deploy, discover a new failure mode, collect, retrain. Collecting first would have collapsed two of those loops into one.
```

`content/posts/why-rubrics-as-rl-reward.md`:

```markdown
# Why Rubrics Make Better RL Rewards

Most reward functions in production systems are a single scalar someone chose. Rubrics are the alternative: a set of weighted criteria that a judge model can apply consistently.

## The problem with scalar rewards

A single reward has no structure to exploit and no structure to learn from. When a model improves on the scalar but degrades on something you care about, you find out in an A/B test, weeks later.

## What a rubric buys

**Specificity.** "Was the response empathetic?" becomes "did it acknowledge the patient's stated concern before offering advice" plus "did it avoid diagnostic claims outside scope". The second one is checkable.

**Iteration speed.** The judge model is itself a model, so it can be improved on its own data. The rubric is the interface between the two loops.

**Transfer to RL.** Once rubrics are the unit of evaluation, they can be composed into a reward directly. The evaluation work becomes training infrastructure instead of a separate track.

## Where it breaks

Rubric generation drifts. Without expert anchoring, generated criteria subtly reward the judge's own preferences, and the model converges on style rather than substance. The expert alignment step is not optional — it is the part everyone wants to skip and the part that determines whether the rest works.

## Numbers

On the offline empathy benchmark: SFT +2.24 points, RL +5.63 points. Online, the thumbs-up/down ratio moved from 6.5% to 13%, and the versions went to full rollout.
```

`content/posts/vla-control-stack-notes.md`:

```markdown
# VLA Control Stack Notes

Working notes on how vision-language-action models relate to the classical control stack, written while building an open-source handbook.

## The layers

From the bottom up: joint control, then whole-body control, then a behaviour foundation model, then VLA on top. Each layer abstracts the one below it, and most of the practical difficulty lives at the boundaries.

**PD control** is still the substrate. Everything above it eventually emits torques or target poses.

**Whole-body control** handles the kinematic redundancy — how a six-legged or humanoid robot distributes motion across joints without violating contact constraints.

**Behaviour foundation models** learn general motor priors from demonstration, without a task specification.

**VLA** adds language and vision conditioning on top, which buys generalisation across tasks but does not remove the need for the layers below.

## The honest summary

End-to-end does not mean bottom-up. A VLA policy that skips whole-body control still needs something to turn its output into feasible joint motion. The wins from end-to-end are in perception and planning; the losses show up in safety and stability.

## Open questions

How much of the classical stack can be learned rather than specified? Where is the boundary between a behaviour prior and a hard constraint? Both are unsettled, and both matter more than benchmark deltas.
```

- [ ] **Step 2: Write `writing.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Writing | XiaoXiao Peng</title>
  <meta name="description" content="Notes on perception, LLM data pipelines, rubrics as RL reward, and vision-language-action control stacks.">
  <link rel="shortcut icon" href="favicon.ico">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="shell">

    <aside class="rail">
      <div class="rail-card">
        <div class="avatar" data-brand-mark="XiaoXiao Peng" aria-label="XiaoXiao Peng">XP</div>
        <h1 class="rail-name">XiaoXiao Peng<span>Peng Xiaoxiao</span></h1>
        <p class="rail-positioning">Multimodal LLM · VLA · Embodied AI</p>
        <p class="rail-meta">Hangzhou, China · Open to opportunities</p>

        <nav class="rail-nav" aria-label="Pages">
          <a href="index.html">Home</a>
          <a href="work.html">Work</a>
          <a href="#writing" class="is-active">Writing</a>
        </nav>

        <div class="rail-contact">
          <a href="mailto:18650113070@163.com"><span>Email</span><span aria-hidden="true">&#9993;</span></a>
          <button type="button" data-copy-text="18650113070"><span class="label">WeChat</span><span aria-hidden="true">&#128172;</span></button>
          <a href="https://www.zhihu.com/people/MR-Peng" target="_blank" rel="noopener noreferrer"><span>Zhihu</span><span aria-hidden="true">&#8599;</span></a>
          <a href="https://github.com/shawxiaodahua" target="_blank" rel="noopener noreferrer"><span>GitHub</span><span aria-hidden="true">&#8599;</span></a>
        </div>
      </div>
    </aside>

    <main class="main-col">

      <section class="section" id="writing">
        <h2>Writing</h2>

        <div class="post-list" id="post-list">
          <article class="work-card">
            <h3><a href="content/posts/perception-is-the-interface.md" class="post-link"
                   data-md="content/posts/perception-is-the-interface.md"
                   data-title="Perception Is the Interface"
                   data-meta="Notes · perception, deployment, corner cases">Perception Is the Interface</a></h3>
            <p>How much of a robot's behaviour its perception stack decides versus its policy — and why the seam between them is where shipping actually happens.</p>
            <div class="chips">
              <span class="chip plain">Perception</span>
              <span class="chip plain">Deployment</span>
              <span class="chip plain">Corner cases</span>
            </div>
          </article>

          <article class="work-card">
            <h3><a href="content/posts/why-rubrics-as-rl-reward.md" class="post-link"
                   data-md="content/posts/why-rubrics-as-rl-reward.md"
                   data-title="Why Rubrics Make Better RL Rewards"
                   data-meta="Notes · LLM data pipelines, evaluation, RL">Why Rubrics Make Better RL Rewards</a></h3>
            <p>Scalar rewards have no structure to exploit and none to learn from. What weighted, judge-applied criteria buy instead — and where rubric generation drifts.</p>
            <div class="chips">
              <span class="chip plain">LLM</span>
              <span class="chip plain">Evaluation</span>
              <span class="chip plain">RL</span>
            </div>
          </article>

          <article class="work-card">
            <h3><a href="content/posts/vla-control-stack-notes.md" class="post-link"
                   data-md="content/posts/vla-control-stack-notes.md"
                   data-title="VLA Control Stack Notes"
                   data-meta="Notes · VLA, whole-body control, motor priors">VLA Control Stack Notes</a></h3>
            <p>How vision-language-action models sit on top of PD control, whole-body control and behaviour foundation models — and why end-to-end does not mean bottom-up.</p>
            <div class="chips">
              <span class="chip plain">VLA</span>
              <span class="chip plain">Whole-body control</span>
              <span class="chip plain">Robot learning</span>
            </div>
          </article>
        </div>

        <div class="reader" id="post-reader" style="display:none">
          <button type="button" class="reader-back" id="reader-back">&#8592; Back to Writing</button>
          <h3 class="reader-title" id="reader-title"></h3>
          <p class="reader-meta" id="reader-meta"></p>
          <p class="reader-status" id="reader-status" style="display:none"></p>
          <article class="reader-body" id="reader-body" aria-live="polite"></article>
        </div>
      </section>

    </main>
  </div>

  <footer class="logo-bar" aria-label="Affiliations">
    <a href="https://www.antgroup.com/" target="_blank" rel="noopener noreferrer"><img src="pics/logos/ant.svg" alt="Ant Group"></a>
    <a href="https://www.smart.com.cn/" target="_blank" rel="noopener noreferrer"><img src="pics/logos/smart.svg" alt="Smart Auto"></a>
    <a href="https://www.dahuatech.com/" target="_blank" rel="noopener noreferrer"><img src="pics/logos/dahua.svg" alt="Dahua Technology"></a>
    <a href="https://www.hqu.edu.cn/" target="_blank" rel="noopener noreferrer"><img src="pics/logos/hqu.svg" alt="Huaqiao University"></a>
    <a href="https://www.ncau.edu.cn/" target="_blank" rel="noopener noreferrer"><img src="pics/logos/ncau.svg" alt="Nanchang University of Aeronautics and Astronautics"></a>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js"></script>
  <script src="main.js"></script>
</body>
</html>
```

- [ ] **Step 3: Run the checker**

Run:

```bash
cd /mnt/d/Workspace/cv_githubi && node tools/check-site.mjs; echo "exit=$?" && node --test "test/*.test.mjs" 2>&1 | tail -12
```

Expected: `check-site` exits 0, and the full `node --test` run now passes end to end — `checkTokenDiscipline` and `reachablePages` are both green because `style.css` and all three pages exist.

- [ ] **Step 4: Verify the Markdown reader renders real HTML, not the fallback**

Run:

```bash
for p in / /work.html /writing.html /content/posts/why-rubrics-as-rl-reward.md; do printf "%s -> " "$p"; curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:8000$p"; done
```

Expected: `200` for all four — the last one confirms the `.md` is actually fetchable, which is what the reader depends on.

Then in the browser: open `http://localhost:8000/writing.html`, click **Why Rubrics Make Better RL Rewards**, and confirm an `<h2>` renders inside the reader (proving marked.js parsed it) rather than a `<pre>` block. Click **Back to Writing** and confirm the list returns.

- [ ] **Step 5: Verify the 404 path with a specific message**

Run:

```bash
mv content/posts/vla-control-stack-notes.md /tmp/vcs.md && printf "click the VLA post in the browser, then run this:\n" && echo "(browser check below)" && mv /tmp/vcs.md content/posts/vla-control-stack-notes.md
```

In the browser, while the file is moved aside, click the VLA entry. Expected: the status line reads **"This post has not been pushed to GitHub yet. Expected at: http://localhost:8000/content/posts/vla-control-stack-notes.md"** — not a generic failure. Then restore the file and confirm the post loads again.

- [ ] **Step 6: Verify the CDN-blocked fallback**

In the browser devtools network panel, block `cdn.jsdelivr.net` and reload `writing.html`, then open a post. Expected: the raw Markdown appears inside a `<pre>` block, the page stays usable, and the console shows no unhandled error. Restore the network setting afterwards.

- [ ] **Step 7: Commit**

```bash
git add writing.html content
git commit -m "feat: add writing page with in-place markdown reader and three posts"
```

---

## Task 8: Reserved Project Markdown Directory

**Files:**
- Create: `content/projects/smartmapnet.md`

A stub, so the directory exists and its purpose is documented. No page references it in this plan, per spec §4.1.

- [ ] **Step 1: Create the stub**

`content/projects/smartmapnet.md`:

```markdown
# SmartMapNet

<!--
  RESERVED. Spec section 4.1 keeps VLA-Handbook and all employment projects on
  index.html as cards only. work.html renders SmartMapNet inline as static HTML
  (see work.html section #smartmapnet).

  This file exists so that a future per-project Markdown write-up has a home and
  a documented pattern to follow. To adopt it:
    1. Move the SmartMapNet content out of work.html into this file.
    2. Change the work.html rail anchor to href="#smartmapnet" with class
       "post-link" and data-md="content/projects/smartmapnet.md".
    3. Add id="writing" to the main element of work.html so initMarkdownReader()
       finds its container.
-->
```

- [ ] **Step 2: Run the checker**

Run:

```bash
cd /mnt/d/Workspace/cv_githubi && node tools/check-site.mjs; echo "exit=$?"
```

Expected: `exit=0`. The checker walks `content/projects/smartmapnet.md` for CJK and placeholder hrefs. Markdown **is** covered by the CJK rule: the element pass finds no tags in prose, and a residue pass then scans whatever is left, so any CJK line in a `.md` file is reported. This file must therefore be genuinely English-only — do not treat the Markdown CJK gate as already covered. It does not flag HTML comments — the comment banner is intentional documentation.

- [ ] **Step 3: Commit**

```bash
git add content/projects
git commit -m "docs: reserve content/projects for future per-project write-ups"
```

---

## Task 9: Full Verification Pass

Every check in spec §8, run in one place. Nothing is called done until all nine produce observed output.

**Files:**
- No file changes expected. If a check fails, fix the owning task's file and re-commit there.

- [ ] **Step 1: Start a clean server and confirm all three pages return 200**

```bash
pkill -f "http.server 8000"; sleep 0.5
cd /mnt/d/Workspace/cv_githubi && (python3 -m http.server 8000 >/tmp/httpd.log 2>&1 &) && sleep 1.5
for p in / /work.html /writing.html /style.css /main.js /content/posts/perception-is-the-interface.md /content/posts/why-rubrics-as-rl-reward.md /content/posts/vla-control-stack-notes.md; do printf "%-58s -> " "$p"; curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:8000$p"; done
```

Expected: eight lines, all `200`.

- [ ] **Step 2: Run the full test suite and the checker**

```bash
cd /mnt/d/Workspace/cv_githubi && node --test "test/*.test.mjs" 2>&1 | tail -15 && node tools/check-site.mjs && echo "checker: PASS"
```

Expected: `node --test` reports zero failures, and the checker prints `check-site: OK (N files checked)`.

- [ ] **Step 3: Browser pass — console, reader render, 404 message, CDN fallback**

Open each of `http://localhost:8000/`, `/work.html`, `/writing.html` and open the browser console. Expected: **zero errors and zero failed requests** on each. Record the count; a non-zero count fails this plan.

Then, on `/writing.html`, run the three reader scenarios end to end. These re-run spec §8 checks 3, 4 and 5, which Task 7 verified once at creation time and which must still hold after every later change:

```bash
mv content/posts/vla-control-stack-notes.md /tmp/vcs.md
```

With the file moved aside, click the VLA entry. Expected status text: **"This post has not been pushed to GitHub yet. Expected at: http://localhost:8000/content/posts/vla-control-stack-notes.md"** — a specific message, not a generic failure. Then:

```bash
mv /tmp/vcs.md content/posts/vla-control-stack-notes.md
```

With the file restored, click the entry again. Expected: an `<h2>` renders inside the reader, proving marked.js parsed the Markdown rather than falling back to `<pre>`.

Finally, block `cdn.jsdelivr.net` in the devtools network panel, reload, and open a post. Expected: raw Markdown inside a `<pre>` block, page still usable, no unhandled console error. Restore the network setting.

- [ ] **Step 4: Confirm no CJK anywhere in the shipped surface**

```bash
cd /mnt/d/Workspace/cv_githubi && grep -rlP '[\x{4e00}-\x{9fff}]' index.html work.html writing.html style.css main.js content/ ; echo "grep-exit=$? (1 = clean)"
```

Expected: no file paths printed, and `grep-exit=1`.

- [ ] **Step 5: Confirm no Chinese is rendered in the browser**

In the browser, run `document.body.innerText` in the console on all three pages. Expected: no CJK codepoints in the output.

- [ ] **Step 6: Check the three viewports**

At 375 px, 768 px, and 1440 px on each of the three pages. Expected at 375 and 768: the rail collapses to the top of the column, nav entries wrap into a bordered strip, no horizontal scrollbar. Expected at 1440: rail fixed left at 300 px, content column scrolls, logo bar centred.

- [ ] **Step 7: Confirm every outbound link resolves**

```bash
cd /mnt/d/Workspace/cv_githubi && grep -rhoP '(?<=href=")(https?://[^"]+)' index.html work.html writing.html | sort -u
```

Take that list and open each one. Expected: all resolve, none 404. Pay particular attention to the four Google Patents links — if any specific CN number does not resolve to the intended patent, replace the `href` with a Google Patents search URL for the patent title rather than leaving a wrong link.

- [ ] **Step 8: Confirm no dead or placeholder links remain**

```bash
cd /mnt/d/Workspace/cv_githubi && grep -rn 'href="#"' index.html work.html writing.html; echo "grep-exit=$? (1 = none found)"
```

Expected: no output, `grep-exit=1`.

- [ ] **Step 9: Print preview of `index.html`**

In the browser, print preview `index.html`. Expected: white background, rail nav and contact buttons hidden, all four sections legible with no card clipped across a page break.

- [ ] **Step 10: Stop the server and commit any verification fixes**

```bash
pkill -f "http.server 8000"
cd /mnt/d/Workspace/cv_githubi && git status --short
```

Expected: `git status --short` prints nothing. If it printed anything, a check above required a fix — commit those fixes with a message describing which check failed, then re-run that check.

---

## Appendix A: Credentials

**No credentials belong in this repository.** The DingTalk webhook token and `SEC` signing key currently hardcoded in `D:\Workspace\vla_push_dingtalk.py` must never be copied into any file here. `writing.html` and `main.js` read nothing but the Markdown files in `content/posts/`.

## Appendix B: Deployment

Out of scope for this plan — recorded so the next step is not rediscovered from scratch.

- The repo must be named `shawxiaodahua.github.io` for GitHub Pages to serve it at the apex domain. This plan works in `cv_githubi`; the directory name is not a constraint.
- Settings → Pages → Deploy from branch → `main` / root.
- There are no Google Patents links to verify after the first push. The four placeholder CN numbers were found to point at unrelated patents and were deliberately removed during Task 4; the granted patents are listed as plain titles. If verified numbers are ever supplied, the links return with the usual CN-network reachability caveat.
- Before applying to real roles, have a fluent native speaker read `work.html` end to end. The glossary in §4.5 of the spec fixes the technical terms, but the prose is dense and machine-assisted.
