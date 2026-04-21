---
# khaiyran-fel4
title: Database schema — enums, tables, constraints, triggers
status: todo
type: task
priority: high
tags:
    - supabase
    - schema
created_at: 2026-04-21T13:50:09Z
updated_at: 2026-04-21T13:52:27Z
parent: khaiyran-s0o0
blocked_by:
    - khaiyran-ui3c
---

# Database schema — enums, tables, constraints, triggers

## Description

Create the initial Supabase migration with all tables, enums, constraints, and triggers defined in `supabase/CLAUDE.md`. This is the core data model: products, tags, product_tags join table, and profiles.

## Related Code

- `supabase/migrations/00001_initial_schema.sql` — the migration file
- `supabase/CLAUDE.md` — schema reference (source of truth)

## Acceptance Criteria

- [ ] Migration runs cleanly on a fresh `supabase db reset`
- [ ] `unit_type` enum exists with values: bottle, can, pack, cup, pouch
- [ ] `user_role` enum exists with values: owner, manager
- [ ] `products` table matches schema in `supabase/CLAUDE.md` — all columns, types, defaults
- [ ] `products.price_ngn` is `numeric`, not integer or float
- [ ] `products.image_path` is nullable
- [ ] CHECK constraint enforces: `published = false OR image_path IS NOT NULL`
- [ ] `tags` table matches schema — includes `slug` (unique), `type`, `sort_order`, `published`
- [ ] `product_tags` join table has composite PK, `sort_order`, and CASCADE deletes on both FKs
- [ ] `profiles` table matches schema — `role` uses `user_role` enum
- [ ] `updated_at` trigger fires on UPDATE for products, tags, and profiles
- [ ] `npm run typecheck` passes with 0 errors
- [ ] `npm run lint` passes with 0 errors and 0 warnings

## Tests

- `supabase/tests/00001_initial_schema.test.sql` — `products table exists with correct columns` — asserts all columns exist with correct types by querying information_schema
- `supabase/tests/00001_initial_schema.test.sql` — `enums have correct values` — asserts unit_type and user_role enums contain expected values
- `supabase/tests/00001_initial_schema.test.sql` — `cannot publish product without image` — inserts a product with published=true and image_path=null, asserts CHECK constraint violation
- `supabase/tests/00001_initial_schema.test.sql` — `product_tags cascade deletes` — inserts product+tag+join row, deletes product, asserts join row is gone
- `supabase/tests/00001_initial_schema.test.sql` — `updated_at trigger fires` — inserts a product, updates it, asserts updated_at changed
- `supabase/tests/00001_initial_schema.test.sql` — `tags slug is unique` — inserts two tags with same slug, asserts unique violation
