---
# khaiyran-4xd1
title: Playwright tests — product management
status: todo
type: task
priority: high
created_at: 2026-04-26T07:46:04Z
updated_at: 2026-04-26T11:22:58Z
---

Product management has zero Playwright test coverage. CLAUDE.md mandates Playwright for all frontend features. The product list, add product form, edit product form, toggle, delete, and reorder must be verified in a real browser.

## Related Code

- `packages/dashboard/src/components/productList.ts` — product list rendering
- `packages/dashboard/src/components/addProductForm.ts` — add form
- `packages/dashboard/src/components/editProductForm.ts` — edit form
- `packages/dashboard/dashboard.html` — products tab

## Acceptance Criteria

- [ ] Playwright scenario: products tab renders a table with at least one product row
- [ ] Playwright scenario: clicking "Add product" shows the add product form with all required fields
- [ ] Playwright scenario: clicking Edit on a product row shows edit form pre-filled with product data
- [ ] Playwright scenario: Publish button is disabled on a product with no image
- [ ] Playwright scenario: search input filters product rows by name
- [ ] `npm run typecheck -w packages/dashboard` passes with 0 errors
- [ ] `npm run lint -w packages/dashboard` passes with 0 warnings

## Tests

- `playwright` — dashboard products tab — product table visible, rows present
- `playwright` — click Add product — form renders with Name, Size, Unit type, Price fields visible
- `playwright` — click Edit on first product — edit form opens pre-filled with that product's name
- `playwright` — product with no image — Publish button is disabled
- `playwright` — type in search box — unmatched product rows are hidden

## Agent Pre-Start Checkpoint

(Written by the pre-start reviewing agent — do not fill manually)

## Blocked

- Blocked by: Running Supabase backend (local or remote)
- Reason: These Playwright tests require authenticated dashboard access, which requires a working Supabase instance. No local Supabase container was running (supabase start fails — container not found) and no SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY env vars are configured.
- Next available bean: none (all other ready beans are completed)
- To unblock: run `supabase start` in the project root with Docker running, or set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in packages/dashboard/.env, then resume these beans.
