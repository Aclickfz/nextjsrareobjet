import Link from 'next/link';
import { AdminButton } from '@/components/admin/AdminForm';
import { AdminActionForm as ActionForm } from '@/components/admin/AdminForm';
import { ProductAdminFields, ProductAdminShell } from '@/components/admin/ProductAdminFields';
import { saveProductAction } from '@/actions/admin.actions';
import { adminCategories } from '@/repositories/catalog.repository';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const categories = await adminCategories();
  return (
    <ProductAdminShell
      title="Add product"
      subtitle="Upload photos and fill PDP fields for category-specific product pages."
      actions={
        <AdminButton asChild variant="outline">
          <Link href="/admin/products">Cancel</Link>
        </AdminButton>
      }
    >
      <ActionForm className="admin-form admin-form-crm" validation="product" action={saveProductAction} success="Product saved.">
        <ProductAdminFields categories={categories} />
        <div className="admin-form-actions">
          <AdminButton asChild variant="outline">
            <Link href="/admin/products">Cancel</Link>
          </AdminButton>
          <AdminButton type="submit">Save product</AdminButton>
        </div>
      </ActionForm>
    </ProductAdminShell>
  );
}
