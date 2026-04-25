---
# khaiyran-k1s8
title: Invite new user
status: todo
type: feature
priority: deferred
created_at: 2026-04-24T01:06:23Z
updated_at: 2026-04-25T00:49:44Z
parent: khaiyran-dpph
---

Owner-only form: email, full_name, role (dropdown: owner/manager). Creates Supabase auth account via admin API + inserts profile row. Sends invite email.

## Blocked

- Blocked by: Supabase admin API requires service role key, which cannot be exposed in frontend JS
- Reason: `supabase.auth.admin.inviteUserByEmail()` only works with service role key. Options: (1) Supabase Edge Function acting as a proxy, (2) external backend. Needs human decision on approach.
- Next available bean: khaiyran-885a
