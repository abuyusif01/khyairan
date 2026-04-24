---
# khaiyran-5n41
title: Dashboard deployment — Cloudflare Pages (khaiyran-admin)
status: todo
type: task
priority: high
created_at: 2026-04-24T01:05:43Z
updated_at: 2026-04-24T01:05:43Z
parent: khaiyran-2e0d
---

Create separate Cloudflare Pages project khaiyran-admin. Add deploy job to CI workflow for packages/dashboard. Build command: npm run build -w packages/dashboard. Output: packages/dashboard/dist. Same secrets as web (Supabase URL + publishable key).
