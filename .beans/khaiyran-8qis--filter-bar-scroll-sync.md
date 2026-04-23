---
# khaiyran-8qis
title: Filter bar + scroll sync
status: in-progress
type: task
priority: normal
tags:
    - web
created_at: 2026-04-23T00:12:15Z
updated_at: 2026-04-23T11:59:25Z
parent: khaiyran-c4dp
blocked_by:
    - khaiyran-75n2
---

# Filter bar + scroll sync

## Description

Build `components/filterBar.ts` — renders category chips into the `#filter-bar` mount point and syncs them with scroll position. Chips are "All" + one per published category. Tapping a chip smooth-scrolls to that category section (using the `id` attributes set by productGrid). An IntersectionObserver watches category headings and updates the active chip as the user scrolls manually. The active chip scrolls into view within the horizontal chip bar.

## Related Code

- `packages/web/src/components/filterBar.ts` — new file: `renderFilterBar()` function
- `packages/web/src/types.ts` — Tag interface (created in khaiyran-f3ia)
- `packages/web/src/style.css` — chip bar CSS (created in khaiyran-q7zk)
- `packages/web/index.html` — `<div id="filter-bar">` mount point (created in khaiyran-q7zk)
- `packages/web/src/components/productGrid.ts` — category sections with `id="category-{slug}"` (created in khaiyran-75n2)

## Acceptance Criteria

- [ ] `renderFilterBar()` accepts a list of category tags and renders chips into `#filter-bar`
- [ ] First chip is "All", followed by one chip per category in `sort_order`
- [ ] "All" chip is active by default
- [ ] Tapping a category chip smooth-scrolls the page to the corresponding `#category-{slug}` section
- [ ] Tapping "All" smooth-scrolls to the top of `#product-grid`
- [ ] Only one chip is active at a time — tapping a new chip deactivates the previous
- [ ] Active chip gets `--color-chip-active` background and `--color-chip-active-text` text colour
- [ ] When user scrolls manually, IntersectionObserver detects the topmost visible category heading and updates the active chip accordingly
- [ ] Active chip auto-scrolls into view within the horizontal chip bar (if overflowing)
- [ ] Filter bar is `position: sticky` below the header
- [ ] `npm run typecheck` passes with 0 errors
- [ ] `npm run lint` passes with 0 errors and 0 warnings
- [ ] `npm run build` exits 0

## Tests

- `packages/web/src/components/filterBar.test.ts` — `renders All chip plus one chip per category` — given 3 categories, asserts 4 chip elements rendered (All + 3)
- `packages/web/src/components/filterBar.test.ts` — `All chip is active by default` — asserts the All chip has the active CSS class on initial render
- `packages/web/src/components/filterBar.test.ts` — `tapping a chip sets it as active and deactivates others` — simulates click on second chip, asserts it gets active class and All chip loses it
- `packages/web/src/components/filterBar.test.ts` — `chips render in sort_order` — given categories with sort_order 2, 0, 1, asserts rendered order matches 0, 1, 2

## Agent Pre-Start Checkpoint

(Written by the pre-start reviewing agent — do not fill manually)

## Agent Post-Completion Review

(Written by the post-completion reviewing agent — do not fill manually)

## Agent Pre-Start Checkpoint

- Agent: claude-sonnet-4-6 (night shift)
- Date: 2026-04-23
- Verdict: APPROVED
- Checkpoints:
  - [x] `packages/web/src/types.ts` has Tag interface (khaiyran-f3ia complete)
  - [x] `packages/web/src/style.css` has .chip, .chip.active CSS (khaiyran-q7zk complete)
  - [x] `packages/web/index.html` has `<div id='filter-bar'>` (khaiyran-q7zk complete)
  - [x] `packages/web/src/components/productGrid.ts` sets id='category-{slug}' on sections (khaiyran-75n2 complete)
  - [x] All 4 tests have specific file, description, and assertion
  - [x] Note: IntersectionObserver unavailable in jsdom — component will check for availability, tests test only chip rendering and click behavior; main.ts orchestration wired as part of this bean (no separate bean exists for it)
