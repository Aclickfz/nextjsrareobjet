'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { ChevronsUpDown } from 'lucide-react';

type ComboboxOption = string | { value: string; label: string; keywords?: string[] };
type ComboboxContextValue = {
  value: string;
  label: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  setSelection: (value: string, label: string) => void;
  items: ComboboxOption[];
};

const ComboboxContext = createContext<ComboboxContextValue | null>(null);

function useCombobox() {
  const context = useContext(ComboboxContext);
  if (!context) throw new Error('Combobox components must be used inside Combobox.');
  return context;
}

export function Combobox({
  items = [],
  value,
  onValueChange,
  children
}: {
  items?: readonly ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
}) {
  const [internalValue, setInternalValue] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('');
  const [open, setOpen] = useState(false);
  const options = [...items];
  const selectedValue = value ?? internalValue;
  const selectedOption = options.find(option => (typeof option === 'string' ? option : option.value) === selectedValue);
  const label = selectedOption
    ? typeof selectedOption === 'string' ? selectedOption : selectedOption.label
    : selectedLabel;
  const setSelection = (nextValue: string, nextLabel: string) => {
    setInternalValue(nextValue);
    setSelectedLabel(nextLabel);
    onValueChange?.(nextValue);
    setOpen(false);
  };

  return <ComboboxContext.Provider value={{ value: selectedValue, label, open, setOpen, setSelection, items: options }}>
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <CommandPrimitive>{children}</CommandPrimitive>
    </PopoverPrimitive.Root>
  </ComboboxContext.Provider>;
}

export function ComboboxInput({ placeholder, disabled, id }: { placeholder?: string; disabled?: boolean; id?: string }) {
  const { label, open, setOpen } = useCombobox();
  const [query, setQuery] = useState('');
  return <PopoverPrimitive.Anchor asChild>
    <div className="admin-combobox-input-wrap">
      <CommandPrimitive.Input
        id={id}
        value={open ? query : label}
        onValueChange={next => { setQuery(next); setOpen(true); }}
        onFocus={() => { setQuery(''); setOpen(true); }}
        onClick={() => { if (!open) setQuery(''); setOpen(true); }}
        placeholder={placeholder}
        disabled={disabled}
        role="combobox"
        aria-expanded={open}
        className="admin-combobox-input"
      />
      <ChevronsUpDown size={16} aria-hidden="true" className="admin-combobox-icon" />
    </div>
  </PopoverPrimitive.Anchor>;
}

export function ComboboxContent({ children }: { children: ReactNode }) {
  return <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      align="start"
      sideOffset={4}
      className="admin-combobox-content"
      onOpenAutoFocus={event => event.preventDefault()}
    >
      {children}
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>;
}

export function ComboboxEmpty({ children }: { children: ReactNode }) {
  return <CommandPrimitive.Empty className="admin-combobox-empty">{children}</CommandPrimitive.Empty>;
}

export function ComboboxList({ children }: { children: ReactNode }) {
  return <CommandPrimitive.List className="admin-combobox-list">{children}</CommandPrimitive.List>;
}

export function ComboboxItem({
  value,
  keywords,
  children
}: {
  value: string;
  keywords?: string[];
  children: ReactNode;
}) {
  const { setSelection } = useCombobox();
  const label = typeof children === 'string' ? children : value;
  return <CommandPrimitive.Item
    value={value}
    keywords={keywords}
    onSelect={() => setSelection(value, label)}
    className="admin-combobox-item"
  >
    {children}
  </CommandPrimitive.Item>;
}
