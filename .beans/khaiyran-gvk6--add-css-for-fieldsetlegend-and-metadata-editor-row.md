---
# khaiyran-gvk6
title: Add CSS for fieldset/legend and metadata editor rows
status: completed
type: bug
priority: normal
created_at: 2026-04-26T07:45:22Z
updated_at: 2026-04-26T11:21:02Z
---

Forms (add product, edit product) contain `<fieldset>` + `<legend>` for tag checkboxes, and `editProductForm` has a metadata key-value editor (`[data-metadata-editor]`, `[data-meta-row]`). Neither has any CSS — both sections look visually flat and unstructured.

## Related Code

- `packages/dashboard/dashboard.html` — add CSS for `fieldset`, `legend`, `[data-metadata-editor]`, `[data-meta-row]`
- `packages/dashboard/src/components/addProductForm.ts:58-74` — tags fieldset
- `packages/dashboard/src/components/editProductForm.ts:109-130` — metadata editor rows
- `packages/dashboard/src/components/editProductForm.ts:155-175` — tags fieldset

## Acceptance Criteria

- [ ] `fieldset` inside `.form-card` has a subtle border or background that groups its contents visually
- [ ] `legend` text is styled consistently with other form labels
- [ ] `[data-meta-row]` lays out key input, value input, and Remove button in a single horizontal row with gap
- [ ] `[data-metadata-editor]` has appropriate spacing from the surrounding fields
- [ ] `npm run lint -w packages/dashboard` passes with 0 warnings
- [ ] `npm run build -w packages/dashboard` exits 0

## Tests

- `playwright` — add product form — Tags fieldset is visually grouped and distinct from other fields
- `playwright` — edit product form — metadata editor rows display key/value inputs side by side with a Remove button

## Agent Pre-Start Checkpoint

(Written by the pre-start reviewing agent — do not fill manually)

## Summary of Changes

Added CSS to dashboard.html for fieldset (.form-card fieldset with border, border-radius, padding, background), legend (font-size, font-weight), [data-metadata-editor] (flex column), and [data-meta-row] (flex row with gap). Playwright verified: fieldset has 1px border; metadata rows are horizontal.
