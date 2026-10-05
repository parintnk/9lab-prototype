'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { LANGS, info, tr, type Lang } from './i18n';

const TABS = [
  { page: 'journey/', label: 'Journey' },
  { page: 'checklist/', label: 'Checklist' },
  { page: 'wireframe/', label: 'Wireframe' },
  { page: 'prototype/', label: 'Prototype' },
];

export function Bar({ lang, page, full }: { lang: Lang; page: string; full?: string }) {
  const t = tr(lang);
  return (
    <header className="bar">
      <Link href={`/${lang}/`} className="logo">9LAB</Link>
      <nav>
        {TABS.map((x) => (
          <Link key={x.page} href={`/${lang}/${x.page}`} aria-current={x.page === page ? 'page' : undefined}>{t(x.label)}</Link>
        ))}
      </nav>
      <div className="langs" aria-label="Language">
        {LANGS.map((l) => (
          <Link key={l.code} href={`/${l.code}/${page}`} hrefLang={l.html} aria-current={l.code === lang ? 'true' : undefined}>{l.label}</Link>
        ))}
      </div>
      {full && <a className="full" href={full} target="_blank" rel="noreferrer">{t('Open full screen ↗')}</a>}
    </header>
  );
}

export default function Viewer({ lang, page, file, title }: { lang: Lang; page: string; file: string; title: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const src = `/${file}.${info(lang).file}.html`;
  // /th/wireframe/#s1-9 → opens the wireframe focused on screen 1.9
  useEffect(() => {
    if (location.hash && frame.current) frame.current.src = src + location.hash;
  }, [src]);
  return (
    <div className="viewer">
      <Bar lang={lang} page={page} full={src} />
      <iframe ref={frame} src={src} title={tr(lang)(title)} allow="fullscreen" />
    </div>
  );
}
