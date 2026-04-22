---
# khaiyran-l7m4
title: System architecture — moving parts and data flow
status: completed
type: milestone
priority: normal
tags:
    - architecture
created_at: 2026-04-22T23:32:59Z
updated_at: 2026-04-22T23:32:59Z
---

## System Flow

\`\`\`
┌─────────────────────────────────────────────────────────────────────────────┐
│                           KHYAIRAN — SYSTEM FLOW                            │
└─────────────────────────────────────────────────────────────────────────────┘

  USERS                    APPS                        SUPABASE (hosted)
  ─────                    ────                        ─────────────────

  Customer ──────────────► packages/web ──── SELECT ──► PostgREST API
  (phone browser)          Vite + TypeScript  (published  ├─ products
                           Cloudflare R2      products +  ├─ tags
                                              tags only)  └─ product_tags
                                    │
                                    └── GET images ─────► Storage (CDN)
                                                          └─ product-images/
                                                             (public bucket)

  Owner/Manager ─────────► packages/dashboard ─ auth ──► GoTrue
  (phone/desktop)          Vite + Alpine.js              └─ email+password
                           Cloudflare R2
                                    │
                                    ├── CRUD ───────────► PostgREST API
                                    │   (all rows,        ├─ products
                                    │    RLS role-gated)  ├─ tags
                                    │                     └─ product_tags
                                    │
                                    └── upload image ────► Storage
                                                          └─ product-images/
                                                               │
                                                               ▼
                                                          Edge Function
                                                          process-image
                                                          (WASM/Photon)
                                                          resize → WebP
                                                          overwrite original


  Dev/CI                   TOOLING
  ──────                   ───────

  git push ──────────────► GitHub Actions
                           ├─ npm run typecheck
                           ├─ npm run lint
                           ├─ npm run build
                           └─ deploy ──────────────────► Cloudflare R2
                                                         ├─ web/ (public)
                                                         └─ dashboard/ (gated)

  Local dev ─────────────► flox activate
                           ├─ deno        (Edge Function typecheck)
                           ├─ supabase-cli (db push, functions deploy)
                           ├─ shadowenv   (.shadowenv.d/ → env vars)
                           └─ node/vite   (npm run dev)
\`\`\`

## Key Design Decisions

- **Two separate apps** — web (public) and dashboard (internal), both on Cloudflare R2
- **web uses vanilla TypeScript** — no framework; interactivity is chip filtering + grid render only
- **dashboard uses Alpine.js** — justified by complex state: forms, bulk editing, reactive views
- **RLS is the auth boundary** — anon key on web sees only published rows; dashboard uses service role via Supabase auth session
- **Edge Function fires on upload** — process-image resizes + converts to WebP in place; dashboard shows result
- **No local Docker** — dev targets hosted Supabase directly via supabase-cli + shadowenv
