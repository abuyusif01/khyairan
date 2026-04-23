---
# khaiyran-75n2
title: Product grid component
status: in-progress
type: task
priority: normal
tags:
    - web
created_at: 2026-04-23T00:12:13Z
updated_at: 2026-04-23T11:54:03Z
parent: khaiyran-c4dp
blocked_by:
    - khaiyran-q7zk
    - khaiyran-f3ia
---

# Product grid component

## Description

Build `components/productGrid.ts` — the main rendering component. Takes category-grouped product data (from the data layer in khaiyran-f3ia) and renders it into the `#product-grid` mount point. Each category gets a heading and a 2-column card grid. Each card shows: lazy-loaded product image, name, size + unit type, units per carton, and price formatted in NGN with ₦ symbol and thousands separators. Category sections get `id` attributes so the filter bar (khaiyran-8qis) can scroll to them.

## Related Code

- `packages/web/src/components/productGrid.ts` — new file: `renderProductGrid()` function
- `packages/web/src/types.ts` — Product, Tag interfaces (created in khaiyran-f3ia)
- `packages/web/src/style.css` — product card and grid CSS (created in khaiyran-q7zk)
- `packages/web/index.html` — `<div id="product-grid">` mount point (created in khaiyran-q7zk)
- `packages/web/src/main.ts` — will call `renderProductGrid()` after data fetch

## Acceptance Criteria

- [ ] `renderProductGrid()` accepts grouped product data and renders into `#product-grid`
- [ ] Each category section has a visible heading with the category name
- [ ] Each category section has an `id` attribute derived from the tag slug (e.g. `id="category-carbonated-drinks"`)
- [ ] Products render in a 2-column grid within each category
- [ ] Each card displays: product image, product name, size, unit type, units per carton, price in NGN
- [ ] Price formatted with ₦ symbol and thousands separators (e.g. `₦4,500`)
- [ ] Product images use `loading="lazy"` attribute
- [ ] Product images use Supabase Storage public URL constructed from `image_path`
- [ ] Products without `image_path` show a placeholder (should not happen for published products due to DB constraint, but handle gracefully)
- [ ] `npm run typecheck` passes with 0 errors
- [ ] `npm run lint` passes with 0 errors and 0 warnings
- [ ] `npm run build` exits 0

## Tests

- `packages/web/src/components/productGrid.test.ts` — `renders category headings` — given 2 categories of products, asserts both category names appear as headings in the rendered DOM
- `packages/web/src/components/productGrid.test.ts` — `renders product card with all fields` — given a product, asserts card contains name, size, unit type, units per carton, and formatted price
- `packages/web/src/components/productGrid.test.ts` — `formats price with naira symbol and thousands separator` — given price_ngn 4500, asserts rendered text contains `₦4,500`
- `packages/web/src/components/productGrid.test.ts` — `sets lazy loading on product images` — asserts all rendered `<img>` elements have `loading="lazy"`
- `packages/web/src/components/productGrid.test.ts` — `category sections have slug-based id attributes` — given a tag with slug "carbonated-drinks", asserts section has `id="category-carbonated-drinks"`

## Agent Pre-Start Checkpoint

(Written by the pre-start reviewing agent — do not fill manually)

## Agent Post-Completion Review

(Written by the post-completion reviewing agent — do not fill manually)

## Agent Pre-Start Checkpoint

- Agent: claude-sonnet-4-6 (night shift)
- Date: 2026-04-23
- Verdict: APPROVED
- Checkpoints:
  - [x] `packages/web/src/types.ts` exists with Product, Tag, ProductTag, ProductGroup interfaces (khaiyran-f3ia complete)
  - [x] `packages/web/src/style.css` exists with .category-section, .category-heading, .product-cards grid, .product-card CSS (khaiyran-q7zk complete)
  - [x] `packages/web/index.html` has `<div id='product-grid'>` mount point (khaiyran-q7zk complete)
  - [x] `packages/web/src/components/` directory does not yet exist — new
  - [x] All 5 acceptance criteria tests are specific with file path, description, and assertion
  - [x] All criteria are objectively verifiable
