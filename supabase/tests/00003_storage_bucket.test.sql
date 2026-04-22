-- pgTAP tests for 00003_storage_bucket.sql
-- Run after: test_setup.sql, test_setup_storage.sql, and all 3 migrations.

BEGIN;

SELECT plan(6);

-- 1. product-images bucket exists
SELECT ok(
  EXISTS(SELECT 1 FROM storage.buckets WHERE id = 'product-images'),
  'product-images bucket exists'
);

-- 2. bucket is public
SELECT is(
  (SELECT public FROM storage.buckets WHERE id = 'product-images'),
  true,
  'product-images bucket is public'
);

-- 3. file size limit is 10 MB
SELECT is(
  (SELECT file_size_limit FROM storage.buckets WHERE id = 'product-images'),
  10485760::bigint,
  'product-images has 10 MB file size limit'
);

-- 4. allowed_mime_types contains expected image types
SELECT ok(
  (SELECT allowed_mime_types FROM storage.buckets WHERE id = 'product-images')
    @> ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic'],
  'product-images allows jpeg, png, webp, gif, heic'
);

-- 5. public read policy exists on storage.objects
SELECT ok(
  EXISTS(
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename  = 'objects'
      AND policyname = 'public_read_product_images'
  ),
  'public_read_product_images policy exists'
);

-- 6. authenticated insert policy exists on storage.objects
SELECT ok(
  EXISTS(
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename  = 'objects'
      AND policyname = 'auth_insert_product_images'
  ),
  'auth_insert_product_images policy exists'
);

SELECT finish();

ROLLBACK;
