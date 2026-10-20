// Store optional plain text and pasted bullets in the JSON shape used by the PDP.
export function optionalProductContent(key: string, value: unknown): string | null {
  const raw = String(value || '').trim();
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed == null) return null;
    if (Array.isArray(parsed)) return JSON.stringify(parsed);
    if (typeof parsed === 'object') return JSON.stringify([parsed]);
  } catch { /* Plain text is accepted below. */ }
  const lines = raw.split(/\r?\n/).map(line => line.trim().replace(/^(?:[•*-]\s*|\d+[.)]\s+)/u, '').trim()).filter(Boolean);
  const pair = (line: string): [string, string] => {
    const index = line.indexOf(':');
    return index < 0 ? [line, ''] : [line.slice(0, index).trim(), line.slice(index + 1).trim()];
  };
  switch (key) {
    case 'option_groups': return JSON.stringify([{ name: 'Options', options: lines.map(name => ({ name })) }]);
    case 'details_sections': return JSON.stringify([{ title: 'Details', items: lines }]);
    case 'dimensions': return JSON.stringify(lines.map(line => { const [label, value] = pair(line); return { label, value }; }));
    case 'faqs': return JSON.stringify(lines.map(line => { const [question, answer] = pair(line); return { question, answer }; }));
    case 'related_searches': return JSON.stringify(lines.map(label => ({ label })));
    case 'related_category_slugs': return JSON.stringify(lines.map(slug => ({ label: slug, href: `/categories/${encodeURIComponent(slug)}` })));
    case 'still_deciding': return JSON.stringify(lines.map(line => {
      const separator = line.indexOf('|');
      return separator < 0 ? { label: line, href: '/contact' } : { label: line.slice(0, separator).trim(), href: line.slice(separator + 1).trim() || '/contact' };
    }));
    default: return JSON.stringify(lines);
  }
}
