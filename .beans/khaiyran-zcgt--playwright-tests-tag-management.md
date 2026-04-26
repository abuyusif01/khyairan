---
# khaiyran-zcgt
title: Playwright tests — tag management
status: todo
type: task
priority: high
created_at: 2026-04-26T07:46:13Z
updated_at: 2026-04-26T07:46:13Z
---

Tag management has zero Playwright test coverage. CLAUDE.md mandates Playwright for all frontend features. The tag list, add/edit tag form, toggle, delete, and reorder must be verified in a real browser.

## Related Code

- `packages/dashboard/src/components/tagList.ts` — tag list rendering
- `packages/dashboard/src/components/tagForm.ts` — add/edit form
- `packages/dashboard/dashboard.html` — tags tab

## Acceptance Criteria

- [ ] Playwright scenario: tags tab renders tags grouped by type
- [ ] Playwright scenario: clicking "Add tag" shows the add tag form with Name, Slug, Type, Sort order, Published fields
- [ ] Playwright scenario: typing in the name field auto-fills the slug field
- [ ] Playwright scenario: clicking Edit on a tag shows the edit form pre-filled
- [ ] Playwright scenario: toggle published button updates the status badge
- [ ] `npm run typecheck -w packages/dashboard` passes with 0 errors
- [ ] `npm run lint -w packages/dashboard` passes with 0 warnings

## Tests

- `playwright` — dashboard tags tab — tag table visible, tags grouped by type header
- `playwright` — click Add tag — form renders with all required fields
- `playwright` — type "Soft Drinks" in name field — slug auto-fills to "soft-drinks"
- `playwright` — click Edit on first tag — edit form opens pre-filled with that tag's name
- `playwright` — click toggle on a published tag — status badge changes to Draft

## Agent Pre-Start Checkpoint

(Written by the pre-start reviewing agent — do not fill manually)
