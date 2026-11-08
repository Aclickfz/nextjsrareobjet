import nodemailer from 'nodemailer';
import { emailConfiguration } from '@/lib/auth-email';

export type SupportEmailPayload = {
  type: 'chat' | 'feedback';
  name: string;
  email: string;
  phone?: string;
  message: string;
  queryType?: string;
  queryId?: number;
};

const DEFAULT_ADMIN_INBOX = 'alclickfz@gmail.com';

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function supportLabel(type: SupportEmailPayload['type']) {
  return type === 'chat' ? 'Chat query' : 'Brand feedback';
}

function adminInbox() {
  return process.env.SUPPORT_EMAIL_TO?.trim() || DEFAULT_ADMIN_INBOX;
}

async function deliverMail(options: {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}) {
  const { smtp, from } = emailConfiguration();
  const transport = nodemailer.createTransport(smtp);
  const result = await transport.sendMail({
    from,
    to: options.to,
    replyTo: options.replyTo,
    subject: options.subject,
    text: options.text,
    html: options.html
  });
  if (!result.accepted.length || result.rejected.length) throw new Error('Email delivery failed');
}

/** Admin notification so the team can resolve the issue. */
export async function sendAdminSupportEmail(payload: SupportEmailPayload) {
  const to = adminInbox();
  const label = supportLabel(payload.type);
  const ref = payload.queryId ? `#${payload.queryId}` : '';
  const subject = `${label} ${ref} from ${payload.name} - Rare Objet`.replace(/\s+/g, ' ').trim();
  const lines = [
    `${label} received`,
    payload.queryId ? `Reference: #${payload.queryId}` : null,
    '',
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.phone ? `Phone: ${payload.phone}` : null,
    payload.queryType ? `Query type: ${payload.queryType}` : null,
    '',
    'Message:',
    payload.message,
    '',
    'Reply to this email to contact the customer.'
  ].filter((line): line is string => line !== null);

  const html = `
    <h2>${escapeHtml(label)} received</h2>
    ${payload.queryId ? `<p><strong>Reference:</strong> #${payload.queryId}</p>` : ''}
    <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    ${payload.phone ? `<p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>` : ''}
    ${payload.queryType ? `<p><strong>Query type:</strong> ${escapeHtml(payload.queryType)}</p>` : ''}
    <p><strong>Message:</strong></p>
    <p style="white-space:pre-wrap">${escapeHtml(payload.message)}</p>
    <p>Reply to this email to contact the customer.</p>
  `;

  await deliverMail({
    to,
    replyTo: payload.email,
    subject,
    text: lines.join('\n'),
    html
  });
}

/** Auto-response to the user after their query is saved. */
export async function sendUserSupportAckEmail(payload: SupportEmailPayload) {
  const label = supportLabel(payload.type);
  const ref = payload.queryId ? ` (ref #${payload.queryId})` : '';
  const subject = payload.type === 'chat'
    ? `We received your chat query${ref} - Rare Objet`
    : `Thanks for your feedback${ref} - Rare Objet`;

  const intro = payload.type === 'chat'
    ? `Hi ${payload.name},\n\nThanks for contacting Rare Objet chat support. We have received your query${ref} and our team will review it shortly.`
    : `Hi ${payload.name},\n\nThank you for sharing your feedback with Rare Objet. We have received your note${ref} and our team will review it.`;

  const text = [
    intro,
    '',
    payload.queryType ? `Query type: ${payload.queryType}` : null,
    '',
    'Your message:',
    payload.message,
    '',
    'We will reply to this email address if we need more details or have an update.',
    '',
    '— Rare Objet Support'
  ].filter((line): line is string => line !== null).join('\n');

  const html = `
    <p>Hi ${escapeHtml(payload.name)},</p>
    <p>${payload.type === 'chat'
      ? `Thanks for contacting Rare Objet chat support. We have received your query${escapeHtml(ref)} and our team will review it shortly.`
      : `Thank you for sharing your feedback with Rare Objet. We have received your note${escapeHtml(ref)} and our team will review it.`}</p>
    ${payload.queryType ? `<p><strong>Query type:</strong> ${escapeHtml(payload.queryType)}</p>` : ''}
    <p><strong>Your message:</strong></p>
    <p style="white-space:pre-wrap">${escapeHtml(payload.message)}</p>
    <p>We will reply to this email address if we need more details or have an update.</p>
    <p>— Rare Objet Support</p>
  `;

  await deliverMail({
    to: payload.email,
    subject,
    text,
    html
  });
}

/** Sends admin + user emails after a support query is saved. */
export async function sendSupportEmails(payload: SupportEmailPayload) {
  await Promise.all([
    sendAdminSupportEmail(payload),
    sendUserSupportAckEmail(payload)
  ]);
}
