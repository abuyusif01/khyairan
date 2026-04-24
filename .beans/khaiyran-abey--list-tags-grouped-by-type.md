---
# khaiyran-abey
title: List tags grouped by type
status: completed
type: feature
priority: low
created_at: 2026-04-24T01:06:23Z
updated_at: 2026-04-24T12:09:43Z
parent: khaiyran-tvmy
---

Show all tags grouped under their type headers (category, brand, etc). Show tag name, slug, sort_order, published status. Collapsible type groups using HTML details/summary.

## Related Code

- `packages/dashboard/src/lib/supabase.ts` — uses existing `fetchAllTags()`
- New: `packages/dashboard/src/components/tagList.ts` — `renderTagList(container, tags)` component
- New: `packages/dashboard/src/components/tagList.test.ts` — tests
- `packages/dashboard/src/dashboard.ts` — add `#tags` route

## Acceptance Criteria

- [ ] Renders one `<details>` group per distinct tag type (e.g. category, brand)
- [ ] Each group header (`<summary>`) shows the type name
- [ ] Each tag row shows: name, slug, sort_order, published status badge
- [ ] Tags within each group are sorted by sort_order ascending
- [ ] `npm run typecheck -w packages/dashboard` passes with 0 errors
- [ ] `npm run lint -w packages/dashboard` passes with 0 warnings
- [ ] `npm run build -w packages/dashboard` exits 0

## Tests

- `packages/dashboard/src/components/tagList.test.ts` — `renders one group per tag type` — asserts one details element per distinct type
- `packages/dashboard/src/components/tagList.test.ts` — `shows type name in group header` — asserts summary text contains type name
- `packages/dashboard/src/components/tagList.test.ts` — `renders tag rows with name slug sort_order and published status` — asserts tag data visible in rows
- `packages/dashboard/src/components/tagList.test.ts` — `sorts tags within group by sort_order` — asserts lower sort_order tag appears before higher

## Agent Pre-Start Checkpoint

- Agent: Claude Sonnet 4.6
- Date: 2026-04-24
- Verdict: APPROVED
- Checkpoints:
  - [x] packages/dashboard/src/lib/supabase.ts exists with fetchAllTags()
  - [x] packages/dashboard/src/dashboard.ts exists with hash routing
  - [x] All Acceptance Criteria objectively testable
  - [x] Tests section complete with 4 specific tests

## Summary of Changes

- Created packages/dashboard/src/components/tagList.ts — renderTagList(container, tags) groups tags by type, renders collapsible details/summary sections, sorted by sort_order within each group
- Updated packages/dashboard/src/dashboard.ts — #tags hash route renders tagList
