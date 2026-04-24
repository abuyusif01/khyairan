---
# khaiyran-2qtx
title: Dashboard layout shell (header, nav, responsive)
status: in-progress
type: task
priority: high
created_at: 2026-04-24T01:05:43Z
updated_at: 2026-04-24T11:43:02Z
parent: khaiyran-2e0d
---

Minimal layout: header with business name + logout button, sidebar/bottom nav with links to Products, Tags, Users (owner only), Settings. Mobile responsive. Alpine.js for nav toggle.


## Related Code

- `packages/dashboard/index.html:1-17` — current bare scaffold, will add layout structure (header, nav, main content area)
- `packages/dashboard/src/main.ts:1-5` — Alpine init, will register layout component
- New: `packages/dashboard/src/components/layout.ts` — Alpine.js component for header, sidebar/bottom nav, responsive toggle

## Acceptance Criteria

- [ ] Header shows "Khyairan" business name and a logout button
- [ ] Sidebar nav has links: Products, Tags, Settings
- [ ] Users link visible only when role is `owner`
- [ ] Logout button calls `supabase.auth.signOut` and redirects to login
- [ ] Mobile: nav collapses to hamburger/bottom bar, toggles via Alpine
- [ ] Layout does not overflow at 375px viewport
- [ ] `npm run typecheck -w packages/dashboard` passes with 0 errors
- [ ] `npm run lint -w packages/dashboard` passes with 0 warnings
- [ ] `npm run build -w packages/dashboard` exits 0

## Tests

- `packages/dashboard/src/components/layout.test.ts` — `renders header with business name` — asserts "Khyairan" text appears in header element
- `packages/dashboard/src/components/layout.test.ts` — `renders logout button` — asserts logout button exists in DOM
- `packages/dashboard/src/components/layout.test.ts` — `renders nav links for Products and Tags` — asserts both links present
- `packages/dashboard/src/components/layout.test.ts` — `hides Users link when role is manager` — sets role to manager, asserts Users link is not in DOM
- `packages/dashboard/src/components/layout.test.ts` — `shows Users link when role is owner` — sets role to owner, asserts Users link is present

## Agent Pre-Start Checkpoint

- Agent: Claude Sonnet 4.6
- Date: 2026-04-24
- Verdict: APPROVED
- Checkpoints:
  - [x] packages/dashboard/index.html exists (stale line count, file exists)
  - [x] packages/dashboard/src/main.ts exists (stale line count, file exists)
  - [x] New files correctly marked 'New:' in spec — not a spec defect
  - [x] All 9 Acceptance Criteria are objectively testable
  - [x] Tests section has 5 entries each with file/description/assertion
  - [x] Supabase signOut call is testable via mock
