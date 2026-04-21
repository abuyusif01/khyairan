---
# khaiyran-mwn8
title: RLS policies — public read + role-based dashboard access
status: todo
type: task
priority: high
tags:
    - supabase
    - auth
created_at: 2026-04-21T13:50:24Z
updated_at: 2026-04-21T13:52:27Z
parent: khaiyran-s0o0
blocked_by:
    - khaiyran-fel4
---

# RLS policies — public read + role-based dashboard access

## Description

Enable Row Level Security on all tables and create policies that enforce the permission model from `supabase/CLAUDE.md`. Public visitors can read published products/tags. Dashboard users get role-based access.

## Related Code

- `supabase/migrations/00002_rls_policies.sql` — the migration file
- `supabase/CLAUDE.md` — role permissions table (source of truth)

## Acceptance Criteria

- [ ] RLS is enabled on products, tags, product_tags, and profiles
- [ ] Anonymous (no auth) can SELECT products and tags where `published = true`
- [ ] Anonymous cannot SELECT unpublished products or tags
- [ ] Anonymous cannot SELECT from product_tags, profiles, or any write operation
- [ ] Manager can SELECT, INSERT, UPDATE on products, tags, and product_tags
- [ ] Manager cannot DELETE products or tags
- [ ] Owner can SELECT, INSERT, UPDATE, DELETE on products, tags, and product_tags
- [ ] Owner can SELECT, INSERT, UPDATE, DELETE on profiles
- [ ] Manager can SELECT profiles (to see team list) but cannot INSERT, UPDATE, DELETE
- [ ] Storage policy: owner and manager can upload to product-images bucket
- [ ] Storage policy: public can read from product-images bucket
- [ ] Migration runs cleanly on a fresh `supabase db reset`
- [ ] `npm run typecheck` passes with 0 errors
- [ ] `npm run lint` passes with 0 errors and 0 warnings

## Tests

- `supabase/tests/00002_rls_policies.test.sql` — `anon can read published products` — inserts a published product, asserts anon role can SELECT it
- `supabase/tests/00002_rls_policies.test.sql` — `anon cannot read draft products` — inserts an unpublished product, asserts anon role SELECT returns 0 rows
- `supabase/tests/00002_rls_policies.test.sql` — `anon cannot insert products` — asserts anon INSERT is denied
- `supabase/tests/00002_rls_policies.test.sql` — `manager can insert and update products` — authenticates as manager, asserts INSERT and UPDATE succeed
- `supabase/tests/00002_rls_policies.test.sql` — `manager cannot delete products` — authenticates as manager, asserts DELETE is denied
- `supabase/tests/00002_rls_policies.test.sql` — `owner can delete products` — authenticates as owner, asserts DELETE succeeds
- `supabase/tests/00002_rls_policies.test.sql` — `owner can manage profiles` — authenticates as owner, asserts INSERT/UPDATE/DELETE on profiles succeed
- `supabase/tests/00002_rls_policies.test.sql` — `manager cannot manage profiles` — authenticates as manager, asserts INSERT/UPDATE/DELETE on profiles are denied
