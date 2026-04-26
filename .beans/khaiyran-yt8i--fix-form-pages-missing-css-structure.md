---
# khaiyran-yt8i
title: Fix form pages missing CSS structure
status: in-progress
type: bug
created_at: 2026-04-26T07:22:01Z
updated_at: 2026-04-26T07:22:01Z
---

Form components (addProductForm, editProductForm, tagForm) built raw DOM with labels wrapping inputs and no CSS classes. They had no .form-card, .form-field, .form-actions, or .page-actions structure so CSS never applied. Rewrote all three using formHelpers.ts.
