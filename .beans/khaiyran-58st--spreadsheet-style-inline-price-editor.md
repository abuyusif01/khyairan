---
# khaiyran-58st
title: Spreadsheet-style inline price editor
status: completed
type: feature
priority: high
created_at: 2026-04-24T01:06:23Z
updated_at: 2026-04-24T11:58:02Z
parent: khaiyran-w82t
blocked_by:
    - khaiyran-d1rl
---

Table of all products: name, size, units_per_carton, current price_ngn (editable input). Edit multiple prices inline. Single 'Save All' button batches all changed rows into Supabase updates. Shows success/error feedback. Highlight changed rows before save.

## Related Code

- `packages/dashboard/src/lib/supabase.ts` — add `updateProductPrices(updates: {id: string, price_ngn: number}[]): Promise<void>`
- New: `packages/dashboard/src/components/priceEditor.ts` — `renderPriceEditor(container, products, updateFn)` component where `updateFn` is injected for testability (defaults to `updateProductPrices` from supabase)
- New: `packages/dashboard/src/components/priceEditor.test.ts` — tests
- `packages/dashboard/src/lib/supabase.test.ts` — add test for `updateProductPrices`
- `packages/dashboard/src/dashboard.ts:1-30` — add hash-based routing, render priceEditor for `#prices` route, update nav link

## Acceptance Criteria

- [ ] Price editor renders a table with columns: name, size, units_per_carton, price_ngn input
- [ ] Each price_ngn cell is an `<input type="number">` pre-filled with current price
- [ ] Rows with changed price are visually highlighted (e.g., `data-changed` attribute or class)
- [ ] 'Save All' button is disabled when no rows have changes
- [ ] Clicking 'Save All' calls `updateProductPrices` with only changed rows
- [ ] On success, feedback message shown and changed highlights cleared
- [ ] On error, error message shown and no rows cleared
- [ ] `npm run typecheck -w packages/dashboard` passes with 0 errors
- [ ] `npm run lint -w packages/dashboard` passes with 0 warnings
- [ ] `npm run build -w packages/dashboard` exits 0

## Tests

- `packages/dashboard/src/components/priceEditor.test.ts` — `renders rows for each product with name and price input` — asserts one row per product, each with an input pre-filled with price_ngn
- `packages/dashboard/src/components/priceEditor.test.ts` — `marks row as changed when price input changes` — asserts row gets `data-changed` attribute after editing price
- `packages/dashboard/src/components/priceEditor.test.ts` — `save button disabled when no changes` — asserts Save All button is disabled when no row changed
- `packages/dashboard/src/components/priceEditor.test.ts` — `save button enabled when at least one row changed` — asserts Save All button is enabled after editing a price
- `packages/dashboard/src/components/priceEditor.test.ts` — `calls updateProductPrices with only changed rows on save` — asserts the injected update function called with correct id/price pairs
- `packages/dashboard/src/components/priceEditor.test.ts` — `shows success feedback and clears changed state after save` — asserts feedback message appears and data-changed removed
- `packages/dashboard/src/components/priceEditor.test.ts` — `shows error feedback when update throws` — asserts error message appears
- `packages/dashboard/src/lib/supabase.test.ts` — `updateProductPrices sends batch updates for each changed product` — asserts supabase upsert/update called with correct data

## Agent Pre-Start Checkpoint

- Agent: Claude Sonnet 4.6
- Date: 2026-04-24
- Verdict: APPROVED
- Checkpoints:
  - [x] packages/dashboard/src/lib/supabase.ts exists
  - [x] packages/dashboard/src/lib/supabase.test.ts exists
  - [x] packages/dashboard/src/dashboard.ts exists
  - [x] All Acceptance Criteria are objectively testable
  - [x] Tests section has specific file paths, test names, and assertions (8 tests)
  - [x] Routing decision: hash-based routing (#prices) added to dashboard.ts
  - [x] updateFn injected into renderPriceEditor for testability (per existing patterns)
  - [x] data-changed attribute approach confirmed for row highlighting
  - [x] Supabase update uses per-row UPDATE calls; throws on first error

## Agent Post-Completion Review

- Agent: Claude Sonnet 4.6 (subagent)
- Date: 2026-04-24
- Verdict: PASS
- Findings: none
- All findings fixed: YES

## Summary of Changes

- Added `updateProductPrices(updates)` to `packages/dashboard/src/lib/supabase.ts` — per-row UPDATE calls, throws on first error
- Created `packages/dashboard/src/components/priceEditor.ts` — `renderPriceEditor(container, products, updateFn)` with data-changed row highlighting, disabled Save All until changes exist, success/error feedback
- Updated `packages/dashboard/src/dashboard.ts` — hash-based routing (#prices renders priceEditor, default renders productList)
