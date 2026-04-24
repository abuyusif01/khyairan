---
# khaiyran-d1rl
title: Product list with search/filter
status: in-progress
type: feature
priority: normal
created_at: 2026-04-24T01:05:59Z
updated_at: 2026-04-24T11:48:55Z
parent: khaiyran-md1g
blocked_by:
    - khaiyran-k5q4
    - khaiyran-tf04
---

Table/list of all products showing name, size, unit type, price, published status, image thumbnail. Filter by tag (category/brand). Search by name. Published/draft status prominent with visual indicator.

## Related Code

- `packages/dashboard/src/lib/supabase.ts:1-6` — Supabase client, will add fetchAllProducts() and fetchCategoryTags()
- New: `packages/dashboard/src/types.ts` — Product, Tag, ProductTag types (mirrors web package)
- New: `packages/dashboard/src/components/productList.ts` — renderProductList(container, products, tags) renders table
- `packages/dashboard/src/lib/supabase.ts` — new exports fetchAllProducts(), fetchCategoryTags() for dashboard

## Acceptance Criteria

- [ ] All products (published and draft) fetched from Supabase
- [ ] Product table shows: name, size, unit_type, price_ngn, published status
- [ ] Published products show a visual indicator distinct from draft
- [ ] Search input filters rows by product name (case-insensitive)
- [ ] Filter dropdown filters by category tag; 'All' option shows all products
- [ ] `npm run typecheck -w packages/dashboard` passes with 0 errors
- [ ] `npm run lint -w packages/dashboard` passes with 0 warnings
- [ ] `npm run build -w packages/dashboard` exits 0

## Tests

- `packages/dashboard/src/components/productList.test.ts` — `renders product rows with name and price` — asserts each product name and formatted price appear in table rows
- `packages/dashboard/src/components/productList.test.ts` — `shows published indicator for published products` — asserts published product row has published status indicator element
- `packages/dashboard/src/components/productList.test.ts` — `shows draft indicator for draft products` — asserts draft product row has draft status indicator
- `packages/dashboard/src/components/productList.test.ts` — `search filters rows by name` — sets search text, asserts only matching rows visible
- `packages/dashboard/src/components/productList.test.ts` — `filter by tag hides non-matching products` — sets tagId filter, asserts only tagged products shown
- `packages/dashboard/src/lib/supabase.test.ts` — `fetchAllProducts returns all products regardless of published` — asserts no .eq('published', ...) filter applied
