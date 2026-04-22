---
# khaiyran-jm8s
title: Storage bucket + image processing Edge Function
status: draft
type: task
priority: normal
tags:
    - supabase
    - storage
created_at: 2026-04-21T13:50:38Z
updated_at: 2026-04-22T00:50:12Z
parent: khaiyran-s0o0
blocked_by:
    - khaiyran-fel4
---

# Storage bucket + image processing Edge Function

## Description

Create the `product-images` storage bucket and a Supabase Edge Function that automatically compresses, resizes, and converts uploaded images to WebP. The goal is to accept whatever a phone camera produces and output consistent, optimised images for the public site.

## Related Code

- `supabase/migrations/00003_storage_bucket.sql` — bucket creation and storage policies
- `supabase/functions/process-image/index.ts` — Edge Function source
- `supabase/CLAUDE.md` — storage and Edge Function spec

## Acceptance Criteria

- [ ] `product-images` bucket exists after migration
- [ ] Public read access on the bucket (no auth needed to view images)
- [ ] Write access restricted to authenticated users with owner or manager role
- [ ] Edge Function triggers on new upload to `product-images`
- [ ] Edge Function converts image to WebP format
- [ ] Edge Function resizes to a max dimension (e.g. 800px longest side) while preserving aspect ratio
- [ ] Edge Function compresses to reasonable file size (target: under 100KB per image)
- [ ] Original upload is replaced with the processed version (same path)
- [ ] Non-image uploads are rejected or ignored gracefully
- [ ] Edge Function deploys and runs without errors
- [ ] `npm run typecheck` passes with 0 errors
- [ ] `npm run lint` passes with 0 errors and 0 warnings

## Tests

- `supabase/functions/process-image/process-image.test.ts` — `converts PNG to WebP` — uploads a test PNG, asserts the stored file is WebP format
- `supabase/functions/process-image/process-image.test.ts` — `resizes large image to max 800px` — uploads a 2000x1500 image, asserts output dimensions are 800x600
- `supabase/functions/process-image/process-image.test.ts` — `preserves aspect ratio` — uploads a 1000x500 image, asserts output is 800x400
- `supabase/functions/process-image/process-image.test.ts` — `rejects non-image file` — uploads a .txt file, asserts it is rejected or the original is unchanged

## Agent Pre-Start Checkpoint

- Agent: claude-sonnet-4-6 (night shift)
- Date: 2026-04-22
- Verdict: APPROVED (with caveats)
- Checkpoints:
  - [x] Migration SQL written correctly for Supabase storage schema
  - [x] Edge Function TypeScript written using @cf-wasm/photon (WASM WebP support)
  - [x] Tests written as Deno tests (correct format)
  - [!] Cannot run tests: Deno not in Flox environment
  - [!] Cannot apply migration: storage schema requires Supabase local stack (Docker + supabase CLI)

## Blocked

- Blocked by: Deno runtime not available in Flox environment
- Reason: The tests are Deno tests and cannot be run without `deno`. The storage migration references `storage.buckets` which only exists in a running Supabase instance. The TDD step (confirm tests fail, then pass) requires supabase start + deno.
- What is needed:
  1. `flox install deno` — adds Deno to the Flox environment
  2. `supabase start` — starts the local Supabase stack (Docker required, already available)
  3. Run: `deno test --allow-net supabase/functions/process-image/process-image.test.ts`
  4. Apply migration: `supabase db reset`
  5. Deploy and test Edge Function: `supabase functions deploy process-image`
- Next available bean: khaiyran-pi37 (seed data)
