// Shared content for the Journey and Checklist pages.
// wf = wireframe screen id (s1-9 → screen 1.9), p = page in the client brief PDF.

export type Status = 'done' | 'changed' | 'added' | 'input' | 'gap';

export const STATUS: Record<Status, { label: string; hint: string }> = {
  done: { label: 'Done', hint: 'In the wireframe as the brief asks' },
  changed: { label: 'Adjusted', hint: 'Done, but we changed how it works — please confirm' },
  added: { label: 'Added by us', hint: 'Not in the brief, we recommend it' },
  input: { label: 'Needs your input', hint: 'Designed, but needs a decision from 9Lab' },
  gap: { label: 'Not yet in WF', hint: 'Asked in the brief, still to be drawn' },
};

export type Item = { req: string; p?: string; status: Status; wf?: string; note?: string };
export type Section = { name: string; items: Item[] };

export const BRIEF: Section[] = [
  {
    name: 'Homepage',
    items: [
      { req: 'Pop-up info when opening the website, content can be changed any time', p: '1', status: 'done', wf: 's1-1', note: 'Shown on first visit, not again for 7 days. Admin edits title, text and button.' },
      { req: 'Big and small banners, auto-swipe, unlimited number', p: '2', status: 'done', wf: 's1-2', note: 'Admin adds any number of banners. Big banner auto-swipes every 5 s; each banner links to a campaign or category.' },
      { req: 'Small banner content can be updated any time', p: '2', status: 'done', wf: 's1-2' },
      { req: 'Brand videos on the homepage', p: '2', status: 'done', wf: 's1-2', note: 'Plays inline, muted by default.' },
      { req: '“More info” section (corporate purchase, wedding gift, store) — red box in your reference', p: '2', status: 'gap', wf: 's1-2', note: 'Not drawn on the homepage yet. We will add it as a 3-tile section.' },
      { req: 'Multiple sections, updated from the backend, flexible size and layout', p: '2', status: 'done', wf: 's1-2', note: 'Admin can add and reorder sections. Truly free-form layouts need a page builder in the backend — see “Store platform” below.' },
      { req: 'Maximum 4 products in one screen', p: '2', status: 'done', wf: 's1-2', note: '2 columns × 2 rows on mobile.' },
      { req: 'Header icons: main menu, members, cart, search; social media', p: '3', status: 'done', wf: 's1-2' },
    ],
  },
  {
    name: 'Main menu',
    items: [
      { req: 'Menu is about ¾ of the screen wide, homepage still visible', p: '4', status: 'done', wf: 's2-1', note: '292 px of 390 px.' },
      { req: 'Hierarchical categories, unlimited sub-categories (skin type, product type…)', p: '5', status: 'done', wf: 's2-2' },
      { req: 'About us and Customer info with their own sub-pages', p: '6', status: 'done', wf: 's2-1', note: 'Menu structure is designed (brand story, store info, privacy; shopping guide, customer message, member rights, contact). The content pages themselves are not designed yet.' },
      { req: 'Language setting', p: '6', status: 'done', wf: 's2-1', note: '繁體中文 / English.' },
      { req: 'Currency setting', p: '6', status: 'done', wf: 's2-1', note: 'A row showing “TWD (NT$)”, like your reference. Becomes a selector if a second currency is added.' },
    ],
  },
  {
    name: 'Members',
    items: [
      { req: 'Members menu: Track my order, Member center, My favorite, My coupon, Sign in / Sign up', p: '7', status: 'done', wf: 's3-1' },
      { req: 'Admin can add more options to the Members menu', p: '7', status: 'done', wf: 's3-1', note: 'Add, reorder or hide items.' },
      { req: 'How long can items stay in the cart?', p: '7', status: 'input', wf: 's1-5' },
      { req: 'Track order: order date, order number, payment method, amount, products, status line', p: '8', status: 'done', wf: 's3-6', note: '5 steps updated automatically by ECPay Logistics: Ordered → Preparing → Shipping → Arrived at store → Picked up.' },
      { req: 'Cancel order (shown in your reference)', p: '8', status: 'done', wf: 's3-6', note: 'Only before the order ships.' },
      { req: 'Member center: mobile, name, birthday, gender, email, agree to terms', p: '9', status: 'done', wf: 's3-3', note: 'Mobile cannot be edited (used to verify identity). Your reference splits last name / first name and adds Membership Terms — we will match that.' },
      { req: 'Member center: address (country, city, district, street)', p: '9', status: 'gap', wf: 's3-3', note: 'The profile has a default pickup store but no address fields yet. We will add them.' },
      { req: 'My favorite, Browsing history, Back in stock tabs; heart on product page', p: '10', status: 'done', wf: 's3-4' },
      { req: 'My coupon: Unclaimed / Claimed / History, enter a coupon code', p: '11', status: 'done', wf: 's3-5' },
      { req: 'Sign up with mobile phone or LINE', p: '12', status: 'done', wf: 's3-2' },
      { req: 'Shop and pay without being a member', p: '12, 23', status: 'done', wf: 's1-8' },
      { req: 'Guests added as members automatically (by mobile number)', p: '12, 23', status: 'input', wf: 's1-8', note: 'Designed (banner on order complete). Needs the shopper’s consent under Taiwan’s PDPA.' },
      { req: 'Where do SMS verification and password setup go?', p: '12', status: 'input', wf: 's3-2', note: 'We recommend SMS code only, no password.' },
      { req: 'Anti-fraud information', p: '12, 22', status: 'done', wf: 's1-10', note: 'On sign in, order complete and in the footer (165 hotline).' },
    ],
  },
  {
    name: 'Floating buttons',
    items: [
      { req: 'Instagram and LINE, no Facebook', p: '13', status: 'done', wf: 's4-1' },
      { req: 'Back to top', p: '13', status: 'changed', wf: 's4-1', note: 'Its own button that appears after scrolling, so it is one tap instead of two.' },
      { req: 'Chat bubble', p: '13', status: 'changed', wf: 's4-1', note: 'Removed because it opened the same LINE OA chat as the LINE button. Your menu (p.6) has a “customer message” page — if the bubble should open that form, we will add it back.' },
      { req: 'Same on PC and mobile', p: '13', status: 'input', wf: 's4-5', note: 'Mobile is designed. The PC layout is reserved but not designed yet.' },
    ],
  },
  {
    name: 'Product page',
    items: [
      { req: 'Product photos and video, name, price', p: '14', status: 'done', wf: 's1-3' },
      { req: 'Quantity, add to cart, description, ingredients; admin can add more sections', p: '14', status: 'done', wf: 's4-2' },
      { req: 'Customer reviews', p: '14', status: 'done', wf: 's1-3', note: 'Only buyers can review; filter by photos / stars.' },
      { req: 'More images added from the backend', p: '14', status: 'done', wf: 's1-3' },
      { req: 'Recommended pairings, max 4 in one screen', p: '14', status: 'done', wf: 's1-3' },
    ],
  },
  {
    name: 'Cart',
    items: [
      { req: 'Pop-up after adding to cart that leads to payment', p: '15', status: 'done', wf: 's1-4' },
      { req: 'Cart → shipping info → order complete, with going back to change', p: '15', status: 'done', wf: 's1-5' },
      { req: 'Cart items, Keep shopping, Go to payment', p: '15', status: 'done', wf: 's1-5' },
      { req: 'Discount code (influencer group-buy)', p: '16', status: 'done', wf: 's1-5', note: 'Tip: one code per influencer lets you see who brought each sale.' },
      { req: 'Add-on products (keep for later)', p: '16', status: 'done', wf: 's1-5' },
      { req: 'Order summary', p: '16', status: 'done', wf: 's1-5' },
      { req: 'Rewards earned after the order (points, store credit, coupons)', p: '16', status: 'gap', wf: 's1-5', note: 'Not shown in the cart summary yet. We will add it.' },
    ],
  },
  {
    name: 'Checkout & order complete',
    items: [
      { req: 'Add to cart and choose shipping before being asked to log in', p: '23', status: 'done', wf: 's1-8' },
      { req: 'Shipping: 7-ELEVEN and home delivery', p: '23', status: 'done', wf: 's1-6', note: 'Home delivery by T-Cat or Chunghwa Post through ECPay.' },
      { req: 'Choose a 7-ELEVEN store on a map (all cities, districts, roads), with reminder notice', p: '19–20', status: 'changed', wf: 's1-7', note: 'Uses the official 7-ELEVEN e-map opened by ECPay, which returns the chosen store.' },
      { req: 'Buyer email, invoice info, payment detail including courier fee', p: '17–18', status: 'done', wf: 's1-9' },
      { req: 'E-invoice: member carrier, mobile barcode, company tax ID, donate (no citizen certificate)', p: '21', status: 'done', wf: 's1-9', note: 'All issued through ECPay e-invoice. Donate needs a 7-digit love code.' },
      { req: 'Purchase notice; agreements must be ticked before ordering; news opt-in', p: '22', status: 'done', wf: 's1-9' },
      { req: 'Payments: LINE Pay, credit card, Apple Pay, ATM (virtual account)', p: '23', status: 'input', wf: 's1-9', note: 'Card, Apple Pay and ATM are in ECPay. LINE Pay is not — separate contract or drop it.' },
      { req: 'Cash on delivery not required', p: '23', status: 'input', wf: 's1-6', note: 'Done as prepaid only. ECPay also offers 7-ELEVEN pay at pickup, which is popular — confirm.' },
      { req: 'Order complete: shipping info, 5-day pickup reminder, order info', p: '22', status: 'done', wf: 's1-10', note: 'Your reference warns that unpicked orders may be blacklisted — see question 5.' },
      { req: 'Coupon for adding the LINE account as a friend', p: '22', status: 'done', wf: 's1-10' },
      { req: 'Check order and Keep shopping buttons', p: '22', status: 'done', wf: 's1-10' },
      { req: 'Backend setting for returns and refund to store credit (future)', p: '23', status: 'input', wf: 's3-6', note: 'Return at any 7-ELEVEN is designed. Who pays the NT$55 return fee and the refund rules are open.' },
    ],
  },
];

export const ADDED: { what: string; why: string; wf?: string }[] = [
  { what: 'Customer journey page', why: 'Shows the whole shopping flow on one page, with a play-through.' },
  { what: 'Return at 7-ELEVEN with a return code', why: 'Uses ECPay’s B2C return service, so shoppers do not need to pack and post.', wf: 's3-6' },
  { what: 'Live order status from ECPay (5 steps)', why: 'No manual updates; shoppers see “Arrived at store” and “Picked up”.', wf: 's3-6' },
  { what: 'Official 7-ELEVEN e-map through ECPay', why: 'Store data is always current; no store list to maintain.', wf: 's1-7' },
  { what: '“We created your account” banner for guests', why: 'Shows guests their points are saved and invites them to verify by SMS.', wf: 's1-10' },
  { what: 'Apple Pay only on Safari / iOS, ATM auto-cancel when unpaid', why: 'Avoids showing a payment that cannot work, and stops unpaid orders blocking stock.', wf: 's1-9' },
  { what: 'Back to top as its own button', why: 'One tap instead of two.', wf: 's4-1' },
  { what: 'Wireframe zoom and pan, English copy', why: 'Easier to review the whole board on any screen.' },
];

// open questions for 9Lab; wf = screen it affects
export const QUESTIONS = [
  { q: 'ECPay supports 7-ELEVEN pay at pickup (取貨付款, up to NT$20,000), which is popular in Taiwan. Offer it, or keep prepaid only?', wf: 's1-6' },
  { q: 'Also offer FamilyMart and Hi-Life pickup? Same flow as 7-ELEVEN through ECPay. (OK Mart only works as C2C, where the parcel is dropped at a store.)', wf: 's1-6' },
  { q: 'ECPay does not offer LINE Pay. Sign a separate LINE Pay contract, or drop it? ECPay can add JKOPAY, TWQR or pay-later (BNPL, orders from NT$3,000) instead.', wf: 's1-9' },
  { q: 'Auto-creating a member from a guest’s mobile needs the shopper’s consent (PDPA). OK to add a consent line at checkout?', wf: 's1-8' },
  { q: 'Parcel not picked up, or ATM not paid in time: when do we cancel, and how is the refund made? Should shoppers who do not pick up be blocked from pay-at-pickup, as in your reference?', wf: 's3-6' },
  { q: 'Returns cost NT$55 per parcel at 7-ELEVEN. Who pays it, and is the refund to the card or store credit?', wf: 's3-6' },
  { q: 'Sign in with SMS code only, no password? Simpler for shoppers; each SMS has a cost.', wf: 's3-2' },
  { q: 'Let guests use Notify me (email / LINE) and save favorites without signing in?', wf: 's2-6' },
  { q: 'Default site language: 繁體中文? (This review copy is in English.)', wf: 's2-1' },
  { q: 'PC version: scope and timing?', wf: 's4-5' },
  { q: 'How long should items stay in the cart?', wf: 's1-5' },
  { q: 'Did the chat bubble mean the on-site “customer message” form from your menu (p.6)? We removed it because it duplicated the LINE button.', wf: 's4-1' },
];

export const FEATURES: { group: string; items: string[] }[] = [
  { group: 'Storefront', items: ['Welcome pop-up (admin-edited)', 'Announcement bar', 'Auto-swiping big and small banners', 'Brand video', 'Flexible homepage sections', 'Footer with anti-fraud notice', 'Floating IG / LINE + Back to top'] },
  { group: 'Browse & search', items: ['Menu drawer with unlimited categories', 'Skin type and product type levels', 'Search with popular keywords and suggestions', 'Filter and sort', 'No-results page with suggestions', 'Sold out + Notify me'] },
  { group: 'Product', items: ['Photo gallery and video', 'Options (size / set) with stock', 'Details accordion (admin adds rows)', 'Reviews from buyers, with photos', 'Recommended pairings (max 4)', 'Favorite heart'] },
  { group: 'Cart & checkout', items: ['Mini cart pop-up', 'Discount / influencer codes', 'Add-on deals', '3-step checkout with back and edit', 'Sign in, sign up or guest checkout', '7-ELEVEN pickup or home delivery', 'E-invoice (4 types)', 'Purchase notice + agreements'] },
  { group: 'Payment', items: ['Credit card', 'Apple Pay', 'ATM virtual account', 'LINE Pay (decision needed)', 'All through ECPay'] },
  { group: 'After purchase', items: ['Order complete with pickup reminder', 'LINE friend coupon', 'Live order tracking (ECPay)', 'Cancel before shipping', 'Return at 7-ELEVEN', 'Email + SMS confirmations'] },
  { group: 'Members', items: ['Sign in with mobile + SMS or LINE', 'Member center profile', 'My favorite / Browsing history / Back in stock', 'My coupon (claim, redeem code)', 'Points and birthday coupon', 'Guests auto-added as members (decision needed)'] },
  { group: 'Admin (backend)', items: ['Edit pop-up, banners, sections', 'Categories and menu', 'Products, options, images, accordion rows', 'Coupons and discount codes', 'Members menu items', 'Purchase notice and footer links', 'Return / store-credit settings (later)'] },
];

export type Service = {
  area: string; pick: string; status: 'recommended' | 'decide';
  why: string; details: string[]; decide?: string; sources: { label: string; url: string }[];
};

const SKILL = 'https://github.com/ECPay/ECPay-API-Skill/blob/main/guides/';

export const SERVICES: Service[] = [
  {
    area: 'Payment', pick: 'ECPay — All-in-One (AIO) payment page', status: 'recommended',
    why: 'One contract covers card, Apple Pay and ATM; shoppers pay on ECPay’s secure page, so card data never touches our server. AIO is ECPay’s simplest integration.',
    details: [
      'Methods: credit card (incl. instalments), Apple Pay, ATM virtual account, convenience-store code / barcode, WebATM, TWQR, BNPL pay-later (orders from NT$3,000), WeChat Pay, JKOPAY.',
      'ATM virtual account expires after 1–60 days (default 7) — we set the deadline and auto-cancel unpaid orders.',
      'LINE Pay is not part of ECPay. It needs its own merchant contract with LINE Pay.',
      'Apple Pay works on Safari / Apple devices. An Apple Pay button inside our own page (ECPG) also needs an Apple Merchant ID and domain verification.',
    ],
    decide: 'LINE Pay: separate contract or drop?',
    sources: [
      { label: 'ECPay skill · AIO payment guide', url: SKILL + '01-payment-aio.md' },
      { label: 'ECPay skill · Apple Pay set-up', url: SKILL + '02c-ecpg-app-production.md' },
      { label: 'ECPay', url: 'https://www.ecpay.com.tw' },
      { label: 'LINE Pay merchants', url: 'https://pay.line.me' },
    ],
  },
  {
    area: 'Delivery', pick: 'ECPay Logistics (綠界物流) — B2C', status: 'recommended',
    why: 'Same ECPay account as payments. ECPay already has contracts with the carriers, so 9Lab does not sign with 7-ELEVEN or T-Cat directly.',
    details: [
      'Store pickup (B2C): 7-ELEVEN, FamilyMart, Hi-Life. OK Mart is only available as C2C.',
      'Home delivery: T-Cat (黑貓) or Chunghwa Post (parcels up to 20 kg).',
      'Store picked on the official e-map; ECPay sends the store back to our site.',
      'ECPay creates the shipping order and label, and pushes parcel status to our server for order tracking.',
      'Returns at 7-ELEVEN / FamilyMart / Hi-Life (B2C return, NT$55 per parcel at 7-ELEVEN).',
      'Pay at pickup / cash on delivery is available (up to NT$20,000 per order).',
      'Separate service from payments: apply to activate, priced per parcel, settled weekly (Tuesday) for standard members.',
    ],
    decide: 'Which stores to offer, and pay at pickup yes / no?',
    sources: [
      { label: 'ECPay skill · Domestic logistics guide', url: SKILL + '06-logistics-domestic.md' },
      { label: 'ECPay', url: 'https://www.ecpay.com.tw' },
    ],
  },
  {
    area: 'E-invoice', pick: 'ECPay B2C e-invoice', status: 'recommended',
    why: 'Taiwan requires a uniform invoice for each sale; issuing it from the same ECPay account keeps payment and invoice in sync.',
    details: [
      'Member carrier (ECPay carrier), mobile barcode (/XXXXXXX), company tax ID (8 digits), donation with a 7-digit love code.',
      'Citizen digital certificate not offered, as the brief asks.',
      'Invoice details go to the email given at checkout (1.9).',
    ],
    sources: [{ label: 'ECPay skill · B2C e-invoice guide', url: SKILL + '04-invoice-b2c.md' }],
  },
  {
    area: 'Sign in', pick: 'Mobile number + SMS code, and LINE Login', status: 'recommended',
    why: 'Matches the brief (mobile or LINE). SMS code only, no password: nothing to forget and no reset flow.',
    details: [
      'LINE Login: shoppers sign in with their LINE account in one tap.',
      'SMS code needs a Taiwan SMS provider; each message has a cost, so we limit resends.',
      'Guests can be added as members by mobile number only with their consent (PDPA).',
    ],
    decide: 'SMS only or SMS + password? Which SMS provider?',
    sources: [
      { label: 'LINE Login docs', url: 'https://developers.line.biz/en/docs/line-login/' },
      { label: 'Taiwan Personal Data Protection Act', url: 'https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=I0050021' },
    ],
  },
  {
    area: 'LINE account', pick: 'LINE Official Account + Messaging API', status: 'recommended',
    why: 'LINE is the main chat app in Taiwan. The brief already uses LINE for chat and the friend coupon.',
    details: [
      'Add-friend coupon after the order, chat with customer service, order updates.',
      'Messaging API lets the site send order messages to shoppers who added 9Lab.',
    ],
    sources: [{ label: 'LINE Messaging API docs', url: 'https://developers.line.biz/en/docs/messaging-api/' }],
  },
  {
    area: 'Store platform', pick: 'To decide with 9Lab', status: 'decide',
    why: 'The brief asks for a lot of backend control (pop-up, banners, flexible sections, unlimited categories, coupons). The platform decides how much is ready-made and how much is custom.',
    details: [
      'WooCommerce + official ECPay plugin: every ECPay payment, store and home delivery, and e-invoice are supported.',
      'Shopify + ECPay: most payments; convenience-store code / barcode payments are not supported in the plugin.',
      'Custom build (e.g. Next.js + headless commerce): full freedom for the layouts in the brief, more build time and cost.',
    ],
    decide: 'Budget, timeline and who will run the backend day to day.',
    sources: [{ label: 'ECPay skill · Shopping cart plugins', url: SKILL + '10-cart-plugins.md' }],
  },
];
