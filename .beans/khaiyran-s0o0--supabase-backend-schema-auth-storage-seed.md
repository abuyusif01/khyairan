---
# khaiyran-s0o0
title: Supabase backend — schema, auth, storage, seed
status: todo
type: epic
priority: high
tags:
    - supabase
created_at: 2026-04-21T13:52:21Z
updated_at: 2026-04-21T13:52:21Z
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
