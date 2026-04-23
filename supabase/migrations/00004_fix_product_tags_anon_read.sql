-- Allow the anon role to read product_tags.
-- This table contains only foreign-key references (product_id, tag_id, sort_order)
-- — no sensitive data. The public site needs it to group products by category.
-- The existing RLS on products and tags already limits what is visible to anon.

GRANT SELECT ON product_tags TO anon;

CREATE POLICY "anon_select_product_tags"
ON product_tags FOR SELECT TO anon
USING (true);
