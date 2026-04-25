---
# khaiyran-vru3
title: Image preview after upload
status: in-progress
type: feature
priority: normal
created_at: 2026-04-24T01:06:23Z
updated_at: 2026-04-25T00:24:02Z
parent: khaiyran-niiz
blocked_by:
    - khaiyran-rst2
---

After image upload and Edge Function processing, show the processed WebP preview on the product form. Replace existing image preview if product already has one. Use Supabase Storage public URL to render an img element.

## Related Code

- `packages/dashboard/src/lib/supabase.ts` — add `getProductImageUrl(path)` returns public URL string
- `packages/dashboard/src/lib/supabase.test.ts` — test for getProductImageUrl
- `packages/dashboard/src/components/imageUpload.ts` — after successful upload, render img preview with public URL
- `packages/dashboard/src/components/imageUpload.test.ts` — test preview shown after upload

## Acceptance Criteria

- [ ] After successful upload, an `<img>` element is shown with `data-preview` attribute containing the storage path
- [ ] If a previous preview img exists, it is replaced
- [ ] `npm run typecheck -w packages/dashboard` passes with 0 errors
- [ ] `npm run lint -w packages/dashboard` passes with 0 warnings
- [ ] `npm run build -w packages/dashboard` exits 0

## Tests

- `packages/dashboard/src/components/imageUpload.test.ts` — `shows img preview after upload` — asserts img element with data-preview attribute appears after successful upload
- `packages/dashboard/src/lib/supabase.test.ts` — `getProductImageUrl returns public URL for path` — asserts storage.from().getPublicUrl() called and URL returned

## Agent Pre-Start Checkpoint

- Agent: Claude Sonnet 4.6
- Date: 2026-04-25
- Verdict: APPROVED
- Checkpoints:
  - [x] imageUpload.ts exists as integration target
  - [x] All criteria testable
