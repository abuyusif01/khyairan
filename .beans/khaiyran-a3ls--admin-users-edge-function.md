---
# khaiyran-a3ls
title: admin-users Edge Function
status: in-progress
type: task
priority: high
created_at: 2026-04-25T09:57:45Z
updated_at: 2026-04-25T09:58:39Z
parent: khaiyran-dpph
---

Supabase Edge Function that proxies admin user operations (invite, remove) using the service role key. Called from the dashboard with the caller's JWT — keeps the service role key server-side.

Single HTTP endpoint at `/functions/v1/admin-users`. Request body: `{ action: 'invite' | 'remove', ... }`.

**Invite:** `{ action: 'invite', email, full_name, role }` → calls `auth.admin.inviteUserByEmail`, inserts profile row.
**Remove:** `{ action: 'remove', userId }` → deletes profile row, calls `auth.admin.deleteUser`.

Both operations verify the caller is an owner (JWT → profiles.role check) before proceeding.

## Related Code

- `supabase/functions/admin-users/index.ts` — new Edge Function (entry point + handler)
- `supabase/functions/admin-users/admin-users.test.ts` — unit tests
- `packages/dashboard/src/lib/supabase.ts` — add `inviteUser()` and `removeUser()` helpers that call the function via fetch

## Acceptance Criteria

- [ ] Function verifies caller JWT is from an owner — returns 403 if not
- [ ] Invite: calls `auth.admin.inviteUserByEmail`, inserts profile row, returns 200 with new user id
- [ ] Remove: deletes profile row, calls `auth.admin.deleteUser`, returns 200
- [ ] Unknown action returns 400
- [ ] `inviteUser` and `removeUser` helpers added to `supabase.ts` calling the function via fetch with the session JWT
- [ ] TypeScript/Deno strict mode: no `any`, 0 errors

## Tests

- `admin-users.test.ts` — `rejects non-owner caller` — mock profiles returns manager role, assert response 403
- `admin-users.test.ts` — `invite creates auth user and inserts profile` — assert admin.inviteUserByEmail and profiles insert called
- `admin-users.test.ts` — `remove deletes profile then auth user` — assert profile delete and admin.deleteUser called
- `admin-users.test.ts` — `unknown action returns 400`

## Agent Pre-Start Checkpoint

- Agent: claude-sonnet-4-6
- Date: 2026-04-25
- Verdict: APPROVED
- Checkpoints:
  - [x] `supabase/functions/process-image/index.ts` exists as pattern reference
  - [x] profiles table has INSERT/DELETE RLS (owner only) — confirmed
  - [x] `auth.admin.inviteUserByEmail` and `auth.admin.deleteUser` available in Supabase JS v2
  - [x] All 4 tests are objectively testable with mocked Supabase client
