'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { LOOPS, QUESTIONS, STAGES } from '../../data';
import { tr, type Lang } from '../../i18n';

const PATH = STAGES.flatMap((s) => s.steps.map((x) => x.id));
const ref = (wf: string) => wf.slice(1).replace('-', '.');

export default function Journey({ lang }: { lang: Lang }) {
  const t = tr(lang);
  const wf = (id: string) => `/${lang}/wireframe/#${id}`;
  const [active, setActive] = useState(-1);
  const playing = active >= 0;
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => setActive((a) => (a + 1 < PATH.length ? a + 1 : -1)), 1400);
    root.current?.querySelector(`[data-id="${PATH[active]}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    return () => clearTimeout(timer);
  }, [active, playing]);

  const at = (id: string) => (playing ? Math.sign(PATH.indexOf(id) - active) : 1); // -1 done, 0 now, 1 later

  return (
    <main className="journey">
      <div className="j-head">
        <div>
          <div className="eyebrow">{t('9LAB · CUSTOMER JOURNEY')}</div>
          <h1>{t('From first visit to coming back')}</h1>
          <p>{t('How a shopper moves through the store. Tap any step to open that screen in the wireframe.')}</p>
        </div>
        <button className="play" onClick={() => setActive(playing ? -1 : 0)}>{playing ? t('■ Stop') : t('▶ Play journey')}</button>
      </div>
      <div className="legend">
        <span><i className="lg-flow" /> {t('Flow direction')}</span>
        <span><b className="or">{t('or')}</b> {t('Shopper chooses one')}</span>
      </div>

      <div className="j-track" ref={root} data-playing={playing || undefined}>
        {STAGES.map((st, i) => (
          <section key={st.name} className="stage" style={{ animationDelay: `${i * 90}ms` }}>
            <header><b>{String(i + 1).padStart(2, '0')}</b><h2>{t(st.name)}</h2><p>{t(st.goal)}</p></header>
            {st.steps.map((x) => (
              <Link key={x.id} href={x.wf ? wf(x.wf) : '#'} data-id={x.id} data-at={at(x.id)} className="step">
                <h3>{t(x.title)}{x.wf && <span className="ref">{ref(x.wf)}</span>}</h3>
                <p>{t(x.text)}</p>
                {x.or && <div className="ors">{x.or.map((o, k) => <span key={o}>{k > 0 && <b className="or">{t('or')}</b>}{t(o)}</span>)}</div>}
              </Link>
            ))}
          </section>
        ))}
      </div>

      <section className="questions">
        <h2>{t('Questions for 9Lab')}</h2>
        <p>{t('Your answers help us finish the rest of the design.')}</p>
        <ol>
          {QUESTIONS.map((x) => (
            <li key={x.q}><span>{t(x.q)}</span><Link href={wf(x.wf)} className="ref">{ref(x.wf)} →</Link></li>
          ))}
        </ol>
      </section>

      <section className="loops">
        <h2>{t('Loops that bring shoppers back')}</h2>
        <div>
          {LOOPS.map((l) => (
            <Link key={l.from} href={wf(l.wf)} className="loop"><span>{t(l.from)}</span><i className="loop-arrow" /><span>{t(l.to)}</span></Link>
          ))}
        </div>
      </section>
    </main>
  );
}
