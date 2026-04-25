---
# khaiyran-knsn
title: Migrate product images from Supabase Storage to Cloudflare R2
status: draft
type: task
priority: deferred
created_at: 2026-04-24T00:21:03Z
updated_at: 2026-04-25T10:43:47Z
---

Move product-images bucket from Supabase Storage to Cloudflare R2 so we control cache-control headers (Supabase Storage hardcodes no-cache and cannot be overridden). R2 is already the planned hosting layer per CLAUDE.md. With R2 we can set max-age=31536000 on all images, eliminating the 31-validation-request overhead on every page load. Requires: R2 bucket setup, image migration script, update VITE_SUPABASE_URL image base path to R2 public URL, update storage RLS/upload flow for new images.

## Blocked

- Blocked by: Cloudflare R2 credentials not available
- Reason: Migration requires CLOUDFLARE_ACCOUNT_ID, R2 bucket name, and an API token with R2 read/write permissions. Also need the public R2 bucket URL to replace the Supabase Storage URL in the dashboard. Cannot proceed without these.
- What's needed from human:
  1. Create an R2 bucket in Cloudflare dashboard (e.g. 'khaiyran-images')
  2. Enable public access and note the public URL
  3. Create an API token with R2 Object Read & Write permissions
  4. Provide: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY, R2_PUBLIC_URL
- Next available bean: none (all other beans are completed or blocked)
