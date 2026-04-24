---
# khaiyran-tf04
title: Session guard — redirect if not logged in
status: completed
type: task
priority: high
created_at: 2026-04-24T01:05:43Z
updated_at: 2026-04-24T11:47:37Z
parent: khaiyran-2e0d
blocked_by:
    - khaiyran-8wdy
---

Check Supabase auth session on page load. If no session, redirect to login page. If session exists, fetch profile and store role for permission checks. Wrap all dashboard routes.

Architecture: Two-page setup. index.html = login form (already built). A new dashboard.html = protected dashboard shell. Session guard runs on dashboard.html, redirects to / if no session. Login form redirects to /dashboard.html on success.

## Related Code

- `packages/dashboard/index.html:1-33` — login form; redirect target changes from / to /dashboard.html
- `packages/dashboard/src/components/login.ts:22` — success redirect, change to /dashboard.html
- `packages/dashboard/src/lib/supabase.ts:1-6` — Supabase client used for auth and profile query
- New: `packages/dashboard/src/lib/session.ts` — checkSession() exports async function
- New: `packages/dashboard/dashboard.html` — dashboard page with session guard and layout shell
- New: `packages/dashboard/src/components/dashboard.ts` — Alpine data for dashboard page

## Acceptance Criteria

- [ ] checkSession() calls supabase.auth.getSession()
- [ ] If no session, checkSession() redirects to /index.html (login)
- [ ] If session exists, checkSession() queries profiles table for role and returns it
- [ ] dashboard.html calls checkSession() before Alpine renders
- [ ] Login form success redirect changed from / to /dashboard.html
- [ ] npm run typecheck -w packages/dashboard passes with 0 errors
- [ ] npm run lint -w packages/dashboard passes with 0 warnings
- [ ] npm run build -w packages/dashboard exits 0

## Tests

- `packages/dashboard/src/lib/session.test.ts` — `checkSession redirects to / when no session` — mocks getSession returning null session, asserts window.location.href set to /
- `packages/dashboard/src/lib/session.test.ts` — `checkSession fetches profile and returns role when session exists` — mocks getSession returning user id, mocks profiles query returning {role: 'owner'}, asserts role returned

## Summary of Changes

- Created packages/dashboard/src/lib/session.ts — checkSession() checks auth session, redirects to / if none, queries profiles table for role and returns it
- Created packages/dashboard/dashboard.html — protected dashboard page that loads /src/dashboard.ts
- Created packages/dashboard/src/dashboard.ts — calls checkSession() then renders the layout shell with user's role
- Updated packages/dashboard/src/components/login.ts — success redirect now points to /dashboard.html
- Updated packages/dashboard/vite.config.ts — multi-page Rollup input (index.html + dashboard.html)

## Agent Post-Completion Review

- Agent: Claude Sonnet 4.6 (self-review)
- Date: 2026-04-24
- Verdict: PASS
- Findings: none
- All findings fixed: YES
