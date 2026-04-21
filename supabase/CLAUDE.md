# CLAUDE.md — Supabase (Database, Auth, Storage)

Package-specific architecture for the Khyairan Soft Drinks backend.

---

## Schema

### Enums

- **`unit_type`** — `bottle`, `can`, `pack`, `cup`, `pouch`
- **`user_role`** — `owner`, `manager`

### products

| Column           | Type        | Required | Default | Notes                                          |
| ---------------- | ----------- | -------- | ------- | ---------------------------------------------- |
| id               | uuid        | yes      | gen     | Primary key                                    |
| name             | text        | yes      |         | Brand/product name (no size)                   |
| size             | text        | yes      |         | e.g. 35CL, 1LTR, 90ML                         |
| unit_type        | unit_type   | yes      |         | Enum: bottle, can, pack, cup, pouch            |
| units_per_carton | integer     | yes      |         | e.g. 12, 24, 30                                |
| price_ngn        | numeric     | yes      |         | Per carton, naira (supports kobo)              |
| image_path       | text        | no       |         | Path in Supabase Storage. Nullable — required to publish, not to create as draft |
| published        | boolean     | yes      | false   | Draft vs live. Cannot be true if image_path is null |
| metadata         | jsonb       | no       | '{}'    | Structured internal data                       |
| internal_notes   | text        | no       |         | Free-text, never shown publicly                |
| created_at       | timestamptz | yes      | now()   | Auto                                           |
| updated_at       | timestamptz | yes      | now()   | Auto, updated via trigger                      |

**Constraint:** `CHECK (published = false OR image_path IS NOT NULL)` — can't publish without an image.

### tags

| Column     | Type        | Required | Default | Notes                                              |
| ---------- | ----------- | -------- | ------- | -------------------------------------------------- |
| id         | uuid        | yes      | gen     | Primary key                                        |
| name       | text        | yes      |         | Display name                                       |
| slug       | text        | yes      |         | URL-friendly, unique (e.g. `carbonated-drinks`)    |
| type       | text        | yes      |         | Free text but dashboard suggests existing types. Starting values: `category`, `brand` |
| sort_order | integer     | yes      | 0       | Controls display order within its type             |
| published  | boolean     | yes      | false   | Hide without deleting                              |
| created_at | timestamptz | yes      | now()   | Auto                                               |
| updated_at | timestamptz | yes      | now()   | Auto, updated via trigger                          |

**Why `type` is not an enum:** Adding a new tag type (e.g. `season`, `promo`) shouldn't require a database migration. The dashboard UI shows a dropdown of existing distinct types, with owner able to type a new one.

**Unique constraint:** `(slug)` — no duplicate slugs.

### product_tags (join table)

| Column     | Type    | Notes                                         |
| ---------- | ------- | --------------------------------------------- |
| product_id | uuid    | FK → products.id, ON DELETE CASCADE           |
| tag_id     | uuid    | FK → tags.id, ON DELETE CASCADE               |
| sort_order | integer | Display order of this product within this tag. Default 0 |
| PRIMARY KEY | (product_id, tag_id) |                                  |

**Sort order lives here**, not on products. A product can be position 1 in "Carbonated" but position 5 in "Coca-Cola" brand.

### profiles

| Column     | Type        | Required | Default | Notes                          |
| ---------- | ----------- | -------- | ------- | ------------------------------ |
| id         | uuid        | yes      |         | Matches Supabase auth.users.id |
| full_name  | text        | yes      |         |                                |
| role       | user_role   | yes      |         | Enum: owner, manager           |
| created_at | timestamptz | yes      | now()   | Auto                           |
| updated_at | timestamptz | yes      | now()   | Auto, updated via trigger      |

---

## Auth

- Supabase Auth with email + password
- No public signup — owner creates accounts via dashboard
- Two roles: `owner`, `manager`
- Role stored in `profiles.role`, enforced via RLS
- No viewer role — public visitors use the website, not the dashboard

### Role permissions

| Action                    | owner | manager |
| ------------------------- | ----- | ------- |
| View products/tags        | yes   | yes     |
| Add/edit products/tags    | yes   | yes     |
| Delete products/tags      | yes   | no      |
| Upload images             | yes   | yes     |
| Invite/remove users       | yes   | no      |
| View metadata/notes       | yes   | yes     |

### RLS policies

- Public site: `SELECT` on products and tags where `published = true`. No auth required.
- Dashboard: all operations gated by role via `profiles.role` lookup on `auth.uid()`.

---

## Storage

- Bucket: `product-images`
- On upload: compress and resize via Edge Function (accept whatever phone camera gives, output consistent quality)
- Public read access for published product images
- Write access: `owner` and `manager` roles only

---

## Edge Functions

- `process-image` — triggered on upload to `product-images` bucket. Compresses, resizes to consistent dimensions, converts to WebP. Overwrites original.

---

## Migrations

All schema changes live in `supabase/migrations/` as numbered SQL files. Never modify the database by hand.
