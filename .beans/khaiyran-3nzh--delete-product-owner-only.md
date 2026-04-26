---
# khaiyran-3nzh
title: Delete product (owner only)
status: completed
type: feature
priority: low
created_at: 2026-04-24T01:05:59Z
updated_at: 2026-04-26T05:56:22Z
parent: khaiyran-md1g
blocked_by:
    - khaiyran-d1rl
---

Owner-only delete button on product list (in product list table). Confirmation dialog before delete. Manager role sees no delete button. Cascades to product_tags via FK.

## Related Code

- `packages/dashboard/src/lib/supabase.ts` — add `deleteProduct(productId)`
- `packages/dashboard/src/lib/supabase.test.ts` — test for deleteProduct
- `packages/dashboard/src/components/productList.ts` — add optional deleteFn/isOwner params, delete button per row
- `packages/dashboard/src/components/productList.test.ts` — tests
- `packages/dashboard/src/dashboard.ts` — pass deleteFn to renderProductList when role=owner

## Acceptance Criteria

- [x] Delete button only rendered when isOwner=true in productList
- [x] Clicking delete shows confirmation dialog
- [x] On confirmation, calls deleteProduct and removes row from DOM
- [x] `npm run typecheck -w packages/dashboard` passes with 0 errors
- [x] `npm run lint -w packages/dashboard` passes with 0 warnings
- [x] `npm run build -w packages/dashboard` exits 0

## Tests

- `packages/dashboard/src/components/productList.test.ts` — `renders delete button only when isOwner` — asserts button absent without isOwner, present with isOwner
- `packages/dashboard/src/components/productList.test.ts` — `delete button calls deleteFn after confirmation` — mocks confirm(), asserts deleteFn called and row removed
- `packages/dashboard/src/lib/supabase.test.ts` — `deleteProduct calls delete with product id` — asserts supabase delete called

## Agent Pre-Start Checkpoint

- Agent: Claude Sonnet 4.6
- Date: 2026-04-25
- Verdict: APPROVED
- Checkpoints:
  - [x] productList.ts exists as integration target
  - [x] All criteria testable

## Summary of Changes

- Added deleteProduct() to supabase.ts
- Updated productList.ts — ProductListOptions interface, delete button per row when isOwner, confirm before delete
- Updated dashboard.ts — passes deleteFn/isOwner to renderProductList
