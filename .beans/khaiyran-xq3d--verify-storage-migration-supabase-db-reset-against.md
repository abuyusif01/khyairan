---
# khaiyran-xq3d
title: Verify storage migration + supabase db reset against live Supabase stack
status: todo
type: task
priority: low
tags:
    - supabase
    - storage
    - verification
created_at: 2026-04-22T11:56:21Z
updated_at: 2026-04-22T11:56:21Z
---

# Verify storage migration + supabase db reset against live Supabase stack

## Description

The storage bucket migration (`supabase/migrations/00003_storage_bucket.sql`) inserts
into `storage.buckets` — a schema that only exists in a running Supabase instance.
It was skipped during standalone pgTAP testing (which uses plain PostgreSQL).

This task confirms the full `supabase db reset` workflow applies cleanly end-to-end,
including the storage migration and Edge Function deploy.

## Related Code

- `supabase/migrations/00003_storage_bucket.sql` — bucket creation + storage policies
- `supabase/functions/process-image/` — Edge Function to deploy and smoke-test
- `supabase/seed.sql` — seed data (also runs as part of db reset)

## Acceptance Criteria

- [ ] `supabase start` succeeds (requires Docker for Supabase's internal services)
- [ ] `supabase db reset` applies all 3 migrations + seed.sql with 0 errors
- [ ] `product-images` bucket exists in Supabase Storage after reset
- [ ] Storage policies allow public read + authenticated write for owner/manager
- [ ] `supabase functions deploy process-image` deploys without errors
- [ ] Upload a test image → Edge Function converts it to WebP at max 800px

## Tests

- Manual: `supabase db reset` exits 0 — confirms all migrations apply in order
- Manual: `supabase functions deploy process-image` exits 0 — confirms no deploy errors
- Manual: upload a JPEG via Supabase Storage UI or API → verify stored file is WebP

## Blocked

- Blocked by: `supabase start` requires Docker for Supabase's internal services (GoTrue, Realtime, Storage API)
- This is intentionally deferred — Docker was removed from the dev workflow in favour of flox services for postgres/pgtap/deno, but the full Supabase stack still needs Docker to run locally
- To unblock: ensure Docker is running, then `supabase start`
