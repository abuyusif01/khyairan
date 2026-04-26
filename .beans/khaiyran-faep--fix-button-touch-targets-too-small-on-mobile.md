---
# khaiyran-faep
title: Fix button touch targets too small on mobile
status: todo
type: bug
priority: high
created_at: 2026-04-26T07:44:55Z
updated_at: 2026-04-26T07:44:55Z
---

Action buttons in all tables (Edit, Delete, Publish, Unpublish, ↑, ↓) have `padding: 0.3rem 0.7rem` and `font-size: 0.8rem`, resulting in ~24–28px tap targets. WCAG 2.1 requires 44×44px minimum. Managers regularly use this dashboard on mobile phones.

## Related Code

- `packages/dashboard/dashboard.html:117` — `button` base rule with small padding
- `packages/dashboard/dashboard.html` — add a mobile media query for larger button padding in tables

## Acceptance Criteria

- [ ] At viewport width ≤ 640px, table action buttons have a minimum tap height of 44px (can be achieved via `min-height` or `padding`)
- [ ] Form submit buttons are already full-width — verify they are at least 44px tall on mobile
- [ ] Desktop button size unchanged (only mobile breakpoint affected)
- [ ] `npm run lint -w packages/dashboard` passes with 0 warnings
- [ ] `npm run build -w packages/dashboard` exits 0

## Tests

- `playwright` — resize to 375×812 — table action buttons (Edit, Delete, Publish) are at least 44px tall as measured by `getBoundingClientRect().height`

## Agent Pre-Start Checkpoint

(Written by the pre-start reviewing agent — do not fill manually)
