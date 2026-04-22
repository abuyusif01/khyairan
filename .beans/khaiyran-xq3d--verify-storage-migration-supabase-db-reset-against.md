---
# khaiyran-xq3d
title: Verify storage migration + supabase db reset against live Supabase stack
status: completed
type: task
priority: low
tags:
    - supabase
    - storage
    - verification
created_at: 2026-04-22T11:56:21Z
updated_at: 2026-04-22T13:07:07Z
---

# Verify storage migration + supabase db reset against live Supabase stack

## Description

The storage bucket migration (`supabase/migrations/00003_storage_bucket.sql`) inserts
into `storage.buckets` — a schema that only exists in a running Supabase instance.
It was skipped during standalone pgTAP testing (which uses plain PostgreSQL).

**Update 2026-04-22**: The storage schema is now mocked via
`supabase/tests/test_setup_storage.sql` (derived from upstream supabase/storage
migrations 0002/0008/0013/0014). The migration and all 6 pgTAP tests pass via
flox postgres — no Docker required for this part.

The remaining open work is end-to-end verification against the real Supabase hosted
environment (not local stack): deploy Edge Function + manual upload test.

## Related Code

- `supabase/migrations/00003_storage_bucket.sql` — bucket creation + storage policies
- `supabase/tests/test_setup_storage.sql` — minimal storage schema mock for pgTAP
- `supabase/tests/00003_storage_bucket.test.sql` — 6 pgTAP tests (all passing)
- `supabase/functions/process-image/` — Edge Function to deploy and smoke-test
- `supabase/seed.sql` — seed data (also runs as part of db reset)

## Acceptance Criteria

- [x] Storage migration applies cleanly with mocked schema (flox postgres, no Docker)
- [x] `product-images` bucket created with correct public/size/mime settings
- [x] Storage policies (public read, auth insert/update/delete) exist
- [ ] `supabase functions deploy process-image` deploys without errors (needs Supabase project)
- [ ] Upload a test image → Edge Function converts it to WebP at max 800px

## Tests

- Automated: `supabase/tests/00003_storage_bucket.test.sql` — 6 pgTAP tests, all passing via flox postgres
- Manual: `supabase functions deploy process-image` exits 0 — needs a real Supabase project
- Manual: upload a JPEG via Supabase Storage UI or API → verify stored file is WebP

## Blocked

- Remaining items require a live Supabase project (hosted), not a local stack
- `supabase functions deploy` needs `SUPABASE_ACCESS_TOKEN` and a project ref
- This is low priority — no blocker on development workflow, only on production smoke test
