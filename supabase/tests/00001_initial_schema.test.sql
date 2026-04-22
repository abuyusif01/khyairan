BEGIN;

SELECT plan(29);

-- ── Tables exist ─────────────────────────────────────────────────────────────
SELECT has_table('public', 'products',     'products table exists');
SELECT has_table('public', 'tags',         'tags table exists');
SELECT has_table('public', 'product_tags', 'product_tags join table exists');
SELECT has_table('public', 'profiles',     'profiles table exists');

-- ── Enum types exist and have correct values ─────────────────────────────────
SELECT has_type('public', 'unit_type', 'unit_type enum exists');
SELECT has_type('public', 'user_role', 'user_role enum exists');

SELECT is(
  (SELECT array_agg(e.enumlabel ORDER BY e.enumsortorder)
   FROM pg_enum e JOIN pg_type t ON t.oid = e.enumtypid
   WHERE t.typname = 'unit_type'),
  ARRAY['bottle','can','pack','cup','pouch'],
  'unit_type has correct values'
);

SELECT is(
  (SELECT array_agg(e.enumlabel ORDER BY e.enumsortorder)
   FROM pg_enum e JOIN pg_type t ON t.oid = e.enumtypid
   WHERE t.typname = 'user_role'),
  ARRAY['owner','manager'],
  'user_role has correct values'
);

-- ── products columns ─────────────────────────────────────────────────────────
SELECT has_column('public', 'products', 'id',               'products.id exists');
SELECT has_column('public', 'products', 'name',             'products.name exists');
SELECT has_column('public', 'products', 'size',             'products.size exists');
SELECT has_column('public', 'products', 'unit_type',        'products.unit_type exists');
SELECT has_column('public', 'products', 'units_per_carton', 'products.units_per_carton exists');
SELECT has_column('public', 'products', 'price_ngn',        'products.price_ngn exists');
SELECT has_column('public', 'products', 'image_path',       'products.image_path exists');
SELECT has_column('public', 'products', 'published',        'products.published exists');
SELECT has_column('public', 'products', 'metadata',         'products.metadata exists');
SELECT has_column('public', 'products', 'internal_notes',   'products.internal_notes exists');
SELECT has_column('public', 'products', 'created_at',       'products.created_at exists');
SELECT has_column('public', 'products', 'updated_at',       'products.updated_at exists');

-- price_ngn must be numeric (not integer or float)
SELECT col_type_is('public', 'products', 'price_ngn', 'numeric', 'products.price_ngn is numeric');

-- image_path is nullable
SELECT col_is_null('public', 'products', 'image_path', 'products.image_path is nullable');

-- ── CHECK constraint: cannot publish without image ───────────────────────────
SELECT throws_ok(
  $$INSERT INTO products (name, size, unit_type, units_per_carton, price_ngn, published, image_path)
    VALUES ('TestProduct', '50CL', 'bottle', 24, 1500.00, true, null)$$,
  '23514',
  null,
  'cannot publish product without image_path'
);

-- ── tags slug is unique ───────────────────────────────────────────────────────
INSERT INTO tags (name, slug, type) VALUES ('CatA', 'unique-slug-test', 'category');
SELECT throws_ok(
  $$INSERT INTO tags (name, slug, type) VALUES ('CatB', 'unique-slug-test', 'category')$$,
  '23505',
  null,
  'tags slug must be unique'
);

-- ── product_tags cascade deletes ─────────────────────────────────────────────
INSERT INTO products (name, size, unit_type, units_per_carton, price_ngn)
  VALUES ('CascadeTest', '35CL', 'bottle', 24, 1200.00);
INSERT INTO tags (name, slug, type) VALUES ('CascadeTag', 'cascade-tag', 'category');
INSERT INTO product_tags (product_id, tag_id)
  SELECT p.id, t.id FROM products p, tags t
  WHERE p.name = 'CascadeTest' AND t.slug = 'cascade-tag';

DELETE FROM products WHERE name = 'CascadeTest';

SELECT is(
  (SELECT count(*)::int FROM product_tags pt
   JOIN tags t ON t.id = pt.tag_id
   WHERE t.slug = 'cascade-tag'),
  0,
  'product_tags cascade deletes when product is deleted'
);

-- ── updated_at trigger fires on UPDATE ───────────────────────────────────────
INSERT INTO products (name, size, unit_type, units_per_carton, price_ngn)
  VALUES ('TriggerTest', '50CL', 'can', 12, 2000.00);

UPDATE products SET name = 'TriggerTest-Updated' WHERE name = 'TriggerTest';

SELECT ok(
  (SELECT updated_at > created_at FROM products WHERE name = 'TriggerTest-Updated'),
  'updated_at trigger fires on UPDATE for products'
);

SELECT * FROM finish();

ROLLBACK;
