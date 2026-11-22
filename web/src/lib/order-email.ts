import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { emailConfiguration } from '@/lib/auth-email';
import { orderConfirmationS3Key, s3Configured, uploadToS3 } from '@/lib/s3';
import { imgSrc, money } from '@/lib/utils';

export type OrderEmailOrder = {
  id: number;
  user_id?: number;
  order_number: string;
  invoice_number?: string;
  issued_at?: string;
  status: string;
  payment_status: string;
  payment_method?: string;
  subtotal: number;
  shipping: number;
  total: number;
  customer_email?: string;
  customer_name?: string;
  customer_phone?: string;
  given_name?: string;
  family_name?: string;
  street_address?: string;
  city?: string;
  postal_code?: string;
  notes?: string;
  items: {
    product_id: number;
    qty: number;
    name_snapshot: string;
    price_snapshot: number;
    line_total: number;
    image?: string;
  }[];
};

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function appOrigin() {
  try {
    return new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').origin;
  } catch {
    return 'http://localhost:3000';
  }
}

function absoluteMediaUrl(pathValue?: string | null) {
  const src = imgSrc(pathValue);
  if (/^https?:\/\//i.test(src)) return src;
  return `${appOrigin()}${src.startsWith('/') ? src : `/${src}`}`;
}

function paymentLabel(order: OrderEmailOrder) {
  const method = String(order.payment_method || 'cod').toLowerCase();
  if (method === 'cod') return 'Cash on Delivery (COD)';
  return method.toUpperCase();
}

function paymentStatusLabel(status: string) {
  const value = String(status || '').toLowerCase();
  if (value === 'paid') return 'Paid';
  if (value === 'refunded') return 'Refunded';
  return 'Payment pending';
}

function formatInvoiceDate(value?: string) {
  if (!value) {
    return new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function buildOrderConfirmationContent(order: OrderEmailOrder) {
  const origin = appOrigin();
  const invoiceUrl = `${origin}/account/orders/${order.id}/invoice`;
  const orderUrl = `${origin}/account/orders/${order.id}`;
  const logoUrl = `${origin}/assets/images/Logo/RareObjet-Logo.png`;
  const name =
    [order.given_name, order.family_name].filter(Boolean).join(' ') ||
    order.customer_name ||
    'Customer';
  const invoiceNo = order.invoice_number || `INV-${String(order.id).padStart(6, '0')}`;
  const invoiceDate = formatInvoiceDate(order.issued_at);
  const addressLine = [order.street_address, order.city, order.postal_code].filter(Boolean).join(', ');
  const paid = String(order.payment_status || '').toLowerCase() === 'paid';
  const ink = '#4a3728';
  const cream = '#f3ebe1';
  const paper = '#fffdf9';

  const itemRowsHtml = order.items
    .map((item, index) => {
      const image = absoluteMediaUrl(item.image || 'assets/images/img2.jpeg');
      return `
        <tr>
          <td style="padding:14px 8px;border-bottom:1px solid #e8dfd4;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${ink};vertical-align:middle;width:36px;">${index + 1}</td>
          <td style="padding:14px 8px;border-bottom:1px solid #e8dfd4;vertical-align:middle;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td width="58" valign="middle" style="padding-right:12px;">
                  <img src="${escapeHtml(image)}" alt="${escapeHtml(item.name_snapshot)}" width="52" height="52" style="display:block;width:52px;height:52px;object-fit:cover;border:1px solid #e8dfd4;background:#f7f2eb;" />
                </td>
                <td valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.4;color:${ink};font-weight:600;">
                  ${escapeHtml(item.name_snapshot)}
                </td>
              </tr>
            </table>
          </td>
          <td style="padding:14px 8px;border-bottom:1px solid #e8dfd4;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${ink};text-align:right;white-space:nowrap;vertical-align:middle;">${escapeHtml(money(item.price_snapshot))}</td>
          <td style="padding:14px 8px;border-bottom:1px solid #e8dfd4;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${ink};text-align:center;vertical-align:middle;">${item.qty}</td>
          <td style="padding:14px 8px;border-bottom:1px solid #e8dfd4;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${ink};text-align:right;font-weight:700;white-space:nowrap;vertical-align:middle;">${escapeHtml(money(item.line_total))}</td>
        </tr>`;
    })
    .join('');

  const textItems = order.items
    .map((item) => `- ${item.name_snapshot} × ${item.qty} @ ${money(item.price_snapshot)} = ${money(item.line_total)}`)
    .join('\n');

  const subject = paid
    ? `Invoice ${invoiceNo} · Payment received · Rare Objet`
    : `Invoice ${invoiceNo} · Order ${order.order_number} · Rare Objet`;

  const text = [
    `INVOICE`,
    '',
    `Hi ${name},`,
    '',
    paid
      ? 'Thank you for your payment. Here is your invoice for your Rare Objet order.'
      : 'Thank you for your order. Here is your invoice from Rare Objet.',
    '',
    `Invoice: ${invoiceNo}`,
    `Order: ${order.order_number}`,
    `Date: ${invoiceDate}`,
    `Payment: ${paymentLabel(order)} · ${paymentStatusLabel(order.payment_status)}`,
    '',
    'Ship to:',
    name,
    addressLine,
    order.customer_phone || '',
    '',
    'Items:',
    textItems,
    '',
    `Subtotal: ${money(order.subtotal)}`,
    `Shipping: ${money(order.shipping)}`,
    `Total: ${money(order.total)}`,
    '',
    `View invoice: ${invoiceUrl}`,
    `Track order: ${orderUrl}`,
    '',
    '— Rare Objet'
  ]
    .filter((line): line is string => line !== null && line !== undefined)
    .join('\n');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Invoice ${escapeHtml(invoiceNo)}</title>
</head>
<body style="margin:0;padding:0;background:${cream};">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${cream};padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:680px;background:${cream};">
          <tr>
            <td style="padding:0 8px 22px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td valign="middle" width="58%" style="padding-right:16px;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:${paper};border:1px solid #e4d8cb;padding:14px 16px;border-radius:4px;">
                          <img src="${escapeHtml(logoUrl)}" alt="Rare Objet" width="150" style="display:block;width:150px;max-width:100%;height:auto;" />
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td valign="middle" align="right" width="42%">
                    <div style="font-family:Georgia,Times,'Times New Roman',serif;font-size:34px;line-height:1;letter-spacing:0.12em;color:${ink};font-weight:700;">INVOICE</div>
                    <div style="margin-top:10px;border-top:1px solid ${ink};width:100%;max-width:180px;margin-left:auto;"></div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 8px 22px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td valign="top" width="58%" style="font-family:Arial,Helvetica,sans-serif;color:${ink};padding-right:12px;">
                    <div style="font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:8px;">Invoice to:</div>
                    <div style="font-size:15px;font-weight:700;line-height:1.45;">${escapeHtml(name)}</div>
                    <div style="font-size:13px;line-height:1.55;margin-top:4px;color:#5d4a3c;">${escapeHtml(addressLine || '—')}</div>
                    ${order.customer_phone ? `<div style="font-size:13px;line-height:1.55;color:#5d4a3c;">${escapeHtml(String(order.customer_phone))}</div>` : ''}
                    ${order.customer_email ? `<div style="font-size:13px;line-height:1.55;color:#5d4a3c;">${escapeHtml(String(order.customer_email))}</div>` : ''}
                  </td>
                  <td valign="top" width="42%" align="right" style="font-family:Arial,Helvetica,sans-serif;color:${ink};">
                    <div style="font-size:14px;line-height:1.6;"><strong>Invoice No.</strong> ${escapeHtml(invoiceNo)}</div>
                    <div style="font-size:14px;line-height:1.6;"><strong>Order</strong> ${escapeHtml(order.order_number)}</div>
                    <div style="font-size:14px;line-height:1.6;">${escapeHtml(invoiceDate)}</div>
                    <div style="font-size:13px;line-height:1.6;margin-top:6px;color:#5d4a3c;">${escapeHtml(paymentLabel(order))} · ${escapeHtml(paymentStatusLabel(order.payment_status))}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 8px 18px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${paper};border:1px solid #e4d8cb;border-radius:6px;">
                <tr>
                  <td style="padding:8px 14px 4px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <th align="left" style="padding:12px 8px;border-bottom:1px solid ${ink};font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${ink};width:36px;">No</th>
                        <th align="left" style="padding:12px 8px;border-bottom:1px solid ${ink};font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${ink};">Product description</th>
                        <th align="right" style="padding:12px 8px;border-bottom:1px solid ${ink};font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${ink};white-space:nowrap;">Price</th>
                        <th align="center" style="padding:12px 8px;border-bottom:1px solid ${ink};font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${ink};">Qty</th>
                        <th align="right" style="padding:12px 8px;border-bottom:1px solid ${ink};font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${ink};">Total</th>
                      </tr>
                      ${itemRowsHtml}
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 14px 18px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td valign="top" width="52%" style="padding-right:12px;font-family:Arial,Helvetica,sans-serif;color:${ink};font-size:13px;line-height:1.55;">
                          <div style="font-weight:700;margin-bottom:4px;">Payment details</div>
                          <div>${escapeHtml(paymentLabel(order))}</div>
                          <div>Status: ${escapeHtml(paymentStatusLabel(order.payment_status))}</div>
                          <div>Order status: <span style="text-transform:capitalize;">${escapeHtml(order.status)}</span></div>
                          ${order.notes ? `<div style="margin-top:8px;color:#6a5648;">Note: ${escapeHtml(String(order.notes))}</div>` : ''}
                        </td>
                        <td valign="top" width="48%" style="font-family:Arial,Helvetica,sans-serif;color:${ink};font-size:14px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="padding:4px 0;color:#6a5648;">Subtotal</td>
                              <td align="right" style="padding:4px 0;">${escapeHtml(money(order.subtotal))}</td>
                            </tr>
                            <tr>
                              <td style="padding:4px 0;color:#6a5648;">Shipping</td>
                              <td align="right" style="padding:4px 0;">${escapeHtml(money(order.shipping))}</td>
                            </tr>
                            <tr>
                              <td style="padding:10px 0 0;border-top:1px solid ${ink};font-size:16px;font-weight:700;">Total</td>
                              <td align="right" style="padding:10px 0 0;border-top:1px solid ${ink};font-size:16px;font-weight:700;">${escapeHtml(money(order.total))}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 8px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td valign="bottom" width="48%" style="font-family:Georgia,'Palatino Linotype',Times,serif;font-size:42px;line-height:1;color:${ink};font-style:italic;">
                    Thank You
                  </td>
                  <td valign="bottom" width="52%" align="right" style="font-family:Arial,Helvetica,sans-serif;color:${ink};font-size:12px;line-height:1.55;">
                    <div style="font-weight:700;font-size:13px;">Rare Objet</div>
                    <div><a href="${escapeHtml(origin)}" style="color:${ink};text-decoration:none;">${escapeHtml(origin.replace(/^https?:\/\//, ''))}</a></div>
                    <div style="margin-top:8px;">
                      <a href="${escapeHtml(invoiceUrl)}" style="color:${ink};">View invoice online</a>
                      &nbsp;·&nbsp;
                      <a href="${escapeHtml(orderUrl)}" style="color:${ink};">Track order</a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text, html, invoiceUrl, orderUrl };
}

/** Archive confirmation HTML under orders/user-{id}/order-{id}/ on S3 (or local public/). */
export async function storeOrderConfirmationOnS3(order: OrderEmailOrder, userId: number) {
  const { html } = buildOrderConfirmationContent(order);
  const key = orderConfirmationS3Key(userId, order.id);
  const body = Buffer.from(html, 'utf8');
  if (s3Configured()) {
    await uploadToS3(key, body, 'text/html; charset=utf-8', 'private, max-age=0, must-revalidate');
    return key;
  }
  const absolute = path.join(process.cwd(), 'public', ...key.split('/'));
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, body);
  return key;
}

export async function sendOrderConfirmationEmail(order: OrderEmailOrder) {
  const to = String(order.customer_email || '').trim().toLowerCase();
  if (!to) throw new Error('Customer email is missing');

  const { smtp, from } = emailConfiguration();
  const { subject, text, html } = buildOrderConfirmationContent(order);

  const transport = nodemailer.createTransport(smtp);
  const result = await transport.sendMail({
    from,
    to,
    subject,
    text,
    html
  });
  if (!result.accepted.length || result.rejected.length) throw new Error('Order confirmation email delivery failed');
}
