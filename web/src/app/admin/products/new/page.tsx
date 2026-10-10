import { ActionForm } from '@/components/ui/ActionForm';
import { ProductAdminFields, ProductAdminShell } from '@/components/admin/ProductAdminFields';
import { saveProductAction } from '@/actions/admin.actions';
import { adminCategories } from '@/repositories/catalog.repository';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const categories = await adminCategories();
  return (
    <ProductAdminShell title="Add product" subtitle="Upload photos and fill PDP fields for category-specific product pages.">
      <ActionForm className="admin-form" action={saveProductAction} success="Product saved." successPath="/admin/products">
        <ProductAdminFields categories={categories} />
        <button type="submit">Save product</button>
      </ActionForm>
    </ProductAdminShell>
  );
}
