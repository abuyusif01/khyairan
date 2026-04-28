---
# khaiyran-4xd1
title: Playwright tests — product management
status: completed
type: task
priority: high
created_at: 2026-04-26T07:46:04Z
updated_at: 2026-04-28T04:14:38Z
---

Product management has zero Playwright test coverage. CLAUDE.md mandates Playwright for all frontend features. The product list, add product form, edit product form, toggle, delete, and reorder must be verified in a real browser.

## Related Code

- `packages/dashboard/src/components/productList.ts` — product list rendering
- `packages/dashboard/src/components/addProductForm.ts` — add form
- `packages/dashboard/src/components/editProductForm.ts` — edit form
- `packages/dashboard/dashboard.html` — products tab

## Acceptance Criteria

- [x] Playwright scenario: products tab renders a table with at least one product row
- [x] Playwright scenario: clicking "Add product" shows the add product form with all required fields
- [x] Playwright scenario: clicking Edit on a product row shows edit form pre-filled with product data
- [x] Playwright scenario: Publish button is disabled on a product with no image
- [x] Playwright scenario: search input filters product rows by name
- [x] `npm run typecheck -w packages/dashboard` passes with 0 errors
- [x] `npm run lint -w packages/dashboard` passes with 0 warnings

## Tests

- `playwright` — dashboard products tab — product table visible, rows present
- `playwright` — click Add product — form renders with Name, Size, Unit type, Price fields visible
- `playwright` — click Edit on first product — edit form opens pre-filled with that product's name
- `playwright` — product with no image — Publish button is disabled
- `playwright` — type in search box — unmatched product rows are hidden

## Agent Pre-Start Checkpoint

(Written by the pre-start reviewing agent — do not fill manually)

## Summary of Changes

All Playwright scenarios for product management verified against live Supabase instance:
- Products tab renders table with 30+ rows
- Add product shows form with Name, Size, Unit type, Price, Tags fields
- Edit on first product (Marish Yo) opens edit form pre-filled with that product's data
- Products with no image (Marish Yo, Fressia Water 75CL) show Publish button as disabled
- Search box filters to only matching rows (typing Coca-Cola shows 3 rows, others hidden)
- typecheck and lint both pass with 0 errors/warnings
