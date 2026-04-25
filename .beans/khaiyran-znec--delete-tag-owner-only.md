---
# khaiyran-znec
title: Delete tag (owner only)
status: completed
type: feature
priority: low
created_at: 2026-04-24T01:06:23Z
updated_at: 2026-04-25T00:23:44Z
parent: khaiyran-tvmy
---

Owner-only delete with confirmation. If tag has products attached (via product_tags), show warning with count before allowing delete. Cascades via FK. Delete button appears in tag list only when isOwner=true.

## Related Code

- `packages/dashboard/src/lib/supabase.ts` — add `deleteTag(tagId)`, `countProductsForTag(tagId)`
- `packages/dashboard/src/lib/supabase.test.ts` — tests for new functions
- `packages/dashboard/src/components/tagList.ts:1` — already has deleteFn option, wire it up in dashboard.ts
- `packages/dashboard/src/dashboard.ts` — pass deleteFn to renderTagList when role=owner

## Acceptance Criteria

- [ ] Delete button only rendered when isOwner=true in tagList
- [ ] Clicking delete shows confirmation with product count warning if products exist
- [ ] On confirmation, calls deleteTag and removes row from DOM
- [ ] `npm run typecheck -w packages/dashboard` passes with 0 errors
- [ ] `npm run lint -w packages/dashboard` passes with 0 warnings
- [ ] `npm run build -w packages/dashboard` exits 0

## Tests

- `packages/dashboard/src/components/tagList.test.ts` — `renders delete button only when isOwner` — asserts delete button absent without isOwner, present with isOwner
- `packages/dashboard/src/components/tagList.test.ts` — `delete button calls deleteFn after confirmation` — mocks confirm(), asserts deleteFn called and row removed
- `packages/dashboard/src/lib/supabase.test.ts` — `deleteTag calls delete with tag id` — asserts supabase delete called
- `packages/dashboard/src/lib/supabase.test.ts` — `countProductsForTag returns count` — asserts supabase select called and count returned

## Agent Pre-Start Checkpoint

- Agent: Claude Sonnet 4.6
- Date: 2026-04-25
- Verdict: APPROVED
- Checkpoints:
  - [x] tagList.ts already has deleteFn/isOwner option infrastructure
  - [x] All criteria testable

## Summary of Changes

- Added deleteTag(), countProductsForTag() to supabase.ts
- Updated tagList.ts — delete button per row when isOwner, shows product count warning via countProductsFn before confirm
- Updated dashboard.ts — passes deleteFn/countProductsFn/isOwner to renderTagList
