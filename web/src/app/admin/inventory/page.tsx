import { AdminInput, AdminSelect } from '@/components/admin/AdminControls';
import { AdminButton } from '@/components/admin/AdminForm';
import { AdminActionForm as ActionForm } from '@/components/admin/AdminForm';
import { adjustStockAction } from '@/actions/admin.actions';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
  const products = await query<{ id: number; name: string; sku: string | null; stock_qty: number }[]>(
    'SELECT id, name, sku, stock_qty FROM products WHERE is_active = 1 ORDER BY stock_qty ASC LIMIT 100'
  );
  const logs = await query<{ id: number; product_name: string; change_qty: number; reason: string; note: string | null; created_at: string }[]>(
    `SELECT l.id, p.name AS product_name, l.change_qty, l.reason, l.note, l.created_at
     FROM inventory_logs l JOIN products p ON p.id = l.product_id
     ORDER BY l.created_at DESC LIMIT 30`
  );

  return (
    <>
      <div className="page-head">
        <div>
          <h2>Inventory</h2>
          <p>Adjust stock. Every change is stored in the history below.</p>
        </div>
      </div>

      <div className="panel panel-form">
        <div className="panel-head">
          <h3>Adjust stock</h3>
        </div>
        <ActionForm className="admin-form" action={adjustStockAction} success="Stock updated.">
          <div className="form-grid">
            <label>
              Product
              <AdminSelect name="product_id">
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </AdminSelect>
            </label>
            <label>
              Change
              <AdminInput name="change_qty" type="number" required />
            </label>
            <label>
              Note
              <AdminInput name="note" />
            </label>
          </div>
          <div className="admin-form-actions">
            <AdminButton type="submit">Adjust</AdminButton>
          </div>
        </ActionForm>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>Current stock</h3>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.sku}</td>
                <td>{product.stock_qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>Stock history</h3>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>When</th>
              <th>Product</th>
              <th>Change</th>
              <th>Reason</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.created_at}</td>
                <td>{log.product_name}</td>
                <td>{log.change_qty}</td>
                <td>{log.reason}</td>
                <td>{log.note || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
