'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

export const tabs = [
  { href: '/journey/', label: 'Journey' },
  { href: '/checklist/', label: 'Checklist' },
  { href: '/wireframe/', label: 'Wireframe' },
  { href: '/prototype/', label: 'Prototype' },
];

export function Bar({ current, full }: { current: string; full?: string }) {
  return (
    <header className="bar">
      <Link href="/" className="logo">9LAB</Link>
      <nav>
        {tabs.map((t) => (
          <Link key={t.href} href={t.href} aria-current={t.href === current ? 'page' : undefined}>{t.label}</Link>
        ))}
      </nav>
      {full && <a className="full" href={full} target="_blank" rel="noreferrer">Open full screen ↗</a>}
    </header>
  );
}

export default function Viewer({ current, src, title }: { current: string; src: string; title: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  // /wireframe/#s1-9 → opens the wireframe focused on screen 1.9
  useEffect(() => {
    if (location.hash && frame.current) frame.current.src = src + location.hash;
  }, [src]);
  return (
    <div className="viewer">
      <Bar current={current} full={src} />
      <iframe ref={frame} src={src} title={title} allow="fullscreen" />
    </div>
  );
}
