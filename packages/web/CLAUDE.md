# CLAUDE.md — Public Website

Package-specific architecture for the Khyairan Soft Drinks customer-facing site.

---

## Purpose

Single-page mobile-first website for retail and bulk customers. Browse products, see prices, tap WhatsApp to order.

---

## Stack

- Vite + TypeScript
- Alpine.js for interactivity (filtering, state)
- Supabase JS client for data fetching

---

## Design Principles

- **Mobile first** — primary audience is on phones, possibly slow data
- **Single page** — no navigation between pages, one continuous scroll
- **Under 200KB** page weight (excluding product images)
- **Works on 3G** within 3 seconds
- **Product images lazy-loaded** and served as compressed WebP from Supabase Storage

---

## Layout (top to bottom, single scroll)

1. **Header** — logo, business name, WhatsApp button. Sticky.
2. **Filter bar** — sticky below header. Two modes toggled by a "Categories / Brands" switch:
   - **Categories mode** (default): "All" chip (selected by default) + one chip per published category. Tap to filter.
   - **Brands mode**: "All" chip + one chip per published brand.
   - Only one chip active at a time. "All" shows everything.
   - Chips scroll horizontally if they overflow.
3. **Product grid** — 2 columns on mobile. Card: image, name, size, units per carton, price (NGN). Filtered by active chip.
4. **About strip** — shop name, address, what we do. 3-4 lines.
5. **Footer** — phone, address, WhatsApp link.

---

## Data

- Fetches only `published = true` products and tags from Supabase
- Single price displayed: NGN per carton
- No USD on public site — export pricing handled separately
- Products filtered client-side via Alpine.js (dataset is small enough, ~50-100 products)
- Products ordered by `product_tags.sort_order` within the active tag filter

---

## Brand

- Navy + gold colour scheme (matches existing catalog)
- Clean typography
- No clutter

---

## What is NOT on this site

- No e-commerce / cart / checkout
- No user accounts / login
- No search (filter chips are enough for ~50-100 products)
- No hero banner (wastes mobile viewport, pushes products down)
- No map embed (heavy, eats data — text address with Google Maps link instead)
- No separate pages (about, contact, etc.)
