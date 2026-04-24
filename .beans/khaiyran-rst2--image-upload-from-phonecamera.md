---
# khaiyran-rst2
title: Image upload from phone/camera
status: in-progress
type: feature
priority: normal
created_at: 2026-04-24T01:06:23Z
updated_at: 2026-04-24T12:06:20Z
parent: khaiyran-niiz
blocked_by:
    - khaiyran-47w9
---

File input accepting image/* (camera, gallery). Upload to Supabase Storage product-images bucket at path `products/{productId}`. Sets product.image_path on success via updateProduct. Edge Function process-image (already deployed) auto-converts to WebP. Component shows upload progress/status.

## Related Code

- `packages/dashboard/src/lib/supabase.ts` — add `uploadProductImage(productId, file)` returns storage path
- `packages/dashboard/src/lib/supabase.test.ts` — add test for uploadProductImage
- New: `packages/dashboard/src/components/imageUpload.ts` — `renderImageUpload(container, productId, onUploaded, uploadFn, updateFn)` component
- New: `packages/dashboard/src/components/imageUpload.test.ts` — tests
- `packages/dashboard/src/components/editProductForm.ts:1` — embed imageUpload component in edit form

## Acceptance Criteria

- [ ] Renders a file input with `accept="image/*"` and `capture="environment"` for phone camera
- [ ] On file selection, calls uploadFn and then updateFn to set image_path
- [ ] Shows "Uploading…" status during upload
- [ ] Shows success status with path after upload
- [ ] Shows error status if upload fails
- [ ] Calls onUploaded callback with the image path after successful upload and product update
- [ ] `npm run typecheck -w packages/dashboard` passes with 0 errors
- [ ] `npm run lint -w packages/dashboard` passes with 0 warnings
- [ ] `npm run build -w packages/dashboard` exits 0

## Tests

- `packages/dashboard/src/components/imageUpload.test.ts` — `renders file input with image accept and camera capture` — asserts input has accept="image/*" and capture="environment"
- `packages/dashboard/src/components/imageUpload.test.ts` — `shows uploading status during file selection` — triggers change event, asserts status text contains "Uploading"
- `packages/dashboard/src/components/imageUpload.test.ts` — `calls uploadFn and updateFn on file selection` — asserts uploadFn called with productId and file, updateFn called with path
- `packages/dashboard/src/components/imageUpload.test.ts` — `calls onUploaded with path after success` — asserts callback called with storage path
- `packages/dashboard/src/components/imageUpload.test.ts` — `shows error status when upload fails` — asserts error message shown
- `packages/dashboard/src/lib/supabase.test.ts` — `uploadProductImage uploads to product-images bucket and returns path` — asserts storage.from upload called with correct path

## Agent Pre-Start Checkpoint

- Agent: Claude Sonnet 4.6
- Date: 2026-04-24
- Verdict: APPROVED
- Checkpoints:
  - [x] packages/dashboard/src/lib/supabase.ts exists
  - [x] packages/dashboard/src/components/editProductForm.ts exists as integration target
  - [x] All Acceptance Criteria objectively testable
  - [x] Tests section complete with 6 specific tests
  - [x] Path convention: products/{productId} in product-images bucket
  - [x] Edge Function triggered automatically via Supabase webhook — no client code needed for conversion
