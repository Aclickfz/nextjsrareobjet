'use client';
import { AdminInput } from '@/components/admin/AdminControls';
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox';
import { STORE_TOP_SLUGS } from '@/lib/catalog-tree';
import { useState } from 'react';
import { categoryPath, type CategoryNode } from '@/lib/catalog-tree';
import { AdminFieldError } from './AdminForm';
export function CategoryPicker({ categories, selectedId }: { categories: CategoryNode[]; selectedId: number }) {
  const path = categoryPath(categories, selectedId);
  const [top, setTop] = useState(String(path[0]?.id || ''));
  const [group, setGroup] = useState(String(path[1]?.id || ''));
  const [sub, setSub] = useState(String(path[2]?.id || ''));
  const [child, setChild] = useState(String(path[3]?.id || ''));
  const options = (parent: string) => categories.filter(c => parent ? c.parent_id === Number(parent) : c.parent_id == null && STORE_TOP_SLUGS.includes(c.slug));
  const categoryOptions = (parent: string) => options(parent).map(category => ({
    value: String(category.id),
    label: `${category.name}${category.is_active ? '' : ' (hidden)'}`,
    keywords: [category.name]
  }));
  const picker = (items: ReturnType<typeof categoryOptions>, value: string, placeholder: string, disabled: boolean, onValueChange: (value: string) => void, id?: string) => (
    <Combobox items={items} value={value} onValueChange={onValueChange}>
      <ComboboxInput placeholder={placeholder} disabled={disabled} id={id} />
      <ComboboxContent>
        <ComboboxEmpty>No categories found.</ComboboxEmpty>
        <ComboboxList>
          {items.map(item => <ComboboxItem key={item.value} value={item.value} keywords={item.keywords}>{item.label}</ComboboxItem>)}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
  return <div className="form-grid">
    <AdminInput type="hidden" name="category_id" value={child || sub || group || top} />
    <AdminFieldError name="category_id" />
    <select required value={top} tabIndex={-1} aria-hidden="true" className="admin-select-validation" onChange={() => {}} onInvalid={event => {
      event.preventDefault();
      document.getElementById('top-category-combobox')?.focus();
    }}>
      <option value="">Select top category</option>
      {options('').map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
    </select>
    <label>Top category{picker(categoryOptions(''), top, 'Select top category', false, value => { setTop(value); setGroup(''); setSub(''); setChild(''); }, 'top-category-combobox')}</label>
    <label>Category{picker(categoryOptions(top), group, 'Directly under top category', !top, value => { setGroup(value); setSub(''); setChild(''); })}</label>
    <label>Subcategory{picker(categoryOptions(group), sub, 'Directly under category', !group, value => { setSub(value); setChild(''); })}</label>
    {sub && options(sub).length > 0 && <label>Child / product category (optional){picker(categoryOptions(sub), child, 'Use selected subcategory', !sub, setChild)}</label>}
  </div>;
}
