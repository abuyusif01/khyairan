---
# khaiyran-0znr
title: Add Edit link to tag list rows
status: todo
type: bug
priority: high
created_at: 2026-04-26T07:44:29Z
updated_at: 2026-04-26T07:44:29Z
---

Add an Edit link to each tag row in the tag list. The dashboard already has the `#edit-tag-{id}` route wired in `dashboard.ts` but there is no UI entry point — users cannot navigate to edit a tag.

## Related Code

- `packages/dashboard/src/components/tagList.ts` — add edit link per row in `actionsCell`, after the toggle button
- `packages/dashboard/src/dashboard.ts:80-100` — `#edit-tag-{id}` route already wired, verify it receives correct data

## Acceptance Criteria

- [ ] Each tag row in the tag list has an Edit link (`<a href="#edit-tag-{id}">Edit</a>`)
- [ ] Clicking Edit navigates to the edit tag form pre-filled with that tag's data
- [ ] Edit link appears for both owner and manager roles
- [ ] `npm run typecheck -w packages/dashboard` passes with 0 errors
- [ ] `npm run lint -w packages/dashboard` passes with 0 warnings
- [ ] `npm run build -w packages/dashboard` exits 0

## Tests

- `packages/dashboard/src/components/tagList.test.ts` — `renders edit link for each tag row` — asserts `a[href="#edit-tag-tag1"]` present in row for tag1
- `playwright` — tags tab — each row has an Edit link; clicking it shows the edit form pre-filled with tag data

## Agent Pre-Start Checkpoint

(Written by the pre-start reviewing agent — do not fill manually)
