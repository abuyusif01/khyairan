---
# khaiyran-5n41
title: Dashboard deployment — Cloudflare Pages (khaiyran-admin)
status: in-progress
type: task
priority: high
created_at: 2026-04-24T01:05:43Z
updated_at: 2026-04-24T11:44:06Z
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
