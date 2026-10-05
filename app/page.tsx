import Link from 'next/link';

export default function Home() {
  return (
    <main className="home">
      <div className="eyebrow">9LAB · TAIWAN · MOBILE STORE</div>
      <h1>9Lab Mobile Store</h1>
      <p>Review the website design. Start with the customer journey, then see every page in the wireframe and click through the prototype.</p>
      <div className="cards">
        <Link href="/journey/" className="card">
          <h2>Customer journey</h2>
          <p>The whole shopping flow on one page, from first visit to coming back. Press Play to watch the path.</p>
          <span>See the journey →</span>
        </Link>
        <Link href="/wireframe/" className="card">
          <h2>Wireframe</h2>
          <p>All pages in flow order, with notes. Zoom with the − / + buttons, Ctrl/⌘ + scroll, or press 0 to fit.</p>
          <span>View wireframe →</span>
        </Link>
        <Link href="/prototype/" className="card">
          <h2>Prototype</h2>
          <p>Tap through the store inside a phone frame, or jump to any page from the list.</p>
          <span>Open prototype →</span>
        </Link>
      </div>
    </main>
  );
}
