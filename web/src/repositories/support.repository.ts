import type { ResultSetHeader } from 'mysql2/promise';
import { getPool, query } from '@/lib/db';

export type SupportQueryType = 'chat' | 'feedback';
export type SupportQueryStatus = 'new' | 'read' | 'replied' | 'closed';

export type SupportQueryInput = {
  type: SupportQueryType;
  name: string;
  email: string;
  phone?: string;
  queryType?: string;
  message: string;
  emailSent?: boolean;
};

export type SupportQueryRow = {
  id: number;
  type: SupportQueryType;
  name: string;
  email: string;
  phone: string | null;
  query_type: string | null;
  message: string;
  status: SupportQueryStatus;
  email_sent: number;
  created_at: string;
};

export async function createSupportQuery(input: SupportQueryInput) {
  const [result] = await getPool().execute<ResultSetHeader>(
    `INSERT INTO support_queries
      (type, name, email, phone, query_type, message, status, email_sent)
     VALUES
      (:type, :name, :email, :phone, :query_type, :message, 'new', :email_sent)`,
    {
      type: input.type,
      name: input.name,
      email: input.email,
      phone: input.phone || null,
      query_type: input.queryType || null,
      message: input.message,
      email_sent: input.emailSent ? 1 : 0
    }
  );
  return result.insertId;
}

export async function markSupportQueryEmailSent(id: number) {
  await getPool().execute(
    'UPDATE support_queries SET email_sent = 1 WHERE id = :id',
    { id }
  );
}

export async function listSupportQueries(limit = 100) {
  return query<SupportQueryRow[]>(
    `SELECT id, type, name, email, phone, query_type, message, status, email_sent, created_at
     FROM support_queries
     ORDER BY id DESC
     LIMIT :limit`,
    { limit }
  );
}
