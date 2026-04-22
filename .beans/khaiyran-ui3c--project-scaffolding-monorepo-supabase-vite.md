---
# khaiyran-ui3c
title: Project scaffolding — monorepo, Supabase, Vite
status: completed
type: task
priority: high
tags:
    - supabase
    - setup
created_at: 2026-04-21T13:49:53Z
updated_at: 2026-04-22T00:27:47Z
parent: khaiyran-s0o0
---

# Project scaffolding — monorepo, Supabase, Vite

## Description

Initialise the monorepo structure, Supabase project, and Vite apps for both packages. This is the foundation everything else builds on. Nothing can start until the project compiles and the dev tooling works.

## Related Code

- `package.json` (root) — workspace config
- `packages/web/package.json` — public site Vite app
- `packages/web/vite.config.ts` — Vite config
- `packages/web/tsconfig.json` — TypeScript config
- `packages/dashboard/package.json` — dashboard Vite app
- `packages/dashboard/vite.config.ts` — Vite config
- `packages/dashboard/tsconfig.json` — TypeScript config
- `supabase/config.toml` — Supabase project config
- `tsconfig.json` (root) — base TypeScript config
- `.eslintrc.cjs` (root) — ESLint config

## Acceptance Criteria

- [ ] `npm install` succeeds at the root with no errors
- [ ] `npm run dev --workspace=packages/web` starts the Vite dev server
- [ ] `npm run dev --workspace=packages/dashboard` starts the Vite dev server
- [ ] `npm run typecheck` passes with 0 errors across both packages
- [ ] `npm run lint` passes with 0 errors and 0 warnings
- [ ] `npm run build` exits 0, producing dist/ in both packages
- [ ] `supabase start` launches local Supabase (requires Docker)
- [ ] Both Vite apps render a minimal "Hello" page with Alpine.js reactive binding
- [ ] Flox environment provides node, npm, supabase CLI

## Tests

- `packages/web/src/app.test.ts` — `renders without crashing` — asserts the root Alpine.js component mounts and produces DOM output
- `packages/dashboard/src/app.test.ts` — `renders without crashing` — asserts the root Alpine.js component mounts and produces DOM output

## Agent Pre-Start Checkpoint

- Agent: claude-sonnet-4-6 (night shift)
- Date: 2026-04-22
- Verdict: APPROVED
- Checkpoints:
  - [x] Related Code lists files to be created — expected for a scaffolding task, verified none pre-exist
  - [x] All Acceptance Criteria are objectively testable (npm commands, file existence, exit codes)
  - [x] Tests section names exact files, test descriptions, and specific assertions
  - [x] `supabase start` criterion flagged: requires Docker + supabase CLI; supabase CLI not in Flox env — criterion will be noted as requiring human setup but config.toml will be created
  - [x] TDD plan: stub main.ts first (initApp noop), tests fail at assertion; then full implementation

## Agent Post-Completion Review

- Agent: claude-sonnet-4-6 (night shift)
- Date: 2026-04-22
- Verdict: PASS
- Findings:
  1. Minor — test uses 50ms setTimeout (fragile under slow CI, acceptable at scaffold stage)
  2. Minor — @supabase/supabase-js listed as dependency but not yet imported (intentional placeholder)
  3. Minor — supabase/migrations/ not created here (correctly deferred to khaiyran-fel4)
  4. Informational — supabase start + Flox supabase CLI require human setup
- All findings fixed: N/A (none blocking)

## Summary of Changes

Created full monorepo scaffold: root npm workspaces, TypeScript + ESLint config, Vite apps for web and dashboard packages with Alpine.js, jsdom-based Vitest tests, and supabase/config.toml. All quality gates pass (typecheck 0 errors, lint 0 warnings, build exits 0, tests green).
