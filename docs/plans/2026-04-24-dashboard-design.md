# Admin Dashboard — Design Plan

## Decision

Internal dashboard for the Khyairan Soft Drinks shop team to manage products, prices, tags, images, and users. Separate Cloudflare Pages project (khaiyran-admin).

## Stack

- Vite + TypeScript + Alpine.js + Supabase JS client
- Alpine.js for UI (form-heavy internal tool — good fit)
- Supabase Auth (email+password, no public signup)

## Milestone Structure

```
khaiyran-82f0: Admin Dashboard (milestone)
├── khaiyran-2e0d: Foundation — auth, shell, deployment (epic, high)
│   ├── khaiyran-k5q4: RLS policies for dashboard (task, critical)
│   ├── khaiyran-8wdy: Login page + Supabase auth (task, high)
│   ├── khaiyran-tf04: Session guard (task, high) ← blocked by login
│   ├── khaiyran-2qtx: Dashboard layout shell (task, high)
│   └── khaiyran-5n41: Dashboard deployment (task, high)
│
├── khaiyran-md1g: Product Management (epic, normal)
│   ├── khaiyran-d1rl: Product list with search/filter (feature) ← blocked by RLS + session guard
│   ├── khaiyran-tn8z: Add new product (feature) ← blocked by product list
│   ├── khaiyran-47w9: Edit product (feature) ← blocked by product list
│   ├── khaiyran-3nzh: Delete product, owner only (feature, low)
│   ├── khaiyran-hdf2: Reorder products within tag (feature, deferred)
│   └── khaiyran-nirz: Edit metadata & internal notes (feature, deferred)
│
├── khaiyran-w82t: Bulk Price Update (epic, high)
│   └── khaiyran-58st: Inline price editor (feature, high) ← blocked by product list
│
├── khaiyran-niiz: Image Management (epic, normal)
│   ├── khaiyran-rst2: Image upload (feature) ← blocked by edit product
│   └── khaiyran-vru3: Image preview (feature) ← blocked by image upload
│
├── khaiyran-tvmy: Tag Management (epic, low)
│   ├── khaiyran-abey: List tags grouped by type
│   ├── khaiyran-rigv: Add/edit tag
│   ├── khaiyran-znec: Delete tag, owner only
│   ├── khaiyran-8uvb: Reorder tags within type (deferred)
│   └── khaiyran-nc5v: Toggle tag published/draft
│
└── khaiyran-dpph: User Management (epic, deferred)
    ├── khaiyran-885a: List users with roles
    ├── khaiyran-k1s8: Invite new user
    ├── khaiyran-xper: Change user role
    └── khaiyran-b3ic: Remove user
```

## Implementation Order

1. RLS policies (critical — nothing works without them)
2. Login page + session guard
3. Dashboard layout shell
4. Product list
5. Bulk price editor
6. Edit product + publish toggle
7. Dashboard deployment
8. Everything else by priority

## Deployment

- Separate Cloudflare Pages project: `khaiyran-admin`
- Own deploy job in `.github/workflows/ci.yml`
- Build: `npm run build -w packages/dashboard`
- Output: `packages/dashboard/dist`
