-- Rewrite legacy upload path prefixes to match rareobjet-media folders.
-- Safe to re-run: only rows still starting with uploads/... are updated.

UPDATE product_images
SET path = CONCAT('products/', SUBSTRING(path, LENGTH('uploads/products/') + 1))
WHERE path LIKE 'uploads/products/%';

UPDATE categories
SET image = CONCAT('category/', SUBSTRING(image, LENGTH('uploads/categories/') + 1))
WHERE image LIKE 'uploads/categories/%';

UPDATE site_media
SET path = CONCAT('banner/', SUBSTRING(path, LENGTH('uploads/homepage/') + 1))
WHERE path LIKE 'uploads/homepage/%';
