---
# khaiyran-k1s8
title: Invite new user
status: completed
type: feature
priority: deferred
created_at: 2026-04-24T01:06:23Z
updated_at: 2026-04-25T10:33:26Z
parent: khaiyran-dpph
blocked_by:
    - khaiyran-a3ls
---

Owner-only form above the user table: email, full_name, role dropdown (owner/manager). On submit calls `inviteUser()` from supabase.ts (which proxies to the admin-users Edge Function). On success re-fetches the full profile list via `fetchAllProfiles()` and re-renders the table; form resets. On error shows inline message.

## Related Code

- `packages/dashboard/src/components/userList.ts` — add invite form above the table; add `inviteFn` to UserListOptions
- `packages/dashboard/src/components/userList.test.ts` — unit tests
- `packages/dashboard/src/dashboard.ts:48-50` — pass `inviteUser` as `inviteFn` and `fetchAllProfiles` as `refetchFn` to renderUserList
- `packages/dashboard/src/lib/supabase.ts:173-175` — `inviteUser()` helper already exists

## Acceptance Criteria

- [ ] Invite form appears above user table (owner-only route already enforced by dashboard.ts)
- [ ] Form has email, full_name, name, role dropdown (owner/manager)
- [ ] Submit button is disabled while request is in flight
- [ ] On success: new row appears in the table; form resets
- [ ] On error: error message shown inline; form remains filled
- [ ] `npm run typecheck` 0 errors, `npm run lint` 0 warnings

## Tests

- `userList.test.ts` — `renders invite form above table` — asserts email/name/role inputs and submit button are present
- `userList.test.ts` — `invite submit calls inviteFn with email, full_name, role` — fills form, clicks submit, asserts inviteFn called with correct args
- `userList.test.ts` — `shows error message on inviteFn rejection` — inviteFn rejects, asserts error text visible
- `userList.test.ts` — `resets form after successful invite` — inviteFn resolves, refetchFn resolves with updated profile list, asserts new row added and inputs cleared
- playwright: navigate to /dashboard.html#users — invite form renders above the table
- playwright: fill and submit invite form — new user row appears in the table
- playwright: submit with inviteFn returning error — error message appears inline

## Agent Pre-Start Checkpoint

- Agent: claude-sonnet-4-6
- Date: 2026-04-25
- Verdict: APPROVED (after one revision)
- Checkpoints:
  - [x] userList.ts and UserListOptions exist at stated path
  - [x] inviteUser() exists at supabase.ts:173-175, returns Promise<void>
  - [x] fetchAllProfiles() exists at supabase.ts:189, returns Promise<Profile[]>
  - [x] dashboard.ts:48-50 is the correct wiring target
  - [x] All 4 tests are specific, file-named, and objectively assertable
  - [x] refetchFn mechanism resolves the void-return ambiguity

## Agent Post-Completion Review

- Agent: claude-sonnet-4-6
- Date: 2026-04-25
- Verdict: PASS
- Findings: Initial review found missing implementation commit (fixed). All logic, coverage, CORS, handler changes verified correct.
- All findings fixed: YES

## Summary of Changes

Added invite form above user table in userList.ts: email, full_name, role dropdown (owner/manager). On submit calls inviteFn -> admin-users Edge Function. On success re-fetches via refetchFn and re-renders table with new row; form resets. On error shows inline message; inputs preserved. Button disabled while in flight.

Deployed admin-users Edge Function with CORS support (OPTIONS handler, Access-Control-Allow-* headers). Handler updated to accept extraHeaders param propagated to all responses.
