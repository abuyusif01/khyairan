# CLAUDE.md — Admin Dashboard

Package-specific architecture for the Khyairan Soft Drinks admin panel.

---

## Purpose

Internal dashboard for managing products, categories, brands, pricing, and images. Used by the shop team (4+ people), not customers.

---

## Stack

- Vite + TypeScript
- Alpine.js for UI
- Supabase JS client for data + auth

---

## Users

- Owner (Abu) — full control, manages other users
- Managers — add/edit products, update prices, upload images

No viewer role — public visitors use the website, not the dashboard.

Auth: Supabase email + password. No public signup. Owner invites users.

---

## Features

### Product management (owner, manager)
- List all products (with search/filter by tag)
- Add new product: name, size, unit type (dropdown), units per carton, price, image upload, tags
- Edit existing product
- Delete product (owner only, with confirmation)
- Toggle published/draft (blocked if no image uploaded)
- Reorder products within a tag (updates `product_tags.sort_order`)
- Edit metadata and internal notes
- **Bulk price update view** — spreadsheet-style table of all products showing name, size, current price. Edit prices inline, save all changes at once. Essential when prices change across the board.

### Tag management (owner, manager)
- List tags grouped by type (category, brand, etc.)
- Add new tag with type (dropdown of existing types, owner can type a new type)
- Edit tag name/type/slug
- Delete tag (owner only, with confirmation — warn if products are attached)
- Toggle published/draft
- Reorder tags within a type

### User management (owner only)
- List users with roles
- Invite new user (creates Supabase auth account)
- Change user role
- Remove user

### Image upload
- Accept any image from phone camera
- Dashboard sends to Supabase Storage
- Edge Function compresses/resizes automatically
- Preview shown after processing

---

## Design Principles

- Simple, functional — not pretty for the sake of pretty
- Works on mobile (managers may update from their phones)
- Destructive actions (delete) require confirmation
- Published/draft toggle is prominent — easy to see what's live
- Bulk operations where repetitive single-item edits would be painful
