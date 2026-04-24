---
# khaiyran-tf04
title: Session guard — redirect if not logged in
status: todo
type: task
priority: high
created_at: 2026-04-24T01:05:43Z
updated_at: 2026-04-24T01:06:35Z
parent: khaiyran-2e0d
blocked_by:
    - khaiyran-2e0d
    - khaiyran-8wdy
---

Check Supabase auth session on page load. If no session, redirect to login page. If session exists, fetch profile and store role for permission checks. Wrap all dashboard routes.
