import { z } from 'zod';
import { AdminValidationError } from './admin-action-result';

/** Max size for a single admin image upload. */
export const MAX_ADMIN_IMAGE_BYTES = 50 * 1024 * 1024;
/** Max combined multipart payload for one admin form submit (leaves headroom under bodySizeLimit). */
export const MAX_ADMIN_UPLOAD_TOTAL_BYTES = 190 * 1024 * 1024;

const optionalMoney = z.preprocess(value => value === '' || value == null ? undefined : value, z.coerce.number().finite().nonnegative('Enter a positive amount or zero.').optional());
const productSchema = z.object({
  name: z.string().trim().min(1, 'Enter a product name.').max(200, 'Use at most 200 characters.'),
  category_id: z.coerce.number().int().positive('Choose a category.'),
  price: optionalMoney,
  price_max: optionalMoney,
  compare_at_price: optionalMoney,
  stock_qty: z.coerce.number().int('Stock must be a whole number.').nonnegative('Stock cannot be negative.'),
  sort_order: z.coerce.number().int('Sort order must be a whole number.').nonnegative('Sort order cannot be negative.')
});

export function validateAdminUpload(form: FormData) {
  const fields: Record<string, string[]> = {};
  let total = 0;
  for (const [name, value] of form.entries()) {
    if (value instanceof File) {
      total += value.size;
      if (value.size && (!value.type.startsWith('image/') || value.size > MAX_ADMIN_IMAGE_BYTES)) {
        fields[name] = ['Choose image files no larger than 50 MB each.'];
      }
    } else total += new TextEncoder().encode(value).length;
  }
  // Leave room for multipart boundaries and Server Action metadata.
  if (total > MAX_ADMIN_UPLOAD_TOTAL_BYTES) {
    throw new AdminValidationError('The combined upload is too large. Keep this form below 190 MB; save additional gallery images separately.');
  }
  if (Object.keys(fields).length) throw new AdminValidationError('Check the selected images.', fields);
}

export function validateProductForm(form: FormData) {
  const parsed = productSchema.safeParse(Object.fromEntries(form.entries()));
  if (!parsed.success) throw new AdminValidationError('Check the product details below.', z.flattenError(parsed.error).fieldErrors);
  validateAdminUpload(form);
}
