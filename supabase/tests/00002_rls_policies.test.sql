-- ────────────────────────────────────────────────────────────────────────────
-- RLS policy tests for Khyairan Soft Drinks
--
-- Test setup mocks Supabase auth infrastructure (auth schema, auth.uid(),
-- anon/authenticated roles, grants) so tests run against standalone PostgreSQL.
-- In production, Supabase provides auth schema/roles; migration adds policies.
-- ────────────────────────────────────────────────────────────────────────────

BEGIN;

-- ── Mock auth infrastructure (Supabase provides these in production) ──────────
CREATE SCHEMA IF NOT EXISTS auth;

CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
LANGUAGE plpgsql STABLE AS $$
BEGIN
  RETURN (current_setting('request.jwt.claims', true)::jsonb->>'sub')::uuid;
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$;

DO $$ BEGIN CREATE ROLE anon NOLOGIN; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE ROLE authenticated NOLOGIN; EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Grants that the migration will apply (mirroring production setup)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON products, tags TO anon;
GRANT ALL ON products, tags, product_tags, profiles TO authenticated;

-- ── Test data ─────────────────────────────────────────────────────────────────
INSERT INTO profiles (id, full_name, role) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Test Owner',   'owner'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Test Manager', 'manager');

INSERT INTO products (name, size, unit_type, units_per_carton, price_ngn, published, image_path)
  VALUES ('PubProd', '50CL', 'bottle', 24, 1500, true, 'images/pub.webp');

INSERT INTO products (name, size, unit_type, units_per_carton, price_ngn, published)
  VALUES ('DraftProd', '50CL', 'bottle', 24, 1500, false);

SELECT plan(8);

-- 1. anon can read published products
SET LOCAL ROLE anon;
SELECT ok(
  (SELECT count(*)::int FROM products WHERE name = 'PubProd') = 1,
  'anon can read published products'
);
RESET ROLE;

-- 2. anon cannot read draft products
SET LOCAL ROLE anon;
SELECT is(
  (SELECT count(*)::int FROM products WHERE name = 'DraftProd'),
  0,
  'anon cannot read draft products'
);
RESET ROLE;

-- 3. anon cannot insert products
SET LOCAL ROLE anon;
SELECT throws_ok(
  $$INSERT INTO products (name, size, unit_type, units_per_carton, price_ngn)
    VALUES ('AnonProd', '35CL', 'can', 12, 1000)$$,
  '42501',
  null,
  'anon cannot insert products'
);
RESET ROLE;

-- 4. manager can insert and update products
SET LOCAL request.jwt.claims = '{"sub":"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"}';
SET LOCAL ROLE authenticated;
SELECT lives_ok(
  $$INSERT INTO products (name, size, unit_type, units_per_carton, price_ngn)
      VALUES ('MgrProd', '35CL', 'can', 12, 1000);
    UPDATE products SET price_ngn = 1100 WHERE name = 'MgrProd'$$,
  'manager can insert and update products'
);
RESET ROLE;
SET LOCAL request.jwt.claims = '';

-- 5. manager cannot delete products (RLS silently filters DELETE — 0 rows affected)
SET LOCAL request.jwt.claims = '{"sub":"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"}';
SET LOCAL ROLE authenticated;
DELETE FROM products WHERE name = 'DraftProd';
SELECT is(
  (SELECT count(*)::int FROM products WHERE name = 'DraftProd'),
  1,
  'manager cannot delete products — row still exists after blocked DELETE'
);
RESET ROLE;
SET LOCAL request.jwt.claims = '';

-- 6. owner can delete products
SET LOCAL request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"}';
SET LOCAL ROLE authenticated;
SELECT lives_ok(
  $$DELETE FROM products WHERE name = 'DraftProd'$$,
  'owner can delete products'
);
RESET ROLE;
SET LOCAL request.jwt.claims = '';

-- 7. owner can manage profiles (INSERT / UPDATE / DELETE)
SET LOCAL request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"}';
SET LOCAL ROLE authenticated;
SELECT lives_ok(
  $$INSERT INTO profiles (id, full_name, role)
        VALUES ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'New User', 'manager');
      UPDATE profiles SET full_name = 'New User Updated'
        WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
      DELETE FROM profiles
        WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccccccc'$$,
  'owner can manage profiles'
);
RESET ROLE;
SET LOCAL request.jwt.claims = '';

-- 8. manager cannot manage profiles (INSERT denied)
SET LOCAL request.jwt.claims = '{"sub":"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"}';
SET LOCAL ROLE authenticated;
SELECT throws_ok(
  $$INSERT INTO profiles (id, full_name, role)
    VALUES ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Extra User', 'manager')$$,
  '42501',
  null,
  'manager cannot manage profiles'
);
RESET ROLE;
SET LOCAL request.jwt.claims = '';

SELECT * FROM finish();
ROLLBACK;
