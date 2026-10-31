import Link from 'next/link';
import { Bar } from '../Viewer';
import { tr, type Lang } from '../i18n';

const CARDS = [
  { page: 'journey/', title: 'Customer journey', text: 'The whole shopping flow on one page, from first visit to coming back. Press Play to watch the path.', cta: 'See the journey →' },
  { page: 'checklist/', title: 'Brief checklist', text: 'Every request in your brief and where it stands, what we added, questions for you, and the services we recommend.', cta: 'Open the checklist →' },
  { page: 'progress/', title: 'Build progress', text: 'Everything built so far in the real shop, what is waiting for an account or a decision, and how the pieces connect.', cta: 'See the progress →' },
  { page: 'money/', title: 'Money flow', text: 'Where the money goes: totals, payment, invoices, refunds, shipping fees and what reaches the bank. Press Play to follow each flow.', cta: 'Follow the money →' },
  { page: 'wireframe/', title: 'Wireframe', text: 'All pages in flow order, with notes. Zoom with the − / + buttons, Ctrl/⌘ + scroll, or press 0 to fit.', cta: 'View wireframe →' },
  { page: 'prototype/', title: 'Prototype', text: 'Tap through the store inside a phone frame, or jump to any page from the list.', cta: 'Open prototype →' },
];

export default async function Home({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const t = tr(lang);
  return (
    <>
      <Bar lang={lang} page="" />
      <main className="home">
        <div className="eyebrow">{t('9LAB · TAIWAN · MOBILE STORE')}</div>
        <h1>{t('9Lab Mobile Store')}</h1>
        <p>{t('Review the website design. Start with the customer journey, then see every page in the wireframe and click through the prototype.')}</p>
        <div className="cards">
          {CARDS.map((c) => (
            <Link key={c.page} href={`/${lang}/${c.page}`} className="card">
              <h2>{t(c.title)}</h2>
              <p>{t(c.text)}</p>
              <span>{t(c.cta)}</span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
