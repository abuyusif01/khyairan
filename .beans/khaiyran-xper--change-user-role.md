---
# khaiyran-xper
title: Change user role
status: completed
type: feature
priority: deferred
created_at: 2026-04-24T01:06:23Z
updated_at: 2026-04-26T05:56:23Z
parent: khaiyran-dpph
---

Owner-only: dropdown to change a user profile role between owner and manager. Updates `profiles.role`. Rendered inline in the user list.

## Related Code

- `packages/dashboard/src/lib/supabase.ts` — add `updateProfileRole(userId, role)`
- `packages/dashboard/src/lib/supabase.test.ts` — test for `updateProfileRole`
- `packages/dashboard/src/components/userList.ts:12-32` — add role dropdown per row
- `packages/dashboard/src/components/userList.test.ts` — tests for role change

## Acceptance Criteria

- [x] Each user row in the user list renders a role dropdown (owner/manager) pre-selected to current role
- [x] Changing the dropdown calls `updateProfileRole` with the user's id and new role
- [x] Dropdown is shown only when `changeRoleFn` option is provided (owner-only gating at route level)
- [x] `npm run typecheck` passes with 0 errors
- [x] `npm run lint` passes with 0 warnings

## Tests

- `packages/dashboard/src/lib/supabase.test.ts` — `updateProfileRole calls update on profiles` — asserts update called with correct role, eq with user id
- `packages/dashboard/src/components/userList.test.ts` — `renders role dropdown per row when changeRoleFn provided` — asserts select[data-role-select] exists per row
- `packages/dashboard/src/components/userList.test.ts` — `changing role dropdown calls changeRoleFn with userId and new role` — changes select, asserts changeRoleFn called

## Agent Pre-Start Checkpoint

- Agent: claude-sonnet-4-6 (night shift)
- Date: 2026-04-25
- Verdict: APPROVED
- Checkpoints:
  - [x] `profiles` table has `role` column with owner/manager enum — confirmed in schema
  - [x] RLS allows owner to UPDATE profiles (confirmed in 00002_rls_policies.sql:97-99)
  - [x] `userList.ts` exists with profile rows
  - [x] All 3 tests are objectively testable

## Agent Post-Completion Review

- Agent: claude-sonnet-4-6
- Date: 2026-04-25
- Verdict: PASS
- Findings: None
- All findings fixed: N/A

## Summary of Changes

Added `updateProfileRole(userId, role)` to `supabase.ts`. Updated `renderUserList` to accept `UserListOptions.changeRoleFn` and render a role dropdown (owner/manager) pre-selected to current role when provided. Wired into `#users` route in dashboard.ts with `updateProfileRole` as the handler.
