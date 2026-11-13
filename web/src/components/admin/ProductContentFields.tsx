'use client';

import { AdminInput, AdminTextarea } from '@/components/admin/AdminControls';
import { AdminButton } from '@/components/admin/AdminForm';
import { Plus, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { contentFields, contentRows, type ContentKey, type ContentRow } from '@/lib/product-content-fields';

function ContentEditor({ field, value }: { field: ContentKey; value: unknown }) {
  const config = contentFields[field];
  const [rows, setRows] = useState(() => contentRows(field, value).map((values, id) => ({ id, values })));
  const nextId = useRef(rows.length);

  const update = (id: number, column: number, next: string) =>
    setRows((current) =>
      current.map((row) =>
        row.id === id
          ? { ...row, values: config.fields.map((_, index) => (index === column ? next : row.values[index] || '')) }
          : row
      )
    );

  const addRow = () => {
    const id = nextId.current++;
    setRows((current) => [...current, { id, values: config.fields.map(() => '') as ContentRow }]);
  };

  return (
    <section className="admin-content-block" aria-label={config.label}>
      <div className="admin-content-block-head">
        <h4>{config.label}</h4>
        <AdminButton type="button" size="sm" variant="outline" onClick={addRow}>
          <Plus size={14} aria-hidden="true" />
          Add row
        </AdminButton>
      </div>

      {rows.length === 0 ? (
        <p className="admin-help">No rows yet. Use Add row to include this section on the PDP.</p>
      ) : (
        <div className="admin-content-rows">
          {rows.map((row, index) => (
            <div key={row.id} className="admin-content-row">
              <div className="admin-content-row-fields form-grid">
                {config.fields.map((label, column) => (
                  <label key={column}>
                    {label}
                    {(field === 'details_sections' && column === 1) || (field === 'faqs' && column === 1) ? (
                      <AdminTextarea
                        name={`${field}_${column}`}
                        rows={3}
                        value={row.values[column] || ''}
                        onChange={(e) => update(row.id, column, e.target.value)}
                      />
                    ) : (
                      <AdminInput
                        name={`${field}_${column}`}
                        value={row.values[column] || ''}
                        onChange={(e) => update(row.id, column, e.target.value)}
                      />
                    )}
                  </label>
                ))}
              </div>
              <div className="admin-content-row-actions">
                <AdminButton
                  type="button"
                  size="sm"
                  variant="ghost"
                  aria-label={`Remove row ${index + 1}`}
                  onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))}
                >
                  <Trash2 size={14} aria-hidden="true" />
                  Remove
                </AdminButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function ProductContentFields({ product }: { product?: Record<string, unknown> }) {
  return (
    <>
      <h3 className="admin-section-title">Product page content (optional)</h3>
      <p className="admin-help">Only name and category are required. Add rows for the content you want to display.</p>
      {(Object.keys(contentFields) as ContentKey[]).map((field) => (
        <ContentEditor key={field} field={field} value={product?.[field]} />
      ))}
    </>
  );
}
