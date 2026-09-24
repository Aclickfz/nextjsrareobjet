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
      <div className="page-head"><div><h2>Inventory</h2><p>Adjust stock. Every change is stored in the history below.</p></div></div>
      <form className="admin-form" action={adjustStockAction} style={{ marginBottom: 24 }}>
        <label>Product
          <select name="product_id">{products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select>
        </label>
        <label>Change<input name="change_qty" type="number" required /></label>
        <label>Note<input name="note" /></label>
        <button type="submit">Adjust</button>
      </form>
      <table className="admin-table">
        <thead><tr><th>Product</th><th>SKU</th><th>Stock</th></tr></thead>
        <tbody>{products.map((product) => <tr key={product.id}><td>{product.name}</td><td>{product.sku}</td><td>{product.stock_qty}</td></tr>)}</tbody>
      </table>
      <h3 style={{ marginTop: 32 }}>Stock history</h3>
      <table className="admin-table">
        <thead><tr><th>When</th><th>Product</th><th>Change</th><th>Reason</th><th>Note</th></tr></thead>
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
    </>
  );
}
