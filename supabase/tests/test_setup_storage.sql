-- ────────────────────────────────────────────────────────────────────────────
-- Minimal mock of Supabase storage schema for local testing.
-- In production, this schema is provided by Supabase's Storage API service.
-- This mock covers only what 00003_storage_bucket.sql requires.
--
-- Sources:
--   github.com/supabase/storage/migrations/tenant/0002-storage-schema.sql
--   github.com/supabase/storage/migrations/tenant/0008-add-public-to-buckets.sql
--   github.com/supabase/storage/migrations/tenant/0013-add-bucket-custom-limits.sql
--   github.com/supabase/storage/migrations/tenant/0014-use-bytes-for-max-size.sql
--
-- Run ONCE on a fresh database (after test_setup.sql) before applying migrations.
-- ────────────────────────────────────────────────────────────────────────────

CREATE SCHEMA IF NOT EXISTS storage;

CREATE TABLE IF NOT EXISTS storage.buckets (
  id                 text        PRIMARY KEY,
  name               text        NOT NULL,
  owner              uuid,
  created_at         timestamptz DEFAULT now(),
  updated_at         timestamptz DEFAULT now(),
  public             boolean     DEFAULT false,
  file_size_limit    bigint,
  allowed_mime_types text[]
);

CREATE TABLE IF NOT EXISTS storage.objects (
  id               uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  bucket_id        text        REFERENCES storage.buckets(id),
  name             text,
  owner            uuid,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now(),
  last_accessed_at timestamptz DEFAULT now(),
  metadata         jsonb
);

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects  ENABLE ROW LEVEL SECURITY;
