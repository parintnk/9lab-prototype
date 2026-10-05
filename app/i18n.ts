// Site languages. Translations live in i18n/<file>.json (English text → translation),
// shared with the wireframe / prototype build. zh-Hans.json is generated from zh-Hant.json.
import th from '../i18n/th.json';
import zhHant from '../i18n/zh-Hant.json';
import zhHans from '../i18n/zh-Hans.json';

export const LANGS = [
  { code: 'en', label: 'EN', html: 'en', file: 'en' },
  { code: 'th', label: 'ไทย', html: 'th', file: 'th' },
  { code: 'zh-hant', label: '繁中', html: 'zh-Hant', file: 'zh-Hant' },
  { code: 'zh-hans', label: '简中', html: 'zh-Hans', file: 'zh-Hans' },
] as const;
export type Lang = (typeof LANGS)[number]['code'];

const DICT: Record<Lang, Record<string, string>> = { en: {}, th, 'zh-hant': zhHant, 'zh-hans': zhHans };

export const info = (lang: Lang) => LANGS.find((l) => l.code === lang)!;
// t('English text') → text in the page language (falls back to English)
export const tr = (lang: Lang) => (s: string) => DICT[lang][s] ?? s;
