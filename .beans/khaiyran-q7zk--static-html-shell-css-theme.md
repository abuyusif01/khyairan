---
# khaiyran-q7zk
title: Static HTML shell + CSS theme
status: in-progress
type: task
priority: normal
tags:
    - web
    - css
created_at: 2026-04-23T00:12:08Z
updated_at: 2026-04-23T11:47:19Z
parent: khaiyran-c4dp
blocked_by:
    - khaiyran-hwik
---

# Static HTML shell + CSS theme

## Description

Build the static HTML structure in `index.html` (header, about strip, footer) and the CSS theme in `src/style.css` with all custom properties. These are the parts of the page that don't need JavaScript — they render immediately. Dynamic sections (filter bar, product grid) get empty `<div>` mount points that TypeScript components will fill later.

## Related Code

- `packages/web/index.html:1-18` — replace current Alpine scaffold with full static HTML shell
- `packages/web/src/style.css` — new file: CSS custom properties + all base styles
- `packages/web/src/main.ts` — update to import style.css

## Acceptance Criteria

- [ ] `index.html` contains: sticky header with "KHYAIRAN SOFT DRINKS" text logo and WhatsApp link, empty `<div id="filter-bar">` mount point, empty `<div id="product-grid">` mount point, about strip with business name/address/description, footer with phone/WhatsApp/address
- [ ] `src/style.css` contains `:root` block with all CSS custom properties (colours, spacing, typography) as defined in the design (bean khaiyran-c4dp)
- [ ] No raw hex colour values outside `:root` — all styles reference custom properties
- [ ] Header is `position: sticky` at top
- [ ] Page renders correctly with no JavaScript (static parts visible, dynamic mount points empty)
- [ ] 2-column grid CSS is defined (used by product grid component later)
- [ ] Horizontal-scroll chip bar CSS is defined (used by filter bar component later)
- [ ] Product card CSS is defined (used by product grid component later)
- [ ] Responsive: no horizontal overflow at 320px viewport width
- [ ] `npm run typecheck` passes with 0 errors
- [ ] `npm run lint` passes with 0 errors and 0 warnings
- [ ] `npm run build` exits 0

## Tests

- `packages/web/src/shell.test.ts` — `header contains business name` — asserts an element with text "KHYAIRAN" exists in the header
- `packages/web/src/shell.test.ts` — `header contains WhatsApp link` — asserts header has an anchor with href containing `wa.me/2348036917058`
- `packages/web/src/shell.test.ts` — `mount points exist for dynamic components` — asserts `#filter-bar` and `#product-grid` elements exist in the DOM
- `packages/web/src/shell.test.ts` — `footer contains phone number` — asserts footer contains `+234 803 691 7058`

## Agent Pre-Start Checkpoint

(Written by the pre-start reviewing agent — do not fill manually)

## Agent Post-Completion Review

(Written by the post-completion reviewing agent — do not fill manually)

## Agent Pre-Start Checkpoint

- Agent: claude-sonnet-4-6 (night shift)
- Date: 2026-04-23
- Verdict: APPROVED
- Checkpoints:
  - [x] `packages/web/index.html` exists — current Alpine scaffold to be replaced
  - [x] `packages/web/src/style.css` — new file, does not yet exist
  - [x] `packages/web/src/main.ts` exists — needs style.css import added
  - [x] All acceptance criteria are objectively testable (DOM queries, file checks, build pass)
  - [x] Tests section present and specific: 4 tests in shell.test.ts with exact assertions
  - [x] Colour system and layout defined in parent milestone khaiyran-c4dp body
