---
# khaiyran-5dw4
title: Playwright tests — prices and image upload
status: todo
type: task
priority: high
created_at: 2026-04-26T07:46:19Z
updated_at: 2026-04-26T11:22:58Z
---

The price editor and image upload have zero Playwright test coverage. CLAUDE.md mandates Playwright for all frontend features. Inline price editing, save-all flow, and image upload/preview must be verified in a real browser.

## Related Code

- `packages/dashboard/src/components/priceEditor.ts` — bulk price editor
- `packages/dashboard/src/components/imageUpload.ts` — camera/file upload
- `packages/dashboard/dashboard.html` — prices tab, image upload section in edit product

## Acceptance Criteria

- [ ] Playwright scenario: prices tab renders a table with product name, size, and editable price column
- [ ] Playwright scenario: editing a price input highlights that row visually
- [ ] Playwright scenario: clicking "Save all prices" saves all changed rows and shows success feedback
- [ ] Playwright scenario: edit product page — image upload section is visible with a file input
- [ ] `npm run typecheck -w packages/dashboard` passes with 0 errors
- [ ] `npm run lint -w packages/dashboard` passes with 0 warnings

## Tests

- `playwright` — dashboard prices tab — table visible with at least one product row with an editable price input
- `playwright` — change a price value — row becomes visually highlighted
- `playwright` — click Save all prices — success feedback visible
- `playwright` — edit product page — image upload input present with correct accept attribute

## Agent Pre-Start Checkpoint

(Written by the pre-start reviewing agent — do not fill manually)

## Blocked

- Blocked by: Running Supabase backend (local or remote)
- Reason: These Playwright tests require authenticated dashboard access, which requires a working Supabase instance. No local Supabase container was running (supabase start fails — container not found) and no SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY env vars are configured.
- Next available bean: none (all other ready beans are completed)
- To unblock: run `supabase start` in the project root with Docker running, or set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in packages/dashboard/.env, then resume these beans.
