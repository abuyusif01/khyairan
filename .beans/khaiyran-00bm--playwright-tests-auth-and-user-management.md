---
# khaiyran-00bm
title: Playwright tests — auth and user management
status: todo
type: task
priority: high
created_at: 2026-04-26T07:45:57Z
updated_at: 2026-04-26T11:22:58Z
---

Auth and user management have zero Playwright test coverage. CLAUDE.md mandates Playwright tests for all frontend features. The login flow, invite/set-password flow, and user CRUD actions must be verified in a real browser.

## Related Code

- `packages/dashboard/index.html` — login page
- `packages/dashboard/src/components/login.ts` — login + set-password logic
- `packages/dashboard/src/components/userList.ts` — user list, invite, remove, role change
- `packages/dashboard/dashboard.html` — users tab

## Acceptance Criteria

- [ ] Playwright scenario: normal login with valid credentials succeeds and redirects to dashboard
- [ ] Playwright scenario: normal login with wrong password shows error message
- [ ] Playwright scenario: user list tab (owner) shows a table of users with role column
- [ ] Playwright scenario: invite form is visible on users tab for owner
- [ ] `npm run typecheck -w packages/dashboard` passes with 0 errors
- [ ] `npm run lint -w packages/dashboard` passes with 0 warnings

## Tests

- `playwright` — navigate to index.html, fill valid credentials, submit — redirects to dashboard.html
- `playwright` — navigate to index.html, fill invalid password, submit — error message appears
- `playwright` — dashboard.html users tab (as owner) — user table visible with at least one row and a role column
- `playwright` — dashboard.html users tab — invite form or invite button is present

## Agent Pre-Start Checkpoint

(Written by the pre-start reviewing agent — do not fill manually)

## Blocked

- Blocked by: Running Supabase backend (local or remote)
- Reason: These Playwright tests require authenticated dashboard access, which requires a working Supabase instance. No local Supabase container was running (supabase start fails — container not found) and no SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY env vars are configured.
- Next available bean: none (all other ready beans are completed)
- To unblock: run `supabase start` in the project root with Docker running, or set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in packages/dashboard/.env, then resume these beans.
