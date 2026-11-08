'use server';

import { emailConfiguration } from '@/lib/auth-email';
import { validEmail } from '@/lib/auth-validation';
import { sendSupportEmails } from '@/lib/support-email';
import { createSupportQuery, markSupportQueryEmailSent } from '@/repositories/support.repository';

export type SupportQueryResult = { ok: true; message: string } | { ok: false; message: string };

const CHAT_QUERY_TYPES = new Set([
  'Product advice',
  'Order status',
  'Shipping / delivery',
  'Returns',
  'Other'
]);

const FEEDBACK_QUERY_TYPES = new Set([
  'Product quality',
  'Website experience',
  'Packaging',
  'Delivery',
  'Suggestion',
  'Other'
]);

function readField(formData: FormData, key: string) {
  return String(formData.get(key) || '').trim();
}

export async function submitSupportQuery(formData: FormData): Promise<SupportQueryResult> {
  const typeRaw = readField(formData, 'type');
  const type = typeRaw === 'feedback' ? 'feedback' : typeRaw === 'chat' ? 'chat' : null;
  const name = readField(formData, 'name');
  const email = readField(formData, 'email').toLowerCase();
  const phone = readField(formData, 'phone');
  const message = readField(formData, 'message');
  const queryType = readField(formData, 'queryType');
  const allowedTypes = type === 'feedback' ? FEEDBACK_QUERY_TYPES : CHAT_QUERY_TYPES;

  if (!type) return { ok: false, message: 'Invalid request type.' };
  if (!name || name.length > 120) return { ok: false, message: 'Enter your name (up to 120 characters).' };
  if (!validEmail(email)) return { ok: false, message: 'Enter a valid email address.' };
  if (phone && phone.length > 40) return { ok: false, message: 'Phone number is too long.' };
  if (!queryType || !allowedTypes.has(queryType)) return { ok: false, message: 'Select a query type.' };
  if (!message || message.length < 10 || message.length > 4000) {
    return { ok: false, message: 'Enter a message between 10 and 4000 characters.' };
  }

  let queryId: number;
  try {
    queryId = await createSupportQuery({
      type,
      name,
      email,
      phone: phone || undefined,
      queryType,
      message,
      emailSent: false
    });
  } catch {
    return { ok: false, message: 'Could not save your message. Please try again shortly.' };
  }

  try {
    emailConfiguration();
    await sendSupportEmails({
      type,
      name,
      email,
      phone: phone || undefined,
      message,
      queryType,
      queryId
    });
    await markSupportQueryEmailSent(queryId);
  } catch {
    // Query is already stored; email delivery is best-effort.
  }

  return {
    ok: true,
    message: type === 'chat'
      ? 'Your chat query was saved. A confirmation email is on the way.'
      : 'Thank you — your feedback was saved. A confirmation email is on the way.'
  };
}
