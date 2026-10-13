export const contentFields = {
  option_groups: { label: 'Product options', fields: ['Group name', 'Option name', 'Image path', 'Color code'] },
  details_sections: { label: 'Details sections', fields: ['Section title', 'Items (one per line)'] },
  dimensions: { label: 'Dimensions', fields: ['Label', 'Value'] },
  faqs: { label: 'Frequently asked questions', fields: ['Question', 'Answer'] },
  related_searches: { label: 'Related searches', fields: ['Label', 'Link (optional)'] },
  related_category_slugs: { label: 'Related categories', fields: ['Label', 'Category link'] },
  ask_prompts: { label: 'Suggested questions', fields: ['Question'] },
  paired_slugs: { label: 'Frequently paired products', fields: ['Product slug'] },
  collection_slugs: { label: 'Collection products', fields: ['Product slug'] },
  similar_slugs: { label: 'Similar products', fields: ['Product slug'] },
  still_deciding: { label: 'Help links', fields: ['Label', 'Link', 'Icon class (optional)'] }
} as const;
export type ContentKey = keyof typeof contentFields;
export type ContentRow = string[];

export function contentRows(key: ContentKey, value: unknown): ContentRow[] {
  let parsed = value;
  if (typeof value === 'string') {
    try { parsed = JSON.parse(value); } catch { return []; }
  }
  if (!Array.isArray(parsed)) return [];
  const text = (value: unknown) => typeof value === 'string' ? value : '';
  return parsed.flatMap(item => {
    if (typeof item === 'string') return [[item]];
    if (!item || typeof item !== 'object') return [];
    switch (key) {
      case 'option_groups': return Array.isArray(item.options) ? item.options.map((option: { name?: string; image?: string; hex?: string }) => [text(item.name), text(option.name), text(option.image), text(option.hex)]) : [];
      case 'details_sections': return [[text(item.title), Array.isArray(item.items) ? item.items.filter((v: unknown) => typeof v === 'string').join('\n') : '']];
      case 'dimensions': return [[text(item.label), text(item.value)]];
      case 'faqs': return [[text(item.question), text(item.answer)]];
      case 'still_deciding': return [[text(item.label), text(item.href), text(item.icon)]];
      default: return [[text(item.label), text(item.href)]];
    }
  });
}

export function buildProductContent(key: ContentKey, form: FormData): string | null {
  const columns = contentFields[key].fields.map((_, index) => form.getAll(`${key}_${index}`).map(value => String(value).trim()));
  const rows = (columns[0] || []).map((_, row) => columns.map(column => column[row] || '')).filter(row => row.some(Boolean));
  if (!rows.length) return null;
  let result: unknown[];
  if (key === 'option_groups') {
    const groups = new Map<string, { name: string; image?: string; hex?: string }[]>();
    for (const [group, name, image, hex] of rows) {
      if (!name) continue;
      const label = group || 'Options';
      groups.set(label, [...(groups.get(label) || []), { name, ...(image ? { image } : {}), ...(hex ? { hex } : {}) }]);
    }
    result = [...groups].map(([name, options]) => ({ name, options }));
  } else {
    result = rows.flatMap<unknown>(([first, second, third]) => {
      switch (key) {
        case 'details_sections': {
          const items = (second || '').split(/\r?\n/).map(line => line.trim().replace(/^(?:[\u2022*-]\s*|\d+[.)]\s+)/u, '')).filter(Boolean);
          return first || items.length ? [{ title: first || 'Details', items }] : [];
        }
        case 'dimensions': return first ? [{ label: first, value: second || '' }] : [];
        case 'faqs': return first ? [{ question: first, answer: second || '' }] : [];
        case 'related_searches': case 'related_category_slugs': return first ? [{ label: first, ...(second ? { href: second } : {}) }] : [];
        case 'still_deciding': return first ? [{ label: first, href: second || '/contact', ...(third ? { icon: third } : {}) }] : [];
        default: return first ? [first] : [];
      }
    });
  }
  return result.length ? JSON.stringify(result) : null;
}
