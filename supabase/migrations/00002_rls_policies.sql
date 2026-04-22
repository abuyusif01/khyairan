-- ── Role helper (SECURITY DEFINER bypasses RLS on profiles lookup) ────────────
-- Policies that check a user's role would cause infinite recursion if they
-- queried profiles directly (which is also RLS-protected). This function runs
-- as the owner (postgres) and returns the role without RLS interference.
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT role::text FROM profiles WHERE id = auth.uid()
$$;

-- ── Enable Row Level Security ─────────────────────────────────────────────────
ALTER TABLE products     ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags         ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles     ENABLE ROW LEVEL SECURITY;

-- ── Table-level grants ────────────────────────────────────────────────────────
-- anon: read-only on products and tags (RLS further filters to published only)
GRANT SELECT ON products, tags TO anon;

-- authenticated: all operations — RLS policies restrict by role
GRANT ALL ON products, tags, product_tags, profiles TO authenticated;

-- ── products policies ─────────────────────────────────────────────────────────
CREATE POLICY "anon_select_published_products"
ON products FOR SELECT TO anon
USING (published = true);

CREATE POLICY "auth_select_products"
ON products FOR SELECT TO authenticated
USING (get_my_role() IN ('owner', 'manager'));

CREATE POLICY "auth_insert_products"
ON products FOR INSERT TO authenticated
WITH CHECK (get_my_role() IN ('owner', 'manager'));

CREATE POLICY "auth_update_products"
ON products FOR UPDATE TO authenticated
USING   (get_my_role() IN ('owner', 'manager'))
WITH CHECK (get_my_role() IN ('owner', 'manager'));

CREATE POLICY "owner_delete_products"
ON products FOR DELETE TO authenticated
USING (get_my_role() = 'owner');

-- ── tags policies ─────────────────────────────────────────────────────────────
CREATE POLICY "anon_select_published_tags"
ON tags FOR SELECT TO anon
USING (published = true);

CREATE POLICY "auth_select_tags"
ON tags FOR SELECT TO authenticated
USING (get_my_role() IN ('owner', 'manager'));

CREATE POLICY "auth_insert_tags"
ON tags FOR INSERT TO authenticated
WITH CHECK (get_my_role() IN ('owner', 'manager'));

CREATE POLICY "auth_update_tags"
ON tags FOR UPDATE TO authenticated
USING   (get_my_role() IN ('owner', 'manager'))
WITH CHECK (get_my_role() IN ('owner', 'manager'));

CREATE POLICY "owner_delete_tags"
ON tags FOR DELETE TO authenticated
USING (get_my_role() = 'owner');

-- ── product_tags policies ─────────────────────────────────────────────────────
CREATE POLICY "auth_select_product_tags"
ON product_tags FOR SELECT TO authenticated
USING (get_my_role() IN ('owner', 'manager'));

CREATE POLICY "auth_insert_product_tags"
ON product_tags FOR INSERT TO authenticated
WITH CHECK (get_my_role() IN ('owner', 'manager'));

CREATE POLICY "auth_update_product_tags"
ON product_tags FOR UPDATE TO authenticated
USING   (get_my_role() IN ('owner', 'manager'))
WITH CHECK (get_my_role() IN ('owner', 'manager'));

CREATE POLICY "owner_delete_product_tags"
ON product_tags FOR DELETE TO authenticated
USING (get_my_role() = 'owner');

-- ── profiles policies ─────────────────────────────────────────────────────────
-- All authenticated users can read profiles (manager needs to see team)
CREATE POLICY "auth_select_profiles"
ON profiles FOR SELECT TO authenticated
USING (get_my_role() IN ('owner', 'manager'));

-- Only owner can write to profiles
CREATE POLICY "owner_insert_profiles"
ON profiles FOR INSERT TO authenticated
WITH CHECK (get_my_role() = 'owner');

CREATE POLICY "owner_update_profiles"
ON profiles FOR UPDATE TO authenticated
USING   (get_my_role() = 'owner')
WITH CHECK (get_my_role() = 'owner');

CREATE POLICY "owner_delete_profiles"
ON profiles FOR DELETE TO authenticated
USING (get_my_role() = 'owner');
