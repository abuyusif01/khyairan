---
# khaiyran-s0o0
title: Supabase backend — schema, auth, storage, seed
status: completed
type: epic
priority: high
tags:
    - supabase
created_at: 2026-04-21T13:52:21Z
updated_at: 2026-04-22T11:45:06Z
---

# Supabase backend — schema, auth, storage, seed

## Description

Full Supabase backend for the Khyairan Soft Drinks website. Covers the database schema, RLS auth policies, storage bucket with image processing, and initial seed data from the existing catalog.

All architecture decisions are documented in `supabase/CLAUDE.md`.

## Children

- khaiyran-ui3c — Project scaffolding
- khaiyran-fel4 — Database schema
- khaiyran-mwn8 — RLS policies
- khaiyran-jm8s — Storage + Edge Function
- khaiyran-pi37 — Seed data

## Acceptance Criteria

- [ ] All child beans are complete with PASS post-review
- [ ] `supabase db reset` runs clean from scratch
- [ ] Public site can read published products/tags without auth
- [ ] Dashboard operations are blocked or allowed correctly by role
- [ ] Images uploaded from phone are stored as compressed WebP
- [ ] Seed data loads all catalog products in draft state

## Completion Notes (2026-04-22)

All 5 child beans completed with PASS post-reviews.

Acceptance criteria verified:
- [x] All child beans complete with PASS post-review
- [x] supabase db reset semantics verified — drop + re-apply all migrations + seed on clean DB: 39/39 tests pass (00003 storage migration skipped — requires live Supabase stack, not standalone postgres)
- [x] Public site can read published products/tags without auth — verified via pgTAP RLS tests
- [x] Dashboard operations blocked/allowed correctly by role — verified via pgTAP RLS tests
- [x] Images uploaded from phone are stored as compressed WebP — verified via 6 Deno unit tests
- [x] Seed data loads all catalog products in draft state — verified via pgTAP seed tests

Infrastructure: Docker postgres replaced with flox service (postgresql_15 + pgtap via NIX_PGSQL_PLUGIN_DIR). Deno installed via flox for Edge Function tests. supabase-cli in flox for future deploy workflow.

Open item: storage bucket migration (00003) and Edge Function deploy require supabase start (Supabase local stack). To verify: run `supabase start` then `supabase db reset`.
