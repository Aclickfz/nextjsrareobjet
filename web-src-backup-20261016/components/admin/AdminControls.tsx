'use client';

import { Children, isValidElement, useId, useState, type ComponentProps, type ReactElement, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminForm, AdminFieldError } from './AdminForm';

export function AdminInput({ name, type, ...props }: ComponentProps<typeof Input>) {
  const { fieldErrors } = useAdminForm();
  const id = useId();
  if (type === 'hidden') return <input type="hidden" name={name} {...props} />;
  return <><Input {...props} name={name} type={type} aria-invalid={Boolean(name && fieldErrors[name])} aria-describedby={name && fieldErrors[name] ? id : props['aria-describedby']} /><AdminFieldError name={name} id={id} /></>;
}
export function AdminTextarea({ name, ...props }: ComponentProps<typeof Textarea>) {
  const { fieldErrors } = useAdminForm();
  const id = useId();
  return <><Textarea {...props} name={name} aria-invalid={Boolean(name && fieldErrors[name])} aria-describedby={name && fieldErrors[name] ? id : props['aria-describedby']} /><AdminFieldError name={name} id={id} /></>;
}
export function AdminCheckbox(props: ComponentProps<typeof Checkbox>) {
  const { pending } = useAdminForm();
  return <Checkbox {...props} disabled={props.disabled || pending} />;
}

type OptionProps = { value?: string | number; disabled?: boolean; children: ReactNode };
type SelectProps = Omit<ComponentProps<'select'>, 'onChange' | 'multiple' | 'size' | 'value' | 'defaultValue'> & {
  value?: string | number;
  defaultValue?: string | number;
  onValueChange?: (value: string) => void;
};

// Keep existing server-rendered option lists and form names while using Radix Select.
export function AdminSelect({ children, value, defaultValue, onValueChange, name, required, disabled, className, id, ...props }: SelectProps) {
  const options = Children.toArray(children).filter(isValidElement) as ReactElement<OptionProps>[];
  const [localValue, setLocalValue] = useState(String(defaultValue ?? options[0]?.props.value ?? ''));
  const selected = String(value ?? localValue);
  const { pending, fieldErrors } = useAdminForm();
  const formStatus = useFormStatus();
  const unique = useId();
  const invalid = Boolean(name && fieldErrors[name]);
  const empty = '__admin_empty__';
  return <>
    <Select value={selected || empty} disabled={disabled || pending || formStatus.pending} onValueChange={next => {
      const nextValue = next === empty ? '' : next;
      setLocalValue(nextValue);
      onValueChange?.(nextValue);
    }}>
      <SelectTrigger id={id || unique} className={className} aria-label={props['aria-label']} aria-required={required} aria-invalid={invalid} aria-describedby={invalid ? `${unique}-error` : props['aria-describedby']}><SelectValue /></SelectTrigger>
      <SelectContent>{options.map((option, index) => <SelectItem key={index} value={String(option.props.value ?? '') || empty} disabled={option.props.disabled}>{option.props.children}</SelectItem>)}</SelectContent>
    </Select>
    <select name={name} value={selected} required={required} disabled={disabled || pending} tabIndex={-1} aria-hidden="true" className="admin-select-validation" onChange={event => {
      setLocalValue(event.target.value);
      onValueChange?.(event.target.value);
    }} onInvalid={event => {
      event.preventDefault();
      document.getElementById(id || unique)?.focus();
    }}>
      {options.map((option, index) => <option key={index} value={String(option.props.value ?? '')} disabled={option.props.disabled}>{option.props.children}</option>)}
    </select>
    <AdminFieldError name={name} id={`${unique}-error`} />
  </>;
}
