import Link from 'next/link';
import { AdminInput, AdminTextarea } from '@/components/admin/AdminControls';
import { AdminButton, AdminFilterForm } from '@/components/admin/AdminForm';
import { AdminActionForm as ActionForm } from '@/components/admin/AdminForm';
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
        <div className="page-head">
          <div>
            <h2>{customer.name}</h2>
            <p>{customer.email}</p>
          </div>
          <div className="page-head-actions">
            <AdminButton asChild variant="outline">
              <Link href="/admin/customers">Back</Link>
            </AdminButton>
          </div>
        </div>
        <div className="panel panel-form">
          <ActionForm className="admin-form" action={saveCustomerAction} success="Customer saved.">
            <AdminInput type="hidden" name="id" value={customer.id} />
            <label>
              Phone
              <AdminInput name="phone" defaultValue={customer.phone || ''} />
            </label>
            <label>
              Notes
              <AdminTextarea name="notes" defaultValue={customer.notes || ''} />
            </label>
            <div className="admin-form-actions">
              <AdminButton asChild variant="outline">
                <Link href="/admin/customers">Cancel</Link>
              </AdminButton>
              <AdminButton type="submit">Save customer</AdminButton>
            </div>
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
      <div className="page-head">
        <div>
          <h2>Customers</h2>
          <p>Search shoppers and keep phone and notes.</p>
        </div>
      </div>
      <AdminFilterForm className="filters" key={q || ''}>
        <AdminInput name="q" aria-label="Search customers" defaultValue={q || ''} placeholder="Search name, email, phone" />
        <div className="filters-actions">
          <AdminButton type="submit" loadingText="Searching…">
            Search
          </AdminButton>
        </div>
      </AdminFilterForm>
      <div className="panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Orders</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.orders}</td>
                <td>
                  <div className="row-actions">
                    <Link href={`?id=${customer.id}`}>Open</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
