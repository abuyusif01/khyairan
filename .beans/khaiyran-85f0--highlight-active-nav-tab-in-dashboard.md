---
# khaiyran-85f0
title: Highlight active nav tab in dashboard
status: todo
type: bug
priority: high
created_at: 2026-04-26T07:44:44Z
updated_at: 2026-04-26T07:44:44Z
---

The navigation bar renders links for Products, Tags, Users, Prices but never marks the active one. Users — especially on mobile — have no visual anchor for which section they are in. The nav link for the current tab should be highlighted.

## Related Code

- `packages/dashboard/src/components/layout.ts:13-18` — nav link rendering, needs `aria-current` or active class logic
- `packages/dashboard/src/dashboard.ts` — passes role to layout, needs to also pass or signal current tab
- `packages/dashboard/dashboard.html` — add CSS rule for active nav link (e.g. `[aria-current="page"]`)

## Acceptance Criteria

- [ ] The nav link matching the current hash is visually highlighted (distinct from inactive links)
- [ ] Highlight updates when the user switches tabs
- [ ] Active state uses `aria-current="page"` attribute (accessible) or equivalent
- [ ] Works on both desktop and mobile
- [ ] `npm run typecheck -w packages/dashboard` passes with 0 errors
- [ ] `npm run lint -w packages/dashboard` passes with 0 warnings
- [ ] `npm run build -w packages/dashboard` exits 0

## Tests

- `packages/dashboard/src/components/layout.test.ts` — `marks active nav link with aria-current for current hash` — passes `currentHash` and asserts matching link has `aria-current="page"`
- `playwright` — navigate to products tab — Products nav link is visually distinct; navigate to tags — Tags link is now active, Products is not

## Agent Pre-Start Checkpoint

(Written by the pre-start reviewing agent — do not fill manually)
