---
# khaiyran-jm8s
title: Storage bucket + image processing Edge Function
status: todo
type: task
priority: normal
tags:
    - supabase
    - storage
created_at: 2026-04-21T13:50:38Z
updated_at: 2026-04-21T13:52:27Z
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
