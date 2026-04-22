---
# khaiyran-pi37
title: Seed data — initial products and tags from catalog
status: completed
type: task
priority: normal
tags:
    - supabase
    - data
created_at: 2026-04-21T13:50:57Z
updated_at: 2026-04-22T01:05:17Z
parent: khaiyran-s0o0
blocked_by:
    - khaiyran-mwn8
    - khaiyran-jm8s
---

# Seed data — initial products and tags from catalog

## Description

Create a seed script that populates the database with the ~37 products from the existing catalog (in `~/dev/safi/catalog.html`), their categories, and brand tags. This gives the dashboard and public site real data to work with from day one.

Seeds should be idempotent — safe to run multiple times without duplicating data.

## Related Code

- `supabase/seed.sql` — seed data file
- `~/dev/safi/catalog.html` — source of product names, sizes, unit types, units per carton, and NGN prices
- `supabase/CLAUDE.md` — schema reference

## Acceptance Criteria

- [ ] Running `supabase db reset` applies migrations + seed data cleanly
- [ ] All 6 categories from the catalog exist as tags with type `category`: Carbonated Drinks, Juice, Malt Drinks, Energy Drinks, Water, Dairy
- [ ] Brand tags exist for each distinct brand (Coca-Cola, Pepsi, 7UP, Fanta, Sprite, Maltina, etc.)
- [ ] All ~37 products from the catalog are seeded with correct name, size, unit_type, units_per_carton, price_ngn
- [ ] Each product is linked to appropriate category and brand tags via product_tags
- [ ] All seeded products have `published = false` (draft) — no image yet, so they cannot be published
- [ ] sort_order values are set in a sensible default order within each tag
- [ ] Seed is idempotent — running it twice does not duplicate data (use ON CONFLICT or similar)
- [ ] `npm run typecheck` passes with 0 errors
- [ ] `npm run lint` passes with 0 errors and 0 warnings

## Tests

- `supabase/tests/seed.test.sql` — `all categories exist` — asserts 6 tags with type=category exist
- `supabase/tests/seed.test.sql` — `all products exist` — asserts count of products matches expected (~37)
- `supabase/tests/seed.test.sql` — `products are linked to tags` — asserts every product has at least one category tag and one brand tag
- `supabase/tests/seed.test.sql` — `all products are draft` — asserts no product has published=true
- `supabase/tests/seed.test.sql` — `seed is idempotent` — runs seed twice, asserts product count has not doubled

## Blocked

(Only if catalog.html products/prices need verification from Abu before seeding)

## Agent Pre-Start Checkpoint

- Agent: Claude Sonnet 4.6
- Date: 2026-04-22
- Verdict: APPROVED
- Checkpoints:
  - [x] supabase/CLAUDE.md exists and schema matches seed requirements
  - [x] catalog.html exists and all 37 products are parseable across 6 categories
  - [x] unit_type enum values (bottle, can, pack, cup, pouch) cover all catalog units
  - [x] price_ngn is numeric — USD×1650 conversion values with decimals are safe
  - [x] published=false + no image_path is valid per CHECK constraint
  - [x] All 5 tests name a file, description, and concrete assertion
  - [x] All acceptance criteria are objectively verifiable
  - Note: USD→NGN rate (1650) must be documented in a comment in seed.sql

## Agent Post-Completion Review

- Agent: Claude Sonnet 4.6
- Date: 2026-04-22
- Verdict: PASS
- Findings: none — all 37 products, 6 category tags, 28 brand tags, full product_tag coverage, idempotency guards all correct
- All findings fixed: N/A

## Summary of Changes

- Created `supabase/tests/seed.test.sql` — 5 pgTAP tests (categories, product count, tag links, draft status, idempotency)
- Created `supabase/seed.sql` — inserts 6 category tags, 28 brand tags, 37 products, and product_tags linking each product to its category and brand
- Prices converted from USD at 1 USD = 1,650 NGN; rate documented in seed.sql comment — Abu should verify before publishing
- All products seeded as published=false (no image yet)
- Seed is idempotent via ON CONFLICT (slug) DO NOTHING for tags, WHERE NOT EXISTS for products, ON CONFLICT (product_id, tag_id) DO NOTHING for product_tags
