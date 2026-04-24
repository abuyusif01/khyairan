---
# khaiyran-9jpi
title: Image and data caching
status: todo
type: task
priority: high
created_at: 2026-04-24T00:09:26Z
updated_at: 2026-04-24T00:09:37Z
---

# Image and data caching

## Description

Two caching fixes:

1. **Image caching** — set `max-age=31536000` Cache-Control on the Supabase Storage `product-images` bucket. Currently returns `cache-control: no-cache`, meaning every page visit re-fetches every image. One-time API call, no migration needed.

2. **Data caching** — add `loadCatalog()` to `supabase.ts` that caches products + tags + product_tags in `sessionStorage`. Back-navigation within the same tab becomes instant. sessionStorage clears on tab close so data never goes stale across sessions.

## Related Code

- `packages/web/src/lib/supabase.ts` — add `loadCatalog()` function
- `packages/web/src/main.ts` — use `loadCatalog()` instead of three separate fetches

## Acceptance Criteria

- [ ] Supabase Storage bucket returns `cache-control: max-age=31536000` header on image responses
- [ ] Second call to `loadCatalog()` does not call Supabase — returns sessionStorage data
- [ ] First call to `loadCatalog()` fetches from Supabase and writes to sessionStorage
- [ ] If sessionStorage is unavailable, falls back to fetching from Supabase without throwing
- [ ] `npm run typecheck` passes with 0 errors
- [ ] `npm run lint` passes with 0 errors and 0 warnings
- [ ] `npm run build` exits 0

## Tests

- `packages/web/src/lib/supabase.test.ts` — `loadCatalog fetches and caches on first call` — asserts Supabase fns called once and result written to sessionStorage
- `packages/web/src/lib/supabase.test.ts` — `loadCatalog returns cached data on second call` — calls twice, asserts Supabase fns called only once total
- `packages/web/src/lib/supabase.test.ts` — `loadCatalog falls back to fetch if sessionStorage throws` — stubs sessionStorage.getItem to throw, asserts still returns data
