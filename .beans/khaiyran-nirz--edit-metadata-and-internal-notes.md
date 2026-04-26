---
# khaiyran-nirz
title: Edit metadata and internal notes
status: completed
type: feature
priority: deferred
created_at: 2026-04-24T01:05:59Z
updated_at: 2026-04-26T05:56:22Z
parent: khaiyran-md1g
---

JSONB metadata editor (key-value pairs) and free-text internal_notes field on product edit form. Never shown publicly.

## Related Code

- `packages/dashboard/src/types.ts:1-10` — Product interface, needs `metadata` and `internal_notes` fields added
- `packages/dashboard/src/lib/supabase.ts:9-16` — fetchAllProducts, needs to select `metadata, internal_notes`
- `packages/dashboard/src/lib/supabase.ts:92` — UpdateProductFields type, needs to include these fields
- `packages/dashboard/src/components/editProductForm.ts:12-184` — form renderer, needs metadata KV editor + internal_notes textarea
- `packages/dashboard/src/components/editProductForm.test.ts` — tests to update/add

## Acceptance Criteria

- [x] `Product` type includes `metadata: Record<string, string>` and `internal_notes: string | null`
- [x] `fetchAllProducts` selects `metadata` and `internal_notes` from DB
- [x] Edit product form renders an `internal_notes` textarea pre-filled with current value (empty string if null)
- [x] Edit product form renders a metadata key-value editor pre-populated from product.metadata
- [x] User can add/remove key-value rows in the metadata editor
- [x] On submit, `internal_notes` and flattened `metadata` object are passed to updateFn
- [x] Fields are never shown publicly (admin only — no public-facing code touched)
- [x] `npm run typecheck` passes with 0 errors
- [x] `npm run lint` passes with 0 warnings

## Tests

- `packages/dashboard/src/components/editProductForm.test.ts` — `renders internal_notes textarea pre-filled` — asserts textarea[name="internal_notes"] value equals product.internal_notes
- `packages/dashboard/src/components/editProductForm.test.ts` — `renders metadata key-value pairs` — asserts existing metadata entries appear as input rows
- `packages/dashboard/src/components/editProductForm.test.ts` — `add metadata row button creates new inputs` — clicks add button, asserts new key+value inputs appear
- `packages/dashboard/src/components/editProductForm.test.ts` — `remove metadata row button removes inputs` — clicks remove on a row, asserts that row's inputs are gone
- `packages/dashboard/src/components/editProductForm.test.ts` — `submit includes internal_notes and metadata` — submits form, asserts updateFn called with internal_notes and metadata object

## Agent Pre-Start Checkpoint

- Agent: claude-sonnet-4-6 (night shift)
- Date: 2026-04-25
- Verdict: APPROVED
- Checkpoints:
  - [x] `packages/dashboard/src/types.ts:1-10` exists — Product interface at line 1-10 confirmed
  - [x] `packages/dashboard/src/lib/supabase.ts:9-16` exists — fetchAllProducts at lines 9-16 confirmed
  - [x] `packages/dashboard/src/lib/supabase.ts:92` — UpdateProductFields type at line 92 confirmed
  - [x] `packages/dashboard/src/components/editProductForm.ts:12-184` — renderEditProductForm confirmed
  - [x] DB schema has `metadata jsonb` and `internal_notes text` columns (confirmed in 00001_initial_schema.sql)
  - [x] All 5 tests listed are objectively testable with DOM assertions
  - [x] Acceptance criteria are all objectively verifiable

## Agent Post-Completion Review

- Agent: claude-sonnet-4-6
- Date: 2026-04-25
- Verdict: PASS
- Findings: Duplicate metadata keys are silently last-write-wins (low severity, usability gap — not a bug). No other issues.
- All findings fixed: N/A (finding is low-severity, recommend follow-up bean)

## Summary of Changes

Added `metadata: Record<string, string>` and `internal_notes: string | null` to the `Product` type. Updated `fetchAllProducts` to select these fields from Supabase. Extended `editProductForm` with a textarea for internal notes (pre-filled, trims to null on save) and a dynamic key-value metadata editor with add/remove row buttons. Submit handler collects metadata rows into a plain object and passes both fields to `updateFn`.
