---
# khaiyran-k5q4
title: RLS policies for dashboard (role-based INSERT/UPDATE/DELETE)
status: completed
type: task
priority: critical
created_at: 2026-04-24T01:05:43Z
updated_at: 2026-04-24T01:14:32Z
parent: khaiyran-2e0d
---

Migration to add RLS policies on products, tags, product_tags for authenticated dashboard users. INSERT/UPDATE for owner+manager, DELETE for owner only. Gated by profiles.role lookup on auth.uid(). Nothing else works without this.


## Summary of Changes

No work needed — the RLS policies described in this bean already exist in `supabase/migrations/00002_rls_policies.sql`. That migration includes:
- `get_my_role()` SECURITY DEFINER helper
- products: auth SELECT/INSERT/UPDATE for owner+manager, DELETE for owner only
- tags: same pattern
- product_tags: same pattern
- profiles: SELECT for owner+manager, all writes for owner only

Bean was created without checking existing migrations.
