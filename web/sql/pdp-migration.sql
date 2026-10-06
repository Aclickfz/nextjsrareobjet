-- Rich PDP fields for Pottery Barn-style product pages.
-- Safe to re-run: each statement ignores duplicate-column errors in the Node migrator.

ALTER TABLE products ADD COLUMN price_max DECIMAL(12,2) NULL AFTER price;
ALTER TABLE products ADD COLUMN collection_key VARCHAR(120) NULL AFTER grade_label;
ALTER TABLE products ADD COLUMN shown_caption VARCHAR(255) NULL AFTER collection_key;
ALTER TABLE products ADD COLUMN free_shipping TINYINT(1) NOT NULL DEFAULT 0 AFTER shown_caption;
ALTER TABLE products ADD COLUMN option_groups JSON NULL AFTER free_shipping;
ALTER TABLE products ADD COLUMN details_sections JSON NULL AFTER option_groups;
ALTER TABLE products ADD COLUMN dimensions JSON NULL AFTER details_sections;
ALTER TABLE products ADD COLUMN faqs JSON NULL AFTER dimensions;
ALTER TABLE products ADD COLUMN related_searches JSON NULL AFTER faqs;
ALTER TABLE products ADD COLUMN related_category_slugs JSON NULL AFTER related_searches;
ALTER TABLE products ADD COLUMN ask_prompts JSON NULL AFTER related_category_slugs;
ALTER TABLE products ADD COLUMN paired_slugs JSON NULL AFTER ask_prompts;
ALTER TABLE products ADD COLUMN collection_slugs JSON NULL AFTER paired_slugs;
ALTER TABLE products ADD COLUMN similar_slugs JSON NULL AFTER collection_slugs;
ALTER TABLE products ADD COLUMN still_deciding JSON NULL AFTER similar_slugs;
