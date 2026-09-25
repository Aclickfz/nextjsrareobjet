import { ActionForm } from '@/components/ui/ActionForm';
import Link from 'next/link';
import { logoutAction, requireAdmin } from '@/actions/auth.actions';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="admin-shell">
      <link rel="stylesheet" href="/admin/admin.css" />
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <strong>JustAclick</strong>
          <span>Commerce CRM</span>
        </div>
        <div className="nav-label">Overview</div>
        <Link href="/admin/dashboard">Dashboard</Link>
        <Link href="/admin/reports">Sales</Link>
        <div className="nav-label">Catalog</div>
        <Link href="/admin/categories">Categories</Link>
        <Link href="/admin/products">Products</Link>
        <Link href="/admin/products/new">Add product</Link>
        <Link href="/admin/inventory">Inventory</Link>
        <div className="nav-label">Shop flow</div>
        <Link href="/admin/orders">Orders</Link>
        <Link href="/admin/customers">Customers</Link>
        <ActionForm action={logoutAction} success="You have been signed out." successPath="/"><button type="submit">Log out</button></ActionForm>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
