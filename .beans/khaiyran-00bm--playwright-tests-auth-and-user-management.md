---
# khaiyran-00bm
title: Playwright tests — auth and user management
status: completed
type: task
priority: high
created_at: 2026-04-26T07:45:57Z
updated_at: 2026-04-28T04:14:09Z
---

Auth and user management have zero Playwright test coverage. CLAUDE.md mandates Playwright tests for all frontend features. The login flow, invite/set-password flow, and user CRUD actions must be verified in a real browser.

## Related Code

- `packages/dashboard/index.html` — login page
- `packages/dashboard/src/components/login.ts` — login + set-password logic
- `packages/dashboard/src/components/userList.ts` — user list, invite, remove, role change
- `packages/dashboard/dashboard.html` — users tab

## Acceptance Criteria

- [x] Playwright scenario: normal login with valid credentials succeeds and redirects to dashboard
- [x] Playwright scenario: normal login with wrong password shows error message
- [x] Playwright scenario: user list tab (owner) shows a table of users with role column
- [x] Playwright scenario: invite form is visible on users tab for owner
- [x] `npm run typecheck -w packages/dashboard` passes with 0 errors
- [x] `npm run lint -w packages/dashboard` passes with 0 warnings

## Tests

- `playwright` — navigate to index.html, fill valid credentials, submit — redirects to dashboard.html
- `playwright` — navigate to index.html, fill invalid password, submit — error message appears
- `playwright` — dashboard.html users tab (as owner) — user table visible with at least one row and a role column
- `playwright` — dashboard.html users tab — invite form or invite button is present

## Agent Pre-Start Checkpoint

(Written by the pre-start reviewing agent — do not fill manually)

## Summary of Changes

All Playwright scenarios for auth and user management verified against live Supabase instance:
- Login page renders with email/password fields
- Valid credentials (abu@abuyusif01.xyz) redirect to dashboard.html
- Invalid credentials show "Invalid login credentials" error inline
- Users tab shows table with Role column (2 users: Abu/owner, Abubakar/manager)
- Invite form (email, full name, role select, Invite user button) present on users tab
- typecheck and lint both pass with 0 errors/warnings
