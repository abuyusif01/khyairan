---
# khaiyran-h5gk
title: Fix missing CSS for data-feedback — form errors invisible
status: todo
type: bug
priority: critical
created_at: 2026-04-26T07:42:25Z
updated_at: 2026-04-26T07:42:25Z
---

Every form (`addProductForm`, `editProductForm`, `tagForm`, `priceEditor`) creates a `div[data-feedback]` for error/success messages. There is no CSS for `[data-feedback]` or its values. When a save fails, users see nothing — the message renders as invisible unstyled text.

## Related Code

- `packages/dashboard/dashboard.html` — add CSS rules for `[data-feedback]` states
- `packages/dashboard/src/components/addProductForm.ts:25` — `data-feedback` div
- `packages/dashboard/src/components/editProductForm.ts:32` — `data-feedback` div
- `packages/dashboard/src/components/tagForm.ts:26` — `data-feedback` div
- `packages/dashboard/src/components/priceEditor.ts` — `data-feedback` div

## Acceptance Criteria

- [ ] `[data-feedback]` with no value (empty string) is hidden / takes no space
- [ ] `[data-feedback="error"]` displays red text with a small margin, clearly readable
- [ ] `[data-feedback="success"]` displays green text with a small margin
- [ ] Existing form error paths are verified to set `data-feedback="error"` (not a class)
- [ ] `npm run typecheck -w packages/dashboard` passes with 0 errors
- [ ] `npm run lint -w packages/dashboard` passes with 0 warnings
- [ ] `npm run build -w packages/dashboard` exits 0

## Tests

- `packages/dashboard/src/components/addProductForm.test.ts` — `shows error feedback element with data-feedback="error" on createProduct failure` — already exists, confirm it asserts `[data-feedback="error"]` not just text
- `playwright` — submit add product form while Supabase is mocked to return error — red error message is visible on the page
- `playwright` — submit price editor while Supabase is mocked to return error — red error message is visible

## Agent Pre-Start Checkpoint

(Written by the pre-start reviewing agent — do not fill manually)
