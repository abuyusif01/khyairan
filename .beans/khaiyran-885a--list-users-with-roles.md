---
# khaiyran-885a
title: List users with roles
status: completed
type: feature
priority: deferred
created_at: 2026-04-24T01:06:23Z
updated_at: 2026-04-26T05:56:23Z
parent: khaiyran-dpph
---

Owner-only view: table of all profiles showing full_name, role, created_at. Email is not accessible via the anon key (requires service role key or Edge Function) — see Blocked note.

## Blocked (partial — email field only)

- Blocked by: email lives in `auth.users`, not accessible with the publishable anon key
- Reason: Supabase admin API required for `auth.users` access. Email could be stored in profiles table via a migration, or surfaced via Edge Function. Needs human decision.
- Impact: All other columns (full_name, role, created_at) are available from `profiles` table and implemented.

## Related Code

- `packages/dashboard/src/lib/supabase.ts` — add `fetchAllProfiles()` function
- `packages/dashboard/src/lib/supabase.test.ts` — test for `fetchAllProfiles`
- `packages/dashboard/src/components/userList.ts` — new component rendering user table
- `packages/dashboard/src/components/userList.test.ts` — tests for user list
- `packages/dashboard/src/dashboard.ts` — wire into `#users` route
- `packages/dashboard/src/types.ts` — add `Profile` type

## Acceptance Criteria

- [x] `Profile` type added to `types.ts` with `id, full_name, role, created_at`
- [x] `fetchAllProfiles()` fetches from `profiles` table, ordered by `created_at`
- [x] User list renders a table with full_name, role, created_at columns
- [x] Component accepts `isOwner` prop (owner-only gating is done at the route level in dashboard.ts)
- [x] `#users` route in dashboard.ts renders the user list (owner only)
- [x] `npm run typecheck` passes with 0 errors
- [x] `npm run lint` passes with 0 warnings

## Tests

- `packages/dashboard/src/lib/supabase.test.ts` — `fetchAllProfiles returns profiles` — asserts select called on profiles table
- `packages/dashboard/src/components/userList.test.ts` — `renders rows for each profile` — asserts full_name and role appear per row
- `packages/dashboard/src/components/userList.test.ts` — `renders created_at in readable format` — asserts date text present

## Agent Pre-Start Checkpoint

- Agent: claude-sonnet-4-6 (night shift)
- Date: 2026-04-25
- Verdict: APPROVED
- Checkpoints:
  - [x] `profiles` table exists with `id, full_name, role, created_at` (confirmed in schema)
  - [x] RLS allows authenticated users to SELECT from profiles (confirmed in 00002_rls_policies.sql:87-89)
  - [x] All 3 tests are objectively testable

## Agent Post-Completion Review

- Agent: claude-sonnet-4-6
- Date: 2026-04-25
- Verdict: PASS
- Findings: None blocking. Pre-existing XSS interpolation pattern (not introduced here). Email omitted intentionally — documented in Blocked section.
- All findings fixed: N/A

## Summary of Changes

Added `Profile` type to `types.ts`. Added `fetchAllProfiles()` to `supabase.ts` fetching id, full_name, role, created_at from the profiles table ordered by created_at. Created `userList.ts` component rendering a table with data-user-id rows. Wired into dashboard.ts as `#users` route (owner-only guard at route level).
