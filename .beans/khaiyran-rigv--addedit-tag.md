---
# khaiyran-rigv
title: Add/edit tag
status: completed
type: feature
priority: low
created_at: 2026-04-24T01:06:23Z
updated_at: 2026-04-26T05:56:22Z
parent: khaiyran-tvmy
---

Form: name (text), slug (auto-generated from name, editable), type (datalist of existing distinct types + ability to type a new one), sort_order (number), published toggle. Used for both create (no id) and edit (with existing tag).

## Related Code

- `packages/dashboard/src/lib/supabase.ts` — add `createTag(fields)`, `updateTag(id, fields)`, `fetchDistinctTagTypes()`
- `packages/dashboard/src/lib/supabase.test.ts` — add tests
- New: `packages/dashboard/src/components/tagForm.ts` — `renderTagForm(container, existingTag, existingTypes, onSuccess, saveFn)`
- New: `packages/dashboard/src/components/tagForm.test.ts` — tests
- `packages/dashboard/src/dashboard.ts` — add `#add-tag` and `#edit-tag-<id>` routes

## Acceptance Criteria

- [x] Form renders: name (text, required), slug (text, required), type (input with datalist of existing types, required), sort_order (number, required), published (checkbox)
- [x] Slug auto-fills from name (lowercase, hyphens for spaces) when name changes, if slug not manually edited
- [x] When existingTag provided, form is pre-filled
- [x] Submitting calls saveFn with correct fields and calls onSuccess
- [x] On error, error feedback shown
- [x] `npm run typecheck -w packages/dashboard` passes with 0 errors
- [x] `npm run lint -w packages/dashboard` passes with 0 warnings
- [x] `npm run build -w packages/dashboard` exits 0

## Tests

- `packages/dashboard/src/components/tagForm.test.ts` — `renders all form fields` — asserts name, slug, type, sort_order, published inputs exist
- `packages/dashboard/src/components/tagForm.test.ts` — `auto-generates slug from name` — sets name, asserts slug auto-fills
- `packages/dashboard/src/components/tagForm.test.ts` — `does not overwrite manually edited slug` — manually edits slug, then changes name, asserts slug unchanged
- `packages/dashboard/src/components/tagForm.test.ts` — `pre-fills from existingTag` — passes tag, asserts all fields have tag values
- `packages/dashboard/src/components/tagForm.test.ts` — `calls saveFn and onSuccess on valid submit` — asserts saveFn called with correct fields
- `packages/dashboard/src/components/tagForm.test.ts` — `shows error when saveFn throws` — asserts error feedback

## Agent Pre-Start Checkpoint

- Agent: Claude Sonnet 4.6
- Date: 2026-04-24
- Verdict: APPROVED
- Checkpoints:
  - [x] All existing files exist
  - [x] All criteria testable
  - [x] Slug generation: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

## Summary of Changes

- Added createTag(), updateTag(), UpdateTagFields type to packages/dashboard/src/lib/supabase.ts
- Created packages/dashboard/src/components/tagForm.ts — form with name/slug/type(datalist)/sort_order/published, slug auto-generated from name unless manually edited, works for both create and edit
- Updated packages/dashboard/src/dashboard.ts — #add-tag and #edit-tag-<id> routes; #tags route now passes toggleFn and isOwner to renderTagList
