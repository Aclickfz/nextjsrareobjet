import { AdminButton } from '@/components/admin/AdminForm';
import { AdminActionForm as ActionForm } from '@/components/admin/AdminForm';
import { ProductAdminFields, ProductAdminShell } from '@/components/admin/ProductAdminFields';
import { saveProductAction } from '@/actions/admin.actions';
import { adminCategories } from '@/repositories/catalog.repository';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const categories = await adminCategories();
  return (
    <ProductAdminShell title="Add product" subtitle="Upload photos and fill PDP fields for category-specific product pages.">
      <ActionForm className="admin-form" validation="product" action={saveProductAction} success="Product saved.">
        <ProductAdminFields categories={categories} />
        <AdminButton type="submit">Save product</AdminButton>
      </ActionForm>
    </ProductAdminShell>
  );
}
