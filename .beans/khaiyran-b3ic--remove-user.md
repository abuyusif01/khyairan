---
# khaiyran-b3ic
title: Remove user
status: todo
type: feature
priority: deferred
created_at: 2026-04-24T01:06:23Z
updated_at: 2026-04-25T09:57:51Z
parent: khaiyran-dpph
blocked_by:
    - khaiyran-a3ls
---

Owner-only: remove user with confirmation. Deletes Supabase auth account and profile row.

## Blocked

- Blocked by: Supabase admin API requires service role key, which cannot be exposed in frontend JS
- Reason: `supabase.auth.admin.deleteUser()` only works with service role key. Options: (1) Edge Function, (2) external backend, (3) soft-delete via profiles table. Needs human decision on approach.
- Next available bean: khaiyran-885a
