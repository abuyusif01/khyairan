-- ── product-images storage bucket ────────────────────────────────────────────
-- In Supabase, buckets are managed via the storage.buckets table.
-- The storage schema is provided by Supabase infrastructure.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,                         -- public read access
  10485760,                     -- 10 MB upload limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic']
)
ON CONFLICT (id) DO NOTHING;

-- ── Storage policies ──────────────────────────────────────────────────────────
-- Public read: anyone can view product images
CREATE POLICY "public_read_product_images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Authenticated write: owner and manager can upload
CREATE POLICY "auth_insert_product_images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'product-images'
  AND public.get_my_role() IN ('owner', 'manager')
);

-- Authenticated update: owner and manager can replace images
CREATE POLICY "auth_update_product_images"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'product-images'
  AND public.get_my_role() IN ('owner', 'manager')
)
WITH CHECK (
  bucket_id = 'product-images'
  AND public.get_my_role() IN ('owner', 'manager')
);

-- Authenticated delete: owner and manager can delete images
CREATE POLICY "auth_delete_product_images"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'product-images'
  AND public.get_my_role() IN ('owner', 'manager')
);
