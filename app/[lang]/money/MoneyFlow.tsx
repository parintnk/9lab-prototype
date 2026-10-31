'use client';
import { useEffect, useState } from 'react';
import { useInView } from '../../anim';
import { tr, type Lang } from '../../i18n';
import { ACCOUNTANT, BADGES, EXAMPLE, FLOWS, RULES, type FlowDef } from '../../money-data';

const nt = (n: number) => `NT$${n.toLocaleString('en-US')}`;

// Worked example from the shop's own rules: goods − coupon (+ shipping below the free-shipping line) = total.
function useExample() {
  const goods = EXAMPLE.goods - EXAMPLE.dealOff;
  const shipping = goods >= RULES.freeMin ? 0 : RULES.fee711;
  const total = goods - EXAMPLE.coupon + shipping;
  const net = Math.round(total / (1 + RULES.taxPct / 100));
  return { goods, shipping, total, net, tax: total - net, points: Math.floor((total - shipping) / RULES.pointsPer) };
}

function Waterfall({ lang }: { lang: Lang }) {
  const t = tr(lang); const [ref, seen] = useInView<HTMLDivElement>(); const x = useExample();
  const max = x.goods + x.shipping;
  const bars = [
    { label: 'Goods', v: x.goods, from: 0, kind: 'plus' },
    { label: 'Coupon', v: -EXAMPLE.coupon, from: x.goods - EXAMPLE.coupon, kind: 'minus' },
    { label: 'Shipping (7-ELEVEN)', v: x.shipping, from: x.goods - EXAMPLE.coupon, kind: 'plus' },
    { label: 'Total paid', v: x.total, from: 0, kind: 'total' },
  ];
  return (
    <div className="mf-wf" ref={ref}>
      {bars.map((b, i) => (
        <div key={b.label} className="wf-row">
          <span className="wf-l">{t(b.label)}</span>
          <div className="wf-track"><i className={`wf-bar ${b.kind}`} style={{ left: `${(b.from / max) * 100}%`, width: seen ? `${(Math.abs(b.v) / max) * 100}%` : 0, transitionDelay: `${i * 260}ms` }} /></div>
          <b>{b.v < 0 ? '−' : b.kind === 'plus' && i > 0 ? '+' : ''}{nt(Math.abs(b.v))}</b>
        </div>
      ))}
      <div className="wf-facts">
        <div><b>{nt(x.net)} + {nt(x.tax)}</b><span>{t('goods value + 5 % tax, already inside the total')}</span></div>
        <div><b>{x.points} {t('points')}</b><span>{t('earned: 1 per NT$100 of goods, shipping excluded')}</span></div>
        <div><b>{t('Free over')} {nt(RULES.freeMin)}</b><span>{t('NT$60 pickup / NT$100 home below that; 9Lab can change all of these')}</span></div>
      </div>
    </div>
  );
}

function Flow({ f, lang }: { f: FlowDef; lang: Lang }) {
  const t = tr(lang); const [ref, seen] = useInView<HTMLElement>();
  const [at, setAt] = useState<[number, number] | null>(null); // [track, step] being played
  useEffect(() => {
    if (!at) return;
    const id = setTimeout(() => {
      const [a, b] = at;
      if (b + 1 < f.tracks[a].steps.length) setAt([a, b + 1]);
      else setAt(a + 1 < f.tracks.length ? [a + 1, 0] : null);
    }, 1500);
    return () => clearTimeout(id);
  }, [at, f.tracks]);
  return (
    <section className="mf-sec" id={f.id} ref={ref} data-seen={seen || undefined}>
      <div className="mf-head">
        <div><span className="mf-no">{f.no}</span><h2>{t(f.title)}</h2><p>{t(f.lead)}</p></div>
        <button className="play sm" onClick={() => setAt(at ? null : [0, 0])}>{at ? t('■ Stop') : t('▶ Play')}</button>
      </div>
      {f.tracks.map((tr_, a) => (
        <div key={tr_.name} className="mf-track">
          <h3>{t(tr_.name)}</h3>
          <ol>
            {tr_.steps.map((s, b) => (
              <li key={s.title} className="mf-step" data-badge={s.badge} data-now={at && at[0] === a && at[1] === b ? '' : undefined} data-past={at && (a < at[0] || (a === at[0] && b < at[1])) ? '' : undefined} style={{ animationDelay: `${(a * 3 + b) * 80}ms` }}>
                <span className={`bd ${s.badge}`}>{t(BADGES[s.badge].label)}</span>
                <h4>{t(s.title)}</h4>
                <p>{t(s.text)}</p>
              </li>
            ))}
          </ol>
        </div>
      ))}
      {f.note && <p className="mf-note">{t(f.note)}</p>}
    </section>
  );
}

export default function MoneyFlow({ lang }: { lang: Lang }) {
  const t = tr(lang);
  return (
    <main className="pg mf">
      <div className="j-head">
        <div>
          <div className="eyebrow">{t('9LAB · MONEY & ACCOUNTING')}</div>
          <h1>{t('Where the money goes')}</h1>
          <p>{t('Every step from the shopper\'s total to 9Lab\'s bank, and who does it. Press Play on any section to follow it step by step.')}</p>
        </div>
      </div>
      <div className="pg-legend">
        {(Object.keys(BADGES) as (keyof typeof BADGES)[]).map((k) => (<span key={k}><i className={`bd ${k}`}>{t(BADGES[k].label)}</i> {t(BADGES[k].hint)}</span>))}
      </div>
      <nav className="mf-jump" aria-label={t('Sections')}>
        <a href="#pays">01 {t('What the shopper pays')}</a>
        {FLOWS.map((f) => (<a key={f.id} href={`#${f.id}`}>{f.no} {t(f.title)}</a>))}
        <a href="#accountant">07 {t('For the accountant')}</a>
      </nav>

      <section className="mf-sec" id="pays" data-seen>
        <div className="mf-head"><div><span className="mf-no">01</span><h2>{t('What the shopper pays')}</h2><p>{t('One example, worked out with the shop\'s own rules. Prices, stock and totals are always recalculated on the server, so the browser cannot change them.')}</p></div></div>
        <Waterfall lang={lang} />
      </section>

      {FLOWS.map((f) => (<Flow key={f.id} f={f} lang={lang} />))}

      <section className="mf-sec" id="accountant" data-seen>
        <div className="mf-head"><div><span className="mf-no">07</span><h2>{t('For the accountant')}</h2><p>{t('Questions only 9Lab\'s accountant can answer. Until then the shop uses the simple choice described next to each one.')}</p></div></div>
        <ul className="mf-acct">
          {ACCOUNTANT.map((a, i) => (<li key={a.q} style={{ animationDelay: `${i * 90}ms` }}><b>{t(a.q)}</b><span>{t(a.why)}</span></li>))}
        </ul>
      </section>
    </main>
  );
}
