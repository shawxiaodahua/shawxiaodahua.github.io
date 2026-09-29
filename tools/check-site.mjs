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
