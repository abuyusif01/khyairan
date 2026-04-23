---
# khaiyran-9zx7
title: WhatsApp integration
status: in-progress
type: task
priority: normal
tags:
    - web
created_at: 2026-04-23T00:12:18Z
updated_at: 2026-04-23T11:56:00Z
parent: khaiyran-c4dp
blocked_by:
    - khaiyran-q7zk
---

# WhatsApp integration

## Description

Add all WhatsApp touchpoints to the public site. Three elements: (1) floating green button in bottom-right corner, always visible, opens a generic order message; (2) per-product-card WhatsApp icon/link that pre-fills a message with the specific product name, size, and pack info; (3) header WhatsApp button (already in the HTML shell from khaiyran-q7zk, wire up the link). All use `https://wa.me/2348036917058?text=...` deep links with URL-encoded pre-filled messages.

## Related Code

- `packages/web/src/components/productGrid.ts` — add WhatsApp icon/link to each product card (modify, created in khaiyran-75n2)
- `packages/web/index.html` — add floating WhatsApp button element, ensure header WhatsApp link has correct href (modify, created in khaiyran-q7zk)
- `packages/web/src/style.css` — add floating button styles: fixed position, bottom-right, green circle, z-index above content (modify, created in khaiyran-q7zk)

## Acceptance Criteria

- [ ] Floating WhatsApp button is `position: fixed`, bottom-right corner, circular, uses `--color-cta` green
- [ ] Floating button links to `https://wa.me/2348036917058?text=Hi%2C%20I'd%20like%20to%20place%20an%20order` (or similar URL-encoded generic message)
- [ ] Floating button is visible on all scroll positions (z-index above content)
- [ ] Each product card has a WhatsApp icon/link
- [ ] Per-card link pre-fills message with product details, e.g. `Hi, I'm interested in Coca-Cola 35CL (12 bottles/carton)`
- [ ] Header WhatsApp link uses same generic message as floating button
- [ ] All WhatsApp links open in new tab (`target="_blank"`, `rel="noopener noreferrer"`)
- [ ] `npm run typecheck` passes with 0 errors
- [ ] `npm run lint` passes with 0 errors and 0 warnings
- [ ] `npm run build` exits 0

## Tests

- `packages/web/src/components/whatsapp.test.ts` — `buildWhatsAppUrl generates correct URL for product` — given product name "Coca-Cola", size "35CL", units_per_carton 12, asserts URL contains `wa.me/2348036917058` and URL-encoded message with all product details
- `packages/web/src/components/whatsapp.test.ts` — `buildWhatsAppUrl generates generic URL when no product given` — asserts URL contains generic order message
- `packages/web/src/components/whatsapp.test.ts` — `floating button renders with correct link` — asserts the floating button element has an anchor with the generic WhatsApp URL and `target="_blank"`

## Agent Pre-Start Checkpoint

(Written by the pre-start reviewing agent — do not fill manually)

## Agent Post-Completion Review

(Written by the post-completion reviewing agent — do not fill manually)

## Agent Pre-Start Checkpoint

- Agent: claude-sonnet-4-6 (night shift)
- Date: 2026-04-23
- Verdict: APPROVED
- Checkpoints:
  - [x] `packages/web/index.html` already has .fab-whatsapp floating button with correct wa.me link and .btn-whatsapp header link (khaiyran-q7zk complete)
  - [x] `packages/web/src/style.css` already has .fab-whatsapp styles: position:fixed, bottom-right, green circle (khaiyran-q7zk complete)
  - [x] `packages/web/src/components/productGrid.ts` exists (khaiyran-75n2 complete) — needs WhatsApp icon added to each card
  - [x] 3 tests in whatsapp.test.ts with specific assertions — buildWhatsAppUrl product URL, generic URL, floating button
  - [x] All acceptance criteria objectively verifiable
  - [x] Note: floating button and header link already implemented; primary work is buildWhatsAppUrl helper and per-card links
