'use client';

import { useState } from 'react';
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox';

type CategoryOption = { id: number; label: string };

export function CategoryParentCombobox({
  options,
  defaultValue
}: {
  options: CategoryOption[];
  defaultValue: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const items = options.map(option => ({ value: String(option.id), label: option.label, keywords: [option.label] }));
  return <>
    <Combobox items={items} value={value} onValueChange={setValue}>
      <ComboboxInput id="parent-category-combobox" placeholder="Select parent category" />
      <ComboboxContent>
        <ComboboxEmpty>No categories found.</ComboboxEmpty>
        <ComboboxList>
          {items.map(item => <ComboboxItem key={item.value} value={item.value} keywords={item.keywords}>{item.label}</ComboboxItem>)}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
    <select
      name="parent_id"
      value={value}
      required
      tabIndex={-1}
      aria-hidden="true"
      className="admin-select-validation"
      onChange={event => setValue(event.target.value)}
      onInvalid={event => {
        event.preventDefault();
        document.getElementById('parent-category-combobox')?.focus();
      }}
    >
      <option value="">Select parent</option>
      {options.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
    </select>
  </>;
}
