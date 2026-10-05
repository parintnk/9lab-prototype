'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ADDED, BRIEF, FEATURES, QUESTIONS, SERVICES, STATUS, type Status } from '../data';

const ORDER: Status[] = ['done', 'changed', 'added', 'input', 'gap'];
const ALL = BRIEF.flatMap((s) => s.items);
const ref = (wf: string) => wf.slice(1).replace('-', '.');

export default function Checklist() {
  const [only, setOnly] = useState<Status | null>(null);
  const count = (st: Status) => ALL.filter((i) => i.status === st).length;

  return (
    <main className="ck">
      <header className="ck-head">
        <div className="eyebrow">9LAB · BRIEF CHECKLIST</div>
        <h1>What the brief asked, and where it stands</h1>
        <p>Every request in <i>9Lab Website.pdf</i>, checked page by page against the wireframe screen that covers it. Then what we added, what we need from you, the feature list, and the services we recommend.</p>
        <nav className="ck-toc">
          <a href="#checklist">Checklist</a><a href="#added">Added by us</a><a href="#questions">Questions</a><a href="#features">Features</a><a href="#services">Recommended services</a>
        </nav>
      </header>

      <section id="checklist">
        <div className="ck-tiles">
          {ORDER.filter((st) => count(st) > 0).map((st) => (
            <button key={st} className="ck-tile" data-st={st} aria-pressed={only === st} onClick={() => setOnly(only === st ? null : st)}>
              <b>{count(st)}</b><span className="st" data-st={st}>{STATUS[st].label}</span><small>{STATUS[st].hint}</small>
            </button>
          ))}
        </div>
        <p className="ck-filter">{only ? <>Showing <b>{STATUS[only].label}</b> only · <button onClick={() => setOnly(null)}>Show all {ALL.length}</button></> : <>Showing all {ALL.length} requests · tap a box above to filter</>}</p>

        {BRIEF.map((sec) => {
          const items = sec.items.filter((i) => !only || i.status === only);
          if (!items.length) return null;
          return (
            <div key={sec.name} className="ck-sec">
              <h2>{sec.name}</h2>
              <ul>
                {items.map((i) => (
                  <li key={i.req}>
                    <span className="st" data-st={i.status}>{STATUS[i.status].label}</span>
                    <div>
                      <p className="req">{i.req}</p>
                      {i.note && <p className="note">{i.note}</p>}
                    </div>
                    <div className="meta">
                      {i.p && <span>PDF p.{i.p}</span>}
                      {i.wf && <Link href={`/wireframe/#${i.wf}`}>WF {ref(i.wf)} →</Link>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      <section id="added" className="ck-block">
        <h2>Added by us</h2>
        <p className="lead">Not in the brief — we recommend these for a smoother shop.</p>
        <div className="ck-grid">
          {ADDED.map((a) => (
            <div key={a.what} className="ck-card">
              <h3>{a.what}</h3><p>{a.why}</p>
              {a.wf && <Link href={`/wireframe/#${a.wf}`}>WF {ref(a.wf)} →</Link>}
            </div>
          ))}
        </div>
      </section>

      <section id="questions" className="ck-block">
        <h2>Questions for 9Lab</h2>
        <p className="lead">Your answers close every <span className="st" data-st="input">Needs your input</span> item.</p>
        <ol className="ck-q">
          {QUESTIONS.map((x) => (
            <li key={x.q}><span>{x.q}</span> <Link href={`/wireframe/#${x.wf}`}>WF {ref(x.wf)} →</Link></li>
          ))}
        </ol>
      </section>

      <section id="features" className="ck-block">
        <h2>Features of the store</h2>
        <p className="lead">Everything the wireframe and prototype cover, by area.</p>
        <div className="ck-grid">
          {FEATURES.map((f) => (
            <div key={f.group} className="ck-card">
              <h3>{f.group}</h3>
              <ul className="ck-feat">{f.items.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      <section id="services" className="ck-block">
        <h2>Recommended services</h2>
        <p className="lead">What we suggest for each system, why, the details that matter, and where the facts come from.</p>
        <div className="ck-svc">
          {SERVICES.map((s) => (
            <article key={s.area} className="ck-card svc">
              <div className="svc-top"><span className="area">{s.area}</span><span className="st" data-st={s.status === 'decide' ? 'input' : 'done'}>{s.status === 'decide' ? 'To decide' : 'Recommended'}</span></div>
              <h3>{s.pick}</h3>
              <p>{s.why}</p>
              <ul>{s.details.map((d) => <li key={d}>{d}</li>)}</ul>
              {s.decide && <p className="decide"><b>Decision:</b> {s.decide}</p>}
              <p className="src">Sources: {s.sources.map((x, k) => <span key={x.url}>{k > 0 && ' · '}<a href={x.url} target="_blank" rel="noreferrer">{x.label} ↗</a></span>)}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
