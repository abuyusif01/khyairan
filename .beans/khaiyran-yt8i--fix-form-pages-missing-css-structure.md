---
# khaiyran-yt8i
title: Fix form pages missing CSS structure
status: completed
type: bug
priority: normal
created_at: 2026-04-26T07:22:01Z
updated_at: 2026-04-26T07:22:16Z
---

Form components (addProductForm, editProductForm, tagForm) built raw DOM with labels wrapping inputs and no CSS classes. They had no .form-card, .form-field, .form-actions, or .page-actions structure so CSS never applied. Rewrote all three using formHelpers.ts.

## Summary of Changes

- Rewrote addProductForm.ts, editProductForm.ts, tagForm.ts to use formHelpers
- Each form now wrapped in .page-actions (back button) + .form-card
- Every field wrapped in .form-field via field() helper (label above input)
- Published checkbox uses checkField() (inline label)
- Submit button wrapped in .form-actions
- All 103 tests pass, typecheck clean, lint clean
