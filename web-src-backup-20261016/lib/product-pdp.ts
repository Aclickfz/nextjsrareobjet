export type OptionSwatch = {
  name: string;
  image?: string;
  hex?: string;
};

export type OptionGroup = {
  name: string;
  options: OptionSwatch[];
};

export type DetailSection = {
  title: string;
  items: string[];
};

export type DimensionRow = {
  label: string;
  value: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type StillDecidingLink = {
  label: string;
  href: string;
  icon?: string;
};

export type RelatedChip = {
  label: string;
  href?: string;
};

export type ProductPdpFields = {
  price_max?: number | null;
  collection_key?: string | null;
  shown_caption?: string | null;
  free_shipping?: number | boolean | null;
  option_groups?: OptionGroup[] | string | null;
  details_sections?: DetailSection[] | string | null;
  dimensions?: DimensionRow[] | string | null;
  faqs?: FaqItem[] | string | null;
  related_searches?: RelatedChip[] | string | null;
  related_category_slugs?: RelatedChip[] | string | null;
  ask_prompts?: string[] | string | null;
  paired_slugs?: string[] | string | null;
  collection_slugs?: string[] | string | null;
  similar_slugs?: string[] | string | null;
  still_deciding?: StillDecidingLink[] | string | null;
};

export function parseJsonField<T>(value: unknown, fallback: T): T {
  if (value == null || value === '') return fallback;
  if (typeof value === 'object') return value as T;
  try {
    return JSON.parse(String(value)) as T;
  } catch {
    return fallback;
  }
}

export function normalizePdp(product: ProductPdpFields) {
  return {
    price_max: product.price_max != null ? Number(product.price_max) : null,
    collection_key: product.collection_key || null,
    shown_caption: product.shown_caption || null,
    free_shipping: Boolean(Number(product.free_shipping || 0)),
    option_groups: parseJsonField<OptionGroup[]>(product.option_groups, []),
    details_sections: parseJsonField<DetailSection[]>(product.details_sections, []),
    dimensions: parseJsonField<DimensionRow[]>(product.dimensions, []),
    faqs: parseJsonField<FaqItem[]>(product.faqs, []),
    related_searches: parseJsonField<RelatedChip[]>(product.related_searches, []),
    related_category_slugs: parseJsonField<RelatedChip[]>(product.related_category_slugs, []),
    ask_prompts: parseJsonField<string[]>(product.ask_prompts, []),
    paired_slugs: parseJsonField<string[]>(product.paired_slugs, []),
    collection_slugs: parseJsonField<string[]>(product.collection_slugs, []),
    similar_slugs: parseJsonField<string[]>(product.similar_slugs, []),
    still_deciding: parseJsonField<StillDecidingLink[]>(product.still_deciding, [
      { label: 'Chat with a Design Specialist', href: '/contact', icon: 'bx-message-rounded-dots' },
      { label: 'Request A Free Design Appointment', href: '/contact', icon: 'bx-home-alt' }
    ])
  };
}

export function stringifyJsonField(value: unknown) {
  if (value == null || value === '') return null;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    JSON.parse(trimmed);
    return trimmed;
  }
  return JSON.stringify(value);
}
