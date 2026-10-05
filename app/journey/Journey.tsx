'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type Step = { id: string; title: string; text: string; wf?: string; pending?: string; or?: string[] };
type Stage = { name: string; goal: string; steps: Step[] };

// ponytail: journey content lives here; edit this list when the flow changes
const STAGES: Stage[] = [
  {
    name: 'Discover', goal: 'Land on the site and get interested',
    steps: [
      { id: 'popup', title: 'Welcome popup', text: 'Join 9Lab Rewards popup on first visit (not shown again for 7 days). Admin edits the content.', wf: 's1-1' },
      { id: 'home', title: 'Homepage', text: 'Big + small banners auto-swipe, brand video, flexible sections, max 4 products per screen.', wf: 's1-2' },
      { id: 'fab', title: 'Floating buttons', text: 'IG + LINE on every page, plus a Back to top button after scrolling. Mobile and PC.', wf: 's4-1' },
    ],
  },
  {
    name: 'Browse', goal: 'Find the right product',
    steps: [
      { id: 'menu', title: 'Menu or search', text: 'Menu with unlimited categories (skin type / product type), language + currency. Or search with popular keywords.', wf: 's2-1', or: ['Menu', 'Search'] },
      { id: 'list', title: 'Product list', text: 'Filter, sort, load more. Sold-out items show Notify me.', wf: 's2-5' },
    ],
  },
  {
    name: 'Product', goal: 'Decide to buy',
    steps: [
      { id: 'pdp', title: 'Product page', text: 'Photos + video, options, quantity, details accordion, reviews, “You may also like” (max 4).', wf: 's1-3' },
      { id: 'mini', title: 'Added to cart', text: 'Mini cart pops up → Checkout now or View cart.', wf: 's1-4' },
    ],
  },
  {
    name: 'Cart', goal: 'Review the order',
    steps: [
      { id: 'cart', title: 'Cart', text: 'Edit quantity, discount code, add-on deals, order summary. Keep shopping or Go to payment.', wf: 's1-5', pending: 'How long items stay in the cart' },
    ],
  },
  {
    name: 'Checkout', goal: 'Choose delivery, then sign in or continue as guest',
    steps: [
      { id: 'ship', title: 'Shipping method', text: '7-ELEVEN pickup (store picked on the official 7-ELEVEN map) or home delivery by T-Cat / Post, all via ECPay Logistics.', wf: 's1-6', or: ['7-ELEVEN', 'Home delivery'] },
      { id: 'login', title: 'Login check', text: 'Shown after shipping is chosen. Sign in, create account, or continue as guest.', wf: 's1-8', or: ['Member', 'Guest'], pending: 'Auto-create member from guest mobile + SMS OTP' },
    ],
  },
  {
    name: 'Pay & complete', goal: 'Pay safely and get confirmation',
    steps: [
      { id: 'pay', title: 'Info & payment', text: 'Email, e-invoice, purchase notice, news opt-in, terms. Payment through ECPay.', wf: 's1-9', or: ['Card', 'LINE Pay', 'Apple Pay', 'ATM'] },
      { id: 'done', title: 'Order complete', text: 'Pick up within 5 days, add LINE for a coupon, anti-fraud notice, check order.', wf: 's1-10' },
    ],
  },
  {
    name: 'After purchase', goal: 'Come back and buy again',
    steps: [
      { id: 'track', title: 'Track my order', text: 'Live status from ECPay: Ordered → Preparing → Shipping → Arrived → Picked up. Cancel before shipping, return at any 7-ELEVEN.', wf: 's3-6', pending: 'Return fee + refund rules' },
      { id: 'member', title: 'Member area', text: 'Member center, My favorite / Browsing history / Back in stock, My coupon.', wf: 's3-3' },
    ],
  },
];

const LOOPS = [
  { from: 'Back in stock', to: 'Product page', wf: 's3-4' },
  { from: 'My coupon', to: 'Cart', wf: 's3-5' },
  { from: 'Keep shopping', to: 'Homepage', wf: 's1-10' },
];

// open questions for 9Lab; wf = screen it affects
const QUESTIONS = [
  { q: 'ECPay supports 7-ELEVEN pay at pickup (取貨付款, up to NT$20,000), which is popular in Taiwan. Offer it, or keep prepaid only?', wf: 's1-6' },
  { q: 'Also offer FamilyMart, Hi-Life and OK pickup? ECPay supports them with the same flow.', wf: 's1-6' },
  { q: 'ECPay does not offer LINE Pay. Sign a separate LINE Pay contract, or drop it? ECPay can add JKOPAY, TWQR or pay-later (BNPL, orders from NT$3,000) instead.', wf: 's1-9' },
  { q: 'Auto-creating a member from a guest’s mobile needs the shopper’s consent (PDPA). OK to add a consent line at checkout?', wf: 's1-8' },
  { q: 'Parcel not picked up, or ATM not paid in time: when do we cancel, and how is the refund made?', wf: 's3-6' },
  { q: 'Returns cost NT$55 per parcel at 7-ELEVEN. Who pays it, and is the refund to the card or store credit?', wf: 's3-6' },
  { q: 'Sign in with SMS code only, no password? Simpler for shoppers; each SMS has a cost.', wf: 's3-2' },
  { q: 'Let guests use Notify me (email / LINE) and save favorites without signing in?', wf: 's2-6' },
  { q: 'Default site language: 繁體中文? (This review copy is in English.)', wf: 's2-1' },
  { q: 'PC version: scope and timing?', wf: 's4-5' },
  { q: 'How long should items stay in the cart?', wf: 's1-5' },
];

const PATH = STAGES.flatMap((s) => s.steps.map((x) => x.id));

export default function Journey() {
  const [active, setActive] = useState(-1);
  const playing = active >= 0;
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setActive((a) => (a + 1 < PATH.length ? a + 1 : -1)), 1400);
    root.current?.querySelector(`[data-id="${PATH[active]}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    return () => clearTimeout(t);
  }, [active, playing]);

  const at = (id: string) => (playing ? Math.sign(PATH.indexOf(id) - active) : 1); // -1 done, 0 now, 1 later

  return (
    <main className="journey">
      <div className="j-head">
        <div>
          <div className="eyebrow">9LAB · CUSTOMER JOURNEY</div>
          <h1>From first visit to coming back</h1>
          <p>How a shopper moves through the store. Tap any step to open that screen in the wireframe.</p>
        </div>
        <button className="play" onClick={() => setActive(playing ? -1 : 0)}>{playing ? '■ Stop' : '▶ Play journey'}</button>
      </div>
      <div className="legend">
        <span><i className="lg-flow" /> Flow direction</span>
        <span><b className="or">or</b> Shopper chooses one</span>
        <span><b className="pend">Pending decision</b> Needs your answer</span>
      </div>

      <div className="j-track" ref={root} data-playing={playing || undefined}>
        {STAGES.map((st, i) => (
          <section key={st.name} className="stage" style={{ animationDelay: `${i * 90}ms` }}>
            <header><b>{String(i + 1).padStart(2, '0')}</b><h2>{st.name}</h2><p>{st.goal}</p></header>
            {st.steps.map((x) => (
              <Link key={x.id} href={x.wf ? `/wireframe/#${x.wf}` : '#'} data-id={x.id} data-at={at(x.id)} className="step">
                <h3>{x.title}{x.wf && <span className="ref">{x.wf.slice(1).replace('-', '.')}</span>}</h3>
                <p>{x.text}</p>
                {x.or && <div className="ors">{x.or.map((o, k) => <span key={o}>{k > 0 && <b className="or">or</b>}{o}</span>)}</div>}
                {x.pending && <div className="pend-row"><b className="pend">Pending decision</b>{x.pending}</div>}
              </Link>
            ))}
          </section>
        ))}
      </div>

      <section className="questions">
        <h2>Questions for 9Lab</h2>
        <p>Your answers decide the steps marked <b className="pend">Pending decision</b>.</p>
        <ol>
          {QUESTIONS.map((x) => (
            <li key={x.q}><span>{x.q}</span><Link href={`/wireframe/#${x.wf}`} className="ref">{x.wf.slice(1).replace('-', '.')} →</Link></li>
          ))}
        </ol>
      </section>

      <section className="loops">
        <h2>Loops that bring shoppers back</h2>
        <div>
          {LOOPS.map((l) => (
            <Link key={l.from} href={`/wireframe/#${l.wf}`} className="loop"><span>{l.from}</span><i className="loop-arrow" /><span>{l.to}</span></Link>
          ))}
        </div>
      </section>
    </main>
  );
}
