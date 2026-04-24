---
# khaiyran-knsn
title: Migrate product images from Supabase Storage to Cloudflare R2
status: todo
type: task
priority: deferred
created_at: 2026-04-24T00:21:03Z
updated_at: 2026-04-24T00:21:03Z
---

Move product-images bucket from Supabase Storage to Cloudflare R2 so we control cache-control headers (Supabase Storage hardcodes no-cache and cannot be overridden). R2 is already the planned hosting layer per CLAUDE.md. With R2 we can set max-age=31536000 on all images, eliminating the 31-validation-request overhead on every page load. Requires: R2 bucket setup, image migration script, update VITE_SUPABASE_URL image base path to R2 public URL, update storage RLS/upload flow for new images.
