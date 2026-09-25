import { ActionForm } from '@/components/ui/ActionForm';
import { saveCustomerAction } from '@/actions/admin.actions';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ q?: string; id?: string }> }) {
  const { q, id } = await searchParams;
  if (id) {
    const rows = await query<{ id: number; name: string; email: string; phone: string | null; notes: string | null }[]>(
      "SELECT id, name, email, phone, notes FROM users WHERE id = :id AND role = 'customer'",
      { id: Number(id) }
    );
    const customer = rows[0];
    if (!customer) return <p>Customer not found</p>;
    return (
      <>
        <div className="page-head"><div><h2>{customer.name}</h2><p>{customer.email}</p></div></div>
        <div className="panel">
        <ActionForm className="admin-form" action={saveCustomerAction} success="Customer saved.">
          <input type="hidden" name="id" value={customer.id} />
          <label>Phone<input name="phone" defaultValue={customer.phone || ''} /></label>
          <label>Notes<textarea name="notes" defaultValue={customer.notes || ''} /></label>
          <button type="submit">Save customer</button>
        </ActionForm>
        </div>
      </>
    );
  }
  const params: Record<string, unknown> = {};
  let where = "u.role = 'customer'";
  if (q) {
    where += ' AND (u.name LIKE :q OR u.email LIKE :q OR u.phone LIKE :q)';
    params.q = `%${q}%`;
  }
  const customers = await query<{ id: number; name: string; email: string; orders: number }[]>(
    `SELECT u.id, u.name, u.email, COUNT(o.id) AS orders FROM users u LEFT JOIN orders o ON o.user_id = u.id WHERE ${where} GROUP BY u.id ORDER BY u.id DESC LIMIT 100`,
    params
  );
  return (
    <>
      <div className="page-head"><div><h2>Customers</h2><p>Search shoppers and keep phone and notes.</p></div></div>
      <form><input name="q" defaultValue={q || ''} placeholder="Search name, email, phone" /></form>
      <table className="admin-table">
        <thead><tr><th>Name</th><th>Email</th><th>Orders</th><th></th></tr></thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}><td>{customer.name}</td><td>{customer.email}</td><td>{customer.orders}</td><td><a href={`?id=${customer.id}`}>Open</a></td></tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
