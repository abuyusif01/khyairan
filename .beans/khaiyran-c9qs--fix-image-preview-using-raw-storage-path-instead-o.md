---
# khaiyran-c9qs
title: Fix image preview using raw storage path instead of public URL
status: completed
type: bug
priority: normal
created_at: 2026-04-26T07:45:28Z
updated_at: 2026-04-26T11:21:12Z
---

`imageUpload.ts:47` falls back to setting `img.src = path` (raw storage path, e.g. `"products/p1.jpg"`) when `getUrlFn` is not provided. A storage path is not a valid URL — the image won't render. The function should always require `getUrlFn` to construct a valid public URL.

## Related Code

- `packages/dashboard/src/components/imageUpload.ts:40-55` — preview rendering, raw path fallback
- `packages/dashboard/src/components/imageUpload.test.ts` — missing test for `img.src` value

## Acceptance Criteria

- [ ] `imageUpload.ts` preview always uses `getUrlFn(path)` to set `img.src`
- [ ] If `getUrlFn` is not provided, no `<img>` is rendered (don't show a broken image)
- [ ] `npm run typecheck -w packages/dashboard` passes with 0 errors
- [ ] `npm run lint -w packages/dashboard` passes with 0 warnings
- [ ] `npm run build -w packages/dashboard` exits 0

## Tests

- `packages/dashboard/src/components/imageUpload.test.ts` — `image preview sets src to getUrlFn result` — passes `getUrlFn: () => 'https://cdn.test/img.jpg'`, asserts `img.src === 'https://cdn.test/img.jpg'`
- `packages/dashboard/src/components/imageUpload.test.ts` — `no img rendered when getUrlFn not provided` — omits getUrlFn, asserts no `img[data-preview]` in DOM after upload

## Agent Pre-Start Checkpoint

(Written by the pre-start reviewing agent — do not fill manually)

## Summary of Changes

Fixed imageUpload.ts: img preview now only rendered when getUrlFn is provided (always uses getUrlFn(path) for src). When getUrlFn is absent, no img element is added (avoids broken image). Updated existing test to pass getUrlFn; added two new tests: one verifying src equals getUrlFn result, one verifying no img when getUrlFn absent.
