---
# khaiyran-47w9
title: Edit product
status: in-progress
type: feature
priority: normal
created_at: 2026-04-24T01:05:59Z
updated_at: 2026-04-24T12:03:30Z
parent: khaiyran-md1g
blocked_by:
    - khaiyran-d1rl
---

Edit form for existing product: all fields from add product (name, size, unit_type, units_per_carton, price_ngn) pre-filled with existing values, plus publish/draft toggle (disabled if image_path is null — cannot publish without image). Change tag assignments (pre-selected). Image upload deferred (Image Management epic); shows existing image_path as text if present.

## Related Code

- `packages/dashboard/src/lib/supabase.ts` — add `updateProduct(id, fields)` function
- `packages/dashboard/src/lib/supabase.test.ts` — add test for updateProduct
- New: `packages/dashboard/src/components/editProductForm.ts` — `renderEditProductForm(container, product, tags, currentTagIds, onSuccess, updateFn, setProductTagsFn)`
- New: `packages/dashboard/src/components/editProductForm.test.ts` — tests
- `packages/dashboard/src/dashboard.ts` — add `#edit-product-<id>` route rendering the edit form

## Acceptance Criteria

- [ ] Form renders with all fields pre-filled from the product object
- [ ] Published toggle is a checkbox, disabled when product.image_path is null
- [ ] Published toggle is enabled and reflects product.published when image_path is not null
- [ ] Tag checkboxes are pre-checked for currentTagIds
- [ ] Submitting calls updateProduct with changed fields, then setProductTags, then onSuccess
- [ ] On Supabase error, error feedback shown and form not reset
- [ ] `npm run typecheck -w packages/dashboard` passes with 0 errors
- [ ] `npm run lint -w packages/dashboard` passes with 0 warnings
- [ ] `npm run build -w packages/dashboard` exits 0

## Tests

- `packages/dashboard/src/components/editProductForm.test.ts` — `renders form pre-filled with product values` — asserts name, size, unit_type, units_per_carton, price_ngn inputs contain product values
- `packages/dashboard/src/components/editProductForm.test.ts` — `published toggle is disabled when image_path is null` — asserts checkbox is disabled for product with null image_path
- `packages/dashboard/src/components/editProductForm.test.ts` — `published toggle is enabled when image_path is set` — asserts checkbox is enabled and reflects published status
- `packages/dashboard/src/components/editProductForm.test.ts` — `pre-checks tag checkboxes for current product tags` — asserts checkboxes for currentTagIds are checked, others unchecked
- `packages/dashboard/src/components/editProductForm.test.ts` — `calls updateProduct and setProductTags on submit` — asserts updateProduct called with correct id and fields, setProductTags called with new tag selection
- `packages/dashboard/src/components/editProductForm.test.ts` — `calls onSuccess after successful submit` — asserts onSuccess callback invoked
- `packages/dashboard/src/components/editProductForm.test.ts` — `shows error feedback when updateProduct throws` — asserts error message shown
- `packages/dashboard/src/lib/supabase.test.ts` — `updateProduct sends update for given fields` — asserts supabase update called with correct fields and id filter

## Agent Pre-Start Checkpoint

- Agent: Claude Sonnet 4.6
- Date: 2026-04-24
- Verdict: APPROVED
- Checkpoints:
  - [x] packages/dashboard/src/lib/supabase.ts exists with NewProduct type
  - [x] packages/dashboard/src/lib/supabase.test.ts exists with established mock patterns
  - [x] packages/dashboard/src/dashboard.ts exists with hash routing
  - [x] addProductForm.ts exists as reference implementation
  - [x] All Acceptance Criteria are objectively testable
  - [x] Tests section has specific file paths, test names, and assertions (8 tests)
  - [x] Route: #edit-product-<id> hash route
  - [x] Published toggle disabled logic: product.image_path === null
