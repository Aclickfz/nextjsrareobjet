'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { deleteProductGalleryImageAction } from '@/actions/admin.actions';
import { useAdminForm } from '@/components/admin/AdminForm';

type ProductImage = { id: number; path: string; is_primary: number };

export function ProductGalleryImage({ image, productId }: { image: ProductImage; productId: number }) {
  const router = useRouter();
  const { pending: formPending } = useAdminForm();
  const [pending, startTransition] = useTransition();
  const primary = Boolean(image.is_primary);

  function removeImage() {
    const data = new FormData();
    data.set('product_id', String(productId));
    data.set('image_id', String(image.id));
    startTransition(async () => {
      try {
        const result = await deleteProductGalleryImageAction(data);
        if (result?.error) {
          toast.error(result.error);
          return;
        }
        toast.success('Gallery image deleted.');
        router.refresh();
      } catch {
        toast.error('Unable to delete this gallery image. Please try again.');
      }
    });
  }

  return <div className="product-gallery-item" data-primary={primary}>
    <img src={`/${image.path.replace(/^\//, '')}`} alt={primary ? 'Main product image' : 'Product gallery image'} />
    {!primary && <button
      type="button"
      className="product-gallery-remove"
      aria-label="Delete gallery image"
      title="Delete gallery image"
      disabled={pending || formPending}
      onClick={removeImage}
    >
      <X size={14} aria-hidden="true" />
    </button>}
  </div>;
}
