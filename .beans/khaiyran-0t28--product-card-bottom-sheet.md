---
# khaiyran-0t28
title: Product card bottom sheet
status: in-progress
type: feature
priority: high
created_at: 2026-04-23T12:33:06Z
updated_at: 2026-04-23T12:36:19Z
---

# Product card bottom sheet

## Description

When a user taps a product card, a bottom sheet slides up from the bottom of the screen showing the full product details (larger image, name, size, unit type, units per carton, price) and a full-width green 'Order on WhatsApp' button. Tapping the dimmed backdrop or pressing ESC dismisses the sheet. WhatsApp link opens in the same window (no `target="_blank"`) so pressing back returns to the catalog. Replaces the current whole-card-as-link approach which caused accidental taps and had no easy way back.

## Related Code

- `packages/web/src/components/bottomSheet.ts` — new file: `showBottomSheet(product, imageBaseUrl)` and `hideBottomSheet()`
- `packages/web/src/components/productGrid.ts` — card becomes a `div` with click handler calling `showBottomSheet`
- `packages/web/src/style.css` — bottom sheet overlay, panel, slide-up transition, backdrop

## Acceptance Criteria

- [ ] Tapping a product card opens a bottom sheet with product image, name, size, unit type, units per carton, price
- [ ] Sheet slides up from bottom with CSS transition
- [ ] Backdrop behind sheet is dimmed
- [ ] Tapping backdrop dismisses sheet
- [ ] ESC key dismisses sheet
- [ ] 'Order on WhatsApp' button is full-width green, opens `wa.me` in same window (no `target="_blank"`)
- [ ] Card is no longer a link — no accidental WhatsApp opens from scrolling
- [ ] `npm run typecheck` passes with 0 errors
- [ ] `npm run lint` passes with 0 errors and 0 warnings
- [ ] `npm run build` exits 0

## Tests

- `packages/web/src/components/bottomSheet.test.ts` — `showBottomSheet renders product name and price` — given a product, asserts name and formatted price appear in the sheet DOM
- `packages/web/src/components/bottomSheet.test.ts` — `Order button has correct WhatsApp href` — asserts the button href contains `wa.me/2348036917058` and the product name
- `packages/web/src/components/bottomSheet.test.ts` — `backdrop click hides the sheet` — simulates click on backdrop element, asserts sheet is hidden
- `packages/web/src/components/bottomSheet.test.ts` — `ESC key hides the sheet` — dispatches keydown ESC event, asserts sheet is hidden
- `packages/web/src/components/bottomSheet.test.ts` — `showBottomSheet twice reuses same element` — calls show twice, asserts only one sheet element exists in the DOM
- `packages/web/src/components/productGrid.test.ts` — `product card is a div not a link` — asserts querySelector('div.product-card') is truthy and querySelector('a.product-card') is null
- `packages/web/src/components/productGrid.test.ts` — `card click invokes showBottomSheet with product` — mocks showBottomSheet, simulates click on card, asserts mock called with correct product object
- NOTE: existing test `product card links to WhatsApp with product details` (productGrid.test.ts:60-67) must be deleted in the failing-tests commit as it asserts old `<a>` card behaviour that is being removed

## Agent Pre-Start Checkpoint

(Written by the pre-start reviewing agent — do not fill manually)

## Agent Post-Completion Review

(Written by the post-completion reviewing agent — do not fill manually)

## Agent Pre-Start Checkpoint

- Agent: Claude Sonnet 4.6
- Date: 2026-04-23
- Verdict: APPROVED (after revision)
- Checkpoints:
  - [x] productGrid.ts exists, card is current a-element (lines 29-33)
  - [x] whatsapp.ts exists, buildWhatsAppUrl confirmed
  - [x] types.ts Product interface has all required fields
  - [x] style.css exists
  - [x] bottomSheet.ts does not exist yet (correct)
  - [x] All 5 bottomSheet.test.ts entries well-formed
  - [x] All acceptance criteria objectively verifiable
  - [x] Tests section updated with productGrid.test.ts coverage
