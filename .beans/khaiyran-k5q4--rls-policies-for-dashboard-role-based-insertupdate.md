---
# khaiyran-k5q4
title: RLS policies for dashboard (role-based INSERT/UPDATE/DELETE)
status: todo
type: task
priority: critical
created_at: 2026-04-24T01:05:43Z
updated_at: 2026-04-24T01:05:43Z
parent: khaiyran-2e0d
---

Migration to add RLS policies on products, tags, product_tags for authenticated dashboard users. INSERT/UPDATE for owner+manager, DELETE for owner only. Gated by profiles.role lookup on auth.uid(). Nothing else works without this.
