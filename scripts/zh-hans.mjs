// i18n/zh-Hant.json (Taiwan) → i18n/zh-Hans.json (Mainland). Character conversion only: phrase mode
// changes meaning here (訂單查詢 → 订单查找, 資料 → 数据), so wording stays Taiwanese, in simplified characters.
import { readFileSync, writeFileSync } from 'node:fs';
import * as OpenCC from 'opencc-js';

const toCn = OpenCC.Converter({ from: 'tw', to: 'cn' });
const hant = JSON.parse(readFileSync('i18n/zh-Hant.json', 'utf8'));
const hans = Object.fromEntries(Object.entries(hant).map(([en, zh]) => [en, toCn(zh)]));
writeFileSync('i18n/zh-Hans.json', JSON.stringify(hans, null, 1) + '\n');
console.log(`zh-Hans: ${Object.keys(hans).length} strings`);
