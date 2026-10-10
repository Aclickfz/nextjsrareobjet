'use client';
import { STORE_TOP_SLUGS } from '@/lib/catalog-tree';
import { useState } from 'react';
import { categoryPath, type CategoryNode } from '@/lib/catalog-tree';
export function CategoryPicker({ categories, selectedId }: { categories: CategoryNode[]; selectedId: number }) {
  const path = categoryPath(categories, selectedId);
  const [top, setTop] = useState(String(path[0]?.id || ''));
  const [group, setGroup] = useState(String(path[1]?.id || ''));
  const [sub, setSub] = useState(String(path[2]?.id || ''));
  const [child, setChild] = useState(String(path[3]?.id || ''));
  const options = (parent: string) => categories.filter(c => parent ? c.parent_id === Number(parent) : c.parent_id == null && STORE_TOP_SLUGS.includes(c.slug));
  return <div className="form-grid">
    <input type="hidden" name="category_id" value={child || sub || group || top} />
    <label>Top category<select value={top} required onChange={e => { setTop(e.target.value); setGroup(''); setSub(''); setChild(''); }}><option value="">Select top category</option>{options('').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
    <label>Category<select value={group} disabled={!top} onChange={e => { setGroup(e.target.value); setSub(''); setChild(''); }}><option value="">Directly under top category</option>{options(top).filter(() => top).map(c => <option key={c.id} value={c.id}>{c.name}{c.is_active ? '' : ' (hidden)'}</option>)}</select></label>
    <label>Subcategory<select value={sub} disabled={!group} onChange={e => { setSub(e.target.value); setChild(''); }}><option value="">Directly under category</option>{options(group).filter(() => group).map(c => <option key={c.id} value={c.id}>{c.name}{c.is_active ? '' : ' (hidden)'}</option>)}</select></label>
    {sub && options(sub).length > 0 && <label>Child / product category (optional)<select value={child} disabled={!sub} onChange={e => setChild(e.target.value)}><option value="">Use selected subcategory</option>{options(sub).map(c => <option key={c.id} value={c.id}>{c.name}{c.is_active ? '' : ' (hidden)'}</option>)}</select></label>}
  </div>;
}
