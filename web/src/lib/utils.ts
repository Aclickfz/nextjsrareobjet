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

export function mediaBaseUrl() {
  return (process.env.NEXT_PUBLIC_MEDIA_BASE_URL || '').replace(/\/$/, '');
}

function isS3StyleKey(clean: string) {
  return /^(products|category|banner|assets|uploads|orders)\//.test(clean);
}

/**
 * Resolves product/homepage image paths.
 * Default: `/api/media/...` so private S3 buckets still display (app streams with AWS credentials).
 * Set NEXT_PUBLIC_MEDIA_DIRECT=1 to use NEXT_PUBLIC_MEDIA_BASE_URL (public bucket / CloudFront) instead.
 */
export function imgSrc(path?: string | null) {
  if (!path) return imgSrc('assets/images/img2.jpeg');
  if (/^https?:\/\//i.test(path) || path.startsWith('data:') || path.startsWith('blob:')) return path;
  if (path.startsWith('/api/media/')) return path;
  const clean = path.replace(/^\.\//, '').replace(/^\/+/, '');
  if (isS3StyleKey(clean)) {
    const direct = process.env.NEXT_PUBLIC_MEDIA_DIRECT === '1';
    const base = mediaBaseUrl();
    if (direct && base) return `${base}/${clean}`;
    return `/api/media/${clean}`;
  }
  const base = mediaBaseUrl();
  if (base) return `${base}/${clean}`;
  return `/${clean}`;
}

export function assetImage(file: string) {
  return imgSrc(`assets/images/${file.replace(/^\/+/, '').replace(/^assets\/images\//, '')}`);
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
