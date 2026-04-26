---
# khaiyran-18et
title: Add CSS for image upload status states
status: todo
type: bug
priority: normal
created_at: 2026-04-26T07:45:06Z
updated_at: 2026-04-26T07:45:06Z
---

`imageUpload.ts` sets `[data-upload-status="uploading|success|error"]` on a status element during upload. There is no CSS for any of these states. Users see no visual feedback during upload — the uploading indicator and success/error messages are completely unstyled.

## Related Code

- `packages/dashboard/dashboard.html` — add CSS rules for `[data-upload-status]` states
- `packages/dashboard/src/components/imageUpload.ts:33,39,54` — sets the status attribute

## Acceptance Criteria

- [ ] `[data-upload-status="uploading"]` shows a muted/grey "Uploading…" indicator
- [ ] `[data-upload-status="success"]` shows green success text
- [ ] `[data-upload-status="error"]` shows red error text
- [ ] `[data-upload-status]` with empty value takes no visible space
- [ ] `npm run lint -w packages/dashboard` passes with 0 warnings
- [ ] `npm run build -w packages/dashboard` exits 0

## Tests

- `playwright` — edit product page — upload an image — "Uploading…" state is visible briefly, then transitions to success state with green text

## Agent Pre-Start Checkpoint

(Written by the pre-start reviewing agent — do not fill manually)
