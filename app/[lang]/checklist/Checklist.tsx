'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ADDED, BRIEF, FEATURES, QUESTIONS, SERVICES, STATUS, type Status } from '../../data';
import { tr, type Lang } from '../../i18n';

const ORDER: Status[] = ['done', 'changed', 'added', 'input', 'gap'];
const ALL = BRIEF.flatMap((s) => s.items);
const ref = (wf: string) => wf.slice(1).replace('-', '.');

export default function Checklist({ lang }: { lang: Lang }) {
  const t = tr(lang);
  const wf = (id: string) => `/${lang}/wireframe/#${id}`;
  const [only, setOnly] = useState<Status | null>(null);
  const count = (st: Status) => ALL.filter((i) => i.status === st).length;

  return (
    <main className="ck">
      <header className="ck-head">
        <div className="eyebrow">{t('9LAB · BRIEF CHECKLIST')}</div>
        <h1>{t('What the brief asked, and where it stands')}</h1>
        <p>{t('Every request in 9Lab Website.pdf, checked page by page against the wireframe screen that covers it. Then what we added, what we need from you, the feature list, and the services we recommend.')}</p>
        <nav className="ck-toc">
          <a href="#checklist">{t('Checklist')}</a><a href="#added">{t('Added by us')}</a><a href="#questions">{t('Questions')}</a><a href="#features">{t('Features')}</a><a href="#services">{t('Recommended services')}</a>
        </nav>
      </header>

      <section id="checklist">
        <div className="ck-tiles">
          {ORDER.filter((st) => count(st) > 0).map((st) => (
            <button key={st} className="ck-tile" data-st={st} aria-pressed={only === st} onClick={() => setOnly(only === st ? null : st)}>
              <b>{count(st)}</b><span className="st" data-st={st}>{t(STATUS[st].label)}</span><small>{t(STATUS[st].hint)}</small>
            </button>
          ))}
        </div>
        <p className="ck-filter">{only ? <><b>{t(STATUS[only].label)}</b> · <button onClick={() => setOnly(null)}>{t('Show all')} ({ALL.length})</button></> : <>{t('All requests')}: {ALL.length} · {t('tap a box above to filter')}</>}</p>

        {BRIEF.map((sec) => {
          const items = sec.items.filter((i) => !only || i.status === only);
          if (!items.length) return null;
          return (
            <div key={sec.name} className="ck-sec">
              <h2>{t(sec.name)}</h2>
              <ul>
                {items.map((i) => (
                  <li key={i.req}>
                    <span className="st" data-st={i.status}>{t(STATUS[i.status].label)}</span>
                    <div>
                      <p className="req">{t(i.req)}</p>
                      {i.note && <p className="note">{t(i.note)}</p>}
                    </div>
                    <div className="meta">
                      {i.p && <span>{t('PDF p.{n}').replace('{n}', i.p)}</span>}
                      {i.wf && <Link href={wf(i.wf)}>WF {ref(i.wf)} →</Link>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      <section id="added" className="ck-block">
        <h2>{t('Added by us')}</h2>
        <p className="lead">{t('Not in the brief — we recommend these for a smoother shop.')}</p>
        <div className="ck-grid">
          {ADDED.map((a) => (
            <div key={a.what} className="ck-card">
              <h3>{t(a.what)}</h3><p>{t(a.why)}</p>
              {a.wf && <Link href={wf(a.wf)}>WF {ref(a.wf)} →</Link>}
            </div>
          ))}
        </div>
      </section>

      <section id="questions" className="ck-block">
        <h2>{t('Questions for 9Lab')}</h2>
        <p className="lead">{t('Your answers close every item marked')} <span className="st" data-st="input">{t('Needs your input')}</span></p>
        <ol className="ck-q">
          {QUESTIONS.map((x) => (
            <li key={x.q}><span>{t(x.q)}</span> <Link href={wf(x.wf)}>WF {ref(x.wf)} →</Link></li>
          ))}
        </ol>
      </section>

      <section id="features" className="ck-block">
        <h2>{t('Features of the store')}</h2>
        <p className="lead">{t('Everything the wireframe and prototype cover, by area.')}</p>
        <div className="ck-grid">
          {FEATURES.map((f) => (
            <div key={f.group} className="ck-card">
              <h3>{t(f.group)}</h3>
              <ul className="ck-feat">{f.items.map((x) => <li key={x}>{t(x)}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      <section id="services" className="ck-block">
        <h2>{t('Recommended services')}</h2>
        <p className="lead">{t('What we suggest for each system, why, the details that matter, and where the facts come from.')}</p>
        <div className="ck-svc">
          {SERVICES.map((s) => (
            <article key={s.area} className="ck-card svc">
              <div className="svc-top"><span className="area">{t(s.area)}</span><span className="st" data-st={s.status === 'decide' ? 'input' : 'done'}>{s.status === 'decide' ? t('To decide') : t('Recommended')}</span></div>
              <h3>{t(s.pick)}</h3>
              <p>{t(s.why)}</p>
              <ul>{s.details.map((d) => <li key={d}>{t(d)}</li>)}</ul>
              {s.decide && <p className="decide"><b>{t('Decision:')}</b> {t(s.decide)}</p>}
              <p className="src">{t('Sources:')} {s.sources.map((x, k) => <span key={x.url}>{k > 0 && ' · '}<a href={x.url} target="_blank" rel="noreferrer">{t(x.label)} ↗</a></span>)}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
