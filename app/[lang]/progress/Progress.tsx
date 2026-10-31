'use client';
import { useEffect, useState } from 'react';
import { Count, Ring, useInView } from '../../anim';
import { tr, type Lang } from '../../i18n';
import { LAYERS, NUMBERS, SYSTEM, TIMELINE, WAITING } from '../../progress-data';

const STATE_LABEL = { live: 'Working', keys: 'Built, test keys only', wait: 'Waiting for an account' } as const;

export default function Progress({ lang }: { lang: Lang }) {
  const t = tr(lang);
  const [hero, heroSeen] = useInView<HTMLDivElement>();
  const [grid, gridSeen] = useInView<HTMLDivElement>();
  const [map, mapSeen] = useInView<HTMLDivElement>();
  const [open, setOpen] = useState<string | null>(null);
  const [playing, setPlaying] = useState(-1);

  useEffect(() => {
    if (playing < 0) return;
    setOpen(LAYERS[playing].id);
    const id = setTimeout(() => setPlaying((p) => (p + 1 < LAYERS.length ? p + 1 : -1)), 1500);
    return () => clearTimeout(id);
  }, [playing]);

  const byId = Object.fromEntries(SYSTEM.nodes.map((n) => [n.id, n]));
  return (
    <main className="pg">
      <div className="j-head">
        <div>
          <div className="eyebrow">{t('9LAB · BUILD PROGRESS')}</div>
          <h1>{t('What has been built so far')}</h1>
          <p>{t('The real shop is running behind this design. This page shows what is finished, what is waiting for an account or a decision, and how the pieces connect.')}</p>
        </div>
        <button className="play" onClick={() => setPlaying(playing >= 0 ? -1 : 0)}>{playing >= 0 ? t('■ Stop') : t('▶ Play tour')}</button>
      </div>

      <div className="pg-nums" ref={hero}>
        {NUMBERS.map((n) => (
          <div key={n.label} className="pg-num"><b><Count to={n.value} run={heroSeen} /></b><span>{t(n.label)}</span></div>
        ))}
      </div>

      <h2 className="pg-h">{t('Everything, by area')}</h2>
      <div className="pg-legend"><span><i className="dot done" /> {t('Done')}</span><span><i className="dot wait" /> {t('Waiting for someone')}</span><span>{t('Tap a card to see the list')}</span></div>
      <div className="pg-layers" ref={grid}>
        {LAYERS.map((l, i) => {
          const share = l.done.length / (l.done.length + l.waiting.length);
          const isOpen = open === l.id;
          return (
            <button key={l.id} className="layer" data-open={isOpen || undefined} data-now={playing === i || undefined} style={{ animationDelay: `${i * 70}ms` }} onClick={() => setOpen(isOpen ? null : l.id)} aria-expanded={isOpen}>
              <div className="layer-top">
                <Ring share={share} run={gridSeen} />
                <div><h3>{t(l.name)}</h3><span className="layer-count">{l.done.length} {t('done')}{l.waiting.length > 0 && <> · <b>{l.waiting.length} {t('waiting')}</b></>}</span></div>
              </div>
              <p>{t(l.text)}</p>
              {isOpen && (
                <div className="layer-list">
                  <ul>{l.done.map((x) => <li key={x} className="ok">{t(x)}</li>)}</ul>
                  {l.waiting.length > 0 && <ul>{l.waiting.map((x) => <li key={x} className="wt">{t(x)}</li>)}</ul>}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <h2 className="pg-h">{t('How the pieces connect')}</h2>
      <div className="pg-legend">
        <span><i className="dot done" /> {t(STATE_LABEL.live)}</span><span><i className="dot key" /> {t(STATE_LABEL.keys)}</span><span><i className="dot wait" /> {t(STATE_LABEL.wait)}</span>
      </div>
      <div className="pg-map" ref={map}>
        <svg viewBox="-16 0 932 310" role="img" aria-label={t('System map')}>
          {SYSTEM.links.map(([a, b], i) => {
            const A = byId[a], B = byId[b];
            const d = `M${A.x + 70} ${A.y} C ${A.x + 130} ${A.y}, ${B.x - 130} ${B.y}, ${B.x - 70} ${B.y}`;
            return (
              <g key={a + b}>
                <path d={d} className={`link ${B.state}`} />
                {mapSeen && B.state !== 'wait' && <circle r="4" className={`packet ${B.state}`}><animateMotion dur={`${2.4 + i * 0.3}s`} repeatCount="indefinite" path={d} /></circle>}
              </g>
            );
          })}
          {SYSTEM.nodes.map((n) => (
            <g key={n.id} transform={`translate(${n.x - 70} ${n.y - 26})`} className={`node ${n.state}`}>
              <rect width="140" height="52" rx="10" />
              <text x="70" y="22" textAnchor="middle" className="n-t">{t(n.label)}</text>
              <text x="70" y="39" textAnchor="middle" className="n-s">{t(n.sub)}</text>
            </g>
          ))}
        </svg>
      </div>

      <h2 className="pg-h">{t('How we got here')}</h2>
      <ol className="pg-time">
        {TIMELINE.map((x, i) => (
          <li key={x.title} style={{ animationDelay: `${i * 110}ms` }}><i /><b>{t(x.when)}</b><h3>{t(x.title)}</h3><p>{t(x.text)}</p></li>
        ))}
      </ol>

      <h2 className="pg-h">{t('Waiting on')}</h2>
      <div className="pg-wait">
        {WAITING.map((w) => (<div key={w.what}><span className="who">{t(w.who)}</span><span>{t(w.what)}</span></div>))}
      </div>
    </main>
  );
}
