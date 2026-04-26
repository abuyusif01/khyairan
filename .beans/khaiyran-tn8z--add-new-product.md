---
# khaiyran-tn8z
title: Add new product
status: completed
type: feature
priority: normal
created_at: 2026-04-24T01:05:59Z
updated_at: 2026-04-26T05:56:22Z
parent: khaiyran-md1g
blocked_by:
    - khaiyran-d1rl
---

Form: name (text), size (text), unit_type (dropdown: bottle/can/pack/cup/pouch), units_per_carton (number), price_ngn (number), image upload (deferred — handled by Image Management epic), tag assignment (multi-select from existing tags). Starts as draft (published=false). Plain DOM form component (no Alpine.js dependency required — Alpine is started globally).

## Related Code

- `packages/dashboard/src/lib/supabase.ts` — add `createProduct(fields)`, `fetchAllTags()`, `setProductTags(productId, tagIds)`
- `packages/dashboard/src/lib/supabase.test.ts` — add tests for new supabase functions
- New: `packages/dashboard/src/components/addProductForm.ts` — `renderAddProductForm(container, tags, onSuccess)`
- New: `packages/dashboard/src/components/addProductForm.test.ts` — tests
- `packages/dashboard/src/dashboard.ts` — add `#add-product` route rendering the form

## Acceptance Criteria

- [x] Form renders fields: name (text, required), size (text, required), unit_type (select with 5 options, required), units_per_carton (number, required, min=1), price_ngn (number, required, min=0)
- [x] Form renders tag multi-select showing all tags
- [x] Submitting with empty required fields shows validation error (HTML5 `required`)
- [x] Successful submit calls `createProduct` with published=false, then calls `setProductTags`, then calls `onSuccess`
- [x] On Supabase error, error feedback is shown and form not reset
- [x] `npm run typecheck -w packages/dashboard` passes with 0 errors
- [x] `npm run lint -w packages/dashboard` passes with 0 warnings
- [x] `npm run build -w packages/dashboard` exits 0

## Tests

- `packages/dashboard/src/components/addProductForm.test.ts` — `renders all required form fields` — asserts name, size, unit_type select, units_per_carton, price_ngn inputs exist
- `packages/dashboard/src/components/addProductForm.test.ts` — `renders tag checkboxes for each tag` — asserts one checkbox per tag with correct label
- `packages/dashboard/src/components/addProductForm.test.ts` — `calls createProduct and setProductTags on valid submit` — fills all required fields, submits, asserts mocked createProduct called with correct fields and published=false, setProductTags called with returned id and selected tag ids
- `packages/dashboard/src/components/addProductForm.test.ts` — `calls onSuccess after successful submit` — asserts onSuccess callback invoked after save
- `packages/dashboard/src/components/addProductForm.test.ts` — `shows error feedback when createProduct throws` — asserts error message shown
- `packages/dashboard/src/lib/supabase.test.ts` — `createProduct inserts product and returns id` — asserts supabase insert called with correct fields
- `packages/dashboard/src/lib/supabase.test.ts` — `setProductTags upserts product_tag rows` — asserts supabase upsert called with correct product_id/tag_id pairs
- `packages/dashboard/src/lib/supabase.test.ts` — `fetchAllTags returns all tags` — asserts select called on tags table

## Agent Pre-Start Checkpoint

- Agent: Claude Sonnet 4.6 (subagent)
- Date: 2026-04-24
- Verdict: APPROVED
- Checkpoints:
  - [x] packages/dashboard/src/lib/supabase.ts exists
  - [x] packages/dashboard/src/lib/supabase.test.ts exists
  - [x] packages/dashboard/src/dashboard.ts exists
  - [x] All Acceptance Criteria are objectively testable
  - [x] Tests section has specific file paths, test names, and assertions (8 tests)
  - [x] fetchAllTags() returns all tags (no type filter) for full tag assignment
  - [x] Routing: #add-product hash route, consistent with existing #prices pattern

## Agent Post-Completion Review

- Agent: Claude Sonnet 4.6 (subagent)
- Date: 2026-04-24
- Verdict: PASS
- Findings: none
- All findings fixed: YES

## Summary of Changes

- Added createProduct(), setProductTags(), fetchAllTags() to packages/dashboard/src/lib/supabase.ts
- Created packages/dashboard/src/components/addProductForm.ts — form with name/size/unit_type/units_per_carton/price_ngn fields, tag checkboxes, published=false on create, error/success feedback
- Updated packages/dashboard/src/dashboard.ts — #add-product hash route renders addProductForm; on success redirects to #products
