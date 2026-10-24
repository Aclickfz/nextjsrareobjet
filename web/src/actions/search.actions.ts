'use server';

import { listProducts } from '@/repositories/catalog.repository';

export async function searchSuggestions(value: string) {
  const q = value.trim().slice(0, 100);
  if (q.length < 2) return { products: [], error: false };
  try {
    const { products } = await listProducts({ q, limit: 6 });
    return { products: products.map(({ id, name, slug }) => ({ id, name, slug })), error: false };
  } catch {
    return { products: [], error: true };
  }
}
