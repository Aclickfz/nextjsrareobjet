export const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: []
};

export function canTransition(from: string, to: string) {
  return (ALLOWED_TRANSITIONS[from] || []).includes(to);
}

export function shippingFlat(itemCount: number) {
  if (!itemCount) return 0;
  return Number(process.env.SHIPPING_FLAT_INR || 99);
}

export function money(amount: number) {
  const n = Number(amount) || 0;
  return `Rs. ${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function slugify(text: string) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 200);
}

export function orderNumber() {
  const stamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
  const rand = Math.floor(Math.random() * 900 + 100);
  return `JAC-${stamp}-${rand}`;
}

export function invoiceNumber(orderId: number) {
  return `INV-${String(orderId).padStart(6, '0')}`;
}

export function imgSrc(path?: string | null) {
  if (!path) return '/assets/images/img2.jpeg';
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.replace(/^\.\//, '').replace(/^\//, '');
  return `/${clean}`;
}

export function nextPaymentStatus(current: string, nextStatus: string, markPaid?: boolean) {
  let paymentStatus = current;
  if (nextStatus === 'confirmed' || nextStatus === 'shipped' || nextStatus === 'delivered') {
    if (markPaid) paymentStatus = 'paid';
    if (nextStatus === 'delivered' && markPaid !== false) paymentStatus = 'paid';
  }
  if (nextStatus === 'cancelled' && paymentStatus === 'paid') paymentStatus = 'refunded';
  return paymentStatus;
}
