'use server';

import { listProducts, searchCategories } from '@/repositories/catalog.repository';

export async function searchSuggestions(value: string) {
  const q = value.trim().slice(0, 100);
  if (q.length < 2) return { products: [], categories: [], error: false };
  try {
    const [productData, categories] = await Promise.all([
      listProducts({ q, limit: 6 }),
      searchCategories(q, 6)
    ]);
    return {
      products: productData.products.map(({ id, name, slug }) => ({ id, name, slug })),
      categories: categories.map(({ id, name, slug }) => ({ id, name, slug })),
      error: false
    };
  } catch {
    return { products: [], categories: [], error: true };
  }
}
