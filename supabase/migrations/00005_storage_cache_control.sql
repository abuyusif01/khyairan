-- Update cacheControl in storage.objects metadata for all product images.
-- Supabase JS client upload() uses 'cacheControl' key in the metadata JSONB column.
-- Images are immutable once uploaded (filename changes on replacement),
-- so a 1-year max-age is appropriate.

UPDATE storage.objects
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{cacheControl}',
  '"max-age=31536000"'
)
WHERE bucket_id = 'product-images';
