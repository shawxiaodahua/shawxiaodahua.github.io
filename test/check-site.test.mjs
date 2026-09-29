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
