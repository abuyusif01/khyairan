---
# khaiyran-8uvb
title: Reorder tags within type
status: in-progress
type: feature
priority: deferred
created_at: 2026-04-24T01:06:23Z
updated_at: 2026-04-25T00:41:58Z
parent: khaiyran-tvmy
---

Up/down arrow buttons to reorder tags within their type group. Updates `tags.sort_order` directly. Affects chip order on public site filter bar.

## Related Code

- `packages/dashboard/src/lib/supabase.ts` — add `updateTagOrder(updates)` function  
- `packages/dashboard/src/lib/supabase.test.ts` — test for `updateTagOrder`
- `packages/dashboard/src/components/tagList.ts:8` — `TagListOptions` — add `reorderFn` option
- `packages/dashboard/src/components/tagList.ts:40-103` — row rendering per type group — add up/down buttons
- `packages/dashboard/src/components/tagList.test.ts` — tests for reorder UI

## Acceptance Criteria

- [ ] Up/down reorder buttons appear on each tag row within each type group
- [ ] Up button absent for the first tag in a group; down button absent for the last tag in a group
- [ ] Clicking up/down swaps sort_order in memory, disables clicked button, calls `reorderFn` with the two affected rows, then moves the DOM row
- [ ] Sort_orders restored in memory on failure; button re-enabled
- [ ] `npm run typecheck` passes with 0 errors
- [ ] `npm run lint` passes with 0 warnings

## Tests

- `packages/dashboard/src/lib/supabase.test.ts` — `updateTagOrder calls update with new sort_orders for each tag` — asserts update called per tag with correct sort_order
- `packages/dashboard/src/components/tagList.test.ts` — `reorder buttons appear for each tag` — asserts move-up/down buttons exist when reorderFn provided
- `packages/dashboard/src/components/tagList.test.ts` — `first tag in group has no move-up; last has no move-down` — boundary assertions
- `packages/dashboard/src/components/tagList.test.ts` — `move-up swaps sort_orders and calls reorderFn` — asserts swapped sort_order values in call arguments

## Agent Pre-Start Checkpoint

- Agent: claude-sonnet-4-6 (night shift)
- Date: 2026-04-25
- Verdict: APPROVED
- Checkpoints:
  - [x] `packages/dashboard/src/components/tagList.ts` exists with `TagListOptions` and row rendering per group
  - [x] `tags.sort_order` column confirmed in schema (integer, not null, default 0)
  - [x] Existing `updateTag` in supabase.ts can update sort_order per tag
  - [x] All 4 tests are objectively testable
