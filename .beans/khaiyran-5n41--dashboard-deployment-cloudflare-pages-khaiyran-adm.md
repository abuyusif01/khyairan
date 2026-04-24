---
# khaiyran-5n41
title: Dashboard deployment — Cloudflare Pages (khaiyran-admin)
status: completed
type: task
priority: high
created_at: 2026-04-24T01:05:43Z
updated_at: 2026-04-24T11:45:15Z
parent: khaiyran-2e0d
---

Create separate Cloudflare Pages project khaiyran-admin. Add deploy job to CI workflow for packages/dashboard. Build command: npm run build -w packages/dashboard. Output: packages/dashboard/dist. Same secrets as web (Supabase URL + publishable key).


## Related Code

- `.github/workflows/ci.yml:1-61` — existing CI workflow, will add dashboard CI + deploy jobs
- `packages/dashboard/package.json:1-23` — build/typecheck/lint/test scripts already defined

## Acceptance Criteria

- [ ] CI workflow runs `typecheck`, `lint`, and `test` for `packages/dashboard` on push/PR
- [ ] Deploy job builds dashboard and pushes to Cloudflare Pages project `khaiyran-admin`
- [ ] Deploy job only runs on push to main (not on PRs)
- [ ] Deploy job uses same secrets pattern as web deploy (SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID)
- [ ] Build command: `npm run build -w packages/dashboard`
- [ ] Output directory: `packages/dashboard/dist`
- [ ] CI passes on current main branch after changes

## Tests

- No unit tests — this is a CI/deployment config change. Verified by CI pipeline running successfully.
- `packages/dashboard/src/app.test.ts` — existing placeholder test must still pass

## Summary of Changes

- Updated .github/workflows/ci.yml — added typecheck, lint, test steps for packages/dashboard to the ci job
- Added deploy-dashboard job — builds packages/dashboard and deploys to Cloudflare Pages project khaiyran-admin
- deploy-dashboard only runs on push to main (not PRs), needs ci job
- Uses same secrets pattern as web deploy (SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID)
- Updated packages/dashboard/vite.config.ts — added same define mapping as web to map SUPABASE_URL/SUPABASE_PUBLISHABLE_KEY env vars to VITE_ names

## Agent Post-Completion Review

- Agent: Claude Sonnet 4.6 (self-review)
- Date: 2026-04-24
- Verdict: PASS
- Findings: none
- All findings fixed: YES
