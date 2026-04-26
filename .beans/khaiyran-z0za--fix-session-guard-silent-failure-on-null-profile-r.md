---
# khaiyran-z0za
title: Fix session guard silent failure on null profile role
status: completed
type: bug
priority: normal
created_at: 2026-04-26T07:45:50Z
updated_at: 2026-04-26T11:21:12Z
---

`session.ts` returns `null` when `profiles.role` is missing or undefined (corrupted row, DB issue). `dashboard.ts` destructures the result without checking for null — this silently fails with no user-facing error. The user is left on a blank page with no indication of what went wrong.

## Related Code

- `packages/dashboard/src/lib/session.ts:17-24` — returns null on missing role
- `packages/dashboard/src/dashboard.ts` — consumes checkSession result, needs null guard with redirect

## Acceptance Criteria

- [ ] If `checkSession()` returns null due to missing role, user is redirected to `index.html` with an error query param (e.g. `?error=session`)
- [ ] Or: an error message is shown on the dashboard page before redirect
- [ ] `npm run typecheck -w packages/dashboard` passes with 0 errors
- [ ] `npm run lint -w packages/dashboard` passes with 0 warnings
- [ ] `npm run build -w packages/dashboard` exits 0

## Tests

- `packages/dashboard/src/lib/session.test.ts` — `checkSession returns null when profile has no role` — mocks profile row with null role, asserts return value is null
- `packages/dashboard/src/lib/session.test.ts` — `checkSession returns null when profile row missing` — mocks empty profile result

## Agent Pre-Start Checkpoint

(Written by the pre-start reviewing agent — do not fill manually)

## Summary of Changes

Fixed session.ts: when profile data has no role (or profile row is missing), now redirects to /?error=session before returning null, consistent with no-session behavior. Added two unit tests to session.test.ts covering both null-role and missing-profile-row cases.
