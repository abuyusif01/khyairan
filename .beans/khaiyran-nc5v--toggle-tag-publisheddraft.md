---
# khaiyran-nc5v
title: Toggle tag published/draft
status: completed
type: feature
priority: low
created_at: 2026-04-24T01:06:23Z
updated_at: 2026-04-26T05:56:22Z
parent: khaiyran-tvmy
---

Quick toggle on tag list to publish/unpublish a tag. Unpublishing hides the category from the public site filter bar and product groups. Toggle button on each tag row in the tag list.

## Related Code

- `packages/dashboard/src/lib/supabase.ts` — add `toggleTagPublished(tagId, published)`
- `packages/dashboard/src/lib/supabase.test.ts` — add test
- `packages/dashboard/src/components/tagList.ts:1` — add toggle button to each tag row

## Acceptance Criteria

- [x] Each tag row in the tag list has a toggle button (Publish/Unpublish based on current state)
- [x] Clicking toggle calls toggleTagPublished and updates the button and status badge
- [x] `npm run typecheck -w packages/dashboard` passes with 0 errors
- [x] `npm run lint -w packages/dashboard` passes with 0 warnings
- [x] `npm run build -w packages/dashboard` exits 0

## Tests

- `packages/dashboard/src/components/tagList.test.ts` — `renders toggle button for each tag` — asserts each row has a button
- `packages/dashboard/src/components/tagList.test.ts` — `toggle button calls toggleFn and updates status` — asserts toggleFn called with tag id and !published, status badge updates

## Agent Pre-Start Checkpoint

- Agent: Claude Sonnet 4.6
- Date: 2026-04-24
- Verdict: APPROVED
- Checkpoints:
  - [x] packages/dashboard/src/lib/supabase.ts exists
  - [x] packages/dashboard/src/components/tagList.ts exists as integration target
  - [x] All criteria testable

## Summary of Changes

- Added toggleTagPublished(tagId, published) to packages/dashboard/src/lib/supabase.ts
- Updated packages/dashboard/src/components/tagList.ts — accepts options.toggleFn, renders toggle button per row, updates badge/button text optimistically
