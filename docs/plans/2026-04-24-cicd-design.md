# CI/CD Design — GitHub Actions + Cloudflare Pages

## Decision

Option B: GitHub Actions for CI gates + Cloudflare Pages for deployment.

## Triggers

- Push to `main` — run CI, then deploy if CI passes
- PR targeting `main` — run CI only, no deploy

## Jobs

### `ci`
Runs on every push and PR. Scoped to `packages/web` only (dashboard not yet shipping).

1. Checkout
2. Setup Node 20 with npm cache
3. `npm ci`
4. `npm run typecheck -w packages/web`
5. `npm run lint -w packages/web`
6. `npm run test -w packages/web`

### `deploy`
Runs on push to `main` only, needs `ci` to pass.

1. Checkout
2. Setup Node 20 with npm cache
3. `npm ci`
4. `npm run build -w packages/web` (env: SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
5. Deploy `packages/web/dist` to Cloudflare Pages project `khaiyran`

## GitHub Secrets

| Secret | Purpose |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Pages deploy permission |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account |
| `SUPABASE_URL` | Baked into bundle at build time |
| `SUPABASE_PUBLISHABLE_KEY` | Baked into bundle at build time |

## Hosting

- Platform: Cloudflare Pages (free tier)
- Project name: `khaiyran`
- Output dir: `packages/web/dist`
- Custom domain: TBD
