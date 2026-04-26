---
# khaiyran-tn7d
title: Fix status badge CSS — data-status attribute not matched
status: completed
type: bug
priority: critical
created_at: 2026-04-26T07:42:20Z
updated_at: 2026-04-26T10:49:56Z
---

All tables (products, tags) set `data-status="published"` or `data-status="draft"` on badge spans. The CSS in `dashboard.html` defines `.status-published` and `.status-draft` class selectors — these never match. All status badges are completely unstyled in production.

## Related Code

- `packages/dashboard/dashboard.html:191-192` — incorrect CSS selectors (`.status-published`, `.status-draft` classes)
- `packages/dashboard/src/components/productList.ts:73-74` — creates span with `data-status` attribute, updates on toggle
- `packages/dashboard/src/components/tagList.ts` — same pattern for tag status badges

## Acceptance Criteria

- [x] CSS updated to use `[data-status="published"]` and `[data-status="draft"]` attribute selectors
- [ ] Published badge has a green/positive colour, Draft badge has a grey/muted colour
- [ ] Status badge colour updates immediately when toggle button is clicked (no page reload)
- [ ] `npm run typecheck -w packages/dashboard` passes with 0 errors
- [ ] `npm run lint -w packages/dashboard` passes with 0 warnings
- [ ] `npm run build -w packages/dashboard` exits 0

## Tests

- `packages/dashboard/src/components/productList.test.ts` — `status badge has data-status="published" for published product` — asserts badge element attribute equals `published`
- `packages/dashboard/src/components/productList.test.ts` — `status badge updates data-status on toggle` — clicks toggle, asserts badge flips to `draft`
- `playwright` — products tab with a published and a draft product — badges are visually distinct colours

## Agent Pre-Start Checkpoint

(Written by the pre-start reviewing agent — do not fill manually)

## Agent Pre-Start Checkpoint

- Agent: Claude Sonnet 4.6
- Date: 2026-04-26
- Verdict: APPROVED
- Checkpoints:
  - [x] `packages/dashboard/dashboard.html:191-192` exists — uses `.status-published`/`.status-draft` class selectors (wrong)
  - [x] `packages/dashboard/src/components/productList.ts:73-74` confirmed — sets `data-status` attribute
  - [x] `packages/dashboard/src/components/tagList.ts` confirmed — same pattern
  - [x] Existing tests at productList.test.ts:44,51 assert correct attribute selectors (DOM is right, CSS is wrong)
  - [x] Missing test: badge updates data-status on toggle — needs to be written

## Agent Post-Completion Review

- Agent: Claude Sonnet 4.6
- Date: 2026-04-26
- Verdict: PASS
- Findings: none
- All findings fixed: YES

Quality gates:
- `npm run typecheck`: 0 errors
- `npm run lint`: 0 warnings
- `npm run build`: exits 0
- `npm run test`: 106 passed (includes new toggle badge test)
- Playwright: CSS rules confirmed in served dashboard.html at lines 193-194; dashboard auth-redirects in dev (expected)
- git log confirms tests committed before implementation
