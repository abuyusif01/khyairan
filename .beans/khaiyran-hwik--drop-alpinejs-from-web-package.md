---
# khaiyran-hwik
title: Drop Alpine.js from web package
status: in-progress
type: task
priority: high
tags:
    - web
created_at: 2026-04-23T00:12:06Z
updated_at: 2026-04-23T11:43:43Z
parent: khaiyran-c4dp
---

# Drop Alpine.js from web package

## Description

Remove all Alpine.js references from `packages/web`. The architecture decision (bean khaiyran-l7m4) settled that the public site uses vanilla TypeScript — Alpine.js is reserved for the dashboard only. The existing scaffold still imports and uses Alpine. Clean it out so the web package has zero Alpine dependency.

## Related Code

- `packages/web/src/main.ts:1-5` — imports Alpine and calls `Alpine.start()`
- `packages/web/src/env.d.ts:1-7` — declares `Window.Alpine` type
- `packages/web/src/app.test.ts:1-21` — test uses Alpine x-data and x-text directives
- `packages/web/index.html:9-11` — `x-data` and `x-text` Alpine directives in markup
- `packages/web/CLAUDE.md:34-38` — layout section still describes "Categories / Brands" toggle from old Alpine design
- `packages/web/CLAUDE.md:57-59` — brand section still says "Navy + gold colour scheme"

## Acceptance Criteria

- [ ] `packages/web/src/main.ts` has no Alpine import and exports a no-op or minimal `initApp`
- [ ] `packages/web/src/env.d.ts` has no Alpine type declarations
- [ ] `packages/web/src/app.test.ts` has no Alpine directives (x-data, x-text) — test should verify the app module loads without error
- [ ] `packages/web/index.html` has no Alpine directives — plain HTML placeholder
- [ ] `packages/web/CLAUDE.md` updated: layout section reflects approved design (category-grouped, no brands toggle), brand section reflects white + green palette, stack section confirms vanilla TS
- [ ] `grep -ri alpine packages/web/` returns zero results
- [ ] `npm run typecheck` passes with 0 errors
- [ ] `npm run lint` passes with 0 errors and 0 warnings
- [ ] `npm run build` exits 0

## Tests

- `packages/web/src/app.test.ts` — `initApp does not throw` — asserts calling initApp() completes without error (no Alpine dependency)

## Agent Pre-Start Checkpoint

(Written by the pre-start reviewing agent — do not fill manually)

## Agent Post-Completion Review

(Written by the post-completion reviewing agent — do not fill manually)
