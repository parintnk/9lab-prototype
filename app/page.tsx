'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { LANGS } from './i18n';

// "/" → the visitor's language (zh-TW/HK → 繁中, zh-CN/SG → 简中, th → ไทย, else English)
export default function Root() {
  useEffect(() => {
    const n = (navigator.languages || [navigator.language]).join(',').toLowerCase();
    const l = /zh-(cn|sg|hans)/.test(n) ? 'zh-hans' : /zh/.test(n) ? 'zh-hant' : /(^|,)th/.test(n) ? 'th' : 'en';
    location.replace(`/${l}/${location.hash}`);
  }, []);
  return (
    <main className="home">
      <h1>9Lab</h1>
      <div className="cards">
        {LANGS.map((l) => <Link key={l.code} href={`/${l.code}/`} className="card"><h2>{l.label}</h2></Link>)}
      </div>
    </main>
  );
}
