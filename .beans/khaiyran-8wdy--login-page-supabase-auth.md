---
# khaiyran-8wdy
title: Login page + Supabase auth
status: completed
type: task
priority: high
created_at: 2026-04-24T01:05:43Z
updated_at: 2026-04-24T11:41:38Z
parent: khaiyran-2e0d
---

Email+password login form using Supabase Auth. No signup — owner creates accounts separately. On success, redirect to dashboard home. On failure, show error. Alpine.js component.


## Related Code

- `packages/dashboard/index.html:1-17` — current bare scaffold, will add login page route
- `packages/dashboard/src/main.ts:1-5` — Alpine init, will register login component
- `packages/dashboard/src/env.d.ts:1-7` — type declarations, will add Vite env vars for Supabase
- `packages/web/src/lib/supabase.ts:1-7` — reference for Supabase client pattern (new file needed at `packages/dashboard/src/lib/supabase.ts`)
- New: `packages/dashboard/src/components/login.ts` — login form Alpine.js component
- New: `packages/dashboard/src/lib/supabase.ts` — Supabase client initialisation for dashboard

## Acceptance Criteria

- [ ] Login form renders email and password fields
- [ ] Submitting valid credentials calls `supabase.auth.signInWithPassword`
- [ ] Failed login shows an error message (not a generic "something went wrong")
- [ ] Successful login redirects to dashboard home (index or `/`)
- [ ] No signup link or form — login only
- [ ] `npm run typecheck -w packages/dashboard` passes with 0 errors
- [ ] `npm run lint -w packages/dashboard` passes with 0 warnings
- [ ] `npm run build -w packages/dashboard` exits 0

## Tests

- `packages/dashboard/src/components/login.test.ts` — `renders email and password inputs` — asserts both input fields exist in DOM with correct types
- `packages/dashboard/src/components/login.test.ts` — `shows error message on failed login` — mocks supabase.auth.signInWithPassword to reject, asserts error text appears
- `packages/dashboard/src/components/login.test.ts` — `calls signInWithPassword with form values` — fills inputs, submits, asserts supabase called with correct email/password
- `packages/dashboard/src/lib/supabase.test.ts` — `creates Supabase client with env vars` — asserts createClient called with VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY

## Agent Pre-Start Checkpoint

- Agent: Claude Sonnet 4.6
- Date: 2026-04-24
- Verdict: APPROVED
- Checkpoints:
  - [x] packages/dashboard/index.html:1-17 exists and matches spec description
  - [x] packages/dashboard/src/main.ts:1-5 exists with Alpine init
  - [x] packages/dashboard/src/env.d.ts:1-7 exists
  - [x] packages/web/src/lib/supabase.ts exists as reference pattern
  - [x] All Acceptance Criteria are objectively testable
  - [x] Tests section has 4 entries, each with file/description/assertion
  - [x] New file directories can be created without conflict

## Summary of Changes

- Created packages/dashboard/src/lib/supabase.ts — Supabase client using VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY
- Created packages/dashboard/src/components/login.ts — Alpine.js loginComponent() factory with email/password fields, signInWithPassword call, error display, success redirect
- Updated packages/dashboard/index.html — login form with Alpine x-data binding, email/password inputs, error paragraph
- Updated packages/dashboard/src/main.ts — registers loginComponent with Alpine.data('login', ...)
- Updated packages/dashboard/src/env.d.ts — added ImportMetaEnv type declarations for Vite env vars
- Updated packages/dashboard/src/app.test.ts — added supabase mock so existing test still passes

## Agent Post-Completion Review

- Agent: Claude Sonnet 4.6
- Date: 2026-04-24
- Verdict: PASS
- Findings: none
- All findings fixed: YES
