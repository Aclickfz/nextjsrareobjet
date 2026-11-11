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

export function buildOrderConfirmationContent(order: OrderEmailOrder) {
  const origin = appOrigin();
  const invoiceUrl = `${origin}/account/orders/${order.id}/invoice`;
  const orderUrl = `${origin}/account/orders/${order.id}`;
  const name = [order.given_name, order.family_name].filter(Boolean).join(' ') || order.customer_name || 'there';
  const invoiceNo = order.invoice_number || `INV-${String(order.id).padStart(6, '0')}`;
  const brand = '#303e34';

  const itemRowsHtml = order.items.map((item) => {
    const image = absoluteMediaUrl(item.image);
    return `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #ece8e2;vertical-align:top;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="64" valign="top" style="padding-right:12px;">
                <img src="${escapeHtml(image)}" alt="" width="56" height="56" style="display:block;width:56px;height:56px;object-fit:cover;border:1px solid #ece8e2;border-radius:6px;background:#f6f5f1;" />
              </td>
              <td valign="top" style="font-family:Arial,Helvetica,sans-serif;color:#252923;font-size:14px;line-height:1.45;">
                <div style="font-weight:600;">${escapeHtml(item.name_snapshot)}</div>
                <div style="color:#666;margin-top:4px;">Qty ${item.qty} · ${escapeHtml(money(item.price_snapshot))}</div>
              </td>
              <td valign="top" align="right" style="font-family:Arial,Helvetica,sans-serif;color:#252923;font-size:14px;font-weight:600;white-space:nowrap;">
                ${escapeHtml(money(item.line_total))}
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
  }).join('');

  const textItems = order.items
    .map((item) => `- ${item.name_snapshot} × ${item.qty} @ ${money(item.price_snapshot)} = ${money(item.line_total)}`)
    .join('\n');

  const subject = `Order confirmed · ${order.order_number} · Rare Objet`;
  const text = [
    `Hi ${name},`,
    '',
    'Thank you for shopping with Rare Objet. Your order is confirmed.',
    '',
    `Order: ${order.order_number}`,
    `Invoice: ${invoiceNo}`,
    `Status: ${order.status}`,
    '',
    'Items:',
    textItems,
    '',
    `Subtotal: ${money(order.subtotal)}`,
    `Shipping: ${money(order.shipping)}`,
    `Total: ${money(order.total)}`,
    '',
    'Shipping to:',
    `${order.given_name || ''} ${order.family_name || ''}`.trim(),
    order.street_address || '',
    `${order.city || ''} ${order.postal_code || ''}`.trim(),
    order.notes ? `Notes: ${order.notes}` : null,
    '',
    `Payment: ${paymentLabel(order)} · ${paymentStatusLabel(order.payment_status)}`,
    '',
    `View invoice: ${invoiceUrl}`,
    `Track order: ${orderUrl}`,
    '',
    '— Rare Objet'
  ].filter((line): line is string => line !== null).join('\n');

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f3f1ec;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f3f1ec;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;background:#ffffff;border:1px solid #e7e2da;">
          <tr>
            <td style="background:${brand};padding:22px 28px;font-family:Georgia,Times,'Times New Roman',serif;color:#fff;">
              <div style="font-size:22px;letter-spacing:0.08em;text-transform:uppercase;">Rare Objet</div>
              <div style="margin-top:6px;font-family:Arial,Helvetica,sans-serif;font-size:13px;opacity:0.88;">Order confirmation</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;font-family:Arial,Helvetica,sans-serif;color:#252923;">
              <h1 style="margin:0 0 10px;font-size:24px;font-weight:600;line-height:1.25;">Thanks for your order, ${escapeHtml(name)}.</h1>
              <p style="margin:0 0 22px;color:#666;font-size:14px;line-height:1.6;">
                We’ve received your order and are getting it ready. You’ll get updates as it moves to confirmed, shipped, and delivered.
              </p>

              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:22px;background:#f7f6f2;border:1px solid #ece8e2;">
                <tr>
                  <td style="padding:14px 16px;font-size:13px;line-height:1.55;width:50%;vertical-align:top;">
                    <div style="color:#777;text-transform:uppercase;letter-spacing:0.06em;font-size:11px;">Order number</div>
                    <div style="font-weight:600;margin-top:4px;">${escapeHtml(order.order_number)}</div>
                  </td>
                  <td style="padding:14px 16px;font-size:13px;line-height:1.55;width:50%;vertical-align:top;">
                    <div style="color:#777;text-transform:uppercase;letter-spacing:0.06em;font-size:11px;">Invoice</div>
                    <div style="font-weight:600;margin-top:4px;">${escapeHtml(invoiceNo)}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 16px 14px;font-size:13px;line-height:1.55;vertical-align:top;">
                    <div style="color:#777;text-transform:uppercase;letter-spacing:0.06em;font-size:11px;">Order status</div>
                    <div style="font-weight:600;margin-top:4px;text-transform:capitalize;">${escapeHtml(order.status)}</div>
                  </td>
                  <td style="padding:0 16px 14px;font-size:13px;line-height:1.55;vertical-align:top;">
                    <div style="color:#777;text-transform:uppercase;letter-spacing:0.06em;font-size:11px;">Payment</div>
                    <div style="font-weight:600;margin-top:4px;">${escapeHtml(paymentLabel(order))} · ${escapeHtml(paymentStatusLabel(order.payment_status))}</div>
                  </td>
                </tr>
              </table>

              <h2 style="margin:0 0 8px;font-size:16px;font-weight:600;">Items ordered</h2>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:22px;">
                ${itemRowsHtml}
              </table>

              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:22px;">
                <tr>
                  <td style="padding:4px 0;color:#666;font-size:14px;">Subtotal</td>
                  <td align="right" style="padding:4px 0;font-size:14px;">${escapeHtml(money(order.subtotal))}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;color:#666;font-size:14px;">Shipping</td>
                  <td align="right" style="padding:4px 0;font-size:14px;">${escapeHtml(money(order.shipping))}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0 0;border-top:1px solid #ece8e2;font-size:16px;font-weight:700;">Total</td>
                  <td align="right" style="padding:10px 0 0;border-top:1px solid #ece8e2;font-size:16px;font-weight:700;">${escapeHtml(money(order.total))}</td>
                </tr>
              </table>

              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td width="50%" valign="top" style="padding-right:10px;">
                    <div style="border:1px solid #ece8e2;padding:14px 16px;min-height:120px;">
                      <div style="color:#777;text-transform:uppercase;letter-spacing:0.06em;font-size:11px;margin-bottom:8px;">Shipping details</div>
                      <div style="font-size:14px;line-height:1.55;">
                        <strong>${escapeHtml(`${order.given_name || ''} ${order.family_name || ''}`.trim())}</strong><br />
                        ${escapeHtml(order.street_address || '')}<br />
                        ${escapeHtml(`${order.city || ''} ${order.postal_code || ''}`.trim())}
                        ${order.customer_phone ? `<br />${escapeHtml(String(order.customer_phone))}` : ''}
                        ${order.notes ? `<br /><span style="color:#666;">Note: ${escapeHtml(String(order.notes))}</span>` : ''}
                      </div>
                    </div>
                  </td>
                  <td width="50%" valign="top" style="padding-left:10px;">
                    <div style="border:1px solid #ece8e2;padding:14px 16px;min-height:120px;">
                      <div style="color:#777;text-transform:uppercase;letter-spacing:0.06em;font-size:11px;margin-bottom:8px;">Payment details</div>
                      <div style="font-size:14px;line-height:1.55;">
                        <strong>${escapeHtml(paymentLabel(order))}</strong><br />
                        Status: ${escapeHtml(paymentStatusLabel(order.payment_status))}<br />
                        Amount payable: <strong>${escapeHtml(money(order.total))}</strong>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>

              <a href="${escapeHtml(invoiceUrl)}" style="display:inline-block;background:${brand};color:#fff;text-decoration:none;padding:12px 18px;font-size:13px;letter-spacing:0.05em;text-transform:uppercase;font-weight:600;">
                View order invoice
              </a>
              <p style="margin:16px 0 0;color:#777;font-size:12px;line-height:1.5;">
                Or open your order: <a href="${escapeHtml(orderUrl)}" style="color:${brand};">${escapeHtml(orderUrl)}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px;background:#f7f6f2;border-top:1px solid #ece8e2;font-family:Arial,Helvetica,sans-serif;color:#777;font-size:12px;line-height:1.5;">
              Need help? Reply to this email or visit Chat Support on the website.<br />
              © Rare Objet
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
