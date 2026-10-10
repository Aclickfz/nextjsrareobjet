'use client';
import { useRef, useState } from 'react';
import { contentFields, contentRows, type ContentKey, type ContentRow } from '@/lib/product-content-fields';

function ContentEditor({ field, value }: { field: ContentKey; value: unknown }) {
  const config = contentFields[field];
  const [rows, setRows] = useState(() => contentRows(field, value).map((values, id) => ({ id, values })));
  const nextId = useRef(rows.length);
  const update = (id: number, column: number, value: string) => setRows(current => current.map(row => row.id === id ? { ...row, values: config.fields.map((_, index) => index === column ? value : row.values[index] || '') } : row));
  return <section style={{ marginBottom: 24 }} aria-label={config.label}>
    <h4>{config.label}</h4>
    {rows.map(row => <div key={row.id} style={{ padding: 12, marginBottom: 12, border: '1px solid #ddd', borderRadius: 6 }}>
      <div className="form-grid">{config.fields.map((label, index) => <label key={index}>{label}
        {(field === 'details_sections' && index === 1) || (field === 'faqs' && index === 1)
          ? <textarea name={`${field}_${index}`} rows={3} value={row.values[index] || ''} onChange={e => update(row.id, index, e.target.value)} />
          : <input name={`${field}_${index}`} value={row.values[index] || ''} onChange={e => update(row.id, index, e.target.value)} />}
      </label>)}</div>
      <button type="button" onClick={() => setRows(current => current.filter(item => item.id !== row.id))}>Remove row</button>
    </div>)}
    <button type="button" onClick={() => { const id = nextId.current++; setRows(current => [...current, { id, values: config.fields.map(() => '') as ContentRow }]); }}>Add {field === 'option_groups' ? 'option' : 'row'}</button>
  </section>;
}

export function ProductContentFields({ product }: { product?: Record<string, unknown> }) {
  return <>
    <h3 className="admin-section-title">Product page content (optional)</h3>
    <p className="admin-help">Only name and category are required. Add rows for the content you want to display. Use the same group name to combine product options.</p>
    {(Object.keys(contentFields) as ContentKey[]).map(field => <ContentEditor key={field} field={field} value={product?.[field]} />)}
  </>;
}
