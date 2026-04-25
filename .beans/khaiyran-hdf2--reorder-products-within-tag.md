---
# khaiyran-hdf2
title: Reorder products within tag
status: completed
type: feature
priority: deferred
created_at: 2026-04-24T01:05:59Z
updated_at: 2026-04-25T00:41:24Z
parent: khaiyran-md1g
---

Up/down arrow buttons to reorder products within a selected tag. Buttons appear only when a specific tag is active in the filter. Updates `product_tags.sort_order`. Affects display order on public site.

## Related Code

- `packages/dashboard/src/lib/supabase.ts:147-174` — add `updateProductTagOrder(tagId, updates)` function
- `packages/dashboard/src/lib/supabase.test.ts` — test for `updateProductTagOrder`
- `packages/dashboard/src/components/productList.ts:3-6` — `ProductListOptions` — add `reorderFn` option
- `packages/dashboard/src/components/productList.ts:66-97` — row rendering — add up/down buttons when tag filter active
- `packages/dashboard/src/components/productList.test.ts` — tests for reorder UI

## Acceptance Criteria

- [ ] Up/down reorder buttons appear per row only when a specific tag is selected in the filter
- [ ] Up button is disabled (or absent) for the first row; down button disabled (or absent) for the last row
- [ ] Clicking up/down swaps sort_order in memory and calls `reorderFn` with the two affected rows
- [ ] Rows visually reorder in the DOM after a successful swap
- [ ] `reorderFn` is not called when no tag filter is active
- [ ] `npm run typecheck` passes with 0 errors
- [ ] `npm run lint` passes with 0 warnings

## Tests

- `packages/dashboard/src/lib/supabase.test.ts` — `updateProductTagOrder calls upsert with new sort_orders` — asserts upsert called with correct product_id, tag_id, sort_order rows
- `packages/dashboard/src/components/productList.test.ts` — `reorder buttons hidden when no tag selected` — asserts no `[data-action="move-up"]` elements when tagFilter is empty
- `packages/dashboard/src/components/productList.test.ts` — `reorder buttons appear when tag selected` — sets tagFilter to tag1, asserts `[data-action="move-up"]` elements exist
- `packages/dashboard/src/components/productList.test.ts` — `move-up button calls reorderFn with swapped sort_orders` — clicks up on second row, asserts reorderFn called with correct arguments
- `packages/dashboard/src/components/productList.test.ts` — `first row has no move-up button; last row has no move-down button` — asserts boundary buttons absent

## Agent Pre-Start Checkpoint

- Agent: claude-sonnet-4-6 (night shift)
- Date: 2026-04-25
- Verdict: APPROVED
- Checkpoints:
  - [x] `packages/dashboard/src/lib/supabase.ts` exists with upsert pattern at setProductTags (lines 68-81) to follow
  - [x] `packages/dashboard/src/components/productList.ts` exists with `ProductListOptions` and row rendering
  - [x] `product_tags` table has `(product_id, tag_id, sort_order)` confirmed in schema
  - [x] All 5 tests are objectively testable with DOM/mock assertions

## Agent Post-Completion Review

- Agent: claude-sonnet-4-6
- Date: 2026-04-25
- Verdict: FAIL (initial) → PASS after fixes
- Findings fixed:
  1. Race condition: buttons now disabled during async call, sort_orders restored on failure
  2. Move-up test now asserts exact sort_order values after swap
- All findings fixed: YES

## Summary of Changes

Added `updateProductTagOrder(tagId, updates)` to `supabase.ts` which upserts `product_tags` rows with new sort orders. Added `reorderFn` option to `ProductListOptions`. When a tag is selected in the filter, up/down buttons appear per row (with boundary constraints — no up on first row, no down on last row). Clicking swaps sort_orders in memory, disables the button to prevent double-fire, calls `reorderFn`, moves the DOM row, then refreshes button state. Sort_orders are restored in memory on failure.
