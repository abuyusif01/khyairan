---
# khaiyran-b3ic
title: Remove user
status: completed
type: feature
priority: deferred
created_at: 2026-04-24T01:06:23Z
updated_at: 2026-04-26T05:56:23Z
parent: khaiyran-dpph
blocked_by:
    - khaiyran-a3ls
---

Owner-only: each user row has a Remove button. Clicking shows a confirmation prompt. Confirmed: calls `removeUser(userId)` from supabase.ts (which proxies to the admin-users Edge Function). On success re-fetches profiles via `fetchAllProfiles()` and re-renders the table. On error shows inline error. Owner cannot remove themselves.

## Related Code

- `packages/dashboard/src/components/userList.ts` — add Remove button to each row; add `removeFn` and `currentUserId` to UserListOptions
- `packages/dashboard/src/components/userList.test.ts` — unit tests
- `packages/dashboard/src/dashboard.ts:11-33` — add `removeUser` to imports
- `packages/dashboard/src/dashboard.ts:48-55` — pass `removeUser` as `removeFn`, `fetchAllProfiles` as `refetchFn`, session userId as `currentUserId`
- `packages/dashboard/src/lib/supabase.ts:177-179` — `removeUser(userId)` helper already exists
- `packages/dashboard/src/lib/session.ts:4-19` — change `checkSession()` to return `{ role: Role; userId: string } | null` instead of `Role | null`
- `packages/dashboard/src/lib/session.test.ts` — `fetches profile and returns role when session exists` — update assertion to `result.role === 'owner'` and `result.userId === 'caller-id'`
- `packages/dashboard/src/dashboard.ts:115-129` — update call site: destructure `{ role, userId }` from `checkSession()` result; pass `role` to `renderLayout` and `userId` down to `renderView`

## Acceptance Criteria

- [x] Each user row has a Remove button (disabled for current user's own row)
- [x] Clicking Remove shows window.confirm prompt with user name
- [x] On confirm: calls removeFn(userId), re-fetches, re-renders; removed user is gone
- [x] On cancel: nothing happens
- [x] On error: inline error visible; row remains
- [x] `npm run typecheck` 0 errors, `npm run lint` 0 warnings

## Tests

- `userList.test.ts` — `renders Remove button per row, disabled for current user` — asserts buttons present; own-row button has disabled attribute
- `userList.test.ts` — `Remove button calls removeFn with userId after confirm` — stub window.confirm to return true, assert removeFn called with correct userId
- `userList.test.ts` — `Remove button does nothing when confirm cancelled` — stub confirm to return false, assert removeFn not called
- `userList.test.ts` — `shows error on removeFn rejection` — removeFn rejects, assert error text visible; row still present
- `userList.test.ts` — `re-renders table without removed user on success` — removeFn resolves, refetchFn returns remaining profiles, assert removed row gone
- playwright: navigate to #users — Remove button visible for other user; own row button disabled
- playwright: click Remove, confirm — user row removed from table

## Agent Pre-Start Checkpoint

- Agent: claude-sonnet-4-6
- Date: 2026-04-25
- Verdict: APPROVED (after three revisions)
- Checkpoints:
  - [x] removeUser exists at supabase.ts:177-179
  - [x] session.ts:4-19 is the correct range for checkSession
  - [x] dashboard.ts:115-129 is the init() call site
  - [x] session.test.ts updated assertion specified
  - [x] All 5 userList tests are specific and assertable

## Agent Post-Completion Review

- Agent: claude-sonnet-4-6
- Date: 2026-04-25
- Verdict: PASS
- Findings: None. TDD order confirmed, logic correct, session.ts return type updated, dashboard.ts correctly wired.
- All findings fixed: N/A

## Summary of Changes

Added Remove button to each user row in userList.ts (disabled for current user's own row). Clicking shows window.confirm with user's name. On confirm: calls removeFn(userId) -> admin-users Edge Function, re-fetches profiles, re-renders table. On error shows inline error; row preserved.

checkSession() in session.ts now returns { role, userId } | null (new Session interface) instead of bare Role. dashboard.ts updated to destructure both and pass userId down to renderView and renderUserList.
