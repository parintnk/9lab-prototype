// Lists the English strings used by the Progress / Money flow pages that have no translation yet.
// usage: node scripts/i18n-new-pages.mjs [th|zh-Hant|zh-Hans]   (writes i18n/missing-new.json with the untranslated ones)
import { readFileSync, writeFileSync } from 'node:fs';
const root = new URL('..', import.meta.url).pathname;
const SKIP = new Set(['id', 'badge', 'state', 'no', 'x', 'y', 'links', 'value']);
const strings = new Set();
const walk = (v, k) => {
  if (typeof v === 'string') { if (!SKIP.has(k)) strings.add(v); }
  else if (Array.isArray(v)) v.forEach((x) => walk(x, k));
  else if (v && typeof v === 'object') for (const [kk, x] of Object.entries(v)) if (!SKIP.has(kk)) walk(x, kk);
};
const prog = await import(root + 'app/progress-data.ts'); const money = await import(root + 'app/money-data.ts');
for (const m of [prog, money]) for (const [k, v] of Object.entries(m)) if (k === k.toUpperCase()) walk(v, k);
walk(Object.values(money.BADGES).flatMap((b) => [b.label, b.hint]), 'x');
for (const f of ['app/[lang]/progress/Progress.tsx', 'app/[lang]/money/MoneyFlow.tsx']) {
  for (const m of readFileSync(root + f, 'utf8').matchAll(/\bt\('((?:[^'\\]|\\.)*)'\)/g)) strings.add(m[1].replace(/\\'/g, "'"));
}
for (const l of Object.values(prog.STATE_LABELS ?? {})) strings.add(l);
['Working', 'Built, test keys only', 'Waiting for an account', 'Done', 'Waiting for someone', 'Sections', 'System map'].forEach((s) => strings.add(s));
['Free over', 'points'].forEach((s) => strings.add(s));
const out = {};
for (const lang of ['th', 'zh-Hant']) {
  const d = JSON.parse(readFileSync(`${root}i18n/${lang}.json`, 'utf8'));
  out[lang] = [...strings].filter((s) => !(s in d));
}
console.log(`strings ${strings.size} · missing th ${out.th.length} · missing zh-Hant ${out['zh-Hant'].length}`);
writeFileSync(root + 'i18n/missing-new.json', JSON.stringify(out, null, 1));
