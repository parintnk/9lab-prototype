// Progress page content (English source; translated through i18n/*.json). Figures were checked against the shop repo on 2026-10-31.
export type Layer = { id: string; name: string; text: string; done: string[]; waiting: string[] };

export const NUMBERS: { value: number; label: string }[] = [
  { value: 17, label: 'database migrations' },
  { value: 95, label: 'automatic unit tests' },
  { value: 19, label: 'click-through test suites' },
  { value: 3, label: 'shop languages (EN · 繁中 · 简中)' },
  { value: 12, label: 'admin sections' },
];

// Shares are the count of finished items vs the items still waiting on someone (done + waiting).
export const LAYERS: Layer[] = [
  { id: 'store', name: 'Storefront', text: 'What shoppers see, built to match the prototype screen by screen.',
    done: ['Home with admin-edited blocks, slides, announcement bar and welcome popup', 'Product list and search with filter, sort and skin-type filter', 'Product page: gallery, options, accordion, reviews', 'Menu drawer, search overlay, mini cart, member menu, floating "+"', 'Footer pages (About, Customer info, Shipping, FAQ)'],
    waiting: ['Real product photos', 'Real Terms and Privacy text'] },
  { id: 'member', name: 'Member & sign-in', text: 'One sign-in for everyone: a code sent by SMS. Guest cart and favorites move into the account at sign-in.',
    done: ['Sign in / Sign up with SMS code (rate limited)', 'Profile, birthday, gender, default store', 'My favorite, Browsing history, Back in stock', 'My coupon (claim, use) and points', 'Track my order'],
    waiting: ['SMS provider (Mitake or Every8d): production sends nothing yet'] },
  { id: 'checkout', name: 'Cart & checkout', text: 'Prices, stock and totals are always worked out on the server, never trusted from the browser.',
    done: ['Cart with Move to favorites and Undo', 'Discount codes and add-on deals', 'Free-shipping bar and shipping fee rules', 'Two checkout screens: shipping, then info and payment', 'City and district dropdowns from the official list of 368 townships', 'Order complete screen'],
    waiting: ['7-ELEVEN store picker decision'] },
  { id: 'pay', name: 'Payment', text: 'NewebPay gateway; card details are typed on NewebPay, never on our site.',
    done: ['Credit card, LINE Pay, Apple Pay (Safari), ATM transfer', 'Signed server-to-server notice marks the order paid (signature, merchant, amount, replay checks)', 'Stock taken and points given only when money arrives', 'Tests against the manual\'s own examples'],
    waiting: ['9Lab\'s real NewebPay merchant keys and live URLs'] },
  { id: 'orders', name: 'Orders & after-sales', text: 'From paid to picked up, and what happens when a customer changes their mind.',
    done: ['Order status line: paid, preparing, shipping, arrived, picked up', 'Customer cancels before shipping (stock, points, coupon put back)', 'Return request, approval, parcel received, refund flag', 'Notify me when sold-out items return', 'Parcel API for 7-ELEVEN built (switched off): store picker, shipment, label printing, automatic status', 'Print parcel labels and packing slips for several orders at once; each order has a printable slip for the box', 'E-invoice number and a View invoice link on the shopper's order pages', 'The shopper's default pickup store is saved and can be changed from the profile (unsaved edits are kept)'],
    waiting: ['NewebPay test merchant with logistics and a prepaid balance, to switch the parcel API on', 'Emails / SMS to customers'] },
  { id: 'reviews', name: 'Reviews & search', text: 'Social proof and finding things fast.',
    done: ['Star ratings on cards and product page', 'Write, edit and delete your own review with photos', 'Admin hides reviews', 'Search suggestions, popular and recent searches'],
    waiting: [] },
  { id: 'admin', name: 'Admin panel', text: 'Everything 9Lab edits without a developer.',
    done: ['Dashboard with charts and stats', 'Products, options, images, sections, skin types', 'Categories (drag to reorder)', 'Orders, returns, refunds, notes, tracking numbers', 'Coupons, add-on deals, reviews, Notify me', 'Home blocks, pages, menus, settings'],
    waiting: ['Bento layout for the Page editor and home block editor'] },
  { id: 'lang', name: 'Languages', text: 'English, Traditional Chinese and Simplified Chinese across the shop (no URL prefix; a cookie remembers the choice).',
    done: ['All shop text translated', 'Simplified Chinese generated from Traditional', 'A test that fails when any text is missing a translation'],
    waiting: ['A native speaker to review the Traditional Chinese wording'] },
  { id: 'ops', name: 'Going live', text: 'The parts that make it safe to open the doors.',
    done: ['Docker setup, HTTPS proxy and a backup script', 'Production build verified', 'E-invoice module written and tested (switched off)', 'A sandbox that plays NewebPay and ezPay: sample store map, label and invoice, and a console to move parcel statuses', 'Notes and checklist for launch'],
    waiting: ['Domain and DNS', 'ezPay e-invoice account', 'Create the real admin account'] },
];

export const SYSTEM = {
  nodes: [
    { id: 'shopper', label: 'Shopper', sub: 'phone browser', x: 60, y: 130, state: 'live' },
    { id: 'shop', label: 'The shop', sub: 'Next.js', x: 300, y: 130, state: 'live' },
    { id: 'db', label: 'Database', sub: 'PostgreSQL', x: 540, y: 40, state: 'live' },
    { id: 'files', label: 'Photos', sub: 'server disk', x: 540, y: 130, state: 'live' },
    { id: 'pay', label: 'NewebPay', sub: 'payments', x: 540, y: 220, state: 'keys' },
    { id: 'sms', label: 'SMS', sub: 'sign-in codes', x: 780, y: 60, state: 'wait' },
    { id: 'inv', label: 'ezPay invoice', sub: 'tax invoices', x: 780, y: 160, state: 'wait' },
    { id: 'ship', label: 'Logistics', sub: '7-ELEVEN parcels', x: 780, y: 260, state: 'wait' },
  ],
  links: [['shopper', 'shop'], ['shop', 'db'], ['shop', 'files'], ['shop', 'pay'], ['shop', 'sms'], ['shop', 'inv'], ['shop', 'ship']],
} as const;

export const TIMELINE: { when: string; title: string; text: string }[] = [
  { when: '5 Oct', title: 'Design reviewed', text: 'Journey, wireframe and clickable prototype agreed with 9Lab.' },
  { when: 'Early build', title: 'Shop foundation', text: 'Next.js, database, SMS sign-in, products, cart, checkout, NewebPay payment.' },
  { when: 'Admin', title: 'Back office', text: 'Dashboard, products, orders, coupons, content, pages, settings.' },
  { when: 'Customer', title: 'Customer features', text: 'Cancel, returns, reviews, browsing history, Notify me, add-on deals.' },
  { when: 'Languages', title: 'Three languages', text: 'English, Traditional and Simplified Chinese everywhere.' },
  { when: 'Fidelity', title: 'Look like the prototype', text: 'Every main screen and overlay compared with the prototype and aligned.' },
  { when: '31 Oct', title: 'Skin types + invoices', text: 'Skin-type filter; e-invoice module ready but switched off.' },
];

export const WAITING: { who: string; what: string }[] = [
  { who: '9Lab', what: 'NewebPay live merchant keys' },
  { who: '9Lab', what: 'ezPay e-invoice account, track numbers, keys' },
  { who: '9Lab', what: 'Choose 7-ELEVEN parcel type (C2C or B2C)' },
  { who: '9Lab', what: 'Real product photos and descriptions' },
  { who: '9Lab', what: 'Terms of Service and Privacy Policy text' },
  { who: '9Lab', what: 'Tag each product with skin types (only if they sort that way)' },
  { who: 'Accountant', what: 'How to split tax when coupons, points and shipping are involved' },
  { who: 'Us', what: 'SMS provider account (Mitake or Every8d)' },
  { who: 'Us', what: 'Domain, DNS and the live server' },
  { who: 'Native speaker', what: 'Review of the Traditional Chinese wording' },
];
