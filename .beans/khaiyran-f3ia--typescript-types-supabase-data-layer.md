---
# khaiyran-f3ia
title: TypeScript types + Supabase data layer
status: in-progress
type: task
priority: normal
tags:
    - web
    - supabase
created_at: 2026-04-23T00:12:10Z
updated_at: 2026-04-23T11:51:30Z
parent: khaiyran-c4dp
blocked_by:
    - khaiyran-hwik
---

# TypeScript types + Supabase data layer

## Description

Define TypeScript interfaces matching the database schema (products, tags, product_tags) and build the Supabase data-fetching layer. This is the data foundation that all rendering components depend on. Only fetches public data (published products and published category-type tags). Groups products by category using the product_tags join table.

## Related Code

- `packages/web/src/types.ts` — new file: Product, Tag, ProductTag interfaces matching `supabase/migrations/00001_initial_schema.sql`
- `packages/web/src/lib/supabase.ts` — new file: Supabase client init + `fetchPublishedProducts()`, `fetchPublishedCategoryTags()` typed query functions
- `supabase/migrations/00001_initial_schema.sql:6-41` — source of truth for column names and types

## Acceptance Criteria

- [ ] `Product` interface has: id (string), name (string), size (string), unit_type (string union of 'bottle'|'can'|'pack'|'cup'|'pouch'), units_per_carton (number), price_ngn (number), image_path (string | null), published (boolean)
- [ ] `Tag` interface has: id (string), name (string), slug (string), type (string), sort_order (number), published (boolean)
- [ ] `ProductTag` interface has: product_id (string), tag_id (string), sort_order (number)
- [ ] Supabase client initialised with environment variables for URL and anon key
- [ ] `fetchPublishedProducts()` returns only rows where `published = true`, excludes `metadata`, `internal_notes`, `created_at`, `updated_at`
- [ ] `fetchPublishedCategoryTags()` returns only rows where `published = true` and `type = 'category'`, ordered by `sort_order`
- [ ] A grouping function exists that takes products + tags + product_tags and returns products grouped by category, sorted by `product_tags.sort_order` within each group and categories sorted by `tags.sort_order`
- [ ] `npm run typecheck` passes with 0 errors
- [ ] `npm run lint` passes with 0 errors and 0 warnings

## Tests

- `packages/web/src/lib/supabase.test.ts` — `fetchPublishedProducts selects only published columns` — mocks Supabase client, asserts the query filters by `published = true` and selects only public-facing columns
- `packages/web/src/lib/supabase.test.ts` — `fetchPublishedCategoryTags filters by type and published` — mocks Supabase client, asserts query filters by `published = true` and `type = 'category'` and orders by `sort_order`
- `packages/web/src/lib/supabase.test.ts` — `groupProductsByCategory groups and sorts correctly` — given mock products, tags, and product_tags, asserts products are grouped under correct categories, categories sorted by tags.sort_order, products within each category sorted by product_tags.sort_order
- `packages/web/src/lib/supabase.test.ts` — `groupProductsByCategory excludes products with no category tag` — asserts a product not in any category tag does not appear in output

## Agent Pre-Start Checkpoint

(Written by the pre-start reviewing agent — do not fill manually)

## Agent Post-Completion Review

(Written by the post-completion reviewing agent — do not fill manually)

## Agent Pre-Start Checkpoint

- Agent: claude-sonnet-4-6 (night shift)
- Date: 2026-04-23
- Verdict: APPROVED
- Checkpoints:
  - [x] `supabase/migrations/00001_initial_schema.sql` exists — confirmed column names and types
  - [x] `packages/web/src/types.ts` — new file, does not yet exist
  - [x] `packages/web/src/lib/supabase.ts` — new file, lib/ directory does not yet exist
  - [x] All acceptance criteria are objectively testable
  - [x] Tests section present and specific: 4 tests in supabase.test.ts with exact assertions
  - [x] khaiyran-hwik (blocker) is now completed — free to proceed
