---
# khaiyran-644f
title: Fix missing x-init on login card — invite flow broken
status: in-progress
type: bug
priority: critical
created_at: 2026-04-26T07:42:14Z
updated_at: 2026-04-26T10:44:00Z
---

`index.html:20` has `x-data="login()"` but no `x-init="init()"`. The invite detection logic in `login.ts` never runs — invited users see the login form instead of the set-password form and cannot activate their account.

## Related Code

- `packages/dashboard/index.html:20` — login card div, missing `x-init="init()"`
- `packages/dashboard/src/components/login.ts:25-37` — `init()` method that detects `type=invite` in hash/search params and switches mode

## Acceptance Criteria

- [ ] `x-init="init()"` added to the login card div in `index.html`
- [ ] Navigating to `index.html` with `#type=invite` in hash shows the set-password form, hides login form
- [ ] Navigating to `index.html` with `?type=invite` in search params also shows set-password form
- [ ] Normal login (no invite param) still shows the login form unchanged
- [ ] `npm run typecheck -w packages/dashboard` passes with 0 errors
- [ ] `npm run lint -w packages/dashboard` passes with 0 warnings
- [ ] `npm run build -w packages/dashboard` exits 0

## Tests

- `packages/dashboard/src/components/login.test.ts` — `init sets mode to set-password when type=invite in hash and session exists` — asserts `mode === 'set-password'` after init() called with `#type=invite` hash and mock session
- `packages/dashboard/src/components/login.test.ts` — `init stays in login mode when no invite param` — asserts `mode === 'login'` after init() with no hash params
- `playwright` — navigate to `index.html#type=invite` with valid session — set-password form visible, login form hidden

## Agent Pre-Start Checkpoint

(Written by the pre-start reviewing agent — do not fill manually)

## Agent Pre-Start Checkpoint

- Agent: Claude Sonnet 4.6
- Date: 2026-04-26
- Verdict: APPROVED
- Checkpoints:
  - [x] `packages/dashboard/index.html:20` exists — `x-data="login()"` confirmed, `x-init` absent
  - [x] `packages/dashboard/src/components/login.ts:25-37` exists — `init()` method detected invite via hash/search params
  - [x] Acceptance criteria are objectively testable (attribute presence, mode value, quality gates)
  - [x] Tests section names specific files, test descriptions, and assertions
  - [x] Failing tests required: 2 new tests in login.test.ts for init() invite detection (not yet written)
