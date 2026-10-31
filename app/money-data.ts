// Money flow page content (English source). Every rule below mirrors the shop's code (website/src/lib/*) or the NewebPay / ezPay manuals
// in docs/. Anything we could not confirm is marked "To confirm", never filled with a guess.
export type Badge = 'auto' | 'hand' | 'todo' | 'off';
export const BADGES: Record<Badge, { label: string; hint: string }> = {
  auto: { label: 'Automatic', hint: 'The shop does this by itself' },
  hand: { label: 'By hand', hint: 'A person does it (in the admin or in NewebPay)' },
  off: { label: 'Built, switched off', hint: 'Written and tested, waiting for an account' },
  todo: { label: 'Not built yet', hint: 'Planned or waiting for a decision' },
};
export type Step = { title: string; text: string; badge: Badge };
export type Track = { name: string; steps: Step[] };
export type FlowDef = { id: string; no: string; title: string; lead: string; tracks: Track[]; note?: string };

// What the shopper pays: a worked example, computed from the same rules the shop uses (lib/shop.ts, lib/einvoice-core.ts).
export const RULES = { freeMin: 1500, fee711: 60, feeHome: 100, taxPct: 5, pointsPer: 100 };
export const EXAMPLE = { goods: 980, dealOff: 0, coupon: 100 };

export const FLOWS: FlowDef[] = [
  { id: 'lifecycle', no: '02', title: 'From "Place order" to "Paid"', lead: 'An order only becomes Paid when NewebPay itself tells our server so. The shopper coming back to our site is not proof of payment.',
    tracks: [
      { name: 'Main path', steps: [
        { title: 'Place order', text: 'The server re-checks every price, stock level and coupon, then saves the order as "Awaiting payment". Nothing is taken from stock yet.', badge: 'auto' },
        { title: 'NewebPay page', text: 'The shopper pays by credit card, LINE Pay, Apple Pay or ATM transfer. Card numbers are typed on NewebPay, never on our site.', badge: 'auto' },
        { title: 'Signed notice', text: 'NewebPay calls our server in the background. We check the signature, the merchant, the amount and that this is not a repeat.', badge: 'auto' },
        { title: 'Order is Paid', text: 'Stock is taken, the coupon is used up, points are added (1 per NT$100 of goods).', badge: 'auto' },
        { title: 'Invoice issued', text: 'The tax invoice is requested from ezPay (see section 03).', badge: 'off' },
      ] },
      { name: 'Side paths', steps: [
        { title: 'Same notice twice', text: 'NewebPay may resend a notice. The second one is recognised and ignored, so nothing is counted twice.', badge: 'auto' },
        { title: 'Paid after we cancelled', text: 'Typical for ATM transfers. The money is recorded and the order is flagged "Refund needed". No stock, no points.', badge: 'auto' },
        { title: 'ATM never paid', text: 'NewebPay stops accepting the transfer after about 24 hours. After 3 days the order is cancelled automatically and any coupon it held is released. If money still arrives later, the order is flagged "Refund needed".', badge: 'auto' },
        { title: 'Amount does not match', text: 'The notice is refused and the order stays unpaid, so a tampered payment can never mark an order paid.', badge: 'auto' },
      ] },
    ] },
  { id: 'invoice', no: '03', title: 'Tax invoice (ezPay e-invoice)', lead: 'ezPay e-invoice is a NewebPay-group service with its own account and keys. The module is finished and tested, but switched off until 9Lab has that account.',
    tracks: [
      { name: 'Issuing', steps: [
        { title: 'Shopper chooses', text: 'At checkout: member carrier, mobile barcode, company tax ID, donate, or paper. Each choice is checked (for example a barcode starts with "/" and has 7 more characters).', badge: 'auto' },
        { title: 'Order paid', text: 'After the order is Paid, the shop builds the invoice from the order, never from what the browser sent.', badge: 'off' },
        { title: 'Split the amounts', text: 'Lines are the goods (the coupon is spread over them) plus a shipping line. The lines always add up to what the shopper paid; tax (5 %) is included.', badge: 'off' },
        { title: 'Send to ezPay', text: 'Sent encrypted. ezPay answers with the invoice number, and we verify the reply really came from ezPay (a check code).', badge: 'off' },
        { title: 'Number saved', text: 'The invoice number is stored on the order and shown in the admin. If ezPay refuses, the reason is stored and the order stays Paid; an admin can press "Issue invoice" to retry.', badge: 'off' },
      ] },
      { name: 'Later', steps: [
        { title: 'Void or credit note', text: 'A cancelled or returned order needs the invoice voided (only until the 14th of the odd month for the previous two months) or a credit note after that.', badge: 'todo' },
        { title: 'Reported to the tax office', text: 'ezPay uploads the day\'s invoices to the Ministry of Finance every night.', badge: 'auto' },
      ] },
    ], note: 'To confirm with the accountant: how tax is split when coupons, points and shipping are involved, and how company (B2B) invoices are rounded.' },
  { id: 'refund', no: '04', title: 'Cancel, return and refund', lead: 'Two ways money can go back: the shopper cancels before the parcel leaves, or sends it back afterwards. Refunds are made by a person in NewebPay.',
    tracks: [
      { name: 'Cancel before shipping', steps: [
        { title: 'Shopper or admin cancels', text: 'Allowed while the order is Paid or Preparing. Once shipped, only a return is possible.', badge: 'auto' },
        { title: 'Everything goes back', text: 'Stock returns to the shelf, the points earned are taken back, and the coupon becomes usable again.', badge: 'auto' },
        { title: 'Flagged "Refund needed"', text: 'It shows in the admin order list so nobody forgets.', badge: 'auto' },
        { title: 'Refund in NewebPay', text: 'A team member refunds the payment in NewebPay\'s back office, then presses "Refund done".', badge: 'hand' },
      ] },
      { name: 'Return after delivery', steps: [
        { title: 'Shopper asks', text: 'From My orders, with a reason (at least 5 characters). Possible once the parcel has arrived.', badge: 'auto' },
        { title: 'Team decides', text: 'Approve or reject with a message the shopper can read. The 7-day window is judged by the team; the shop does not enforce it.', badge: 'hand' },
        { title: 'Parcel received', text: 'The order becomes Returned, points are taken back, and the refund is flagged. Stock goes back only if the team says the goods can be sold again (opened skincare cannot).', badge: 'hand' },
        { title: 'Refund in NewebPay', text: 'Same as above. A coupon used on the order stays used.', badge: 'hand' },
      ] },
      { name: 'Ideas not built', steps: [
        { title: 'Store credit', text: 'Refund as credit for the next order. The database has room for it but there is no screen yet.', badge: 'todo' },
        { title: 'Refund by API', text: 'Pressing a button in the admin would refund through NewebPay. Today it is manual.', badge: 'todo' },
        { title: 'Spending points', text: 'Points are earned and shown, but cannot be spent at checkout yet.', badge: 'todo' },
      ] },
    ] },
  { id: 'shipping', no: '05', title: 'Shipping money', lead: 'Two different amounts: what the shopper is charged for shipping, and what the parcel costs 9Lab.',
    tracks: [
      { name: 'Charged to the shopper (built)', steps: [
        { title: 'Shipping fee', text: 'NT$60 for 7-ELEVEN pickup, NT$100 for home delivery. 9Lab can change both in Settings.', badge: 'auto' },
        { title: 'Free over NT$1,500', text: 'The threshold is also editable. A bar in the cart shows how far the shopper is.', badge: 'auto' },
        { title: 'Part of the total', text: 'The fee is in the amount paid and appears as its own line on the invoice. Points are not earned on it.', badge: 'auto' },
      ] },
      { name: 'Paid by 9Lab (logistics API, built and switched off)', steps: [
        { title: 'Choose the store first', text: 'The shopper picks the 7-ELEVEN store on NewebPay\'s map before paying, so the order already knows where the parcel goes.', badge: 'off' },
        { title: 'Shipment after payment', text: 'When the order is Paid, the shop creates the parcel at NewebPay. The team prints the label from the admin order page.', badge: 'off' },
        { title: 'Prepaid balance', text: 'Each parcel fee is taken from a balance 9Lab tops up in advance. If it is empty the shipment is not created: the dashboard warns, and the team retries after topping up.', badge: 'hand' },
        { title: 'Which parcel type', text: 'Set to C2C: drop the parcel at any 7-ELEVEN, no approval needed. B2C (7-ELEVEN only, needs approval and a test, parcels go to a warehouse) can be switched on later.', badge: 'off' },
        { title: 'Limit per order', text: 'Store pickup orders are capped at NT$20,000. The checkout refuses larger ones and suggests home delivery.', badge: 'auto' },
        { title: 'Status by itself', text: 'NewebPay tells the shop when the parcel reaches the store and when it is picked up, so the order status moves on its own. Problems (store closed, number expired, parcel returned) are flagged for the team.', badge: 'off' },
      ] },
    ], note: 'To switch it on: a NewebPay test merchant with logistics enabled and a prepaid balance, then the same on the live account. Format details are confirmed against the manual only until then.' },
  { id: 'bank', no: '06', title: 'From the shopper to 9Lab\'s bank', lead: 'NewebPay collects the money first and pays it out to 9Lab afterwards.',
    tracks: [
      { name: 'Money path', steps: [
        { title: 'Shopper pays', text: 'The payment lands in 9Lab\'s NewebPay account, not directly in the bank.', badge: 'auto' },
        { title: 'Fees are deducted', text: 'NewebPay charges a fee per payment method. We have not downloaded NewebPay\'s rate table, so no figures are shown here.', badge: 'todo' },
        { title: 'Cooling-off', text: 'Where Taiwan\'s 7-day consumer cooling-off applies, NewebPay\'s terms only let the member withdraw after those 7 days.', badge: 'auto' },
        { title: 'Withdraw to the bank', text: 'The team withdraws the balance to 9Lab\'s bank account from NewebPay\'s member center. Timing and any withdrawal fee: to confirm.', badge: 'hand' },
      ] },
    ] },
];

export const ACCOUNTANT: { q: string; why: string }[] = [
  { q: 'Tax split on discounted orders', why: 'Coupons are spread over goods lines; shipping is one tax-included line. Is that the way 9Lab books it?' },
  { q: 'Company (B2B) invoice rounding', why: 'Lines are rounded before tax, so the invoice total can differ from the amount paid by NT$1.' },
  { q: 'Cancelled or returned orders', why: 'Void the invoice, or issue a credit note? And who does it: the shop or the team?' },
  { q: 'Points as a liability', why: 'Points are earned (1 per NT$100) and taken back on cancel. They cannot be spent yet. Should they be recorded as a cost?' },
  { q: 'Cash timing', why: 'NewebPay fees, the 7-day cooling-off and withdrawal timing decide when money reaches the bank.' },
  { q: 'Shipping parcel cost', why: 'If the logistics API is used, the prepaid balance is a running cost to reconcile against shipping fees charged.' },
];
