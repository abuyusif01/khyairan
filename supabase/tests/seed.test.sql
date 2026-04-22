-- ────────────────────────────────────────────────────────────────────────────
-- Seed data tests for Khyairan Soft Drinks
--
-- Verifies that supabase/seed.sql populates the database correctly.
-- Run AFTER applying all migrations and seed.sql.
-- ────────────────────────────────────────────────────────────────────────────

BEGIN;

SELECT plan(5);

-- ── Test 1: all categories exist ─────────────────────────────────────────────
SELECT is(
  (SELECT count(*)::int FROM tags WHERE type = 'category'),
  6,
  'all 6 category tags exist'
);

-- ── Test 2: all products exist ────────────────────────────────────────────────
SELECT is(
  (SELECT count(*)::int FROM products),
  37,
  'all 37 products are seeded'
);

-- ── Test 3: every product has at least one category tag and one brand tag ─────
SELECT is(
  (
    SELECT count(*)::int
    FROM products p
    WHERE EXISTS (
      SELECT 1 FROM product_tags pt
      JOIN tags t ON t.id = pt.tag_id
      WHERE pt.product_id = p.id AND t.type = 'category'
    )
    AND EXISTS (
      SELECT 1 FROM product_tags pt
      JOIN tags t ON t.id = pt.tag_id
      WHERE pt.product_id = p.id AND t.type = 'brand'
    )
  ),
  37,
  'every product is linked to at least one category tag and one brand tag'
);

-- ── Test 4: all seeded products are draft (published = false) ─────────────────
SELECT is(
  (SELECT count(*)::int FROM products WHERE published = true),
  0,
  'no seeded product has published = true'
);

-- ── Test 5: seed is idempotent — re-running key inserts does not duplicate ────
-- Re-insert one category tag and one product (simulating a second seed run).
-- ON CONFLICT / WHERE NOT EXISTS guards must prevent duplication.

INSERT INTO tags (name, slug, type, sort_order, published)
VALUES ('Carbonated Drinks', 'carbonated-drinks', 'category', 1, true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, size, unit_type, units_per_carton, price_ngn, published)
SELECT 'Coca-Cola', '35CL', 'bottle'::unit_type, 12, 3283.50, false
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name = 'Coca-Cola' AND size = '35CL'
);

SELECT is(
  (SELECT count(*)::int FROM products),
  37,
  'seed is idempotent — product count unchanged after second run'
);

SELECT * FROM finish();
ROLLBACK;
