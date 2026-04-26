---
# khaiyran-ih4h
title: Add unit tests for login invite flow and setPassword validation
status: completed
type: task
priority: high
created_at: 2026-04-26T07:45:39Z
updated_at: 2026-04-26T11:22:42Z
---

`login.ts` has `init()`, `setPassword()`, and mode-switching logic but `login.test.ts` only has 3 tests covering normal login. The entire invite/set-password flow has zero unit test coverage, including password validation and mode detection.

## Related Code

- `packages/dashboard/src/components/login.test.ts` — add missing test cases
- `packages/dashboard/src/components/login.ts:25-72` — `init()`, `setPassword()`, mode field

## Acceptance Criteria

- [ ] Test: `init()` with `#type=invite` in hash and a valid session sets `mode` to `'set-password'`
- [ ] Test: `init()` with `?type=invite` in search params and a valid session sets `mode` to `'set-password'`
- [ ] Test: `init()` with no invite param leaves `mode` as `'login'`
- [ ] Test: `setPassword()` with mismatched passwords sets `error` to 'Passwords do not match'
- [ ] Test: `setPassword()` with password shorter than 8 chars sets `error` to appropriate message
- [ ] Test: `setPassword()` success calls `supabase.auth.updateUser` and redirects
- [ ] `npm run typecheck -w packages/dashboard` passes with 0 errors
- [ ] `npm run lint -w packages/dashboard` passes with 0 warnings
- [ ] `npm run build -w packages/dashboard` exits 0

## Tests

- `packages/dashboard/src/components/login.test.ts` — `init sets mode to set-password for hash invite` — mocks `getSession` returning a session, sets `location.hash = '#type=invite'`, calls `init()`, asserts `mode === 'set-password'`
- `packages/dashboard/src/components/login.test.ts` — `init stays in login mode without invite param` — asserts `mode === 'login'`
- `packages/dashboard/src/components/login.test.ts` — `setPassword rejects mismatched passwords` — asserts `error` message set, `updateUser` not called
- `packages/dashboard/src/components/login.test.ts` — `setPassword rejects passwords under 8 chars` — asserts `error` message set
- `packages/dashboard/src/components/login.test.ts` — `setPassword success calls updateUser and redirects` — mocks `updateUser`, asserts called with correct password

## Agent Pre-Start Checkpoint

(Written by the pre-start reviewing agent — do not fill manually)

## Summary of Changes

Added 4 missing test cases to login.test.ts: (1) init with search param ?type=invite sets mode to set-password, (2) setPassword rejects mismatched passwords with error message, (3) setPassword rejects short passwords (<8 chars), (4) setPassword success calls updateUser with correct password and redirects to /dashboard.html. Also added mockUpdateUser to the Supabase mock. All 9 login tests pass.
