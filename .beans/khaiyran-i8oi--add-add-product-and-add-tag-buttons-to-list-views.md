---
# khaiyran-i8oi
title: Add 'Add product' and 'Add tag' buttons to list views
status: completed
type: feature
priority: high
created_at: 2026-04-26T07:44:36Z
updated_at: 2026-04-26T11:21:12Z
---

The product list and tag list have no "Add" button. Users must manually type a hash route (`#add-product`, `#add-tag`) to create anything — there is no UI entry point visible on either list view.

## Related Code

- `packages/dashboard/src/components/productList.ts` — add "Add product" button/link in the filter bar area
- `packages/dashboard/src/components/tagList.ts` — add "Add tag" button/link above the table
- `packages/dashboard/dashboard.html` — `.page-actions` style already exists for this purpose

## Acceptance Criteria

- [ ] Product list view has an "Add product" button/link that navigates to `#add-product`
- [ ] Tag list view has an "Add tag" button/link that navigates to `#add-tag`
- [ ] Both buttons are visible and accessible on mobile (375px width)
- [ ] `npm run typecheck -w packages/dashboard` passes with 0 errors
- [ ] `npm run lint -w packages/dashboard` passes with 0 warnings
- [ ] `npm run build -w packages/dashboard` exits 0

## Tests

- `packages/dashboard/src/components/productList.test.ts` — `renders Add product link` — asserts `a[href="#add-product"]` present in rendered container
- `packages/dashboard/src/components/tagList.test.ts` — `renders Add tag link` — asserts `a[href="#add-tag"]` present in rendered container
- `playwright` — products tab — "Add product" button visible; clicking it shows the add product form
- `playwright` — tags tab — "Add tag" button visible; clicking it shows the add tag form

## Agent Pre-Start Checkpoint

(Written by the pre-start reviewing agent — do not fill manually)

## Summary of Changes

Added Add product link (a[href="#add-product"]) in a .page-actions div to productList.ts (before filter controls). Added Add tag link (a[href="#add-tag"]) in a .page-actions div at the top of tagList.ts. Unit tests added to productList.test.ts and tagList.test.ts. Playwright verified: both buttons are visible and styled correctly on desktop and mobile.
