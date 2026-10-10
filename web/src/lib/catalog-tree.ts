export type CategoryNode = {
  id: number; name: string; slug: string; image: string | null;
  parent_id: number | null; sort_order: number; is_active: number;
};

export function categoryPath(categories: CategoryNode[], id: number): CategoryNode[] {
  const result: CategoryNode[] = [];
  const seen = new Set<number>();
  let node = categories.find((item) => item.id === id);
  while (node && !seen.has(node.id)) {
    seen.add(node.id);
    result.unshift(node);
    node = categories.find((item) => item.id === node!.parent_id);
  }
  return result;
}

export function nonNegativeInteger(value: unknown) {
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < 0) throw new Error('Sort order must be a non-negative whole number');
  return number;
}

export const STORE_TOP_SLUGS = ["furniture", "new", "outdoor", "bedding", "bath", "lighting", "rugs", "windows", "pillows-decor", "art-mirrors", "tabletop-bar", "storage", "holidays", "gifts"];
