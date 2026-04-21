---
# khaiyran-ui3c
title: Project scaffolding — monorepo, Supabase, Vite
status: todo
type: task
priority: high
tags:
    - supabase
    - setup
created_at: 2026-04-21T13:49:53Z
updated_at: 2026-04-21T13:52:27Z
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
