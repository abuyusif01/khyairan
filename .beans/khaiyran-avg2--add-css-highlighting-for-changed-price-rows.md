---
# khaiyran-avg2
title: Add CSS highlighting for changed price rows
status: todo
type: bug
priority: normal
created_at: 2026-04-26T07:45:01Z
updated_at: 2026-04-26T07:45:01Z
---

`priceEditor.ts` sets `[data-changed]` on table rows when a price is edited inline. There is no CSS rule for `[data-changed]` — rows look identical whether they've been changed or not. Users cannot tell which prices they've modified before saving.

## Related Code

- `packages/dashboard/dashboard.html` — add `tr[data-changed]` CSS rule
- `packages/dashboard/src/components/priceEditor.ts` — sets `row.setAttribute('data-changed', '')` on input

## Acceptance Criteria

- [ ] `tr[data-changed]` rows have a visible highlight (e.g. light yellow/amber background or left border accent)
- [ ] Unchanged rows are not highlighted
- [ ] Highlight is visible at 375px width
- [ ] `npm run lint -w packages/dashboard` passes with 0 warnings
- [ ] `npm run build -w packages/dashboard` exits 0

## Tests

- `playwright` — prices tab — edit a price inline — that row becomes visually distinct from unchanged rows

## Agent Pre-Start Checkpoint

(Written by the pre-start reviewing agent — do not fill manually)
